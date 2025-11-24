import SummaryCards from "./SummaryCards";
import QuickActions from "./QuickActions";
import Activity from "./Activity";
import {Card, CardContent, CardHeader} from "../../components/ui/card";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">لوحة التحكم</h1>
        <p className="text-sm text-muted-foreground">
          نظرة عامة سريعة على نشاط العيادة.
        </p>
      </div>

      <SummaryCards />

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">إجراءات سريعة</h3>
        </CardHeader>
        <CardContent>
          <QuickActions />
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold">المساحة الرئيسية</h3>
            </CardHeader>
            <CardContent>
              <div className="rounded-[var(--radius)] border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
                سيتم عرض المخططات والتقويم هنا لاحقاً
              </div>
            </CardContent>
          </Card>
        </div>
        <Activity />
      </div>
    </div>
  );
}
