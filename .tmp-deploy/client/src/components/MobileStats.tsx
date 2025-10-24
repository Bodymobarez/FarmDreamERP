import { Card } from "@/components/ui/card";
import { TrendingUp, Beef, DollarSign, Scale } from "lucide-react";

interface MobileStatsProps {
  netProfit: number;
  totalAnimals: number;
  totalCost: number;
  totalRevenue: number;
}

export function MobileStats({ netProfit, totalAnimals, totalCost, totalRevenue }: MobileStatsProps) {
  return (
    <div className="px-3 mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">الإحصائيات السريعة</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* صافي الربح */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent">
          <div className="p-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg mb-3">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-gray-600 mb-1">صافي الربح</p>
            <p className="text-lg font-bold text-gray-900">{netProfit.toLocaleString("ar-EG")} ج</p>
          </div>
        </Card>

        {/* عدد الحيوانات */}
        <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-transparent">
          <div className="p-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center shadow-lg mb-3">
              <Beef className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-gray-600 mb-1">الحيوانات</p>
            <p className="text-lg font-bold text-gray-900">{totalAnimals.toLocaleString("ar-EG")}</p>
          </div>
        </Card>

        {/* الإيرادات */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <div className="p-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center shadow-lg mb-3">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-gray-600 mb-1">الإيرادات</p>
            <p className="text-lg font-bold text-gray-900">{totalRevenue.toLocaleString("ar-EG")} ج</p>
          </div>
        </Card>

        {/* التكاليف */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent">
          <div className="p-4">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg mb-3">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <p className="text-xs text-gray-600 mb-1">التكاليف</p>
            <p className="text-lg font-bold text-gray-900">{totalCost.toLocaleString("ar-EG")} ج</p>
          </div>
        </Card>
      </div>
    </div>
  );
}
