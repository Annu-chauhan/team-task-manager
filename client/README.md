# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
# Team Task Manager

Team Task Manager is a full-stack web application built using React, Node.js, Express, and MongoDB.

The application allows users to manage projects and tasks in an organized way with secure authentication and dashboard tracking features.

---

## Features

- User Signup and Login
- JWT Authentication
- Protected Routes
- Create Projects
- Create Tasks
- Update Task Status
- Delete Tasks
- Dashboard with Task Statistics
- REST API Integration
- MongoDB Database
- Role-Based Access Control

---

## Tech Stack

### Frontend
- React.js
- Vite
- Axios
- React Router DOM

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication

### Deployment
- Vercel (Frontend)
- Railway (Backend)

---

## Live Project Links

Frontend:
https://annu-chauhan-team-task-manager-quc2-9qeltvybm.vercel.app

Backend:
https://team-task-manager-production-53bc.up.railway.app

---

## API Routes

### Authentication
- POST /api/auth/signup
- POST /api/auth/login

### Tasks
- GET /api/tasks
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

### Projects
- POST /api/projects

### Dashboard
- GET /api/dashboard

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Annu-chauhan/team-task-manager.git

Frontend Setup
cd client
npm install
npm run dev
Backend Setup
cd server
npm install
npm start
Environment Variables

Create a .env file inside the server folder:

MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret_key
PORT=5000
Project Goal

The purpose of this project was to build a complete full-stack task management application with authentication, REST APIs, database integration, and deployment.

Author

Annu Chauhan


Then save and run:

```bash id="f6l2jm"
git add .
git commit -m "updated readme"
git push origin main