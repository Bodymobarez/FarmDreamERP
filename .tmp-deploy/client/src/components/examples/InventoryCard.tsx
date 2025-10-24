import { InventoryCard } from '../InventoryCard'

export default function InventoryCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InventoryCard
          name="علف تسمين مركز"
          currentStock={450}
          unit="كجم"
          reorderPoint={200}
          supplier="شركة الأعلاف المصرية"
        />
        <InventoryCard
          name="دواء إيفرمكتين"
          currentStock={15}
          unit="عبوة"
          reorderPoint={20}
          supplier="الشركة العالمية للأدوية"
          onReorder={() => console.log('Reorder Ivermectin')}
        />
        <InventoryCard
          name="مكملات فيتامينات"
          currentStock={85}
          unit="كجم"
          reorderPoint={50}
          supplier="مصر للمكملات"
        />
      </div>
    </div>
  )
}
