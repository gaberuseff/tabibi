import {Button} from "../../components/ui/button";
import {Input} from "../../components/ui/input";
import {Label} from "../../components/ui/label";
import {SkeletonLine} from "../../components/ui/skeleton";
import WorkingHours from "./WorkingHours";
import {getDayName} from "./clinicUtils";

export default function ClinicInfoForm({
  clinicFormData,
  isClinicLoading,
  isClinicError,
  isUpdating,
  onClinicChange,
  onTimeChange,
  onDayToggle,
  onSubmit,
  clinicId,
}) {
  return (
    <>
      {isClinicLoading ? (
        <div className="space-y-4 p-6">
          <SkeletonLine className="h-4 w-1/3" />
          <SkeletonLine className="h-4 w-2/3" />
        </div>
      ) : isClinicError ? (
        <div className="text-destructive p-6">
          حدث خطأ أثناء تحميل معلومات العيادة
        </div>
      ) : (
        <form onSubmit={onSubmit} className="space-y-4 p-6">
          <div className="space-y-3">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="clinicName">اسم العيادة</Label>
              <Input
                id="clinicName"
                name="name"
                value={clinicFormData.name}
                onChange={onClinicChange}
                placeholder="أدخل اسم العيادة"
              />
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="clinicAddress">عنوان العيادة</Label>
              <Input
                id="clinicAddress"
                name="address"
                value={clinicFormData.address}
                onChange={onClinicChange}
                placeholder="أدخل عنوان العيادة"
              />
            </div>

            {/* Booking Price */}
            <div className="space-y-2">
              <Label htmlFor="bookingPrice">سعر الحجز</Label>
              <Input
                id="bookingPrice"
                name="booking_price"
                type="number"
                step="0.01"
                min="0"
                value={clinicFormData.booking_price}
                onChange={onClinicChange}
                placeholder="أدخل سعر الحجز"
              />
              <p className="text-xs text-muted-foreground">
                سعر الحجز الذي سيظهر لمرضى العيادة عند الحجز
              </p>
            </div>

            {/* Working Hours */}
            <WorkingHours
              availableTime={clinicFormData.available_time}
              onTimeChange={onTimeChange}
              onDayToggle={onDayToggle}
              getDayName={getDayName}
            />

            {/* Booking Link */}
            <div className="space-y-2">
              <Label>رابط الحجز</Label>
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/booking/${clinicId}`}
                  readOnly
                />
                <Button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/booking/${clinicId}`
                    );
                    alert("تم نسخ الرابط إلى الحافظة");
                  }}>
                  نسخ
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                شارك هذا الرابط مع مرضاك لحجز المواعيد
              </p>
            </div>

            {/* Clinic ID */}
            <div className="space-y-2">
              <Label>معرف العيادة</Label>
              <Input value={clinicId || ""} disabled />
              <p className="text-xs text-muted-foreground">
                لا يمكن تغيير معرف العيادة
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <Button type="submit" disabled={isUpdating}>
              {isUpdating ? "جاري الحفظ..." : "حفظ التغييرات"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
