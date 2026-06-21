# EliteMart — Full Stack E-Commerce App

Live Demo: [elitemartt.netlify.app](https://elitemartt.netlify.app)

A complete MERN stack e-commerce platform with everything you'd expect — product browsing, cart, checkout, order tracking, payments, and a full admin panel to manage it all.

---

## Features

- Browse and search products with filters
- Add to cart, update quantities, remove items
- Checkout with PayPal payment integration
- Email notifications via SendGrid + Nodemailer
- Product image uploads stored on Cloudinary
- Admin panel — manage products, orders, and users
- JWT authentication with HTTP-only cookies
- Forgot password / reset password via email
- Form validation on both frontend and backend
- Dark/Light theme toggle

---

## Tech Stack

**Frontend** — React 19, Vite 7, Tailwind CSS 4, React Router DOM 7, Axios, React Hook Form, React Hot Toast, React Icons

**Backend** — Node.js, Express 5, MongoDB + Mongoose, JWT, bcryptjs, Cloudinary, Multer, Joi, SendGrid, Nodemailer, Twilio, PayPal REST SDK, Cookie Parser, Morgan

---

## Project Structure

```
├── Backend/
│   ├── server.js
│   ├── app.js
│   └── src/
│       ├── controllers/
│       │   └── user/
│       ├── middlewares/
│       ├── models/
│       │   ├── address.model.js
│       │   ├── cart.model.js
│       │   ├── order.model.js
│       │   ├── product.model.js
│       │   ├── review.model.js
│       │   └── user.model.js
│       ├── routes/
│       ├── seed/
│       ├── utils/
│       │   ├── ApiResponse.js
│       │   ├── catchAsync.js
│       │   ├── cloudinary.util.js
│       │   ├── CustomError.js
│       │   ├── jwt.util.js
│       │   ├── nodemailer.util.js
│       │   ├── order.util.js
│       │   └── review.util.js
│       └── validators/
│           ├── address.validator.js
│           └── user.validator.js
│
└── FrontEnd/
    └── src/
        ├── assets/
        ├── component/
        ├── context/
        │   ├── AuthContext.jsx
        │   ├── CartContext.jsx
        │   └── ThemeContext.jsx
        ├── pages/
        │   ├── admin/
        │   ├── Cart.jsx
        │   ├── Checkout.jsx
        │   ├── ForgotPassword.jsx
        │   ├── Home.jsx
        │   ├── Login.jsx
        │   ├── Orders.jsx
        │   ├── ProductDetail.jsx
        │   ├── ProductsPage.jsx
        │   ├── Profile.jsx
        │   ├── Register.jsx
        │   ├── ResetPassword.jsx
        │   └── VerifyEmail.jsx
        └── services/
            ├── addressService.js
            ├── adminService.js
            ├── authService.js
            ├── cartService.js
            └── api.js
```

---

## Getting Started

You'll need Node.js, MongoDB, and a few API keys (listed below) before running the project.

```bash
git clone <repo-url>
cd <project-folder>

# Backend
cd Backend
npm install
# create .env file
npm start

# Frontend (new terminal)
cd FrontEnd
npm install
npm run dev
```

Backend runs on port 5000, frontend on port 5173.

---

## Environment Variables

Create a `.env` file in the `Backend/` folder:

```env
# Database
MONGODB_URI=

# Auth
JWT_SECRET=
JWT_EXPIRE=

# Cloudinary
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Email
SENDGRID_API_KEY=
SENDGRID_FROM_EMAIL=
NODEMAILER_USER=
NODEMAILER_PASS=

# SMS (Twilio)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# PayPal
PAYPAL_CLIENT_ID=
PAYPAL_SECRET=
PAYPAL_MODE=sandbox

# App
PORT=5000
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

---

## Roles

| Role | Access |
|---|---|
| Customer | Browse, cart, checkout, orders, profile, reviews |
| Admin | Manage products, view and update orders, manage users |

---

## Security

- Passwords hashed with bcryptjs
- JWT stored in HTTP-only cookies
- All inputs validated with Joi on the backend and React Hook Form on the frontend
- Protected routes for both customer and admin areas
- CORS restricted to frontend origin

---

## Author

Built by **Aman Giri**

[Portfolio](https://amanportfol.netlify.app) · [GitHub](https://github.com/Aman-Giri01)
