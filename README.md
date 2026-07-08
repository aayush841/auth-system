# 🔐 Auth-System

A secure authentication system built on the **MERN (MongoDB, Express, React, Node.js)** stack. This application features seamless **Google OAuth 2.0 Single Sign-On**, active **session management**, and **automated background email security notifications** that alert users instantly whenever a login occurs on a new device or IP address.

---

## ✨ Features

* **Google OAuth 2.0 Integration:** Secure login flow leveraging Google's identity provider.
* **Session Management:** Stores active user sessions with explicit tracking of login timestamps, expiration, and identifiers in MongoDB.
* **Background Security Alerts:** Uses Nodemailer and the native Node.js background thread pool to send real-time login alerts via Gmail SMTP without delaying client responses.

---

## 🛠️ Tech Stack
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose ORM
* **Mailing:** Nodemailer

---

## ⚙️ Prerequisites

Ensure you have the following installed locally:
* [Node.js](https://nodejs.org/) (v16.x or higher)
* [MongoDB](https://www.mongodb.com/) (Local instance or Atlas URI)
* A Google Developer account (for Client ID & Secret)
* A Gmail account with an **App Password** configured

---

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/aayush841/auth-system.git
cd Auth-System
```

### 2. Configure Environment Variables
Create a `.env` file in the root of your backend directory and append your specific secrets:

```env
# Server Configuration
PORT = 8080
CLIENT_URL = http://localhost:3000
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:2017/auth_system

#JWT Secret
ACCESS_TOKEN_SECRET=secret_access_key_12345!
REFRESH_TOKEN_SECRET=secret_refresh_key_67890!

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Mailer Configuration (Gmail SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=your_gmail_address@gmail.com
SMTP_PASS=your_16_digit_app_password
EMAIL_FROM="Auth-System Security <your_gmail_address@gmail.com>"
```

### 3. Install Dependencies & Run

#### Backend
```bash
npm install
npm run dev
```

---

## 📦 Project Structure

```text
Auth-System/
    ├── src/
    │   ├── config/      # Database and Passport OAuth setups
    │   ├── controllers/ # Auth and Session controllers
    │   ├── models/      # Mongoose User and Session schemas
    │   ├── services/    # email.service.js (Nodemailer setup)
    │   └── server.js    # Express entry point

```
