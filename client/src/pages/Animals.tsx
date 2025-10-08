import { AnimalCard } from "@/components/AnimalCard";
import { FilterBar } from "@/components/FilterBar";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState } from "react";

export default function Animals() {
  const [searchTerm, setSearchTerm] = useState("");

  const mockAnimals = [
    { id: "1", earTag: "98", pen: "عنبر 5", batch: "الدفعة الثالثة", sex: "ذكر", currentWeight: 42.5, entryWeight: 24.8, status: "active" as const },
    { id: "2", earTag: "75", pen: "عنبر 3", batch: "الدفعة الثانية", sex: "ذكر", currentWeight: 38.2, entryWeight: 22.0, status: "active" as const },
    { id: "3", earTag: "52", pen: "عنبر 1", batch: "الدفعة الأولى", sex: "أنثى", currentWeight: 45.0, entryWeight: 25.5, status: "sold" as const },
    { id: "4", earTag: "89", pen: "عنبر 5", batch: "الدفعة الثالثة", sex: "ذكر", currentWeight: 40.3, entryWeight: 23.5, status: "active" as const },
    { id: "5", earTag: "64", pen: "عنبر 3", batch: "الدفعة الثانية", sex: "ذكر", currentWeight: 37.8, entryWeight: 21.8, status: "active" as const },
    { id: "6", earTag: "45", pen: "عنبر 5", batch: "الدفعة الثالثة", sex: "ذكر", currentWeight: 41.2, entryWeight: 24.2, status: "active" as const },
  ];

  const filteredAnimals = mockAnimals.filter(animal =>
    animal.earTag.includes(searchTerm) || 
    animal.pen.includes(searchTerm) ||
    animal.batch.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">إدارة الحيوانات</h1>
          <p className="text-muted-foreground">عرض وإدارة جميع الحيوانات في المزرعة</p>
        </div>
        <Button size="lg" data-testid="button-add-animal">
          <Plus className="w-5 h-5 ml-2" />
          إضافة حيوان جديد
        </Button>
      </div>

      <FilterBar
        searchPlaceholder="ابحث عن حيوان برقم الأذن..."
        showPenFilter
        showBatchFilter
        showStatusFilter
        onSearchChange={setSearchTerm}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAnimals.map((animal) => (
          <AnimalCard
            key={animal.id}
            {...animal}
            onClick={() => console.log(`View animal ${animal.earTag}`)}
          />
        ))}
      </div>

      {filteredAnimals.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">لم يتم العثور على حيوانات</p>
        </div>
      )}
    </div>
  );
}
