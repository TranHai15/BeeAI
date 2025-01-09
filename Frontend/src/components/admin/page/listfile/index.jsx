import { useState, useEffect } from "react";
import axiosClient from "../../../../api/axiosClient";
// Component hiển thị danh sách file
const FileList = () => {
  const [files, setFiles] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  // Lấy dữ liệu từ backend
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axiosClient.get("/file"); // API để lấy danh sách file
        // console.log("🚀 ~ fetchFiles ~ response:", response.data);
        setFiles(response.data); // Gán dữ liệu file vào state
      } catch (error) {
        console.error("Error fetching files", error);
      }
    };
    fetchFiles();
  }, []);

  // Xử lý xem file
  const handleViewFile = (fileId, name) => {
    window.open(`/admin/file/${name}?id=${fileId}`, "_blank"); // Mở file trong tab mới
  };
  const handleEditFile = (fileId, name) => {
    window.open(`/admin/files/${name}?id=${fileId}`, "_blank"); // Mở file trong tab mới
  };

  // Xử lý xóa file
  const handleDeleteFile = async (fileId) => {
    try {
      await axiosClient.delete(`/file/delete/${fileId}`); // API xóa file
      setFiles(files.filter((file) => file.id !== fileId)); // Xóa file khỏi state
      alert("File deleted successfully");
    } catch (error) {
      console.error("Error deleting file", error);
      alert("Failed to delete file");
    }
  };
  const [filesAdd, setFilesAdd] = useState([]);

  // Hàm xử lý khi chọn file
  const handleFileChange = (e) => {
    setFilesAdd(e.target.files); // Lưu trữ các file người dùng chọn
  };
  // Hàm gửi file lên backend
  const handleUpload = async () => {
    if (!filesAdd || filesAdd.length === 0) {
      // alert("Please select at least one file to upload.");
      return;
    }

    const formData = new FormData();
    setIsSaving(true);
    // Thêm từng file vào FormData
    Array.from(filesAdd).forEach((file) => {
      formData.append("files", file); // Thêm mỗi file với key là 'files'
    });

    try {
      const response = await fetch("http://localhost:3000/file/upload", {
        method: "POST",
        body: formData // Gửi FormData chứa các file
      });

      if (response.ok) {
        setIsSaving(false);
        alert("Files uploaded successfully");
      } else {
        alert("File upload failed");
      }
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 ">
      <h1 className="text-2xl font-semibold text-center mb-6">
        File Management
      </h1>
      <div className="flex items-center space-x-4 ml-auto w-min ">
        <input
          type="file"
          onChange={handleFileChange}
          multiple
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />

        <div className="">
          <button
            className={`px-6 py-3 font-semibold rounded-lg ${
              isSaving
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 text-white hover:bg-blue-600"
            }`}
            onClick={handleUpload}
            disabled={isSaving}
          >
            {isSaving ? (
              <div className="flex items-center">
                <svg
                  className="animate-spin h-5 w-5 mr-2 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.963 7.963 0 014 12H0c0 2.314.786 4.429 2.091 6.125l2.909-2.834z"
                  ></path>
                </svg>
                Upload...
              </div>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>

      <table className="min-w-full table-auto border-collapse border border-gray-300 mt-6">
        <thead>
          <tr>
            <th className="border px-4 py-2">File Name</th>
            <th className="border px-4 py-2">File Type</th>
            <th className="border px-4 py-2"> Update</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {files.map((file) => (
            <tr key={file.id}>
              <td className="border px-4 py-2">{file.file_name}</td>
              <td className="border px-4 py-2">{file.file_type}</td>
              <td className="border px-4 py-2">{file.upload_date}</td>
              <td className="border px-4 py-2 flex space-x-2">
                <button
                  onClick={() => handleViewFile(file.id, file.file_name)}
                  className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-600"
                >
                  View
                </button>
                <button
                  onClick={() => handleEditFile(file.id, file.file_name)}
                  className="bg-yellow-500 text-white py-1 px-3 rounded hover:bg-yellow-600"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteFile(file.id)}
                  className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FileList;
