# AquaGuard E-Commerce Website

A full-stack e-commerce website for selling AquaGuard water purifiers, built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (Login/Signup)
- Product listing and product details
- Shopping cart
- Checkout process
- Order management
- Admin panel for managing products and orders
- Payment integration (Demo mode available

## Tech Stack

- **Frontend**: React, TypeScript, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Other**: bcryptjs for password hashing

## Setup Instructions

### Prerequisites

1. Node.js installed
2. MongoDB installed and running locally

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. (Optional) Install nodemon for development:
   ```bash
   npm install -D nodemon
   ```

4. Make sure MongoDB is running locally on port 27017

5. Import sample products:
   ```bash
   npm run data:import
   ```

6. Start the backend server:
   ```bash
   npm start
   # or for development with nodemon
   npm run server
   ```

The backend will run on http://localhost:5000

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm start
   ```

The frontend will run on http://localhost:3000

## Usage

### Creating an Admin User

To create an admin user, you can:
1. Register a new user through the app
2. Manually update the `isAdmin` field to `true` in MongoDB

### Features Walkthrough

1. **Home Page**: Browse all available AquaGuard products
2. **Login/Signup**: Create an account or log in
3. **Add to Cart**: Select products and add them to your cart
4. **Checkout**: Enter shipping details and place an order
5. **Order Details**: View your order history and status
6. **Admin Panel**: (Admin only) Manage products and mark orders as delivered

## Project Structure

```
e commerce website/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/        # API routes
│   ├── middleware/    # Authentication middleware
│   ├── .env          # Environment variables
│   ├── server.js      # Backend entry point
│   └── seeder.js    # Sample data seeder
└── frontend/
    ├── src/
    │   ├── contexts/  # React contexts (Auth, Cart)
    │   ├── components/ # React components
    │   ├── pages/     # Page components
    │   └── services/ # API services
    └── package.json
```

## API Endpoints

### Auth
- POST /api/auth/register - Register new user
- POST /api/auth/login - User login
- GET /api/auth/profile - Get user profile

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get product by ID

### Cart
- GET /api/cart - Get user's cart
- POST /api/cart/add - Add item to cart
- PUT /api/cart/update - Update cart item quantity
- DELETE /api/cart/remove/:productId - Remove item from cart

### Orders
- POST /api/orders - Create new order
- GET /api/orders/myorders - Get user's orders
- GET /api/orders/:id - Get order by ID
- PUT /api/orders/:id/pay - Update order payment status

### Admin
- GET /api/admin/products - Get all products (admin)
- POST /api/admin/products - Create product (admin)
- PUT /api/admin/products/:id - Update product (admin)
- DELETE /api/admin/products/:id - Delete product (admin)
- GET /api/admin/orders - Get all orders (admin)
- PUT /api/admin/orders/:id/deliver - Mark order as delivered (admin)
- GET /api/admin/users - Get all users (admin)

## License

MIT
