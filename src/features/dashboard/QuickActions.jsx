import {Button} from "../../components/ui/button";
import {Stethoscope, CalendarPlus, FilePlus, UserPlus} from "lucide-react";

export default function QuickActions() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button className="gap-2">
        <Stethoscope className="size-4" />
        زيارة جديدة
      </Button>
      <Button variant="outline" className="gap-2">
        <CalendarPlus className="size-4" />
        إنشاء موعد
      </Button>
      <Button variant="outline" className="gap-2">
        <FilePlus className="size-4" />
        ملاحظة طبية
      </Button>
      <Button variant="ghost" className="gap-2">
        <UserPlus className="size-4" />
        إضافة مريض
      </Button>
    </div>
  );
}
