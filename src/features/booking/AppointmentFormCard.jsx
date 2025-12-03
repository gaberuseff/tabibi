import {Label} from "../../components/ui/label";
import {Input} from "../../components/ui/input";
import {Textarea} from "../../components/ui/textarea";
import {Button} from "../../components/ui/button";
import SimpleDatePicker from "../../components/ui/simple-date-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function AppointmentFormCard({
  register,
  errors,
  watch,
  setValue,
  onSubmit,
  isLoading,
  clinic,
  selectedPatient,
  onChangePatient,
  validateWorkingHours,
  isAppointmentFormValid,
}) {
  const appointmentDate = watch("date");

  return (
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
            onClick={onChangePatient}
            className="text-sm">
            تغيير المريض
          </Button>
        </div>
        <div className="mt-4 p-3 bg-muted rounded-lg">
          <p className="font-medium text-sm">{selectedPatient?.name}</p>
          <p className="text-xs text-muted-foreground">
            {selectedPatient?.phone}
          </p>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Date and Time */}
          <div className="space-y-2">
            <Label htmlFor="date" className="text-sm">
              التاريخ والوقت *
            </Label>
            <SimpleDatePicker
              onDateChange={(dateTime) => {
                setValue("date", dateTime, {shouldValidate: true});
              }}
              error={errors.date?.message}
              availableTime={clinic?.available_time}
              selectedDay={appointmentDate}
            />
            <input
              type="hidden"
              {...register("date", {
                required: "التاريخ والوقت مطلوب",
                validate: (value) => {
                  if (!value || isNaN(new Date(value).getTime())) {
                    return "تاريخ ووقت الموعد غير صحيح";
                  }

                  const validationError = validateWorkingHours(
                    value,
                    clinic?.available_time
                  );
                  if (validationError) {
                    return validationError;
                  }

                  return true;
                },
              })}
            />
            {errors.date && (
              <p className="text-sm text-red-500">{errors.date.message}</p>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm">
              نوع الحجز *
            </Label>
            <Textarea
              id="notes"
              placeholder="مثال: كشف، متابعة، استشارة..."
              className="text-sm"
              {...register("notes", {required: "نوع الحجز مطلوب"})}
            />
            {errors.notes && (
              <p className="text-sm text-red-500">{errors.notes.message}</p>
            )}
          </div>

          {/* Price (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="price" className="text-sm">
              سعر الحجز (جنيه)
            </Label>
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
              onClick={onChangePatient}
              className="flex-1">
              السابق
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={
                isLoading ||
                !isAppointmentFormValid(appointmentDate, clinic?.available_time)
              }>
              {isLoading ? "جاري الحجز..." : "حجز الموعد"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
