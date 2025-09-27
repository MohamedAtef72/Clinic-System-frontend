import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import DoctorRegister from "./pages/DoctorRegister";
import PatientRegister from "./pages/PatientRegister";
import ReceptionistRegister from "./pages/Receptionistregister";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import DoctorsPage from "./pages/DoctorsPage";
import ViewDoctorProfile from "./pages/ViewDoctorProfile";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <div className="App">
      <AuthProvider>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        
        {/* Protected Routes */}
        <Route path="/doctor-register" element={
          <ProtectedRoute>
            <DoctorRegister />
          </ProtectedRoute>
        } />
        <Route path="/receptionist-register" element={
          <ProtectedRoute>
            <ReceptionistRegister />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/edit-profile" element={
          <ProtectedRoute>
            <EditProfile />
          </ProtectedRoute>
        } />
        <Route path="/doctors" element={
          <ProtectedRoute>
            <DoctorsPage />
          </ProtectedRoute>
        } />
        <Route path="/doctor/:id" element={
          <ProtectedRoute>
            <ViewDoctorProfile />
          </ProtectedRoute>
        } />
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;