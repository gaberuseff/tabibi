import {CheckCircle2} from "lucide-react";
import {formatCurrency} from "../../lib/utils";
import {Badge} from "../ui/badge";
import {Button} from "../ui/button";
import {Card, CardContent, CardFooter, CardHeader} from "../ui/card";

export default function Pricing() {
  return (
    <section id="pricing" className="container py-20 mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">خطط تسعير مرنة</h2>
        <p className="text-muted-foreground">
          اختر الخطة المناسبة لعيادتك وابدأ خلال دقائق.
        </p>
      </div>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <h3 className="text-xl font-semibold">أساسية</h3>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold">
              {formatCurrency(19)}
              <span className="text-sm text-muted-foreground">/شهر</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                مواعيد
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                ملف طبي أساسي
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">اختيار الخطة</Button>
          </CardFooter>
        </Card>
        <Card className="border-primary/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">احترافية</h3>
              <Badge className="bg-primary/10 text-primary">الأكثر شعبية</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-3xl font-bold">
              {formatCurrency(39)}
              <span className="text-sm text-muted-foreground">/شهر</span>
            </div>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                كل مزايا الأساسية
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                روشتة PDF عبر واتساب
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-primary" />
                تقارير الإيرادات
              </li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button className="w-full">اختيار الخطة</Button>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
}
