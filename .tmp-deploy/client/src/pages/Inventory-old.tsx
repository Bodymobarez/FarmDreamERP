import { InventoryCard } from "@/components/InventoryCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, Pill, Download, Upload, TrendingDown, AlertTriangle, History, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { DispenseInventoryDialog } from "@/components/DispenseInventoryDialog";
import { AddInventoryItemDialog } from "@/components/AddInventoryItemDialog";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

export default function Inventory() {
  const [activeTab, setActiveTab] = useState("feeds");
  const [searchTerm, setSearchTerm] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  // Fetch inventory items
  const { data: inventoryItems = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
  });

  // Fetch inventory transactions
  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory/transactions"],
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
  const stats = {
    totalItems: inventoryItems.length,
    totalFeeds: filteredFeeds.length,
    totalMedicines: filteredMedicines.length,
    lowStockItems: inventoryItems.filter(
      (item: any) => parseFloat(item.currentStock) <= parseFloat(item.reorderPoint)
    ).length,
    totalValue: inventoryItems.reduce(
      (sum: number, item: any) => sum + parseFloat(item.totalValue || "0"),
      0
    ),
  };

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
    const rows = csvData.map(row => Object.values(row).join(',')).join('\n');
    const csv = `${headers}\n${rows}`;
    
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `inventory_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();

    toast({
      title: "تم التصدير بنجاح",
      description: `تم تصدير ${inventoryItems.length} صنف إلى ملف CSV`,
    });
  };

  // Import from CSV
  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv';
    input.onchange = (e: any) => {
      const file = e.target.files[0];
      if (file) {
        toast({
          title: "جاري الاستيراد...",
          description: `جاري معالجة ملف ${file.name}`,
        });
        // TODO: Implement CSV parsing and import
        setTimeout(() => {
          toast({
            title: "قريباً",
            description: "سيتم إضافة وظيفة الاستيراد قريباً",
            variant: "destructive",
          });
        }, 1000);
      }
    };
    input.click();
  };

  // Add new item handled by AddInventoryItemDialog component

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">إدارة المخزون</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setLocation("/inventory-transactions")}
          >
            <History className="h-4 w-4 ml-2" />
            سجل الحركات
            <ArrowRight className="h-4 w-4 mr-2" />
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            disabled={inventoryItems.length === 0}
          >
            <Download className="h-4 w-4 ml-2" />
            تصدير
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleImport}
          >
            <Upload className="h-4 w-4 ml-2" />
            استيراد
          </Button>
          <DispenseInventoryDialog />
          <AddInventoryItemDialog />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">إجمالي الأصناف</p>
                <p className="text-2xl font-bold">{stats.totalItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الأعلاف</p>
                <p className="text-2xl font-bold text-green-600">{stats.totalFeeds}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
                <Pill className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">الأدوية</p>
                <p className="text-2xl font-bold text-purple-600">{stats.totalMedicines}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">مخزون منخفض</p>
                <p className="text-2xl font-bold text-red-600">{stats.lowStockItems}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">قيمة المخزون</p>
                <p className="text-xl font-bold text-orange-600">{stats.totalValue.toLocaleString()} ج</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <Label>بحث</Label>
              <Input
                placeholder="ابحث بالاسم أو الكود..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="feeds" className="flex items-center gap-2">
            <Package className="h-4 w-4" />
            الأعلاف ({stats.totalFeeds})
          </TabsTrigger>
          <TabsTrigger value="medicines" className="flex items-center gap-2">
            <Pill className="h-4 w-4" />
            الأدوية ({stats.totalMedicines})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="feeds" className="space-y-4">
          {filteredFeeds.length === 0 ? (
            <Card className="p-12 text-center">
              <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد أعلاف مسجلة</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredFeeds.map((item: any) => (
                <div key={item.id} className="relative">
                  <InventoryCard
                    item={item}
                    supplier={item.supplierId}
                  />
                  <div className="absolute top-2 left-2">
                    <DispenseInventoryDialog
                      item={{
                        id: item.id,
                        itemName: item.itemName,
                        currentStock: item.currentStock,
                        unit: item.unit,
                        itemType: item.itemType,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

                <TabsContent value="medicines" className="space-y-4">
          {filteredMedicines.length === 0 ? (
            <Card className="p-12 text-center">
              <Pill className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">لا توجد أدوية مسجلة</p>
            </Card>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredMedicines.map((item: any) => (
                <div key={item.id} className="relative">
                  <InventoryCard
                    item={item}
                    supplier={item.supplierId}
                  />
                  <div className="absolute top-2 right-2">
                    <DispenseInventoryDialog
                      item={{
                        id: item.id,
                        itemName: item.itemName,
                        currentStock: item.currentStock,
                        unit: item.unit,
                        itemType: item.itemType,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
