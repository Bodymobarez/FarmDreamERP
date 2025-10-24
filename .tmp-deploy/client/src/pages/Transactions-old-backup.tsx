import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Download,
  Filter,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Receipt,
  CreditCard,
  Banknote,
  FileText,
  FileSpreadsheet,
} from "lucide-react";
import { AddTransactionDialog } from "../components/AddTransactionDialog";
import { exportToPDF, exportToExcel, exportToCSV } from "@/lib/exportUtils";

export default function Transactions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState<string>("all");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  // Mock data - replace with API call
  const transactions = [
    {
      id: 1,
      date: "2024-01-15",
      type: "purchase",
      entityType: "supplier",
      entityName: "مورد الأعلاف الذهبية",
      amount: 15000,
      paymentMethod: "bank_transfer",
      notes: "شراء علف للدفعة الجديدة",
      status: "completed",
    },
    {
      id: 2,
      date: "2024-01-14",
      type: "sale",
      entityType: "customer",
      entityName: "عميل المزرعة الكبرى",
      amount: 45000,
      paymentMethod: "cash",
      notes: "بيع 15 رأس ماشية",
      status: "completed",
    },
    {
      id: 3,
      date: "2024-01-13",
      type: "payment",
      entityType: "supplier",
      entityName: "مورد الأدوية البيطرية",
      amount: 8500,
      paymentMethod: "check",
      notes: "سداد مستحقات شهر ديسمبر",
      status: "pending",
    },
    {
      id: 4,
      date: "2024-01-12",
      type: "receipt",
      entityType: "customer",
      entityName: "مزرعة النور",
      amount: 12000,
      paymentMethod: "bank_transfer",
      notes: "تحصيل من بيع سابق",
      status: "completed",
    },
    {
      id: 5,
      date: "2024-01-11",
      type: "purchase",
      entityType: "supplier",
      entityName: "مورد المعدات الزراعية",
      amount: 25000,
      paymentMethod: "installment",
      notes: "شراء معدات جديدة - قسط أول",
      status: "completed",
    },
  ];

  const statistics = [
    {
      title: "إجمالي المشتريات",
      value: "48,500 جنيه",
      change: "+12%",
      trend: "up",
      icon: TrendingUp,
      color: "text-red-500",
    },
    {
      title: "إجمالي المبيعات",
      value: "57,000 جنيه",
      change: "+8%",
      trend: "up",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "المدفوعات",
      value: "8,500 جنيه",
      change: "-5%",
      trend: "down",
      icon: DollarSign,
      color: "text-orange-500",
    },
    {
      title: "المقبوضات",
      value: "12,000 جنيه",
      change: "+15%",
      trend: "up",
      icon: Receipt,
      color: "text-blue-500",
    },
  ];

  const getTransactionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      purchase: "مشتريات",
      sale: "مبيعات",
      payment: "مدفوعات",
      receipt: "مقبوضات",
    };
    return types[type] || type;
  };

  const getTransactionTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      purchase: "bg-red-100 text-red-800",
      sale: "bg-green-100 text-green-800",
      payment: "bg-orange-100 text-orange-800",
      receipt: "bg-blue-100 text-blue-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cash: "نقدي",
      bank_transfer: "تحويل بنكي",
      check: "شيك",
      installment: "تقسيط",
    };
    return methods[method] || method;
  };

  const getStatusLabel = (status: string) => {
    return status === "completed" ? "مكتملة" : "قيد الانتظار";
  };

  const getStatusColor = (status: string) => {
    return status === "completed"
      ? "bg-green-100 text-green-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.entityName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.notes.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterType === "all" || transaction.type === filterType;
    return matchesSearch && matchesFilter;
  });

  // Export handlers
  const handleExportPDF = () => {
    const headers = [
      "التاريخ",
      "النوع",
      "الجهة",
      "المبلغ",
      "طريقة الدفع",
      "الحالة",
      "ملاحظات",
    ];
    const data = filteredTransactions.map((t) => [
      new Date(t.date).toLocaleDateString("ar-EG"),
      getTransactionTypeLabel(t.type),
      t.entityName,
      `${t.amount.toLocaleString()} جنيه`,
      getPaymentMethodLabel(t.paymentMethod),
      getStatusLabel(t.status),
      t.notes || "-",
    ]);
    exportToPDF("المعاملات المالية", headers, data, "transactions.pdf");
  };

  const handleExportExcel = () => {
    const headers = [
      "التاريخ",
      "النوع",
      "الجهة",
      "المبلغ",
      "طريقة الدفع",
      "الحالة",
      "ملاحظات",
    ];
    const data = filteredTransactions.map((t) => [
      new Date(t.date).toLocaleDateString("ar-EG"),
      getTransactionTypeLabel(t.type),
      t.entityName,
      `${t.amount.toLocaleString()} جنيه`,
      getPaymentMethodLabel(t.paymentMethod),
      getStatusLabel(t.status),
      t.notes || "-",
    ]);
    exportToExcel("المعاملات المالية", headers, data, "transactions.xlsx");
  };

  const handleExportCSV = () => {
    const headers = [
      "التاريخ",
      "النوع",
      "الجهة",
      "المبلغ",
      "طريقة الدفع",
      "الحالة",
      "ملاحظات",
    ];
    const data = filteredTransactions.map((t) => [
      new Date(t.date).toLocaleDateString("ar-EG"),
      getTransactionTypeLabel(t.type),
      t.entityName,
      `${t.amount.toLocaleString()} جنيه`,
      getPaymentMethodLabel(t.paymentMethod),
      getStatusLabel(t.status),
      t.notes || "-",
    ]);
    exportToCSV(headers, data, "transactions.csv");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            المعاملات المالية
          </h1>
          <p className="text-gray-600">
            إدارة جميع المعاملات المالية (مشتريات - مبيعات - مدفوعات - مقبوضات)
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <FileSpreadsheet className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button
            className="gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            إضافة معاملة
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statistics.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <div className="flex items-center gap-1 mt-2">
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                    <span className={`text-sm font-medium ${stat.color}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`p-3 rounded-lg bg-gray-100`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="البحث في المعاملات..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-[200px]">
                <Filter className="h-4 w-4 ml-2" />
                <SelectValue placeholder="نوع المعاملة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع المعاملات</SelectItem>
                <SelectItem value="purchase">مشتريات</SelectItem>
                <SelectItem value="sale">مبيعات</SelectItem>
                <SelectItem value="payment">مدفوعات</SelectItem>
                <SelectItem value="receipt">مقبوضات</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجل المعاملات</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">التاريخ</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">الجهة</TableHead>
                  <TableHead className="text-right">المبلغ</TableHead>
                  <TableHead className="text-right">طريقة الدفع</TableHead>
                  <TableHead className="text-right">الحالة</TableHead>
                  <TableHead className="text-right">ملاحظات</TableHead>
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-medium">
                      {new Date(transaction.date).toLocaleDateString("ar-EG")}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={getTransactionTypeColor(transaction.type)}
                      >
                        {getTransactionTypeLabel(transaction.type)}
                      </Badge>
                    </TableCell>
                    <TableCell>{transaction.entityName}</TableCell>
                    <TableCell className="font-bold">
                      {transaction.amount.toLocaleString()} جنيه
                    </TableCell>
                    <TableCell>
                      {getPaymentMethodLabel(transaction.paymentMethod)}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(transaction.status)}>
                        {getStatusLabel(transaction.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {transaction.notes}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm">
                          عرض
                        </Button>
                        <Button variant="ghost" size="sm">
                          طباعة
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Transaction Dialog */}
      <AddTransactionDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
