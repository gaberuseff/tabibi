import {useState} from "react";
import {useForm} from "react-hook-form";
import toast from "react-hot-toast";
import {useParams} from "react-router-dom";
import AppointmentFormCard from "./AppointmentFormCard";
import BookingSuccessCard from "./BookingSuccessCard";
import ClinicInfoCard from "./ClinicInfoCard";
import ErrorState from "./ErrorState";
import LoadingState from "./LoadingState";
import PatientFormCard from "./PatientFormCard";
import StepIndicator from "./StepIndicator";
import {isAppointmentFormValid, validateWorkingHours} from "./bookingUtils";
import useClinicById from "./useClinicById";
import useCreateAppointmentPublic from "./useCreateAppointmentPublic";
import usePatientHandling from "./usePatientHandling";

export default function BookingPage() {
  const {clinicId} = useParams();
  const {
    data: clinic,
    isLoading: isClinicLoading,
    isError: isClinicError,
  } = useClinicById(clinicId);
  const {
    register: registerPatient,
    handleSubmit: handleSubmitPatient,
    formState: {errors: patientErrors},
    reset: resetPatient,
  } = useForm();
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
    setValue,
    watch,
  } = useForm();
  const {mutate: createAppointment, isPending: isCreatingAppointment} =
    useCreateAppointmentPublic();
  const {handlePatientSubmit, isCreatingPatient} = usePatientHandling();

  const [selectedPatient, setSelectedPatient] = useState(null);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handlePatientFormSubmit = async (data) => {
    try {
      const patient = await handlePatientSubmit(data, clinicId);
      setSelectedPatient(patient);
      setCurrentStep(2);
    } catch (error) {
      console.error("Error submitting patient form:", error);
    }
  };

  // Handle appointment form submission
  const onSubmit = (data) => {
    if (!selectedPatient) {
      toast.error("يجب إدخال بيانات المريض أولاً");
      return;
    }

    if (!data.date || isNaN(new Date(data.date).getTime())) {
      toast.error("تاريخ ووقت الموعد غير صحيح");
      return;
    }

    const validationError = validateWorkingHours(
      data.date,
      clinic?.available_time
    );
    if (validationError) {
      toast.error(validationError);
      return;
    }

    createAppointment(
      {
        payload: {
          date: data.date,
          notes: data.notes,
          price: clinic?.booking_price || 0,
          patient_id: selectedPatient.id,
        },
        clinicId: clinicId,
      },
      {
        onSuccess: () => {
          setIsBookingComplete(true);
          reset();
        },
        onError: (error) => {
          console.error("Error creating appointment:", error);
          toast.error("حدث خطأ أثناء حجز الموعد");
        },
      }
    );
  };

  // Reset form and start over
  const handleReset = () => {
    setIsBookingComplete(false);
    reset();
    resetPatient();
    setSelectedPatient(null);
    setCurrentStep(1);
  };

  // Go back to patient form
  const handleBackToPatient = () => {
    setCurrentStep(1);
  };

  // Loading state
  if (isClinicLoading) {
    return <LoadingState />;
  }

  // Error state
  if (isClinicError) {
    return <ErrorState />;
  }

  // Success state
  if (isBookingComplete) {
    return <BookingSuccessCard onReset={handleReset} />;
  }

  // Main booking page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8 px-4 sm:py-12">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">
            حجز موعد
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            احجز موعدك بسهولة في {clinic?.name}
          </p>
        </div>

        {/* Clinic Info */}
        <ClinicInfoCard clinic={clinic} />

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} />

        {/* Patient Form - Step 1 */}
        {currentStep === 1 && (
          <PatientFormCard
            register={registerPatient}
            errors={patientErrors}
            onSubmit={handleSubmitPatient(handlePatientFormSubmit)}
            isLoading={isCreatingPatient}
          />
        )}

        {/* Appointment Form - Step 2 */}
        {currentStep === 2 && selectedPatient && (
          <AppointmentFormCard
            register={register}
            errors={errors}
            watch={watch}
            setValue={setValue}
            onSubmit={handleSubmit(onSubmit)}
            isLoading={isCreatingAppointment}
            clinic={clinic}
            selectedPatient={selectedPatient}
            onChangePatient={handleBackToPatient}
            validateWorkingHours={validateWorkingHours}
            isAppointmentFormValid={isAppointmentFormValid}
          />
        )}
      </div>
    </div>
  );
}
