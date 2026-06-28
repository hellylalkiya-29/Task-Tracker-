# TaskFlow — MERN Stack Task Tracker

A full-featured task management web application built with the MERN stack.

🔗 **Live Demo:** https://task-tracker-omega-pearl.vercel.app  
📁 **GitHub:** https://github.com/hellylalkiya-29/Task-Tracker-

---

## Features

- ✅ Create, Read, Update, Delete Tasks (CRUD)
- 🔍 Search tasks by title, description, tags
- 🎛 Filter by Status and Priority
- ↕ Sort by Date, Title, Priority
- 📊 Live Stats Bar (Total, To Do, In Progress, Done)
- ⚡ One-click Status Cycling
- ⚠ Overdue Task Highlighting
- 🏷 Tag Support
- 🔔 Toast Notifications
- 📱 Fully Responsive (Mobile + Desktop)
- 🌙 Dark Theme

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Context API, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Deployment | Vercel (Frontend), Render (Backend) |

---

## Project Structure
task-tracker/

├── backend/

│   ├── models/

│   │   └── Task.js

│   ├── routes/

│   │   └── tasks.js

│   └── server.js

│

└── frontend/

└── src/

├── components/

│   ├── FilterBar.jsx

│   ├── StatsBar.jsx

│   ├── TaskCard.jsx

│   ├── TaskList.jsx

│   └── TaskModal.jsx

├── context/

│   └── TaskContext.jsx

├── hooks/

│   └── useDebounce.js

├── pages/

│   └── Home.jsx

└── utils/

└── api.js

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/stats` | Get task stats |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| PATCH | `/api/tasks/:id` | Partial update |
| DELETE | `/api/tasks/:id` | Delete task |

---

## Local Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Add your MongoDB URI in .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
# Create .env with REACT_APP_API_URL=http://localhost:5000/api
npm start
```

---

## Environment Variables

### Backend
| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB Atlas connection string |
| `PORT` | Server port (default: 5000) |
| `NODE_ENV` | production / development |
| `FRONTEND_URL` | Allowed CORS origin |

### Frontend
| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend API URL |

---

## Deployment

- **Frontend** → Vercel
- **Backend** → Render
- **Database** → MongoDB Atlas

---

Built for COLL-EDGE CONNECT Full Stack Developer Intern Assignment — June 2026

by Helly Lalkiya❤️