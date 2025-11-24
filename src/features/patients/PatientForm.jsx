import { Input } from "../../components/ui/input"

export default function PatientForm({ defaultValues = {}, register, errors }) {
  return (
    <div className="grid gap-3">
      <div>
        <label className="mb-1 block text-sm">الاسم</label>
        <Input defaultValue={defaultValues.name} {...register("name", { required: true })} placeholder="اكتب الاسم" />
        {errors.name && <div className="mt-1 text-xs text-red-600">هذا الحقل مطلوب</div>}
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm">الهاتف</label>
          <Input defaultValue={defaultValues.phone ?? ""} {...register("phone")} placeholder="05XXXXXXXX" />
        </div>
        <div>
          <label className="mb-1 block text-sm">النوع</label>
          <select defaultValue={defaultValues.gender ?? ""} className="flex h-10 w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm" {...register("gender", { required: true })}>
            <option value="">اختر</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
          {errors.gender && <div className="mt-1 text-xs text-red-600">هذا الحقل مطلوب</div>}
        </div>
      </div>
      <div>
        <label className="mb-1 block text-sm">العنوان</label>
        <Input defaultValue={defaultValues.address ?? ""} {...register("address")} placeholder="العنوان" />
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className="mb-1 block text-sm">تاريخ الميلاد</label>
          <Input type="date" defaultValue={defaultValues.date_of_birth ?? ""} {...register("date_of_birth", { required: true })} />
          {errors.date_of_birth && <div className="mt-1 text-xs text-red-600">هذا الحقل مطلوب</div>}
        </div>
        <div>
          <label className="mb-1 block text-sm">فصيلة الدم</label>
          <select defaultValue={defaultValues.blood_type ?? ""} className="flex h-10 w-full rounded-[var(--radius)] border border-border bg-background px-3 py-2 text-sm" {...register("blood_type") }>
            <option value="">غير محدد</option>
            {["A+","A-","B+","B-","AB+","AB-","O+","O-"].map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

