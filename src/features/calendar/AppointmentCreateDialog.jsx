import { Search, UserPlus } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import SimpleDatePicker from "../../components/ui/simple-date-picker"
import PatientCreateDialog from "../patients/PatientCreateDialog"
import useCreateAppointment from "./useCreateAppointment"
import useSearchPatients from "./useSearchPatients"

export default function AppointmentCreateDialog({ open, onClose }) {
  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm()
  const { mutate: createAppointment, isPending } = useCreateAppointment()
  const [patientSearch, setPatientSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showPatientDialog, setShowPatientDialog] = useState(false)
  const { data: searchResults, isLoading: isSearching } = useSearchPatients(patientSearch)

  const onSubmit = (data) => {
    if (!selectedPatient) {
      toast.error("يجب اختيار مريض")
      return
    }

    // Validate date
    if (!data.date || isNaN(new Date(data.date).getTime())) {
      toast.error("تاريخ ووقت الموعد غير صحيح")
      return
    }

    // Validate price
    if (data.price === "" || isNaN(parseFloat(data.price)) || parseFloat(data.price) < 0) {
      toast.error("سعر الحجز مطلوب ويجب أن يكون رقمًا موجبًا")
      return
    }

    createAppointment(
      {
        date: data.date,
        notes: data.notes,
        price: parseFloat(data.price) || 0,
        patient_id: selectedPatient.id,
      },
      {
        onSuccess: () => {
          reset()
          setSelectedPatient(null)
          setPatientSearch("")
          onClose()
        },
      }
    )
  }

  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setPatientSearch(patient.name)
  }

  const handlePatientCreated = (newPatient) => {
    setSelectedPatient(newPatient)
    setPatientSearch(newPatient.name)
    setShowPatientDialog(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={(isOpen) => {
        if (!isOpen) {
          reset()
          setSelectedPatient(null)
          setPatientSearch("")
          onClose()
        }
      }}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle>موعد جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Patient Search */}
            <div className="space-y-2">
              <Label htmlFor="patient">المريض *</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                  <Input
                    id="patient"
                    className="ps-9"
                    placeholder="ابحث عن مريض بالاسم أو الهاتف"
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value)
                      setSelectedPatient(null)
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPatientDialog(true)}
                  className="gap-2"
                >
                  <UserPlus className="size-4" />
                  جديد
                </Button>
              </div>

              {/* Patient Search Results */}
              {patientSearch.length >= 2 && !selectedPatient && (
                <div className="relative">
                  <div className="absolute z-10 w-full mt-1 bg-background border rounded-md shadow-lg max-h-60 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        جاري البحث...
                      </div>
                    ) : searchResults?.length > 0 ? (
                      <div className="divide-y">
                        {searchResults.map((patient) => (
                          <button
                            key={patient.id}
                            type="button"
                            className="w-full p-3 text-start hover:bg-muted transition-colors"
                            onClick={() => handlePatientSelect(patient)}
                          >
                            <div className="font-medium truncate">{patient.name}</div>
                            <div className="text-xs text-muted-foreground truncate">{patient.phone}</div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="p-3 text-sm text-muted-foreground text-center">
                        لا توجد نتائج
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Selected Patient */}
              {selectedPatient && (
                <div className="p-3 border rounded-md bg-muted/50">
                  <div className="font-medium">{selectedPatient.name}</div>
                  <div className="text-sm text-muted-foreground">{selectedPatient.phone}</div>
                </div>
              )}

              {/* Patient Selection Error */}
              {patientSearch.length >= 2 && !selectedPatient && (
                <p className="text-sm text-red-500">يجب اختيار مريض من القائمة</p>
              )}
            </div>

            {/* Date and Time */}
            <div className="space-y-2">
              <Label htmlFor="date">التاريخ والوقت *</Label>
              <SimpleDatePicker
                onDateChange={(dateTime) => {
                  setValue("date", dateTime, { shouldValidate: true })
                }}
                error={errors.date?.message}
              />
              {errors.date && (
                <p className="text-sm text-red-500">{errors.date.message}</p>
              )}
            </div>

            {/* Price */}
            <div className="space-y-2">
              <Label htmlFor="price">السعر (ريال)</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                placeholder="0.00"
                {...register("price", { 
                  required: "سعر الحجز مطلوب",
                  min: { value: 0, message: "السعر يجب أن يكون رقمًا موجبًا" },
                  validate: (value) => {
                    if (value === "" || isNaN(parseFloat(value))) {
                      return "سعر الحجز مطلوب ويجب أن يكون رقمًا"
                    }
                    return true
                  }
                })}
              />
              {errors.price && (
                <p className="text-sm text-red-500">{errors.price.message}</p>
              )}
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">نوع الحجز *</Label>
              <Textarea
                id="notes"
                placeholder="مثال: كشف، متابعة، استشارة..."
                {...register("notes", { required: "نوع الحجز مطلوب" })}
              />
              {errors.notes && (
                <p className="text-sm text-red-500">{errors.notes.message}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset()
                  setSelectedPatient(null)
                  setPatientSearch("")
                  onClose()
                }}
                disabled={isPending}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={isPending || !selectedPatient}>
                {isPending ? "جاري الإضافة..." : "إضافة موعد"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Patient Create Dialog */}
      <PatientCreateDialog
        open={showPatientDialog}
        onClose={() => setShowPatientDialog(false)}
        onPatientCreated={handlePatientCreated}
      />
    </>
  )
}