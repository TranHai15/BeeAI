import React, { useState } from "react";

function FileUpload() {
  const [files, setFiles] = useState([]);

  // Hàm xử lý khi chọn file
  const handleFileChange = (e) => {
    setFiles(e.target.files); // Lưu trữ các file người dùng chọn
  };

  // Hàm gửi file lên backend
  const handleUpload = async () => {
    const formData = new FormData();

    // Thêm từng file vào FormData
    Array.from(files).forEach((file) => {
      formData.append("files", file); // Thêm mỗi file với key là 'files'
    });

    try {
      const response = await fetch("http://localhost:3000/file/upload", {
        method: "POST",
        body: formData, // Gửi FormData chứa các file
      });

      if (response.ok) {
        alert("Files uploaded successfully");
      } else {
        alert("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        multiple // Cho phép chọn nhiều file
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}

export default FileUpload;
