import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Home, Package, Plus, TrendingUp } from "lucide-react";

export default function PensBatches() {
  const pens = [
    { id: 1, name: "عنبر 1", capacity: 50, current: 6, batch: "الدفعة الأولى", avgWeight: 44.2 },
    { id: 2, name: "عنبر 3", capacity: 50, current: 42, batch: "الدفعة الثانية", avgWeight: 38.5 },
    { id: 3, name: "عنبر 5", capacity: 60, current: 50, batch: "الدفعة الثالثة", avgWeight: 41.8 },
  ];

  const batches = [
    { name: "الدفعة الأولى", count: 6, receivedDate: "7/5/2025", avgAdg: 0.92, fcr: 3.0 },
    { name: "الدفعة الثانية", count: 42, receivedDate: "20/5/2025", avgAdg: 0.88, fcr: 3.1 },
    { name: "الدفعة الثالثة", count: 50, receivedDate: "1/6/2025", avgAdg: 0.85, fcr: 3.2 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">العنابر والدفعات</h1>
        <p className="text-muted-foreground">إدارة العنابر والدفعات المختلفة</p>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">العنابر</h2>
          <Button data-testid="button-add-pen">
            <Plus className="w-4 h-4 ml-2" />
            إضافة عنبر
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pens.map((pen) => (
            <Card key={pen.id} className="p-6 hover-elevate" data-testid={`card-pen-${pen.id}`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">{pen.name}</h3>
                    <p className="text-sm text-muted-foreground">{pen.batch}</p>
                  </div>
                </div>
                <Badge variant={pen.current >= pen.capacity ? "destructive" : "default"}>
                  {pen.current}/{pen.capacity}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">متوسط الوزن:</span>
                  <span className="font-bold">{pen.avgWeight} كجم</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-primary h-full rounded-full transition-all"
                    style={{ width: `${(pen.current / pen.capacity) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">الدفعات</h2>
          <Button data-testid="button-add-batch">
            <Plus className="w-4 h-4 ml-2" />
            إضافة دفعة
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((batch, index) => (
            <Card key={index} className="p-6 hover-elevate" data-testid={`card-batch-${index}`}>
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 bg-chart-2/10 text-chart-2 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{batch.name}</h3>
                  <p className="text-sm text-muted-foreground">تاريخ الاستلام: {batch.receivedDate}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">عدد الحيوانات:</span>
                  <span className="font-bold">{batch.count} رأس</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">متوسط ADG:</span>
                  <span className="font-bold text-chart-1 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    {batch.avgAdg} كجم/يوم
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">FCR:</span>
                  <span className="font-bold">{batch.fcr}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
