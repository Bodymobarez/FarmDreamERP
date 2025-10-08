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

const mockData: AnimalReportData[] = [
  { earTag: "98", batch: "دفعة 3", entryWeight: 24.8, currentWeight: 42.5, adg: 0.91, feedCost: 2100, treatmentCost: 150, totalCost: 2450, status: "active" },
  { earTag: "75", batch: "دفعة 2", entryWeight: 22.0, currentWeight: 38.2, adg: 0.88, feedCost: 2150, treatmentCost: 200, totalCost: 2550, status: "active" },
  { earTag: "52", batch: "دفعة 1", entryWeight: 25.5, currentWeight: 45.0, adg: 0.92, feedCost: 2050, treatmentCost: 120, totalCost: 2350, status: "sold" },
  { earTag: "89", batch: "دفعة 3", entryWeight: 23.5, currentWeight: 40.3, adg: 0.86, feedCost: 2200, treatmentCost: 180, totalCost: 2580, status: "active" },
  { earTag: "64", batch: "دفعة 2", entryWeight: 21.8, currentWeight: 37.8, adg: 0.87, feedCost: 2100, treatmentCost: 160, totalCost: 2460, status: "active" },
];

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
