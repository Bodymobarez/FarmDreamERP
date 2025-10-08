import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color?: "primary" | "secondary" | "success" | "warning";
}

export function KPICard({ title, value, subtitle, icon: Icon, trend, color = "primary" }: KPICardProps) {
  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-chart-2/10 text-chart-2",
    success: "bg-chart-1/10 text-chart-1",
    warning: "bg-chart-4/10 text-chart-4",
  };

  return (
    <Card className="p-6 hover-elevate" data-testid={`kpi-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-muted-foreground mb-2">{title}</p>
          <h3 className="text-3xl font-bold mb-1" data-testid={`value-${title.toLowerCase().replace(/\s+/g, '-')}`}>{value}</h3>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
          {trend && (
            <p className={`text-xs mt-2 ${trend.isPositive ? 'text-chart-1' : 'text-destructive'}`}>
              {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
            </p>
          )}
        </div>
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </Card>
  );
}
