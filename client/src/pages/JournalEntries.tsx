import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BookOpen,
  Search,
  Hash,
  Calendar,
  DollarSign,
  Eye,
  Filter,
  FileText,
  TrendingUp,
  TrendingDown,
  Scale,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Plus,
} from "lucide-react";

interface JournalEntry {
  id: string;
  entryNumber: string;
  date: string;
  description: string;
  totalDebit: string;
  totalCredit: string;
  isBalanced: boolean;
  status: string;
  createdBy: string;
  createdAt: string;
}

export default function JournalEntries() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dateFilter, setDateFilter] = useState<string>("all");

  // جلب البيانات الحقيقية من API
  const { data: journalEntries = [] } = useQuery<JournalEntry[]>({
    queryKey: ["/api/journal-entries"],
  });

  // التصفية
  const filteredEntries = journalEntries.filter((entry) => {
    const matchesSearch =
      entry.entryNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.createdBy.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || entry.status === statusFilter;

    const entryDate = new Date(entry.date);
    const today = new Date();
    const matchesDate =
      dateFilter === "all" ||
      (dateFilter === "today" &&
        entryDate.toDateString() === today.toDateString()) ||
      (dateFilter === "week" &&
        entryDate >= new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) ||
      (dateFilter === "month" &&
        entryDate.getMonth() === today.getMonth() &&
        entryDate.getFullYear() === today.getFullYear());

    return matchesSearch && matchesStatus && matchesDate;
  });

  // الإحصائيات
  const totalEntries = journalEntries.length;
  const approvedEntries = journalEntries.filter(
    (e) => e.status === "approved"
  ).length;
  const pendingEntries = journalEntries.filter(
    (e) => e.status === "pending"
  ).length;
  const totalDebitAmount = journalEntries.reduce(
    (sum, e) => sum + parseFloat(e.totalDebit || "0"),
    0
  );
  const totalCreditAmount = journalEntries.reduce(
    (sum, e) => sum + parseFloat(e.totalCredit || "0"),
    0
  );
  const balancedEntries = journalEntries.filter((e) => e.isBalanced).length;

  const getStatusBadge = (status: string) => {
    const badges: Record<string, { label: string; color: string; icon: any }> = {
      approved: {
        label: "معتمد",
        color: "bg-green-100 text-green-700",
        icon: CheckCircle2,
      },
      pending: {
        label: "قيد المراجعة",
        color: "bg-yellow-100 text-yellow-700",
        icon: AlertCircle,
      },
      rejected: {
        label: "مرفوض",
        color: "bg-red-100 text-red-700",
        icon: XCircle,
      },
    };
    return (
      badges[status] || {
        label: status,
        color: "bg-gray-100 text-gray-700",
        icon: FileText,
      }
    );
  };

  const getEntryCardColor = (status: string) => {
    const colors: Record<string, string> = {
      approved:
        "border-green-200 bg-gradient-to-br from-green-50/50 to-transparent",
      pending:
        "border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-transparent",
      rejected:
        "border-red-200 bg-gradient-to-br from-red-50/50 to-transparent",
    };
    return (
      colors[status] ||
      "border-gray-200 bg-gradient-to-br from-gray-50/50 to-transparent"
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <BookOpen className="w-7 h-7 text-white" />
            </div>
            سندات القيد اليومية
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة وعرض جميع القيود المحاسبية اليومية
          </p>
        </div>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700">
          <Plus className="w-4 h-4" />
          قيد جديد
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="p-5 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي القيود 📚
              </p>
              <p className="text-3xl font-bold text-indigo-600">
                {totalEntries}
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                معتمد ✅
              </p>
              <p className="text-3xl font-bold text-green-600">
                {approvedEntries}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                قيد المراجعة ⏳
              </p>
              <p className="text-3xl font-bold text-yellow-600">
                {pendingEntries}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                متوازن ⚖️
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {balancedEntries}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي المدين
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {totalDebitAmount.toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي الدائن
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {totalCreditAmount.toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="بحث برقم القيد، الوصف، أو المستخدم..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue placeholder="الحالة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="approved">✅ معتمد</SelectItem>
              <SelectItem value="pending">⏳ قيد المراجعة</SelectItem>
              <SelectItem value="rejected">❌ مرفوض</SelectItem>
            </SelectContent>
          </Select>

          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 ml-2" />
              <SelectValue placeholder="الفترة الزمنية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">كل الفترات</SelectItem>
              <SelectItem value="today">📅 اليوم</SelectItem>
              <SelectItem value="week">�� هذا الأسبوع</SelectItem>
              <SelectItem value="month">🗓️ هذا الشهر</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Journal Entries Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredEntries.map((entry) => {
          const statusBadge = getStatusBadge(entry.status);
          const StatusIcon = statusBadge.icon;

          return (
            <Card
              key={entry.id}
              className={`p-5 border-2 ${getEntryCardColor(
                entry.status
              )} hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div
                    className={`w-14 h-14 ${
                      entry.status === "approved"
                        ? "bg-green-100 text-green-600"
                        : entry.status === "pending"
                        ? "bg-yellow-100 text-yellow-600"
                        : "bg-red-100 text-red-600"
                    } rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <StatusIcon className="w-7 h-7" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-lg font-bold text-gray-900">
                            {entry.entryNumber}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${statusBadge.color}`}
                          >
                            {statusBadge.label}
                          </span>
                          {entry.isBalanced && (
                            <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-100 text-blue-700 flex items-center gap-1">
                              <Scale className="w-3 h-3" />
                              متوازن
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-700 font-medium mb-2">
                          📝 {entry.description}
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4 text-gray-400" />
                            <span>
                              {new Date(entry.date).toLocaleDateString(
                                "ar-EG",
                                {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                }
                              )}
                            </span>
                          </div>
                          <span className="text-gray-400">•</span>
                          <span>بواسطة: {entry.createdBy}</span>
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              المدين
                            </div>
                            <div className="text-xl font-bold text-emerald-600">
                              {parseFloat(entry.totalDebit).toLocaleString(
                                "ar-EG"
                              )}{" "}
                              ج
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-gray-500 mb-1">
                              الدائن
                            </div>
                            <div className="text-xl font-bold text-purple-600">
                              {parseFloat(entry.totalCredit).toLocaleString(
                                "ar-EG"
                              )}{" "}
                              ج
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {entry.isBalanced && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex items-center gap-2 text-sm">
                          <div className="flex items-center gap-1 px-3 py-1 bg-blue-50 border border-blue-200 rounded">
                            <Scale className="w-4 h-4 text-blue-600" />
                            <span className="text-blue-900 font-medium">
                              القيد متوازن - الفرق: 0.00 ج
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className={`border-2 ${
                    entry.status === "approved"
                      ? "border-green-200 text-green-600"
                      : entry.status === "pending"
                      ? "border-yellow-200 text-yellow-600"
                      : "border-red-200 text-red-600"
                  } hover:bg-gray-50`}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredEntries.length === 0 && (
          <Card className="p-12 text-center border-2 border-dashed border-indigo-200">
            <BookOpen className="w-16 h-16 text-indigo-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery || statusFilter !== "all" || dateFilter !== "all"
                ? "لا توجد قيود تطابق معايير البحث"
                : "لا توجد قيود حتى الآن. ابدأ بإضافة قيد جديد!"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
