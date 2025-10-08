import { InventoryCard } from "@/components/InventoryCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export default function Inventory() {
  const mockInventory = [
    { name: "علف تسمين مركز", currentStock: 450, unit: "كجم", reorderPoint: 200, supplier: "شركة الأعلاف المصرية" },
    { name: "دواء إيفرمكتين", currentStock: 15, unit: "عبوة", reorderPoint: 20, supplier: "الشركة العالمية للأدوية" },
    { name: "مكملات فيتامينات", currentStock: 85, unit: "كجم", reorderPoint: 50, supplier: "مصر للمكملات" },
    { name: "تطعيم الحمى القلاعية", currentStock: 8, unit: "عبوة", reorderPoint: 15, supplier: "بيوفاك" },
    { name: "برسيم طازج", currentStock: 320, unit: "كجم", reorderPoint: 100, supplier: "مزرعة الخير" },
    { name: "مضاد حيوي", currentStock: 42, unit: "عبوة", reorderPoint: 30, supplier: "فارما مصر" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">الأعلاف والمخزون</h1>
          <p className="text-muted-foreground">إدارة المخزون والأعلاف والأدوية</p>
        </div>
        <Button size="lg" data-testid="button-add-inventory">
          <Plus className="w-5 h-5 ml-2" />
          إضافة صنف جديد
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mockInventory.map((item) => (
          <InventoryCard
            key={item.name}
            {...item}
            onReorder={() => console.log(`Reorder ${item.name}`)}
          />
        ))}
      </div>
    </div>
  );
}
