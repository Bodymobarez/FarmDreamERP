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
  Truck,
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
import { AddSupplierDialog } from "@/components/AddSupplierDialog";

interface Supplier {
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

export default function Suppliers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: suppliers = [] } = useQuery<Supplier[]>({
    queryKey: ["/api/suppliers"],
  });

  // التصفية
  const filteredSuppliers = suppliers.filter((supplier) => {
    const matchesSearch =
      supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.phone?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      supplier.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const balance = parseFloat(supplier.balance || "0");
    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && balance > 0) ||
      (statusFilter === "zero" && balance === 0) ||
      (statusFilter === "negative" && balance < 0);

    return matchesSearch && matchesStatus;
  });

  // الإحصائيات
  const totalSuppliers = suppliers.length;
  const activeSuppliers = suppliers.filter(
    (s) => parseFloat(s.balance || "0") > 0
  ).length;
  const totalBalance = suppliers.reduce(
    (sum, s) => sum + parseFloat(s.balance || "0"),
    0
  );
  const totalPurchases = suppliers.reduce(
    (sum, s) => sum + parseFloat(s.totalPurchases || "0"),
    0
  );

  const getBalanceColor = (balance: string) => {
    const num = parseFloat(balance || "0");
    if (num > 0) return "text-purple-600";
    if (num < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getStatusBadge = (balance: string) => {
    const num = parseFloat(balance || "0");
    if (num > 0) return { label: "دائن", color: "bg-purple-100 text-purple-700" };
    if (num < 0) return { label: "مدين", color: "bg-red-100 text-red-700" };
    return { label: "متصفر", color: "bg-gray-100 text-gray-700" };
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Truck className="w-7 h-7 text-white" />
            </div>
            إدارة الموردين
          </h1>
          <p className="text-gray-600 mt-2">
            إدارة بيانات الموردين وحساباتهم المالية
          </p>
        </div>
        <AddSupplierDialog />
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي الموردين
              </p>
              <p className="text-3xl font-bold text-blue-600">
                {totalSuppliers}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Truck className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                موردين نشطين 🟣
              </p>
              <p className="text-3xl font-bold text-purple-600">
                {activeSuppliers}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                الرصيد الإجمالي 💰
              </p>
              <p className="text-2xl font-bold text-indigo-600">
                {totalBalance.toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-indigo-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-violet-200 bg-gradient-to-br from-violet-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي المشتريات 📊
              </p>
              <p className="text-2xl font-bold text-violet-600">
                {totalPurchases.toLocaleString("ar-EG")} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-violet-600" />
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
              <SelectItem value="active">🟣 دائن</SelectItem>
              <SelectItem value="zero">⚪ متصفر</SelectItem>
              <SelectItem value="negative">🔴 مدين</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 gap-4">
        {filteredSuppliers.map((supplier) => {
          const status = getStatusBadge(supplier.balance);

          return (
            <Card
              key={supplier.id}
              className="p-5 border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Truck className="w-7 h-7 text-purple-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-lg font-bold text-purple-900">
                            {supplier.name}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </div>
                        {supplier.taxNumber && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">ض.ر:</span>{" "}
                            {supplier.taxNumber}
                          </div>
                        )}
                      </div>

                      <div className="text-left">
                        <div
                          className={`text-2xl font-bold ${getBalanceColor(
                            supplier.balance
                          )}`}
                        >
                          {Math.abs(
                            parseFloat(supplier.balance || "0")
                          ).toLocaleString("ar-EG")}{" "}
                          ج
                        </div>
                        <div className="text-xs text-gray-500">الرصيد</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      {supplier.phone && (
                        <div className="flex items-center gap-2 text-sm">
                          <Phone className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{supplier.phone}</span>
                        </div>
                      )}

                      {supplier.email && (
                        <div className="flex items-center gap-2 text-sm">
                          <Mail className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{supplier.email}</span>
                        </div>
                      )}

                      {supplier.address && (
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-900">{supplier.address}</span>
                        </div>
                      )}

                      {supplier.totalPurchases && (
                        <div className="flex items-center gap-2 text-sm">
                          <DollarSign className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            مشتريات:{" "}
                            <span className="font-semibold text-gray-900">
                              {parseFloat(
                                supplier.totalPurchases
                              ).toLocaleString("ar-EG")}{" "}
                              ج
                            </span>
                          </span>
                        </div>
                      )}

                      {supplier.lastPurchaseDate && (
                        <div className="flex items-center gap-2 text-sm col-span-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <span className="text-gray-600">
                            آخر شراء:{" "}
                            {new Date(
                              supplier.lastPurchaseDate
                            ).toLocaleDateString("ar-EG")}
                          </span>
                        </div>
                      )}

                      {supplier.notes && (
                        <div className="col-span-2 mt-2 pt-3 border-t border-purple-200">
                          <div className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded p-2">
                            <span className="text-amber-600">📝</span>
                            <span className="text-amber-900">
                              {supplier.notes}
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
                  className="border-2 border-purple-200 text-purple-600 hover:bg-gray-50"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          );
        })}

        {filteredSuppliers.length === 0 && (
          <Card className="p-12 text-center border-2 border-dashed border-purple-200">
            <Truck className="w-16 h-16 text-purple-200 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {searchQuery || statusFilter !== "all"
                ? "لا يوجد موردين يطابقون معايير البحث"
                : "لا يوجد موردين حتى الآن. ابدأ بإضافة مورد جديد!"}
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}
