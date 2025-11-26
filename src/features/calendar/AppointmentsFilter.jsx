import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"

const statusOptions = [
  { value: "all", label: "جميع الحالات" },
  { value: "pending", label: "قيد الانتظار" },
  { value: "confirmed", label: "مؤكد" },
  { value: "completed", label: "مكتمل" },
  { value: "cancelled", label: "ملغي" },
]

export default function AppointmentsFilter({ onFilterChange }) {
  const [date, setDate] = useState("")
  const [status, setStatus] = useState("all")

  const handleDateChange = (newDate) => {
    setDate(newDate)
    const statusValue = status === "all" ? "" : status
    onFilterChange({ date: newDate, status: statusValue })
  }

  const handleStatusChange = (newStatus) => {
    setStatus(newStatus)
    const statusValue = newStatus === "all" ? "" : newStatus
    onFilterChange({ date, status: statusValue })
  }

  const handleClearFilters = () => {
    setDate("")
    setStatus("all")
    onFilterChange({ date: "", status: "" })
  }

  return (
    <Card>
      <CardContent className="py-4 flex flex-wrap gap-3 items-end">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">تاريخ الموعد</label>
          <Input
            type="date"
            value={date}
            onChange={(e) => handleDateChange(e.target.value)}
            className="w-full sm:w-40"
          />
        </div>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium">الحالة</label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="اختر الحالة" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleClearFilters}>مسح الفلاتر</Button>
        </div>
      </CardContent>
    </Card>
  )
}