import { TreatmentCard } from "@/components/TreatmentCard";
import { Button } from "@/components/ui/button";
import { FilterBar } from "@/components/FilterBar";
import { Plus } from "lucide-react";

export default function Treatments() {
  const mockTreatments = [
    { date: "18/6/2025", treatment: "تطعيم ضد الحمى القلاعية", medicine: "فوت فاكس", dose: "2 مل", cost: 150, vet: "د. أحمد محمود" },
    { date: "15/6/2025", treatment: "علاج إسهال", medicine: "نيوميسين", dose: "5 مل", cost: 80, vet: "د. محمد علي" },
    { date: "12/6/2025", treatment: "فيتامينات تقوية", medicine: "AD3E", dose: "3 مل", cost: 45, vet: "د. أحمد محمود" },
    { date: "10/6/2025", treatment: "علاج طفيليات خارجية", medicine: "إيفرمكتين", dose: "1 مل/10كجم", cost: 120, vet: "د. سارة حسن" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">العلاجات البيطرية</h1>
          <p className="text-muted-foreground">سجل العلاجات والتطعيمات للحيوانات</p>
        </div>
        <Button size="lg" data-testid="button-add-treatment">
          <Plus className="w-5 h-5 ml-2" />
          إضافة علاج جديد
        </Button>
      </div>

      <FilterBar
        searchPlaceholder="ابحث في العلاجات..."
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {mockTreatments.map((treatment, index) => (
          <TreatmentCard key={index} {...treatment} />
        ))}
      </div>
    </div>
  );
}
