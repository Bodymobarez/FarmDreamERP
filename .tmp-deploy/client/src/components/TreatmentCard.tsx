import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Calendar, DollarSign } from "lucide-react";

interface TreatmentCardProps {
  date: string;
  treatment: string;
  medicine: string;
  dose: string;
  cost: number;
  vet: string;
}

export function TreatmentCard({ date, treatment, medicine, dose, cost, vet }: TreatmentCardProps) {
  return (
    <Card className="p-4 hover-elevate" data-testid="card-treatment">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-chart-3/10 text-chart-3 rounded-lg flex items-center justify-center flex-shrink-0">
          <Stethoscope className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h4 className="font-bold">{treatment}</h4>
            <Badge variant="outline" className="text-xs">{medicine}</Badge>
          </div>
          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{date}</span>
            </div>
            <p>الجرعة: {dose}</p>
            <p>الطبيب: {vet}</p>
          </div>
          <div className="flex items-center gap-2 mt-3 text-sm font-medium">
            <DollarSign className="w-4 h-4 text-chart-4" />
            <span data-testid="text-cost">{cost} جنيه</span>
          </div>
        </div>
      </div>
    </Card>
  );
}
