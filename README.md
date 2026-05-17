ohhk# AquaGuard E-Commerce Website

A full-stack e-commerce website for selling AquaGuard water purifiers, built with React, Node.js, Express, and MongoDB.

## Features

- User authentication (Login/Signup)
- Product listing and product details
- Shopping cart
- Checkout process
- Order management
- Admin panel for managing products and orders
- Payment integration (Demo mode available)

## Tech Stack

- **Frontend**: React, TypeScript, React Router, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Other**: bcryptjs for password hashing

## Render Deployment Instructions

### Step 1: Prepare Your Repository

1. Create a GitHub/GitLab repository and push your code

### Step 2: Deploy to Render

1. Go to [Render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: aquaguard-ecommerce (or your choice)
   - **Region**: Choose your preferred region
   - **Branch**: main (or your default branch)
   - **Root Directory**: Leave empty
   - **Runtime**: Node
   - **Build Command**: 
     ```bash
     cd frontend && npm install && npm run build && cd ../backend && npm install
     ```
   - **Start Command**: 
     ```bash
     cd backend && npm start
     ```

### Step 3: Add Database

1. In Render dashboard, click "New +" → "PostgreSQL" (or choose "MongoDB" from the marketplace)
2. For MongoDB, you can use MongoDB Atlas:
   - Create a free cluster on [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Get your connection string

### Step 4: Add Environment Variables

In your Render Web Service settings, add:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `10000` |
| `MONGO_URI` | Your MongoDB connection string |
| `JWT_SECRET` | Click "Generate" to create a secure secret |

### Step 5: Deploy!

Click "Create Web Service" and wait for deployment to complete.

## Local Development

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
│   ├── server-demo.js # Demo server (no MongoDB needed)
│   └── seeder.js    # Sample data seeder
├── frontend/
│   ├── src/
│   │   ├── contexts/  # React contexts (Auth, Cart)
│   │   ├── components/ # React components
│   │   ├── pages/     # Page components
│   │   └── services/ # API services
│   └── package.json
└── render.yaml      # Render deployment configuration
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
