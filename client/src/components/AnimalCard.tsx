import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, TrendingUp, DollarSign } from "lucide-react";

interface AnimalCardProps {
  id: string;
  earTag: string;
  pen: string;
  batch: string;
  sex: string;
  animalType: string;
  currentWeight?: number;
  entryWeight?: number;
  status: "active" | "sold" | "dead";
  onClick?: () => void;
  onSell?: () => void;
}

export function AnimalCard({
  id,
  earTag,
  pen,
  batch,
  sex,
  animalType,
  currentWeight,
  entryWeight,
  status,
  onClick,
  onSell,
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

  const typeColors: Record<string, string> = {
    "بقر": "bg-chart-2/10 text-chart-2 border-chart-2/20",
    "جاموس": "bg-chart-5/10 text-chart-5 border-chart-5/20",
    "أغنام": "bg-chart-4/10 text-chart-4 border-chart-4/20",
    "ماعز": "bg-chart-3/10 text-chart-3 border-chart-3/20",
  };

  const weightGain = currentWeight && entryWeight ? currentWeight - entryWeight : 0;

  return (
    <Card className="p-4 hover-elevate" data-testid={`animal-card-${earTag}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-lg font-bold mb-1" data-testid={`text-eartag-${earTag}`}>رقم الأذن: {earTag}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-muted-foreground">{sex === "ذكر" ? "ذكر" : "أنثى"}</p>
            <Badge className={typeColors[animalType] || "bg-primary/10 text-primary border-primary/20"} data-testid={`badge-type-${earTag}`}>
              {animalType}
            </Badge>
          </div>
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

      <div className="flex gap-2">
        <Button
          variant="outline"
          className="flex-1"
          onClick={onClick}
          data-testid={`button-view-${earTag}`}
        >
          <Eye className="w-4 h-4 ml-2" />
          عرض
        </Button>
        
        {status === "active" && onSell && (
          <Button
            variant="default"
            className="flex-1 bg-chart-1 hover:bg-chart-1/90"
            onClick={(e) => {
              e.stopPropagation();
              onSell();
            }}
            data-testid={`button-sell-${earTag}`}
          >
            <DollarSign className="w-4 h-4 ml-2" />
            بيع
          </Button>
        )}
      </div>
    </Card>
  );
}
