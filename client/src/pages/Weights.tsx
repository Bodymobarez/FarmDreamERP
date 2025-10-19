import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Activity,
  Calendar,
  Search,
  Plus,
  Beef
} from "lucide-react";
import { AddWeightDialog } from "@/components/AddWeightDialog";

export default function Weights() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch weights
  const { data: weights = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/weights"],
  });

  // Fetch animals for names
  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // Filter weights
  const filteredWeights = weights.filter((weight: any) => {
    const animal = animals.find((a: any) => a.id === weight.animalId);
    return animal?.earTag?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  // Calculate statistics
  const stats = {
    total: weights.length,
    avgWeight: weights.length > 0
      ? weights.reduce((sum: number, w: any) => sum + parseFloat(w.weight || "0"), 0) / weights.length
      : 0,
    maxWeight: weights.length > 0
      ? Math.max(...weights.map((w: any) => parseFloat(w.weight || "0")))
      : 0,
    minWeight: weights.length > 0
      ? Math.min(...weights.map((w: any) => parseFloat(w.weight || "0")))
      : 0,
    recentGains: weights.filter((w: any) => {
      const date = new Date(w.weighDate || w.createdAt);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return date >= weekAgo;
    }).length,
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
              <Scale className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة الأوزان</h1>
              <p className="text-gray-600 mt-1">تتبع ومراقبة نمو القطيع</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <AddWeightDialog />
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total Weights */}
          <Card className="border-2 border-purple-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 shadow-md">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي القياسات</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          {/* Average Weight */}
          <Card className="border-2 border-emerald-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <Scale className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">متوسط الوزن</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.avgWeight.toFixed(0)}</p>
                <p className="text-xs text-gray-500">كجم</p>
              </div>
            </CardContent>
          </Card>

          {/* Max Weight */}
          <Card className="border-2 border-green-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center mb-3 shadow-md">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">أعلى وزن</p>
                <p className="text-3xl font-bold text-green-600">{stats.maxWeight.toFixed(0)}</p>
                <p className="text-xs text-gray-500">كجم</p>
              </div>
            </CardContent>
          </Card>

          {/* Min Weight */}
          <Card className="border-2 border-orange-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3 shadow-md">
                  <TrendingDown className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">أقل وزن</p>
                <p className="text-3xl font-bold text-orange-600">{stats.minWeight.toFixed(0)}</p>
                <p className="text-xs text-gray-500">كجم</p>
              </div>
            </CardContent>
          </Card>

          {/* Recent */}
          <Card className="border-2 border-blue-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-md">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">هذا الأسبوع</p>
                <p className="text-3xl font-bold text-blue-600">{stats.recentGains}</p>
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
                placeholder="ابحث برقم الأذن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Weights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredWeights.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <Scale className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد أوزان مسجلة</p>
                  <p className="text-gray-400 text-sm mt-2">ابدأ بتسجيل وزن جديد</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredWeights.map((weight: any) => {
              const animal = animals.find((a: any) => a.id === weight.animalId);
              return (
                <Card
                  key={weight.id}
                  className="border-2 border-purple-200 bg-white hover:shadow-xl hover:border-purple-400 transition-all duration-300"
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-md">
                          <Beef className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="font-bold text-lg text-gray-900">#{animal?.earTag || "غير معروف"}</p>
                          <p className="text-xs text-gray-500">{new Date(weight.weighDate || weight.createdAt).toLocaleDateString("ar-EG")}</p>
                        </div>
                      </div>
                    </div>

                    {/* Weight Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600 text-sm">الوزن:</span>
                        <span className="font-bold text-2xl text-purple-600">{weight.weight} كجم</span>
                      </div>
                      {weight.notes && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-600">{weight.notes}</p>
                        </div>
                      )}
                    </div>
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
