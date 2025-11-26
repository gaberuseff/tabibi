import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { SkeletonBlock } from "../../components/ui/skeleton"

const statusMap = {
  pending: { label: "قيد الانتظار", variant: "secondary" },
  confirmed: { label: "مؤكد", variant: "default" },
  completed: { label: "مكتمل", variant: "outline" },
  cancelled: { label: "ملغي", variant: "destructive" },
}

export default function PatientAppointmentsHistory({ appointments, isLoading }) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonBlock key={i} className="h-16" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">سجل الحجوزات</h3>
      </CardHeader>
      <CardContent>
        {appointments && appointments.length > 0 ? (
          <div className="space-y-3">
            {appointments.map((appointment) => (
              <div key={appointment.id} className="flex items-center justify-between p-3 rounded-[var(--radius)] border border-border">
                <div className="flex-1">
                  <div className="text-sm text-muted-foreground">
                    {appointment.date ? format(new Date(appointment.date), "dd MMMM yyyy - hh:mm a", { locale: ar }) : "غير محدد"}
                  </div>
                  <div className="font-medium">{appointment.notes}</div>
                </div>
                <Badge variant={statusMap[appointment.status]?.variant || "secondary"}>
                  {statusMap[appointment.status]?.label || appointment.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            لا توجد حجوزات لهذا المريض
          </div>
        )}
      </CardContent>
    </Card>
  )
}