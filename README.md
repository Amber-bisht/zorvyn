# Zorvyn Finance Dashboard - Backend

A professional, secure, and scalable backend for a Finance Data Processing and Access Control system. Built with Node.js, Express, and Prisma, this project fulfills the requirements for the Backend Developer Internship assignment at Zorvyn FinTech.

## 🚀 Key Features

- **Robust Authentication**: Session-based authentication using `express-session` and PostgreSQL (Neon DB).
- **Advanced RBAC**: Role-Based Access Control enforcing permissions for **Admin**, **Analyst**, and **Viewer**.
- **Financial Record Management**: Full CRUD with **Soft Delete** functionality and filtering.
- **Dashboard Analytics**: Real-time aggregation for Total Income, Expenses, Balance, and Category breakdowns.
- **Data Pagination**: Efficient data fetching with `page` and `limit` support.
- **Production-Ready Security**: Integrated with `helmet` for security headers and `cors` for cross-origin management.
- **Strict Validation**: Type-safe input validation using **Zod**.
- **Centralized Database**: Optimized PostgreSQL on Neon with explicit indexing for analytics performance.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js
- **ORM**: Prisma 7
- **Database**: PostgreSQL (Neon DB)
- **Validation**: Zod
- **Security**: bcryptjs, helmet, cors
- **Session**: express-session, connect-pg-simple

---

## 📂 Project Structure

```text
src/
├── config/           # DB Connection, Prisma, and Session configs
├── controllers/      # Business logic (Auth, Records, Dashboard, Users)
├── middlewares/      # Auth & RBAC logic
├── routes/           # API Endpoint definitions
├── validators/       # Zod schemas for request validation
└── index.ts          # Server entry point
```

---

## ⚡ Setup Instructions

1. **Clone the repository**:
   ```bash
   git clone <repo-url>
   cd assignment
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root with:
   ```env
   DATABASE_URL="your_postgresql_connection_string"
   SESSION_SECRET="your_secure_secret_key"
   PORT=3000
   NODE_ENV="development"
   ```

4. **Synchronize Database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the server**:
   ```bash
   npm run dev
   ```

---

## 📑 API Documentation

The full API documentation is available via the included [**Postman Collection**](./zorvyn.postman_collection.json).

### Summary of Endpoints:

| Category | Endpoint | Method | Role Required |
| :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | POST | Public |
| **Auth** | `/api/auth/login` | POST | Public |
| **Records** | `/api/records` | GET | All Authenticated |
| **Records** | `/api/records` | POST | ADMIN |
| **Dashboard** | `/api/dashboard/summary` | GET | All Authenticated |
| **Dashboard** | `/api/dashboard/categories` | GET | All Authenticated |
| **Admin** | `/api/users` | GET | ADMIN |
| **Admin** | `/api/users/:id/status` | PATCH | ADMIN |

---

## 🛡️ Security & Design Decisions

- **Session vs JWT**: Session-based auth was chosen for better security in finance applications, allowing server-side session invalidation.
- **Soft Delete**: Records are never permanently deleted from the DB; they are marked with an `isDeleted` flag to maintain audit trails.
- **Database Indexing**: Explicit indexes were added to `type`, `date`, and `category` fields to ensure analytics queries remain fast as the dataset grows.
- **Centralized Error Handling**: A global middleware handles all unexpected errors gracefully.

---

## 👨‍💻 Author

**Amber Bisht**  
*Backend Developer Intern Candidate*  
© 2026 Zorvyn FinTech Pvt. Ltd. | Assignment Submission
