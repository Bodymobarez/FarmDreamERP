import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package2, 
  Boxes, 
  Pill,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  Search,
  Plus,
  Download,
  Upload,
  History,
  ArrowRight,
  BarChart3
} from "lucide-react";
import { useState } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { AddInventoryItemDialog } from "@/components/AddInventoryItemDialog";
import { DispenseInventoryDialog } from "@/components/DispenseInventoryDialog";
import { ReorderInventoryDialog } from "@/components/ReorderInventoryDialog";
import { InventoryCard } from "@/components/InventoryCard";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("feeds");
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch inventory items
  const { data: inventoryItems = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
  });

  // Filter items by type and search
  const filteredFeeds = inventoryItems.filter(
    (item: any) =>
      item.itemType === "feed" &&
      (item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const filteredMedicines = inventoryItems.filter(
    (item: any) =>
      item.itemType === "medicine" &&
      (item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Calculate statistics
  const totalItems = inventoryItems.length;
  const totalFeeds = filteredFeeds.length;
  const totalMedicines = filteredMedicines.length;
  const lowStockItems = inventoryItems.filter(
    (item: any) => parseFloat(item.currentStock) <= parseFloat(item.reorderPoint)
  ).length;
  const totalValue = inventoryItems.reduce(
    (sum: number, item: any) => sum + parseFloat(item.totalValue || "0"),
    0
  );
  const averageValue = totalItems > 0 ? totalValue / totalItems : 0;
  const expiringSoon = inventoryItems.filter(
    (item: any) => item.expiryDate && new Date(item.expiryDate) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
  ).length;
  
  // جلب معاملات المخزون الحقيقية
  const { data: inventoryTransactions = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory-transactions"],
  });
  
  const recentTransactions = inventoryTransactions.length;

  // Export to CSV
  const handleExport = () => {
    const csvData = inventoryItems.map((item: any) => ({
      'كود الصنف': item.itemCode,
      'اسم الصنف': item.itemName,
      'النوع': item.itemType === 'feed' ? 'علف' : 'دواء',
      'الكمية الحالية': item.currentStock,
      'الوحدة': item.unit,
      'نقطة إعادة الطلب': item.reorderPoint,
      'التكلفة للوحدة': item.unitCost,
      'القيمة الإجمالية': item.totalValue,
    }));

    const headers = Object.keys(csvData[0] || {}).join(',');
    const rows = csvData.map(row => Object.values(row).join(',')).join('\\n');
    const csv = `${headers}\\n${rows}`;
    
    const blob = new Blob(['\\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "✅ تم التصدير بنجاح",
      description: `تم تصدير ${inventoryItems.length} صنف إلى ملف CSV`,
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100">
          <Package2 className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">إدارة المخزون</h1>
          <p className="text-gray-600 mt-1">
            متابعة شاملة للأعلاف والأدوية مع إدارة المخزون
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 mb-1">إجمالي الأصناف</p>
                <p className="text-3xl font-bold text-gray-900">{totalItems}</p>
                <p className="text-xs text-gray-600 mt-1">
                  أعلاف: {totalFeeds} | أدوية: {totalMedicines}
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <Boxes className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">مخزون منخفض</p>
                <p className="text-3xl font-bold text-gray-900">{lowStockItems}</p>
                <p className="text-xs text-gray-600 mt-1">
                  يحتاج إعادة طلب
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">قيمة المخزون</p>
                <p className="text-3xl font-bold text-gray-900">{totalValue.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">
                  جنيه مصري
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">متوسط قيمة الصنف</p>
                <p className="text-3xl font-bold text-gray-900">{averageValue.toLocaleString()}</p>
                <p className="text-xs text-gray-600 mt-1">
                  جنيه
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <BarChart3 className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600 mb-1">ينتهي قريباً</p>
                <p className="text-3xl font-bold text-gray-900">{expiringSoon}</p>
                <p className="text-xs text-gray-600 mt-1">
                  خلال 30 يوم
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Calendar className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">الحركات الأخيرة</p>
                <p className="text-3xl font-bold text-gray-900">{recentTransactions}</p>
                <p className="text-xs text-gray-600 mt-1">
                  هذا الشهر
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <Activity className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">نمو المخزون</p>
                <p className="text-3xl font-bold text-gray-900">+12.5%</p>
                <p className="text-xs text-gray-600 mt-1">
                  عن الشهر الماضي
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-indigo-600 mb-1">أصناف الأعلاف</p>
                <p className="text-3xl font-bold text-gray-900">{totalFeeds}</p>
                <p className="text-xs text-gray-600 mt-1">
                  صنف علف
                </p>
              </div>
              <div className="p-3 bg-indigo-100 rounded-full">
                <Package2 className="h-6 w-6 text-indigo-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-3">
        <AddInventoryItemDialog />
        <DispenseInventoryDialog />
        <ReorderInventoryDialog />
        
        <Button
          variant="outline"
          size="lg"
          onClick={() => setLocation("/inventory-transactions")}
          className="bg-white hover:bg-gray-50"
        >
          <History className="h-5 w-5 ml-2" />
          سجل الحركات
          <ArrowRight className="h-5 w-5 mr-2" />
        </Button>
        
        <Button 
          variant="outline"
          size="lg"
          onClick={handleExport}
          disabled={inventoryItems.length === 0}
          className="bg-white hover:bg-gray-50"
        >
          <Download className="h-5 w-5 ml-2" />
          تصدير CSV
        </Button>
        
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => {
            toast({
              title: "قريباً",
              description: "سيتم إضافة وظيفة الاستيراد قريباً",
              variant: "destructive",
            });
          }}
          className="bg-white hover:bg-gray-50"
        >
          <Upload className="h-5 w-5 ml-2" />
          استيراد CSV
        </Button>
      </div>

      {/* Search */}
      <Card className="border-2 border-gray-200 bg-gradient-to-br from-gray-50/50 to-transparent">
        <CardContent className="p-6">
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 text-gray-600" />
            <div className="flex-1">
              <Label htmlFor="search" className="text-gray-700 font-medium">البحث في المخزون</Label>
              <Input
                id="search"
                placeholder="ابحث بالاسم أو الكود أو النوع..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-2 bg-white"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 h-12">
          <TabsTrigger value="feeds" className="flex items-center gap-2 text-sm">
            <Package2 className="h-4 w-4" />
            الأعلاف ({totalFeeds})
          </TabsTrigger>
          <TabsTrigger value="medicines" className="flex items-center gap-2 text-sm">
            <Pill className="h-4 w-4" />
            الأدوية ({totalMedicines})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feeds" className="space-y-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-green-100 to-emerald-100">
              <Package2 className="h-6 w-6 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">أصناف الأعلاف</h2>
          </div>
          
          {filteredFeeds.length === 0 ? (
            <Card className="border-2 border-dashed border-green-200 bg-gradient-to-br from-green-50/30 to-transparent">
              <CardContent className="p-12 text-center">
                <Package2 className="w-16 h-16 mx-auto text-green-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد أعلاف مسجلة</h3>
                <p className="text-gray-500 mb-4">ابدأ بإضافة أول صنف علف</p>
                <AddInventoryItemDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredFeeds.map((item: any) => (
                <div key={item.id} className="relative">
                  <InventoryCard
                    item={item}
                    supplier={item.supplierId}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="medicines" className="space-y-6 mt-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100">
              <Pill className="h-6 w-6 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">أصناف الأدوية</h2>
          </div>
          
          {filteredMedicines.length === 0 ? (
            <Card className="border-2 border-dashed border-purple-200 bg-gradient-to-br from-purple-50/30 to-transparent">
              <CardContent className="p-12 text-center">
                <Pill className="w-16 h-16 mx-auto text-purple-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">لا توجد أدوية مسجلة</h3>
                <p className="text-gray-500 mb-4">ابدأ بإضافة أول صنف دواء</p>
                <AddInventoryItemDialog />
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredMedicines.map((item: any) => (
                <div key={item.id} className="relative">
                  <InventoryCard
                    item={item}
                    supplier={item.supplierId}
                  />
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}