import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Tag } from "lucide-react";

interface ExpenseCardProps {
  date: string;
  category: string;
  amount: number;
  description: string;
  categoryColor?: "feed" | "treatment" | "labor" | "utilities";
}

export function ExpenseCard({ date, category, amount, description, categoryColor = "feed" }: ExpenseCardProps) {
  const colors = {
    feed: "bg-chart-1/10 text-chart-1 border-chart-1/20",
    treatment: "bg-chart-3/10 text-chart-3 border-chart-3/20",
    labor: "bg-chart-2/10 text-chart-2 border-chart-2/20",
    utilities: "bg-chart-4/10 text-chart-4 border-chart-4/20",
  };

  return (
    <Card className="p-4 hover-elevate" data-testid="card-expense">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Badge className={colors[categoryColor]}>
              <Tag className="w-3 h-3 ml-1" />
              {category}
            </Badge>
          </div>
          <p className="text-sm mb-2">{description}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Calendar className="w-3 h-3" />
            <span>{date}</span>
          </div>
        </div>
        <div className="text-left">
          <p className="text-2xl font-bold" data-testid="text-amount">{amount.toLocaleString()}</p>
          <p className="text-xs text-muted-foreground">جنيه</p>
        </div>
      </div>
    </Card>
  );
}
