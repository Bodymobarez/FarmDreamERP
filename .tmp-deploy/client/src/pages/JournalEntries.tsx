import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BookOpen,
  FileText,
  Calendar,
  TrendingUp,
  TrendingDown,
  Activity,
  Search,
  Plus
} from "lucide-react";
import { AddJournalEntryDialog } from "@/components/AddJournalEntryDialog";

export default function JournalEntries() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: entries = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/journal-entries"],
  });

  const filteredEntries = entries.filter((entry: any) =>
    entry.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.reference?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: entries.length,
    thisMonth: entries.filter((e: any) => {
      const date = new Date(e.date || e.createdAt);
      const now = new Date();
      return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    }).length,
    debit: entries.reduce((sum: number, e: any) => 
      sum + parseFloat(e.debit || "0"), 0),
    credit: entries.reduce((sum: number, e: any) => 
      sum + parseFloat(e.credit || "0"), 0),
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">القيود اليومية</h1>
              <p className="text-gray-600 mt-1">السجل المحاسبي</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <AddJournalEntryDialog />
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card className="border-2 border-indigo-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center mb-3 shadow-md">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي القيود</p>
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

          <Card className="border-2 border-green-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي المدين</p>
                <p className="text-2xl font-bold text-green-600">{stats.debit.toFixed(0)}</p>
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
                <p className="text-sm text-gray-600 mb-1">إجمالي الدائن</p>
                <p className="text-2xl font-bold text-red-600">{stats.credit.toFixed(0)}</p>
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
                placeholder="ابحث بالوصف أو المرجع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEntries.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد قيود</p>
                  <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة قيد يومي</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredEntries.map((entry: any) => (
              <Card
                key={entry.id}
                className="border-2 border-indigo-200 bg-white hover:shadow-xl hover:border-indigo-400 transition-all duration-300"
              >
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-lg text-gray-900 line-clamp-1">
                        {entry.description || "قيد يومي"}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.date || entry.createdAt).toLocaleDateString("ar-EG")}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    {entry.reference && (
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">المرجع:</span>
                        <span className="font-medium text-gray-900">{entry.reference}</span>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">المدين:</span>
                      <span className="font-bold text-green-600">{parseFloat(entry.debit || "0").toFixed(0)} ج.م</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">الدائن:</span>
                      <span className="font-bold text-red-600">{parseFloat(entry.credit || "0").toFixed(0)} ج.م</span>
                    </div>
                  </div>

                  {entry.notes && (
                    <div className="mt-3 p-2 bg-indigo-50 border border-indigo-200 rounded-lg">
                      <p className="text-xs text-gray-700 line-clamp-2">{entry.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Balance Check */}
        {entries.length > 0 && (
          <Card className={`border-2 ${Math.abs(stats.debit - stats.credit) < 1 ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity className={`w-6 h-6 ${Math.abs(stats.debit - stats.credit) < 1 ? 'text-green-600' : 'text-red-600'}`} />
                  <div>
                    <p className="font-bold text-gray-900">حالة التوازن</p>
                    <p className="text-sm text-gray-600">الفرق بين المدين والدائن</p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`text-2xl font-bold ${Math.abs(stats.debit - stats.credit) < 1 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(stats.debit - stats.credit).toFixed(2)} ج.م
                  </p>
                  <p className="text-xs text-gray-600">
                    {Math.abs(stats.debit - stats.credit) < 1 ? '✓ متوازن' : '⚠️ غير متوازن'}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
