import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Receipt,
  DollarSign,
  Calendar,
  TrendingUp,
  Package,
  Search,
  Plus
} from "lucide-react";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";

export default function Expenses() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: expenses = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/expenses"],
  });

  const filteredExpenses = expenses.filter((expense: any) =>
    expense.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    expense.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: expenses.length,
    thisMonth: expenses.filter((e: any) => {
      const date = new Date(e.date || e.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth();
    }).length,
    totalAmount: expenses.reduce((sum: number, e: any) => 
      sum + parseFloat(e.amount || "0"), 0
    ),
    avgExpense: expenses.length > 0
      ? expenses.reduce((sum: number, e: any) => sum + parseFloat(e.amount || "0"), 0) / expenses.length
      : 0,
    categories: Array.from(new Set(expenses.map((e: any) => e.category))).length,
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-lg">
              <Receipt className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">المصروفات</h1>
              <p className="text-gray-600 mt-1">متابعة النفقات والتكاليف</p>
            </div>
          </div>
          <div>
            <AddExpenseDialog />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="border-2 border-orange-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3 shadow-md">
                  <Receipt className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المصروفات</p>
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

          <Card className="border-2 border-red-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 shadow-md">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المبلغ</p>
                <p className="text-2xl font-bold text-red-600">{stats.totalAmount.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">متوسط المصروف</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.avgExpense.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 shadow-md">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">الفئات</p>
                <p className="text-3xl font-bold text-purple-600">{stats.categories}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="border-2 border-emerald-200 bg-white">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="ابحث بالوصف أو الفئة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredExpenses.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <Receipt className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد مصروفات</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredExpenses.map((expense: any) => (
              <Card key={expense.id} className="border-2 border-orange-200 bg-white hover:shadow-xl hover:border-orange-400 transition-all duration-300">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-md">
                      <Receipt className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-900 line-clamp-1">{expense.description}</p>
                      <p className="text-xs text-gray-500">{new Date(expense.date || expense.createdAt).toLocaleDateString("ar-EG")}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">الفئة:</span>
                      <span className="font-medium text-gray-900">{expense.category || "-"}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600 text-sm">المبلغ:</span>
                      <span className="font-bold text-2xl text-orange-600">{parseFloat(expense.amount || "0").toFixed(0)} ج.م</span>
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
