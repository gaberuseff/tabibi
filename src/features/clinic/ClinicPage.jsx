import { format } from "date-fns"
import { arSA } from "date-fns/locale"
import { useEffect, useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import { Checkbox } from "../../components/ui/checkbox"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../components/ui/dialog"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { SkeletonLine } from "../../components/ui/skeleton"
import { useAuth } from "../auth/AuthContext"
import useClinic from "../auth/useClinic"
import useClinicSecretaries from "../auth/useClinicSecretaries"
import useUpdateSecretaryPermissions from "../auth/useUpdateSecretaryPermissions"
import useUpdateClinic from "../settings/useUpdateClinic"

// Define available permissions/routes (settings is always available for secretaries)
const AVAILABLE_PERMISSIONS = [
    { id: "dashboard", label: "لوحة التحكم" },
    { id: "calendar", label: "المواعيد" },
    { id: "patients", label: "المرضى" },
    { id: "clinic", label: "العيادة" },
    // Note: settings is always available for secretaries as it's their profile page
]

const getDayName = (day) => {
    const days = {
        saturday: "السبت",
        sunday: "الأحد",
        monday: "الاثنين",
        tuesday: "الثلاثاء",
        wednesday: "الأربعاء",
        thursday: "الخميس",
        friday: "الجمعة"
    };
    return days[day] || day;
};

function SecretarySkeleton() {
    return (
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-2">
                <SkeletonLine className="h-4 w-32" />
                <SkeletonLine className="h-4 w-24" />
            </div>
            <SkeletonLine className="h-10 w-24" />
        </div>
    )
}

function SecretaryItem({ secretary, onUpdatePermissions }) {
    const [isOpen, setIsOpen] = useState(false)
    // Initialize with default permissions if none exist
    const [selectedPermissions, setSelectedPermissions] = useState(() => {
        // Ensure we're working with an array
        const permissions = Array.isArray(secretary.permissions) ? secretary.permissions : [];
        
        if (permissions.length > 0) {
            return permissions;
        }
        // Default permissions for new secretaries
        return ["dashboard", "calendar", "patients"];
    })

    const handlePermissionChange = (permissionId) => {
        setSelectedPermissions(prev => {
            // Ensure prev is an array
            const currentPermissions = Array.isArray(prev) ? prev : [];
            
            if (currentPermissions.includes(permissionId)) {
                return currentPermissions.filter(p => p !== permissionId);
            } else {
                return [...currentPermissions, permissionId];
            }
        })
    }

    const handleSavePermissions = () => {
        onUpdatePermissions(secretary.user_id, selectedPermissions)
        setIsOpen(false)
    }

    return (
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
                <div className="font-medium">{secretary.name}</div>
                <div className="text-sm text-muted-foreground">{secretary.email}</div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                    تعديل الصلاحيات
                </Button>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent dir="rtl">
                    <DialogHeader>
                        <DialogTitle>تعديل صلاحيات السكرتير</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-medium mb-2">الصلاحيات المتوفرة</h4>
                            <div className="space-y-2">
                                {AVAILABLE_PERMISSIONS.map((permission) => (
                                    <div key={permission.id} className="flex items-center gap-2">
                                        <Checkbox
                                            id={permission.id}
                                            checked={selectedPermissions.includes(permission.id)}
                                            onCheckedChange={() => handlePermissionChange(permission.id)}
                                        />
                                        <label htmlFor={permission.id} className="text-sm">
                                            {permission.label}
                                        </label>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">
                                    ملاحظة: صفحة الإعدادات متاحة دائماً للسكرتير كونها تحتوي على معلومات حسابه الشخصي
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-2 pt-4">
                            <Button variant="outline" onClick={() => setIsOpen(false)}>
                                إلغاء
                            </Button>
                            <Button onClick={handleSavePermissions}>
                                حفظ التغييرات
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default function ClinicPage() {
    const { user } = useAuth()
    const { data: clinic, isLoading: isClinicLoading, isError: isClinicError } = useClinic()
    const { data: secretaries, isLoading: isSecretariesLoading, isError: isSecretariesError } = useClinicSecretaries(user?.clinic_id)
    const { mutate: updatePermissions } = useUpdateSecretaryPermissions()
    const { mutate: updateClinic, isPending: isUpdating } = useUpdateClinic()
    
    const [clinicFormData, setClinicFormData] = useState({
        name: "",
        address: "",
        booking_price: "",
        available_time: {
            saturday: { start: "", end: "", off: false },
            sunday: { start: "", end: "", off: false },
            monday: { start: "", end: "", off: false },
            tuesday: { start: "", end: "", off: false },
            wednesday: { start: "", end: "", off: false },
            thursday: { start: "", end: "", off: false },
            friday: { start: "", end: "", off: false }
        }
    });

    useEffect(() => {
        if (clinic) {
            // Initialize available_time with default structure if not present
            const initializedAvailableTime = {};
            const defaultTimeStructure = {
                saturday: { start: "", end: "", off: false },
                sunday: { start: "", end: "", off: false },
                monday: { start: "", end: "", off: false },
                tuesday: { start: "", end: "", off: false },
                wednesday: { start: "", end: "", off: false },
                thursday: { start: "", end: "", off: false },
                friday: { start: "", end: "", off: false }
            };
            
            if (clinic.available_time) {
                // Merge existing data with default structure to ensure all days are present
                Object.keys(defaultTimeStructure).forEach(day => {
                    initializedAvailableTime[day] = {
                        ...defaultTimeStructure[day],
                        ...(clinic.available_time[day] || {})
                    };
                });
            } else {
                initializedAvailableTime = defaultTimeStructure;
            }
            
            setClinicFormData({
                name: clinic.name || "",
                address: clinic.address || "",
                booking_price: clinic.booking_price || "",
                available_time: initializedAvailableTime
            });
        }
    }, [clinic]);
    
    const handleUpdatePermissions = (secretaryId, permissions) => {
        updatePermissions({ secretaryId, permissions })
    }
    
    const handleClinicChange = (e) => {
        const { name, value } = e.target;
        setClinicFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    const handleTimeChange = (day, field, value) => {
        setClinicFormData(prev => ({
            ...prev,
            available_time: {
                ...prev.available_time,
                [day]: {
                    ...prev.available_time[day],
                    [field]: value
                }
            }
        }));
    };
    
    const toggleDayOff = (day) => {
        setClinicFormData(prev => ({
            ...prev,
            available_time: {
                ...prev.available_time,
                [day]: {
                    ...prev.available_time[day],
                    off: !prev.available_time[day].off
                }
            }
        }));
    };
    
    const handleUpdateClinic = (e) => {
        e.preventDefault();
        updateClinic(clinicFormData);
    };

    return (
        <div className="space-y-8">
            <div className="space-y-3">
                <h1 className="text-2xl font-bold">تفاصيل العيادة</h1>
                <p className="text-sm text-muted-foreground">
                    معلومات العيادة والسكرتير المسجلين فيها.
                </p>
            </div>

            {/* Clinic Information Card */}
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">معلومات العيادة</h2>
                </CardHeader>
                <CardContent>
                    {isClinicLoading ? (
                        <div className="space-y-4">
                            <SkeletonLine className="h-4 w-1/3" />
                            <SkeletonLine className="h-4 w-2/3" />
                        </div>
                    ) : isClinicError ? (
                        <div className="text-destructive">حدث خطأ أثناء تحميل معلومات العيادة</div>
                    ) : (
                        <form onSubmit={handleUpdateClinic} className="space-y-4">
                            <div className="space-y-3">
                                <div className="space-y-2">
                                    <Label htmlFor="clinicName">اسم العيادة</Label>
                                    <Input
                                        id="clinicName"
                                        name="name"
                                        value={clinicFormData.name}
                                        onChange={handleClinicChange}
                                        placeholder="أدخل اسم العيادة"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="clinicAddress">عنوان العيادة</Label>
                                    <Input
                                        id="clinicAddress"
                                        name="address"
                                        value={clinicFormData.address}
                                        onChange={handleClinicChange}
                                        placeholder="أدخل عنوان العيادة"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="bookingPrice">سعر الحجز</Label>
                                    <Input
                                        id="bookingPrice"
                                        name="booking_price"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        value={clinicFormData.booking_price}
                                        onChange={handleClinicChange}
                                        placeholder="أدخل سعر الحجز"
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        سعر الحجز الذي سيظهر لمرضى العيادة عند الحجز
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>أوقات العمل</Label>
                                    <p className="text-xs text-muted-foreground">
                                        حدد أوقات العمل اليومية للعيادة
                                    </p>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                        {Object.entries(clinicFormData.available_time).map(([day, times]) => (
                                            <div key={day} className="border rounded-lg p-3 bg-muted/30 hover:bg-muted/50 transition-colors">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="font-medium capitalize text-sm">
                                                        {getDayName(day)}
                                                    </h4>
                                                    <Button
                                                        type="button"
                                                        variant={times.off ? "default" : "outline"}
                                                        size="sm"
                                                        onClick={() => toggleDayOff(day)}
                                                        className={`h-8 px-3 text-xs ${
                                                            times.off 
                                                                ? "bg-red-500 hover:bg-red-600" 
                                                                : "border-gray-300 hover:bg-gray-100"
                                                        }`}
                                                    >
                                                        {times.off ? "إجازة" : "عمل"}
                                                    </Button>
                                                </div>
                                                {!times.off && (
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex-1 min-w-0">
                                                            <Label htmlFor={`${day}-start`} className="text-xs text-muted-foreground">من</Label>
                                                            <Input
                                                                id={`${day}-start`}
                                                                type="time"
                                                                value={times.start}
                                                                onChange={(e) => handleTimeChange(day, 'start', e.target.value)}
                                                                className="h-9 text-sm px-2 py-1"
                                                            />
                                                        </div>
                                                        <div className="flex items-center justify-center h-9">
                                                            <span className="text-muted-foreground text-sm">-</span>
                                                        </div>
                                                        <div className="flex-1 min-w-0">
                                                            <Label htmlFor={`${day}-end`} className="text-xs text-muted-foreground">إلى</Label>
                                                            <Input
                                                                id={`${day}-end`}
                                                                type="time"
                                                                value={times.end}
                                                                onChange={(e) => handleTimeChange(day, 'end', e.target.value)}
                                                                className="h-9 text-sm px-2 py-1"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>رابط الحجز</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={`${window.location.origin}/booking/${user?.clinic_id}`}
                                            readOnly
                                        />
                                        <Button 
                                            type="button"
                                            onClick={() => {
                                                navigator.clipboard.writeText(`${window.location.origin}/booking/${user?.clinic_id}`);
                                                alert('تم نسخ الرابط إلى الحافظة');
                                            }}
                                        >
                                            نسخ
                                        </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        شارك هذا الرابط مع مرضاك لحجز المواعيد
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label>معرف العيادة</Label>
                                    <Input
                                        value={user?.clinic_id || ""}
                                        disabled
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        لا يمكن تغيير معرف العيادة
                                    </p>
                                </div>
                            </div>
                            <div className="pt-4">
                                <Button type="submit" disabled={isUpdating}>
                                    {isUpdating ? "جاري الحفظ..." : "حفظ التغييرات"}
                                </Button>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>

            {/* Secretaries Section */}
            <Card>
                <CardHeader>
                    <h2 className="text-lg font-semibold">السكرتير</h2>
                </CardHeader>
                <CardContent>
                    {isSecretariesLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <SecretarySkeleton key={i} />
                            ))}
                        </div>
                    ) : isSecretariesError ? (
                        <div className="text-destructive">حدث خطأ أثناء تحميل قائمة السكرتير</div>
                    ) : secretaries && secretaries.length > 0 ? (
                        <div className="space-y-4">
                            {secretaries.map((secretary) => (
                                <SecretaryItem 
                                    key={secretary.user_id} 
                                    secretary={secretary} 
                                    onUpdatePermissions={handleUpdatePermissions}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            لا يوجد سكرتير مسجل في هذه العيادة
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}