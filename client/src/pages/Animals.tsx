import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Beef,
  TrendingUp,
  Activity,
  Scale,
  Baby,
  Heart,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Search,
  Filter,
} from "lucide-react";
import { AddAnimalDialog } from "@/components/AddAnimalDialog";
import { AddNewbornDialog } from "@/components/AddNewbornDialog";
import { SellAnimalDialog } from "@/components/SellAnimalDialog";
import { useToast } from "@/hooks/use-toast";

export default function Animals() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [penFilter, setPenFilter] = useState("all");
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [isSellDialogOpen, setIsSellDialogOpen] = useState(false);

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch animals from API
  const { data: animals = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // Filter animals
  const filteredAnimals = animals.filter((animal: any) => {
    const matchesSearch =
      animal.earTag?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.penNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      animal.batchNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || animal.animalType === typeFilter;
    const matchesStatus = statusFilter === "all" || animal.status === statusFilter;
    const matchesPen = penFilter === "all" || animal.penNumber === penFilter;
    return matchesSearch && matchesType && matchesStatus && matchesPen;
  });

  // Calculate statistics
  const stats = {
    total: animals.length,
    active: animals.filter((a: any) => a.status === "active").length,
    sold: animals.filter((a: any) => a.status === "sold").length,
    dead: animals.filter((a: any) => a.status === "dead").length,
    newborns: animals.filter((a: any) => a.isNewborn === true).length,
    avgWeight:
      animals.length > 0
        ? animals.reduce(
            (sum: number, a: any) => sum + parseFloat(a.currentWeight || "0"),
            0
          ) / animals.length
        : 0,
    totalCost: animals.reduce(
      (sum: number, a: any) => sum + parseFloat(a.totalCost || "0"),
      0
    ),
    totalWeight: animals.reduce(
      (sum: number, a: any) => sum + parseFloat(a.currentWeight || "0"),
      0
    ),
    avgGain:
      animals.length > 0
        ? animals.reduce(
            (sum: number, a: any) =>
              sum +
              (parseFloat(a.currentWeight || "0") -
                parseFloat(a.entryWeight || "0")),
            0
          ) / animals.length
        : 0,
  };

  // Animal type breakdown
  const animalTypeStats = animals.reduce((acc: any, animal: any) => {
    acc[animal.animalType] = (acc[animal.animalType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Get unique pen numbers
  const uniquePens = Array.from(new Set(animals.map((a: any) => a.penNumber))).filter(
    Boolean
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
          <Beef className="h-12 w-12 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">إدارة الحيوانات</h1>
          <p className="text-gray-600 mt-1">
            عرض وإدارة شامل لجميع الحيوانات في المزرعة مع تتبع الأوزان والتكاليف
          </p>
        </div>
        <div className="flex gap-2">
          <AddNewbornDialog />
          <AddAnimalDialog />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Animals */}
        <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-teal-100">
                <Beef className="h-5 w-5 text-teal-600" />
              </div>
              <Badge className="bg-teal-100 text-teal-700 hover:bg-teal-100">
                إجمالي
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                إجمالي الحيوانات
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500 mt-1">في المزرعة</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Activity className="h-4 w-4 text-teal-600" />
              <span className="text-teal-600 font-medium">
                {stats.active} نشط
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Active Animals */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-100">
                <Activity className="h-5 w-5 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                {stats.total > 0
                  ? ((stats.active / stats.total) * 100).toFixed(1)
                  : 0}
                %
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                الحيوانات النشطة
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.active}</p>
              <p className="text-xs text-gray-500 mt-1">قيد التربية</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Heart className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">حالة ممتازة</span>
            </div>
          </CardContent>
        </Card>

        {/* Newborns */}
        <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-pink-100">
                <Baby className="h-5 w-5 text-pink-600" />
              </div>
              <Badge className="bg-pink-100 text-pink-700 hover:bg-pink-100">
                مواليد
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">المواليد 🐄</p>
              <p className="text-3xl font-bold text-gray-900">{stats.newborns}</p>
              <p className="text-xs text-gray-500 mt-1">تكلفة صفر</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <ArrowUpRight className="h-4 w-4 text-pink-600" />
              <span className="text-pink-600 font-medium">
                {stats.total > 0
                  ? ((stats.newborns / stats.total) * 100).toFixed(1)
                  : 0}
                % من الإجمالي
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Sold Animals */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <TrendingUp className="h-5 w-5 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                مُباع
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                الحيوانات المباعة
              </p>
              <p className="text-3xl font-bold text-gray-900">{stats.sold}</p>
              <p className="text-xs text-gray-500 mt-1">تم التسويق</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <DollarSign className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600 font-medium">محققة أرباح</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Weight */}
        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Scale className="h-5 w-5 text-purple-600" />
              </div>
              <Badge className="bg-purple-100 text-purple-700 hover:bg-purple-100">
                متوسط
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">متوسط الوزن</p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.avgWeight.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">كيلوجرام</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Scale className="h-4 w-4 text-purple-600" />
              <span className="text-purple-600 font-medium">
                للحيوان الواحد
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Average Gain */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                زيادة
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                متوسط الزيادة
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.avgGain.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">كيلوجرام</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <ArrowUpRight className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600 font-medium">في الوزن</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Weight */}
        <Card className="border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-indigo-100">
                <Package className="h-5 w-5 text-indigo-600" />
              </div>
              <Badge className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100">
                إجمالي
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                إجمالي الوزن
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalWeight.toFixed(0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">كيلوجرام</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Package className="h-4 w-4 text-indigo-600" />
              <span className="text-indigo-600 font-medium">وزن حي</span>
            </div>
          </CardContent>
        </Card>

        {/* Total Cost */}
        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-red-100">
                <DollarSign className="h-5 w-5 text-red-600" />
              </div>
              <Badge className="bg-red-100 text-red-700 hover:bg-red-100">
                تكلفة
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                إجمالي التكلفة
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalCost.toLocaleString()}
              </p>
              <p className="text-xs text-gray-500 mt-1">جنيه مصري</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <DollarSign className="h-4 w-4 text-red-600" />
              <span className="text-red-600 font-medium">
                {stats.total > 0
                  ? (stats.totalCost / stats.total).toFixed(0)
                  : 0}{" "}
                ج/حيوان
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Animal Types Breakdown */}
      {Object.keys(animalTypeStats).length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            التوزيع حسب نوع الحيوان
          </h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(animalTypeStats).map(([type, count]) => (
              <Card
                key={type}
                className="border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-transparent"
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-teal-100">
                        <Beef className="h-5 w-5 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">{type}</p>
                        <p className="text-2xl font-bold text-gray-900">{count}</p>
                      </div>
                    </div>
                    <Badge className="bg-teal-100 text-teal-700">
                      {((count / stats.total) * 100).toFixed(1)}%
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-transparent">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Search className="h-4 w-4 text-teal-600" />
                البحث
              </label>
              <Input
                placeholder="رقم الأذن، العنبر، الدفعة..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Filter className="h-4 w-4 text-teal-600" />
                نوع الحيوان
              </label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  <SelectItem value="بقر">بقر</SelectItem>
                  <SelectItem value="جاموس">جاموس</SelectItem>
                  <SelectItem value="أغنام">أغنام</SelectItem>
                  <SelectItem value="ماعز">ماعز</SelectItem>
                  <SelectItem value="جمال">جمال</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Activity className="h-4 w-4 text-teal-600" />
                الحالة
              </label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="جميع الحالات" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الحالات</SelectItem>
                  <SelectItem value="active">نشط</SelectItem>
                  <SelectItem value="sold">مُباع</SelectItem>
                  <SelectItem value="dead">نافق</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Package className="h-4 w-4 text-teal-600" />
                العنبر
              </label>
              <Select value={penFilter} onValueChange={setPenFilter}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="جميع العنابر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع العنابر</SelectItem>
                  {uniquePens.map((pen: any) => (
                    <SelectItem key={pen} value={pen}>
                      {pen}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Animals Grid */}
      {filteredAnimals.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12">
            <div className="text-center">
              <Beef className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد حيوانات
              </h3>
              <p className="text-gray-600 mb-4">
                لم يتم العثور على حيوانات تطابق معايير البحث
              </p>
              <Button onClick={() => {
                setSearchTerm("");
                setTypeFilter("all");
                setStatusFilter("all");
                setPenFilter("all");
              }}>
                إعادة تعيين الفلاتر
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredAnimals.map((animal: any) => (
            <Card
              key={animal.id}
              className="border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-transparent hover:shadow-lg transition-shadow cursor-pointer"
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-2 rounded-lg bg-teal-100">
                        {animal.isNewborn ? (
                          <Baby className="h-5 w-5 text-pink-600" />
                        ) : (
                          <Beef className="h-5 w-5 text-teal-600" />
                        )}
                      </div>
                      <Badge
                        variant={
                          animal.status === "active" ? "default" : "secondary"
                        }
                        className={
                          animal.status === "active"
                            ? "bg-green-100 text-green-700 hover:bg-green-100"
                            : animal.status === "sold"
                            ? "bg-orange-100 text-orange-700 hover:bg-orange-100"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {animal.status === "active"
                          ? "نشط"
                          : animal.status === "sold"
                          ? "مُباع"
                          : "نافق"}
                      </Badge>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      رقم الأذن: {animal.earTag}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {animal.animalType} - {animal.sex}
                    </p>
                    {animal.isNewborn && (
                      <Badge className="mt-2 bg-pink-100 text-pink-700">
                        🐄 مولود
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  {/* Location Info */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">العنبر / الدفعة</span>
                    <span className="font-semibold text-gray-900">
                      {animal.penNumber || "-"} / {animal.batchNumber || "-"}
                    </span>
                  </div>

                  {/* Weight Info */}
                  <div className="p-3 rounded-lg bg-purple-50 border border-purple-200">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">الوزن الحالي</p>
                        <p className="text-lg font-bold text-purple-600">
                          {parseFloat(animal.currentWeight || "0").toFixed(1)} كجم
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">الزيادة</p>
                        <p className="text-lg font-bold text-blue-600">
                          {(
                            parseFloat(animal.currentWeight || "0") -
                            parseFloat(animal.entryWeight || "0")
                          ).toFixed(1)}{" "}
                          كجم
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Cost Info */}
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">التكلفة الإجمالية</span>
                    <span className="font-bold text-red-600">
                      {parseFloat(animal.totalCost || "0").toLocaleString()} ج
                    </span>
                  </div>

                  {/* Action Buttons */}
                  {animal.status === "active" && (
                    <Button
                      className="w-full mt-2"
                      variant="outline"
                      onClick={() => {
                        setSelectedAnimal({
                          id: animal.id,
                          earTag: animal.earTag,
                          currentWeight: animal.currentWeight,
                          totalCost: animal.totalCost,
                          batchId: animal.batchId,
                          batchNumber: animal.batchNumber,
                        });
                        setIsSellDialogOpen(true);
                      }}
                    >
                      <DollarSign className="h-4 w-4 ml-2" />
                      بيع الحيوان
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Sell Animal Dialog */}
      <SellAnimalDialog
        open={isSellDialogOpen}
        onOpenChange={setIsSellDialogOpen}
        animal={selectedAnimal}
      />
    </div>
  );
}
