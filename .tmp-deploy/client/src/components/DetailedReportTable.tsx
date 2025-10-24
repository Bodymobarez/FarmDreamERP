import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface AnimalReportData {
  earTag: string;
  batch: string;
  entryWeight: number;
  currentWeight: number;
  adg: number;
  feedCost: number;
  treatmentCost: number;
  totalCost: number;
  status: "active" | "sold" | "dead";
}

// البيانات ستأتي من قاعدة البيانات عبر API
const mockData: AnimalReportData[] = [];

export function DetailedReportTable() {
  const statusColors = {
    active: "default",
    sold: "secondary",
    dead: "destructive",
  } as const;

  const statusLabels = {
    active: "نشط",
    sold: "مُباع",
    dead: "نافق",
  };

  return (
    <Card className="p-6" data-testid="table-detailed-report">
      <h3 className="text-xl font-bold mb-4">تقرير التكاليف التفصيلي لكل رأس</h3>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-right">رقم الأذن</TableHead>
              <TableHead className="text-right">الدفعة</TableHead>
              <TableHead className="text-right">وزن الدخول</TableHead>
              <TableHead className="text-right">الوزن الحالي</TableHead>
              <TableHead className="text-right">ADG</TableHead>
              <TableHead className="text-right">تكلفة الأعلاف</TableHead>
              <TableHead className="text-right">تكلفة العلاج</TableHead>
              <TableHead className="text-right">التكلفة الإجمالية</TableHead>
              <TableHead className="text-right">الحالة</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {mockData.map((row) => (
              <TableRow key={row.earTag}>
                <TableCell className="font-bold">{row.earTag}</TableCell>
                <TableCell>{row.batch}</TableCell>
                <TableCell>{row.entryWeight} كجم</TableCell>
                <TableCell className="font-bold">{row.currentWeight} كجم</TableCell>
                <TableCell className="text-chart-1">{row.adg} كجم/يوم</TableCell>
                <TableCell>{row.feedCost.toLocaleString()} ج</TableCell>
                <TableCell>{row.treatmentCost.toLocaleString()} ج</TableCell>
                <TableCell className="font-bold">{row.totalCost.toLocaleString()} ج</TableCell>
                <TableCell>
                  <Badge variant={statusColors[row.status]}>
                    {statusLabels[row.status]}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
