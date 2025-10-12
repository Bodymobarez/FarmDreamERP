import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Upload, 
  Calendar,
  Package,
  TrendingUp,
  TrendingDown,
  Filter,
  FileText,
  FileSpreadsheet,
  FileDown,
  ChevronDown
} from "lucide-react";
import { exportToPDF, exportToExcel, exportToCSV, previewReportOrientation } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

export default function InventoryTransactions() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedItem, setSelectedItem] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const { toast } = useToast();

  // Fetch inventory transactions
  const { data: transactions = [], isLoading: transactionsLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory/transactions"],
  });

  // Fetch inventory items
  const { data: inventoryItems = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
  });

  // Fetch animals
  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // Fetch batches
  const { data: batches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

  // Filter transactions
  const filteredTransactions = transactions.filter((trans: any) => {
    const matchesTab = 
      activeTab === "all" ||
      (activeTab === "in" && trans.transactionType === "in") ||
      (activeTab === "out" && trans.transactionType === "out");

    const matchesSearch = 
      !searchTerm ||
      trans.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      trans.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      inventoryItems.find((i: any) => i.id === trans.itemId)?.itemName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesItem = selectedItem === "all" || trans.itemId === selectedItem;

    const matchesDate = dateFilter === "all" || (() => {
      const transDate = new Date(trans.transactionDate);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - transDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (dateFilter === "today") return daysDiff === 0;
      if (dateFilter === "week") return daysDiff <= 7;
      if (dateFilter === "month") return daysDiff <= 30;
      return true;
    })();

    return matchesTab && matchesSearch && matchesItem && matchesDate;
  });

  // Calculate statistics
  const stats = {
    totalIn: transactions.filter((t: any) => t.transactionType === "in").reduce((sum, t) => sum + parseFloat(t.quantity), 0),
    totalOut: transactions.filter((t: any) => t.transactionType === "out").reduce((sum, t) => sum + parseFloat(t.quantity), 0),
    totalTransactions: transactions.length,
    totalValue: transactions.reduce((sum, t) => sum + (parseFloat(t.quantity) * parseFloat(t.unitCost || 0)), 0),
  };

  // Export functions
  const prepareExportData = (data: any[]) => {
    return data.map((trans: any) => {
      const item = inventoryItems.find((i: any) => i.id === trans.itemId);
      const animal = animals.find((a: any) => a.id === trans.animalId);
      const batch = batches.find((b: any) => b.id === (trans.batchId || animal?.batchId));
      
      const transactionDate = new Date(trans.transactionDate);
      const formattedDate = transactionDate.toLocaleDateString("ar-EG", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const formattedTime = transactionDate.toLocaleTimeString("ar-EG", {
        hour: '2-digit',
        minute: '2-digit'
      });
      
      const quantity = parseFloat(trans.quantity);
      const unitCost = parseFloat(trans.unitCost || 0);
      const totalCost = quantity * unitCost;
      
      return [
        `${formattedDate} - ${formattedTime}`,
        trans.transactionNumber,
        trans.transactionType === "in" ? "🟢 وارد" : "🔴 منصرف",
        item?.itemName || "غير محدد",
        item?.itemType === "feed" ? "🌾 علف" : "💊 دواء",
        `${quantity.toFixed(1)} ${item?.unit || "وحدة"}`,
        `${unitCost.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م`,
        `${totalCost.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م`,
        animal?.earTag ? `#${animal.earTag}` : "غير محدد",
        batch?.batchNumber ? `دفعة ${batch.batchNumber}` : "غير محدد",
        trans.penNumber || "غير محدد",
        trans.description || "لا يوجد وصف",
        trans.performedBy || "غير محدد"
      ];
    });
  };

  const handleExportPDF = async () => {
    try {
      const headers = [
        "التاريخ والوقت",
        "رقم الحركة", 
        "النوع",
        "الصنف",
        "التصنيف",
        "الكمية",
        "سعر الوحدة",
        "الإجمالي",
        "رقم الحيوان",
        "الدفعة",
        "القسم",
        "الوصف",
        "المسؤول"
      ];
      
      const data = prepareExportData(filteredTransactions);
      
      // معاينة التوجه المقترح
      const orientationPreview = previewReportOrientation(headers, data);
      console.log('🔍 معاينة توجه التقرير:', orientationPreview);
      
      const success = await exportToPDF(
        "سجل حركات المخزون",
        headers,
        data,
        `inventory_transactions_${new Date().toISOString().split('T')[0]}.pdf`
      );
      
      if (success) {
        const totalValue = filteredTransactions.reduce((sum, t) => sum + (parseFloat(t.quantity) * parseFloat(t.unitCost || 0)), 0);
        toast({
          title: "✅ تم تصدير PDF بنجاح",
          description: `تم تصدير ${filteredTransactions.length} حركة بتوجه ${orientationPreview.recommendedOrientation === 'landscape' ? 'أفقي' : 'عمودي'} بإجمالي قيمة ${totalValue.toLocaleString('ar-EG', { maximumFractionDigits: 2 })} ج.م`,
        });
      } else {
        throw new Error("فشل في تصدير الملف");
      }
    } catch (error) {
      toast({
        title: "❌ خطأ في التصدير",
        description: "فشل في تصدير الملف إلى PDF",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = () => {
    try {
      const headers = [
        "التاريخ والوقت",
        "رقم الحركة", 
        "النوع",
        "الصنف",
        "التصنيف",
        "الكمية",
        "سعر الوحدة",
        "الإجمالي",
        "رقم الحيوان",
        "الدفعة",
        "القسم",
        "الوصف",
        "المسؤول"
      ];
      
      const data = prepareExportData(filteredTransactions);
      const success = exportToExcel(
        "سجل حركات المخزون",
        headers,
        data,
        `inventory_transactions_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      
      if (success) {
        const totalValue = filteredTransactions.reduce((sum, t) => sum + (parseFloat(t.quantity) * parseFloat(t.unitCost || 0)), 0);
        toast({
          title: "📊 تم تصدير Excel بنجاح",
          description: `تم تصدير ${filteredTransactions.length} حركة بإجمالي قيمة ${totalValue.toLocaleString('ar-EG', { maximumFractionDigits: 2 })} ج.م`,
        });
      } else {
        throw new Error("فشل في تصدير الملف");
      }
    } catch (error) {
      toast({
        title: "❌ خطأ في التصدير",
        description: "فشل في تصدير الملف إلى Excel",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        "التاريخ والوقت",
        "رقم الحركة", 
        "النوع",
        "الصنف",
        "التصنيف",
        "الكمية",
        "سعر الوحدة",
        "الإجمالي",
        "رقم الحيوان",
        "الدفعة",
        "القسم",
        "الوصف",
        "المسؤول"
      ];
      
      const data = prepareExportData(filteredTransactions);
      const success = exportToCSV(
        headers,
        data,
        `inventory_transactions_${new Date().toISOString().split('T')[0]}.csv`
      );
      
      if (success) {
        const totalValue = filteredTransactions.reduce((sum, t) => sum + (parseFloat(t.quantity) * parseFloat(t.unitCost || 0)), 0);
        toast({
          title: "📄 تم تصدير CSV بنجاح",
          description: `تم تصدير ${filteredTransactions.length} حركة بإجمالي قيمة ${totalValue.toLocaleString('ar-EG', { maximumFractionDigits: 2 })} ج.م`,
        });
      } else {
        throw new Error("فشل في تصدير الملف");
      }
    } catch (error) {
      toast({
        title: "❌ خطأ في التصدير",
        description: "فشل في تصدير الملف إلى CSV",
        variant: "destructive"
      });
    }
  };

  const renderTransactionRow = (trans: any) => {
    const item = inventoryItems.find((i: any) => i.id === trans.itemId);
    const animal = animals.find((a: any) => a.id === trans.animalId);
    const batch = batches.find((b: any) => b.id === (trans.batchId || animal?.batchId));

    return (
      <TableRow key={trans.id}>
        <TableCell>
          <div className="text-sm">
            <div className="font-medium text-gray-900">
              {new Date(trans.transactionDate).toLocaleDateString("ar-EG", {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="text-gray-500 text-xs">
              {new Date(trans.transactionDate).toLocaleTimeString("ar-EG", {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </TableCell>
        <TableCell className="font-mono text-sm font-medium">
          {trans.transactionNumber}
        </TableCell>
        <TableCell>
          <Badge variant={trans.transactionType === "in" ? "default" : "destructive"}>
            {trans.transactionType === "in" ? "وارد" : "منصرف"}
          </Badge>
        </TableCell>
        <TableCell className="font-medium">
          {item?.itemName || "-"}
        </TableCell>
        <TableCell>
          <Badge variant="outline">{item?.itemType === "feed" ? "علف" : "دواء"}</Badge>
        </TableCell>
        <TableCell className="text-right font-medium">
          <span className="bg-gray-100 px-2 py-1 rounded text-sm">
            {parseFloat(trans.quantity).toFixed(1)} {item?.unit}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <span className="text-green-600 font-medium">
            {parseFloat(trans.unitCost || 0).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
          </span>
        </TableCell>
        <TableCell className="text-right font-bold">
          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded">
            {(parseFloat(trans.quantity) * parseFloat(trans.unitCost || 0)).toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م
          </span>
        </TableCell>
        <TableCell>
          {animal ? (
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              #{animal.earTag}
            </Badge>
          ) : (
            <span className="text-gray-400 text-sm">غير محدد</span>
          )}
        </TableCell>
        <TableCell>
          {batch ? (
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              {batch.batchNumber}
            </Badge>
          ) : (
            <span className="text-gray-400 text-sm">غير محدد</span>
          )}
        </TableCell>
        <TableCell>
          {trans.penNumber ? (
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
              {trans.penNumber}
            </Badge>
          ) : (
            <span className="text-gray-400 text-sm">غير محدد</span>
          )}
        </TableCell>
        <TableCell className="max-w-xs truncate">
          {trans.description || "-"}
        </TableCell>
        <TableCell className="text-muted-foreground text-sm">
          {trans.performedBy || "-"}
        </TableCell>
      </TableRow>
    );
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header with Export Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100">
            <Package className="h-8 w-8 text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">سجل حركات المخزون</h1>
            <p className="text-gray-600 mt-1">
              تتبع شامل لجميع حركات الوارد والمنصرف من المخزون
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Export Dropdown Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="h-5 w-5 ml-2" />
                تصدير السجل
                <ChevronDown className="h-4 w-4 mr-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportPDF} className="gap-3 cursor-pointer">
                <FileText className="h-4 w-4 text-red-500" />
                <span>تصدير PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel} className="gap-3 cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>تصدير Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV} className="gap-3 cursor-pointer">
                <FileDown className="h-4 w-4 text-blue-600" />
                <span>تصدير CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">إجمالي الحركات</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTransactions}</p>
                <p className="text-xs text-gray-600 mt-1">
                  وارد: {transactions.filter((t: any) => t.transactionType === "in").length} | 
                  منصرف: {transactions.filter((t: any) => t.transactionType === "out").length}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">إجمالي الوارد</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalIn.toFixed(1)}</p>
                <p className="text-xs text-gray-600 mt-1">وحدة متنوعة</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">إجمالي المنصرف</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalOut.toFixed(1)}</p>
                <p className="text-xs text-gray-600 mt-1">وحدة متنوعة</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <TrendingDown className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">القيمة الإجمالية</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalValue.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م
                </p>
                <p className="text-xs text-gray-600 mt-1">جميع الحركات</p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Calendar className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>بحث</Label>
              <Input
                placeholder="ابحث برقم الحركة أو الوصف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>الصنف</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأصناف</SelectItem>
                  {inventoryItems.map((item: any) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.itemName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>الفترة الزمنية</Label>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">كل الفترات</SelectItem>
                  <SelectItem value="today">اليوم</SelectItem>
                  <SelectItem value="week">آخر أسبوع</SelectItem>
                  <SelectItem value="month">آخر شهر</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedItem("all");
                  setDateFilter("all");
                }}
              >
                <Filter className="w-4 h-4 ml-2" />
                إعادة تعيين
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs and Table */}
      <Card>
        <CardHeader>
          <CardTitle>سجل الحركات</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="all">
                <Package className="w-4 h-4 ml-2" />
                جميع الحركات ({transactions.length})
              </TabsTrigger>
              <TabsTrigger value="in">
                <Upload className="w-4 h-4 ml-2" />
                الوارد ({transactions.filter((t: any) => t.transactionType === "in").length})
              </TabsTrigger>
              <TabsTrigger value="out">
                <Download className="w-4 h-4 ml-2" />
                المنصرف ({transactions.filter((t: any) => t.transactionType === "out").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-0">
              <div className="rounded-md border">
                <div className="max-h-[600px] overflow-y-auto">
                  <Table>
                    <TableHeader className="sticky top-0 bg-background z-10">
                      <TableRow>
                        <TableHead>التاريخ والوقت</TableHead>
                        <TableHead>رقم الحركة</TableHead>
                        <TableHead>النوع</TableHead>
                        <TableHead>الصنف</TableHead>
                        <TableHead>التصنيف</TableHead>
                        <TableHead className="text-right">الكمية</TableHead>
                        <TableHead className="text-right">سعر الوحدة</TableHead>
                        <TableHead className="text-right">الإجمالي</TableHead>
                        <TableHead>رقم الحيوان</TableHead>
                        <TableHead>الدفعة</TableHead>
                        <TableHead>القسم</TableHead>
                        <TableHead>الوصف</TableHead>
                        <TableHead>المسؤول</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactionsLoading ? (
                        <TableRow>
                          <TableCell colSpan={13} className="text-center py-8">
                            <div className="flex items-center justify-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredTransactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={13} className="text-center text-muted-foreground py-8">
                            لا توجد حركات مسجلة
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredTransactions.map(renderTransactionRow)
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
              
              {filteredTransactions.length > 0 && (
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    عرض <span className="font-bold text-blue-600">{filteredTransactions.length}</span> من <span className="font-bold">{transactions.length}</span> حركة
                  </div>
                  <div className="text-sm text-gray-500">
                    القيمة المعروضة: <span className="font-bold text-green-600">
                      {filteredTransactions.reduce((sum, t) => sum + (parseFloat(t.quantity) * parseFloat(t.unitCost || 0)), 0).toLocaleString('ar-EG', { maximumFractionDigits: 2 })} ج.م
                    </span>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
