import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [timeRange, setTimeRange] = useState("day"); // State cho khoảng thời gian
  const [stats, setStats] = useState({
    totalUsers: 1500,
    activeUsers: 120,
    newUsers: 35,
    questions: 200,
  });

  const [chartData, setChartData] = useState({
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"],
    datasets: [
      {
        label: "Số câu hỏi mỗi ngày",
        data: [150, 200, 180, 220, 300, 250, 400],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.4,
      },
    ],
  });

  // Gọi API khi thay đổi khoảng thời gian
  useEffect(() => {
    async function fetchData() {
      // Dữ liệu giả lập, thay bằng API thực tế của bạn
      const apiData = {
        day: {
          newUsers: 5,
          questions: 50,
          chartData: [50, 60, 45, 70, 80, 90, 100],
        },
        week: {
          newUsers: 35,
          questions: 500,
          chartData: [150, 200, 180, 220, 300, 250, 400],
        },
        month: {
          newUsers: 120,
          questions: 2000,
          chartData: [500, 600, 700, 800, 750, 900, 950],
        },
        sixMonths: {
          newUsers: 600,
          questions: 10000,
          chartData: [1500, 1600, 1700, 1800, 1900, 2000, 2100],
        },
      };

      const data = apiData[timeRange]; // Dữ liệu theo khoảng thời gian

      // Chỉ thay đổi `newUsers` và `questions`, giữ nguyên `totalUsers` và `activeUsers`
      setStats((prevStats) => ({
        ...prevStats,
        newUsers: data.newUsers,
        questions: data.questions,
      }));

      setChartData({
        ...chartData,
        datasets: [
          {
            ...chartData.datasets[0],
            data: data.chartData, // Cập nhật dữ liệu biểu đồ
          },
        ],
      });
    }

    fetchData();
  }, [timeRange]); // Mỗi khi `timeRange` thay đổi

  return (
    <div className="p-6 bg-gray-100 min-h-screen px-6">
      {/* Bộ lọc thời gian */}
      <div className="flex justify-end mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="day">Trong ngày</option>
          <option value="week">Trong tuần</option>
          <option value="month">Trong tháng</option>
          <option value="sixMonths">6 tháng qua</option>
        </select>
      </div>

      {/* Tổng quan số liệu */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Tổng số người dùng */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Tổng số người dùng</h2>
          <p className="text-3xl font-bold">{stats.totalUsers}</p>
        </div>

        {/* Người dùng hoạt động */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Người dùng hoạt động</h2>
          <p className="text-3xl font-bold">{stats.activeUsers}</p>
        </div>

        {/* Người dùng mới */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Người dùng mới</h2>
          <p className="text-3xl font-bold">{stats.newUsers}</p>
        </div>

        {/* Tổng số câu hỏi */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-2">Tổng số câu hỏi</h2>
          <p className="text-3xl font-bold">{stats.questions}</p>
        </div>
      </div>

      {/* Biểu đồ */}
      <div className="bg-white p-6 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-semibold mb-4">Biểu đồ câu hỏi</h2>
        <Line
          data={chartData}
          options={{
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: { display: true, text: "Số lượng câu hỏi theo thời gian" },
            },
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
