import { format } from "date-fns"
import { ar } from "date-fns/locale"
import { Card, CardContent, CardHeader } from "../../components/ui/card"
import DataTable from "../../components/ui/table"
import { Button } from "../../components/ui/button"
import { Eye } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
} from "../../components/ui/dialog"
import VisitCreateForm from "./VisitCreateForm"

export default function PatientVisitsTable({ visits, isLoading, patientId, onVisitAdded }) {
    const navigate = useNavigate()
    const [isModalOpen, setIsModalOpen] = useState(false)

    const handleVisitAdded = () => {
        // Refresh the visits list
        if (onVisitAdded) onVisitAdded()
        // Close the modal
        setIsModalOpen(false)
    }

    const columns = [
        {
            header: "التشخيص المبدئي",
            accessor: "diagnosis",
            cellClassName: "font-medium",
        },
        {
            header: "تاريخ الكشف",
            accessor: "created_at",
            cellClassName: "text-muted-foreground",
            render: (visit) =>
                visit.created_at ? format(new Date(visit.created_at), "dd MMMM yyyy - hh:mm a", { locale: ar }) : "غير محدد"
        },
        {
            header: "",
            render: (visit) => (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/patients/${patientId}/visits/${visit.id}`)}
                >
                    <Eye className="h-4 w-4 ml-2" />
                    عرض التفاصيل
                </Button>
            ),
        },
    ]

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">الكشوفات</h3>
                    <Button onClick={() => setIsModalOpen(true)}>
                        إضافة كشف
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <DataTable
                    columns={columns}
                    data={visits ?? []}
                    emptyLabel="لا توجد كشوفات"
                />
            </CardContent>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <h3 className="text-lg font-semibold">إضافة كشف جديد</h3>
                    </DialogHeader>
                    <VisitCreateForm 
                        patientId={patientId}
                        onVisitCreated={handleVisitAdded}
                    />
                </DialogContent>
            </Dialog>
        </Card>
    )
}