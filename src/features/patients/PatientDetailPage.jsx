import {ArrowLeft, Eye} from "lucide-react";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "../../components/ui/button";
import {Card, CardContent, CardHeader} from "../../components/ui/card";
import PatientEditDialog from "./PatientEditDialog";
import {SkeletonLine, SkeletonBlock} from "../../components/ui/skeleton";
import usePatient from "./usePatient";
import usePatientAppointments from "../calendar/usePatientAppointments";
import PatientAppointmentsHistory from "./PatientAppointmentsHistory";
import useVisits from "./useVisits";
import PatientVisitsTable from "./PatientVisitsTable";
import { useQueryClient } from "@tanstack/react-query";
import useTreatmentTemplates from "../treatment-plans/useTreatmentTemplates";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import PatientPlanAssignmentForm from "./PatientPlanAssignmentForm";
import { usePatientPlans } from "./usePatientPlans";
import DataTable from "../../components/ui/table";

// Treatment Plans Table Component
function PatientTreatmentPlansTable({ patientId }) {
  const { data: templates, isLoading: isTemplatesLoading } = useTreatmentTemplates();
  const { data: patientPlans, isLoading: isPlansLoading, refetch } = usePatientPlans(patientId);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setIsFormOpen(true);
    setIsOpen(false); // Close dropdown
  };

  const handlePlanAssigned = () => {
    // Refresh patient plans
    refetch();
  };

  // Define columns for the patient plans table
  const columns = [
    {
      header: "اسم الخطة",
      accessor: "treatment_template_name",
      render: (plan) => plan.treatment_templates?.name || "-",
    },
    {
      header: "عدد الجلسات",
      accessor: "total_sessions",
    },
    {
      header: "السعر الإجمالي",
      accessor: "total_price",
      render: (plan) => `${plan.total_price} جنيه`,
    },
    {
      header: "الحالة",
      accessor: "status",
      render: (plan) => {
        const statusMap = {
          active: "نشطة",
          completed: "مكتملة",
          cancelled: "ملغية",
        };
        return statusMap[plan.status] || plan.status;
      },
    },
    {
      header: "",
      render: (plan) => (
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate(`/patients/${patientId}/plans/${plan.id}`)}
        >
          <Eye className="h-4 w-4 ml-2" />
          عرض التفاصيل
        </Button>
      ),
    },
  ];

  // Pagination logic
  const PATIENT_DETAIL_PAGE_SIZE = 4;
  const startIndex = (currentPage - 1) * PATIENT_DETAIL_PAGE_SIZE;
  const endIndex = startIndex + PATIENT_DETAIL_PAGE_SIZE;
  const paginatedPlans = patientPlans?.slice(startIndex, endIndex) || [];
  const totalPages = Math.ceil((patientPlans?.length || 0) / PATIENT_DETAIL_PAGE_SIZE);

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">الخطط العلاجية</h3>
            <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
              <DropdownMenuTrigger asChild>
                <Button>
                  إضافة خطة
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                {isTemplatesLoading ? (
                  <DropdownMenuItem>
                    <div className="w-full flex justify-center">
                      <div className="h-2 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                  </DropdownMenuItem>
                ) : templates && templates.length > 0 ? (
                  templates.map((template) => (
                    <DropdownMenuItem 
                      key={template.id} 
                      className="flex flex-col items-start p-3 cursor-pointer"
                      onSelect={() => handleTemplateSelect(template)}
                    >
                      <div className="font-medium">{template.name}</div>
                      <div className="text-xs text-muted-foreground">
                        {template.session_price} جنيه للجلسة
                      </div>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    <div className="text-center w-full text-sm text-muted-foreground">
                      لا توجد خطط علاجية متوفرة
                    </div>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>
        <CardContent>
          {isPlansLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-12 bg-gray-100 rounded animate-pulse"></div>
              ))}
            </div>
          ) : patientPlans && patientPlans.length > 0 ? (
            <>
              <DataTable
                columns={columns}
                data={paginatedPlans}
                emptyLabel="لا توجد خطط علاجية لهذا المريض"
                page={currentPage}
                pageSize={PATIENT_DETAIL_PAGE_SIZE}
                total={patientPlans?.length || 0}
                onPageChange={setCurrentPage}
              />
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between border-t border-border px-3 py-2 mt-4">
                  <div className="text-xs text-muted-foreground">
                    {startIndex + 1}-{Math.min(endIndex, patientPlans.length)} من {patientPlans.length}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      className="px-2 py-1 rounded-[var(--radius)] bg-muted text-xs disabled:opacity-50"
                      disabled={currentPage <= 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                    >
                      السابق
                    </button>
                    <span className="px-2 py-1 rounded-[var(--radius)] bg-muted text-xs">
                      الصفحة {currentPage} من {totalPages}
                    </span>
                    <button
                      className="px-2 py-1 rounded-[var(--radius)] bg-muted text-xs disabled:opacity-50"
                      disabled={currentPage >= totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                    >
                      التالي
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد خطط علاجية لهذا المريض
            </div>
          )}
        </CardContent>
      </Card>

      <PatientPlanAssignmentForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        template={selectedTemplate}
        patientId={patientId}
        onPlanAssigned={handlePlanAssigned}
      />
    </>
  );
}

export default function PatientDetailPage() {
  const {id} = useParams();
  const queryClient = useQueryClient();
  const {data: patient, isLoading: isPatientLoading} = usePatient(id);
  const {data: appointments, isLoading: isAppointmentsLoading} = usePatientAppointments(id);
  const {data: visits, isLoading: isVisitsLoading} = useVisits(id);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleVisitAdded = () => {
    // Invalidate visits query to refresh the data
    queryClient.invalidateQueries({ queryKey: ["visits", id] });
  };

  return (
    <div className="space-y-8" dir="rtl">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h1 className="text-3xl font-bold">تفاصيل المريض</h1>

          <Button
            variant="ghost"
            className="gap-2"
            onClick={() => navigate(-1)}>
            رجوع <ArrowLeft className="size-4" />
          </Button>
        </div>
        <p className="text-sm text-muted-foreground">
          عرض منظم لبيانات المريض.
        </p>
      </div>

      {isPatientLoading ? (
        <Card>
          <CardHeader>
            <SkeletonLine width={180} height={20} />
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              {Array.from({length: 5}).map((_, i) => (
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
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left column - Appointment History, Visits and Treatment Plans */}
          <div className="space-y-6">
            <PatientAppointmentsHistory 
              appointments={appointments} 
              isLoading={isAppointmentsLoading} 
            />
            <PatientVisitsTable 
              visits={visits} 
              isLoading={isVisitsLoading} 
              patientId={id}
              onVisitAdded={handleVisitAdded}
            />
            <PatientTreatmentPlansTable patientId={id} />
          </div>
          
          {/* Right column - Patient Information */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">{patient?.name}</h3>
                  <Button variant="outline" onClick={() => setOpen(true)}>
                    تعديل
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="rounded-[var(--radius)] border border-border p-3">
                    <div className="text-sm text-muted-foreground">رقم الهاتف</div>
                    <div className="text-base">{patient?.phone ?? "-"}</div>
                  </div>
                  <div className="rounded-[var(--radius)] border border-border p-3">
                    <div className="text-sm text-muted-foreground">الجنس</div>
                    <div className="text-base">{patient?.gender}</div>
                  </div>
                  <div className="rounded-[var(--radius)] border border-border p-3">
                    <div className="text-sm text-muted-foreground">العنوان</div>
                    <div className="text-base">{patient?.address ?? "-"}</div>
                  </div>
                  <div className="rounded-[var(--radius)] border border-border p-3">
                    <div className="text-sm text-muted-foreground">
                      تاريخ الميلاد
                    </div>
                    <div className="text-base">{patient?.date_of_birth ?? "-"}</div>
                  </div>
                  <div className="rounded-[var(--radius)] border border-border p-3">
                    <div className="text-sm text-muted-foreground">
                      فصيلة الدم
                    </div>
                    <div className="text-base">{patient?.blood_type ?? "-"}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <PatientEditDialog
            open={open}
            onClose={() => setOpen(false)}
            patient={patient}
          />
        </div>
      )}
    </div>
  );
}