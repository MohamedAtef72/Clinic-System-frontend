import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { QueryClientProvider } from '@tanstack/react-query';
import queryClient from './queryClient';

// Infrastructure
import ProtectedRoute from "./components/ProtectedRoute";
import ErrorBoundary from "./components/ErrorBoundary";
import FullPageSpinner from "./components/FullPageSpinner";
import { AuthProvider } from "./contexts/AuthContext";
import { NotificationProvider } from "./contexts/NotificationContext";
import Navbar from "./components/Navbar";

// ─── Lazy-loaded pages ───────────────────────────────────────────────────────
// Each page is code-split into its own JS chunk.
// Unvisited pages are never downloaded until the user navigates to them.

// auth
const Login = lazy(() => import("./features/auth/pages/Login"));
const ForgotPassword = lazy(() => import("./features/auth/pages/ForgotPasswordPage"));
const ResetPassword = lazy(() => import("./features/auth/pages/ResetPasswordPage"));

// home / 404
const Home = lazy(() => import("./features/home/pages/Home"));
const NotFoundPage = lazy(() => import("./features/home/pages/NotFoundPage"));

// doctor
const DoctorRegister = lazy(() => import("./features/doctor/pages/DoctorRegister"));
const DoctorsPage = lazy(() => import("./features/doctor/pages/DoctorsPage"));
const ViewDoctorProfile = lazy(() => import("./features/doctor/pages/ViewDoctorProfile"));
const DoctorSchedulePage = lazy(() => import("./features/doctor/pages/DoctorSchedulePage"));
const DoctorAppointmentsPage = lazy(() => import("./features/doctor/pages/DoctorAppointmentsPage"));
const DoctorVisitPage = lazy(() => import("./features/doctor/pages/DoctorVisitPage"));
const UpdateDoctorPrice = lazy(() => import("./features/doctor/pages/UpdateDoctorPrice"));

// patient
const PatientRegister = lazy(() => import("./features/patient/pages/PatientRegister"));
const PatientAppointmentsPage = lazy(() => import("./features/patient/pages/PatientAppointmentsPage"));
const ViewPatientProfile = lazy(() => import("./features/patient/pages/ViewPatientProfile"));
const PatientsPage = lazy(() => import("./features/patient/pages/PatientsPage"));

// receptionist
const ReceptionistRegister = lazy(() => import("./features/receptionist/pages/Receptionistregister"));
const ReceptionistAppointmentsPage = lazy(() => import("./features/receptionist/pages/ReceptionistAppointmentPage"));

// dashboard
const DashboardPage = lazy(() => import("./features/dashboard/pages/DashboardPage"));

// profile
const Profile = lazy(() => import("./features/profile/pages/Profile"));
const EditProfile = lazy(() => import("./features/profile/pages/EditProfile"));

// appointments
const BookAppointmentPage = lazy(() => import("./features/appointments/pages/BookAppointmentPage"));
const AllAppointmentsPage = lazy(() => import("./features/appointments/pages/AllAppointmentsPage"));

// speciality
const AddSpeciality = lazy(() =>
  import("./features/speciality/components").then((m) => ({ default: m.AddSpeciality }))
);

// notifications
const NotificationsPage = lazy(() => import("./features/notifications/pages/NotificationsPage"));




function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <QueryClientProvider client={queryClient}>
            <div className="App">
              <Navbar />
              {/*
              Suspense wraps ALL routes.
              FullPageSpinner is shown while any lazy page chunk is loading.
            */}
              <Suspense fallback={<FullPageSpinner />}>
                <Routes>

                  {/* ── Public Routes ── */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/patient-register" element={<PatientRegister />} />

                  {/* ── Doctor Routes ── */}
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
                    <ProtectedRoute roles={["Doctor"]}>
                      <DoctorSchedulePage />
                    </ProtectedRoute>
                  } />

                  <Route path="/doctor-appointments" element={
                    <ProtectedRoute roles={["Doctor"]}>
                      <DoctorAppointmentsPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/doctor/visit/:id" element={
                    <ProtectedRoute roles={["Doctor"]}>
                      <DoctorVisitPage />
                    </ProtectedRoute>
                  } />

                  {/* ── Patient Routes ── */}
                  <Route path="/patient/:id" element={
                    <ProtectedRoute>
                      <ViewPatientProfile />
                    </ProtectedRoute>
                  } />

                  <Route path="/patient-appointments" element={
                    <ProtectedRoute roles={["Patient"]}>
                      <PatientAppointmentsPage />
                    </ProtectedRoute>
                  } />

                  {/* ── Admin-only Routes ── */}
                  <Route path="/admin/dash" element={
                    <ProtectedRoute roles={["Admin"]}>
                      <DashboardPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/doctor-register" element={
                    <ProtectedRoute roles={["Admin"]}>
                      <DoctorRegister />
                    </ProtectedRoute>
                  } />

                  <Route path="/receptionist-register" element={
                    <ProtectedRoute roles={["Admin"]}>
                      <ReceptionistRegister />
                    </ProtectedRoute>
                  } />

                  <Route path="/all-appointments" element={
                    <ProtectedRoute roles={["Admin"]}>
                      <AllAppointmentsPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/add-speciality" element={
                    <ProtectedRoute roles={["Admin"]}>
                      <AddSpeciality />
                    </ProtectedRoute>
                  } />

                  <Route path="/patients" element={
                    <ProtectedRoute roles={["Admin", "Receptionist"]}>
                      <PatientsPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/update-doctor-price/:id" element={
                    <ProtectedRoute roles={["Admin"]}>
                      <UpdateDoctorPrice />
                    </ProtectedRoute>
                  } />

                  {/* ── Receptionist Routes ── */}
                  <Route path="/Receptionist/all-appointments" element={
                    <ProtectedRoute roles={["Receptionist", "Admin"]}>
                      <ReceptionistAppointmentsPage />
                    </ProtectedRoute>
                  } />

                  {/* ── Shared Authenticated Routes ── */}
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

                  <Route path="/book-appointment/:doctorId" element={
                    <ProtectedRoute roles={["Patient"]}>
                      <BookAppointmentPage />
                    </ProtectedRoute>
                  } />

                  <Route path="/notifications" element={
                    <ProtectedRoute>
                      <NotificationsPage />
                    </ProtectedRoute>
                  } />

                  {/* ── 404 Catch-All ── */}
                  <Route path="*" element={<NotFoundPage />} />

                </Routes>
              </Suspense>
            </div>
          </QueryClientProvider>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
