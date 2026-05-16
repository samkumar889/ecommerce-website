import React, { useState, useEffect } from 'react';
import { productAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  stock: number;
  category: string;
}

const sampleProducts: Product[] = [
  {
    _id: '1',
    name: 'AquaGuard Classic RO',
    description: 'Basic 5-stage RO water purifier with sediment, carbon, and RO filters',
    price: 4999,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20classic%20RO%20water%20purifier%20white%20kitchen%20appliance%20product%20photo&image_size=square_hd',
    stock: 50,
    category: 'RO Purifier'
  },
  {
    _id: '2',
    name: 'AquaGuard Premium RO+UV',
    description: 'Advanced RO+UV+UF purification with digital display and filter change alerts',
    price: 9999,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20premium%20RO%20UV%20water%20purifier%20modern%20design%20digital%20display%20product%20shot&image_size=square_hd',
    stock: 30,
    category: 'RO+UV Purifier'
  },
  {
    _id: '3',
    name: 'AquaGuard Compact',
    description: 'Space-saving gravity-based water purifier perfect for small kitchens and offices',
    price: 3499,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20compact%20gravity%20water%20purifier%20small%20size%20kitchen%20countertop&image_size=square_hd',
    stock: 40,
    category: 'Gravity Purifier'
  },
  {
    _id: '4',
    name: 'AquaGuard Elite Pro',
    description: 'Top-of-the-line RO+UV+UF+Mineral purifier with pH balancing and smart connectivity',
    price: 14999,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20elite%20premium%20water%20purifier%20luxury%20design%20smart%20features%20product%20photography&image_size=square_hd',
    stock: 20,
    category: 'RO+UV+UF+Mineral'
  },
  {
    _id: '5',
    name: 'AquaGuard Nano',
    description: 'Portable water purifier bottle for travel and outdoor use',
    price: 2499,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20portable%20water%20purifier%20bottle%20travel%20outdoor%20product%20photo&image_size=square_hd',
    stock: 35,
    category: 'Portable'
  },
  {
    _id: '6',
    name: 'AquaGuard Copper+',
    description: 'RO purifier with copper infusion for healthy mineral water',
    price: 11999,
    image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=AquaGuard%20copper%20water%20purifier%20RO%20with%20copper%20infusion%20product%20image&image_size=square_hd',
    stock: 25,
    category: 'RO+Copper'
  }
];

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(sampleProducts);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productAPI.getAll();
        setProducts(response.data);
      } catch (error) {
        console.error('Failed to fetch products, showing sample products');
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (productId: string) => {
    if (!user) {
      navigate('/login');
      return;
    }
    await addToCart(productId, 1);
  };

  if (loading) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="home">
      <h1>AquaGuard Water Purifiers</h1>
      <div className="products-grid">
        {products.map((product) => (
          <div key={product._id} className="product-card">
            <img src={product.image} alt={product.name} className="product-image" />
            <div className="product-info">
              <h3>{product.name}</h3>
              <p className="product-description">{product.description}</p>
              <p className="product-category">Category: {product.category}</p>
              <p className="product-price">₹{product.price}</p>
              <button
                className="add-to-cart-btn"
                onClick={() => handleAddToCart(product._id)}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;
