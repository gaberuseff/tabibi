import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Button } from "../../components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "../../components/ui/dialog";
import PatientForm from "./PatientForm";
import useCreatePatient from "./useCreatePatient";

export default function PatientCreateDialog({open, onClose, onPatientCreated, clinicId}) {
  const {
    register,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm();
  const {mutateAsync, isPending} = useCreatePatient();

  async function onSubmit(values) {
    try {
      const payload = {
        name: values.name,
        phone: values.phone || null,
        gender: values.gender,
        address: values.address || null,
        date_of_birth: values.date_of_birth,
        blood_type: values.blood_type || null,
        clinic_id: clinicId
      };
      const newPatient = await mutateAsync(payload);
      toast.success("تم إضافة المريض بنجاح");
      reset();
      if (onPatientCreated) {
        onPatientCreated(newPatient);
      }
      onClose?.();
    } catch (e) {
      toast.error(e.message);
    }
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <h3 className="text-lg font-semibold">إضافة مريض</h3>
      </DialogHeader>
      <DialogContent>
        <form id="create-patient-form" onSubmit={handleSubmit(onSubmit)}>
          <PatientForm register={register} errors={errors} />
        </form>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          إلغاء
        </Button>
        <Button form="create-patient-form" type="submit" disabled={isPending}>
          {isPending ? "جارٍ الإضافة..." : "اضافة"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
