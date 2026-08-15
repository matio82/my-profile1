import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import LoadingSpinner from "../../components/LoadingSpinner";

const AdminOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    search: "",
    page: 1
  });

  useEffect(() => {
    fetchOrders();
  }, [filters]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/admin/orders", {
        params: filters
      });
      setOrders(data.data.orders);
    } catch (err) {
      console.error("خطا در دریافت سفارشات", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner text="در حال بارگذاری سفارشات..." />;

  return (
    <div className="admin-page">
      <h1>📦 مدیریت سفارشات</h1>

      <table className="admin-table">
        <thead>
          <tr>
            <th>#</th>
            <th>کاربر</th>
            <th>مبلغ</th>
            <th>وضعیت</th>
            <th>تاریخ</th>
            <th>عملیات</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order._id}>
              <td>{order.orderNumber}</td>
              <td>{order.user?.name}</td>
              <td>{order.totalPrice.toLocaleString()} تومان</td>
              <td>{order.status}</td>
              <td>{new Date(order.createdAt).toLocaleDateString("fa-IR")}</td>
              <td>
                <button onClick={() => navigate(`/admin/orders/${order._id}`)}>
                  جزئیات
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
