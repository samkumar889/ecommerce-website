import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  price: number;
  stock: number;
}

interface Order {
  _id: string;
  user: { name: string };
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
}

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    const fetchData = async () => {
      try {
        const [productsRes, ordersRes] = await Promise.all([
          adminAPI.getAllProducts(),
          adminAPI.getAllOrders(),
        ]);
        setProducts(productsRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error('Failed to fetch admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user, navigate]);

  const handleDeliverOrder = async (orderId: string) => {
    try {
      await adminAPI.deliverOrder(orderId);
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, isDelivered: true } : order
        )
      );
    } catch (error) {
      console.error('Failed to deliver order:', error);
    }
  };

  if (loading) {
    return <div className="loading">Loading dashboard...</div>;
  }

  return (
    <div className="admin-container">
      <h2>Admin Dashboard</h2>

      <div className="admin-section">
        <h3>Orders</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Paid</th>
              <th>Delivered</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id.substring(0, 8)}...</td>
                <td>{order.user.name}</td>
                <td>₹{order.totalPrice.toFixed(2)}</td>
                <td>{order.isPaid ? 'Yes' : 'No'}</td>
                <td>{order.isDelivered ? 'Yes' : 'No'}</td>
                <td>
                  {!order.isDelivered && (
                    <button
                      className="action-btn"
                      onClick={() => handleDeliverOrder(order._id)}
                    >
                      Mark as Delivered
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="admin-section">
        <h3>Products</h3>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Product ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product._id}>
                <td>{product._id.substring(0, 8)}...</td>
                <td>{product.name}</td>
                <td>₹{product.price.toFixed(2)}</td>
                <td>{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
