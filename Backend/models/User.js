import connectDatabase from "../db.js";

class User {
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

  // Tạo hàm thêm dữ liệu vào database
  static async insertUser(name, password, email, role) {
    const user = new User();
    await user.connect();

    const insert = `INSERT INTO account (username, password, email, role_id) VALUES (?, ?, ?, ?)`;

    try {
      const [result] = await user.connection.execute(insert, [
        name,
        password,
        email,
        role,
      ]);
      console.log("User added:", result.insertId);
      return result.insertId; // Trả về ID của người dùng đã thêm
    } catch (error) {
      console.error("Error inserting user:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  // Kiểm tra xem đã tồn tại email chưa
  static async checkEmailExists(email, data = false) {
    const user = new User();
    await user.connect();

    const query = `SELECT * FROM account WHERE email = ?`;

    try {
      const [rows] = await user.connection.execute(query, [email]);
      if (!data) {
        return rows.length > 0; // Nếu có bản ghi, trả về true
      } else {
        return rows[0]; // Trả về bản ghi đầu tiên nếu có dữ liệu
      }
    } catch (error) {
      console.error("Error checking email:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  // Lấy toàn bộ người dùng
  static async getUsers() {
    const user = new User();
    await user.connect();

    const query = `SELECT 
    a.id AS account_id,
    a.username, 
    a.email,
    MIN(c.id) AS chat_id,
    MIN(c.chat_title) AS chat_title -- Sử dụng MIN hoặc MAX
FROM 
    account AS a
LEFT JOIN 
    chat_history AS c 
ON 
    a.id = c.id
GROUP BY 
    a.id, a.username, a.email;
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

  //  lay toan bo lich su chat
  static async getAllChat(id) {
    const user = new User();
    await user.connect();

    const query = `SELECT 
    ch.*, 
    a.username, 
    a.email
FROM 
    chat_history AS ch
JOIN 
    account AS a
ON 
    ch.id = a.id
WHERE 
    ch.id = ?
ORDER BY 
    ch.create_at DESC;
 `;

    try {
      const [rows] = await user.connection.execute(query, [id]);
      return rows; // Trả về tất cả n=
    } catch (error) {
      console.error("Không lấy được dữ liệu lich su chat:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  // lấy ra 10 cau hỏi đc sử dụng nhiều nhất
  static async getAllTopQuesun() {
    const user = new User();
    await user.connect();

    const query = `SELECT 
    content, 
    COUNT(*) AS question_count,
    MIN(create_at) AS createAt
FROM chat_history_detail
WHERE role = 'user'
GROUP BY content
ORDER BY question_count DESC
LIMIT 10`;
    try {
      const [rows] = await user.connection.execute(query);
      return rows;
    } catch (error) {
      console.error("Không lấy được dữ liệu lich su chat:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  // lấy chat theo id chat

  static async getAllChatByidChat_id(id) {
    const user = new User();
    await user.connect();

    const query = `SELECT role , content FROM chat_history_detail WHERE chat_id = ? ORDER BY create_at ASC `;

    try {
      const [rows] = await user.connection.execute(query, [id]);
      return rows;
    } catch (error) {
      console.error("Không lấy được dữ liệu lich su chat:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  // Xóa người dùng
  static async delete(id) {
    const user = new User();
    await user.connect();

    const query = `DELETE FROM account WHERE id = ?`;

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

  // Thêm phiên đăng nhập
  static async insertSession(userId, accessToken, refreshToken, expiresAt) {
    const user = new User();
    await user.connect();

    const query = `INSERT INTO user_sessions (id, access_token, refresh_token, expires_at) VALUES (?, ?, ?, ?)`;
    const values = [userId, accessToken, refreshToken, expiresAt];

    try {
      const [result] = await user.connection.execute(query, values);
      return result.insertId; // Trả về ID của phiên đã thêm
    } catch (error) {
      console.error("Error inserting session:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  // update phien nguoi dung
  static async updateSession(userId, accessToken, refreshToken, expiresAt) {
    const user = new User();
    await user.connect();

    const query = `
      UPDATE user_sessions
      SET access_token = ?, refresh_token = ?, expires_at = ?
      WHERE id = ?`;
    const values = [accessToken, refreshToken, expiresAt, userId];

    try {
      const [result] = await user.connection.execute(query, values);
      return result.affectedRows; // Trả về số hàng đã được cập nhật
    } catch (error) {
      console.error("Error updating session:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  // them lich su cau hoi vao database
  static async insertMessage(chat_id, id, chat_title, create_at) {
    const user = new User();
    await user.connect();

    const query = `INSERT INTO chat_history (chat_id, id, chat_title, create_at) VALUES (?, ?, ?, ?)`;
    const values = [chat_id, id, chat_title, create_at];

    try {
      const [result] = await user.connection.execute(query, values);
      return result.insertId; // Trả về ID của phiên đã thêm
    } catch (error) {
      console.error("Error inserting session:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  static async checkRoomExists(roomId) {
    const user = new User();
    await user.connect();
    const query = `SELECT chat_id FROM chat_history WHERE chat_id = ? `;
    const values = [roomId];
    try {
      const [result] = await user.connection.execute(query, values);
      return result.length > 0; // Trả về true nếu phòng tồn tại
    } catch (error) {
      console.error("Error checking room:", error.message);
      throw error;
    }
  }

  // them du lieu vao lich su chat

  static async inssertOnechat(chat_id, role, content, create_at) {
    const user = new User();
    await user.connect();

    const query = `INSERT INTO chat_history_detail (chat_id, role, content, create_at) VALUES (?, ?, ?, ?)`;
    const values = [chat_id, role, content, create_at];

    try {
      const [result] = await user.connection.execute(query, values);
      return result.insertId; // Trả về ID của phiên đã thêm
    } catch (error) {
      console.error("Error inserting session:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  // Lấy phiên đăng nhập theo userId
  static async getSessionByUserId(userId, check = false) {
    const user = new User();
    await user.connect();

    let query = "";
    if (check) {
      query = `SELECT refresh_token  FROM user_sessions WHERE id = ?`;
    } else {
      query = `SELECT COUNT(*) AS session_count FROM user_sessions WHERE id = ? `;
    }

    try {
      const [results] = await user.connection.execute(query, [userId]);
      return results; // Trả về các phiên đăng nhập
    } catch (error) {
      console.error("Lỗi khi lấy phiên đăng nhập:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  // Xóa phiên đăng nhập
  static async deleteSession(userId) {
    const user = new User();
    await user.connect();

    const query = `DELETE FROM user_sessions WHERE id = ?`;

    try {
      const [result] = await user.connection.execute(query, [userId]);
      return result.affectedRows; // Trả về số phiên đã xóa
    } catch (error) {
      console.error("Lỗi khi xóa phiên đăng nhập:", error);
      throw error;
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  // Cập nhật refresh token
  static async updateRefreshToken(userId, newRefreshToken) {
    const user = new User();
    await user.connect();

    const query = `UPDATE user_sessions SET refresh_token = ? WHERE id = ?`;

    try {
      const [result] = await user.connection.execute(query, [
        newRefreshToken,
        userId,
      ]);
      return result.affectedRows > 0; // Trả về true nếu có bản ghi được cập nhật
    } catch (error) {
      console.error("Error updating refresh token:", error);
      return false; // Trả về false nếu có lỗi
    } finally {
      await user.closeConnection(); // Đóng kết nối
    }
  }

  //
  static async getAccount() {
    const user = new User();
    await user.connect();
    const query = `SELECT COUNT(*) FROM account`;
    try {
      const [result] = await user.connection.execute(query);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      await user.closeConnection();
    }
  }
  static async getActiveAccount() {
    const user = new User();
    await user.connect();
    const query = `SELECT COUNT(*) FROM user_sessions`;
    try {
      const [result] = await user.connection.execute(query);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      await user.closeConnection();
    }
  }
  static async getHistoryChat() {
    const user = new User();
    await user.connect();
    const query = `SELECT COUNT(*) FROM chat_history_detail`;
    try {
      const [result] = await user.connection.execute(query);
      return result;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      await user.closeConnection();
    }
  }
}

export default User;
