import {memo} from "react";
import {Toaster} from "react-hot-toast";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import DoctorLayout from "./components/layout/DoctorLayout";
import SEO from "./components/SEO";
import {AuthProvider} from "./features/auth/AuthContext";
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

// Memoize route components to prevent unnecessary re-renders
const MemoizedLanding = memo(Landing);
const MemoizedLogin = memo(Login);
const MemoizedSignup = memo(Signup);
const MemoizedBooking = memo(Booking);
const MemoizedDashboard = memo(Dashboard);
const MemoizedCalendar = memo(Calendar);
const MemoizedPatients = memo(Patients);
const MemoizedPatientDetailPage = memo(PatientDetailPage);
const MemoizedVisitDetailPage = memo(VisitDetailPage);
const MemoizedPatientPlanDetailPage = memo(PatientPlanDetailPage);
const MemoizedClinic = memo(Clinic);
const MemoizedTreatmentPlans = memo(TreatmentPlans);
const MemoizedSettings = memo(Settings);

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <SEO
                  title="Tabibi - نظام إدارة العيادات الطبية"
                  description="نظام إلكتروني شامل لإدارة العيادات الطبية، يتضمن جدولة المواعيد، السجلات الطبية، وإدارة المرضى."
                  keywords="عيادة طبية, إدارة عيادة, جدولة مواعيد, سجلات طبية, نظام طبي"
                  ogTitle="Tabibi - نظام إدارة العيادات الطبية"
                  ogDescription="نظام إلكتروني شامل لإدارة العيادات الطبية، يتضمن جدولة المواعيد، السجلات الطبية، وإدارة المرضى."
                  ogUrl="https://tabibi.eg/"
                  twitterCard="summary_large_image"
                  twitterTitle="Tabibi - نظام إدارة العيادات الطبية"
                  twitterDescription="نظام إلكتروني شامل لإدارة العيادات الطبية، يتضمن جدولة المواعيد، السجلات الطبية، وإدارة المرضى."
                />
                <MemoizedLanding />
              </>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <>
                  <SEO
                    title="تسجيل الدخول - Tabibi"
                    description="تسجيل الدخول إلى حسابك في Tabibi لإدارة عيادتك الطبية."
                    ogTitle="تسجيل الدخول - Tabibi"
                    ogDescription="تسجيل الدخول إلى حسابك في Tabibi لإدارة عيادتك الطبية."
                    ogUrl="https://tabibi.eg/login"
                  />
                  <MemoizedLogin />
                </>
              </PublicRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicRoute>
                <>
                  <SEO
                    title="إنشاء حساب - Tabibi"
                    description="أنشئ حسابك المجاني في Tabibi لإدارة عيادتك الطبية بسهولة وكفاءة."
                    ogTitle="إنشاء حساب - Tabibi"
                    ogDescription="أنشئ حسابك المجاني في Tabibi لإدارة عيادتك الطبية بسهولة وكفاءة."
                    ogUrl="https://tabibi.eg/signup"
                  />
                  <MemoizedSignup />
                </>
              </PublicRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <DoctorLayout />
              </ProtectedRoute>
            }>
            <Route
              path="/dashboard"
              element={
                <PermissionGuard requiredPermission="dashboard">
                  <MemoizedDashboard />
                </PermissionGuard>
              }
            />
            <Route
              path="/calendar"
              element={
                <PermissionGuard requiredPermission="calendar">
                  <MemoizedCalendar />
                </PermissionGuard>
              }
            />
            <Route
              path="/patients"
              element={
                <PermissionGuard requiredPermission="patients">
                  <MemoizedPatients />
                </PermissionGuard>
              }
            />
            <Route
              path="/patients/:id"
              element={
                <PermissionGuard requiredPermission="patients">
                  <MemoizedPatientDetailPage />
                </PermissionGuard>
              }
            />
            <Route
              path="/patients/:patientId/visits/:visitId"
              element={
                <PermissionGuard requiredPermission="patients">
                  <MemoizedVisitDetailPage />
                </PermissionGuard>
              }
            />
            <Route
              path="/patients/:patientId/plans/:planId"
              element={
                <PermissionGuard requiredPermission="patients">
                  <MemoizedPatientPlanDetailPage />
                </PermissionGuard>
              }
            />
            <Route
              path="/clinic"
              element={
                <PermissionGuard requiredPermission="clinic">
                  <MemoizedClinic />
                </PermissionGuard>
              }
            />
            <Route
              path="/treatment-plans"
              element={
                <PermissionGuard requiredPermission="patients">
                  <MemoizedTreatmentPlans />
                </PermissionGuard>
              }
            />
            <Route
              path="/settings"
              element={
                <PermissionGuard requiredPermission="settings">
                  <MemoizedSettings />
                </PermissionGuard>
              }
            />
          </Route>
          <Route
            path="/booking/:clinicId"
            element={
              <>
                <SEO
                  title="حجز موعد - Tabibi"
                  description="احجز موعدك الإلكتروني مع الطبيب بسهولة وسرعة."
                  ogTitle="حجز موعد - Tabibi"
                  ogDescription="احجز موعدك الإلكتروني مع الطبيب بسهولة وسرعة."
                  ogUrl="https://tabibi.eg/booking"
                />
                <MemoizedBooking />
              </>
            }
          />
        </Routes>
        <Toaster position="top-center" />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
