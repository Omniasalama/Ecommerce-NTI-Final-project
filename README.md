<!-- @format -->

# NTI Backend Development Final Project: E-Commerce & HR Management System

A comprehensive Node.js backend solution integrating a full-featured E-Commerce platform with a real-time notification system and an automated HR Management module.

## 📌 Project Overview

This project was developed as the final assessment for the NTI Backend Development track. It focuses on clean architecture, secure authentication, and complex business logic for e-commerce and staff management.

## 🛠️ Tech Stack

- [cite_start]**Runtime:** Node.js [cite: 3, 7]
- [cite_start]**Framework:** Express.js [cite: 3, 7]
- [cite_start]**Database:** MongoDB with Mongoose ODM [cite: 3, 7]
- [cite_start]**Real-time:** Socket.io [cite: 7, 134]
- [cite_start]**Security:** JWT, bcrypt, Helmet, Joi validation [cite: 7, 200]
- [cite_start]**Communications:** Nodemailer [cite: 7]

## 🚀 Installation Instructions

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Omniasalama/Ecommerce-NTI-Final-project.git](https://github.com/Omniasalama/Ecommerce-NTI-Final-project.git)
    cd Ecommerce-NTI-Final-project
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Environment Setup:**
    Create a `.env` file in the root directory based on the provided `.env.example`[cite: 200, 204].
4.  **Run the application:**
    ```bash
    # Development mode
    npm run dev
    # Production mode
    npm start
    ```

## 📂 Project Structure

- [cite_start]`src/modules/`: Contains logic for Auth, Users, Products, Cart, Orders, and HR[cite: 27, 45, 65, 151].
- [cite_start]`src/middleware/`: Auth guards, file upload (Multer), and error handling[cite: 17, 19, 20].
- [cite_start]`src/database/`: Connection setup and Mongoose schemas[cite: 24, 26].
- [cite_start]`common/email/`: Nodemailer configuration for verification[cite: 14, 15, 16].

## 📡 API Endpoints Documentation

### [cite_start]Authentication [cite: 46, 49]

- `POST /api/v1/auth/signup` - Register and send verification email.
- `POST /api/v1/auth/verify-email/:token` - Activate account.
- `POST /api/v1/auth/login` - Returns Access & Refresh tokens.

### [cite_start]E-Commerce [cite: 75, 94, 102]

- `GET /api/v1/products` - Filter by price/category with pagination.
- `POST /api/v1/cart` - Add items (validates stock).
- `POST /api/v1/orders/checkout` - COD and Stripe (Bonus) support.

### [cite_start]HR Management [cite: 151, 173, 191]

- `POST /api/v1/staff/checkin` - Daily attendance tracking.
- `GET /api/v1/admin/staff/:id/salary/:month` - Auto-calculates salary based on attendance and deductions.

## [cite_start]🔔 Socket.io Events [cite: 140, 142]

- `authenticate`: Client sends JWT for socket connection.
- `admin:send-offer`: Admin broadcasts promotional messages.
- `user:receive-offer`: Real-time notification received by users.

## 🔒 Security & Validation

- [cite_start]Password hashing with bcrypt (12 salt rounds)[cite: 52].
- [cite_start]Input validation via Joi for all endpoints[cite: 200].
- [cite_start]Soft-delete logic for Users, Products, and Staff[cite: 61, 84, 155].
