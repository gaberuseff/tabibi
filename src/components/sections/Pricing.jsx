import { CheckCircle2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import usePricingPlans from "../../features/settings/usePricingPlans";
import { formatCurrency } from "../../lib/utils";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";

export default function Pricing() {
  const navigate = useNavigate();
  const {data: plans = [], isLoading, error} = usePricingPlans();

  if (isLoading) {
    return (
      <section id="pricing" className="container py-20 mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">خطط تسعير مرنة</h2>
          <p className="text-muted-foreground">
            اختر الخطة المناسبة لعيادتك وابدأ خلال دقائق.
          </p>
        </div>
        <div className="mt-10 grid md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-4 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <div className="h-10 bg-gray-200 rounded w-full"></div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section id="pricing" className="container py-20 mx-auto">
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold">خطط تسعير مرنة</h2>
          <p className="text-destructive">
            حدث خطأ أثناء تحميل خطط التسعير. يرجى المحاولة مرة أخرى لاحقًا.
          </p>
        </div>
      </section>
    );
  }

  const handleSelectPlan = (planId) => {
    navigate(`/plan/${planId}`);
  };

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
            className={plan.popular ? "border-primary/40 relative" : ""}>
            {plan.popular && (
              <Badge className="absolute top-4 end-4 bg-primary/10 text-primary">
                الأكثر شعبية
              </Badge>
            )}
            <CardHeader>
              <h3 className="text-xl font-semibold">{plan.name}</h3>
              <p className="text-sm text-muted-foreground">
                {plan.description}
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-3xl font-bold">
                {plan.price === 0 ? "مجاني" : formatCurrency(plan.price)}
                {plan.price > 0 && (
                  <span className="text-sm text-muted-foreground">/شهر</span>
                )}
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
              <Button
                onClick={() => handleSelectPlan(plan.id)}
                className="w-full"
                variant={plan.popular ? "default" : "outline"}>
                اختر الباقة
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
