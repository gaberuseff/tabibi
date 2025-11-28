import { Toaster } from "react-hot-toast";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import DoctorLayout from "./components/layout/DoctorLayout";
import { AuthProvider } from "./features/auth/AuthContext";
import PermissionGuard from "./features/auth/PermissionGuard";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import PublicRoute from "./features/auth/PublicRoute";
import PatientDetailPage from "./features/patients/PatientDetailPage";
import PatientPlanDetailPage from "./features/patients/PatientPlanDetailPage";
import VisitDetailPage from "./features/patients/VisitDetailPage";
import Booking from "./pages/Booking";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Calendar from "./pages/doctor/Calendar";
import Clinic from "./pages/doctor/Clinic";
import Dashboard from "./pages/doctor/Dashboard";
import Patients from "./pages/doctor/Patients";
import Settings from "./pages/doctor/Settings";
import TreatmentPlans from "./pages/doctor/TreatmentPlans";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <Signup />
              </PublicRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <DoctorLayout />
              </ProtectedRoute>
            }
          >
            <Route 
              path="/dashboard" 
              element={
                <PermissionGuard requiredPermission="dashboard">
                  <Dashboard />
                </PermissionGuard>
              } 
            />
            <Route 
              path="/calendar" 
              element={
                <PermissionGuard requiredPermission="calendar">
                  <Calendar />
                </PermissionGuard>
              } 
            />
            <Route 
              path="/patients" 
              element={
                <PermissionGuard requiredPermission="patients">
                  <Patients />
                </PermissionGuard>
              } 
            />
            <Route 
              path="/patients/:id" 
              element={
                <PermissionGuard requiredPermission="patients">
                  <PatientDetailPage />
                </PermissionGuard>
              } 
            />
            <Route 
              path="/patients/:patientId/visits/:visitId" 
              element={
                <PermissionGuard requiredPermission="patients">
                  <VisitDetailPage />
                </PermissionGuard>
              } 
            />
            <Route 
              path="/patients/:patientId/plans/:planId" 
              element={
                <PermissionGuard requiredPermission="patients">
                  <PatientPlanDetailPage />
                </PermissionGuard>
              } 
            />
            <Route 
              path="/clinic" 
              element={
                <PermissionGuard requiredPermission="clinic">
                  <Clinic />
                </PermissionGuard>
              } 
            />
            <Route 
              path="/treatment-plans" 
              element={
                <PermissionGuard requiredPermission="patients">
                  <TreatmentPlans />
                </PermissionGuard>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <PermissionGuard requiredPermission="settings">
                  <Settings />
                </PermissionGuard>
              } 
            />
          </Route>
          <Route path="/booking/:clinicId" element={<Booking />} />
        </Routes>
        <Toaster position="top-center" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;