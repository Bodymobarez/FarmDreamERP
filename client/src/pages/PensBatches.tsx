import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Home,
  Beef,
  Package,
  TrendingUp,
  DollarSign,
  Activity,
  Search,
  Plus
} from "lucide-react";
import { AddBatchDialog } from "@/components/AddBatchDialog";

export default function PensBatches() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: batches = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  const filteredBatches = batches.filter((batch: any) =>
    batch.batchName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    batch.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: batches.length,
    active: batches.filter((b: any) => b.status === "active").length,
    totalAnimals: animals.length,
    avgBatchSize: batches.length > 0 
      ? animals.length / batches.length 
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg">
              <Home className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">العنابر والدفعات</h1>
              <p className="text-gray-600 mt-1">إدارة العنابر ومراكز التكلفة</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <AddBatchDialog />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-2 border-teal-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-3 shadow-md">
                  <Home className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الدفعات</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">نشطة</p>
                <p className="text-3xl font-bold text-green-600">{stats.active}</p>
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

          <Card className="border-2 border-blue-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-md">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">متوسط حجم الدفعة</p>
                <p className="text-3xl font-bold text-blue-600">{stats.avgBatchSize.toFixed(0)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-emerald-200 bg-white">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث عن دفعة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBatches.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <Home className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد دفعات</p>
                  <p className="text-gray-400 text-sm mt-2">ابدأ بإنشاء دفعة جديدة</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredBatches.map((batch: any) => {
              const batchAnimals = animals.filter((a: any) => a.batchId === batch.id);
              const activeCount = batchAnimals.filter((a: any) => a.status === "active").length;
              
              return (
                <Card
                  key={batch.id}
                  className="border-2 border-teal-200 bg-white hover:shadow-xl hover:border-teal-400 transition-all duration-300 cursor-pointer"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-md">
                        <Home className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-gray-900 line-clamp-1">
                          {batch.batchName || batch.batchNumber || `دفعة ${batch.id}`}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(batch.createdAt || Date.now()).toLocaleDateString("ar-EG")}
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">الحيوانات:</span>
                        <span className="font-bold text-emerald-600">{batchAnimals.length}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">النشطة:</span>
                        <span className="font-bold text-green-600">{activeCount}</span>
                      </div>
                      {batch.status && (
                        <div className="mt-3 pt-2 border-t">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                            batch.status === "active" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {batch.status === "active" ? "نشطة" : "مغلقة"}
                          </span>
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
