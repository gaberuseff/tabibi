import {format} from "date-fns";
import {ar} from "date-fns/locale";
import {ArrowLeft, Calendar, Edit, FileText, Wallet} from "lucide-react";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import toast from "react-hot-toast";
import {Button} from "../../components/ui/button";
import {Card, CardContent, CardHeader} from "../../components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../components/ui/dialog";
import {Input} from "../../components/ui/input";
import {Label} from "../../components/ui/label";
import {SkeletonLine} from "../../components/ui/skeleton";
import {Textarea} from "../../components/ui/textarea";
import useAppointment from "./useAppointment";
import useUpdateAppointment from "./useUpdateAppointment";

export default function AppointmentDetailPage() {
  const {appointmentId} = useParams();
  const {data: appointment, isLoading, error} = useAppointment(appointmentId);
  const navigate = useNavigate();
  const {mutate: updateAppointment, isPending: isUpdating} =
    useUpdateAppointment();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState({
    date: "",
    notes: "",
    price: "",
  });

  const statusMap = {
    pending: {label: "قيد الانتظار", variant: "secondary"},
    confirmed: {label: "مؤكد", variant: "default"},
    completed: {label: "مكتمل", variant: "outline"},
    cancelled: {label: "ملغي", variant: "destructive"},
  };

  const sourceMap = {
    booking: {label: "من الموقع", variant: "default"},
    clinic: {label: "من العيادة", variant: "secondary"},
  };

  // Initialize edit data when appointment loads
  useState(() => {
    if (appointment && !editData.date) {
      setEditData({
        date: appointment.date || "",
        notes: appointment.notes || "",
        price: appointment.price || "",
      });
    }
  }, [appointment]);

  const openEditModal = () => {
    // Initialize edit data with current appointment data
    setEditData({
      date: appointment?.date || "",
      notes: appointment?.notes || "",
      price: appointment?.price || "",
    });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSaveEdit = () => {
    // Convert price to number if it's a string
    const payload = {
      ...editData,
      price:
        typeof editData.price === "string"
          ? parseFloat(editData.price)
          : editData.price,
    };

    updateAppointment(
      {id: appointmentId, ...payload},
      {
        onSuccess: () => {
          setIsEditModalOpen(false);
          // Refresh the appointment data
          window.location.reload();
        },
      }
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-8" dir="rtl">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">تفاصيل الحجز</h1>
            <Button
              variant="ghost"
              className="gap-2 w-full sm:w-auto"
              onClick={() => navigate(-1)}>
              رجوع <ArrowLeft className="size-4" />
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">عرض تفاصيل الحجز.</p>
        </div>

        <Card>
          <CardHeader>
            <SkeletonLine width={180} height={20} />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({length: 4}).map((_, i) => (
                <div
                  key={i}
                  className="rounded-[var(--radius)] border border-border p-3">
                  <SkeletonLine width={100} height={12} />
                  <div className="mt-2">
                    <SkeletonLine height={16} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8" dir="rtl">
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold">تفاصيل الحجز</h1>
            <Button
              variant="ghost"
              className="gap-2 w-full sm:w-auto"
              onClick={() => navigate(-1)}>
              رجوع <ArrowLeft className="size-4" />
            </Button>
          </div>
        </div>
        <Card>
          <CardContent className="py-8 text-center text-destructive">
            حدث خطأ أثناء تحميل تفاصيل الحجز: {error.message}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-8" dir="rtl">
      <div className="space-y-2">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <h1 className="text-2xl sm:text-3xl font-bold">تفاصيل الحجز</h1>
          <Button
            variant="ghost"
            className="gap-2 w-full sm:w-auto"
            onClick={() => navigate(-1)}>
            رجوع <ArrowLeft className="size-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">عرض تفاصيل الحجز.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h3 className="text-lg font-semibold">معلومات الحجز</h3>
            <div className="flex flex-wrap gap-2">
              <Button
                onClick={openEditModal}
                variant="outline"
                size="sm"
                className="w-full sm:w-auto">
                <Edit className="size-4 ml-1" />
                تعديل
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="rounded-[var(--radius)] border border-border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="size-4" />
                تاريخ ووقت الحجز
              </div>
              <div className="text-base mt-1">
                {appointment?.date
                  ? format(
                      new Date(appointment.date),
                      "dd MMMM yyyy - hh:mm a",
                      {locale: ar}
                    )
                  : "-"}
              </div>
            </div>

            <div className="rounded-[var(--radius)] border border-border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Wallet className="size-4" />
                السعر (جنيه)
              </div>
              <div className="text-base mt-1">
                {appointment?.price?.toFixed(2) || "0.00"}
              </div>
            </div>

            <div className="sm:col-span-2 rounded-[var(--radius)] border border-border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="size-4" />
                نوع الحجز
              </div>
              <div className="text-base mt-1 whitespace-pre-wrap">
                {appointment?.notes || "-"}
              </div>
            </div>

            <div className="rounded-[var(--radius)] border border-border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                الحالة
              </div>
              <div className="text-base mt-1">
                {appointment?.status ? (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      statusMap[appointment.status]?.variant === "default"
                        ? "bg-primary text-primary-foreground"
                        : statusMap[appointment.status]?.variant === "secondary"
                        ? "bg-secondary text-secondary-foreground"
                        : statusMap[appointment.status]?.variant === "outline"
                        ? "border border-input bg-background"
                        : statusMap[appointment.status]?.variant ===
                          "destructive"
                        ? "bg-destructive text-destructive-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                    {statusMap[appointment.status]?.label || appointment.status}
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>

            <div className="rounded-[var(--radius)] border border-border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                المصدر
              </div>
              <div className="text-base mt-1">
                {appointment?.from ? (
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      sourceMap[appointment.from]?.variant === "default"
                        ? "bg-primary text-primary-foreground"
                        : sourceMap[appointment.from]?.variant === "secondary"
                        ? "bg-secondary text-secondary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}>
                    {sourceMap[appointment.from]?.label || appointment.from}
                  </span>
                ) : (
                  "-"
                )}
              </div>
            </div>

            <div className="sm:col-span-2 rounded-[var(--radius)] border border-border p-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                معلومات المريض
              </div>
              <div className="text-base">
                <div className="font-medium">
                  {appointment?.patient?.name || "-"}
                </div>
                <div className="text-muted-foreground">
                  {appointment?.patient?.phone || "-"}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit Appointment Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>تعديل بيانات الحجز</DialogTitle>
          </DialogHeader>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">التاريخ والوقت *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={
                    editData.date
                      ? new Date(editData.date).toISOString().slice(0, 16)
                      : ""
                  }
                  onChange={(e) => handleEditChange("date", e.target.value)}
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">نوع الحجز</Label>
                <Textarea
                  id="notes"
                  value={editData.notes}
                  onChange={(e) => handleEditChange("notes", e.target.value)}
                  placeholder="أدخل نوع الحجز"
                  className="w-full"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">السعر (جنيه)</Label>
                <Input
                  id="price"
                  type="number"
                  value={editData.price}
                  onChange={(e) => handleEditChange("price", e.target.value)}
                  placeholder="أدخل السعر"
                  className="w-full"
                />
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
              <Button
                variant="outline"
                onClick={() => setIsEditModalOpen(false)}
                className="w-full sm:w-auto">
                إلغاء
              </Button>
              <Button
                onClick={handleSaveEdit}
                disabled={isUpdating}
                className="w-full sm:w-auto">
                {isUpdating ? "جاري الحفظ..." : "حفظ التغييرات"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
