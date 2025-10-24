import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Activity,
  Search,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ProfitLossReport() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: animals = [], isLoading: loadingAnimals } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  const { data: transactions = [], isLoading: loadingTransactions } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: expenses = [], isLoading: loadingExpenses } = useQuery<any[]>({
    queryKey: ["/api/expenses"],
  });

  const { data: batches = [], isLoading: loadingBatches } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

  // Calculate totals
  const totalRevenue = transactions
    .filter((t: any) => t.type === "sale" || t.transactionType === "sale")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const totalPurchaseCost = transactions
    .filter((t: any) => t.type === "purchase" || t.transactionType === "purchase")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const totalExpenses = expenses.reduce((sum: number, e: any) => 
    sum + parseFloat(e.amount || "0"), 0);

  const totalCost = totalPurchaseCost + totalExpenses;
  const netProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Animals by batch
  const batchReports = batches.map((batch: any) => {
    const batchAnimals = animals.filter((a: any) => a.batchId === batch.id);
    const soldAnimals = batchAnimals.filter((a: any) => a.status === "sold");
    
    const batchRevenue = soldAnimals.reduce((sum: number, a: any) => 
      sum + parseFloat(a.salePrice || "0"), 0);
    
    const batchCost = batchAnimals.reduce((sum: number, a: any) => 
      sum + parseFloat(a.totalCost || "0"), 0);
    
    const batchProfit = batchRevenue - batchCost;

    return {
      id: batch.id,
      name: batch.batchName || batch.batchNumber || `دفعة ${batch.id}`,
      totalAnimals: batchAnimals.length,
      soldAnimals: soldAnimals.length,
      revenue: batchRevenue,
      cost: batchCost,
      profit: batchProfit,
      profitMargin: batchRevenue > 0 ? (batchProfit / batchRevenue) * 100 : 0,
    };
  }).filter((b: any) =>
    b.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const isLoading = loadingAnimals || loadingTransactions || loadingExpenses || loadingBatches;

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
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center shadow-lg">
                <BarChart3 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">تقرير الأرباح والخسائر</h1>
                <p className="text-gray-600 mt-1">تحليل مالي شامل</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 text-white h-12 px-6 shadow-lg">
              <Download className="w-5 h-5 ml-2" />
              تصدير
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="border-2 border-emerald-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-emerald-600">{totalRevenue.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 shadow-md">
                  <TrendingDown className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي التكاليف</p>
                <p className="text-2xl font-bold text-red-600">{totalCost.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${netProfit >= 0 ? 'border-green-200' : 'border-orange-200'} bg-white hover:shadow-xl transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${netProfit >= 0 ? 'from-green-500 to-green-600' : 'from-orange-500 to-orange-600'} flex items-center justify-center mb-3 shadow-md`}>
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">صافي الربح</p>
                <p className={`text-2xl font-bold ${netProfit >= 0 ? 'text-green-600' : 'text-orange-600'}`}>
                  {netProfit.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-blue-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-md">
                  <Activity className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">هامش الربح</p>
                <p className="text-2xl font-bold text-blue-600">{profitMargin.toFixed(1)}%</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search */}
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

        {/* Batch Reports */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {batchReports.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <BarChart3 className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد دفعات</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            batchReports.map((batch: any) => (
              <Card
                key={batch.id}
                className={`border-2 ${batch.profit >= 0 ? 'border-green-200' : 'border-red-200'} bg-white hover:shadow-xl transition-all duration-300`}
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${batch.profit >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} flex items-center justify-center shadow-md`}>
                      <Package className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-900 line-clamp-1">{batch.name}</p>
                      <p className="text-xs text-gray-500">{batch.totalAnimals} حيوان</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">المبيعات:</span>
                      <span className="font-medium text-gray-900">{batch.soldAnimals}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">الإيرادات:</span>
                      <span className="font-bold text-emerald-600">{batch.revenue.toFixed(0)} ج.م</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">التكاليف:</span>
                      <span className="font-bold text-red-600">{batch.cost.toFixed(0)} ج.م</span>
                    </div>
                    <div className="flex items-center justify-between text-sm pt-2 border-t">
                      <span className="text-gray-600 font-medium">الربح:</span>
                      <span className={`font-bold text-lg ${batch.profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {batch.profit.toFixed(0)} ج.م
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">هامش الربح:</span>
                      <span className={`font-bold ${batch.profitMargin >= 20 ? 'text-green-600' : batch.profitMargin >= 10 ? 'text-blue-600' : 'text-orange-600'}`}>
                        {batch.profitMargin.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Cost Breakdown */}
        <Card className="border-2 border-purple-200 bg-gradient-to-r from-purple-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-6 h-6 text-purple-600" />
              <h3 className="text-lg font-bold text-gray-900">تفصيل التكاليف</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">تكلفة الشراء</p>
                <p className="text-2xl font-bold text-purple-600">{totalPurchaseCost.toFixed(0)} ج.م</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">المصروفات</p>
                <p className="text-2xl font-bold text-orange-600">{totalExpenses.toFixed(0)} ج.م</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-purple-200">
                <p className="text-sm text-gray-600 mb-1">إجمالي</p>
                <p className="text-2xl font-bold text-red-600">{totalCost.toFixed(0)} ج.م</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
