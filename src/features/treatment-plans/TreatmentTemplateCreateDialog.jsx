import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../components/ui/dialog";
import TreatmentTemplateForm from "./TreatmentTemplateForm";
import useCreateTreatmentTemplate from "./useCreateTreatmentTemplate";

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
        session_price: parseFloat(values.session_price),
        description: values.description || null,
      };
      
      const newTemplate = await mutateAsync(payload);
      reset();
      if (onTemplateCreated) {
        onTemplateCreated(newTemplate);
      }
      handleClose();
    } catch (e) {
      console.error("Error creating treatment template:", e);
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