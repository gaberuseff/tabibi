import { UserPlus, CheckCircle, ArrowRight } from "lucide-react"
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
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Textarea } from "../../components/ui/textarea"
import SimpleDatePicker from "../../components/ui/simple-date-picker"
import useClinicById from "./useClinicById"
import useCreateAppointmentPublic from "./useCreateAppointmentPublic"
import useCreatePatientPublic from "../patients/useCreatePatientPublic"
import { searchPatientsPublic } from "../../services/apiAppointments"

// Simplified patient form component
function SimplifiedPatientForm({ register, errors }) {
  return (
    <div className="grid gap-4">
      <div>
        <Label htmlFor="name" className="text-sm">الاسم *</Label>
        <Input 
          id="name" 
          {...register("name", { required: "الاسم مطلوب" })} 
          placeholder="اكتب الاسم" 
          className="text-sm"
        />
        {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="phone" className="text-sm">رقم الهاتف *</Label>
        <Input 
          id="phone" 
          {...register("phone", { 
            required: "رقم الهاتف مطلوب",
            minLength: {
              value: 10,
              message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل"
            },
            pattern: {
              value: /^\d+$/,
              message: "رقم الهاتف يجب أن يحتوي على أرقام فقط"
            }
          })} 
          placeholder="أدخل رقم الهاتف" 
          className="text-sm"
        />
        {errors.phone && <p className="text-sm text-red-500 mt-1">{errors.phone.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="gender" className="text-sm">النوع *</Label>
        <select 
          id="gender"
          className="flex h-10 w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm"
          {...register("gender", { required: "النوع مطلوب" })}
        >
          <option value="">اختر</option>
          <option value="male">ذكر</option>
          <option value="female">أنثى</option>
        </select>
        {errors.gender && <p className="text-sm text-red-500 mt-1">{errors.gender.message}</p>}
      </div>
      
      <div>
        <Label htmlFor="date_of_birth" className="text-sm">تاريخ الميلاد *</Label>
        <Input 
          id="date_of_birth" 
          type="date" 
          {...register("date_of_birth", { required: "تاريخ الميلاد مطلوب" })} 
          className="text-sm"
        />
        {errors.date_of_birth && <p className="text-sm text-red-500 mt-1">{errors.date_of_birth.message}</p>}
      </div>
    </div>
  )
}

export default function BookingPage() {
  const { clinicId } = useParams()
  const navigate = useNavigate()
  const { data: clinic, isLoading: isClinicLoading, isError: isClinicError } = useClinicById(clinicId)
  const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm()
  const { register: registerPatient, handleSubmit: handleSubmitPatient, formState: { errors: patientErrors }, reset: resetPatient } = useForm()
  const { mutate: createAppointment, isPending: isCreatingAppointment } = useCreateAppointmentPublic()
  const { mutateAsync: createPatient, isPending: isCreatingPatient } = useCreatePatientPublic()
  
  const [selectedPatient, setSelectedPatient] = useState(null)
  const [isBookingComplete, setIsBookingComplete] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1 for patient form, 2 for appointment form
  
  // Watch the date field for validation
  const appointmentDate = watch("date")
  
  // Handle patient form submission
  const handlePatientSubmit = async (data) => {
    try {
      // First, check if patient already exists by phone number
      const searchResults = await searchPatientsPublic(data.phone, clinicId)
      
      if (searchResults && searchResults.length > 0) {
        // Patient exists, use the first match
        const existingPatient = searchResults[0]
        setSelectedPatient(existingPatient)
        setCurrentStep(2) // Move to appointment form
        toast.success("تم العثور على المريض في النظام")
      } else {
        // Patient doesn't exist, create new patient
        const payload = {
          name: data.name,
          phone: data.phone,
          gender: data.gender,
          date_of_birth: data.date_of_birth,
          clinic_id: clinicId
        }
        
        const newPatient = await createPatient(payload)
        setSelectedPatient(newPatient)
        setCurrentStep(2) // Move to appointment form
        toast.success("تم إضافة المريض بنجاح")
      }
    } catch (error) {
      console.error("Error handling patient:", error)
      toast.error("حدث خطأ أثناء معالجة بيانات المريض")
    }
  }
  
  // Handle appointment form submission
  const onSubmit = (data) => {
    if (!selectedPatient) {
      toast.error("يجب إدخال بيانات المريض أولاً")
      return
    }
    
    // Validate date
    if (!data.date || isNaN(new Date(data.date).getTime())) {
      toast.error("تاريخ ووقت الموعد غير صحيح")
      return
    }
    
    createAppointment(
      {
        payload: {
          date: data.date,
          notes: data.notes,
          price: clinic?.booking_price || 0,
          patient_id: selectedPatient.id,
        },
        clinicId: clinicId
      },
      {
        onSuccess: () => {
          setIsBookingComplete(true)
          reset()
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
    resetPatient()
    setSelectedPatient(null)
    setCurrentStep(1) // Go back to patient form
  }
  
  // Go back to patient form
  const handleBackToPatient = () => {
    setCurrentStep(1)
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
        
        {/* Step Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center">
            <div className={`flex flex-col items-center ${currentStep === 1 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                currentStep === 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                1
              </div>
              <span className="text-xs">بيانات المريض</span>
            </div>
            <div className="mx-4 h-px w-16 bg-muted"></div>
            <div className={`flex flex-col items-center ${currentStep === 2 ? 'text-primary' : 'text-muted-foreground'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                currentStep === 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
              }`}>
                2
              </div>
              <span className="text-xs">بيانات الحجز</span>
            </div>
          </div>
        </div>
        
        {/* Patient Form - Step 1 */}
        {currentStep === 1 && (
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="text-lg sm:text-xl">بيانات المريض</CardTitle>
              <CardDescription className="text-sm">
                أدخل بيانات المريض لإكمال الحجز
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmitPatient(handlePatientSubmit)} className="space-y-4">
                <SimplifiedPatientForm register={registerPatient} errors={patientErrors} />
                <div className="pt-2">
                  <Button type="submit" disabled={isCreatingPatient} className="w-full">
                    {isCreatingPatient ? "جاري المعالجة..." : "متابعة"}
                    <ArrowRight className="mr-2 h-4 w-4" />
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
        
        {/* Appointment Form - Step 2 */}
        {currentStep === 2 && selectedPatient && (
          <Card>
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-lg sm:text-xl">بيانات الحجز</CardTitle>
                  <CardDescription className="text-sm">
                    املأ البيانات التالية لحجز موعدك
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  onClick={handleBackToPatient}
                  className="text-sm"
                >
                  تغيير المريض
                </Button>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="font-medium text-sm">{selectedPatient.name}</p>
                <p className="text-xs text-muted-foreground">{selectedPatient.phone}</p>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                {/* Date and Time */}
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-sm">التاريخ والوقت *</Label>
                  <SimpleDatePicker
                    onDateChange={(dateTime) => {
                      // Update the form value manually
                      setValue("date", dateTime, { shouldValidate: true })
                    }}
                    error={errors.date?.message}
                  />
                  <input
                    type="hidden"
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
                <div className="flex gap-3 pt-2">
                  <Button 
                    type="button"
                    variant="outline"
                    onClick={handleBackToPatient}
                    className="flex-1"
                  >
                    السابق
                  </Button>
                  <Button 
                    type="submit" 
                    className="flex-1"
                    disabled={isCreatingAppointment}
                  >
                    {isCreatingAppointment ? "جاري الحجز..." : "حجز الموعد"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}