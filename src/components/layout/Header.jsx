import { Stethoscope } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import { useAuth } from "../../features/auth/AuthContext"

export default function Header() {
  const { user, isLoading } = useAuth()

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/70 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Stethoscope className="size-6 text-primary" />
          <span className="text-xl font-bold">Tabibi</span>
        </div>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">المميزات</Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">سير العمل</Button>
          <Button variant="ghost" className="text-muted-foreground hover:text-foreground">الأسعار</Button>
        </nav>
        <div className="flex items-center gap-3">
          {isLoading ? (
            // Show loading state
            <div className="flex items-center gap-3">
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-10 w-20 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ) : user ? (
            // If user is authenticated, show dashboard button
            <Link to="/dashboard">
              <Button>الذهاب إلى لوحة التحكم</Button>
            </Link>
          ) : (
            // If user is not authenticated, show login/signup buttons
            <>
              <Link to="/login">
                <Button variant="outline">تسجيل دخول</Button>
              </Link>
              <Link to="/signup">
                <Button>ابدأ الآن</Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}