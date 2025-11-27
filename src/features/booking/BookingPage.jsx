import { Search, UserPlus, CheckCircle } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import PatientForm from "../patients/PatientForm"
import useClinicById from "./useClinicById"
import useCreateAppointmentPublic from "./useCreateAppointmentPublic"
import useCreatePatient from "../patients/useCreatePatient"
import useSearchPatientsPublic from "./useSearchPatientsPublic"

export default function BookingPage() {
  const { clinicId } = useParams()
  console.log("Clinic ID from URL params:", clinicId);
  console.log("Clinic ID type:", typeof clinicId);
  
  const navigate = useNavigate()
  const { data: clinic, isLoading: isClinicLoading, isError: isClinicError } = useClinicById(clinicId)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()
  const { mutate: createAppointment, isPending: isCreatingAppointment } = useCreateAppointmentPublic()
  const { mutateAsync: createPatient, isPending: isCreatingPatient } = useCreatePatient()
  
  const [patientSearch, setPatientSearch] = useState("")
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showPatientDialog, setShowPatientDialog] = useState(false)
  const [isBookingComplete, setIsBookingComplete] = useState(false)
  
  // Only search when we have at least 10 digits
  const shouldSearch = patientSearch.replace(/\D/g, '').length >= 10;
  const { data: searchResults, isLoading: isSearching } = useSearchPatientsPublic(
    shouldSearch ? patientSearch : "", 
    clinicId // Pass as string to preserve precision
  )

  // Handle patient search - only by phone number
  const handlePatientSearch = (value) => {
    // Only allow numbers in the search field
    const numericValue = value.replace(/\D/g, '');
    setPatientSearch(numericValue);
    
    if (numericValue.length < 10) {
      setSelectedPatient(null)
    }
  }

  // Handle patient selection from search results
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient)
    setPatientSearch(patient.phone)
  }

  // Handle creating a new patient
  const handleCreatePatient = async (values) => {
    try {
      const payload = {
        name: values.name,
        phone: values.phone || null,
        gender: values.gender,
        address: values.address || null,
        date_of_birth: values.date_of_birth,
        blood_type: values.blood_type || null,
        clinic_id: clinicId // Pass as string to preserve precision
      }
      
      const newPatient = await createPatient(payload)
      toast.success("تم إضافة المريض بنجاح")
      setSelectedPatient(newPatient)
      setPatientSearch(newPatient.phone)
      setShowPatientDialog(false)
      return newPatient
    } catch (e) {
      toast.error("حدث خطأ أثناء إضافة المريض")
      throw e
    }
  }

  // Handle form submission
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

    console.log("Creating appointment with clinicId:", clinicId);
    console.log("Clinic ID type:", typeof clinicId);
    
    createAppointment(
      {
        payload: {
          date: data.date,
          notes: data.notes,
          price: clinic?.booking_price || 0,
          patient_id: selectedPatient.id,
        },
        clinicId: clinicId // Pass as string to preserve precision
      },
      {
        onSuccess: () => {
          setIsBookingComplete(true)
          reset()
          setSelectedPatient(null)
          setPatientSearch("")
        },
        onError: (error) => {
          console.error("Error creating appointment:", error)
          toast.error("حدث خطأ أثناء حجز الموعد")
        }
      }
    )
  }

  // Reset form and start over
  const handleReset = () => {
    setIsBookingComplete(false)
    reset()
    setSelectedPatient(null)
    setPatientSearch("")
  }

  if (isClinicLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">جاري تحميل بيانات العيادة...</p>
        </div>
      </div>
    )
  }

  if (isClinicError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-red-500 text-xl font-bold">خطأ</div>
          <p className="mt-2 text-muted-foreground">تعذر تحميل بيانات العيادة. تأكد من صحة الرابط.</p>
          <Button className="mt-4" onClick={() => navigate("/")}>العودة للرئيسية</Button>
        </div>
      </div>
    )
  }

  if (isBookingComplete) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">تم حجز الموعد بنجاح!</h2>
            <p className="text-muted-foreground mb-6">
              شكراً لك على حجزك. سيتم التواصل معك قريباً لتأكيد الموعد.
            </p>
            <Button onClick={handleReset} className="w-full">
              حجز موعد آخر
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">حجز موعد</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            احجز موعدك بسهولة في {clinic?.name}
          </p>
        </div>

        {/* Clinic Info Card */}
        <Card className="mb-6 sm:mb-8">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg sm:text-xl">{clinic?.name}</CardTitle>
            <CardDescription className="text-sm">{clinic?.address}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-muted rounded-lg">
              <span className="font-medium text-sm sm:text-base">سعر الحجز:</span>
              <span className="text-xl sm:text-2xl font-bold text-primary">
                {clinic?.booking_price ? `${clinic.booking_price} جنيه` : "مجاني"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Booking Form */}
        <Card>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">بيانات الحجز</CardTitle>
            <CardDescription className="text-sm">
              املأ البيانات التالية لحجز موعدك
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Patient Search - Phone only */}
              <div className="space-y-2">
                <Label htmlFor="patient" className="text-sm">رقم الهاتف *</Label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                    <Input
                      id="patient"
                      className="ps-9 text-sm"
                      placeholder="أدخل رقم هاتفك (10 أرقام على الأقل)"
                      value={patientSearch}
                      onChange={(e) => handlePatientSearch(e.target.value)}
                      maxLength="15"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowPatientDialog(true)}
                    className="gap-2 whitespace-nowrap text-sm"
                  >
                    <UserPlus className="size-4" />
                    <span className="hidden sm:inline">مريض جديد</span>
                    <span className="sm:hidden">جديد</span>
                  </Button>
                </div>
                
                {/* Search instruction */}
                <p className="text-xs text-muted-foreground">
                  يجب إدخال 10 أرقام على الأقل للبحث عن المريض
                </p>
                
                {/* Search Results */}
                {shouldSearch && !selectedPatient && (
                  <div className="relative">
                    <div className="absolute z-10 mt-1 w-full rounded-lg bg-background border shadow-md max-h-48 overflow-y-auto">
                      {isSearching ? (
                        <div className="p-2 text-sm text-muted-foreground text-center">
                          جاري البحث...
                        </div>
                      ) : searchResults && searchResults.length > 0 ? (
                        <div className="py-1">
                          {searchResults.map((patient) => (
                            <button
                              key={patient.id}
                              type="button"
                              className="w-full px-3 py-2 text-start hover:bg-muted transition-colors text-sm"
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
                    <div className="font-medium text-sm">{selectedPatient.name}</div>
                    <div className="text-xs text-muted-foreground">{selectedPatient.phone}</div>
                  </div>
                )}

                {/* Patient Selection Error */}
                {patientSearch.length >= 10 && !selectedPatient && (
                  <p className="text-sm text-red-500">يجب اختيار مريض من القائمة</p>
                )}
              </div>

              {/* Date and Time */}
              <div className="space-y-2">
                <Label htmlFor="date" className="text-sm">التاريخ والوقت *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  className="text-sm"
                  {...register("date", { 
                    required: "التاريخ والوقت مطلوب",
                    validate: (value) => {
                      if (!value || isNaN(new Date(value).getTime())) {
                        return "تاريخ ووقت الموعد غير صحيح"
                      }
                      return true
                    }
                  })}
                />
                {errors.date && (
                  <p className="text-sm text-red-500">{errors.date.message}</p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes" className="text-sm">نوع الحجز *</Label>
                <Textarea
                  id="notes"
                  placeholder="مثال: كشف، متابعة، استشارة..."
                  className="text-sm"
                  {...register("notes", { required: "نوع الحجز مطلوب" })}
                />
                {errors.notes && (
                  <p className="text-sm text-red-500">{errors.notes.message}</p>
                )}
              </div>

              {/* Price (Read-only) */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm">سعر الحجز (جنيه)</Label>
                <Input
                  id="price"
                  type="text"
                  value={clinic?.booking_price || 0}
                  readOnly
                  className="bg-muted text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  السعر محدد مسبقًا من قبل العيادة
                </p>
              </div>

              {/* Actions */}
              <div className="pt-2">
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isCreatingAppointment || !selectedPatient}
                >
                  {isCreatingAppointment ? "جاري الحجز..." : "حجز الموعد"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Patient Create Dialog */}
      <Dialog open={showPatientDialog} onOpenChange={setShowPatientDialog}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-lg">إضافة مريض جديد</DialogTitle>
          </DialogHeader>
          <PatientCreateForm 
            onSubmit={handleCreatePatient}
            isSubmitting={isCreatingPatient}
            onCancel={() => setShowPatientDialog(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Separate component for patient creation form
function PatientCreateForm({ onSubmit, isSubmitting, onCancel }) {
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const handleFormSubmit = async (data) => {
    try {
      await onSubmit(data)
      reset()
    } catch (error) {
      // Error handled in onSubmit function
    }
  }

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <PatientForm register={register} errors={errors} />
      <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
          className="w-full sm:w-auto"
        >
          إلغاء
        </Button>
        <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
          {isSubmitting ? "جاري الإضافة..." : "إضافة المريض"}
        </Button>
      </div>
    </form>
  )
}