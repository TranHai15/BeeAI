import XLSX from "xlsx";
import puppeteer from "puppeteer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import connectDatabase from "../db.js";

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
    for (const file of files) {
      const filePath = path.join(__dirname, "../uploads", file.filename);
      const fileExt = path.extname(file.filename).toLowerCase();

      let fileData = [];
      let headers = [];
      await fileModel.insertFileDatabase(file.filename, filePath, fileExt);

      if (fileExt === ".xlsx") {
        const workbook = XLSX.readFile(filePath);
        const sheetNames = workbook.SheetNames;

        sheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const data = XLSX.utils.sheet_to_json(sheet);

          if (data.length > 0) {
            if (headers.length === 0) {
              headers = Object.keys(data[0]);
            }
            fileData.push(...data);
          }
        });

        if (fileData.length > 0) {
          const pdfFilePath = path.join(
            __dirname,
            "../pdf",
            `${file.filename}_output.pdf`
          );
          await fileModel.convertExcelToPDF(fileData, headers, pdfFilePath);
        }
      } else if (fileExt === ".txt") {
        const data = fs.readFileSync(filePath, "utf-8");
        const content = data
          .split("\n")
          .map((row) => row.trim())
          .join("\n");

        const pdfFilePath = path.join(
          __dirname,
          "../pdf",
          `${file.filename}_output.pdf`
        );
        await fileModel.convertTextToPDF(content, pdfFilePath);
      }
    }
  }

  // Chuyển đổi dữ liệu Excel thành PDF
  static async convertExcelToPDF(fileData, headers, pdfOutputPath) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Tạo nội dung HTML từ dữ liệu Excel không dùng bảng
    let htmlContent = "<html><body>";

    // Hiển thị headers như là tiêu đề
    htmlContent += "<h2>Dữ liệu từ file Excel</h2>";
    htmlContent += "<div><strong>Headers:</strong><ul>";
    headers.forEach((header) => {
      htmlContent += `<li>${header}</li>`;
    });
    htmlContent += "</ul></div>";

    // Hiển thị dữ liệu từng dòng
    htmlContent += "<div><strong>Dữ liệu:</strong><ul>";
    fileData.forEach((row) => {
      htmlContent += "<li>";
      headers.forEach((header) => {
        htmlContent += `${header}: ${row[header] || "N/A"}, `;
      });
      htmlContent = htmlContent.slice(0, -2); // Xóa dấu ", " cuối cùng
      htmlContent += "</li>";
    });
    htmlContent += "</ul></div>";

    htmlContent += "</body></html>";

    await page.setContent(htmlContent);

    await page.pdf({
      path: pdfOutputPath,
      format: "A4",
      printBackground: true,
    });

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
      console.log("🚀 ~ fileModel ~ getFilePathById ~ rows:", rows);
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
}

export default fileModel;
