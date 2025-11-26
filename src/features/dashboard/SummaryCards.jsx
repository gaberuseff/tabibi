import { Card, CardContent } from "../../components/ui/card";
import { CalendarDays, Users, Clock, FileText } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import useDashboardStats from "./useDashboardStats";
import { SkeletonLine } from "../../components/ui/skeleton";

function Stat({ icon: Icon, label, value, isLoading }) {
  return (
    <Card className="bg-card/70">
      <CardContent className="flex items-center gap-4 py-5">
        <div className="size-10 rounded-[calc(var(--radius)-4px)] bg-primary/10 text-primary grid place-items-center">
          <Icon className="size-5" />
        </div>
        <div>
          <div className="text-xs text-muted-foreground">{label}</div>
          {isLoading ? (
            <SkeletonLine className="h-5 w-12" />
          ) : (
            <div className="text-xl font-semibold">{value}</div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function SummaryCards() {
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Stat
        icon={CalendarDays}
        label="مواعيد اليوم"
        value={stats?.todayAppointments || 0}
        isLoading={isLoading}
      />
      <Stat
        icon={Users}
        label="عدد المرضى"
        value={stats?.totalPatients || 0}
        isLoading={isLoading}
      />
      <Stat
        icon={FileText}
        label="ملفات محدثة"
        value={stats?.updatedPatients || 0}
        isLoading={isLoading}
      />
      <Stat
        icon={Clock}
        label="المواعيد المعلقة"
        value={stats?.pendingAppointments || 0}
        isLoading={isLoading}
      />
    </div>
  );
}