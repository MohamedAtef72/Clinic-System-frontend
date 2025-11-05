import { Routes, Route } from "react-router-dom";

// public 
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./contexts/AuthContext";
import Navbar from "./components/Navbar";

// auth
import Login from "./features/auth/pages/Login";
import ForgotPassword from "./features/auth/pages/ForgotPasswordPage";
import ResetPassword from "./features/auth/pages/ResetPasswordPage";

// doctor
import DoctorRegister from "./features/doctor/pages/DoctorRegister";
import DoctorsPage from "./features/doctor/pages/DoctorsPage";
import ViewDoctorProfile from "./features/doctor/pages/ViewDoctorProfile";
import DoctorSchedulePage from "./features/doctor/pages/DoctorSchedulePage";
import DoctorAppointmentsPage from "./features/doctor/pages/DoctorAppointmentsPage";
import DoctorVisitPage from "./features/doctor/pages/DoctorVisitPage";
import UpdateDoctorPrice from "./features/doctor/pages/UpdateDoctorPrice";

// patient
import PatientRegister from "./features/patient/pages/PatientRegister";
import PatientAppointmentsPage from "./features/patient/pages/PatientAppointmentsPage";
import ViewPatientProfile from "./features/patient/pages/ViewPatientProfile";
import PatientsPage from "./features/patient/pages/PatientsPage";

// receptionist
import ReceptionistRegister from "./features/receptionist/pages/Receptionistregister";
import ReceptionistAppointmentsPage from "./features/receptionist/pages/ReceptionistAppointmentPage";

// home
import Home from "./features/home/pages/Home";

// dashboard
import DashboardPage from "./features/dashboard/pages/DashboardPage";

// profile
import Profile from "./features/profile/pages/Profile";
import EditProfile from "./features/profile/pages/EditProfile";

// appointments
import BookAppointmentPage from "./features/appointments/pages/BookAppointmentPage";
import AllAppointmentsPage from "./features/appointments/pages/AllAppointmentsPage";

// speciality
import { AddSpeciality } from "./features/speciality/components";


function App() {
  return (
    <div className="App">
      <AuthProvider>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword/>}/>
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/patient-register" element={<PatientRegister />} />
        
        {/* Protected Routes */}
        {/* doctor */}
        <Route path="/doctor-register" element={
          <ProtectedRoute>
            <DoctorRegister />
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

        <Route path="/doctor-schedule" element={
          <ProtectedRoute>
            <DoctorSchedulePage />
          </ProtectedRoute>
        } />

        <Route path="/doctor-appointments" element={
          <ProtectedRoute>
            <DoctorAppointmentsPage />
          </ProtectedRoute>
        } />

        <Route path="/update-doctor-price/:id" element={
          <ProtectedRoute>
            <UpdateDoctorPrice />
          </ProtectedRoute>
        } />

        <Route path="/doctor/visit/:id" element={
          <ProtectedRoute>
            <DoctorVisitPage />
          </ProtectedRoute>
        } />      

        {/* patient */}
          <Route path="/patient/:id" element={
          <ProtectedRoute>
            <ViewPatientProfile />
          </ProtectedRoute>
        } />      

        <Route path="/patient-appointments" element={
          <ProtectedRoute>
            <PatientAppointmentsPage />
          </ProtectedRoute>
        } />

        <Route path="/patients" element={
          <ProtectedRoute>
            <PatientsPage />
          </ProtectedRoute>
        } />

        {/* receptionist */}
        <Route path="/receptionist-register" element={
          <ProtectedRoute>
            <ReceptionistRegister />
          </ProtectedRoute>
        } />

        <Route path="/Receptionist/all-appointments" element={
          <ProtectedRoute>
            <ReceptionistAppointmentsPage />
          </ProtectedRoute>
        } />

        {/* dashboard */}
          <Route path="/admin/dash" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />

        {/* profile */}
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

        {/* appointments */}
        <Route path="/book-appointment/:doctorId" element={
          <ProtectedRoute>
            <BookAppointmentPage />
          </ProtectedRoute>
        } />

        <Route path="/all-appointments" element={
          <ProtectedRoute>
            <AllAppointmentsPage />
          </ProtectedRoute>
        } />

        {/* speciality */}
        <Route path="/add-speciality" element={
          <ProtectedRoute>
            <AddSpeciality />
          </ProtectedRoute>
        } />
      </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;