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

// Define available permissions/routes
const AVAILABLE_PERMISSIONS = [
    { id: "dashboard", label: "لوحة التحكم" },
    { id: "calendar", label: "المواعيد" },
    { id: "patients", label: "المرضى" },
    { id: "clinic", label: "العيادة" },
    { id: "settings", label: "الإعدادات" },
]

function SecretarySkeleton() {
    return (
        <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div className="space-y-2">
                <SkeletonLine className="h-4 w-32" />
                <SkeletonLine className="h-3 w-24" />
                <SkeletonLine className="h-3 w-40" />
            </div>
            <SkeletonLine className="h-3 w-20" />
        </div>
    )
}

function SecretaryItem({ secretary, onUpdatePermissions }) {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedPermissions, setSelectedPermissions] = useState([])
    
    // Update selected permissions when secretary data changes or dialog opens
    useEffect(() => {
        // Set permissions when dialog opens
        if (isOpen) {
            // Ensure permissions is always an array
            setSelectedPermissions(Array.isArray(secretary.permissions) ? secretary.permissions : [])
        }
    }, [isOpen, secretary.permissions])
    
    const handlePermissionChange = (permissionId) => {
        setSelectedPermissions(prev => {
            // Ensure prev is an array
            const currentPermissions = Array.isArray(prev) ? prev : []
            
            return currentPermissions.includes(permissionId) 
                ? currentPermissions.filter(id => id !== permissionId)
                : [...currentPermissions, permissionId]
        })
    }
    
    const handleSavePermissions = () => {
        onUpdatePermissions(secretary.user_id, selectedPermissions)
        setIsOpen(false)
    }
    
    return (
        <div className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="space-y-1">
                <h3 className="font-medium">{secretary.name}</h3>
                <p className="text-sm text-muted-foreground">{secretary.email}</p>
                <p className="text-sm text-muted-foreground">{secretary.phone}</p>
            </div>
            <div className="flex items-center gap-2">
                <div className="text-sm text-muted-foreground">
                    {secretary.created_at && format(new Date(secretary.created_at), "dd MMM yyyy", { locale: arSA })}
                </div>
                <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
                    إدارة الصلاحيات
                </Button>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>صلاحيات السكرتير: {secretary.name}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-3">
                                {AVAILABLE_PERMISSIONS.map((permission) => (
                                    <div key={permission.id} className="flex items-center gap-3">
                                        <Checkbox
                                            id={permission.id}
                                            checked={selectedPermissions.includes(permission.id)}
                                            onCheckedChange={() => handlePermissionChange(permission.id)}
                                        />
                                        <Label htmlFor={permission.id}>{permission.label}</Label>
                                    </div>
                                ))}
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
        address: ""
    });

    useEffect(() => {
        if (clinic) {
            setClinicFormData({
                name: clinic.name || "",
                address: clinic.address || ""
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