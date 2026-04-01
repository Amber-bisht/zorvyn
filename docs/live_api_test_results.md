# Zorvyn Live API Test Results
**Target URL:** https://zorvyn.amberbisht.me
**Date:** 2026-04-01T19:02:44.312Z

---

### [POST] /api/auth/login
**Request Body:**
```json
{
  "email": "bishtamber0@gmail.com",
  "password": "@amber?123AMBER"
}
```
**Status:** 200
**Response Body:**
```json
{
  "success": true,
  "message": "Login success",
  "data": {
    "user": {
      "id": "9b184c32-d764-4d75-85dd-cd8e3b0f9143",
      "email": "bishtamber0@gmail.com",
      "name": "Amber",
      "role": "ADMIN"
    }
  }
}
```
---

### [POST] /api/records
**Request Body:**
```json
{
  "amount": 4500.5,
  "type": "INCOME",
  "category": "Freelance",
  "description": "Automated API Test Income"
}
```
**Status:** 401
**Response Body:**
```json
{
  "message": "Please login first! We Check Login Stop Messing with me"
}
```
---

### [GET] /api/records
**Status:** 401
**Response Body:**
```json
{
  "message": "Please login first! We Check Login Stop Messing with me"
}
```
---

### [GET] /api/dashboard/summary
**Status:** 401
**Response Body:**
```json
{
  "message": "Please login first! We Check Login Stop Messing with me"
}
```
---

### [GET] /api/dashboard/categories?type=INCOME
**Status:** 401
**Response Body:**
```json
{
  "message": "Please login first! We Check Login Stop Messing with me"
}
```
---

### [GET] /api/users
**Status:** 401
**Response Body:**
```json
{
  "message": "Please login first! We Check Login Stop Messing with me"
}
```
---

### [POST] /api/auth/logout
**Status:** 200
**Response Body:**
```json
{
  "success": true,
  "message": "Logout success done",
  "data": null
}
```
---
