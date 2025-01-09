import React, { useState, useEffect } from "react";

const Account = () => {
  const [users, setUsers] = useState([]); // Dữ liệu người dùng
  const [filteredUsers, setFilteredUsers] = useState([]); // Dữ liệu sau khi lọc
  const [filters, setFilters] = useState({
    name: "",
    email: "",
    status: "all", // "online", "offline", "all"
    startDate: "",
    endDate: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    // Dữ liệu giả lập, thay bằng API thực tế
    const fetchUsers = async () => {
      const fakeUsers = [
        {
          id: 1,
          name: "Nguyễn Văn A",
          email: "a@gmail.com",
          role: "Admin",
          status: "online",
          createdAt: "2024-12-01",
        },
        {
          id: 2,
          name: "Trần Văn B",
          email: "b@gmail.com",
          role: "User",
          status: "offline",
          createdAt: "2024-12-10",
        },
        {
          id: 3,
          name: "Lê Văn C",
          email: "c@gmail.com",
          role: "Editor",
          status: "online",
          createdAt: "2024-12-15",
        },
        // Thêm dữ liệu khác...
      ];
      setUsers(fakeUsers);
      setFilteredUsers(fakeUsers);
    };

    fetchUsers();
  }, []);

  const handleFilter = () => {
    let filtered = [...users];

    // Lọc theo tên
    if (filters.name) {
      const nameSearch = filters.name.toLowerCase().replace(/\s+/g, ""); // Chuyển về chữ thường, bỏ khoảng trắng
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().replace(/\s+/g, "").includes(nameSearch)
      );
    }

    // Lọc theo email
    if (filters.email) {
      const emailSearch = filters.email.toLowerCase().replace(/\s+/g, "");
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().replace(/\s+/g, "").includes(emailSearch)
      );
    }

    // Lọc theo trạng thái
    if (filters.status !== "all") {
      filtered = filtered.filter((user) => user.status === filters.status);
    }

    // Lọc theo ngày tháng
    if (filters.startDate) {
      filtered = filtered.filter(
        (user) => new Date(user.createdAt) >= new Date(filters.startDate)
      );
    }
    if (filters.endDate) {
      filtered = filtered.filter(
        (user) => new Date(user.createdAt) <= new Date(filters.endDate)
      );
    }

    setFilteredUsers(filtered);
    setCurrentPage(1); // Reset về trang đầu
  };

  const handleReset = () => {
    setFilters({
      name: "",
      email: "",
      status: "all",
      startDate: "",
      endDate: "",
    });
    setFilteredUsers(users);
    setCurrentPage(1);
  };

  // Phân trang
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="flex justify-center">
      <div className="p-6 bg-gray-100 min-h-screen w-10/12">
        {/* Bộ lọc */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-xl font-semibold mb-4">Bộ Lọc</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Tìm theo tên"
              value={filters.name}
              onChange={(e) => setFilters({ ...filters, name: e.target.value })}
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Tìm theo email"
              value={filters.email}
              onChange={(e) =>
                setFilters({ ...filters, email: e.target.value })
              }
                              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={filters.status}
              onChange={(e) =>
                setFilters({ ...filters, status: e.target.value })
              }
              // helow ban  ban can gì toi co the gip ban
              className="p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Tất cả trạng thái</option>
              <option value="online">Đang hoạt động</option>
              <option value="offline">Không hoạt động</option>
            </select>
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

        {/* Danh sách người dùng */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <table className="w-full text-left table-auto border-collapse">
            <thead>
              <tr className="bg-gray-200">
                <th className="p-3 border">#</th>
                <th className="p-3 border">Tên</th>
                <th className="p-3 border">Email</th>
                <th className="p-3 border">Phân quyền</th>
                <th className="p-3 border">Trạng thái</th>
                <th className="p-3 border">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((user, index) => (
                <tr key={user.id} className="hover:bg-gray-100">
                  <td className="p-3 border">{indexOfFirstItem + index + 1}</td>
                  <td className="p-3 border">{user.name}</td>
                  <td className="p-3 border">{user.email}</td>
                  <td className="p-3 border">{user.role}</td>
                  <td className="p-3 border">
                    {user.status === "online"
                      ? "Đang hoạt động"
                      : "Không hoạt động"}
                  </td>
                  <td className="p-3 border">
                    <button className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2">
                      Chi tiết
                    </button>
                    <button className="px-3 py-1 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 mr-2">
                      Sửa
                    </button>
                    <button className="px-3 py-1 bg-red-500 text-white rounded-md hover:bg-red-600">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Phân trang */}
          <div className="mt-4 flex justify-center gap-4">
            {Array.from(
              { length: Math.ceil(filteredUsers.length / itemsPerPage) },
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
        </div>
      </div>
    </div>
  );
};

export default Account;
