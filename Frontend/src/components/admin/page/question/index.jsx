import { useState, useEffect } from "react";
import axiosClient from "../../../../api/axiosClient";
import "./style.css";
const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    topic: "",
    startDate: "",
    endDate: ""
  });

  useEffect(() => {
    // Dữ liệu giả lập, thay bằng API thực tế
    const fetchData = async () => {
      const res = await axiosClient.post("/user/topQues");
      // console.log("🚀 ~ fetchData ~ res:", res.data);
      setQuestions(res.data.getChatTop);
      setFilteredQuestions(res.data.getChatTop);

      // const fakeUsers = [
      //   { id: 1, name: "Nguyễn Văn A", askCount: 15 },
      //   { id: 2, name: "Trần Văn B", askCount: 12 },
      //   { id: 3, name: "Lê Văn C", askCount: 10 }
      //   // Thêm người dùng khác...
      // ];
      // setUsers(fakeUsers);
    };

    fetchData();
  }, []);

  const handleFilter = () => {
    let filtered = [...questions];

    // Lọc theo chủ đề
    if (filters.content) {
      filtered = filtered.filter((question) =>
        question.content.toLowerCase().includes(filters.content.toLowerCase())
      );
    }

    // Lọc theo ngày
    if (filters.startDate) {
      filtered = filtered.filter(
        (question) =>
          new Date(question.createdAt) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (question) => new Date(question.createdAt) <= new Date(filters.endDate)
      );
    }

    setFilteredQuestions(filtered);
  };

  const handleSort = (order) => {
    let sorted = [...filteredQuestions];
    if (order === "asc") {
      sorted.sort((a, b) => a.frequency - b.frequency); // Sắp xếp tăng dần
    } else {
      sorted.sort((a, b) => b.frequency - a.frequency); // Sắp xếp giảm dần
    }
    setFilteredQuestions(sorted);
  };

  const handleReset = () => {
    setFilters({
      topic: "",
      startDate: "",
      endDate: ""
    });
    setFilteredQuestions(questions);
  };

  const handleDetail = (id) => {
    // Mở chi tiết câu hỏi, có thể dùng modal hoặc chuyển trang
    alert(`Xem chi tiết câu hỏi ID: ${id}`);
  };
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredQuestions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  function formatDate(dateString) {
    // Cắt phần '000Z' và thay 'T' bằng khoảng trắng
    const formattedDate = dateString.replace("T", " ").slice(0, -5);
    return formattedDate;
  }

  return (
    <div className="flex justify-center">
      <div className="p-6 bg-gray-100 min-h-screen w-10/12">
        {/* Bộ lọc */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Bộ Lọc</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Lọc theo chủ đề"
              value={filters.content}
              onChange={(e) =>
                setFilters({ ...filters, content: e.target.value })
              }
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) =>
                setFilters({ ...filters, startDate: e.target.value })
              }
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) =>
                setFilters({ ...filters, endDate: e.target.value })
              }
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="mt-4 flex gap-4">
            <button
              onClick={handleFilter}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Lọc
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-2 bg-gray-300 text-black rounded-md hover:bg-gray-400"
            >
              Đặt lại
            </button>
          </div>
        </div>

        {/* Sắp xếp theo số lượt hỏi */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => handleSort("asc")}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            Sắp xếp tăng dần
          </button>
          <button
            onClick={() => handleSort("desc")}
            className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
          >
            Sắp xếp giảm dần
          </button>
        </div>

        {/* Danh sách câu hỏi */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">#</th>
                <th className="p-3 border">Câu hỏi</th>
                <th className="p-3 border">Lượt hỏi</th>
                <th className="p-3 border">Ngày tạo</th>
                <th className="p-3 border">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((question, index) => (
                <tr key={index} className="hover:bg-gray-100">
                  <td className="p-3 border-none">{question.id}</td>
                  <td className=" limit-lines border-none">
                    {question.content}
                  </td>
                  <td className="p-3 border min-w-max border-none">
                    {question.frequency}
                  </td>
                  <td className="p-3 border min-w-24 border-none">
                    {formatDate(question.first_asked_at)}
                  </td>
                  <td className="p-3 border limit-lines border-none">
                    <button
                      onClick={() => handleDetail(question.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 min-w-max border-none"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/* Phân trang */}
          {currentItems && (
            <div className="mt-4 flex justify-center gap-4">
              {Array.from(
                { length: Math.ceil(filteredQuestions.length / itemsPerPage) },
                (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className={`px-4 py-2 rounded-md ${
                      currentPage === i + 1
                        ? "bg-blue-500 text-white"
                        : "bg-gray-300 text-black"
                    }`}
                  >
                    {i + 1}
                  </button>
                )
              )}
            </div>
          )}
        </div>

        {/* Top người dùng hỏi nhiều nhất */}
        {/* <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Top Người Dùng</h2>
          <ul>
            {users
              .sort((a, b) => b.askCount - a.askCount)
              .map((user) => (
                <li
                  key={user.id}
                  className="flex justify-between py-2 border-b"
                >
                  <span>{user.name}</span>
                  <span>{user.askCount} câu hỏi</span>
                </li>
              ))}
          </ul>
        </div> */}
      </div>
    </div>
  );
};

export default Question;
