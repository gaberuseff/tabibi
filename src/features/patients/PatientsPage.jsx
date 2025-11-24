import { Search } from "lucide-react";
import { useState } from "react";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import TableSkeleton from "../../components/ui/table-skeleton";
import { PAGE_SIZE } from "../../constants/pagination";
import PatientCreateDialog from "./PatientCreateDialog";
import PatientsTable from "./PatientsTable";
import usePatients from "./usePatients";

export default function PatientsPage() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const {data, isLoading} = usePatients(query, page);

  return (
    <div className="space-y-8" dir="rtl">
      <div className="space-y-3">
        <h1 className="text-2xl font-bold">المرضى</h1>
        <p className="text-sm text-muted-foreground">
          إدارة قائمة المرضى والبحث.
        </p>
      </div>

      <Card>
        <CardContent className="py-4 flex flex-wrap gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="absolute start-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input
              className="ps-9"
              placeholder="ابحث عن مريض"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <Button variant="outline" onClick={() => setOpen(true)}>
            إضافة مريض
          </Button>
        </CardContent>
      </Card>

      {isLoading ? (
        <Card>
          <CardContent className="p-0">
            <TableSkeleton columns={5} rows={PAGE_SIZE} />
          </CardContent>
        </Card>
      ) : (
        <PatientsTable
          patients={data?.items}
          total={data?.total}
          page={page}
          pageSize={PAGE_SIZE}
          onPageChange={setPage}
        />
      )}

      <PatientCreateDialog open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
