import {ArrowRight} from "lucide-react";
import {Label} from "../../components/ui/label";
import {Input} from "../../components/ui/input";
import {Button} from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

export default function PatientFormCard({
  register,
  errors,
  onSubmit,
  isLoading,
}) {
  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg sm:text-xl">بيانات المريض</CardTitle>
        <CardDescription className="text-sm">
          أدخل بيانات المريض لإكمال الحجز
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Name Field */}
          <div>
            <Label htmlFor="name" className="text-sm">
              الاسم *
            </Label>
            <Input
              id="name"
              {...register("name", {required: "الاسم مطلوب"})}
              placeholder="اكتب الاسم"
              className="text-sm"
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Phone Field */}
          <div>
            <Label htmlFor="phone" className="text-sm">
              رقم الهاتف *
            </Label>
            <Input
              id="phone"
              {...register("phone", {
                required: "رقم الهاتف مطلوب",
                minLength: {
                  value: 10,
                  message: "رقم الهاتف يجب أن يكون 10 أرقام على الأقل",
                },
                pattern: {
                  value: /^\d+$/,
                  message: "رقم الهاتف يجب أن يحتوي على أرقام فقط",
                },
              })}
              placeholder="أدخل رقم الهاتف"
              className="text-sm"
            />
            {errors.phone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Gender Field */}
          <div>
            <Label htmlFor="gender" className="text-sm">
              النوع *
            </Label>
            <select
              id="gender"
              className="flex h-10 w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm"
              {...register("gender", {required: "النوع مطلوب"})}>
              <option value="">اختر</option>
              <option value="male">ذكر</option>
              <option value="female">أنثى</option>
            </select>
            {errors.gender && (
              <p className="text-sm text-red-500 mt-1">
                {errors.gender.message}
              </p>
            )}
          </div>

          {/* Date of Birth Field */}
          <div>
            <Label htmlFor="date_of_birth" className="text-sm">
              تاريخ الميلاد *
            </Label>
            <Input
              id="date_of_birth"
              type="date"
              {...register("date_of_birth", {required: "تاريخ الميلاد مطلوب"})}
              className="text-sm"
            />
            {errors.date_of_birth && (
              <p className="text-sm text-red-500 mt-1">
                {errors.date_of_birth.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "جاري المعالجة..." : "متابعة"}
              <ArrowRight className="mr-2 h-4 w-4" />
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
