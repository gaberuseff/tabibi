import {ArrowLeft} from "lucide-react";
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
          {/* Left column - Appointment History and Visits */}
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
                    <div className="text-sm text-muted-foreground">phone</div>
                    <div className="text-base">{patient?.phone ?? "-"}</div>
                  </div>
                  <div className="rounded-[var(--radius)] border border-border p-3">
                    <div className="text-sm text-muted-foreground">gender</div>
                    <div className="text-base">{patient?.gender}</div>
                  </div>
                  <div className="rounded-[var(--radius)] border border-border p-3">
                    <div className="text-sm text-muted-foreground">address</div>
                    <div className="text-base">{patient?.address ?? "-"}</div>
                  </div>
                  <div className="rounded-[var(--radius)] border border-border p-3">
                    <div className="text-sm text-muted-foreground">
                      date_of_birth
                    </div>
                    <div className="text-base">{patient?.date_of_birth ?? "-"}</div>
                  </div>
                  <div className="rounded-[var(--radius)] border border-border p-3">
                    <div className="text-sm text-muted-foreground">
                      blood_type
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