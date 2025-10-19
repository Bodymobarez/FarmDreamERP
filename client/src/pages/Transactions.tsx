import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ClipboardList,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Calendar,
  Search,
  Plus,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { data: transactions = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  const filteredTransactions = transactions.filter((transaction: any) =>
    transaction.entityName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalIncome = transactions
    .filter((t: any) => t.type === "sale" || t.transactionType === "sale")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);
  const totalExpense = transactions
    .filter((t: any) => t.type === "purchase" || t.transactionType === "purchase")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  const stats = {
    total: transactions.length,
    income: transactions.filter((t: any) => t.type === "sale" || t.transactionType === "sale").length,
    expense: transactions.filter((t: any) => t.type === "purchase" || t.transactionType === "purchase").length,
    totalIncome: totalIncome,
    totalExpense: totalExpense,
    net: totalIncome - totalExpense,
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
              <ClipboardList className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">المعاملات المالية</h1>
              <p className="text-gray-600 mt-1">سجل المعاملات الواردة والصادرة</p>
            </div>
          </div>
          <div>
            <Button 
              className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800 text-white h-12 px-6 shadow-lg"
              onClick={() => setIsAddDialogOpen(true)}
            >
              <Plus className="w-5 h-5 ml-2" />
              إضافة معاملة
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="border-2 border-teal-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-3 shadow-md">
                  <ClipboardList className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المعاملات</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-green-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <ArrowUpRight className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">المبيعات</p>
                <p className="text-3xl font-bold text-green-600">{stats.income}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 shadow-md">
                  <ArrowDownRight className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">المشتريات</p>
                <p className="text-3xl font-bold text-red-600">{stats.expense}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3 shadow-md">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalIncome.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stats.net >= 0 ? 'from-blue-500 to-blue-600' : 'from-red-500 to-red-600'} flex items-center justify-center mb-3 shadow-md`}>
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">الصافي</p>
                <p className={`text-2xl font-bold ${stats.net >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {stats.net.toFixed(0)}
                </p>
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
                placeholder="ابحث باسم الجهة أو رقم المرجع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTransactions.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <ClipboardList className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد معاملات</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredTransactions.map((transaction: any) => {
              const isSale = transaction.type === "sale" || transaction.transactionType === "sale";
              return (
                <Card
                  key={transaction.id}
                  className={`border-2 ${isSale ? 'border-green-200' : 'border-red-200'} bg-white hover:shadow-xl hover:border-${isSale ? 'green' : 'red'}-400 transition-all duration-300`}
                >
                  <CardContent className="p-5">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isSale ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} flex items-center justify-center shadow-md`}>
                        {isSale ? (
                          <ArrowUpRight className="w-6 h-6 text-white" />
                        ) : (
                          <ArrowDownRight className="w-6 h-6 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-lg text-gray-900 line-clamp-1">{transaction.entityName || "غير محدد"}</p>
                        <p className="text-xs text-gray-500">{new Date(transaction.date || transaction.createdAt).toLocaleDateString("ar-EG")}</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">النوع:</span>
                        <span className={`font-medium px-2 py-0.5 rounded-full text-xs ${isSale ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {isSale ? 'مبيعات' : 'مشتريات'}
                        </span>
                      </div>
                      {transaction.reference && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">المرجع:</span>
                          <span className="font-medium text-gray-900">{transaction.reference}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between mt-3">
                        <span className="text-gray-600 text-sm">المبلغ:</span>
                        <span className={`font-bold text-2xl ${isSale ? 'text-green-600' : 'text-red-600'}`}>
                          {parseFloat(transaction.amount || "0").toFixed(0)} ج.م
                        </span>
                      </div>
                    </div>
                    {transaction.notes && (
                      <div className={`mt-3 p-2 ${isSale ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} border rounded-lg`}>
                        <p className="text-xs text-gray-700 line-clamp-2">{transaction.notes}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
