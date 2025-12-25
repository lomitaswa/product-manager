# Backend API Documentation

This document lists all the available API endpoints in the Product Manager backend.

## Base URL
The default base URL for the API is `http://localhost:3000/api`.

---

## Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/login` | Authenticate user and receive JWT | No |
| `POST` | `/register` | Register a new user | No |

## Categories (`/api/categories`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | List all categories | Yes (JWT) |
| `GET` | `/:id` | Get category details (expects UUID) | Yes (JWT) |
| `POST` | `/` | Create a new category | Yes (JWT) |
| `PUT` | `/:id` | Update an existing category | Yes (JWT) |
| `DELETE` | `/:id` | Delete a category | Yes (JWT) |

---

## Products (`/api/products`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/` | List products with filters & pagination | Yes (JWT) |
| `GET` | `/:id` | Get product details | Yes (JWT) |
| `POST` | `/` | Create a new product | Yes (JWT) |
| `POST` | `/upload` | Upload product image (Multipart) | Yes (JWT) |
| `PATCH` | `/:id` | Update an existing product | Yes (JWT) |
| `DELETE` | `/:id` | Delete a product | Yes (JWT) |

**Query Parameters for `GET /`**:
- `category_id`: Filter by category (UUID)
- `search`: Search by product name
- `sortBy`: `price` or `name`
- `sortOrder`: `asc` or `desc`
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

---

## Bulk Uploads (`/api/uploads`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/products` | Bulk upload products via CSV/XLSX | No |

---

## Reports (`/api/reports`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/products` | Trigger background report generation | Yes (JWT) |
| `GET` | `/products` | List all report generation jobs | Yes (JWT) |
| `GET` | `/status/:jobId` | Check status of a specific report job | Yes (JWT) |
| `GET` | `/download/:jobId` | Download the completed report file | Yes (JWT) |
| `DELETE` | `/:jobId` | Delete a report job record | Yes (JWT) |

---

## Static Files
Uploaded files are served statically at `/uploads`.
- Example image URL: `http://localhost:3000/uploads/products/<filename>.png`
