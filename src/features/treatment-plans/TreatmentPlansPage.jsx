import { Plus } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import TreatmentTemplateCreateDialog from "./TreatmentTemplateCreateDialog";
import TreatmentTemplatesList from "./TreatmentTemplatesList";
import useTreatmentTemplates from "./useTreatmentTemplates";

export default function TreatmentPlansPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data: templates } = useTreatmentTemplates();
  
  return (
    <div className="space-y-8" dir="rtl">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold">خطط العلاج</h1>
          <p className="text-sm text-muted-foreground">
            إدارة خطط العلاج والبحث.
          </p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="ml-2 h-4 w-4" />
          إضافة خطة
        </Button>
      </div>
      
      <TreatmentTemplatesList />
      
      <TreatmentTemplateCreateDialog 
        open={isDialogOpen} 
        onClose={() => setIsDialogOpen(false)} 
      />
    </div>
  );
}