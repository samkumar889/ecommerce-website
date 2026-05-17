const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = [
  {
    _id: '1',
    name: 'Test User',
    email: 'test@example.com',
    password: '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhW',
    isAdmin: false
  }
];

const products = [
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

const carts = {};
const orders = [];

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'demo-secret', { expiresIn: '30d' });
};

app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log('Register request:', { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please fill all fields' });
    }

    const userExists = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      _id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      isAdmin: false
    };

    users.push(user);
    console.log('User registered successfully:', user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login request:', email);

    if (!email || !password) {
      return res.status(400).json({ message: 'Please enter email and password' });
    }

    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('User logged in successfully:', user);
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error, please try again' });
  }
});

app.get('/api/products', (req, res) => {
  try {
    console.log('Get all products request');
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ message: 'Failed to fetch products' });
  }
});

app.get('/api/products/:id', (req, res) => {
  try {
    const product = products.find(p => p._id === req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Failed to fetch product' });
  }
});

const protect = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret');
      const user = users.find(u => u._id === decoded.id);
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: 'Not authorized, user not found' });
      }
    } else {
      res.status(401).json({ message: 'Not authorized, no token' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

app.get('/api/cart', protect, (req, res) => {
  try {
    console.log('Get cart request for user:', req.user._id);
    if (!carts[req.user._id]) {
      carts[req.user._id] = { _id: '1', user: req.user._id, items: [] };
    }
    res.json(carts[req.user._id]);
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ message: 'Failed to fetch cart' });
  }
});

app.post('/api/cart/add', protect, (req, res) => {
  try {
    const { productId, quantity } = req.body;
    console.log('Add to cart request:', { productId, quantity, userId: req.user._id });
    
    if (!carts[req.user._id]) {
      carts[req.user._id] = { _id: '1', user: req.user._id, items: [] };
    }
    const cart = carts[req.user._id];
    const product = products.find(p => p._id === productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    
    const existingItem = cart.items.find(item => item.product._id === productId);
    if (existingItem) {
      existingItem.quantity += quantity || 1;
    } else {
      cart.items.push({ _id: Date.now().toString(), product, quantity: quantity || 1 });
    }
    
    console.log('Cart updated successfully:', cart);
    res.json(cart);
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ message: 'Failed to add item to cart' });
  }
});

app.put('/api/cart/update', protect, (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const cart = carts[req.user._id];
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    const item = cart.items.find(item => item.product._id === productId);
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(item => item.product._id !== productId);
      } else {
        item.quantity = quantity;
      }
      res.json(cart);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    console.error('Update cart error:', error);
    res.status(500).json({ message: 'Failed to update cart' });
  }
});

app.delete('/api/cart/remove/:productId', protect, (req, res) => {
  try {
    const cart = carts[req.user._id];
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }
    cart.items = cart.items.filter(item => item.product._id !== req.params.productId);
    res.json(cart);
  } catch (error) {
    console.error('Remove from cart error:', error);
    res.status(500).json({ message: 'Failed to remove item from cart' });
  }
});

app.get('/api/orders/myorders', protect, (req, res) => {
  try {
    const userOrders = orders.filter(o => o.user === req.user._id);
    res.json(userOrders);
  } catch (error) {
    console.error('Get my orders error:', error);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

app.get('/api/orders/:id', protect, (req, res) => {
  try {
    const order = orders.find(o => o._id === req.params.id);
    if (order) {
      res.json({ ...order, user: { _id: order.user, name: req.user.name } });
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ message: 'Failed to fetch order' });
  }
});

app.post('/api/orders', protect, (req, res) => {
  try {
    const order = {
      _id: Date.now().toString(),
      user: req.user._id,
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      totalPrice: req.body.totalPrice,
      isPaid: false,
      isDelivered: false,
      createdAt: new Date().toISOString()
    };
    orders.push(order);
    carts[req.user._id] = { _id: '1', user: req.user._id, items: [] };
    res.status(201).json(order);
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Failed to place order' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Demo server running on port ${PORT}`);
  console.log('📝 Note: This is a demo server with in-memory storage');
  console.log('👤 Test account: test@example.com / test123');
});
