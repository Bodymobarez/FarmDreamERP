import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DollarSign,
  TrendingUp,
  Package,
  Activity,
  Beef,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  Package2,
  FileText,
} from "lucide-react";

type ViewLevel = "all" | "batch" | "animal";

export default function CostCenter() {
  const [viewLevel, setViewLevel] = useState<ViewLevel>("all");
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedAnimal, setSelectedAnimal] = useState<string>("");

  // Fetch data
  const { data: batches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // Get filtered data based on view level
  const getFilteredData = () => {
    if (viewLevel === "animal" && selectedAnimal) {
      const animal = animals.find((a: any) => a.id === selectedAnimal);
      if (!animal) return [];

      return [
        {
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
        },
      ];
    }

    if (viewLevel === "batch" && selectedBatch) {
      const batch = batches.find((b: any) => b.id === selectedBatch);
      if (!batch) return [];

      return [
        {
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
        },
      ];
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
    totalCost: filteredData.reduce(
      (sum: number, item: any) => sum + item.totalCost,
      0
    ),
    totalFeedCost: filteredData.reduce(
      (sum: number, item: any) => sum + item.feedCost,
      0
    ),
    totalTreatmentCost: filteredData.reduce(
      (sum: number, item: any) => sum + item.treatmentCost,
      0
    ),
    totalPurchaseCost: filteredData.reduce(
      (sum: number, item: any) => sum + item.purchaseCost,
      0
    ),
    totalOtherCost: filteredData.reduce(
      (sum: number, item: any) => sum + item.otherCost,
      0
    ),
    avgCostPerItem:
      filteredData.length > 0
        ? filteredData.reduce(
            (sum: number, item: any) => sum + item.totalCost,
            0
          ) / filteredData.length
        : 0,
    activeItems: filteredData.filter(
      (item: any) => item.status === "active"
    ).length,
  };

  // Calculate cost percentages
  const totalCost = stats.totalCost || 1;
  const purchasePercentage = (stats.totalPurchaseCost / totalCost) * 100;
  const feedPercentage = (stats.totalFeedCost / totalCost) * 100;
  const treatmentPercentage = (stats.totalTreatmentCost / totalCost) * 100;
  const otherPercentage = (stats.totalOtherCost / totalCost) * 100;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-rose-500 to-pink-600 shadow-lg">
          <PieChart className="h-12 w-12 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">مركز التكلفة</h1>
          <p className="text-gray-600 mt-1">
            تحليل شامل للتكاليف على مستوى الدفعات والحيوانات الفردية
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Cost */}
        <Card className="border-2 border-rose-200 bg-gradient-to-br from-rose-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-rose-100">
                <DollarSign className="h-5 w-5 text-rose-600" />
              </div>
              <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
                إجمالي
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                إجمالي التكاليف
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalCost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">جنيه مصري</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <ArrowUpRight className="h-4 w-4 text-rose-600" />
              <span className="text-rose-600 font-medium">جميع البنود</span>
            </div>
          </CardContent>
        </Card>

        {/* Feed Cost */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Package className="h-5 w-5 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {feedPercentage.toFixed(1)}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                تكلفة الأعلاف
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalFeedCost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">جنيه مصري</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Package2 className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">
                من إجمالي التكاليف
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Treatment Cost */}
        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-red-100">
                <Activity className="h-5 w-5 text-red-600" />
              </div>
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                {treatmentPercentage.toFixed(1)}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                تكلفة العلاج
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalTreatmentCost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">جنيه مصري</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Activity className="h-4 w-4 text-red-600" />
              <span className="text-red-600 font-medium">
                من إجمالي التكاليف
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Purchase Cost */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Beef className="h-5 w-5 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                {purchasePercentage.toFixed(1)}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                تكلفة الشراء
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalPurchaseCost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">جنيه مصري</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Beef className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600 font-medium">
                من إجمالي التكاليف
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Other Costs */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <FileText className="h-5 w-5 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                {otherPercentage.toFixed(1)}%
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                تكاليف أخرى
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalOtherCost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">جنيه مصري</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <FileText className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600 font-medium">
                من إجمالي التكاليف
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Average Cost */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="h-5 w-5 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                متوسط
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                متوسط التكلفة
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.avgCostPerItem.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">للوحدة الواحدة</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <TrendingUp className="h-4 w-4 text-purple-600" />
              <span className="text-purple-600 font-medium">
                {filteredData.length} {viewLevel === "animal" ? "حيوان" : "دفعة"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Items */}
        <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-cyan-100">
                <Activity className="h-5 w-5 text-cyan-600" />
              </div>
              <Badge className="bg-cyan-100 text-cyan-700 hover:bg-cyan-100">
                نشط
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                البنود النشطة
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.activeItems}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                من أصل {filteredData.length}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <ArrowUpRight className="h-4 w-4 text-cyan-600" />
              <span className="text-cyan-600 font-medium">
                {filteredData.length > 0
                  ? ((stats.activeItems / filteredData.length) * 100).toFixed(
                      1
                    )
                  : 0}
                % نشط
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Total Items Count */}
        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-indigo-100">
                <Package2 className="h-5 w-5 text-indigo-600" />
              </div>
              <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                إجمالي
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                عدد {viewLevel === "animal" ? "الحيوانات" : "الدفعات"}
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {filteredData.length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {viewLevel === "all" && "جميع الدفعات"}
                {viewLevel === "batch" && "دفعة محددة"}
                {viewLevel === "animal" && "حيوان محدد"}
              </p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Package2 className="h-4 w-4 text-indigo-600" />
              <span className="text-indigo-600 font-medium">
                مستوى العرض الحالي
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2 border-rose-200 bg-gradient-to-br from-rose-50/50 to-transparent">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                مستوى العرض
              </label>
              <Select
                value={viewLevel}
                onValueChange={(value: ViewLevel) => {
                  setViewLevel(value);
                  setSelectedBatch("");
                  setSelectedAnimal("");
                }}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="اختر مستوى العرض" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-rose-600" />
                      <span>جميع الدفعات</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="batch">
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-rose-600" />
                      <span>دفعة محددة</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="animal">
                    <div className="flex items-center gap-2">
                      <Beef className="h-4 w-4 text-rose-600" />
                      <span>حيوان واحد</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            {viewLevel === "batch" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  اختر الدفعة
                </label>
                <Select
                  value={selectedBatch}
                  onValueChange={setSelectedBatch}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="اختر دفعة" />
                  </SelectTrigger>
                  <SelectContent>
                    {batches.map((batch: any) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        {batch.batchName} (رقم {batch.batchNumber})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {viewLevel === "animal" && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  اختر الحيوان
                </label>
                <Select
                  value={selectedAnimal}
                  onValueChange={setSelectedAnimal}
                >
                  <SelectTrigger className="bg-white">
                    <SelectValue placeholder="اختر حيوان" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals.map((animal: any) => (
                      <SelectItem key={animal.id} value={animal.id}>
                        رقم الأذن: {animal.earTag} - {animal.animalType}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Cost Breakdown Cards */}
      {filteredData.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12">
            <div className="text-center">
              <PieChart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد بيانات للعرض
              </h3>
              <p className="text-gray-600">
                {viewLevel === "batch" && !selectedBatch &&
                  "الرجاء اختيار دفعة من القائمة أعلاه"}
                {viewLevel === "animal" && !selectedAnimal &&
                  "الرجاء اختيار حيوان من القائمة أعلاه"}
                {viewLevel === "all" && "لا توجد دفعات متاحة حالياً"}
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredData.map((item: any) => (
            <Card
              key={item.id}
              className="border-2 border-rose-200 bg-gradient-to-br from-rose-50/50 to-transparent hover:shadow-lg transition-shadow"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-rose-100">
                        {item.type === "animal" ? (
                          <Beef className="h-5 w-5 text-rose-600" />
                        ) : (
                          <Package className="h-5 w-5 text-rose-600" />
                        )}
                      </div>
                      <Badge
                        variant={
                          item.status === "active" ? "default" : "secondary"
                        }
                        className={
                          item.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {item.status === "active" ? "نشط" : "مغلق"}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {item.name}
                    </h3>
                    {item.type === "batch" && (
                      <p className="text-sm text-gray-600">
                        {item.totalAnimals} حيوان -{" "}
                        {item.soldAnimals} مباع
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Total Cost */}
                  <div className="p-3 rounded-lg bg-rose-100">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-rose-900">
                        إجمالي التكلفة
                      </span>
                      <span className="text-lg font-bold text-rose-900">
                        {item.totalCost.toLocaleString()} ج
                      </span>
                    </div>
                  </div>

                  {/* Cost Breakdown */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Beef className="h-4 w-4 text-blue-600" />
                        تكلفة الشراء
                      </span>
                      <span className="font-semibold text-blue-600">
                        {item.purchaseCost.toLocaleString()} ج
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Package className="h-4 w-4 text-green-600" />
                        تكلفة الأعلاف
                      </span>
                      <span className="font-semibold text-green-600">
                        {item.feedCost.toLocaleString()} ج
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <Activity className="h-4 w-4 text-red-600" />
                        تكلفة العلاج
                      </span>
                      <span className="font-semibold text-red-600">
                        {item.treatmentCost.toLocaleString()} ج
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <FileText className="h-4 w-4 text-orange-600" />
                        تكاليف أخرى
                      </span>
                      <span className="font-semibold text-orange-600">
                        {item.otherCost.toLocaleString()} ج
                      </span>
                    </div>
                  </div>

                  {/* Cost per Animal (for batches) */}
                  {item.type === "batch" && item.totalAnimals > 0 && (
                    <div className="pt-3 border-t border-rose-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600 font-medium">
                          متوسط التكلفة للحيوان
                        </span>
                        <span className="font-bold text-purple-600">
                          {(item.totalCost / item.totalAnimals).toLocaleString()}{" "}
                          ج
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
