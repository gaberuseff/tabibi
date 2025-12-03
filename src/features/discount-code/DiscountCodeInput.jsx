import { Check, Loader, X } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

export default function DiscountCodeInput({
  onApply,
  isPending,
  error,
  isApplied,
  onClear,
  discountAmount = 0,
  discountValue = 0,
  isPercentage = false,
}) {
  const [inputValue, setInputValue] = useState("");

  const handleApply = () => {
    if (inputValue.trim()) {
      onApply(inputValue);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !isPending && !isApplied) {
      handleApply();
    }
  };

  const handleClear = () => {
    setInputValue("");
    onClear();
  };

  return (
    <div className="rounded-lg border border-border p-6 space-y-4">
      <h3 className="text-lg font-semibold">كود الخصم (اختياري)</h3>

      {!isApplied ? (
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            placeholder="أدخل كود الخصم..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isPending}
            className="flex-1"
            dir="ltr"
          />
          <Button
            onClick={handleApply}
            disabled={isPending || !inputValue.trim()}
            className="gap-2">
            {isPending && <Loader className="size-4 animate-spin" />}
            {isPending ? "جاري التحقق..." : "تطبيق الكود"}
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
          <div className="flex items-center gap-2">
            <Check className="size-5 text-green-600 dark:text-green-400" />
            <div>
              <p className="font-semibold text-green-700 dark:text-green-400">
                تم تطبيق الخصم بنجاح
              </p>
              <p className="text-sm text-green-600 dark:text-green-500">
                خصم: {isPercentage ? `${discountValue}%` : `${discountValue}`} ={" "}
                {discountAmount.toFixed(2)} جنيه
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClear}
            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
            <X className="size-4" />
          </Button>
        </div>
      )}

      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
}
