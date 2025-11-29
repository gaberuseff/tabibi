import { Label } from "../../components/ui/label";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";

export default function TreatmentTemplateForm({ register, errors }) {
  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">اسم الخطة</Label>
        <Input
          id="name"
          {...register("name", { required: "اسم الخطة مطلوب" })}
          placeholder="أدخل اسم الخطة"
        />
        {errors.name && (
          <p className="text-sm text-red-500 mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="session_price">سعر الجلسة الواحدة</Label>
        <Input
          id="session_price"
          type="number"
          step="0.01"
          min="0"
          {...register("session_price", { 
            required: "سعر الجلسة مطلوب",
            min: { value: 0, message: "يجب أن يكون السعر أكبر من أو يساوي 0" }
          })}
          placeholder="أدخل سعر الجلسة"
        />
        {errors.session_price && (
          <p className="text-sm text-red-500 mt-1">{errors.session_price.message}</p>
        )}
      </div>

      <div>
        <Label htmlFor="description">وصف الخطة (اختياري)</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="أدخل وصف الخطة العلاجية"
          className="min-h-[100px]"
        />
      </div>
    </div>
  );
}