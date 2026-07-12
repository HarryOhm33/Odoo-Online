# AssetFlow - Enterprise Asset Management Platform

AssetFlow (formerly Odoo-Online) is a modern, full-stack Enterprise Asset Management (EAM) platform built with the MERN stack (MongoDB, Express, React, Node.js). It provides organizations with a centralized system to track, allocate, maintain, and audit their physical and digital assets across different departments.

**🌐 Live Demo:** [https://assetsfloww.netlify.app/](https://assetsfloww.netlify.app/)
## 🌟 Key Features

- **Role-Based Access Control (RBAC):** Distinct portals for Admin, Department Head, Asset Manager, and regular Employees.
- **Asset Lifecycle Management:** Register, track, allocate, and return assets seamlessly.
- **Asset Transfers:** Request and approve inter-departmental asset transfers.
- **Maintenance Tracking:** Report issues, assign technicians, and track resolution of damaged assets.
- **Audit Cycles:** Schedule and execute periodic inventory audits to verify asset presence and condition.
- **Resource Bookings:** Allow employees to book shared resources (e.g., meeting rooms, projectors) for specific time slots.
- **Real-Time Notifications:** In-app notification system to alert users of approvals, transfers, and maintenance updates.
- **Modern UI/UX:** Premium dark-mode interface built with Tailwind CSS, featuring glassmorphism elements, smooth transitions, and responsive design.

## 🛠️ Tech Stack

**Frontend:**
- React 19 (Vite)
- React Router v7
- Tailwind CSS v4
- Framer Motion (Animations)
- Lucide React & React Icons
- Axios

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Tokens (JWT) & bcryptjs for Authentication
- Node-cron for background jobs
- AWS SDK & Nodemailer (Email services)

## 📁 Project Structure

```
├── backend/                  # Node.js Express API
│   ├── controllers/          # Request handlers
│   ├── middleware/           # Auth and RBAC middlewares
│   ├── models/               # Mongoose schemas
│   ├── routes/               # API endpoints
│   ├── server.js             # Express app entry point
│   └── package.json          
│
├── frontend/                 # React Application
│   ├── src/
│   │   ├── components/       # Reusable UI components & layouts
│   │   ├── config/           # Sidebar & permission configs
│   │   ├── contexts/         # React Context (Auth)
│   │   ├── hooks/            # Custom hooks
│   │   ├── Pages/            # Route pages (Admin, App, Auth, Home)
│   │   ├── services/         # API client setup (axios)
│   │   ├── App.jsx           # Main React component & Routing
│   │   └── main.jsx          # React DOM entry
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB (Local or Atlas)
- Git

### Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd Odoo-Online
   ```

2. **Backend Setup:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory and add the following variables:
   ```env
   PORT=8001
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   # AWS SES Email Config
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   SES_FROM_EMAIL=your_verified_sender_email
   FRONTEND_URL=http://localhost:5173
   ```
   Start the backend development server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup:**
   Open a new terminal window/tab:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory if you need to override the API URL (defaults to localhost:5000):
   ```env
   VITE_API_URL=http://localhost:8001
   ```
   Start the frontend development server:
   ```bash
   npm run dev
   ```

4. **Access the Application:**
   Open your browser and navigate to `http://localhost:5173`.

## 👥 User Roles

- **Admin:** Has full access to manage the organization, departments, asset categories, and employee directory.
- **Asset Manager:** Responsible for global asset registration, allocation, approving transfers, scheduling audits, and overseeing maintenance.
- **Department Head:** Manages assets and employees within their specific department. Can request asset transfers.
- **Employee:** Can view their assigned assets, book resources, and submit maintenance requests.

## 📄 License

This project is licensed under the MIT License.
