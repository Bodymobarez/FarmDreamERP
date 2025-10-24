import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
  TrendingUp,
  TrendingDown,
  DollarSign,
  Beef,
  Package,
  Activity,
  FileText,
  Download,
  Eye,
} from "lucide-react";
import { exportToPDF, exportToExcel, exportToCSV } from "@/lib/exportUtils";

type ViewLevel = "all" | "batch" | "animal";

interface CostItem {
  id: string;
  name: string;
  type: "animal" | "batch";
  purchaseCost: number;
  feedCost: number;
  treatmentCost: number;
  otherCost: number;
  totalCost: number;
  batch?: string;
  status?: string;
  totalAnimals?: number;
  soldAnimals?: number;
}

export default function CostCenter() {
  const queryClient = useQueryClient();
  const [viewLevel, setViewLevel] = useState<ViewLevel>("all");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedAnimal, setSelectedAnimal] = useState<string>("");
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Fetch data
  const { data: batches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  const { data: expenses = [] } = useQuery<any[]>({
    queryKey: ["/api/batch-expenses"],
  });

  // Get filtered data based on view level
  const getFilteredData = () => {
    if (viewLevel === "animal" && selectedAnimal) {
      const animal = animals.find((a: any) => a.id === selectedAnimal);
      if (!animal) return [];
      
      return [{
        id: animal.id,
        name: `رقم الأذن: ${animal.earTag}`,
        type: "animal",
        purchaseCost: parseFloat(animal.purchaseCost || "0"),
        feedCost: parseFloat(animal.accumulatedFeedCost || "0"),
        treatmentCost: parseFloat(animal.accumulatedTreatmentCost || "0"),
        otherCost: parseFloat(animal.accumulatedOtherCost || "0"),
        totalCost: parseFloat(animal.totalCost || "0"),
        batch: animal.batchId,
        status: animal.status,
      }];
    }

    if (viewLevel === "batch" && selectedBatch) {
      const batch = batches.find((b: any) => b.id === selectedBatch);
      if (!batch) return [];
      
      return [{
        id: batch.id,
        name: batch.batchName,
        type: "batch",
        purchaseCost: parseFloat(batch.purchaseCost || "0"),
        feedCost: parseFloat(batch.feedCost || "0"),
        treatmentCost: parseFloat(batch.treatmentCost || "0"),
        otherCost: parseFloat(batch.otherExpenses || "0"),
        totalCost: parseFloat(batch.totalCost || "0"),
        totalAnimals: parseInt(batch.totalAnimals || "0"),
        soldAnimals: parseInt(batch.soldAnimals || "0"),
        status: batch.status,
      }];
    }

    // All batches view
    return batches.map((batch: any) => ({
      id: batch.id,
      name: batch.batchName,
      type: "batch",
      purchaseCost: parseFloat(batch.purchaseCost || "0"),
      feedCost: parseFloat(batch.feedCost || "0"),
      treatmentCost: parseFloat(batch.treatmentCost || "0"),
      otherCost: parseFloat(batch.otherExpenses || "0"),
      totalCost: parseFloat(batch.totalCost || "0"),
      totalAnimals: parseInt(batch.totalAnimals || "0"),
      soldAnimals: parseInt(batch.soldAnimals || "0"),
      status: batch.status,
    }));
  };

  const filteredData: any[] = getFilteredData();

  // Calculate statistics
  const stats = {
    totalCost: filteredData.reduce((sum: number, item: any) => sum + item.totalCost, 0),
    totalFeedCost: filteredData.reduce((sum: number, item: any) => sum + item.feedCost, 0),
    totalTreatmentCost: filteredData.reduce((sum: number, item: any) => sum + item.treatmentCost, 0),
    totalOtherCost: filteredData.reduce((sum: number, item: any) => sum + item.otherCost, 0),
    avgCostPerItem: filteredData.length > 0 
      ? filteredData.reduce((sum: number, item: any) => sum + item.totalCost, 0) / filteredData.length 
      : 0,
  };

  // Add expense mutation
  const addExpenseMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/batch-expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to add expense");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/batch-expenses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/batches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      setIsExpenseDialogOpen(false);
    },
  });

  // Handle form submit
  const handleAddExpense = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    const data = {
      batchId: viewLevel === "batch" ? selectedBatch : formData.get("batchId"),
      animalId: viewLevel === "animal" ? selectedAnimal : null,
      expenseDate: new Date(formData.get("expenseDate") as string),
      expenseType: formData.get("expenseType"),
      description: formData.get("description"),
      amount: formData.get("amount"),
      quantity: formData.get("quantity") || null,
      unitPrice: formData.get("unitPrice") || null,
      paymentMethod: formData.get("paymentMethod"),
      notes: formData.get("notes"),
    };

    addExpenseMutation.mutate(data);
  };

  // Get expenses for selected item
  const getExpensesForItem = () => {
    if (!selectedItem) return [];
    
    if (selectedItem.type === "animal") {
      return expenses.filter((exp: any) => {
        const animal = animals.find((a: any) => a.id === selectedItem.id);
        return animal && exp.batchId === animal.batchId;
      });
    }
    
    return expenses.filter((exp: any) => exp.batchId === selectedItem.id);
  };

  const itemExpenses = getExpensesForItem();

  // Export handlers
  const handleExportPDF = () => {
    const headers = [
      "الاسم",
      "النوع",
      "تكلفة الشراء",
      "تكلفة الأعلاف",
      "تكلفة العلاج",
      "تكاليف أخرى",
      "الإجمالي",
    ];
    const data = filteredData.map((item: any) => [
      item.name,
      item.type === "animal" ? "حيوان" : "دفعة",
      `${item.purchaseCost.toLocaleString()} ج`,
      `${item.feedCost.toLocaleString()} ج`,
      `${item.treatmentCost.toLocaleString()} ج`,
      `${item.otherCost.toLocaleString()} ج`,
      `${item.totalCost.toLocaleString()} ج`,
    ]);
    exportToPDF("تقرير مركز التكلفة", headers, data, "cost-center.pdf");
  };

  const handleExportExcel = () => {
    const headers = [
      "الاسم",
      "النوع",
      "تكلفة الشراء",
      "تكلفة الأعلاف",
      "تكلفة العلاج",
      "تكاليف أخرى",
      "الإجمالي",
    ];
    const data = filteredData.map((item: any) => [
      item.name,
      item.type === "animal" ? "حيوان" : "دفعة",
      `${item.purchaseCost.toLocaleString()} ج`,
      `${item.feedCost.toLocaleString()} ج`,
      `${item.treatmentCost.toLocaleString()} ج`,
      `${item.otherCost.toLocaleString()} ج`,
      `${item.totalCost.toLocaleString()} ج`,
    ]);
    exportToExcel("تقرير مركز التكلفة", headers, data, "cost-center.xlsx");
  };

  const handleExportCSV = () => {
    const headers = [
      "الاسم",
      "النوع",
      "تكلفة الشراء",
      "تكلفة الأعلاف",
      "تكلفة العلاج",
      "تكاليف أخرى",
      "الإجمالي",
    ];
    const data = filteredData.map((item: any) => [
      item.name,
      item.type === "animal" ? "حيوان" : "دفعة",
      `${item.purchaseCost.toLocaleString()} ج`,
      `${item.feedCost.toLocaleString()} ج`,
      `${item.treatmentCost.toLocaleString()} ج`,
      `${item.otherCost.toLocaleString()} ج`,
      `${item.totalCost.toLocaleString()} ج`,
    ]);
    exportToCSV(headers, data, "cost-center.csv");
  };

  const getExpenseTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      feed: "أعلاف",
      treatment: "علاج",
      labor: "عمالة",
      transport: "نقل",
      other: "أخرى",
    };
    return types[type] || type;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            مركز التكلفة
          </h1>
          <p className="text-gray-600">
            تحليل التكاليف على مستوى الحيوان أو الدفعة أو جميع الدفعات
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2" onClick={handleExportPDF}>
            <FileText className="h-4 w-4" />
            PDF
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportExcel}>
            <Package className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
            <Download className="h-4 w-4" />
            CSV
          </Button>
          <Button
            className="gap-2"
            onClick={() => setIsExpenseDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            إضافة مصروف
          </Button>
        </div>
      </div>

      {/* View Level Selector */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <Label>مستوى العرض</Label>
              <div className="flex gap-3 mt-2">
                <Button
                  variant={viewLevel === "all" ? "default" : "outline"}
                  onClick={() => {
                    setViewLevel("all");
                    setSelectedBatch("");
                    setSelectedAnimal("");
                  }}
                >
                  <Package className="h-4 w-4 ml-2" />
                  جميع الدفعات
                </Button>
                <Button
                  variant={viewLevel === "batch" ? "default" : "outline"}
                  onClick={() => setViewLevel("batch")}
                >
                  <Activity className="h-4 w-4 ml-2" />
                  دفعة محددة
                </Button>
                <Button
                  variant={viewLevel === "animal" ? "default" : "outline"}
                  onClick={() => setViewLevel("animal")}
                >
                  <Beef className="h-4 w-4 ml-2" />
                  حيوان واحد
                </Button>
              </div>
            </div>

            {viewLevel === "batch" && (
              <div>
                <Label htmlFor="batch-select">اختر الدفعة</Label>
                <select
                  id="batch-select"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                >
                  <option value="">-- اختر دفعة --</option>
                  {batches.map((batch: any) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchName} (رقم {batch.batchNumber})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {viewLevel === "animal" && (
              <div>
                <Label htmlFor="animal-select">اختر الحيوان</Label>
                <select
                  id="animal-select"
                  className="w-full mt-1 p-2 border rounded-md"
                  value={selectedAnimal}
                  onChange={(e) => setSelectedAnimal(e.target.value)}
                >
                  <option value="">-- اختر حيوان --</option>
                  {animals.map((animal: any) => (
                    <option key={animal.id} value={animal.id}>
                      رقم الأذن: {animal.earTag} - {animal.animalType}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  إجمالي التكاليف
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalCost.toLocaleString()} ج
                </p>
              </div>
              <div className="p-3 rounded-lg bg-blue-100">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  تكلفة الأعلاف
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalFeedCost.toLocaleString()} ج
                </p>
              </div>
              <div className="p-3 rounded-lg bg-green-100">
                <Package className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  تكلفة العلاج
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalTreatmentCost.toLocaleString()} ج
                </p>
              </div>
              <div className="p-3 rounded-lg bg-red-100">
                <Activity className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  تكاليف أخرى
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.totalOtherCost.toLocaleString()} ج
                </p>
              </div>
              <div className="p-3 rounded-lg bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600">
                  متوسط التكلفة
                </p>
                <p className="text-2xl font-bold text-gray-900 mt-2">
                  {stats.avgCostPerItem.toLocaleString()} ج
                </p>
              </div>
              <div className="p-3 rounded-lg bg-purple-100">
                <TrendingDown className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            {viewLevel === "all" && "جميع الدفعات"}
            {viewLevel === "batch" && "تفاصيل الدفعة"}
            {viewLevel === "animal" && "تفاصيل الحيوان"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-right">الاسم</TableHead>
                  <TableHead className="text-right">النوع</TableHead>
                  <TableHead className="text-right">تكلفة الشراء</TableHead>
                  <TableHead className="text-right">تكلفة الأعلاف</TableHead>
                  <TableHead className="text-right">تكلفة العلاج</TableHead>
                  <TableHead className="text-right">تكاليف أخرى</TableHead>
                  <TableHead className="text-right">الإجمالي</TableHead>
                  {viewLevel === "all" && (
                    <TableHead className="text-right">الحالة</TableHead>
                  )}
                  <TableHead className="text-right">الإجراءات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      لا توجد بيانات للعرض
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {item.type === "animal" ? "حيوان" : "دفعة"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.purchaseCost.toLocaleString()} ج
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {item.feedCost.toLocaleString()} ج
                      </TableCell>
                      <TableCell className="font-medium text-red-600">
                        {item.treatmentCost.toLocaleString()} ج
                      </TableCell>
                      <TableCell className="font-medium text-orange-600">
                        {item.otherCost.toLocaleString()} ج
                      </TableCell>
                      <TableCell className="font-bold text-blue-600">
                        {item.totalCost.toLocaleString()} ج
                      </TableCell>
                      {viewLevel === "all" && (
                        <TableCell>
                          <Badge
                            variant={
                              item.status === "active" ? "default" : "secondary"
                            }
                          >
                            {item.status === "active" ? "نشط" : "مغلق"}
                          </Badge>
                        </TableCell>
                      )}
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setSelectedItem(item);
                            setIsDetailDialogOpen(true);
                          }}
                        >
                          <Eye className="h-4 w-4 ml-1" />
                          التفاصيل
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>إضافة مصروف جديد</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddExpense} className="space-y-4">
            {viewLevel === "all" && (
              <div>
                <Label htmlFor="batchId">الدفعة *</Label>
                <select
                  id="batchId"
                  name="batchId"
                  required
                  className="w-full mt-1 p-2 border rounded-md"
                >
                  <option value="">-- اختر دفعة --</option>
                  {batches.map((batch: any) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.batchName}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div>
              <Label htmlFor="expenseDate">تاريخ المصروف *</Label>
              <Input
                id="expenseDate"
                name="expenseDate"
                type="date"
                required
                defaultValue={new Date().toISOString().split("T")[0]}
              />
            </div>

            <div>
              <Label htmlFor="expenseType">نوع المصروف *</Label>
              <select
                id="expenseType"
                name="expenseType"
                required
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="">-- اختر نوع المصروف --</option>
                <option value="feed">أعلاف</option>
                <option value="treatment">علاج</option>
                <option value="labor">عمالة</option>
                <option value="transport">نقل</option>
                <option value="other">أخرى</option>
              </select>
            </div>

            <div>
              <Label htmlFor="description">الوصف *</Label>
              <Textarea
                id="description"
                name="description"
                required
                placeholder="وصف تفصيلي للمصروف"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="quantity">الكمية</Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  placeholder="مثال: 100 كجم"
                />
              </div>
              <div>
                <Label htmlFor="unitPrice">سعر الوحدة</Label>
                <Input
                  id="unitPrice"
                  name="unitPrice"
                  type="number"
                  step="0.01"
                  placeholder="مثال: 50 ج"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="amount">المبلغ الإجمالي *</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                required
                placeholder="المبلغ بالجنيه"
              />
            </div>

            <div>
              <Label htmlFor="paymentMethod">طريقة الدفع</Label>
              <select
                id="paymentMethod"
                name="paymentMethod"
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="">-- اختر طريقة الدفع --</option>
                <option value="cash">نقدي</option>
                <option value="bank_transfer">تحويل بنكي</option>
                <option value="check">شيك</option>
                <option value="credit">آجل</option>
              </select>
            </div>

            <div>
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="ملاحظات إضافية (اختياري)"
                rows={2}
              />
            </div>

            <div className="flex gap-3 justify-end pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsExpenseDialogOpen(false)}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={addExpenseMutation.isPending}>
                {addExpenseMutation.isPending ? "جاري الحفظ..." : "حفظ المصروف"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              تفاصيل التكلفة - {selectedItem?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedItem && (
            <div className="space-y-6">
              {/* Cost Breakdown */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">تكلفة الشراء</p>
                    <p className="text-xl font-bold">
                      {selectedItem.purchaseCost.toLocaleString()} ج
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">تكلفة الأعلاف</p>
                    <p className="text-xl font-bold text-green-600">
                      {selectedItem.feedCost.toLocaleString()} ج
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">تكلفة العلاج</p>
                    <p className="text-xl font-bold text-red-600">
                      {selectedItem.treatmentCost.toLocaleString()} ج
                    </p>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">تكاليف أخرى</p>
                    <p className="text-xl font-bold text-orange-600">
                      {selectedItem.otherCost.toLocaleString()} ج
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Total */}
              <Card className="bg-blue-50">
                <CardContent className="p-4">
                  <div className="flex justify-between items-center">
                    <p className="text-lg font-medium">إجمالي التكلفة</p>
                    <p className="text-3xl font-bold text-blue-600">
                      {selectedItem.totalCost.toLocaleString()} ج
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Expense History */}
              <div>
                <h3 className="text-lg font-bold mb-4">سجل المصروفات التفصيلي</h3>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">النوع</TableHead>
                        <TableHead className="text-right">الوصف</TableHead>
                        <TableHead className="text-right">الكمية</TableHead>
                        <TableHead className="text-right">المبلغ</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {itemExpenses.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            لا توجد مصروفات مسجلة
                          </TableCell>
                        </TableRow>
                      ) : (
                        itemExpenses.map((expense: any) => (
                          <TableRow key={expense.id}>
                            <TableCell>
                              {new Date(expense.expenseDate).toLocaleDateString(
                                "ar-EG"
                              )}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {getExpenseTypeLabel(expense.expenseType)}
                              </Badge>
                            </TableCell>
                            <TableCell className="max-w-[200px]">
                              {expense.description}
                            </TableCell>
                            <TableCell>
                              {expense.quantity
                                ? `${parseFloat(expense.quantity).toLocaleString()}`
                                : "-"}
                            </TableCell>
                            <TableCell className="font-bold">
                              {parseFloat(expense.amount).toLocaleString()} ج
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
