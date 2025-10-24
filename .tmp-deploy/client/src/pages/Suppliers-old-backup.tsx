import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Search, Phone, Mail, MapPin, FileText, Edit, Receipt, Download } from "lucide-react";
import { AddSupplierDialog } from "../components/AddSupplierDialog";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF } from "@/lib/exportUtils";

export default function Suppliers() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [isStatementOpen, setIsStatementOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Fetch suppliers
  const { data: suppliersData, refetch } = useQuery({
    queryKey: ["/api/suppliers"],
  });
  const suppliers = (suppliersData as any[]) || [];

  // Fetch transactions for statement
  const { data: transactionsData } = useQuery({
    queryKey: ["/api/transactions"],
    enabled: isStatementOpen && !!selectedSupplier,
  });
  const transactions = (transactionsData as any[]) || [];

  // Filter supplier transactions
  const supplierTransactions = transactions.filter(
    (t) => t.relatedType === "supplier" && t.relatedId === selectedSupplier?.id
  );

  // Update supplier mutation
  const updateSupplierMutation = useMutation({
    mutationFn: async (values: any) => {
      const response = await fetch(`/api/suppliers/${selectedSupplier.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("فشل في تحديث البيانات");
      return response.json();
    },
    onSuccess: () => {
      toast({ title: "تم بنجاح!", description: "تم تحديث بيانات المورد" });
      refetch();
      setIsEditOpen(false);
    },
    onError: () => {
      toast({ title: "خطأ", description: "فشل في تحديث البيانات", variant: "destructive" });
    },
  });

  // Search filter
  const filteredSuppliers = suppliers.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.phone?.includes(searchQuery) ||
    s.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalBalance = suppliers.reduce((sum, s) => sum + parseFloat(s.balance || 0), 0);

  const handleEditSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateSupplierMutation.mutate({
      name: formData.get("name"),
      phone: formData.get("phone"),
      email: formData.get("email"),
      address: formData.get("address"),
      taxNumber: formData.get("taxNumber"),
      notes: formData.get("notes"),
    });
  };

  const handleExportStatement = () => {
    const headers = ["التاريخ", "النوع", "المبلغ", "طريقة الدفع", "الوصف"];
    const data = supplierTransactions.map(t => [
      new Date(t.transactionDate).toLocaleDateString("ar-EG"),
      t.transactionType === "payment" ? "دفعة" : t.transactionType === "purchase" ? "شراء" : t.transactionType,
      `${parseFloat(t.amount).toLocaleString()} ج`,
      t.paymentMethod || "-",
      t.description || "-"
    ]);
    
    exportToPDF(
      `كشف حساب - ${selectedSupplier?.name}`,
      headers,
      data,
      `supplier_statement_${selectedSupplier?.id}.pdf`
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">إدارة الموردين</h1>
          <p className="text-muted-foreground mt-1">
            إدارة بيانات الموردين وحساباتهم
          </p>
        </div>
        <AddSupplierDialog />
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الموردين</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرصيد الإجمالي</CardTitle>
            <FileText className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {Math.abs(totalBalance).toLocaleString()} ج
            </div>
            <p className="text-xs text-muted-foreground">مدين</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">موردين نشطين</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{suppliers.length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن مورد..."
              className="pr-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Suppliers List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredSuppliers.map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    {supplier.taxNumber && (
                      <p className="text-sm text-muted-foreground">
                        ض.ر: {supplier.taxNumber}
                      </p>
                    )}
                  </div>
                </div>
                <Badge variant={parseFloat(supplier.balance || 0) < 0 ? "destructive" : "default"}>
                  {Math.abs(parseFloat(supplier.balance || 0)).toLocaleString()} ج
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {supplier.phone && (
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.phone}</span>
                </div>
              )}
              {supplier.email && (
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.email}</span>
                </div>
              )}
              {supplier.address && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.address}</span>
                </div>
              )}
              {supplier.notes && (
                <p className="text-sm text-muted-foreground border-t pt-3">
                  {supplier.notes}
                </p>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1"
                  onClick={() => {
                    setSelectedSupplier(supplier);
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
                    setSelectedSupplier(supplier);
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

      {filteredSuppliers.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchQuery ? "لا توجد نتائج" : "لا يوجد موردين"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery ? "جرب البحث بكلمات أخرى" : "ابدأ بإضافة مورد جديد"}
            </p>
            {!searchQuery && <AddSupplierDialog />}
          </CardContent>
        </Card>
      )}

      {/* Statement Dialog */}
      <Dialog open={isStatementOpen} onOpenChange={setIsStatementOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">كشف حساب - {selectedSupplier?.name}</DialogTitle>
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
                  <div className="text-2xl font-bold text-red-600">
                    {Math.abs(parseFloat(selectedSupplier?.balance || 0)).toLocaleString()} ج
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="pt-4">
                  <div className="text-sm text-muted-foreground">عدد المعاملات</div>
                  <div className="text-2xl font-bold">{supplierTransactions.length}</div>
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
                    {supplierTransactions.length > 0 ? (
                      supplierTransactions.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell>
                            {new Date(transaction.transactionDate).toLocaleDateString("ar-EG")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {transaction.transactionType === "payment" ? "دفعة" : 
                               transaction.transactionType === "purchase" ? "شراء" : 
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
            <DialogTitle>تعديل بيانات المورد</DialogTitle>
            <DialogDescription>قم بتعديل المعلومات المطلوبة</DialogDescription>
          </DialogHeader>

          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">الاسم *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={selectedSupplier?.name}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">رقم الهاتف</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={selectedSupplier?.phone}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">البريد الإلكتروني</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={selectedSupplier?.email}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">العنوان</Label>
              <Input
                id="address"
                name="address"
                defaultValue={selectedSupplier?.address}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="taxNumber">الرقم الضريبي</Label>
              <Input
                id="taxNumber"
                name="taxNumber"
                defaultValue={selectedSupplier?.taxNumber}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={selectedSupplier?.notes}
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
              <Button type="submit" disabled={updateSupplierMutation.isPending}>
                {updateSupplierMutation.isPending ? "جاري الحفظ..." : "حفظ التعديلات"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
