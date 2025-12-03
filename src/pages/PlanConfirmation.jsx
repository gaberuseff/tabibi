import {
  ArrowLeft,
  CheckCircle2
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "../components/ui/card";
import { useAuth } from "../features/auth/AuthContext";
import {
  useCancelActiveSubscription,
  useCreateSubscription,
} from "../features/auth/useSubscription";
import { DiscountCodeInput, useDiscountCode } from "../features/discount-code";
import usePricingPlan from "../features/settings/usePricingPlan";
import { formatCurrency } from "../lib/utils";

export default function PlanConfirmation() {
  const {planId} = useParams();
  const navigate = useNavigate();
  const {user, isLoading: isAuthLoading} = useAuth();
  const {data: plan, isLoading: isPlanLoading, error} = usePricingPlan(planId);
  const {mutate: createSubscription} = useCreateSubscription();
  const {mutate: cancelActiveSubscription} = useCancelActiveSubscription();

  const isLoading = isAuthLoading || isPlanLoading;

  const discount = useDiscountCode(plan?.price || 0);
  const [finalPrice, setFinalPrice] = useState(plan?.price || 0);

  // Update final price when discount changes
  useEffect(() => {
    setFinalPrice(discount.finalAmount);
  }, [discount.finalAmount]);

  const getButtonText = (planName) => {
    if (!planName) return "تأكيد الاشتراك";
    if (planName.includes("الأساسية"))
      return "تأكيد الاشتراك في الخطة الأساسية";
    if (planName.includes("القياسية"))
      return "تأكيد الاشتراك في الخطة القياسية";
    if (planName.includes("المميزة")) return "تأكيد الاشتراك في الخطة المميزة";
    return "تأكيد الاشتراك";
  };

  const handleConfirmSubscription = () => {
    // Check if user is logged in
    if (!user) {
      // Redirect to login page
      navigate("/login");
      return;
    }

    // First, cancel any existing active subscription
    cancelActiveSubscription(user.clinic_id, {
      onSuccess: () => {
        // After successfully cancelling, create the new subscription
        createSubscription(
          {clinicId: user.clinic_id, planId: plan.id},
          {
            onSuccess: () => {
              // Redirect to dashboard or show success message
              navigate("/dashboard");
            },
            onError: (error) => {
              toast.error("فشل في تفعيل الاشتراك: " + error.message);
            },
          }
        );
      },
      onError: () => {
        // If there was no active subscription to cancel, proceed to create new subscription
        createSubscription(
          {clinicId: user.clinic_id, planId: plan.id},
          {
            onSuccess: () => {
              // Redirect to dashboard or show success message
              toast.success("تم تفعيل الاشتراك بنجاح!");
              navigate("/dashboard");
            },
            onError: (error) => {
              toast.error("فشل في تفعيل الاشتراك: " + error.message);
            },
          }
        );
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4">جارٍ تحميل تفاصيل الخطة...</p>
        </div>
      </div>
    );
  }

  if (error || !plan) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-destructive">
            حدث خطأ أثناء تحميل تفاصيل الخطة
          </div>
          <Button onClick={() => navigate(-1)} className="mt-4">
            العودة
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12" dir="rtl">
      <div className="container max-w-6xl">
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2">
            <ArrowLeft className="size-4" />
            العودة
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Plan Details Section */}
          <div>
            <Card className="border-border/60 h-full">
              <CardHeader className="text-center">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-4">
                  <CheckCircle2 className="size-8 text-primary" />
                </div>
                <h1 className="text-3xl font-bold">مراجعة الخطة</h1>
                <p className="text-muted-foreground mt-2">
                  يرجى مراجعة تفاصيل الخطة قبل تأكيد الاشتراك
                </p>
              </CardHeader>

              <CardContent className="space-y-8">
                {/* Plan Summary */}
                <div className="rounded-lg border border-border p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">{plan.name}</h2>
                      <p className="text-muted-foreground mt-1">
                        {plan.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-primary">
                        {formatCurrency(plan.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        شهريًا
                      </div>
                    </div>
                  </div>
                </div>

                {/* Features */}
                <div>
                  <h3 className="text-xl font-semibold mb-4">مميزات الخطة</h3>
                  <div className="grid gap-3">
                    {plan.features.map((featureText, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 p-3 rounded-lg hover:bg-accent">
                        <div className="mt-0.5">
                          <CheckCircle2 className="size-5 text-primary" />
                        </div>
                        <span className="text-muted-foreground">
                          {featureText}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Payment Summary Section */}
          <div>
            <Card className="border-border/60 h-full">
              <CardHeader>
                <h2 className="text-2xl font-bold text-center">ملخص الدفع</h2>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Plan Summary */}
                <div className="rounded-lg border border-border p-6">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">خطة شهرية</p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">
                        {formatCurrency(plan.price)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Discount Code Input */}
                <DiscountCodeInput
                  onApply={discount.applyDiscount}
                  isPending={discount.isPending}
                  error={discount.error}
                  isApplied={!!discount.appliedDiscount}
                  onClear={discount.clearDiscount}
                  discountAmount={discount.discountAmount}
                  discountValue={
                    discount.appliedDiscount?.is_percentage
                      ? discount.appliedDiscount?.value
                      : discount.discountAmount
                  }
                  isPercentage={
                    discount.appliedDiscount?.is_percentage || false
                  }
                />

                {/* Payment Details */}
                <div className="rounded-lg border border-border p-6">
                  <h3 className="text-lg font-semibold mb-4">تفاصيل الدفع</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span>سعر الخطة الشهرية</span>
                      <span>{formatCurrency(plan.price)}</span>
                    </div>
                    {discount.discountAmount > 0 && (
                      <div className="flex justify-between text-green-600 dark:text-green-400">
                        <span>الخصم</span>
                        <span>-{formatCurrency(discount.discountAmount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>الضرائب</span>
                      <span>0.00 جنيه</span>
                    </div>
                    <div className="border-t border-border pt-3 flex justify-between font-semibold text-lg">
                      <span>المجموع</span>
                      <span className="text-primary">
                        {formatCurrency(finalPrice)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => navigate(-1)}
                  variant="outline"
                  className="w-full sm:w-auto">
                  تعديل الخطة
                </Button>
                <Button
                  onClick={handleConfirmSubscription}
                  className="w-full sm:w-auto">
                  {getButtonText(plan.name)}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
