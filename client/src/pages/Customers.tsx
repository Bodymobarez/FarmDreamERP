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
  UserPlus,
  Search,
  Phone,
  Mail,
  MapPin,
  FileText,
  Hash,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Filter,
} from "lucide-react";
import { AddCustomerDialog } from "@/components/AddCustomerDialog";

interface Customer {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  taxNumber: string | null;
  balance: string;
  notes: string | null;
  totalPurchases?: string;
  lastPurchaseDate?: string;
  createdAt: string;
}

export default function Customers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: customers = [] } = useQuery<Customer[]>({
    queryKey: ["/api/customers"],
  });

  // التصفية
  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const balance = parseFloat(customer.balance || "0");
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && balance > 0) ||
      (statusFilter === "zero" && balance === 0) ||
      (statusFilter === "negative" && balance < 0);

    return matchesSearch && matchesStatus;
  });

  // الإحصائيات
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    (c) => parseFloat(c.balance || "0") > 0
  ).length;
  const totalBalance = customers.reduce(
    (sum, c) => sum + parseFloat(c.balance || "0"),
    0
  );
  const totalPurchases = customers.reduce(
    (sum, c) => sum + parseFloat(c.totalPurchases || "0"),
    0
  );

  const getBalanceColor = (balance: string) => {
    const num = parseFloat(balance || "0");
    if (num > 0) return "text-green-600";
    if (num < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getStatusBadge = (balance: string) => {
    const num = parseFloat(balance || "0");
    if (num > 0) return { label: "دائن", color: "bg-green-100 text-green-700" };
    if (num < 0) return { label: "مدين", color: "bg-red-100 text-red-700" };
    return { label: "متصفر", color: "bg-gray-100 text-gray-700" };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
              <UserPlus className="w-7 h-7 text-white" />
            </div>
            إدارة العملاء
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة بيانات العملاء وحساباتهم المالية
          </p>
        </div>
        <AddCustomerDialog />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي العملاء
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {totalCustomers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <UserPlus className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                عملاء نشطين 🟢
              </p>
              <p className="text-3xl font-bold text-green-600">
                {activeCustomers}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                الرصيد الإجمالي 💰
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {totalBalance.toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي المشتريات 📊
              </p>
              <p className="text-2xl font-bold text-purple-600">
                {totalPurchases.toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="بحث بالاسم، الهاتف، أو البريد الإلكتروني..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 ml-2" />
              <SelectValue placeholder="حالة الحساب" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">🟢 دائن</SelectItem>
              <SelectItem value="zero">⚪ متصفر</SelectItem>
              <SelectItem value="negative">🔴 مدين</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredCustomers.map((customer) => {
          const status = getStatusBadge(customer.balance);

          return (
            <Card
              key={customer.id}
              className="p-5 border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <UserPlus className="w-7 h-7 text-green-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-lg font-bold text-green-900">
                            {customer.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        {customer.taxNumber && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">ض.ر:</span>{" "}
                            {customer.taxNumber}
                          </div>
                        )}
                      </div>

                      <div className="text-left">
                        <div
                          className={`text-2xl font-bold ${getBalanceColor(
                            customer.balance
                          )}`}
                        >
                          {Math.abs(
                            parseFloat(customer.balance || "0")
                          ).toLocaleString("ar-EG")}{" "}
                          ج
                        </div>
                        <div className="text-xs text-gray-500">الرصيد</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {customer.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{customer.phone}</span>
                        </div>
                      )}

                      {customer.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{customer.email}</span>
                        </div>
                      )}

                      {customer.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{customer.address}</span>
                        </div>
                      )}

                      {customer.totalPurchases && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            مشتريات:{" "}
                            <span className="font-semibold text-gray-900">
                              {parseFloat(
                                customer.totalPurchases
                              ).toLocaleString("ar-EG")}{" "}
                              ج
                            </span>
                          </span>
                        </div>
                      )}

                      {customer.lastPurchaseDate && (
                        <div className="flex items-center gap-2 text-sm col-span-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            آخر شراء:{" "}
                            {new Date(
                              customer.lastPurchaseDate
                            ).toLocaleDateString("ar-EG")}
                          </span>
                        </div>
                      )}

                      {customer.notes && (
                        <div className="col-span-2 mt-2 pt-3 border-t border-green-200">
                          <div className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded p-2">
                            <span className="text-amber-600">📝</span>
                            <span className="text-amber-900">
                              {customer.notes}
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
                  className="border-2 border-green-200 text-green-600 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredCustomers.length === 0 && (
          <Card className="p-12 text-center border-2 border-dashed border-green-200">
            <UserPlus className="w-16 h-16 text-green-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery || statusFilter !== "all"
                ? "لا توجد عملاء تطابق معايير البحث"
                : "لا يوجد عملاء حتى الآن. ابدأ بإضافة عميل جديد!"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
