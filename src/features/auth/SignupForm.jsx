import { useState } from "react"
import { useForm } from "react-hook-form"
import toast from "react-hot-toast"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { generateClinicId } from "../../lib/clinicIdGenerator"
import useSignup from "./useSignup"
import useVerifyClinicId from "./useVerifyClinicId"

const STEPS = {
  ACCOUNT_INFO: 1,
  PERSONAL_INFO: 2,
  ROLE_SPECIFIC: 3,
}

export default function SignupForm() {
  const [currentStep, setCurrentStep] = useState(STEPS.ACCOUNT_INFO)
  const [selectedRole, setSelectedRole] = useState("")
  const [generatedClinicId, setGeneratedClinicId] = useState("")
  const [clinicVerification, setClinicVerification] = useState({ 
    status: null, // null, 'success', 'error'
    message: "" 
  })
  const [verifiedClinicId, setVerifiedClinicId] = useState("")

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    trigger,
  } = useForm()

  const { mutate: signup, isPending: isSigningUp } = useSignup()
  const { mutate: verifyClinic, isPending: isVerifying } = useVerifyClinicId()

  const password = watch("password")
  const role = watch("role")
  const clinicIdInput = watch("clinicId")

  async function handleNextStep() {
    let fieldsToValidate = []

    if (currentStep === STEPS.ACCOUNT_INFO) {
      fieldsToValidate = ["email", "password", "confirmPassword"]
    } else if (currentStep === STEPS.PERSONAL_INFO) {
      fieldsToValidate = ["name", "phone", "role"]
    }

    const isValid = await trigger(fieldsToValidate)

    if (isValid) {
      if (currentStep === STEPS.PERSONAL_INFO && role === "doctor") {
        // Generate clinic ID for doctor using phone number
        const clinicId = generateClinicId(watch("phone"))
        setGeneratedClinicId(clinicId)
      }
      setCurrentStep((prev) => prev + 1)
    }
  }

  function handlePrevStep() {
    setCurrentStep((prev) => prev - 1)
  }

  function handleRoleChange(e) {
    setSelectedRole(e.target.value)
  }

  function handleVerifyClinicId() {
    if (!clinicIdInput) {
      setClinicVerification({
        status: 'error',
        message: "يرجى إدخال معرف العيادة"
      })
      return
    }

    verifyClinic(clinicIdInput, {
      onSuccess: () => {
        setClinicVerification({
          status: 'success',
          message: "تم التحقق من معرف العيادة بنجاح"
        })
        setVerifiedClinicId(clinicIdInput)
      },
      onError: (error) => {
        setClinicVerification({
          status: 'error',
          message: error.message || "معرف العيادة غير صالح"
        })
        setVerifiedClinicId("")
      },
    })
  }

  function onSubmit(data) {
    // For secretary, check if clinic ID was verified
    if (data.role === "secretary" && (!verifiedClinicId || verifiedClinicId !== data.clinicId)) {
      toast.error("يجب التحقق من معرف العيادة قبل إنشاء الحساب")
      return
    }

    // Generate clinic ID for doctor if not already generated
    let finalClinicId = generatedClinicId
    if (data.role === "doctor" && !finalClinicId) {
      finalClinicId = generateClinicId(data.phone)
      setGeneratedClinicId(finalClinicId)
    }

    const userData = {
      name: data.name,
      phone: data.phone,
      role: data.role,
      clinicId: data.role === "doctor" ? finalClinicId : verifiedClinicId,
    }

    // Add role-specific data
    if (data.role === "doctor") {
      userData.clinicName = data.clinicName
      userData.clinicAddress = data.clinicAddress
    } else if (data.role === "secretary") {
      // Remove permissions field as requested - permissions will be set by doctor later
      userData.permissions = []
    }

    console.log("Submitting with clinic ID:", userData.clinicId)

    signup({
      email: data.email,
      password: data.password,
      userData,
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Step Indicator */}
      <div className="flex justify-between mb-8">
        {[1, 2, 3].map((step) => (
          <div
            key={step}
            className={`flex-1 ${step < 3 ? "border-r-2" : ""} ${
              currentStep >= step
                ? "border-blue-500 text-blue-500"
                : "border-gray-300 text-gray-400"
            }`}
          >
            <div className="text-center">
              <div
                className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                  currentStep >= step
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-gray-600"
                }`}
              >
                {step}
              </div>
              <p className="text-xs mt-2">
                {step === 1
                  ? "معلومات الحساب"
                  : step === 2
                    ? "المعلومات الشخصية"
                    : "تفاصيل الدور"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Step 1: Account Information */}
      {currentStep === STEPS.ACCOUNT_INFO && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">معلومات الحساب</h3>

          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              البريد الإلكتروني *
            </label>
            <Input
              id="email"
              type="email"
              {...register("email", {
                required: "البريد الإلكتروني مطلوب",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "البريد الإلكتروني غير صالح",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              كلمة المرور *
            </label>
            <Input
              id="password"
              type="password"
              {...register("password", {
                required: "كلمة المرور مطلوبة",
                minLength: {
                  value: 6,
                  message: "كلمة المرور يجب أن تكون 6 أحرف على الأقل",
                },
              })}
            />
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="text-sm font-medium">
              تأكيد كلمة المرور *
            </label>
            <Input
              id="confirmPassword"
              type="password"
              {...register("confirmPassword", {
                required: "يرجى تأكيد كلمة المرور",
                validate: (value) =>
                  value === password || "كلمات المرور غير متطابقة",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Step 2: Personal Information */}
      {currentStep === STEPS.PERSONAL_INFO && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">المعلومات الشخصية</h3>

          <div className="space-y-2">
            <label htmlFor="name" className="text-sm font-medium">
              الاسم الكامل *
            </label>
            <Input
              id="name"
              type="text"
              {...register("name", {
                required: "الاسم مطلوب",
                minLength: {
                  value: 3,
                  message: "الاسم يجب أن يكون 3 أحرف على الأقل",
                },
              })}
            />
            {errors.name && (
              <p className="text-sm text-red-500">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="phone" className="text-sm font-medium">
              رقم الهاتف *
            </label>
            <Input
              id="phone"
              type="tel"
              {...register("phone", {
                required: "رقم الهاتف مطلوب",
                pattern: {
                  value: /^[0-9]{10,15}$/,
                  message: "رقم الهاتف غير صالح",
                },
              })}
            />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="role" className="text-sm font-medium">
              نوع المستخدم *
            </label>
            <select
              id="role"
              {...register("role", { required: "يرجى اختيار نوع المستخدم" })}
              onChange={handleRoleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">اختر نوع المستخدم</option>
              <option value="doctor">طبيب</option>
              <option value="secretary">سكرتير</option>
            </select>
            {errors.role && (
              <p className="text-sm text-red-500">{errors.role.message}</p>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Role-Specific Information */}
      {currentStep === STEPS.ROLE_SPECIFIC && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">
            {role === "doctor" ? "بيانات العيادة" : "تفاصيل السكرتير"}
          </h3>

          {role === "doctor" && (
            <>
              <div className="space-y-2">
                <label htmlFor="clinicName" className="text-sm font-medium">
                  اسم العيادة *
                </label>
                <Input
                  id="clinicName"
                  type="text"
                  {...register("clinicName", {
                    required: "اسم العيادة مطلوب",
                    minLength: {
                      value: 3,
                      message: "اسم العيادة يجب أن يكون 3 أحرف على الأقل",
                    },
                  })}
                  placeholder="مثال: عيادة د. أحمد للأسنان"
                />
                {errors.clinicName && (
                  <p className="text-sm text-red-500">
                    {errors.clinicName.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="clinicAddress" className="text-sm font-medium">
                  عنوان العيادة *
                </label>
                <Input
                  id="clinicAddress"
                  type="text"
                  {...register("clinicAddress", {
                    required: "عنوان العيادة مطلوب",
                    minLength: {
                      value: 5,
                      message: "عنوان العيادة يجب أن يكون 5 أحرف على الأقل",
                    },
                  })}
                  placeholder="مثال: 15 شارع الجامعة، القاهرة"
                />
                {errors.clinicAddress && (
                  <p className="text-sm text-red-500">
                    {errors.clinicAddress.message}
                  </p>
                )}
              </div>
            </>
          )}

          {role === "secretary" && (
            <>
              <div className="space-y-2">
                <label htmlFor="clinicId" className="text-sm font-medium">
                  معرف العيادة *
                </label>
                <div className="flex gap-2">
                  <Input
                    id="clinicId"
                    type="text"
                    {...register("clinicId", {
                      required: "معرف العيادة مطلوب",
                    })}
                    placeholder="أدخل معرف العيادة من الطبيب"
                    readOnly={!!verifiedClinicId}
                  />
                  {!verifiedClinicId ? (
                    <Button
                      type="button"
                      onClick={handleVerifyClinicId}
                      disabled={isVerifying || !clinicIdInput}
                    >
                      {isVerifying ? "جاري التحقق..." : "تحقق"}
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setVerifiedClinicId("")
                        setClinicVerification({ status: null, message: "" })
                      }}
                    >
                      تعديل
                    </Button>
                  )}
                </div>
                {errors.clinicId && (
                  <p className="text-sm text-red-500">
                    {errors.clinicId.message}
                  </p>
                )}
                {clinicVerification.status && (
                  <p className={`text-sm ${clinicVerification.status === 'success' ? 'text-green-600' : 'text-red-500'}`}>
                    {clinicVerification.message}
                  </p>
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-4">
        {currentStep > STEPS.ACCOUNT_INFO && (
          <Button type="button" onClick={handlePrevStep} variant="outline">
            السابق
          </Button>
        )}

        {currentStep < STEPS.ROLE_SPECIFIC ? (
          <Button
            type="button"
            onClick={handleNextStep}
            className={currentStep === STEPS.ACCOUNT_INFO ? "ml-auto" : ""}
          >
            التالي
          </Button>
        ) : (
          <Button 
            type="submit" 
            disabled={isSigningUp || (role === "secretary" && !verifiedClinicId)}
            className="ml-auto"
          >
            {isSigningUp ? "جاري إنشاء الحساب..." : "إنشاء الحساب"}
          </Button>
        )}
      </div>
    </form>
  )
}
