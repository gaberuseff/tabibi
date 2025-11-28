import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { useForm } from "react-hook-form";
import useCreateTreatmentTemplate from "./useCreateTreatmentTemplate";
import TreatmentTemplateForm from "./TreatmentTemplateForm";
import toast from "react-hot-toast";

export default function TreatmentTemplateCreateDialog({ open, onClose, onTemplateCreated }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const { mutateAsync, isPending } = useCreateTreatmentTemplate();

  function handleClose() {
    reset();
    onClose?.();
  }

  async function onSubmit(values) {
    try {
      const payload = {
        name: values.name,
        session_count: parseInt(values.session_count),
        session_price: parseFloat(values.session_price),
      };
      
      const newTemplate = await mutateAsync(payload);
      toast.success("تم إضافة خطة العلاج بنجاح");
      reset();
      if (onTemplateCreated) {
        onTemplateCreated(newTemplate);
      }
      handleClose();
    } catch (e) {
      console.error("Error creating treatment template:", e);
      toast.error("حدث خطأ أثناء إضافة خطة العلاج");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <h3 className="text-lg font-semibold">إضافة خطة علاج جديدة</h3>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <TreatmentTemplateForm register={register} errors={errors} />
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={onClose} type="button">
              إلغاء
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "جاري الإضافة..." : "إضافة خطة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}