import { useState, useEffect } from "react";

const Question = () => {
  const [questions, setQuestions] = useState([]);
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    topic: "",
    startDate: "",
    endDate: "",
  });

  useEffect(() => {
    // Dữ liệu giả lập, thay bằng API thực tế
    const fetchData = async () => {
      const fakeQuestions = [
        {
          id: 1,
          question: "How to use React?",
          topic: "React",
          askCount: 10,
          createdAt: "2024-12-01",
          user: "Nguyễn Văn A",
        },
        {
          id: 2,
          question: "How to manage state in React?",
          topic: "React",
          askCount: 8,
          createdAt: "2024-12-05",
          user: "Trần Văn B",
        },
        {
          id: 3,
          question: "What is Node.js?",
          topic: "Node.js",
          askCount: 15,
          createdAt: "2024-12-10",
          user: "Lê Văn C",
        },
        {
          id: 4,
          question: "What is JavaScript?",
          topic: "JavaScript",
          askCount: 5,
          createdAt: "2024-12-12",
          user: "Nguyễn Văn A",
        },
        // Thêm dữ liệu câu hỏi khác...
      ];

      const fakeUsers = [
        { id: 1, name: "Nguyễn Văn A", askCount: 15 },
        { id: 2, name: "Trần Văn B", askCount: 12 },
        { id: 3, name: "Lê Văn C", askCount: 10 },
        // Thêm người dùng khác...
      ];

      setQuestions(fakeQuestions);
      setFilteredQuestions(fakeQuestions);
      setUsers(fakeUsers);
    };

    fetchData();
  }, []);

  const handleFilter = () => {
    let filtered = [...questions];

    // Lọc theo chủ đề
    if (filters.topic) {
      filtered = filtered.filter((question) =>
        question.topic.toLowerCase().includes(filters.topic.toLowerCase())
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
      sorted.sort((a, b) => a.askCount - b.askCount); // Sắp xếp tăng dần
    } else {
      sorted.sort((a, b) => b.askCount - a.askCount); // Sắp xếp giảm dần
    }
    setFilteredQuestions(sorted);
  };

  const handleReset = () => {
    setFilters({
      topic: "",
      startDate: "",
      endDate: "",
    });
    setFilteredQuestions(questions);
  };

  const handleDetail = (id) => {
    // Mở chi tiết câu hỏi, có thể dùng modal hoặc chuyển trang
    alert(`Xem chi tiết câu hỏi ID: ${id}`);
  };

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
              value={filters.topic}
              onChange={(e) =>
                setFilters({ ...filters, topic: e.target.value })
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
                <th className="p-3 border">Chủ đề</th>
                <th className="p-3 border">Lượt hỏi</th>
                <th className="p-3 border">Ngày tạo</th>
                <th className="p-3 border">Chi tiết</th>
              </tr>
            </thead>
            <tbody>
              {filteredQuestions.map((question, index) => (
                <tr key={question.id} className="hover:bg-gray-100">
                  <td className="p-3 border">{index + 1}</td>
                  <td className="p-3 border">{question.question}</td>
                  <td className="p-3 border">{question.topic}</td>
                  <td className="p-3 border">{question.askCount}</td>
                  <td className="p-3 border">
                    {new Date(question.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3 border">
                    <button
                      onClick={() => handleDetail(question.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Chi tiết
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Top người dùng hỏi nhiều nhất */}
        <div className="bg-white p-6 rounded-lg shadow-md">
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
        </div>
      </div>
    </div>
  );
};

export default Question;
