# 🩺 Clinic System - Frontend

This is the **frontend** of the Clinic System project.  
It provides a responsive and user-friendly interface for doctors, patients, and admins.  
Built with **React**, **MUI**, and **Axios** for API integration.

---

## 🚀 Tech Stack

- **React 19**
- **React Router**
- **TanStack Query (React Query)** (for server state management & caching)
- **MUI** & **Tailwind CSS** (with centralized Design Tokens)
- **Material UI Icons** (standardized iconography)
- **Axios**
- **FullCalendar** (for scheduling)
- **React Hook Form & Yup** (for form validation)
- **SignalR** (for real-time notifications)
- **Cloudinary** (for secure media uploads)
- **JWT Authentication**

---

## 🧱 Project Structure

```
clinic-system-frontend/
│
├── src/
│   ├── api/            # API endpoints configuration
│   ├── components/     # Reusable UI components (Navbar, Footer, Cards, Modals, etc.)
│   ├── contexts/       # React Contexts for state management
│   ├── features/       # Feature-based structure
│       ├── appointments/
│       ├── auth/
│       ├── dashboard/
│       ├── doctor/
│       ├── home/
│       ├── notifications/
│       ├── patient/
│       ├── profile/
│       ├── receptionist/
│       └── speciality/
│           ├── components/ # Domain-specific UI, Skeletons, Empty States
│           ├── hooks/      # React Query custom hooks (e.g., usePatients.js)
│           └── pages/      # Route pages
│   ├── services/       # External service integrations (Axios)
│   ├── App.js
│   └── index.js
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

Create a `.env` file in the root directory:

```env
REACT_APP_API_URL= 'backend URL'
REACT_APP_URL= 'SignalR WebSocket Hub URL'
```

### 4️⃣ Run the App

```bash
npm start
```

---

## 🖥️ Features

- 🔐 Authentication (Login / Register / JWT)
- 👨‍⚕️ Doctor Profile & Ratings
- 👥 Patients Management
- 🗓️ Appointments Scheduling
- ⭐ Rating System
- 📊 Admin Dashboard with Charts & Statistics
- ⚡ **Performance & State Management**: Advanced server state caching using **TanStack Query**, eliminating redundant network requests.
- 🖼️ **Secure Media Handling**: Direct-to-cloud profile picture uploads via **Cloudinary** signed URLs.
- ⏳ **Seamless UX**: High-quality structural **MUI Skeleton** loaders replacing legacy spinners to eliminate Cumulative Layout Shifts (CLS).
- 📱 Fully Responsive UI
- 🏗️ **Optimized Architecture**: Centralized design tokens, modular feature-based hooks, reduced bundle size (removed unused dependencies), and patched memory leaks.

---

## 🧭 Folder Highlights (Feature-Based)

| Feature          | Pages                          | Components                               |
| ---------------- | ------------------------------ | ---------------------------------------- |
| Appointments     | `features/appointments/pages/` | `features/appointments/components/`      |
| Doctors          | `features/doctor/pages/`       | `features/doctor/components/`            |
| Patients         | `features/patient/pages/`      | `features/patient/components/`           |
| Notifications    | `features/notifications/pages/`| `features/notifications/components/`     |
| SharedComponents | N/A                            | (Navbar, Footer, Cards, Modals, etc.)    |
| API/Services     | N/A                            | `api/` & `services/`                     |
| Context          | N/A                            | `contexts/` (State Management)           |

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
