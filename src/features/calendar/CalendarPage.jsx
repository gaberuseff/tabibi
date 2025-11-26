import { CalendarPlus, Search } from "lucide-react"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import TableSkeleton from "../../components/ui/table-skeleton"
import { APPOINTMENTS_PAGE_SIZE } from "../../constants/pagination"
import AppointmentCreateDialog from "./AppointmentCreateDialog"
import AppointmentsTable from "./AppointmentsTable"
import useAppointments from "./useAppointments"
import AppointmentsFilter from "./AppointmentsFilter"

export default function CalendarPage() {
  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [filters, setFilters] = useState({})
  const [open, setOpen] = useState(false)
  const { data, isLoading } = useAppointments(query, page, APPOINTMENTS_PAGE_SIZE, filters)

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters)
    setPage(1) // Reset to first page when filters change
  }

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

      {isLoading ? (
        <Card>
          <CardContent className="p-0">
            <TableSkeleton columns={5} rows={APPOINTMENTS_PAGE_SIZE} />
          </CardContent>
        </Card>
      ) : (
        <AppointmentsTable
          appointments={data?.items}
          total={data?.total}
          page={page}
          pageSize={APPOINTMENTS_PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      <AppointmentCreateDialog open={open} onClose={() => setOpen(false)} />
    </div>
  )
}