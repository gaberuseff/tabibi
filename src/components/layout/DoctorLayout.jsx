import {
  CalendarDays,
  LayoutDashboard,
  Stethoscope,
  Users,
  Building,
  Settings,
  Menu,
  FileText,
} from "lucide-react";
import {NavLink, Outlet, Link} from "react-router-dom";
import {useAuth} from "../../features/auth/AuthContext";
import ClinicInfo from "../../features/auth/ClinicInfo";
import LogoutButton from "../../features/auth/LogoutButton";
import {useState, useEffect} from "react";

function NavItem({to, icon: Icon, label, isVisible = true, onClick}) {
  if (!isVisible) return null;

  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({isActive}) =>
        `flex items-center gap-3 rounded-[var(--radius)] px-3 py-2 transition-colors ${
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        }`
      }>
      <Icon className="size-4" />
      <span className="text-sm font-medium">{label}</span>
    </NavLink>
  );
}

export default function DoctorLayout() {
  const {user} = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // For doctors, show all navigation items
  const isDoctor = user?.role === "doctor";

  // For secretaries, check permissions
  const hasDashboardAccess =
    isDoctor || (user?.permissions && user.permissions.includes("dashboard"));
  const hasCalendarAccess =
    isDoctor || (user?.permissions && user.permissions.includes("calendar"));
  const hasPatientsAccess =
    isDoctor || (user?.permissions && user.permissions.includes("patients"));
  const hasClinicAccess =
    isDoctor || (user?.permissions && user.permissions.includes("clinic"));
  // Settings page is always accessible for secretaries as it's their profile page
  const hasSettingsAccess =
    isDoctor ||
    (user?.permissions && user.permissions.includes("settings")) ||
    user?.role === "secretary";

  // Function to close sidebar on mobile after clicking a nav item
  const handleNavItemClick = () => {
    if (window.innerWidth < 768) {
      setIsSidebarOpen(false);
    }
  };

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isSidebarOpen &&
        !event.target.closest(".sidebar") &&
        !event.target.closest(".menu-button")
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen]);

  // Close sidebar on window resize to large screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsSidebarOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div dir="rtl" className="flex h-screen">
      {/* Mobile menu button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-card border border-border menu-button"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <Menu className="size-5" />
      </button>

      {/* Sidebar overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar fixed top-0 left-0 w-64 transform transition-transform duration-300 ease-in-out z-50
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static md:flex md:w-56 lg:w-60 xl:w-64 flex-shrink-0 flex-col border-e border-border bg-card h-full overflow-y-auto`}>
        <Link
          to="/"
          onClick={() => setIsSidebarOpen(false)}
          className="p-4 flex items-center gap-2">
          <Stethoscope className="size-5 text-primary" />
          <span className="font-semibold">Tabibi</span>
        </Link>
        <nav className="px-3 space-y-3 flex-1">
          <NavItem
            to="/dashboard"
            icon={LayoutDashboard}
            label="لوحة التحكم"
            isVisible={hasDashboardAccess}
            onClick={handleNavItemClick}
          />
          <NavItem
            to="/calendar"
            icon={CalendarDays}
            label="المواعيد"
            isVisible={hasCalendarAccess}
            onClick={handleNavItemClick}
          />
          <NavItem
            to="/patients"
            icon={Users}
            label="المرضى"
            isVisible={hasPatientsAccess}
            onClick={handleNavItemClick}
          />
          <NavItem
            to="/clinic"
            icon={Building}
            label="العيادة"
            isVisible={hasClinicAccess}
            onClick={handleNavItemClick}
          />
          <NavItem
            to="/treatment-plans"
            icon={FileText}
            label="خطط العلاج"
            isVisible={isDoctor}
            onClick={handleNavItemClick}
          />
          <NavItem
            to="/settings"
            icon={Settings}
            label="الإعدادات"
            isVisible={hasSettingsAccess}
            onClick={handleNavItemClick}
          />
        </nav>
        <div className="p-4 border-t border-border space-y-3">
          <ClinicInfo />
          <LogoutButton />
        </div>
      </aside>
      <div className="flex-1 md:mr-0 lg:mr-0 xl:mr-0 flex flex-col min-h-0">
        <main className="flex-1 overflow-y-auto py-6 mt-16 md:mt-0">
          <div className="container">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
