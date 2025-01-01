import "./style.css";
export const showNotification = (message, type = "info", duration = 3000) => {
  // Tạo phần tử thông báo
  const notification = document.createElement("div");

  // Thêm nội dung và các lớp CSS
  notification.textContent = message;
  notification.className = `notification ${type}`;

  // Thêm thông báo vào body
  document.body.appendChild(notification);

  // Tự động ẩn sau một khoảng thời gian
  setTimeout(() => {
    notification.classList.add("hide");
    notification.addEventListener("transitionend", () => {
      notification.remove();
    });
  }, duration);
};
