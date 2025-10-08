import { Card } from "@/components/ui/card";
import { TrendingUp, Scale, DollarSign, Activity } from "lucide-react";

interface MetricProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: number;
  isPositive?: boolean;
}

function MetricCard({ title, value, subtitle, change, isPositive }: MetricProps) {
  return (
    <div className="p-4 bg-card rounded-lg border border-card-border">
      <p className="text-sm text-muted-foreground mb-1">{title}</p>
      <p className="text-2xl font-bold mb-1">{value}</p>
      {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      {change !== undefined && (
        <p className={`text-xs mt-1 ${isPositive ? 'text-chart-1' : 'text-destructive'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(change)}% عن الشهر الماضي
        </p>
      )}
    </div>
  );
}

export function PerformanceMetrics() {
  return (
    <Card className="p-6" data-testid="card-performance-metrics">
      <h3 className="text-xl font-bold mb-4">مؤشرات الأداء الرئيسية</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="متوسط ADG"
          value="0.85 كجم/يوم"
          subtitle="الزيادة اليومية"
          change={5}
          isPositive={true}
        />
        <MetricCard
          title="معدل FCR"
          value="3.2"
          subtitle="تحويل العلف"
          change={-3}
          isPositive={true}
        />
        <MetricCard
          title="التكلفة لكل رأس"
          value="2,450 ج"
          subtitle="متوسط التكلفة"
          change={8}
          isPositive={false}
        />
        <MetricCard
          title="معدل النفوق"
          value="1.2%"
          subtitle="3 من 250"
          change={-15}
          isPositive={true}
        />
      </div>
    </Card>
  );
}
