import React from "react";
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import useUpdateTreatmentTemplate from "./useUpdateTreatmentTemplate";
import TreatmentTemplateForm from "./TreatmentTemplateForm";
import toast from "react-hot-toast";

export default function TreatmentTemplateEditDialog({ open, onClose, template }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm();
  
  const { mutateAsync, isPending } = useUpdateTreatmentTemplate();

  // Set form values when template changes
  React.useEffect(() => {
    if (template && open) {
      setValue("name", template.name);
      setValue("session_count", template.session_count);
      setValue("session_price", template.session_price);
    }
  }, [template, open, setValue]);

  function handleClose() {
    reset();
    onClose?.();
  }

  async function onSubmit(values) {
    try {
      if (!template?.id) {
        throw new Error("معرف الخطة مفقود");
      }
      
      const payload = {
        name: values.name,
        session_count: parseInt(values.session_count),
        session_price: parseFloat(values.session_price),
      };
      
      await mutateAsync({ id: template.id, payload });
      toast.success("تم تحديث خطة العلاج بنجاح");
      handleClose();
    } catch (e) {
      console.error("Error updating treatment template:", e);
      toast.error("حدث خطأ أثناء تحديث خطة العلاج");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <h3 className="text-lg font-semibold">تعديل خطة علاج</h3>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TreatmentTemplateForm register={register} errors={errors} />
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={handleClose} type="button">
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري التحديث..." : "تحديث الخطة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}