import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import { Button } from "../../components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../components/ui/dialog";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { useCreatePatientPlan } from "./usePatientPlans";

const formSchema = z.object({
  total_sessions: z.number().min(1, "عدد الجلسات يجب أن يكون أكبر من صفر"),
  template_id: z.string(),
  patient_id: z.string(),
});

export default function PatientPlanAssignmentForm({ 
  open, 
  onClose, 
  template, 
  patientId,
  onPlanAssigned 
}) {
  const [totalPrice, setTotalPrice] = useState(0);
  const [sessionError, setSessionError] = useState("");
  const { mutate: createPlan, isPending: isCreating } = useCreatePatientPlan();
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      total_sessions: 1,
      template_id: template?.id || "",
      patient_id: patientId || "",
    },
  });

  const watchedSessions = watch("total_sessions");

  // Calculate total price when sessions change
  useEffect(() => {
    if (template && watchedSessions) {
      const calculatedPrice = watchedSessions * (template.session_price || 0);
      setTotalPrice(calculatedPrice);
    }
  }, [watchedSessions, template]);

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset({
        total_sessions: 1,
        template_id: template?.id || "",
        patient_id: patientId || "",
      });
      if (template) {
        setTotalPrice(template.session_price || 0);
      }
      // Clear errors when opening form
      setSessionError("");
    }
  }, [open, template, patientId, reset]);

  const onSubmit = (data) => {
    console.log("onSubmit called with data:", data);
    
    // Clear previous errors
    setSessionError("");
    
    // Validate that total sessions don't exceed template session count
    if (data.total_sessions > template.session_count) {
      setSessionError(`عدد الجلسات لا يمكن أن يتجاوز ${template.session_count}`);
      return;
    }
    
    // Validate minimum sessions
    if (data.total_sessions < 1) {
      setSessionError("عدد الجلسات يجب أن يكون أكبر من صفر");
      return;
    }

    // Calculate total price
    const totalPrice = data.total_sessions * (template.session_price || 0);

    const planData = {
      total_sessions: data.total_sessions,
      template_id: data.template_id || template?.id || "",
      patient_id: data.patient_id || patientId || "",
      total_price: totalPrice,
      status: "active"
    };

    console.log("Sending plan data:", planData);
    
    // Call the mutation directly
    console.log("Calling createPlan with:", planData);
    createPlan(planData, {
      onSuccess: (result) => {
        console.log("Plan creation successful:", result);
        toast.success("تم إنشاء الخطة العلاجية بنجاح");
        onClose();
        if (onPlanAssigned) onPlanAssigned();
      },
      onError: (error) => {
        console.log("Plan creation failed:", error);
        toast.error("حدث خطأ أثناء إنشاء الخطة العلاجية");
        console.error("Error creating plan:", error);
      },
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Form submit handler called");
    
    // Get form data manually since react-hook-form might not be working
    const formData = new FormData(e.target);
    const data = {
      total_sessions: parseInt(formData.get('total_sessions')) || 1,
      template_id: template?.id || "",
      patient_id: patientId || "",
    };
    
    console.log("Manual form data:", data);
    onSubmit(data);
  };
  
  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      console.log("Dialog open state changed:", isOpen);
      if (!isOpen) {
        onClose();
      }
    }}>
      <DialogContent className="sm:max-w-[425px]" dir="rtl" onPointerDownOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>تعيين خطة علاجية</DialogTitle>
        </DialogHeader>
        
        <form 
          onSubmit={handleFormSubmit}
          className="space-y-4"
        >
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="template-name" className="text-right">
                اسم الخطة
              </Label>
              <div className="col-span-3">
                <Input
                  id="template-name"
                  value={template?.name || ""}
                  disabled
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="session-count" className="text-right">
                عدد الجلسات المتاحة
              </Label>
              <div className="col-span-3">
                <Input
                  id="session-count"
                  value={template?.session_count || 0}
                  disabled
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="session-price" className="text-right">
                سعر الجلسة
              </Label>
              <div className="col-span-3">
                <Input
                  id="session-price"
                  value={`${template?.session_price || 0} جنيه`}
                  disabled
                />
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total_sessions" className="text-right">
                عدد الجلسات
              </Label>
              <div className="col-span-3">
                <Input
                  id="total_sessions"
                  name="total_sessions"
                  type="number"
                  min="1"
                  max={template?.session_count || 1}
                  defaultValue="1"
                  className={errors.total_sessions || sessionError ? "border-red-500" : ""}
                />
                {(errors.total_sessions || sessionError) && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.total_sessions?.message || sessionError}
                  </p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="total-price" className="text-right">
                السعر الإجمالي
              </Label>
              <div className="col-span-3">
                <Input
                  id="total-price"
                  value={`${totalPrice} جنيه`}
                  disabled
                />
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              إلغاء
            </Button>
            <Button 
              type="submit" 
              disabled={isCreating}
            >
              {isCreating ? "جارٍ الإنشاء..." : "إنشاء خطة"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}