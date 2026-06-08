# Express MongoDB REST API

A RESTful API built with **Express.js** and **MongoDB**, designed as a backend service for a Flutter mobile application. Implements JWT authentication with Bearer tokens, role-based authorization, and a clean Model-Controller-Service-Route architecture.

---

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: MongoDB via Mongoose
- **Authentication**: JSON Web Token (JWT)
- **Validation**: Zod
- **Security**: bcryptjs
- **Others**: cors, dotenv

---

## Project Structure

```
src/
├── config/
│   └── db.js                   # MongoDB connection
├── controllers/
│   ├── auth.controller.js
│   ├── profile.controller.js
│   └── user.controller.js
├── middlewares/
│   ├── auth.middleware.js      # JWT authenticate & authorize
│   ├── error.middleware.js     # Global error handler
│   └── validate.middleware.js  # Zod validation
├── models/
│   ├── profile.model.js
│   ├── revoked_token.model.js
│   └── user.model.js
├── routes/
│   ├── auth.routes.js
│   ├── profile.routes.js
│   └── user.routes.js
├── services/
│   ├── auth.service.js
│   ├── profile.service.js
│   ├── token.service.js
│   └── user.service.js
├── utils/
│   ├── errors.js               # Custom error classes
│   ├── pagination.js           # Pagination helper
│   ├── response.js             # Centralized response formatter
│   └── token.js                # JWT sign & verify
├── validators/
│   ├── auth.validator.js
│   ├── profile.validator.js
│   └── user.validator.js
├── app.js
└── server.js
```

---

## Getting Started

### Prerequisites

- Node.js v18+
- MongoDB (standalone or Atlas)

> **Note:** If using a local standalone MongoDB, transactions are not supported. Either use MongoDB Atlas or configure a local replica set.

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name

# Install dependencies
npm install

# Copy environment file
cp .env.example .env
```

### Environment Variables

Edit `.env` and fill in your values:

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/express_api
ACCESS_TOKEN_SECRET=your_access_token_secret_here
REFRESH_TOKEN_SECRET=your_refresh_token_secret_here
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000
```

### Running the Server

```bash
# Development
npm run dev

# Production
npm start
```

---

## Authentication

This API uses **JWT Bearer Token** authentication.

### Flow

```
POST /api/auth/login
  → returns accessToken + refreshToken in response body

Every request:
  → Authorization: Bearer <accessToken>

If 401 (token expired):
  → POST /api/auth/refresh with { refreshToken }
  → get new accessToken + refreshToken
  → retry original request
```

### Token Details

| Token | Expiry | Storage (Flutter) |
|---|---|---|
| Access Token | 15 minutes | `flutter_secure_storage` |
| Refresh Token | 7 days | `flutter_secure_storage` |

---

## API Reference

### Auth

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user |
| `POST` | `/api/auth/login` | Public | Login and get tokens |
| `POST` | `/api/auth/refresh` | Public | Refresh access token |
| `POST` | `/api/auth/logout` | User | Logout and revoke token |
| `GET` | `/api/auth/me` | User | Get current user |

### Users

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/users` | Admin | Get all users (paginated) |
| `POST` | `/api/users` | Admin | Create user |
| `GET` | `/api/users/:id` | Admin | Get user by ID |
| `PATCH` | `/api/users/:id` | Admin | Update user |
| `DELETE` | `/api/users/:id` | Admin | Delete user |

### Profiles

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/profiles` | Admin | Create profile + auto-create user |
| `GET` | `/api/profiles` | Admin | Get all profiles (paginated) |
| `GET` | `/api/profiles/:id` | Admin | Get profile by ID |
| `DELETE` | `/api/profiles/:id` | Admin | Delete profile |
| `GET` | `/api/profiles/me` | User | Get own profile |

---

## Request & Response Examples

### Register

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "Admin Utama",
  "email": "admin@app.com",
  "password": "admin123",
  "role": "admin"
}
```

```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "xxx",
      "name": "Admin Utama",
      "email": "admin@app.com",
      "role": "admin"
    }
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@app.com",
  "password": "admin123"
}
```

```json
{
  "status": "success",
  "data": {
    "user": { "_id": "xxx", "name": "Admin Utama", "email": "admin@app.com" },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci..."
  }
}
```

### Create Profile (Admin)

```http
POST /api/profiles
Authorization: Bearer <accessToken>
Content-Type: application/json

{
  "children": [
    {
      "fullName": "Budi Santoso",
      "birthDate": "2015-03-10",
      "birthPlace": "Jakarta",
      "gender": "male"
    }
  ],
  "parents": [
    {
      "fullName": "Ahmad Santoso",
      "phone": "081234567890",
      "gender": "male"
    }
  ],
  "address": "Jl. Sudirman No. 10, Jakarta Pusat"
}
```

```json
{
  "status": "success",
  "data": {
    "credentials": {
      "email": "budisantoso@app.com",
      "password": "budisantoso@123"
    },
    "profile": {
      "userId": { "email": "budisantoso@app.com", "role": "user" },
      "children": [{ "fullName": "Budi Santoso", "gender": "male" }],
      "parents": [{ "fullName": "Ahmad Santoso", "phone": "081234567890" }],
      "address": "Jl. Sudirman No. 10, Jakarta Pusat"
    }
  }
}
```

### Validation Error Response

```json
{
  "status": "error",
  "message": "Validation failed",
  "errors": {
    "email": "Invalid email address",
    "password": "Password must be at least 8 characters"
  }
}
```

### Paginated Response

```json
{
  "status": "success",
  "data": { "users": [] },
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 10,
    "totalPages": 10
  }
}
```

---

## Error Classes

| Class | Status Code | Usage |
|---|---|---|
| `AppError` | Custom | Base error class |
| `NotFoundError` | 404 | Resource not found |
| `ValidationError` | 422 | Zod validation failed |
| `UnauthorizedError` | 401 | Missing or invalid token |
| `ForbiddenError` | 403 | Insufficient role |

---

## Default User Credentials

When admin creates a profile, a user account is **automatically generated** with default credentials derived from the first child's full name:

```
fullName : "Budi Santoso"
email    : budisantoso@app.com
password : budisantoso@123
```

These credentials are returned in the create profile response. Users should change their password after first login.

---

## License

[MIT](LICENSE)