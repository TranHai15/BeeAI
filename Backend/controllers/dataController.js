// # Xử lý API từ AI và lưu dữ liệu vào MySQL
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import MachDien from "../models/Data.js"; // Chú ý thêm `.js` vào đường dẫn nếu bạn sử dụng ES Modules
import User from "../models/User.js"; // Chú ý thêm `.js` vào đường dẫn nếu bạn sử dụng ES Modules
import fs from "fs";
import path from "path";
import axios from "axios";

const dataController = {
  // Xử lý API ChatGPT
  chatGPT: async (req, res) => {
    const { message } = req.body;

    // For testing purpose, returning markdown text
    const test = `
 | Cột 1  Cột 1  | Cột 2 Cột 1   | Cột 3  Cột 1  | Cột 4 Cột 1  | Cột 5 Cột 1   | Cột 6  Cột 1  | Cột 7  Cột 1  | Cột 8 Cột 1  | Cột 9 Cột 1  | Cột 10 Cột 1  | Cột 11 | Cột 12 |
|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|--------|
| Dữ liệu 1 | Dữ liệu 2 | Dữ liệu 3 | Dữ liệu 4 | Dữ liệu 5 | Dữ liệu 6 | Dữ liệu 7 | Dữ liệu 8 | Dữ liệu 9 | Dữ liệu 10 | Dữ liệu 11 | Dữ liệu 12 |
| Dữ liệu 1 | Dữ liệu 2 | Dữ liệu 3 | Dữ liệu 4 | Dữ liệu 5 | Dữ liệu 6 | Dữ liệu 7 | Dữ liệu 8 | Dữ liệu 9 | Dữ liệu 10 | Dữ liệu 11 | Dữ liệu 12 |
| Dữ liệu 1 | Dữ liệu 2 | Dữ liệu 3 | Dữ liệu 4 | Dữ liệu 5 | Dữ liệu 6 | Dữ liệu 7 | Dữ liệu 8 | Dữ liệu 9 | Dữ liệu 10 | Dữ liệu 11 | Dữ liệu 12 |

    `;

    // Simulate delay and return test markdown content
    setTimeout(() => {
      res.status(200).json({ message: test });
    }, 2000);

    // Uncomment this section when connecting to OpenAI API
    /*
    try {
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: message }],
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
        }
      );

      const reply = response.data.choices[0].message.content;

      res.status(200).json({ success: true, reply });
    } catch (error) {
      console.error("Error:", error);

      if (error.response) {
        res.status(error.response.status).json({
          success: false,
          error: error.response.data.error.message || "Lỗi từ OpenAI API",
        });
      } else if (error.request) {
        res.status(500).json({
          success: false,
          error: "Không thể kết nối tới OpenAI API",
        });
      } else {
        res.status(500).json({
          success: false,
          error: "Đã xảy ra lỗi không xác định",
        });
      }
    }
    */
  },

  // Lấy thông tin số lượng tài khoản và lịch sử trò chuyện
  getNumberAccount: async (req, res) => {
    try {
      const numberUser = await User.getAccount();
      const numberActiveUser = await User.getActiveAccount();
      const numberHistoryChat = await User.getHistoryChat();

      const data = {
        NumberUser: numberUser,
        NumberActiveUser: numberActiveUser,
        NumberHistoryChat: numberHistoryChat
      };

      res.status(200).json(data);
    } catch (error) {
      console.error("Error fetching account data:", error);
      res.status(500).json({
        success: false,
        error: "Có lỗi xảy ra khi lấy thông tin tài khoản."
      });
    }
  }
};

export default dataController;
