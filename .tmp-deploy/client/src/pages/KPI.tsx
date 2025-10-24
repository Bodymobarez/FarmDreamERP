import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  Scale,
  Beef,
  Percent,
  Search,
  BarChart3
} from "lucide-react";

export default function KPI() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: expenses = [] } = useQuery<any[]>({
    queryKey: ["/api/expenses"],
  });

  const { data: weights = [] } = useQuery<any[]>({
    queryKey: ["/api/weights"],
  });

  // Calculate KPIs
  const totalAnimals = animals.length;
  const activeAnimals = animals.filter((a: any) => a.status === "active").length;

  const totalRevenue = transactions
    .filter((t: any) => t.type === "sale" || t.transactionType === "sale")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const totalCost = transactions
    .filter((t: any) => t.type === "purchase" || t.transactionType === "purchase")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0) +
    expenses.reduce((sum: number, e: any) => sum + parseFloat(e.amount || "0"), 0);

  const netProfit = totalRevenue - totalCost;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const totalWeight = animals.reduce((sum: number, a: any) => 
    sum + parseFloat(a.currentWeight || "0"), 0);
  const avgWeight = totalAnimals > 0 ? totalWeight / totalAnimals : 0;

  const totalWeightGain = animals.reduce((sum: number, a: any) => {
    const current = parseFloat(a.currentWeight || "0");
    const entry = parseFloat(a.entryWeight || "0");
    return sum + (current - entry);
  }, 0);

  const avgDailyGain = totalAnimals > 0 ? totalWeightGain / (totalAnimals * 30) : 0;

  const survivalRate = totalAnimals > 0 
    ? (activeAnimals / totalAnimals) * 100 
    : 0;

  const costPerHead = activeAnimals > 0 ? totalCost / activeAnimals : 0;

  const kpis = [
    {
      id: 1,
      name: "صافي الربح",
      value: netProfit.toFixed(0),
      unit: "ج.م",
      change: netProfit >= 0 ? "positive" : "negative",
      icon: DollarSign,
      color: netProfit >= 0 ? "emerald" : "red",
    },
    {
      id: 2,
      name: "هامش الربح",
      value: profitMargin.toFixed(1),
      unit: "%",
      change: profitMargin >= 20 ? "positive" : profitMargin >= 10 ? "neutral" : "negative",
      icon: Percent,
      color: profitMargin >= 20 ? "green" : profitMargin >= 10 ? "blue" : "orange",
    },
    {
      id: 3,
      name: "متوسط الوزن",
      value: avgWeight.toFixed(0),
      unit: "كجم",
      change: "neutral",
      icon: Scale,
      color: "teal",
    },
    {
      id: 4,
      name: "معدل النمو اليومي",
      value: avgDailyGain.toFixed(2),
      unit: "كجم/يوم",
      change: avgDailyGain >= 1.2 ? "positive" : avgDailyGain >= 0.8 ? "neutral" : "negative",
      icon: TrendingUp,
      color: avgDailyGain >= 1.2 ? "green" : avgDailyGain >= 0.8 ? "blue" : "orange",
    },
    {
      id: 5,
      name: "معدل البقاء",
      value: survivalRate.toFixed(1),
      unit: "%",
      change: survivalRate >= 95 ? "positive" : survivalRate >= 90 ? "neutral" : "negative",
      icon: Activity,
      color: survivalRate >= 95 ? "green" : survivalRate >= 90 ? "blue" : "red",
    },
    {
      id: 6,
      name: "التكلفة لكل رأس",
      value: costPerHead.toFixed(0),
      unit: "ج.م",
      change: "neutral",
      icon: Beef,
      color: "purple",
    },
    {
      id: 7,
      name: "إجمالي الإيرادات",
      value: totalRevenue.toFixed(0),
      unit: "ج.م",
      change: "positive",
      icon: DollarSign,
      color: "emerald",
    },
    {
      id: 8,
      name: "إجمالي التكاليف",
      value: totalCost.toFixed(0),
      unit: "ج.م",
      change: "negative",
      icon: TrendingDown,
      color: "red",
    },
  ];

  const filteredKpis = kpis.filter((kpi) =>
    kpi.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">مؤشرات الأداء</h1>
              <p className="text-gray-600 mt-1">KPI Dashboard</p>
            </div>
          </div>
        </div>

        <Card className="border-2 border-emerald-200 bg-white">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث عن مؤشر..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredKpis.map((kpi) => {
            const Icon = kpi.icon;
            const colorMap: Record<string, { bg: string; border: string; text: string }> = {
              emerald: { bg: "from-emerald-500 to-emerald-600", border: "border-emerald-200", text: "text-emerald-600" },
              green: { bg: "from-green-500 to-green-600", border: "border-green-200", text: "text-green-600" },
              blue: { bg: "from-blue-500 to-blue-600", border: "border-blue-200", text: "text-blue-600" },
              teal: { bg: "from-teal-500 to-teal-600", border: "border-teal-200", text: "text-teal-600" },
              purple: { bg: "from-purple-500 to-purple-600", border: "border-purple-200", text: "text-purple-600" },
              orange: { bg: "from-orange-500 to-orange-600", border: "border-orange-200", text: "text-orange-600" },
              red: { bg: "from-red-500 to-red-600", border: "border-red-200", text: "text-red-600" },
            };
            const colorClasses = colorMap[kpi.color] || colorMap.emerald;

            return (
              <Card
                key={kpi.id}
                className={`border-2 ${colorClasses.border} bg-white hover:shadow-xl transition-all duration-300`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses.bg} flex items-center justify-center mb-3 shadow-md`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{kpi.name}</p>
                    <div className="flex items-baseline gap-1">
                      <p className={`text-3xl font-bold ${colorClasses.text}`}>{kpi.value}</p>
                      <p className="text-sm text-gray-500">{kpi.unit}</p>
                    </div>
                    {kpi.change === "positive" && (
                      <div className="mt-2 flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />
                        <span className="text-xs font-medium">ممتاز</span>
                      </div>
                    )}
                    {kpi.change === "negative" && (
                      <div className="mt-2 flex items-center gap-1 text-red-600">
                        <TrendingDown className="w-4 h-4" />
                        <span className="text-xs font-medium">يحتاج تحسين</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Performance Summary */}
        <Card className="border-2 border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <h3 className="text-lg font-bold text-gray-900">ملخص الأداء</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">إجمالي الحيوانات</p>
                <p className="text-2xl font-bold text-gray-900">{totalAnimals}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">الحيوانات النشطة</p>
                <p className="text-2xl font-bold text-green-600">{activeAnimals}</p>
              </div>
              <div className="p-4 bg-white rounded-lg border border-blue-200">
                <p className="text-sm text-gray-600 mb-1">إجمالي الوزن</p>
                <p className="text-2xl font-bold text-teal-600">{totalWeight.toFixed(0)} كجم</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
