import { Stethoscope } from "lucide-react"
import { Button } from "../ui/button"

export default function Header() {
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
          <Button variant="outline">تسجيل دخول</Button>
          <Button>ابدأ الآن</Button>
        </div>
      </div>
    </header>
  )
}

