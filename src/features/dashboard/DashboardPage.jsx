import SummaryCards from "./SummaryCards";
import Activity from "./Activity";
import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Calendar, TrendingUp, Stethoscope } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <Stethoscope className="size-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">لوحة التحكم</h1>
            <p className="text-sm text-muted-foreground">
              نظرة عامة سريعة على نشاط العيادة.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <SummaryCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Charts/Calendar Placeholder */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Calendar className="size-5 text-primary" />
                الإحصائيات والجداول
              </h3>
            </CardHeader>
            <CardContent>
              <div className="rounded-[var(--radius)] border border-dashed border-border p-8 text-center">
                <div className="mx-auto size-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                  <TrendingUp className="size-8 text-primary" />
                </div>
                <h4 className="text-lg font-semibold mb-2">تحليلات مفصلة</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  سيتم عرض المخططات والإحصائيات التفصيلية هنا لاحقًا
                </p>
                <div className="grid grid-cols-3 gap-4 mt-6">
                  <div className="h-2 rounded-full bg-primary/20"></div>
                  <div className="h-2 rounded-full bg-primary/40"></div>
                  <div className="h-2 rounded-full bg-primary/60"></div>
                  <div className="h-2 rounded-full bg-primary/30"></div>
                  <div className="h-2 rounded-full bg-primary/50"></div>
                  <div className="h-2 rounded-full bg-primary/70"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Activity />
      </div>
    </div>
  );
}