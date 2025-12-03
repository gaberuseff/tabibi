import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {Card, CardHeader} from "../../components/ui/card";
import {useAuth} from "../auth/AuthContext";
import useClinic from "../auth/useClinic";
import useClinicSecretaries from "./useClinicSecretaries";
import usePlan from "../auth/usePlan";
import useUpdateSecretaryPermissions from "./useUpdateSecretaryPermissions";
import useUpdateClinic from "./useUpdateClinic";
import ClinicInfoForm from "./ClinicInfoForm";
import PlanSection from "./PlanSection";
import SecretsSection from "./SecretsSection";
import {initializeAvailableTime} from "./clinicUtils";

export default function ClinicPage() {
  const navigate = useNavigate();
  const {user} = useAuth();
  const {
    data: clinic,
    isLoading: isClinicLoading,
    isError: isClinicError,
  } = useClinic();
  const {
    data: secretaries,
    isLoading: isSecretariesLoading,
    isError: isSecretariesError,
  } = useClinicSecretaries(user?.clinic_id);
  const {
    data: plan,
    isLoading: isPlanLoading,
    isError: isPlanError,
  } = usePlan();
  const {mutate: updatePermissions} = useUpdateSecretaryPermissions();
  const {mutate: updateClinic, isPending: isUpdating} = useUpdateClinic();

  const [clinicFormData, setClinicFormData] = useState({
    name: "",
    address: "",
    booking_price: "",
    available_time: {
      saturday: {start: "", end: "", off: false},
      sunday: {start: "", end: "", off: false},
      monday: {start: "", end: "", off: false},
      tuesday: {start: "", end: "", off: false},
      wednesday: {start: "", end: "", off: false},
      thursday: {start: "", end: "", off: false},
      friday: {start: "", end: "", off: false},
    },
  });

  // Initialize form data when clinic loads (only if not already initialized)
  useEffect(() => {
    if (!clinic) return;

    setClinicFormData((prev) => {
      const hasValues =
        prev.name ||
        prev.address ||
        prev.booking_price ||
        Object.values(prev.available_time).some(
          (t) => t.start || t.end || t.off
        );

      if (hasValues) return prev;

      const initializedAvailableTime = initializeAvailableTime(
        clinic.available_time
      );

      return {
        name: clinic.name || "",
        address: clinic.address || "",
        booking_price: clinic.booking_price || "",
        available_time: initializedAvailableTime,
      };
    });
  }, [clinic]);

  const handleUpdatePermissions = (secretaryId, permissions) => {
    updatePermissions({secretaryId, permissions});
  };

  const handleClinicChange = (e) => {
    const {name, value} = e.target;
    setClinicFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setClinicFormData((prev) => ({
      ...prev,
      available_time: {
        ...prev.available_time,
        [day]: {
          ...prev.available_time[day],
          [field]: value,
        },
      },
    }));
  };

  const toggleDayOff = (day) => {
    setClinicFormData((prev) => ({
      ...prev,
      available_time: {
        ...prev.available_time,
        [day]: {
          ...prev.available_time[day],
          off: !prev.available_time[day].off,
        },
      },
    }));
  };

  const handleUpdateClinic = (e) => {
    e.preventDefault();
    updateClinic(clinicFormData);
  };

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">تفاصيل العيادة</h1>
        <p className="text-sm text-muted-foreground">
          معلومات العيادة والسكرتير المسجلين فيها.
        </p>
      </div>

      {/* Clinic Information Card */}
      <Card>
        <CardHeader>
          <h2 className="text-lg font-semibold">معلومات العيادة</h2>
        </CardHeader>
        <ClinicInfoForm
          clinicFormData={clinicFormData}
          isClinicLoading={isClinicLoading}
          isClinicError={isClinicError}
          isUpdating={isUpdating}
          onClinicChange={handleClinicChange}
          onTimeChange={handleTimeChange}
          onDayToggle={toggleDayOff}
          onSubmit={handleUpdateClinic}
          clinicId={user?.clinic_id}
        />
      </Card>

      {/* Subscription Plan Section */}
      <PlanSection
        plan={plan}
        isPlanLoading={isPlanLoading}
        isPlanError={isPlanError}
      />

      {/* Secretaries Section */}
      <SecretsSection
        secretaries={secretaries}
        isSecretariesLoading={isSecretariesLoading}
        isSecretariesError={isSecretariesError}
        onUpdatePermissions={handleUpdatePermissions}
      />
    </div>
  );
}
