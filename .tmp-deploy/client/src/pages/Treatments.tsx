import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Syringe,
  Activity,
  Calendar,
  DollarSign,
  Pill,
  Search,
  Plus,
  Beef
} from "lucide-react";
import { AddTreatmentDialog } from "@/components/AddTreatmentDialog";

export default function Treatments() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch treatments
  const { data: treatments = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/treatments"],
  });

  // Fetch animals
  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // Filter treatments
  const filteredTreatments = treatments.filter((treatment: any) => {
    const animal = animals.find((a: any) => a.id === treatment.animalId);
    return (
      animal?.earTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.treatmentType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.medication?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Calculate statistics
  const stats = {
    total: treatments.length,
    thisMonth: treatments.filter((t: any) => {
      const date = new Date(t.treatmentDate || t.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    totalCost: treatments.reduce((sum: number, t: any) => 
      sum + parseFloat(t.cost || "0"), 0
    ),
    uniqueAnimals: Array.from(new Set(treatments.map((t: any) => t.animalId))).length,
    commonTreatment: treatments.reduce((acc: any, t: any) => {
      const type = t.treatmentType || "غير محدد";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {}),
  };

  const mostCommonEntries = Object.entries(stats.commonTreatment).sort((a: any, b: any) => b[1] - a[1]);
  const mostCommon = mostCommonEntries.length > 0 ? mostCommonEntries[0] : null;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg">
              <Syringe className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">العلاجات البيطرية</h1>
              <p className="text-gray-600 mt-1">متابعة صحة القطيع</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <AddTreatmentDialog />
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total Treatments */}
          <Card className="border-2 border-red-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 shadow-md">
                  <Syringe className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي العلاجات</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          {/* This Month */}
          <Card className="border-2 border-blue-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-md">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">هذا الشهر</p>
                <p className="text-3xl font-bold text-blue-600">{stats.thisMonth}</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Cost */}
          <Card className="border-2 border-emerald-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي التكلفة</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalCost.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          {/* Treated Animals */}
          <Card className="border-2 border-purple-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 shadow-md">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">حيوانات معالجة</p>
                <p className="text-3xl font-bold text-purple-600">{stats.uniqueAnimals}</p>
              </div>
            </CardContent>
          </Card>

          {/* Common Treatment */}
          <Card className="border-2 border-orange-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3 shadow-md">
                  <Pill className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">الأكثر شيوعاً</p>
                <p className="text-lg font-bold text-orange-600 line-clamp-1">{mostCommon?.[0] || "-"}</p>
                <p className="text-xs text-gray-500">{(mostCommon?.[1] as number) || 0} مرة</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-2 border-emerald-200 bg-white">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث برقم الأذن أو نوع العلاج..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Treatments Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTreatments.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <Syringe className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد علاجات مسجلة</p>
                  <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة علاج جديد</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredTreatments.map((treatment: any) => {
              const animal = animals.find((a: any) => a.id === treatment.animalId);
              return (
                <Card
                  key={treatment.id}
                  className="border-2 border-red-200 bg-white hover:shadow-xl hover:border-red-400 transition-all duration-300"
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-md">
                          <Beef className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-gray-900">#{animal?.earTag || "غير معروف"}</p>
                          <p className="text-xs text-gray-500">{new Date(treatment.treatmentDate || treatment.createdAt).toLocaleDateString("ar-EG")}</p>
                        </div>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">النوع:</span>
                        <span className="font-medium text-gray-900">{treatment.treatmentType || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">الدواء:</span>
                        <span className="font-medium text-blue-600 line-clamp-1">{treatment.medication || "-"}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">التكلفة:</span>
                        <span className="font-bold text-emerald-600">{parseFloat(treatment.cost || "0").toFixed(0)} ج.م</span>
                      </div>
                    </div>

                    {treatment.notes && (
                      <div className="mt-3 p-3 bg-red-50 rounded-lg border border-red-100">
                        <p className="text-xs text-gray-700 line-clamp-2">{treatment.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
