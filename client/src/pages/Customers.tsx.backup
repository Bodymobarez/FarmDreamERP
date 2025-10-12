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
  Printer,
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
    <div className="p-6 space-y-6">;
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

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي العملاء</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرصيد الإجمالي</CardTitle>
            <FileText className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {totalBalance.toLocaleString()} ج
            </div>
            <p className="text-xs text-muted-foreground">دائن</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">عملاء نشطين</CardTitle>
            <UserPlus className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">لديهم رصيد إيجابي</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن عميل..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredCustomers.map((customer) => (
          <Card key={customer.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <UserPlus className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{customer.name}</CardTitle>
                    {customer.taxNumber && (
                      <p className="text-sm text-muted-foreground">
                        ض.ر: {customer.taxNumber}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={parseFloat(customer.balance || 0) >= 0 ? "default" : "destructive"}>
                  {Math.abs(parseFloat(customer.balance || 0)).toLocaleString()} ج
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {customer.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.phone}</span>
                </div>
              )}
              {customer.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{customer.address}</span>
                </div>
              )}
              {customer.notes && (
                <p className="text-sm text-muted-foreground border-t pt-3">
                  {customer.notes}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsStatementOpen(true);
                  }}
                >
                  <Receipt className="h-4 w-4" />
                  كشف حساب
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => {
                    setSelectedCustomer(customer);
                    setIsEditOpen(true);
                  }}
                >
                  <Edit className="h-4 w-4" />
                  تعديل
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredCustomers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <UserPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "لا توجد نتائج" : "لا يوجد عملاء"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "جرب البحث بكلمات أخرى" : "ابدأ بإضافة عميل جديد"}
            </p>
            {!searchQuery && <AddCustomerDialog />}
          </CardContent>
        </Card>
      )}

      {/* Statement Dialog */}
      <Dialog open={isStatementOpen} onOpenChange={setIsStatementOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">كشف حساب - {selectedCustomer?.name}</DialogTitle>
            <DialogDescription>
              عرض جميع المعاملات والحركات المالية
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* Summary */}
            <div className="grid grid-cols-3 gap-4">
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">الرصيد الحالي</div>
                  <div className="text-2xl font-bold">
                    {parseFloat(selectedCustomer?.balance || 0).toLocaleString()} ج
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">عدد المعاملات</div>
                  <div className="text-2xl font-bold">{customerTransactions.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <Button onClick={handleExportStatement} className="w-full gap-2">
                    <Download className="h-4 w-4" />
                    تصدير PDF
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Transactions Table */}
            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>التاريخ</TableHead>
                      <TableHead>النوع</TableHead>
                      <TableHead>المبلغ</TableHead>
                      <TableHead>طريقة الدفع</TableHead>
                      <TableHead>الوصف</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {customerTransactions.length > 0 ? (
                      customerTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.transactionDate).toLocaleDateString("ar-EG")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.transactionType === "payment" ? "دفعة" : 
                               transaction.transactionType === "sale" ? "بيع" : 
                               transaction.transactionType}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">
                            {parseFloat(transaction.amount).toLocaleString()} ج
                          </TableCell>
                          <TableCell>{transaction.paymentMethod || "-"}</TableCell>
                          <TableCell className="max-w-xs truncate">
                            {transaction.description || "-"}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          لا توجد معاملات
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>تعديل بيانات العميل</DialogTitle>
            <DialogDescription>قم بتعديل المعلومات المطلوبة</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedCustomer?.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={selectedCustomer?.phone}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={selectedCustomer?.email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                name="address"
                defaultValue={selectedCustomer?.address}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxNumber">الرقم الضريبي</Label>
              <Input
                id="taxNumber"
                name="taxNumber"
                defaultValue={selectedCustomer?.taxNumber}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={selectedCustomer?.notes}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsEditOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={updateCustomerMutation.isPending}>
                {updateCustomerMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
