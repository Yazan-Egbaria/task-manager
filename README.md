# 📝 Task Manager

A **full-stack task management app** with secure authentication, task CRUD, and email verification.

🔗 **Live Demo:** [task-manager-umber-alpha.vercel.app](https://task-manager-umber-alpha.vercel.app)

**Test Account**

📧 yazan@gmail.com  
🔑 123123123

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup](#setup)
- [Running Locally](#running-locally)
- [Getting the Verification Email](#getting-the-verification-email)
- [API Overview](#api-overview)

## 🚀 Overview

**User Flow**

1. **Sign Up** → receive a 6-digit verification code via email
2. **Verify Email** → activate your account
3. **Login** → secure session via JWT cookie
4. **Manage Tasks** → create, search, sort, complete, delete
5. **Logout** → session cleared automatically

## ✨ Features

### 🔐 Authentication

- Email/password signup with verification code
- JWT-based sessions (HTTP-only cookies)
- Account lockout after 3 failed attempts
- bcrypt password hashing + CSRF protection

### ✅ Task Management

- Create, edit, complete, and delete tasks
- Search, filter, and pagination (10 per page)
- Real-time updates + clean responsive UI

### ⚙️ Performance & UX

- MongoDB indexing for fast queries
- Toast notifications, loading & empty states
- Shareable URLs for search/page state

## 🧩 Tech Stack

**Frontend**

- React 18
- TypeScript
- Tailwind CSS
- Axios
- React Router
- React Toastify
- Vite

**Backend**

- Node.js
- Express
- MongoDB + Mongoose
- JWT
- bcrypt
- crypto
- CORS

## 🛠️ Setup

```bash
# Clone repository
git clone [https://github.com/Yazan-Egbaria/task-manager.git](https://github.com/Yazan-Egbaria/task-manager.git)
cd task-manager
```

### Install dependencies:

```
# Backend
cd server && npm install

# Frontend
cd ../client && npm install
```

### ▶️ Running Locally

```
# Run backend
cd server
npm start

# Run frontend
cd client
npm run dev
```

## 📧 Getting the Verification Email

After signing up with any email, retrieve your 6-digit verification code using the public mailbox API:

```
https://task-manager-bqzz.onrender.com/api/dev/mailbox?to=<your_registered_email_here>
e.g
https://task-manager-bqzz.onrender.com/api/dev/mailbox?to=test@gmail.com
```

The JSON response will look like this:

```
{
  "count": 1,
  "mails": [
    {
      "_id": "6725e7a9e3c9f5d3a88c1e9a",
      "to": "test@example.com",
      "subject": "Your verification code",
      "text": "Your verification code is 742891. It expires in 15 minutes.",
      "html": "<div style=\"font-family:sans-serif;line-height:1.6\"><h2>Verify your email</h2><p>Use this code to verify your account:</p><div style=\"font-size:24px;font-weight:bold;border:1px solid #ddd;padding:8px 12px;display:inline-block;border-radius:6px;background:#f9fafb\">742891</div><p style=\"font-size:13px;color:#777\">This code expires in 15 minutes.</p></div>",
      "meta": { "provider": "mock", "type": "verification" },
      "createdAt": "2025-11-02T20:00:00.000Z"
    }
  ]
}
```

Copy the 6-digit code and enter it in the verification form to activate your account.

## 📡 API Overview

Base URL

- Production → https://task-manager-bqzz.onrender.com/api
- Local → http://localhost:4000/api

```
Method	Endpoint	Description
POST	/auth/signup	Register new user
POST	/auth/verify	Verify email with code
POST	/auth/login	Login user
GET	/auth/me	Get current user
POST	/auth/logout	Logout
GET	/tasks	Get tasks (paginated & searchable)
POST	/tasks	Create new task
PUT	/tasks/:id	Update existing task
DELETE	/tasks/:id	Delete task
```
