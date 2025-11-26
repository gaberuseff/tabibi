import { CalendarDays, LayoutDashboard, Stethoscope, Users, Building, Settings } from "lucide-react"
import { NavLink, Outlet } from "react-router-dom"
import { useAuth } from "../../features/auth/AuthContext"
import ClinicInfo from "../../features/auth/ClinicInfo"
import LogoutButton from "../../features/auth/LogoutButton"

function NavItem({ to, icon: Icon, label, isVisible = true }) {
  if (!isVisible) return null
  
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 transition-colors ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
    >
      <Icon className="size-4" />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  )
}

export default function DoctorLayout() {
  const { user } = useAuth()
  
  // For doctors, show all navigation items
  const isDoctor = user?.role === "doctor"
  
  // For secretaries, check permissions
  const hasDashboardAccess = isDoctor || (user?.permissions && user.permissions.includes("dashboard"))
  const hasCalendarAccess = isDoctor || (user?.permissions && user.permissions.includes("calendar"))
  const hasPatientsAccess = isDoctor || (user?.permissions && user.permissions.includes("patients"))
  const hasClinicAccess = isDoctor || (user?.permissions && user.permissions.includes("clinic"))
  const hasSettingsAccess = isDoctor || (user?.permissions && user.permissions.includes("settings"))

  return (
    <div dir="rtl" className="flex h-screen">
      <aside className="hidden md:flex md:w-64 lg:w-72 xl:w-80 flex-shrink-0 flex-col border-e border-border bg-card fixed h-full overflow-y-auto">
        <div className="p-4 flex items-center gap-2">
          <Stethoscope className="size-5 text-primary" />
          <span className="font-semibold">Tabibi</span>
        </div>
        <nav className="px-3 space-y-3 flex-1">
          <NavItem 
            to="/dashboard" 
            icon={LayoutDashboard} 
            label="لوحة التحكم" 
            isVisible={hasDashboardAccess} 
          />
          <NavItem 
            to="/calendar" 
            icon={CalendarDays} 
            label="المواعيد" 
            isVisible={hasCalendarAccess} 
          />
          <NavItem 
            to="/patients" 
            icon={Users} 
            label="المرضى" 
            isVisible={hasPatientsAccess} 
          />
          <NavItem 
            to="/clinic" 
            icon={Building} 
            label="العيادة" 
            isVisible={hasClinicAccess} 
          />
          <NavItem 
            to="/settings" 
            icon={Settings} 
            label="الإعدادات" 
            isVisible={hasSettingsAccess} 
          />
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          <ClinicInfo />
          <LogoutButton />
        </div>
      </aside>
      <div className="flex-1 md:mr-64 lg:mr-72 xl:mr-80 flex flex-col min-h-0">
        <main className="flex-1 overflow-y-auto py-6">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}