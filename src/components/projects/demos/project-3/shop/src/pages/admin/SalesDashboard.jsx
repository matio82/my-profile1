import { useEffect, useState, useCallback } from "react";
import axios from "../../utils/axios";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const SalesDashboard = () => {
  const [period, setPeriod] = useState("month");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalRevenue: 0,
    deliveredOrders: 0,
    chart: []
  });

  // ✅ اصلاح: استفاده از useCallback برای پایداری تابع
  const fetchReport = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/orders/admin/sales-report?period=${period}`
      );
      setData(res.data);
    } catch (err) {
      console.error("Sales report error:", err);
    } finally {
      setLoading(false);
    }
  }, [period]); // ✅ وابستگی به period

  // ✅ اصلاح: اضافه کردن fetchReport به dependency array
  useEffect(() => {
    fetchReport();
  }, [fetchReport]);

  const chartData = {
    labels: data.chart.map(i => i.label),
    datasets: [
      {
        label: "فروش",
        data: data.chart.map(i => i.value),
        borderColor: "#6366f1",
        backgroundColor: "rgba(99,102,241,0.2)"
      }
    ]
  };

  return (
    <div className="p-6 bg-white rounded-xl">
      <div className="flex justify-between mb-4">
        <h2 className="font-bold">📊 گزارش فروش</h2>

        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="border rounded px-2"
        >
          <option value="day">روزانه</option>
          <option value="month">ماهانه</option>
          <option value="year">سالانه</option>
        </select>
      </div>

      {loading ? <p>در حال بارگذاری...</p> : <Line data={chartData} />}
    </div>
  );
};

export default SalesDashboard;
