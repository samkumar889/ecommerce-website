import React from 'react';
import { useCart } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const Cart: React.FC = () => {
  const { cart, updateCartItem, removeFromCart, loading } = useCart();
  const navigate = useNavigate();

  const totalPrice = cart?.items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  ) || 0;

  if (!cart || cart.items.length === 0) {
    return (
      <div className="cart-container">
        <h2>Your Cart</h2>
        <p className="empty-cart">Your cart is empty</p>
        <button className="continue-shopping-btn" onClick={() => navigate('/')}>
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>
      <div className="cart-items">
        {cart.items.map((item) => (
          <div key={item.product._id} className="cart-item">
            <img src={item.product.image} alt={item.product.name} className="cart-item-image" />
            <div className="cart-item-details">
              <h3>{item.product.name}</h3>
              <p className="cart-item-price">₹{item.product.price}</p>
              <div className="cart-item-quantity">
                <button
                  onClick={() => updateCartItem(item.product._id, item.quantity - 1)}
                  disabled={loading}
                >
                  -
                </button>
                <span>{item.quantity}</span>
                <button
                  onClick={() => updateCartItem(item.product._id, item.quantity + 1)}
                  disabled={loading}
                >
                  +
                </button>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.product._id)}
                disabled={loading}
              >
                Remove
              </button>
            </div>
            <div className="cart-item-total">
              ₹{item.product.price * item.quantity}
            </div>
          </div>
        ))}
      </div>
      <div className="cart-summary">
        <h3>Order Summary</h3>
        <div className="summary-row">
          <span>Total:</span>
          <span className="total-price">₹{totalPrice.toFixed(2)}</span>
        </div>
        <button className="checkout-btn" onClick={() => navigate('/checkout')}>
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
