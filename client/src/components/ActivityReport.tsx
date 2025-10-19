import { useQuery } from "@tanstack/react-query";
import { Card } from "./ui/card";
import { Badge } from "./ui/badge";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  ArrowUpRight,
  ArrowDownRight,
  Beef,
  DollarSign,
  Package,
  Clock,
  Scale,
  Zap
} from "lucide-react";

export function ActivityReport() {
  // Fetch data
  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: inventory = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
  });

  // Calculate stats
  const totalAnimals = (animals as any[]).length;
  const activeAnimals = (animals as any[]).filter((a: any) => a.status === "active").length;
  
  const totalRevenue = (transactions as any[])
    .filter((t: any) => t.type === "sale" || t.transactionType === "sale")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const totalExpenses = (transactions as any[])
    .filter((t: any) => t.type === "purchase" || t.transactionType === "purchase")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitChange = netProfit >= 0;

  const lowStockItems = (inventory as any[]).filter(
    (item: any) => parseFloat(item.currentStock || item.quantity || "0") <= parseFloat(item.minStock || item.minQuantity || "0")
  ).length;

  // Calculate growth rates - معدلات النمو
  const totalCurrentWeight = (animals as any[]).reduce((sum: number, a: any) => 
    sum + parseFloat(a.currentWeight || "0"), 0);
  const totalEntryWeight = (animals as any[]).reduce((sum: number, a: any) => 
    sum + parseFloat(a.entryWeight || "0"), 0);
  const totalWeightGain = totalCurrentWeight - totalEntryWeight;
  const avgWeightGain = totalAnimals > 0 ? totalWeightGain / totalAnimals : 0;

  // Calculate average daily gain (ADG)
  const totalDaysSum = (animals as any[]).reduce((sum: number, a: any) => {
    const entryDate = new Date(a.entryDate || Date.now());
    const today = new Date();
    const days = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    return sum + (days > 0 ? days : 0);
  }, 0);
  const avgDays = totalAnimals > 0 ? totalDaysSum / totalAnimals : 0;
  const avgDailyGain = avgDays > 0 ? totalWeightGain / totalDaysSum : 0;

  // Recent activities (last 5)
  const todayTransactions = (transactions as any[])
    .filter((t: any) => {
      const today = new Date().toISOString().split("T")[0];
      return t.date?.startsWith(today) || t.transactionDate?.startsWith(today);
    })
    .slice(0, 5);

  return (
    <div className="space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between px-3">
        <h2 className="text-lg sm:text-xl font-bold text-gray-900 flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-600" />
          تقرير الحركة
        </h2>
        <Badge className="bg-emerald-100 text-emerald-700 border-emerald-300">
          اليوم
        </Badge>
      </div>

      {/* Growth Rates - معدلات النمو */}
      <Card className="border border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 mx-3">
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Scale className="w-5 h-5 text-emerald-600" />
            <h3 className="font-bold text-gray-900">معدلات النمو العامة</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {/* متوسط الزيادة في الوزن */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center shadow-md">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-600 mb-1">متوسط الزيادة</p>
              <p className="text-2xl font-bold text-emerald-600">
                {avgWeightGain.toFixed(1)} <span className="text-sm">كجم</span>
              </p>
            </div>

            {/* معدل النمو اليومي */}
            <div className="text-center">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 flex items-center justify-center shadow-md">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-600 mb-1">معدل النمو اليومي</p>
              <p className="text-2xl font-bold text-green-600">
                {avgDailyGain.toFixed(2)} <span className="text-sm">كجم/يوم</span>
              </p>
            </div>

            {/* إجمالي الزيادة */}
            <div className="text-center col-span-2 sm:col-span-1">
              <div className="w-12 h-12 mx-auto mb-2 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center shadow-md">
                <Scale className="w-6 h-6 text-white" />
              </div>
              <p className="text-xs text-gray-600 mb-1">إجمالي الزيادة</p>
              <p className="text-2xl font-bold text-teal-600">
                {totalWeightGain.toFixed(0)} <span className="text-sm">كجم</span>
              </p>
            </div>
          </div>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 px-3">
        {/* Net Profit */}
        <Card className="border border-emerald-200 bg-white hover:shadow-lg transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-white" />
              </div>
              {profitChange ? (
                <ArrowUpRight className="w-4 h-4 text-green-600" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-600" />
              )}
            </div>
            <p className="text-xs text-gray-600 mb-1">صافي الربح</p>
            <p className={`text-lg font-bold ${profitChange ? 'text-green-600' : 'text-red-600'}`}>
              {netProfit.toLocaleString("ar-EG")} ج
            </p>
          </div>
        </Card>

        {/* Active Animals */}
        <Card className="border border-emerald-200 bg-white hover:shadow-lg transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
                <Beef className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-xs text-gray-600 mb-1">الحيوانات النشطة</p>
            <p className="text-lg font-bold text-gray-900">
              {activeAnimals} / {totalAnimals}
            </p>
          </div>
        </Card>

        {/* Revenue */}
        <Card className="border border-emerald-200 bg-white hover:shadow-lg transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
                <DollarSign className="w-4 h-4 text-white" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-green-600" />
            </div>
            <p className="text-xs text-gray-600 mb-1">الإيرادات</p>
            <p className="text-lg font-bold text-green-600">
              {totalRevenue.toLocaleString("ar-EG")} ج
            </p>
          </div>
        </Card>

        {/* Low Stock */}
        <Card className="border border-emerald-200 bg-white hover:shadow-lg transition-shadow">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-600 to-green-600 flex items-center justify-center">
                <Package className="w-4 h-4 text-white" />
              </div>
              {lowStockItems > 0 && (
                <Badge className="bg-red-100 text-red-700 text-xs h-5">
                  {lowStockItems}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-600 mb-1">مخزون منخفض</p>
            <p className={`text-lg font-bold ${lowStockItems > 0 ? 'text-red-600' : 'text-gray-900'}`}>
              {lowStockItems} صنف
            </p>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="border border-emerald-200 bg-white mx-3">
        <div className="p-4 border-b border-emerald-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-600" />
            آخر الحركات
          </h3>
        </div>
        <div className="p-4">
          {todayTransactions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 text-emerald-200" />
              <p className="text-sm">لا توجد حركات اليوم</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todayTransactions.map((transaction: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-emerald-50/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center">
                      <DollarSign className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {transaction.entityName || "معاملة"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.type === "sale" ? "بيع" : "شراء"}
                      </p>
                    </div>
                  </div>
                  <div className="text-left">
                    <p className={`text-sm font-bold ${transaction.type === "sale" ? "text-green-600" : "text-red-600"}`}>
                      {parseFloat(transaction.amount || "0").toLocaleString("ar-EG")} ج
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date || transaction.transactionDate).toLocaleTimeString("ar-EG", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}

