import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Calendar, Clock, DollarSign, Search, Edit } from "lucide-react";
import useTreatmentTemplates from "./useTreatmentTemplates";
import { SkeletonLine } from "../../components/ui/skeleton";
import { Input } from "../../components/ui/input";
import { formatCurrency } from "../../lib/utils";
import { useState, useMemo } from "react";
import TreatmentTemplateEditDialog from "./TreatmentTemplateEditDialog";

function TreatmentTemplateItem({ template }) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  return (
    <>
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg">{template.name}</CardTitle>
            <Badge variant="secondary" className="text-xs">
              #{String(template.id).slice(0, 8)}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <Clock className="ml-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">عدد الجلسات:</span>
              <span className="mr-2 font-medium">{template.session_count || 0} جلسة</span>
            </div>
            
            <div className="flex items-center text-sm">
              <DollarSign className="ml-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">سعر الجلسة:</span>
              <span className="mr-2 font-medium">{formatCurrency(template.session_price || 0)}</span>
            </div>
            
            <div className="flex items-center text-sm">
              <Calendar className="ml-2 h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">تاريخ الإنشاء:</span>
              <span className="mr-2 font-medium">
                {template.created_at ? format(new Date(template.created_at), "dd MMM yyyy", { locale: ar }) : "غير محدد"}
              </span>
            </div>
            
            <div className="pt-2 flex justify-between items-center">
              <div className="text-sm">
                <span className="text-muted-foreground">الإجمالي:</span>
                <span className="mr-1 font-bold text-primary">
                  {template.session_count && template.session_price ? formatCurrency(template.session_count * template.session_price) : formatCurrency(0)}
                </span>
              </div>
              <Button variant="outline" size="sm" onClick={() => setIsEditDialogOpen(true)}>
                <Edit className="h-4 w-4 ml-1" />
                تعديل
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <TreatmentTemplateEditDialog 
        open={isEditDialogOpen} 
        onClose={() => setIsEditDialogOpen(false)} 
        template={template} 
      />
    </>
  );
}

function TreatmentTemplateSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <SkeletonLine className="h-6 w-32" />
          <SkeletonLine className="h-5 w-16" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center">
            <SkeletonLine className="h-4 w-4 mr-2" />
            <SkeletonLine className="h-4 w-24" />
          </div>
          <div className="flex items-center">
            <SkeletonLine className="h-4 w-4 mr-2" />
            <SkeletonLine className="h-4 w-24" />
          </div>
          <div className="flex items-center">
            <SkeletonLine className="h-4 w-4 mr-2" />
            <SkeletonLine className="h-4 w-24" />
          </div>
          <div className="pt-2">
            <SkeletonLine className="h-4 w-32" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TreatmentTemplatesList() {
  const { data: templates, isLoading, error } = useTreatmentTemplates();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter templates based on search term
  const filteredTemplates = useMemo(() => {
    if (!templates) return [];
    if (!searchTerm) return templates;
    
    const term = searchTerm.toLowerCase();
    return templates.filter(template => 
      template.name.toLowerCase().includes(term)
    );
  }, [templates, searchTerm]);

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث في خطط العلاج..."
            className="pr-10"
            disabled
          />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <TreatmentTemplateSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث في خطط العلاج..."
            className="pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-center py-8">
          <p className="text-red-500">حدث خطأ أثناء تحميل خطط العلاج</p>
          <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!templates || templates.length === 0) {
    return (
      <div className="space-y-4">
        <div className="relative max-w-sm">
          <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="بحث في خطط العلاج..."
            className="pr-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد خطط علاج متوفرة</p>
          <p className="text-sm text-muted-foreground mt-1">اضغط على "إضافة خطة" لإنشاء خطة علاج جديدة</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="relative max-w-sm">
        <Search className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="بحث في خطط العلاج..."
          className="pr-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {filteredTemplates.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">لا توجد نتائج مطابقة للبحث</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <TreatmentTemplateItem key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  );
}