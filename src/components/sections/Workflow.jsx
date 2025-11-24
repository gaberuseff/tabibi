import { Card, CardContent, CardFooter, CardHeader } from "../ui/card"
import { Button } from "../ui/button"
import { CheckCircle2 } from "lucide-react"

export default function Workflow() {
  return (
    <section id="workflow" className="container py-20">
      <Card>
        <CardHeader className="text-center">
          <h3 className="text-2xl font-bold">سير عمل بسيط</h3>
          <p className="text-muted-foreground">من الاستقبال إلى الفوترة بخطوات واضحة.</p>
        </CardHeader>
        <CardContent className="grid md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">استقبال وتنظيم</h3>
            <p className="text-sm text-muted-foreground">إدارة مواعيد وحجوزات المرضى مع إشعارات فورية.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">الملف الطبي</h3>
            <p className="text-sm text-muted-foreground">توثيق التشخيص والمرفقات ومتابعة التاريخ المرضي.</p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">الفوترة والتقارير</h3>
            <p className="text-sm text-muted-foreground">إصدار الفواتير وتحليل الإيرادات بشكل مبسط.</p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button className="gap-2"><CheckCircle2 className="size-5" />جرّبه الآن</Button>
        </CardFooter>
      </Card>
    </section>
  )
}

