import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Target } from "lucide-react";

export function ProfitabilityAnalysis() {
  const metrics = [
    {
      label: "متوسط سعر البيع",
      value: "65 ج/كجم",
      icon: DollarSign,
      color: "text-chart-1",
    },
    {
      label: "متوسط وزن البيع",
      value: "45 كجم",
      icon: Target,
      color: "text-chart-2",
    },
    {
      label: "الإيراد المتوقع لكل رأس",
      value: "2,925 ج",
      icon: TrendingUp,
      color: "text-chart-1",
    },
    {
      label: "الربح المتوقع لكل رأس",
      value: "475 ج",
      icon: TrendingUp,
      color: "text-chart-1",
    },
  ];

  return (
    <Card className="p-6" data-testid="card-profitability">
      <h3 className="text-xl font-bold mb-4">تحليل الربحية</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {metrics.map((metric) => (
          <div key={metric.label} className="flex items-center gap-3 p-3 bg-card rounded-lg border border-card-border">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${metric.color} bg-current/10`}>
              <metric.icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">{metric.label}</p>
              <p className="text-lg font-bold">{metric.value}</p>
            </div>
          </div>
        ))}
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center justify-between p-4 bg-chart-1/10 rounded-lg border border-chart-1/20">
          <div>
            <p className="text-sm text-muted-foreground">هامش الربح</p>
            <p className="text-2xl font-bold text-chart-1">16.2%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-chart-1" />
        </div>
        
        <div className="p-4 bg-card rounded-lg border border-card-border">
          <p className="text-sm text-muted-foreground mb-2">الربح المتوقع للدفعة الكاملة (98 رأس)</p>
          <p className="text-3xl font-bold text-chart-1">46,550 جنيه</p>
        </div>
      </div>
    </Card>
  );
}
