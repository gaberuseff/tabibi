import { Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Card, CardContent } from "../../components/ui/card";
import DataTable from "../../components/ui/table";

export default function PatientsTable({ patients, total, page, pageSize, onPageChange }) {
  const columns = [
    { header: "الاسم", accessor: "name", cellClassName: "font-medium" },
    {
      header: "الهاتف",
      accessor: "phone",
      cellClassName: "text-muted-foreground",
    },
    {
      header: "النوع",
      render: (p) => (
        <Badge className="bg-primary/10 text-primary">{p.gender}</Badge>
      ),
    },
    {
      header: "فصيلة الدم",
      accessor: "blood_type",
      cellClassName: "text-muted-foreground",
    },
    {
      header: "الإجراء",
      render: (p) => (
        <Link to={`/patients/${p.id}`}>
          <Button variant="outline" className="gap-2" size="sm">
            <Eye className="size-4" />
            عرض
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <Card>
      <CardContent className="p-0">
        <DataTable 
          columns={columns} 
          data={patients ?? []} 
          total={total} 
          page={page} 
          pageSize={pageSize} 
          onPageChange={onPageChange} 
          emptyLabel="لا توجد مرضى"
        />
      </CardContent>
    </Card>
  );
}