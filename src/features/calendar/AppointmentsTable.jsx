import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Badge } from "../../components/ui/badge"
import { Card, CardContent } from "../../components/ui/card"
import DataTable from "../../components/ui/table"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "../../components/ui/dropdown-menu"
import { Button } from "../../components/ui/button"
import { MoreHorizontal } from "lucide-react"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateAppointment } from "../../services/apiAppointments"
import toast from "react-hot-toast"

const statusMap = {
  pending: { label: "قيد الانتظار", variant: "secondary" },
  confirmed: { label: "مؤكد", variant: "default" },
  completed: { label: "مكتمل", variant: "outline" },
  cancelled: { label: "ملغي", variant: "destructive" },
}

const sourceMap = {
  booking: { label: "من الموقع", variant: "default" },
  clinic: { label: "من العيادة", variant: "secondary" },
}

export default function AppointmentsTable({ appointments, total, page, pageSize, onPageChange }) {
  const queryClient = useQueryClient()
  
  const { mutate: updateStatus } = useMutation({
    mutationFn: ({ id, status }) => updateAppointment(id, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["appointments"] })
      // Also invalidate dashboard stats to update the counts
      queryClient.invalidateQueries({ queryKey: ["dashboardStats"] })
      queryClient.invalidateQueries({ queryKey: ["filteredPatientStats"] })
      toast.success("تم تحديث حالة الحجز بنجاح")
    },
    onError: (error) => {
      toast.error(error.message || "فشل في تحديث حالة الحجز")
    },
  })

  const handleStatusChange = (appointmentId, newStatus) => {
    updateStatus({ id: appointmentId, status: newStatus })
  }

  const columns = [
    {
      header: "اسم المريض",
      accessor: "patientName",
      cellClassName: "font-medium",
      render: (appointment) => appointment.patient?.name || "غير محدد"
    },
    {
      header: "رقم الهاتف",
      accessor: "patientPhone",
      cellClassName: "text-muted-foreground",
      render: (appointment) => appointment.patient?.phone || "-"
    },
    {
      header: "التاريخ والوقت",
      accessor: "date",
      cellClassName: "text-muted-foreground",
      render: (appointment) => 
        appointment.date ? format(new Date(appointment.date), "dd MMMM yyyy - hh:mm a", { locale: ar }) : "غير محدد"
    },
    {
      header: "نوع الحجز",
      accessor: "notes",
      cellClassName: "text-muted-foreground",
    },
    {
      header: "السعر (جنيه)",
      accessor: "price",
      cellClassName: "text-muted-foreground",
      render: (appointment) => appointment.price ? appointment.price.toFixed(2) : "0.00"
    },
    {
      header: "المصدر",
      accessor: "from",
      render: (appointment) => (
        <Badge variant={sourceMap[appointment.from]?.variant || "secondary"}>
          {sourceMap[appointment.from]?.label || appointment.from}
        </Badge>
      ),
    },
    {
      header: "الحالة",
      accessor: "status",
      render: (appointment) => (
        <Badge variant={statusMap[appointment.status]?.variant || "secondary"}>
          {statusMap[appointment.status]?.label || appointment.status}
        </Badge>
      ),
    },
    {
      header: "",
      render: (appointment) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent 
            align="end" 
            sideOffset={5}
            collisionPadding={10}
            avoidCollisions
          >
            <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "pending")}>
              تغيير إلى قيد الانتظار
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "confirmed")}>
              تغيير إلى مؤكد
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "completed")}>
              تغيير إلى مكتمل
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleStatusChange(appointment.id, "cancelled")}>
              تغيير إلى ملغي
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <Card>
      <CardContent className="p-0">
        <DataTable 
          columns={columns} 
          data={appointments ?? []} 
          total={total} 
          page={page} 
          pageSize={pageSize} 
          onPageChange={onPageChange} 
          emptyLabel="لا توجد مواعيد"
        />
      </CardContent>
    </Card>
  )
}