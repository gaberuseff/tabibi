import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { CalendarDays, CalendarPlus, Clock, UserRound } from "lucide-react"

export default function CalendarPage() {
  return (
    <div className="space-y-8" dir="rtl">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">المواعيد</h1>
        <p className="text-sm text-muted-foreground">عرض ثابت للتقويم وجدولة الزيارات.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button className="gap-2"><CalendarPlus className="size-4" />موعد جديد</Button>
        <Button variant="outline" className="gap-2"><UserRound className="size-4" />ربط مريض</Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CalendarDays className="size-4 text-primary" />
                <h3 className="text-lg font-semibold">تقويم الأسبوع</h3>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-3">
                {["الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة","السبت"].map((d) => (
                  <div key={d} className="rounded-[var(--radius)] border border-dashed border-border p-3 text-center text-xs text-muted-foreground">
                    {d}
                  </div>
                ))}
              </div>
              <div className="mt-4 rounded-[var(--radius)] border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                سيتم عرض الأحداث هنا لاحقاً
              </div>
            </CardContent>
          </Card>
        </div>
        <Card>
          <CardHeader>
            <h3 className="text-lg font-semibold">القائمة القادمة</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[1,2,3].map((i) => (
                <div key={i} className="flex items-center justify-between gap-3 rounded-[var(--radius)] border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-[calc(var(--radius)-6px)] bg-primary/10 text-primary grid place-items-center">
                      <Clock className="size-4" />
                    </div>
                    <div>
                      <div className="text-sm font-medium">موعد متابعة</div>
                      <div className="text-xs text-muted-foreground">اليوم 3:30 م</div>
                    </div>
                  </div>
                  <Badge className="bg-secondary/10 text-secondary">جديد</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

