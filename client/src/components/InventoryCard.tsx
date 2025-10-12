import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, AlertTriangle } from "lucide-react";
import { ReorderInventoryDialog } from "./ReorderInventoryDialog";
import { DispenseInventoryDialog } from "./DispenseInventoryDialog";

interface InventoryCardProps {
  item: {
    id: string;
    itemName: string;
    itemCode: string;
    currentStock: string;
    unit: string;
    reorderPoint: string;
    unitCost: string;
    costPerUnit: string;
    itemType: string;
    supplierId?: string | null;
  };
  supplier?: string;
}

export function InventoryCard({
  item,
  supplier,
}: InventoryCardProps) {
  const currentStock = parseFloat(item.currentStock);
  const reorderPoint = parseFloat(item.reorderPoint);
  const isLowStock = currentStock <= reorderPoint;

  return (
    <Card className="p-4 hover-elevate" data-testid={`card-inventory-${item.itemName.toLowerCase().replace(/\s+/g, '-')}`}>
      <div className="flex items-start gap-4 flex-row-reverse">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          isLowStock ? 'bg-destructive/10 text-destructive' : 'bg-chart-1/10 text-chart-1'
        }`}>
          {isLowStock ? <AlertTriangle className="w-5 h-5" /> : <Package className="w-5 h-5" />}
        </div>
        <div className="flex-1 text-right">
          <h4 className="font-bold mb-1">{item.itemName}</h4>
          <div className="flex items-center gap-2 mb-2 justify-end">
            <span className="text-2xl font-bold" data-testid={`text-stock-${item.itemName.toLowerCase().replace(/\s+/g, '-')}`}>
              {currentStock.toFixed(1)}
            </span>
            <span className="text-sm text-muted-foreground">{item.unit}</span>
            {isLowStock && (
              <Badge variant="destructive" className="text-xs">
                مخزون منخفض
              </Badge>
            )}
          </div>
          {supplier && (
            <p className="text-xs text-muted-foreground mb-3">المورد: {supplier}</p>
          )}
          <div className="flex items-center gap-2 mt-3">
            <DispenseInventoryDialog 
              item={{
                id: item.id,
                itemName: item.itemName,
                currentStock: item.currentStock,
                unit: item.unit,
                itemType: item.itemType
              }} 
            />
            {isLowStock && (
              <ReorderInventoryDialog 
                item={{
                  id: item.id,
                  itemName: item.itemName,
                  currentStock: item.currentStock,
                  unit: item.unit,
                  reorderPoint: item.reorderPoint,
                  costPerUnit: item.costPerUnit
                }} 
              />
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
