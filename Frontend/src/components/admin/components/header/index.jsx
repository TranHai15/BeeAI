import React, { useState } from "react";
import "./style.css";

export default function Header() {
  const [isLogoutPopupVisible, setLogoutPopupVisible] = useState(false);

  // Hàm mở/đóng popup đăng xuất
  const toggleLogoutPopup = () => {
    setLogoutPopupVisible(!isLogoutPopupVisible);
  };

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xử lý đăng xuất tại đây (ví dụ: xóa token, chuyển hướng...)
    console.log("Đã đăng xuất");
    setLogoutPopupVisible(false);
  };

  return (
    <header className="admin-header">
      <div className="logo" onClick={toggleLogoutPopup}>
        Admin
      </div>

      {isLogoutPopupVisible && (
        <>
          {/* Overlay để làm mờ nền khi popup hiển thị */}
          <div className="logout-overlay" onClick={toggleLogoutPopup}></div>

          {/* Popup đăng xuất */}
          <div className="logout-popup--admin">
            <h3>Đăng xuất?</h3>
            <p>Bạn có chắc muốn đăng xuất khỏi hệ thống?</p>
            <button className="popup-button" onClick={handleLogout}>
              Đăng xuất
            </button>
            <button className="popup-button" onClick={toggleLogoutPopup}>
              Hủy
            </button>
          </div>
        </>
      )}
    </header>
  );
}
