import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Beef,
  Activity,
  Heart,
  Baby,
  DollarSign,
  Scale,
  TrendingUp,
  Search,
  Eye,
  Edit,
  Trash2,
  Plus
} from "lucide-react";
import { AddAnimalDialog } from "@/components/AddAnimalDialog";
import { AddNewbornDialog } from "@/components/AddNewbornDialog";
import { SellAnimalDialog } from "@/components/SellAnimalDialog";

export default function Animals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);

  // Fetch animals
  const { data: animals = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // Filter animals
  const filteredAnimals = animals.filter((animal: any) =>
    animal.earTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    animal.penNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: animals.length,
    active: animals.filter((a: any) => a.status === "active").length,
    newborns: animals.filter((a: any) => a.isNewborn === true).length,
    avgWeight: animals.length > 0
      ? animals.reduce((sum: number, a: any) => sum + parseFloat(a.currentWeight || "0"), 0) / animals.length
      : 0,
    totalCost: animals.reduce((sum: number, a: any) => sum + parseFloat(a.totalCost || "0"), 0),
  };

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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-lg">
              <Beef className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الحيوانات</h1>
              <p className="text-gray-600 mt-1">تتبع ومتابعة القطيع</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <AddAnimalDialog />
            <AddNewbornDialog />
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total Animals */}
          <Card className="border-2 border-emerald-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <Beef className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الحيوانات</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          {/* Active Animals */}
          <Card className="border-2 border-green-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mb-3 shadow-md">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">نشطة</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
              </div>
            </CardContent>
          </Card>

          {/* Newborns */}
          <Card className="border-2 border-pink-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center mb-3 shadow-md">
                  <Baby className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">مواليد</p>
                <p className="text-3xl font-bold text-pink-600">{stats.newborns}</p>
              </div>
            </CardContent>
          </Card>

          {/* Average Weight */}
          <Card className="border-2 border-teal-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center mb-3 shadow-md">
                  <Scale className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">متوسط الوزن</p>
                <p className="text-3xl font-bold text-teal-600">{stats.avgWeight.toFixed(0)}</p>
                <p className="text-xs text-gray-500">كجم</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Cost */}
          <Card className="border-2 border-amber-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-3 shadow-md">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي التكلفة</p>
                <p className="text-2xl font-bold text-amber-600">{stats.totalCost.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
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
                placeholder="ابحث برقم الأذن أو رقم العنبر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Animals Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAnimals.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <Beef className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد حيوانات</p>
                  <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة حيوان جديد</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredAnimals.map((animal: any) => (
              <Card
                key={animal.id}
                className="border-2 border-emerald-200 bg-white hover:shadow-xl hover:border-emerald-400 transition-all duration-300 cursor-pointer group"
              >
                <CardContent className="p-5">
                  {/* Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                        <Beef className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <p className="font-bold text-lg text-gray-900">#{animal.earTag}</p>
                        <p className="text-xs text-gray-500">{animal.animalType || "بقر"}</p>
                      </div>
                    </div>
                    {animal.status === "active" ? (
                      <div className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">
                        نشط
                      </div>
                    ) : (
                      <div className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">
                        {animal.status === "sold" ? "مباع" : "نافق"}
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">العنبر:</span>
                      <span className="font-medium text-gray-900">{animal.penNumber || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">الوزن:</span>
                      <span className="font-medium text-emerald-600">{animal.currentWeight || 0} كجم</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">التكلفة:</span>
                      <span className="font-medium text-amber-600">{parseFloat(animal.totalCost || "0").toFixed(0)} ج.م</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1 border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                    >
                      <Eye className="w-4 h-4 ml-1" />
                      عرض
                    </Button>
                    {animal.status === "active" && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="flex-1 border-blue-200 text-blue-700 hover:bg-blue-50"
                        onClick={() => {
                          setSelectedAnimal(animal);
                          setIsSellDialogOpen(true);
                        }}
                      >
                        <DollarSign className="w-4 h-4 ml-1" />
                        بيع
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Sell Dialog */}
      {selectedAnimal && (
        <SellAnimalDialog
          animal={selectedAnimal}
          open={isSellDialogOpen}
          onOpenChange={setIsSellDialogOpen}
        />
      )}
    </div>
  );
}
