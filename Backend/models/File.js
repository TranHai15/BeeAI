import XLSX from "xlsx";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDatabase from "../db.js";
import axios from "axios";
import FormData from "form-data";

// Convert import.meta.url to a filesystem path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class fileModel {
  constructor() {
    this.connection = null;
  }

  // Kết nối với cơ sở dữ liệu khi tạo đối tượng User
  async connect() {
    if (!this.connection) {
      this.connection = await connectDatabase();
      console.log("Database connected");
    }
  }

  // Đóng kết nối với cơ sở dữ liệu
  async closeConnection() {
    if (this.connection) {
      await this.connection.end();
      this.connection = null;
      console.log("Database connection closed");
    }
  }
  // Thêm file vào cơ sở dữ liệu
  static async insertFileDatabase(fileName, filePath, fileType) {
    const user = new fileModel();
    await user.connect();
    const insertQuery = `
      INSERT INTO file_uploads (file_name, file_path, file_type)
      VALUES (?, ?, ?)
    `;
    try {
      const [result] = await user.connection.execute(insertQuery, [
        fileName,
        filePath,
        fileType,
      ]);
      console.log("Thêm file gốc thành công:", result.insertId);
      return result.insertId; // Trả về ID của file đã thêm vào database
    } catch (error) {
      console.error("Lỗi khi thêm file vào database:", error);
      throw error;
    }
  }

  // Xử lý file và chuyển đổi sang PDF
  static async processFilesAndConvertPDF(files) {
    let txtFiles = [];
    let xlsxFiles = [];

    // Phân loại file vào các mảng tương ứng (txt và xlsx)
    files.forEach((file) => {
      const fileExt = path.extname(file.filename).toLowerCase();
      if (fileExt === ".txt") {
        txtFiles.push(file);
      } else if (fileExt === ".xlsx") {
        xlsxFiles.push(file);
      }
    });

    // Kiểm tra nếu có file .xlsx thì mới xử lý
    if (xlsxFiles.length > 0) {
      for (const file of xlsxFiles) {
        const filePath = path.join(__dirname, "../uploads", file.filename);
        const fileExt = path.extname(file.filename).toLowerCase();

        await fileModel.insertFileDatabase(file.filename, filePath, fileExt);

        if (fileExt === ".xlsx") {
          const workbook = XLSX.readFile(filePath);
          const sheetNames = workbook.SheetNames;

          sheetNames.forEach(async (sheetName) => {
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet, { defval: "" }); // defval: "" để đảm bảo các ô trống là chuỗi rỗng

            if (data.length > 0) {
              // Tạo đường dẫn PDF cho từng file
              const pdfFilePath = path.join(
                __dirname,
                "../pdf",
                `${file.filename}_output.pdf`
              );

              // Chuyển dữ liệu của từng file thành PDF mà không cần gộp lại
              await fileModel.convertExcelToPDF(data, pdfFilePath); // Đảm bảo đây là hàm async
            }
          });
        }
      }
    } else {
      console.log("No .xlsx files to process");
    }

    // Kiểm tra nếu có file .txt thì mới xử lý
    if (txtFiles.length > 0) {
      let combinedData = ""; // Biến lưu trữ dữ liệu gộp từ tất cả các file .txt
      for (const file of txtFiles) {
        const filePath = path.join(__dirname, "../uploads", file.filename);
        const fileExt = path.extname(file.filename).toLowerCase();
        await fileModel.insertFileDatabase(file.filename, filePath, fileExt);

        const data = fs.readFileSync(filePath, "utf-8");
        const content = data
          .split("\n")
          .map((row) => row.trim())
          .join("\n");

        // Gộp dữ liệu từ tất cả các file .txt
        combinedData += content + "\n\n";
      }

      // Nếu có dữ liệu gộp được, chuyển thành PDF
      if (combinedData) {
        const pdfFilePath = path.join(
          __dirname,
          "../merge",
          "combined_output.txt.pdf" // Tên file PDF đầu ra
        );

        // Chuyển đổi dữ liệu đã gộp thành PDF
        await fileModel.convertTextToPDF(combinedData, pdfFilePath);
      }
    } else {
      console.log("No .txt files to process");
    }
  }

  // Chuyển đổi dữ liệu Excel thành PDF
  static async convertExcelToPDF(fileData, pdfOutputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Tạo nội dung HTML từ dữ liệu Excel dạng bảng
    let htmlContent = "<html><body>";

    // Tạo bảng với tiêu đề
    htmlContent += "<h2>Dữ liệu từ file Excel</h2>";

    // Tạo bảng HTML
    htmlContent +=
      "<table border='1' style='border-collapse: collapse; width: 100%;'>";

    // Lấy danh sách các keys từ row đầu tiên để tạo header
    const headers = Object.keys(fileData[0]);

    // Tạo header cho bảng
    htmlContent += "<thead><tr>";
    headers.forEach((header) => {
      htmlContent += `<th style='padding: 5px;'>${header}</th>`;
    });
    htmlContent += "</tr></thead>";

    // Tạo dữ liệu cho bảng
    htmlContent += "<tbody>";
    fileData.forEach((row) => {
      htmlContent += "<tr>";
      headers.forEach((header) => {
        htmlContent += `<td style='padding: 5px;'>${row[header] || "N/A"}</td>`; // Hiển thị giá trị mỗi cột
      });
      htmlContent += "</tr>";
    });
    htmlContent += "</tbody>";

    htmlContent += "</table>";
    htmlContent += "</body></html>";

    await page.setContent(htmlContent);

    // Tạo file PDF từ nội dung HTML đã định dạng
    await page.pdf({
      path: pdfOutputPath,
      format: "A4",
      printBackground: true,
    });
    console.log(
      "🚀 ~ fileModel ~ convertExcelToPDF ~ pdfOutputPath:",
      pdfOutputPath
    );
    await fileModel.sendFile(pdfOutputPath);
    await browser.close();
  }

  // Chuyển đổi nội dung văn bản thành PDF
  static async convertTextToPDF(textContent, pdfOutputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    const htmlContent = `<html><body><pre>${textContent}</pre></body></html>`;
    await page.setContent(htmlContent);

    await page.pdf({
      path: pdfOutputPath,
      format: "A4",
      printBackground: true,
    });
    await fileModel.sendFile(pdfOutputPath);
    await browser.close();
  }
  // Lấy toàn bộ file
  static async getAllFiles() {
    const user = new fileModel();
    await user.connect();
    const query = `SELECT * FROM file_uploads;
  `;
    try {
      const [rows] = await user.connection.execute(query);
      return rows; // Trả về tất cả người dùng
    } catch (error) {
      console.error("Không lấy được dữ liệu người dùng:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }
  // lay mot file
  static async getOneFiles(id) {
    const user = new fileModel();
    await user.connect();
    const query = `SELECT * FROM file_uploads where id =?;
  `;
    try {
      const [rows] = await user.connection.execute(query, [id]);
      return rows; // Trả về tất cả người dùng
    } catch (error) {
      console.error("Không lấy được dữ liệu người dùng:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }
  // lay mot file
  static async getFilePathById(id) {
    const user = new fileModel();
    await user.connect();
    const query = `SELECT file_path FROM file_uploads where id = ?`;
    try {
      const [rows] = await user.connection.execute(query, [id]);
      // console.log("🚀 ~ fileModel ~ getFilePathById ~ rows:", rows);
      return rows; // Trả về tất cả người dùng
    } catch (error) {
      console.error("Không lấy được dữ liệu người dùng:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }
  // xoa file
  static async deleteFile(id) {
    const user = new fileModel();
    await user.connect();

    const query = `DELETE FROM file_uploads WHERE id = ?`;

    try {
      const [result] = await user.connection.execute(query, [id]);
      return result.affectedRows; // Trả về số bản ghi đã xóa
    } catch (error) {
      console.error("Lỗi khi xóa người dùng:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }
  //
  static async sendFile(
    pdfFilePath,
    uploadUrl = "https://36f0-2405-4802-1804-8c70-d92d-4e6-c0b-f789.ngrok-free.app/upload"
  ) {
    try {
      // Kiểm tra xem file có tồn tại không
      if (!fs.existsSync(pdfFilePath)) {
        console.error("File không tồn tại:", pdfFilePath);
        return; // Dừng lại nếu file không tồn tại
      }

      // Mở stream file PDF
      const fileStream = fs.createReadStream(pdfFilePath);

      // Tạo đối tượng FormData để gửi file
      const formData = new FormData();

      // Thêm file vào FormData, gửi dưới tên trường 'file' và tên file gốc
      formData.append("file", fileStream);

      // Gửi yêu cầu POST đến API đích
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          ...formData.getHeaders(), // Đảm bảo gửi đúng headers cho FormData
        },
      });

      // Trả về response nếu thành công
      console.log("File uploaded successfully:", response.data);
      return response.data;
    } catch (error) {
      // Xử lý lỗi nếu có
      console.error("Error uploading file:", error);
      throw error; // Ném lại lỗi để xử lý ở nơi gọi hàm
    }
  }
}

export default fileModel;
