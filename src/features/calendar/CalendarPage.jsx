import { CalendarPlus, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import TableSkeleton from "../../components/ui/table-skeleton"
import { APPOINTMENTS_PAGE_SIZE } from "../../constants/pagination"
import AppointmentCreateDialog from "./AppointmentCreateDialog"
import AppointmentsFilter from "./AppointmentsFilter"
import AppointmentsTable from "./AppointmentsTable"
import useAppointments from "./useAppointments"

export default function CalendarPage() {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [allAppointmentsPage, setAllAppointmentsPage] = useState(1)
  const [filters, setFilters] = useState({})
  const [open, setOpen] = useState(false)
  
  // Fetch upcoming appointments (closest to current time, confirmed first)
  const upcomingFilters = { ...filters, time: "upcoming" }
  const { data: upcomingData, isLoading: isUpcomingLoading, refetch: refetchUpcoming } = useAppointments(query, page, APPOINTMENTS_PAGE_SIZE, upcomingFilters)
  
  // Fetch all appointments
  const { data: allData, isLoading: isAllLoading, refetch: refetchAll } = useAppointments(query, allAppointmentsPage, APPOINTMENTS_PAGE_SIZE, filters)

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
    setAllAppointmentsPage(1)
  }

  // Auto-refresh appointments every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      refetchUpcoming()
      refetchAll()
    }, 10 * 60 * 1000) // 10 minutes in milliseconds

    // Cleanup interval on component unmount
    return () => clearInterval(interval)
  }, [refetchUpcoming, refetchAll])

  return (
    <div className="space-y-8" dir="rtl">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">المواعيد</h1>
        <p className="text-sm text-muted-foreground">إدارة مواعيد العيادة وجدولة الزيارات.</p>
      </div>

      <Card>
        <CardContent className="py-4 flex flex-wrap gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="ps-9"
              placeholder="ابحث في المواعيد"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setPage(1)
                setAllAppointmentsPage(1)
              }}
            />
          </div>
          <Button onClick={() => setOpen(true)} className="gap-2">
            <CalendarPlus className="size-4" />
            موعد جديد
          </Button>
        </CardContent>
      </Card>

      <AppointmentsFilter onFilterChange={handleFilterChange} />

      {/* Upcoming Appointments Section */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">المواعيد القادمة</CardTitle>
            <p className="text-sm text-muted-foreground">الحجوزات المؤكدة والأقرب إلى الوقت الحالي</p>
          </CardHeader>
          <CardContent className="p-0">
            {isUpcomingLoading ? (
              <TableSkeleton columns={5} rows={APPOINTMENTS_PAGE_SIZE} />
            ) : (
              <AppointmentsTable
                appointments={upcomingData?.items}
                total={upcomingData?.total}
                page={page}
                pageSize={APPOINTMENTS_PAGE_SIZE}
                onPageChange={setPage}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* All Appointments Section */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">جميع المواعيد</CardTitle>
            <p className="text-sm text-muted-foreground">جميع المواعيد مرتبة حسب التاريخ في قاعدة البيانات</p>
          </CardHeader>
          <CardContent className="p-0">
            {isAllLoading ? (
              <TableSkeleton columns={5} rows={APPOINTMENTS_PAGE_SIZE} />
            ) : (
              <AppointmentsTable
                appointments={allData?.items}
                total={allData?.total}
                page={allAppointmentsPage}
                pageSize={APPOINTMENTS_PAGE_SIZE}
                onPageChange={setAllAppointmentsPage}
              />
            )}
          </CardContent>
        </Card>
      </div>

      <AppointmentCreateDialog open={open} onClose={() => setOpen(false)} />
    </div>
  )
}