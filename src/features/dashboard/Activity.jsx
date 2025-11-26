import { Card, CardContent, CardHeader } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { CalendarDays, Stethoscope, Receipt } from "lucide-react";
import useRecentActivity from "./useRecentActivity";
import { SkeletonLine } from "../../components/ui/skeleton";

function Item({ icon: Icon, title, time, tag, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-between gap-3 py-2">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-[calc(var(--radius)-6px)] bg-muted animate-pulse" />
          <div className="space-y-2">
            <SkeletonLine className="h-3 w-24" />
            <SkeletonLine className="h-2 w-16" />
          </div>
        </div>
        <SkeletonLine className="h-5 w-12" />
      </div>
    );
  }

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
  const { data: activities, isLoading } = useRecentActivity();

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-semibold">نشاط سريع</h3>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <Item key={i} isLoading={true} />
              ))
            : activities && activities.length > 0
            ? activities.map((activity) => (
                <Item
                  key={activity.id}
                  icon={CalendarDays}
                  title={activity.title}
                  time={activity.time}
                  tag={activity.tag}
                />
              ))
            : Array.from({ length: 3 }).map((_, i) => (
                <Item
                  key={i}
                  icon={CalendarDays}
                  title="لا توجد أنشطة حديثة"
                  time="الآن"
                />
              ))}
        </div>
      </CardContent>
    </Card>
  );
}