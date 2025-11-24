import { NavLink, Outlet } from "react-router-dom"
import { LayoutDashboard, CalendarDays, Users, Stethoscope } from "lucide-react"
import { Button } from "../ui/button"

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 transition-colors ${
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`}
    >
      <Icon className="size-4" />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  )
}

export default function DoctorLayout() {
  return (
    <div dir="rtl" className="min-h-svh grid md:grid-cols-[260px_1fr]">
      <aside className="border-e border-border bg-card">
        <div className="p-4 flex items-center gap-2">
          <Stethoscope className="size-5 text-primary" />
          <span className="font-semibold">Tabibi</span>
        </div>
        <nav className="px-3 space-y-3">
          <NavItem to="/doctor/dashboard" icon={LayoutDashboard} label="لوحة التحكم" />
          <NavItem to="/doctor/calendar" icon={CalendarDays} label="المواعيد" />
          <NavItem to="/doctor/patients" icon={Users} label="المرضى" />
        </nav>
      </aside>
      <div className="flex flex-col">
        <main className="container py-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

