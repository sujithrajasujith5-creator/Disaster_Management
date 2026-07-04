# Disaster Reporting and Help Request Portal

A full-stack web application for schools and colleges to report disasters/emergencies on campus and request immediate help. Administrators can monitor, manage, and respond to incidents efficiently.

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React.js, React Router, Tailwind CSS, Chart.js, Axios, Context API |
| Backend | Node.js, Express.js, JWT, Multer, bcrypt |
| Database | MongoDB Atlas |

## Features

- **Authentication** — Register, login, JWT auth, role-based access (Admin, User), forgot/reset password
- **Incident Reporting** — Create reports with disaster type, severity, location, evidence upload, emergency help requests
- **Status Tracking** — Submitted → Under Review → In Progress → Resolved
- **Admin Dashboard** — Analytics, search/filter/sort, assign admins, comments, emergency broadcasts
- **Notifications** — Status updates, assignments, emergency alerts with read/unread tracking
- **UI** — Responsive design, dark/light mode, toast notifications, Chart.js analytics

## Project Structure

```
sih/
├── backend/
│   ├── src/
│   │   ├── config/         # Database connection
│   │   ├── controllers/    # Route handlers (MVC)
│   │   ├── middleware/     # Auth, upload, validation, errors
│   │   ├── models/         # MongoDB schemas
│   │   ├── routes/         # REST API routes
│   │   ├── utils/          # JWT, email helpers
│   │   ├── app.js
│   │   ├── server.js
│   │   └── seed.js         # Sample data
│   ├── uploads/            # Uploaded evidence files
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth & Theme context
│   │   ├── pages/          # Route pages
│   │   ├── services/       # Axios API layer
│   │   └── utils/          # Helpers & constants
│   └── package.json
└── README.md
```

## Prerequisites

- [Node.js](https://nodejs.org/) v18+
- [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)

## MongoDB Atlas Setup

1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a database user with read/write permissions
3. Add your IP address to **Network Access** (or `0.0.0.0/0` for development)
4. Copy the connection string from **Connect → Drivers**

## Installation

### 1. Clone and install dependencies

```bash
# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install
```

### 2. Configure environment variables

**Backend** — copy and edit:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/disaster-portal?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
```

**Frontend** (optional — defaults to proxy):

```bash
cd frontend
cp .env.example .env
```

### 3. Seed the database

```bash
cd backend
npm run seed
```

### 4. Start the application

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm run dev
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:5000/api
- Health check: http://localhost:5000/api/health

## Demo Accounts

| Role    | Email               | Password   |
|---------|---------------------|------------|
| Admin   | admin@campus.edu    | admin123   |
| Admin   | staff@campus.edu    | staff123   |
| User    | student@campus.edu  | student123 |

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/forgot-password` | Request reset link |
| PUT | `/api/auth/reset-password/:token` | Reset password |
| GET | `/api/auth/admins` | List admins (admin) |

### Incidents
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/incidents/dashboard` | Dashboard stats |
| GET | `/api/incidents/my` | User's reports |
| POST | `/api/incidents` | Create report (multipart) |
| GET | `/api/incidents/:id` | Get report |
| PUT | `/api/incidents/:id` | Update report |
| DELETE | `/api/incidents/:id` | Delete report |
| GET | `/api/incidents` | All reports (admin) |
| PUT | `/api/incidents/:id/status` | Update status |
| GET | `/api/incidents/admin/statistics` | Analytics (admin) |

### Help Requests
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/help-requests` | Create help request |
| GET | `/api/help-requests/my` | User's requests |
| GET | `/api/help-requests` | All requests (admin) |
| PUT | `/api/help-requests/:id` | Update request |

### Notifications
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/notifications` | User notifications |
| PUT | `/api/notifications/:id/read` | Mark as read |
| POST | `/api/notifications/emergency` | Broadcast alert (admin) |

### Comments
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/incidents/:id/comments` | Get comments |
| POST | `/api/incidents/:id/comments` | Add comment |

## Database Collections

- **Users** — Authentication, roles, profile
- **IncidentReports** — Disaster reports with evidence
- **HelpRequests** — Emergency help requests linked to incidents
- **Notifications** — Alerts and status updates
- **Comments** — Public and internal notes on incidents

## License

MIT
