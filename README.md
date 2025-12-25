# Product Manager Application

A comprehensive full-stack application for managing products and categories, featuring bulk upload capabilities and automated report generation.

## Features

- **Authentication**: Secure user login and registration using JWT.
- **Product Management**: Full CRUD operations for products, including image uploads.
- **Category Management**: Organize products into categories with full CRUD support.
- **Bulk Upload**: Asynchronous bulk upload of products via CSV or XLSX files using RabbitMQ workers.
- **Report Generation**: Export product data to CSV/Excel reports processed in the background.
- **Modern UI**: Built with Angular 19 and Angular Material with a sleek glassmorphism design.
- **Robust Backend**: Express-based REST API with PostgreSQL and automated testing.

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL
- RabbitMQ
- Angular 19

## Getting Started

### 1. Clone the repository
```bash
git clone git@github.com:lomitaswa/product-manager.git
cd product-manager
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=product_manager
RABBITMQ_URL=amqp://localhost
JWT_SECRET=secret
```

Initialize RabbitMQ queues:
```bash
npm run init-rabbitmq
```

Start the backend (including workers):
```bash
npm run start-all
```

### 3. Frontend Setup
Navigate to the frontend directory and install dependencies:
```bash
cd ../frontend
npm install
```

Start the development server:
```bash
npm start
```
The application will be available at `http://localhost:4200`.

## Scripts

### Backend
- `npm run dev`: Starts the server with nodemon.
- `npm run start-all`: Starts the main server and both the bulk-upload and report workers.
- `npm run test`: Runs the Jest test suite.
- `npm run test:coverage`: Generates a test coverage report.
- `npm run init-rabbitmq`: Creates the necessary exchanges and queues in RabbitMQ.

### Database Utilities (via ts-node)
Found in `backend/scripts/`:
- `reset_db.ts`: Resets the database schema (CAUTION: Deletes all data).
- `backup_data.ts`: Creates a backup of current data.
- `restore_data.ts`: Restores data from a backup.

### Frontend
- `npm start`: Runs the Angular development server.
- `npm run build`: Builds the production bundle.
- `npm test`: Runs Karma unit tests.
