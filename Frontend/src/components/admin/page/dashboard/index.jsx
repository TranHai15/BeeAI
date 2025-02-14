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
  Legend
} from "chart.js";
import axiosClient from "../../../../api/axiosClient";

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
  const [totalQuestions, setTotalQuestions] = useState(50); // Tổng số câu hỏi
  const [chartData, setChartData] = useState({
    labels: ["Thứ 2", "Thứ 3", "Thứ 4", "Thứ 5", "Thứ 6", "Thứ 7", "Chủ Nhật"],
    datasets: [
      {
        label: "Số câu hỏi",
        data: [50, 60, 45, 70, 80, 90, 100],
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.2)",
        tension: 0.4
      }
    ]
  });

  // Gọi API khi thay đổi khoảng thời gian
  useEffect(() => {
    async function fetchData() {
      // Dữ liệu giả lập, thay bằng API thực tế
      const res = await axiosClient.get("/api/dashboard");
      console.log("🚀 ~ fetchData ~ res:", res.data.NumberHistoryChat);
      const apiData = {
        day: { totalQuestions: 50, chartData: [10, 15, 20, 10, 30, 50, 60] },
        threeDays: {
          totalQuestions: 150,
          chartData: [40, 50, 60, 70, 80, 90, 100]
        },
        week: {
          totalQuestions: 500,
          chartData: [150, 200, 180, 220, 300, 250, 400]
        },
        month: {
          totalQuestions: 2000,
          chartData: [500, 600, 700, 800, 750, 900, 950]
        },
        sixMonths: {
          totalQuestions: 10000,
          chartData: [1500, 1600, 1700, 1800, 1900, 2000, 2100]
        },
        all: {
          totalQuestions: 50000,
          chartData: [5000, 6000, 7000, 8000, 9000, 10000, 11000]
        }
      };

      const data = apiData[timeRange]; // Lấy dữ liệu theo khoảng thời gian

      setTotalQuestions(data.totalQuestions); // Cập nhật tổng số câu hỏi
      setChartData({
        ...chartData,
        datasets: [{ ...chartData.datasets[0], data: data.chartData }]
      });
    }

    fetchData();
  }, [timeRange]); // Cập nhật khi `timeRange` thay đổi

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Bộ lọc thời gian */}
      <div className="flex justify-end mb-6">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="p-3 border border-gray-300 rounded-md bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="day">Trong ngày</option>
          <option value="threeDays">3 ngày qua</option>
          <option value="week">Trong tuần</option>
          <option value="month">Trong tháng</option>
          <option value="sixMonths">6 tháng qua</option>
          <option value="all">Tất cả</option>
        </select>
      </div>

      {/* Tổng số câu hỏi */}
      <div className="bg-white p-6 rounded-lg shadow-md text-center">
        <h2 className="text-xl font-semibold mb-2">Tổng số câu hỏi</h2>
        <p className="text-3xl font-bold">{totalQuestions}</p>
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
              title: { display: true, text: "Số lượng câu hỏi theo thời gian" }
            }
          }}
        />
      </div>
    </div>
  );
};

export default Dashboard;
