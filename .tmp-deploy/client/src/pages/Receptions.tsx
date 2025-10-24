import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ShoppingCart,
  Beef,
  DollarSign,
  TrendingUp,
  Calendar,
  Search,
  Plus,
  Package
} from "lucide-react";
import { AddReceptionDialog } from "@/components/AddReceptionDialog";

export default function Receptions() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: receptions = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/receptions"],
  });

  const filteredReceptions = receptions.filter((reception: any) =>
    reception.supplier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reception.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: receptions.length,
    thisMonth: receptions.filter((r: any) => {
      const date = new Date(r.receptionDate || r.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth();
    }).length,
    totalAnimals: receptions.reduce((sum: number, r: any) => 
      sum + parseInt(r.quantity || "0"), 0
    ),
    totalCost: receptions.reduce((sum: number, r: any) => 
      sum + parseFloat(r.totalCost || "0"), 0
    ),
    avgCostPerHead: receptions.length > 0
      ? receptions.reduce((sum: number, r: any) => sum + parseFloat(r.totalCost || "0"), 0) /
        receptions.reduce((sum: number, r: any) => sum + parseInt(r.quantity || "0"), 0)
      : 0,
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
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">استقبال الدفعات</h1>
              <p className="text-gray-600 mt-1">إدارة دفعات الحيوانات الواردة</p>
            </div>
          </div>
          <div>
            <AddReceptionDialog />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="border-2 border-green-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <ShoppingCart className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الدفعات</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

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

          <Card className="border-2 border-emerald-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3 shadow-md">
                  <Beef className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الحيوانات</p>
                <p className="text-3xl font-bold text-emerald-600">{stats.totalAnimals}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mb-3 shadow-md">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي التكلفة</p>
                <p className="text-2xl font-bold text-amber-600">{stats.totalCost.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 shadow-md">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">متوسط سعر الرأس</p>
                <p className="text-2xl font-bold text-purple-600">{stats.avgCostPerHead.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-emerald-200 bg-white">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث بالمورد أو رقم الدفعة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredReceptions.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <ShoppingCart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد دفعات</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredReceptions.map((reception: any) => (
              <Card key={reception.id} className="border-2 border-green-200 bg-white hover:shadow-xl hover:border-green-400 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-md">
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-900">دفعة #{reception.batchNumber || reception.id}</p>
                      <p className="text-xs text-gray-500">{new Date(reception.receptionDate || reception.createdAt).toLocaleDateString("ar-EG")}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">المورد:</span>
                      <span className="font-medium text-gray-900">{reception.supplier || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">الكمية:</span>
                      <span className="font-bold text-emerald-600">{reception.quantity} رأس</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">التكلفة:</span>
                      <span className="font-bold text-xl text-amber-600">{parseFloat(reception.totalCost || "0").toFixed(0)} ج.م</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
