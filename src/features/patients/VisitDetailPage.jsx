import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { ArrowLeft, Calendar, Download, FileText, MessageCircle, Pill, Printer } from "lucide-react"
import { useNavigate, useParams } from "react-router-dom"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { SkeletonLine } from "../../components/ui/skeleton"
import generatePrescriptionPdfNew from "../../lib/generatePrescriptionPdfNew"
import { useAuth } from "../auth/AuthContext"
import useClinic from "../auth/useClinic"
import useVisit from "./useVisit"

export default function VisitDetailPage() {
    const { visitId } = useParams()
    const { data: visit, isLoading, error } = useVisit(visitId)
    const { data: clinic } = useClinic()
    const { user } = useAuth()
    const navigate = useNavigate()

    const handleGeneratePdf = async () => {
        console.log("Print button clicked");
        console.log("Visit data:", visit);
        console.log("Clinic data:", clinic);
        console.log("User data:", user);
        
        if (visit && clinic && user) {
            console.log("Generating PDF with new method...");
            try {
                await generatePrescriptionPdfNew(
                    visit,
                    user.name,
                    clinic.name,
                    clinic.address
                )
            } catch (error) {
                console.error("Error in PDF generation:", error);
                alert("حدث خطأ أثناء إنشاء الروشتة. يرجى المحاولة مرة أخرى.");
            }
        } else {
            console.log("Missing data for PDF generation");
            alert("لا توجد بيانات كافية لإنشاء الروشتة. يرجى التأكد من تحميل جميع البيانات.");
        }
    }

    const handleWhatsAppShare = () => {
        if (!visit) {
            alert("لا توجد بيانات الكشف لمشاركتها");
            return;
        }

        // Get patient phone number from visit data (patient_phone field)
        const patientPhone = visit.patient_phone;
        
        if (!patientPhone) {
            alert("رقم هاتف المريض غير متوفر");
            return;
        }

        // Format phone number for WhatsApp (remove any non-digit characters and add country code if needed)
        let formattedPhone = patientPhone.replace(/\D/g, '');
        
        // Assuming Egyptian phone numbers, add country code if not present
        if (formattedPhone.startsWith('0')) {
            formattedPhone = '2' + formattedPhone;
        } else if (!formattedPhone.startsWith('20')) {
            formattedPhone = '20' + formattedPhone;
        }

        // Create WhatsApp message with prescription details
        const message = `روشتة طبية
اسم العيادة: ${clinic?.name || 'غير متوفر'}
الطبيب: ${user?.name || 'غير متوفر'}
التاريخ: ${visit.created_at ? new Date(visit.created_at).toLocaleDateString('ar-EG') : 'غير محدد'}
التشخيص: ${visit.diagnosis || 'غير محدد'}

الأدوية:
${visit.medications && Array.isArray(visit.medications) && visit.medications.length > 0 
    ? visit.medications.map((med, index) => `${index + 1}. ${med.name || ''} - ${med.using || ''}`).join('\n')
    : 'لا توجد أدوية محددة'
}

تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}`;

        // Encode message for URL
        const encodedMessage = encodeURIComponent(message);
        
        // Create WhatsApp URL
        const whatsappUrl = `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
        
        // Open WhatsApp in new tab
        window.open(whatsappUrl, '_blank');
    }

    if (isLoading) {
        return (
            <div className="space-y-8" dir="rtl">
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <h1 className="text-3xl font-bold">تفاصيل الكشف</h1>
                        <Button
                            variant="ghost"
                            className="gap-2"
                            onClick={() => navigate(-1)}>
                            رجوع <ArrowLeft className="size-4" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        عرض تفاصيل الكشف الطبي.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <SkeletonLine width={180} height={20} />
                    </CardHeader>
                    <CardContent>
                        <div className="grid sm:grid-cols-2 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
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
        )
    }

    if (error) {
        return (
            <div className="space-y-8" dir="rtl">
                <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2">
                        <h1 className="text-3xl font-bold">تفاصيل الكشف</h1>
                        <Button
                            variant="ghost"
                            className="gap-2"
                            onClick={() => navigate(-1)}>
                            رجوع <ArrowLeft className="size-4" />
                        </Button>
                    </div>
                </div>
                <Card>
                    <CardContent className="py-8 text-center text-destructive">
                        حدث خطأ أثناء تحميل تفاصيل الكشف: {error.message}
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="space-y-8" dir="rtl">
            <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                    <h1 className="text-3xl font-bold">تفاصيل الكشف</h1>
                    <Button
                        variant="ghost"
                        className="gap-2"
                        onClick={() => navigate(-1)}>
                        رجوع <ArrowLeft className="size-4" />
                    </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                    عرض تفاصيل الكشف الطبي.
                </p>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">معلومات الكشف</h3>
                        <div className="flex gap-2">
                            {visit?.medications && visit.medications.length > 0 && (
                                <>
                                    <Button onClick={handleWhatsAppShare} variant="outline" size="sm">
                                        <MessageCircle className="size-4 ml-1" />
                                        مشاركة واتساب
                                    </Button>
                                    <Button onClick={handleGeneratePdf} variant="outline" size="sm">
                                        <Printer className="size-4 ml-1" />
                                        طباعة الروشتة
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div className="rounded-[var(--radius)] border border-border p-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="size-4" />
                                تاريخ الكشف
                            </div>
                            <div className="text-base mt-1">
                                {visit?.created_at ? format(new Date(visit.created_at), "dd MMMM yyyy - hh:mm a", { locale: ar }) : "-"}
                            </div>
                        </div>

                        <div className="rounded-[var(--radius)] border border-border p-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="size-4" />
                                التشخيص المبدئي
                            </div>
                            <div className="text-base mt-1">
                                {visit?.diagnosis || "-"}
                            </div>
                        </div>

                        <div className="sm:col-span-2 rounded-[var(--radius)] border border-border p-3">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <FileText className="size-4" />
                                الملاحظات
                            </div>
                            <div className="text-base mt-1 whitespace-pre-wrap">
                                {visit?.notes || "-"}
                            </div>
                        </div>

                        <div className="sm:col-span-2 rounded-[var(--radius)] border border-border p-3">
                            <div className="flex items-center justify-between gap-2 text-sm text-muted-foreground mb-2">
                                <div className="flex items-center gap-2">
                                    <Pill className="size-4" />
                                    الأدوية
                                </div>
                                {visit?.medications && visit.medications.length > 0 && (
                                    <div className="flex gap-2">
                                        <Button onClick={handleWhatsAppShare} variant="outline" size="sm">
                                            <MessageCircle className="size-4 ml-1" />
                                            مشاركة واتساب
                                        </Button>
                                        <Button onClick={handleGeneratePdf} variant="outline" size="sm">
                                            <Download className="size-4 ml-1" />
                                            طباعة
                                        </Button>
                                    </div>
                                )}
                            </div>
                            {visit?.medications && visit.medications.length > 0 ? (
                                <div className="space-y-3">
                                    {visit.medications.map((medication, index) => (
                                        <div key={index} className="border-b border-border pb-3 last:border-0 last:pb-0">
                                            <div className="font-medium">{medication.name}</div>
                                            <div className="text-sm text-muted-foreground">{medication.using}</div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-muted-foreground">لا توجد أدوية محددة</div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}