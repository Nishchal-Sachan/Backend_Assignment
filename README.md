# Scalable REST API with Authentication & Role-Based Access

This repository contains the solution for the assignment, implementing a robust backend API and a supportive aesthetic frontend.

## Project Structure
```
.
├── backend/            # Express.js REST API with MongoDB
│   ├── src/            # Source code (MVC structure)
│   ├── server.js       # Entry point
│   └── .env            # Environment configurations
└── frontend/           # Vanilla JS, HTML, CSS Frontend
    ├── index.html      # Main UI
    ├── css/style.css   # Styling (Dark mode aesthetic)
    └── js/app.js       # Frontend Logic and API integration
```

## Features Complete

### ✅ Backend (Primary Focus)
- **Authentication:** User registration & login APIs with password hashing (bcryptjs) and JWT authentication.
- **Role-Based Access:** Support for `user` and `admin` roles, protected via middleware.
- **CRUD APIs:** Full Task management logic (Create, Read, Update, Delete) implemented with proper ownership checks.
- **API Architecture:** Clean Modular structure (Routes, Controllers, Services, Models, Middlewares, Validators).
- **Error Handling:** Global error handler with custom error messages.
- **Validation:** Input validation using `express-validator`.
- **Database:** MongoDB via Mongoose schema definitions.

### ✅ Basic Frontend (Supportive)
- **Tech:** Pure HTML, CSS, and Vanilla JavaScript (No build process required).
- **Aesthetic UI:** Premium modern dark-theme design with glassmorphism, dynamic animations, and responsive layout.
- **Authentication:** Login and Registration views.
- **Dashboard:** JWT Protected dashboard to manage tasks.
- **Interactions:** Modal dialogs for Task creation and updating.
- **Feedback:** Toast notification system for success and error handling from the API.

## How to Run Locally

### 1. Backend Setup
Make sure you have MongoDB running locally, or replace `MONGO_URI` in `.env` with an Atlas cluster URI.

```bash
cd backend
npm install
npm run dev  # Starts development server on port 5000
```
*(The `.env` file is already pre-configured for local testing).*

### 2. Frontend Setup
The frontend requires no build tools. You can run it directly:
- Open `frontend/index.html` in your web browser.
- Alternatively, use a local server like Live Server in VS Code, or `npx serve frontend`.

## Scalability Note
The backend has been designed with a service-oriented architecture (SOA) in mind. The separation of `controllers` (handling HTTP requests) and `services` (handling business logic) makes it easy to:
- Adopt Microservices in the future without huge refactoring.
- Introduce caching layers (like Redis) at the service level to reduce database queries.
- Easily write unit tests for isolated business logic.
- Containerize using Docker and orchestrate with Kubernetes to manage heavy loads horizontally behind load balancers like Nginx.
