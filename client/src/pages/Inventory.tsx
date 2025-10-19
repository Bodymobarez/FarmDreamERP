import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  Box,
  Search,
  Plus,
  DollarSign
} from "lucide-react";
import { AddInventoryItemDialog } from "@/components/AddInventoryItemDialog";

export default function Inventory() {
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch inventory
  const { data: inventory = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
  });

  // Filter inventory
  const filteredInventory = inventory.filter((item: any) =>
    item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate statistics
  const stats = {
    total: inventory.length,
    lowStock: inventory.filter((item: any) => 
      parseFloat(item.currentStock || item.quantity || "0") <= parseFloat(item.minStock || item.minQuantity || "0")
    ).length,
    totalValue: inventory.reduce((sum: number, item: any) => 
      sum + (parseFloat(item.currentStock || item.quantity || "0") * parseFloat(item.unitPrice || "0")), 0
    ),
    categories: Array.from(new Set(inventory.map((item: any) => item.category))).length,
    totalItems: inventory.reduce((sum: number, item: any) => 
      sum + parseFloat(item.currentStock || item.quantity || "0"), 0
    ),
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">إدارة المخزون</h1>
              <p className="text-gray-600 mt-1">متابعة المخزون والأصناف</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <AddInventoryItemDialog />
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Total Items */}
          <Card className="border-2 border-blue-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-md">
                  <Package className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الأصناف</p>
                <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </CardContent>
          </Card>

          {/* Low Stock */}
          <Card className="border-2 border-red-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 shadow-md">
                  <AlertTriangle className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">مخزون منخفض</p>
                <p className="text-3xl font-bold text-red-600">{stats.lowStock}</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Value */}
          <Card className="border-2 border-emerald-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-3 shadow-md">
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">قيمة المخزون</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalValue.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          {/* Categories */}
          <Card className="border-2 border-purple-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-3 shadow-md">
                  <Box className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">الفئات</p>
                <p className="text-3xl font-bold text-purple-600">{stats.categories}</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Quantity */}
          <Card className="border-2 border-teal-200 bg-white hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center mb-3 shadow-md">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الكمية</p>
                <p className="text-3xl font-bold text-teal-600">{stats.totalItems.toFixed(0)}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search Bar */}
        <Card className="border-2 border-emerald-200 bg-white">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="ابحث باسم الصنف أو الفئة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pr-10 h-12 text-lg border-emerald-200 focus:border-emerald-500"
              />
            </div>
          </CardContent>
        </Card>

        {/* Inventory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredInventory.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد أصناف</p>
                  <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة صنف جديد</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredInventory.map((item: any) => {
              const currentStock = parseFloat(item.currentStock || item.quantity || "0");
              const minStock = parseFloat(item.minStock || item.minQuantity || "0");
              const isLowStock = currentStock <= minStock;
              
              return (
                <Card
                  key={item.id}
                  className={`border-2 ${isLowStock ? 'border-red-200' : 'border-blue-200'} bg-white hover:shadow-xl hover:border-${isLowStock ? 'red' : 'blue'}-400 transition-all duration-300`}
                >
                  <CardContent className="p-5">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${isLowStock ? 'from-red-500 to-red-600' : 'from-blue-500 to-blue-600'} flex items-center justify-center shadow-md`}>
                          <Package className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-lg text-gray-900 line-clamp-1">{item.itemName}</p>
                          <p className="text-xs text-gray-500">{item.category || "عام"}</p>
                        </div>
                      </div>
                      {isLowStock && (
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      )}
                    </div>

                    {/* Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">الكمية:</span>
                        <span className={`font-bold ${isLowStock ? 'text-red-600' : 'text-blue-600'}`}>
                          {currentStock.toFixed(1)} {item.unit}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">السعر:</span>
                        <span className="font-medium text-emerald-600">{parseFloat(item.unitPrice || "0").toFixed(2)} ج.م</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">القيمة:</span>
                        <span className="font-medium text-amber-600">
                          {(currentStock * parseFloat(item.unitPrice || "0")).toFixed(0)} ج.م
                        </span>
                      </div>
                    </div>

                    {isLowStock && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-xs text-red-700 text-center font-medium">
                          ⚠️ يحتاج إعادة طلب
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
