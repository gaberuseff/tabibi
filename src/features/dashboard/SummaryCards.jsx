import {Card, CardContent} from "../../components/ui/card";
import {CalendarDays, Users, Receipt, FileText} from "lucide-react";
import {formatCurrency} from "../../lib/utils";

function Stat({icon: Icon, label, value}) {
  return (
    <Card className="bg-card/70">
      <CardContent className="flex items-center gap-4 py-5">
        <div className="size-10 rounded-[calc(var(--radius)-4px)] bg-primary/10 text-primary grid place-items-center">
          <Icon className="size-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          <div className="text-xl font-semibold">{value}</div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SummaryCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat icon={CalendarDays} label="مواعيد اليوم" value="12" />
      <Stat icon={Users} label="عدد المرضى" value="248" />
      <Stat icon={FileText} label="ملفات محدثة" value="34" />
      <Stat
        icon={Receipt}
        label="إيراد هذا الشهر"
        value={formatCurrency(4560)}
      />
    </div>
  );
}
