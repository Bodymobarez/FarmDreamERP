import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, AlertTriangle, Plus } from "lucide-react";

interface InventoryCardProps {
  name: string;
  currentStock: number;
  unit: string;
  reorderPoint: number;
  supplier?: string;
  onReorder?: () => void;
}

export function InventoryCard({
  name,
  currentStock,
  unit,
  reorderPoint,
  supplier,
  onReorder,
}: InventoryCardProps) {
  const isLowStock = currentStock <= reorderPoint;

  return (
    <Card className="p-4 hover-elevate" data-testid={`card-inventory-${name.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
          isLowStock ? 'bg-destructive/10 text-destructive' : 'bg-chart-1/10 text-chart-1'
        }`}>
          {isLowStock ? <AlertTriangle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
        </div>
        <div className="flex-1">
          <h4 className="font-bold mb-1">{name}</h4>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl font-bold" data-testid={`text-stock-${name.toLowerCase().replace(/\s+/g, '-')}`}>
              {currentStock}
            </span>
            <span className="text-sm text-muted-foreground">{unit}</span>
            {isLowStock && (
              <Badge variant="destructive" className="text-xs">
                مخزون منخفض
              </Badge>
            )}
          </div>
          {supplier && (
            <p className="text-xs text-muted-foreground mb-3">المورد: {supplier}</p>
          )}
          {isLowStock && (
            <Button 
              size="sm" 
              variant="default" 
              onClick={onReorder}
              data-testid={`button-reorder-${name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              <Plus className="w-4 h-4 ml-1" />
              إعادة طلب
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
