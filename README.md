# 🩺 Clinic System - Frontend

This is the **frontend** of the Clinic System project.  
It provides a responsive and user-friendly interface for doctors, patients, and admins.  
Built with **React**, **MUI**, and **Axios** for API integration.

---

## 🚀 Tech Stack

- **React 18**
- **React Router**
- **MUI**
- **Axios**
- **Chart.js** (for dashboard charts)
- **JWT Authentication**

---

## 🧱 Project Structure

```
clinic-system-frontend/
│
├── src/
│   ├── components/     # Reusable UI components (Navbar, Footer, Cards, Modals, etc.)
│   ├── features/       # Feature-based structure
│       ├── appointments/
│           ├── pages/      # Pages related to appointments feature
│           └── components/ # Components related to appointments feature
│       ├── doctor/
│           ├── pages/      # Pages related to doctors feature
│           └── components/ # Components related to doctors feature
│       ├── patient/
│           ├── pages/      # Pages related to patients feature
│           └── components/ # Components related to patients feature
│       ├── auth/
│           ├── pages/      # Pages related to patients feature
│           └── components/ # Components related to patients feature
│       ├── dashboard/
│           ├── pages/      # Pages related to patients feature
│           └── components/ # Components related to patients feature
│       ├── home/
│           ├── pages/      # Pages related to patients feature
│           └── components/ # Components related to patients feature
│       ├── profile/
│           ├── pages/      # Pages related to patients feature
│           └── components/ # Components related to patients feature
│       ├── receptionist/
│           ├── pages/      # Pages related to patients feature
│           └── components/ # Components related to patients feature
│       ├── speciality/
│           ├── pages/      # Pages related to patients feature
│           └── components/ # Components related to patients feature
│   ├── services/       # Axios API calls
│   ├── context/        # Auth context and state management
│   └── App.jsx
└── package.json
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/MohamedAtef72/Clinic-System-frontend.git
cd clinic-system-frontend
```

### 2️⃣ Install Dependencies

```bash
npm install
```

### 3️⃣ Create `.env` File

```env
REACT_APP_API_URL= 'backend URL'
```

### 4️⃣ Run the App

```bash
npm run dev
```

---

## 🖥️ Features

- 🔐 Authentication (Login / Register / JWT)
- 👨‍⚕️ Doctor Profile & Ratings
- 👥 Patients Management
- 🗓️ Appointments Scheduling
- ⭐ Rating System
- 📊 Admin Dashboard with Charts & Statistics
- 📱 Fully Responsive UI

---

## 🧭 Folder Highlights (Feature-Based)

| Feature          | Pages                          | Components                               |
| ---------------- | ------------------------------ | ---------------------------------------- |
| Appointments     | `features/appointments/pages/` | `features/appointments/components/`      |
| Doctors          | `features/doctors/pages/`      | `features/doctors/components/`           |
| Patients         | `features/patients/pages/`     | `features/patients/components/`          |
| SharedComponents | N/A                            | (Navbar, Footer, Cards, Modals, etc.)    |
| Services         | N/A                            | `services/authService` (Axios API calls) |
| Context          | N/A                            | `context/` (Auth & User Context)         |

---

## 🔔 Notification System

The application features a real-time notification system powered by **SignalR**.

- **Real-time Updates**: Notifications appear instantly via WebSocket connection.
- **Infinite Scrolling**: Browsing notifications is efficient with server-side pagination and infinite scroll.
- **Interactive UI**:
  - **Unread Badge**: Shows the count of unread notifications.
  - **Mark as Read**: Click to mark individual or all notifications as read.
  - **Toast Alerts**: Pop-up toasts for immediate feedback on critical events (e.g., Appointment Cancelled).

---

## 📦 Build for Production

```bash
npm run build
```

---

## 🐳 Docker Setup

This project includes a **Dockerfile** to simplify the build and deployment process.

### 🧩 Build the Docker Image

```bash
docker build -t clinic-system-frontend .
```

### 🚀 Run the Container

```bash
docker run -d -p 3000:80 clinic-system-frontend
```

Then open your browser and visit:  
👉 [http://localhost:3000](http://localhost:3000)

---

### 🧱 Dockerfile Overview

```dockerfile
# ---- Build Stage ----
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ---- Run Stage ----
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

📝 **Notes:**

- The build stage installs dependencies and builds the React app.
- The run stage uses **Nginx** to serve the static files.
- You can add a custom `nginx.conf` if you need to modify routing or headers.

---

## 👨‍💻 Developed By

**Mohamed Atef**
