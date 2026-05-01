# Task Management API

A scalable REST API with Authentication & Role-Based Access.

## Features
- User registration & login (JWT)
- Role-based access (user vs admin)
- CRUD operations for Tasks
- Error handling & validation
- API versioning

## Tech Stack
- Node.js
- Express.js
- MongoDB & Mongoose
- JWT for authentication
- bcryptjs for password hashing

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Setup `.env` file in the root directory:
```
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

3. Run the application:
```bash
npm start
# or for development
npm run dev
```

## API Endpoints

### Auth
- `POST /api/v1/auth/register` - Register a user
- `POST /api/v1/auth/login` - Login a user
- `GET /api/v1/auth/me` - Get current user (Protected)

### Tasks
- `GET /api/v1/tasks` - Get all tasks (Protected)
- `POST /api/v1/tasks` - Create a task (Protected)
- `PUT /api/v1/tasks/:id` - Update a task (Protected)
- `DELETE /api/v1/tasks/:id` - Delete a task (Protected, Admin/Owner)

## API Documentation
This repository includes both Swagger UI and a Postman Collection for testing the API.

1. **Swagger UI**: Start the backend and navigate to [http://localhost:5000/api-docs](http://localhost:5000/api-docs) to view and test the API interactively.
2. **Postman Collection**: A `TaskMaster.postman_collection.json` file is located in the `backend/` directory. You can import this directly into Postman.

## Scalability Note
This application uses a modular architecture (Controllers, Services, Routes, Models) which makes it easy to scale horizontally. In a production environment, this application could be deployed using Docker containers orchestrated by Kubernetes. Caching layers like Redis can be introduced at the service layer to reduce database load for frequent queries. Load balancing via Nginx or cloud load balancers could handle high traffic.
