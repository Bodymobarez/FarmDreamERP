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
  ArrowDownCircle,
  ArrowUpCircle,
  Search,
  Phone,
  Mail,
  Hash,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter,
  CreditCard,
  Receipt,
  ShoppingCart,
  Wallet,
  Building2,
  User,
  FileText,
} from "lucide-react";
import { AddTransactionDialog } from "@/components/AddTransactionDialog";

interface Transaction {
  id: string;
  date: string;
  type: string;
  entityType: string;
  entityId: string;
  entityName: string;
  amount: string;
  paymentMethod: string;
  notes: string | null;
  reference: string | null;
  createdAt: string;
}

export default function Transactions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ["/api/transactions"],
  });

  // التصفية
  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.entityName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.reference?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.notes?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      typeFilter === "all" || transaction.type === typeFilter;
    
    const matchesPayment =
      paymentMethodFilter === "all" || 
      transaction.paymentMethod === paymentMethodFilter;

    return matchesSearch && matchesType && matchesPayment;
  });

  // الإحصائيات
  const totalPurchases = transactions
    .filter((t) => t.type === "purchase")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
  
  const totalSales = transactions
    .filter((t) => t.type === "sale")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
  
  const totalPayments = transactions
    .filter((t) => t.type === "payment")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);
  
  const totalReceipts = transactions
    .filter((t) => t.type === "receipt")
    .reduce((sum, t) => sum + parseFloat(t.amount || "0"), 0);

  const netCashFlow = totalSales + totalReceipts - totalPurchases - totalPayments;

  const getTransactionTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      purchase: "مشتريات",
      sale: "مبيعات",
      payment: "مدفوعات",
      receipt: "مقبوضات",
    };
    return types[type] || type;
  };

  const getTransactionTypeIcon = (type: string) => {
    const icons: Record<string, any> = {
      purchase: ShoppingCart,
      sale: DollarSign,
      payment: ArrowDownCircle,
      receipt: ArrowUpCircle,
    };
    return icons[type] || FileText;
  };

  const getTransactionTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; color: string }> = {
      purchase: { label: "مشتريات", color: "bg-red-100 text-red-700" },
      sale: { label: "مبيعات", color: "bg-green-100 text-green-700" },
      payment: { label: "مدفوعات", color: "bg-orange-100 text-orange-700" },
      receipt: { label: "مقبوضات", color: "bg-blue-100 text-blue-700" },
    };
    return badges[type] || { label: type, color: "bg-gray-100 text-gray-700" };
  };

  const getTransactionCardColor = (type: string) => {
    const colors: Record<string, string> = {
      purchase: "border-red-200 bg-gradient-to-br from-red-50/50 to-transparent",
      sale: "border-green-200 bg-gradient-to-br from-green-50/50 to-transparent",
      payment: "border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent",
      receipt: "border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent",
    };
    return colors[type] || "border-gray-200 bg-gradient-to-br from-gray-50/50 to-transparent";
  };

  const getTransactionIconColor = (type: string) => {
    const colors: Record<string, string> = {
      purchase: "bg-red-100 text-red-600",
      sale: "bg-green-100 text-green-600",
      payment: "bg-orange-100 text-orange-600",
      receipt: "bg-blue-100 text-blue-600",
    };
    return colors[type] || "bg-gray-100 text-gray-600";
  };

  const getPaymentMethodLabel = (method: string) => {
    const methods: Record<string, string> = {
      cash: "نقدي 💵",
      bank_transfer: "تحويل بنكي 🏦",
      check: "شيك 📝",
      credit_card: "بطاقة ائتمان 💳",
    };
    return methods[method] || method;
  };

  const getEntityIcon = (entityType: string) => {
    return entityType === "customer" ? User : Building2;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg">
              <Wallet className="w-7 h-7 text-white" />
            </div>
            المعاملات المالية
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة جميع المعاملات المالية (مشتريات - مبيعات - مدفوعات - مقبوضات)
          </p>
        </div>
        <AddTransactionDialog />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-5 border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي المشتريات 🛒
              </p>
              <p className="text-2xl font-bold text-red-600">
                {totalPurchases.toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي المبيعات 💰
              </p>
              <p className="text-2xl font-bold text-green-600">
                {totalSales.toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                المدفوعات 📤
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {totalPayments.toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <ArrowDownCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                المقبوضات 📥
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {totalReceipts.toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <ArrowUpCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className={`p-5 border-2 ${netCashFlow >= 0 ? 'border-emerald-200 bg-gradient-to-br from-emerald-50/50' : 'border-rose-200 bg-gradient-to-br from-rose-50/50'} to-transparent`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                صافي التدفق النقدي
              </p>
              <p className={`text-2xl font-bold ${netCashFlow >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                {Math.abs(netCashFlow).toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className={`w-12 h-12 ${netCashFlow >= 0 ? 'bg-emerald-100' : 'bg-rose-100'} rounded-lg flex items-center justify-center`}>
              {netCashFlow >= 0 ? (
                <TrendingUp className="w-6 h-6 text-emerald-600" />
              ) : (
                <TrendingDown className="w-6 h-6 text-rose-600" />
              )}
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
                placeholder="بحث بالجهة، المرجع، أو الملاحظات..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue placeholder="نوع المعاملة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأنواع</SelectItem>
              <SelectItem value="purchase">🛒 مشتريات</SelectItem>
              <SelectItem value="sale">💰 مبيعات</SelectItem>
              <SelectItem value="payment">📤 مدفوعات</SelectItem>
              <SelectItem value="receipt">📥 مقبوضات</SelectItem>
            </SelectContent>
          </Select>

          <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
            <SelectTrigger className="w-[180px]">
              <CreditCard className="w-4 h-4 ml-2" />
              <SelectValue placeholder="طريقة الدفع" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الطرق</SelectItem>
              <SelectItem value="cash">💵 نقدي</SelectItem>
              <SelectItem value="bank_transfer">🏦 تحويل بنكي</SelectItem>
              <SelectItem value="check">📝 شيك</SelectItem>
              <SelectItem value="credit_card">💳 بطاقة ائتمان</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Transactions Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredTransactions.map((transaction) => {
          const badge = getTransactionTypeBadge(transaction.type);
          const Icon = getTransactionTypeIcon(transaction.type);
          const EntityIcon = getEntityIcon(transaction.entityType);

          return (
            <Card
              key={transaction.id}
              className={`p-5 border-2 ${getTransactionCardColor(transaction.type)} hover:shadow-lg transition-all duration-300`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className={`w-14 h-14 ${getTransactionIconColor(transaction.type)} rounded-lg flex items-center justify-center flex-shrink-0`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-lg font-bold text-gray-900">
                            {transaction.reference || `TRX-${transaction.id}`}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${badge.color}`}
                          >
                            {badge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <EntityIcon className="w-4 h-4 text-gray-400" />
                          <span>{transaction.entityName}</span>
                          <span className="text-gray-400">•</span>
                          <span className="text-gray-500">
                            {transaction.entityType === "customer" ? "عميل" : "مورد"}
                          </span>
                        </div>
                      </div>

                      <div className="text-left">
                        <div className={`text-3xl font-bold ${
                          transaction.type === "purchase" || transaction.type === "payment" 
                            ? "text-red-600" 
                            : "text-green-600"
                        }`}>
                          {transaction.type === "purchase" || transaction.type === "payment" ? "-" : "+"}
                          {parseFloat(transaction.amount || "0").toLocaleString("ar-EG")} ج
                        </div>
                        <div className="text-xs text-gray-500 text-right mt-1">
                          {getPaymentMethodLabel(transaction.paymentMethod)}
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(transaction.date).toLocaleDateString("ar-EG", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 text-sm">
                        <CreditCard className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 font-medium">
                          {getPaymentMethodLabel(transaction.paymentMethod)}
                        </span>
                      </div>

                      {transaction.notes && (
                        <div className="col-span-2 mt-2 pt-3 border-t border-gray-200">
                          <div className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded p-2">
                            <span className="text-amber-600">📝</span>
                            <span className="text-amber-900">
                              {transaction.notes}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  className={`border-2 ${
                    transaction.type === "purchase"
                      ? "border-red-200 text-red-600"
                      : transaction.type === "sale"
                      ? "border-green-200 text-green-600"
                      : transaction.type === "payment"
                      ? "border-orange-200 text-orange-600"
                      : "border-blue-200 text-blue-600"
                  } hover:bg-gray-50`}
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredTransactions.length === 0 && (
          <Card className="p-12 text-center border-2 border-dashed border-cyan-200">
            <Wallet className="w-16 h-16 text-cyan-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery || typeFilter !== "all" || paymentMethodFilter !== "all"
                ? "لا توجد معاملات تطابق معايير البحث"
                : "لا توجد معاملات حتى الآن. ابدأ بإضافة معاملة جديدة!"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
