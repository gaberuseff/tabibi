import {ArrowLeft} from "lucide-react";
import {useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Button} from "../../components/ui/button";
import {Card, CardContent, CardHeader} from "../../components/ui/card";
import PatientEditDialog from "./PatientEditDialog";
import {SkeletonLine, SkeletonBlock} from "../../components/ui/skeleton";
import usePatient from "./usePatient";

export default function PatientDetailPage() {
  const {id} = useParams();
  const {data, isLoading} = usePatient(id);
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

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

      {isLoading ? (
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
        <>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{data?.name}</h3>
                <Button variant="outline" onClick={() => setOpen(true)}>
                  تعديل
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-[var(--radius)] border border-border p-3">
                  <div className="text-sm text-muted-foreground">phone</div>
                  <div className="text-base">{data?.phone ?? "-"}</div>
                </div>
                <div className="rounded-[var(--radius)] border border-border p-3">
                  <div className="text-sm text-muted-foreground">gender</div>
                  <div className="text-base">{data?.gender}</div>
                </div>
                <div className="rounded-[var(--radius)] border border-border p-3">
                  <div className="text-sm text-muted-foreground">address</div>
                  <div className="text-base">{data?.address ?? "-"}</div>
                </div>
                <div className="rounded-[var(--radius)] border border-border p-3">
                  <div className="text-sm text-muted-foreground">
                    date_of_birth
                  </div>
                  <div className="text-base">{data?.date_of_birth ?? "-"}</div>
                </div>
                <div className="rounded-[var(--radius)] border border-border p-3">
                  <div className="text-sm text-muted-foreground">
                    blood_type
                  </div>
                  <div className="text-base">{data?.blood_type ?? "-"}</div>
                </div>
              </div>
            </CardContent>
          </Card>
          <PatientEditDialog
            open={open}
            onClose={() => setOpen(false)}
            patient={data}
          />
        </>
      )}
    </div>
  );
}
