import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogFooter,
} from "../../components/ui/dialog";
import {Button} from "../../components/ui/button";
import {useForm} from "react-hook-form";
import useCreatePatient from "./useCreatePatient";
import PatientForm from "./PatientForm";
import toast from "react-hot-toast";

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
      console.log(payload);
      const newPatient = await mutateAsync(payload);
      toast.success("تم إضافة المريض بنجاح");
      reset();
      if (onPatientCreated) {
        onPatientCreated(newPatient);
      }
      onClose?.();
    } catch (e) {
      toast.error("حدث خطأ أثناء الإضافة");
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
          حفظ
        </Button>
      </DialogFooter>
    </Dialog>
  );
}
