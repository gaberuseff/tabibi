import { useMemo } from "react";
import { CheckCircle2 } from "lucide-react";
import { formatCurrency } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

export default function Pricing() {
  // Memoize plans data to prevent unnecessary re-renders
  const plans = useMemo(() => [
    {
      name: "الأساسية",
      price: 0,
      description: "مثالية للعيادات الصغيرة التي تبدأ رحلتها الرقمية",
      features: [
        "إدارة المواعيد الأساسية",
        "ملف طبي إلكتروني",
        "إنشاء وطباعة الروشتة",
        "إدارة المرضى (حتى 100 مريض)",
        "دعم عبر البريد الإلكتروني"
      ],
      cta: "ابدأ مجاناً",
      popular: false
    },
    {
      name: "القياسية",
      price: 199,
      description: "للعيادات التي تبحث عن حلول شاملة لإدارة أعمالها",
      features: [
        "جميع مزايا الخطة الأساسية",
        "روشتة PDF تُرسل تلقائياً عبر واتساب",
        "تقارير مالية وإيرادات",
        "إدارة السكرتير",
        "إدارة المرضى (حتى 500 مريض)",
        "دعم فني خلال ساعات العمل"
      ],
      cta: "اختيار الخطة",
      popular: true
    },
    {
      name: "المميزة",
      price: 399,
      description: "للمؤسسات الطبية الكبيرة التي تحتاج لحل شامل ومتكامل",
      features: [
        "جميع مزايا الخطة القياسية",
        "تقارير تحليلية متقدمة",
        "إدارة متعددة الأفرع",
        "إدارة المرضى (عدد غير محدود)",
        "دعم فني على مدار الساعة",
        "تحديثات مخصصة وتطوير خاص"
      ],
      cta: "اختيار الخطة",
      popular: false
    }
  ], []);

  return (
    <section id="pricing" className="container py-20 mx-auto">
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold">خطط تسعير مرنة</h2>
        <p className="text-muted-foreground">
          اختر الخطة المناسبة لعيادتك وابدأ خلال دقائق.
        </p>
      </div>
      <div className="mt-10 grid md:grid-cols-3 gap-6">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={plan.popular ? "border-primary/40 relative" : ""}
          >
            {plan.popular && (
              <Badge className="absolute top-4 end-4 bg-primary/10 text-primary">
                الأكثر شعبية
              </Badge>
            )}
            <CardHeader>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">{plan.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">
                {plan.price === 0 ? "مجاني" : formatCurrency(plan.price)}
                {plan.price > 0 && <span className="text-sm text-muted-foreground">/شهر</span>}
              </div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <CheckCircle2 className="size-4 text-primary mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant={plan.popular ? "default" : "outline"}>
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}