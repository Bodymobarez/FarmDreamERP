import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp } from "lucide-react";

interface AnimalCardProps {
  id: string;
  earTag: string;
  pen: string;
  batch: string;
  sex: string;
  currentWeight?: number;
  entryWeight?: number;
  status: "active" | "sold" | "dead";
  onClick?: () => void;
}

export function AnimalCard({
  id,
  earTag,
  pen,
  batch,
  sex,
  currentWeight,
  entryWeight,
  status,
  onClick,
}: AnimalCardProps) {
  const statusColors = {
    active: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    sold: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    dead: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const statusLabels = {
    active: "نشط",
    sold: "مُباع",
    dead: "نافق",
  };

  const weightGain = currentWeight && entryWeight ? currentWeight - entryWeight : 0;

  return (
    <Card className="p-4 hover-elevate" data-testid={`animal-card-${earTag}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold mb-1" data-testid={`text-eartag-${earTag}`}>رقم الأذن: {earTag}</h3>
          <p className="text-sm text-muted-foreground">{sex === "ذكر" ? "ذكر" : "أنثى"}</p>
        </div>
        <Badge className={statusColors[status]} data-testid={`badge-status-${earTag}`}>
          {statusLabels[status]}
        </Badge>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">العنبر:</span>
          <span className="font-medium" data-testid={`text-pen-${earTag}`}>{pen}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">الدفعة:</span>
          <span className="font-medium" data-testid={`text-batch-${earTag}`}>{batch}</span>
        </div>
        {currentWeight && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">الوزن الحالي:</span>
            <span className="font-bold" data-testid={`text-weight-${earTag}`}>{currentWeight} كجم</span>
          </div>
        )}
        {weightGain > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">الزيادة:</span>
            <span className="text-chart-1 font-medium flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              {weightGain.toFixed(1)} كجم
            </span>
          </div>
        )}
      </div>

      <Button
        variant="outline"
        className="w-full"
        onClick={onClick}
        data-testid={`button-view-${earTag}`}
      >
        <Eye className="w-4 h-4 ml-2" />
        عرض التفاصيل
      </Button>
    </Card>
  );
}
