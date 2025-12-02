import { Receipt, Smartphone, Sparkles, Stethoscope } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "../../features/auth/AuthContext"
import { Button } from "../ui/button"
import { Card, CardContent } from "../ui/card"

export default function Hero() {
  const { user, isLoading } = useAuth()

  return (
    <section className="container py-24">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
            <Sparkles className="size-4 text-primary" />
            منصة الكترونية لإدارة العيادات
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
            إدارة حديثة وسلسة لعيادتك
          </h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            جميع الوظائف التي تحتاجها في عيادتك تحتل مكان واحد.
          </p>
          <div className="flex flex-wrap gap-4">
            {isLoading ? (
              // Show loading state
              <div className="flex gap-4">
                <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-12 w-40 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ) : user ? (
              // If user is authenticated, show "الدخول" button
              <>
                <Link to="/dashboard">
                  <Button className="gap-2">
                    <Stethoscope className="size-5" />
                    الدخول
                  </Button>
                </Link>
                  <Button variant="outline" className="gap-2">
                    <Smartphone className="size-5" />
                    مشاهدة العرض الترويجى
                  </Button>

              </>
            ) : (
              // If user is not authenticated, show signup buttons
              <>
                <Link to="/signup">
                  <Button className="gap-2">
                    <Stethoscope className="size-5" />
                    ابدأ التجربة المجانية
                  </Button>
                </Link>
                  <Button variant="outline" className="gap-2">
                    <Smartphone className="size-5" />
                      مشاهدة العرض الترويجى
                  </Button>
              </>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6">
            <Card className="text-center">
              <CardContent className="py-4">
                <div className="text-2xl font-bold">+120</div>
                <div className="text-xs text-muted-foreground">عيادة نشطة</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-4">
                <div className="text-2xl font-bold">+15K</div>
                <div className="text-xs text-muted-foreground">ملف طبي مُدار</div>
              </CardContent>
            </Card>
            <Card className="text-center">
              <CardContent className="py-4">
                <div className="text-2xl font-bold">99.9%</div>
                <div className="text-xs text-muted-foreground">جاهزية النظام</div>
              </CardContent>
            </Card>
          </div>
        </div>
        <div className="relative">
          <div className="aspect-[4/3] w-full overflow-hidden">
            {/* Eagerly load the hero image with high priority */}
            <img 
              src="/hero-optimized.webp" 
              alt="Tabibi - إدارة العيادات" 
              className="w-full h-full object-contain"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="absolute -bottom-6 -start-6 hidden md:block rounded-[var(--radius)] 
            border border-border bg-background/70 backdrop-blur p-4 shadow">
            <div className="flex items-center gap-3">
              <Receipt className="size-5 text-primary" />
              <span className="text-sm">تقارير الإيرادات المباشرة</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}