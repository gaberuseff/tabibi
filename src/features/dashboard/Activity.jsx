import {Card, CardContent, CardHeader} from "../../components/ui/card";
import {Badge} from "../../components/ui/badge";
import {CalendarDays, Stethoscope, Receipt} from "lucide-react";

function Item({icon: Icon, title, time, tag}) {
  return (
    <div className="flex items-center justify-between gap-3 py-2">
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-[calc(var(--radius)-6px)] bg-muted text-foreground grid place-items-center">
          <Icon className="size-4" />
        </div>
        <div>
          <div className="text-sm font-medium">{title}</div>
          <div className="text-xs text-muted-foreground">{time}</div>
        </div>
      </div>
      {tag ? <Badge className="bg-primary/10 text-primary">{tag}</Badge> : null}
    </div>
  );
}

export default function Activity() {
  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">نشاط سريع</h3>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          <Item
            icon={CalendarDays}
            title="حجز موعد - أحمد"
            time="اليوم 10:30 ص"
            tag="جديد"
          />
          <Item
            icon={Stethoscope}
            title="زيارة مكتملة - سارة"
            time="أمس 4:05 م"
          />
          <Item icon={Receipt} title="فاتورة مدفوعة - خالد" time="قبل 3 أيام" />
        </div>
      </CardContent>
    </Card>
  );
}
