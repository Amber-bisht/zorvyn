# Zorvyn Finance Dashboard - Advanced Backend 
LIVE LINK : https://zorvyn.amberbisht.me

A professional, secure, and highly scalable backend for a Finance Data Processing and Access Control system. Built with Node.js, Express, and Prisma, this project significantly exceeds the core requirements for the Backend Developer Internship assignment at Zorvyn FinTech by incorporating production-grade architecture and DevOps infrastructure.

---

## 🚀 Key Features

- **Layered Architecture**: Strictly separated Controllers, Services, and Utilities for maximum maintainability.
- **Robust Authentication**: Session-based authentication using `express-session` and PostgreSQL (Neon DB).
- **Advanced RBAC**: Role-Based Access Control enforcing permissions for **Admin**, **Analyst**, and **Viewer**.
- **Financial Record Management**: Full CRUD operations with **Soft Delete** functionality and filtering.
- **Dashboard Analytics**: Real-time aggregation for Total Income, Expenses, Balance, and Category breakdowns.
- **Data Pagination**: Efficient data fetching utilizing `page` and `limit` parameters.
- **Production-Ready Security**: Integrated with `helmet` for security headers, `cors` for cross-origin management, and **Redis-backed Rate Limiting** to prevent abuse.
- **Centralized Logging**: Configured with `winston` and `morgan` for robust observability.
- **Automated CI/CD**: Fully tokenized GitHub Actions pipeline (`deploy.yml`) utilizing GitHub Container Registry (GHCR) for automated zero-downtime SSH deployments.
- **Dockerized Infrastructure**: Complete setup with `Dockerfile` and `docker-compose.yml` orchestrating the backend and isolated internal Redis cache.

---

## 🛠️ Tech Stack

- **Runtime**: Node.js (TypeScript)
- **Framework**: Express.js
- **ORM**: Prisma 7
- **Database**: PostgreSQL (Neon DB)
- **Validation**: Zod
- **Caching & Rate Limiting**: Redis, `express-rate-limit`, `rate-limit-redis`
- **Security**: bcryptjs, helmet, cors
- **Session Management**: express-session, connect-pg-simple
- **DevOps**: Docker, GitHub Actions, GHCR

---

## 📂 Project Architecture

```text
/
├── .github/workflows/ # Action Scripts (GHCR Build & VPS Deploy)
├── Dockerfile         # Node Build Stage instructions
├── docker-compose.yml # Orchestrates Backend & isolated Redis
├── src/
│   ├── config/        # Environment logic (DB, Prisma, Redis, Session)
│   ├── controllers/   # Lightweight HTTP request handlers
│   ├── services/      # Core Business & Database querying logic
│   ├── middlewares/   # Auth, Error & RBAC guards
│   ├── routes/        # Express API endpoints
│   ├── validators/    # Zod payload strict-schemas
│   ├── utils/         # Winston Logger & Standardized API Payload formatters
│   └── index.ts       # Application Root (Middlewares, Ports, Rate Limiters)
```

---

## ⚡ Setup Instructions (Local & Docker)

### 1. Environment variables
Duplicate `.env.example` as `.env` and fill in the secrets.

### Option A: Local Run (Development)
1. **Install dependencies**: `npm install`
2. **Synchronize Schema**: `npx prisma db push`
3. **Start the server**: `npm run dev` (Ensure a local Redis server is active on `6379`).

### Option B: Docker Run (Production)
```bash
docker compose up -d --build
```
This handles Prisma generation, builds the TypeScript code, and spins up an isolated Redis container natively.

---

## 📑 API Documentation

The full working API suite details are available via the included [**Postman Collection**](./zorvyn.postman_collection.json).

### Complete Endpoints Cheat-Sheet:

| Category | Endpoint | Method | Role Required | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | POST | Public | Creates a new user (Default Viewer) |
| **Auth** | `/api/auth/login` | POST | Public | Authenticates and delivers session cookie |
| **Auth** | `/api/auth/logout` | POST | All Authenticated | Clears the session entirely |
| **Auth** | `/api/auth/me` | GET | All Authenticated | Returns current user profile |
| **Records** | `/api/records` | GET | ADMIN, ANALYST | Fetch paginated & filtered transactions |
| **Records** | `/api/records` | POST | ADMIN | Create a new financial record |
| **Records** | `/api/records/:id` | PUT | ADMIN | Update an existing record |
| **Records** | `/api/records/:id` | DELETE | ADMIN | Soft-delete a record |
| **Dashboard** | `/api/dashboard/summary` | GET | All Authenticated | Returns total balance, income, expense |
| **Dashboard** | `/api/dashboard/categories`| GET | All Authenticated | Grouped spending pattern analysis |
| **Dashboard** | `/api/dashboard/trends` | GET | All Authenticated | Monthly cashflow analytical trends |
| **Dashboard** | `/api/dashboard/recent` | GET | All Authenticated | Most recent 5 transactions |
| **Admin** | `/api/users` | GET | ADMIN | View all registered accounts |
| **Admin** | `/api/users/:id/status` | PATCH | ADMIN | Suspend or Activate (ACTIVE/INACTIVE) |
| **Admin** | `/api/users/:id/role` | PATCH | ADMIN | Promote or Demote via RBAC assignment |
| **System** | `/health` | GET | Public | Server uptime and health-check ping |
| **System** | `/` | GET | Public | Root welcome message |

---

## 🛡️ Security & Design Decisions

- **Session vs JWT**: Session-based authentication maximizes safety for financial systems, permitting absolute server-side session invalidation.
- **Service Layer Abstraction**: By separating business logic securely into `src/services`, the project supports high reusability and scalability.
- **GHCR Build Architecture**: Prevents continuous VPS resource exhaustion by performing the exact build steps purely on GitHub Runner machines.
- **Internal Redis Component**: The caching/spam-protection database intentionally omits host port maps, restricting network access entirely to the Docker ecosystem to avert conflicts.

---
To Create Admin

UPDATE users
SET role = 'ADMIN'
WHERE email = 'bishtamber0@gmail.com';




## 👨‍💻 Author

**Amber Bisht**  
*Backend Developer Intern Candidate*  
© 2026 Zorvyn FinTech Pvt. Ltd. | Assignment Submission
