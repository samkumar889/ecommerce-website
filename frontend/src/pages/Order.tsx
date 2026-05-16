import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { orderAPI } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
  image: string;
}

interface OrderType {
  _id: string;
  orderItems: OrderItem[];
  shippingAddress: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
  totalPrice: number;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  createdAt: string;
}

const Order: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const fetchOrder = async () => {
      try {
        const response = await orderAPI.getById(id!);
        setOrder(response.data);
      } catch (error) {
        console.error('Failed to fetch order:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id, user, navigate]);

  if (loading) {
    return <div className="loading">Loading order...</div>;
  }

  if (!order) {
    return <div className="not-found">Order not found</div>;
  }

  return (
    <div className="order-container">
      <h2>Order {order._id}</h2>
      <div className="order-details">
        <div className="order-section">
          <h3>Shipping Address</h3>
          <p>
            {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
            {order.shippingAddress.postalCode}, {order.shippingAddress.country}
          </p>
        </div>

        <div className="order-section">
          <h3>Payment Method</h3>
          <p>{order.paymentMethod}</p>
          <p className={`status ${order.isPaid ? 'success' : 'pending'}`}>
            {order.isPaid ? `Paid on ${new Date(order.paidAt!).toLocaleDateString()}` : 'Not Paid'}
          </p>
        </div>

        <div className="order-section">
          <h3>Order Status</h3>
          <p className={`status ${order.isDelivered ? 'success' : 'pending'}`}>
            {order.isDelivered
              ? `Delivered on ${new Date(order.deliveredAt!).toLocaleDateString()}`
              : 'Not Delivered'}
          </p>
        </div>

        <div className="order-section">
          <h3>Order Items</h3>
          {order.orderItems.map((item, index) => (
            <div key={index} className="order-item">
              <img src={item.image} alt={item.name} className="order-item-image" />
              <div className="order-item-info">
                <p>{item.name}</p>
                <p>
                  {item.quantity} x ₹{item.price} = ₹{item.quantity * item.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="order-section order-summary">
          <h3>Order Summary</h3>
          <div className="summary-total">
            <span>Total:</span>
            <span>₹{order.totalPrice.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;
