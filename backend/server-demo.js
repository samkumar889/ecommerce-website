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

const users = [];
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

    const userExists = users.find(u => u.email === email);

    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      _id: Date.now().toString(),
      name,
      email,
      password: hashedPassword,
      isAdmin: false
    };

    users.push(user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = users.find(u => u.email === email);

    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id)
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/products', (req, res) => {
  res.json(products);
});

app.get('/api/products/:id', (req, res) => {
  const product = products.find(p => p._id === req.params.id);
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

const protect = (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'demo-secret');
      const user = users.find(u => u._id === decoded.id);
      if (user) {
        req.user = user;
        next();
      } else {
        res.status(401).json({ message: 'Not authorized' });
      }
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

app.get('/api/cart', protect, (req, res) => {
  if (!carts[req.user._id]) {
    carts[req.user._id] = { _id: '1', user: req.user._id, items: [] };
  }
  res.json(carts[req.user._id]);
});

app.post('/api/cart/add', protect, (req, res) => {
  const { productId, quantity } = req.body;
  if (!carts[req.user._id]) {
    carts[req.user._id] = { _id: '1', user: req.user._id, items: [] };
  }
  const cart = carts[req.user._id];
  const product = products.find(p => p._id === productId);
  
  const existingItem = cart.items.find(item => item.product._id === productId);
  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ _id: Date.now().toString(), product, quantity });
  }
  
  res.json(cart);
});

app.post('/api/orders', protect, (req, res) => {
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
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Demo server running on port ${PORT}`);
  console.log('Note: This is a demo server with in-memory storage');
});
