import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserCog,
  LogIn,
  Package,
  Beef,
  Wheat,
  Pill,
  ArrowDownToLine
} from "lucide-react";
import { SheepEntryDialog } from "@/components/SheepEntryDialog";
import { FeedDispenseDialog } from "@/components/FeedDispenseDialog";
import { MedicineDispenseDialog } from "@/components/MedicineDispenseDialog";

export default function Worker() {
  const [selectedAction, setSelectedAction] = useState<string | null>(null);
  const [selectedSubAction, setSelectedSubAction] = useState<string | null>(null);
  
  // Dialog states
  const [sheepMaleDialogOpen, setSheepMaleDialogOpen] = useState(false);
  const [sheepFemaleDialogOpen, setSheepFemaleDialogOpen] = useState(false);
  const [feedConcentrateDialogOpen, setFeedConcentrateDialogOpen] = useState(false);
  const [feedRoughageDialogOpen, setFeedRoughageDialogOpen] = useState(false);
  const [medicineVaccinationDialogOpen, setMedicineVaccinationDialogOpen] = useState(false);
  const [medicineTreatmentDialogOpen, setMedicineTreatmentDialogOpen] = useState(false);

  const resetSelection = () => {
    setSelectedAction(null);
    setSelectedSubAction(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-xl shadow-indigo-500/30">
              <UserCog className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">مديول العامل</h1>
              <p className="text-gray-600 mt-1">تسجيل العمليات اليومية</p>
            </div>
          </div>

          {/* Breadcrumb */}
          {selectedAction && (
            <Button
              onClick={resetSelection}
              variant="outline"
              className="w-fit border-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              ← العودة للقائمة الرئيسية
            </Button>
          )}
        </div>

        {/* Main Menu */}
        {!selectedAction && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* تسجيل دخول */}
            <Card
              className="border-2 border-green-200 hover:border-green-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedAction("entry")}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <LogIn className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">📥 تسجيل دخول</h2>
                    <p className="text-gray-600">تسجيل دخول الغنم، التغذية، والأدوية</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* تسجيل صرف */}
            <Card
              className="border-2 border-orange-200 hover:border-orange-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedAction("dispense")}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-orange-500 to-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <ArrowDownToLine className="w-12 h-12 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">📤 تسجيل صرف</h2>
                    <p className="text-gray-600">صرف الأعلاف والأدوية من المخزون</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* تسجيل دخول - Sub Menu */}
        {selectedAction === "entry" && !selectedSubAction && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* تسجيل دخول الغنم */}
            <Card
              className="border-2 border-blue-200 hover:border-blue-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedSubAction("sheep-entry")}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Beef className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🐑 دخول الغنم</h3>
                    <p className="text-sm text-gray-600">تسجيل دخول حيوانات جديدة</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* تسجيل دخول التغذية */}
            <Card
              className="border-2 border-amber-200 hover:border-amber-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedSubAction("feed-entry")}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Wheat className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🌾 دخول التغذية</h3>
                    <p className="text-sm text-gray-600">إضافة أعلاف للمخزون</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* تسجيل دخول الأدوية */}
            <Card
              className="border-2 border-red-200 hover:border-red-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedSubAction("medicine-entry")}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Pill className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">💊 دخول الأدوية</h3>
                    <p className="text-sm text-gray-600">إضافة أدوية وتحصينات</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* تسجيل صرف - Sub Menu */}
        {selectedAction === "dispense" && !selectedSubAction && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* صرف علف */}
            <Card
              className="border-2 border-amber-200 hover:border-amber-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedSubAction("feed-dispense")}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Wheat className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">🌾 صرف علف</h3>
                    <p className="text-sm text-gray-600">صرف أعلاف من المخزون</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* صرف أدوية */}
            <Card
              className="border-2 border-red-200 hover:border-red-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer group"
              onClick={() => setSelectedSubAction("medicine-dispense")}
            >
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform duration-300">
                    <Pill className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">💊 صرف أدوية</h3>
                    <p className="text-sm text-gray-600">صرف أدوية وتحصينات</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* تسجيل دخول الغنم - Gender Selection */}
        {selectedSubAction === "sheep-entry" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🐑 تسجيل دخول الغنم</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className="border-2 border-blue-200 hover:border-blue-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => setSheepMaleDialogOpen(true)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-xl">
                      <span className="text-4xl">♂️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">ذكور</h3>
                      <p className="text-sm text-gray-600">تسجيل دخول ذكور</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-2 border-pink-200 hover:border-pink-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => setSheepFemaleDialogOpen(true)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-pink-500 to-pink-600 flex items-center justify-center shadow-xl">
                      <span className="text-4xl">♀️</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">إناث</h3>
                      <p className="text-sm text-gray-600">تسجيل دخول إناث</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* تسجيل دخول التغذية */}
        {selectedSubAction === "feed-entry" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌾 تسجيل دخول التغذية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-amber-200 hover:border-amber-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                      <Wheat className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">علف مركز</h3>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="border-2 border-amber-300">14%</Button>
                        <Button size="sm" variant="outline" className="border-2 border-amber-300">16%</Button>
                        <Button size="sm" variant="outline" className="border-2 border-amber-300">21%</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-200 hover:border-green-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-xl">
                      <Package className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">مادة مالئة</h3>
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" variant="outline" className="border-2 border-green-300">دريس</Button>
                        <Button size="sm" variant="outline" className="border-2 border-green-300">تبن</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* تسجيل دخول الأدوية */}
        {selectedSubAction === "medicine-entry" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💊 تسجيل دخول الأدوية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-2 border-purple-200 hover:border-purple-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl">
                      <span className="text-4xl">💉</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">تحصينات</h3>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-2 border-red-200 hover:border-red-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer">
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl">
                      <Pill className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">علاجات</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* صرف علف */}
        {selectedSubAction === "feed-dispense" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🌾 صرف علف</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className="border-2 border-amber-200 hover:border-amber-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => setFeedConcentrateDialogOpen(true)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-xl">
                      <Wheat className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">علف مركز</h3>
                      <div className="flex gap-2 mt-3">
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">14%</span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">16%</span>
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-sm font-medium">21%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-2 border-green-200 hover:border-green-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => setFeedRoughageDialogOpen(true)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-xl">
                      <Package className="w-10 h-10 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">مادة مالئة</h3>
                      <div className="flex gap-2 mt-3">
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">دريس</span>
                        <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">تبن</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* صرف أدوية */}
        {selectedSubAction === "medicine-dispense" && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">💊 صرف أدوية</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card 
                className="border-2 border-purple-200 hover:border-purple-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => setMedicineVaccinationDialogOpen(true)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-xl">
                      <span className="text-4xl">💉</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">تحصينات</h3>
                  </div>
                </CardContent>
              </Card>

              <Card 
                className="border-2 border-red-200 hover:border-red-400 bg-white hover:shadow-2xl transition-all duration-300 cursor-pointer"
                onClick={() => setMedicineTreatmentDialogOpen(true)}
              >
                <CardContent className="p-8">
                  <div className="flex flex-col items-center text-center space-y-4">
                    <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-xl">
                      <Pill className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">علاجات</h3>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>

      {/* All Dialogs */}
      <SheepEntryDialog open={sheepMaleDialogOpen} onOpenChange={setSheepMaleDialogOpen} sex="ذكر" />
      <SheepEntryDialog open={sheepFemaleDialogOpen} onOpenChange={setSheepFemaleDialogOpen} sex="أنثى" />
      <FeedDispenseDialog open={feedConcentrateDialogOpen} onOpenChange={setFeedConcentrateDialogOpen} feedType="concentrate" />
      <FeedDispenseDialog open={feedRoughageDialogOpen} onOpenChange={setFeedRoughageDialogOpen} feedType="roughage" />
      <MedicineDispenseDialog open={medicineVaccinationDialogOpen} onOpenChange={setMedicineVaccinationDialogOpen} medicineType="vaccination" />
      <MedicineDispenseDialog open={medicineTreatmentDialogOpen} onOpenChange={setMedicineTreatmentDialogOpen} medicineType="treatment" />
    </div>
  );
}

