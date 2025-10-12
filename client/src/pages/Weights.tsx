import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
  Scale,
  TrendingUp,
  Activity,
  Beef,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  BarChart3,
  Search,
  Filter,
  Eye,
} from "lucide-react";
import { AddWeightDialog } from "@/components/AddWeightDialog";

export default function Weights() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch animals data
  const { data: animals = [], isLoading } = useQuery({
    queryKey: ["/api/animals"],
  });

  // Filter animals
  const filteredAnimals = animals.filter((animal: any) => {
    const matchesSearch =
      animal.earTag?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || animal.animalType === typeFilter;
    const matchesStatus =
      statusFilter === "all" || animal.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    totalAnimals: animals.length,
    activeAnimals: animals.filter((a: any) => a.status === "active").length,
    avgCurrentWeight:
      animals.length > 0
        ? animals.reduce(
            (sum: number, a: any) => sum + parseFloat(a.currentWeight || "0"),
            0
          ) / animals.length
        : 0,
    avgEntryWeight:
      animals.length > 0
        ? animals.reduce(
            (sum: number, a: any) => sum + parseFloat(a.entryWeight || "0"),
            0
          ) / animals.length
        : 0,
    avgWeightGain:
      animals.length > 0
        ? animals.reduce((sum: number, a: any) => {
            const entry = parseFloat(a.entryWeight || "0");
            const current = parseFloat(a.currentWeight || "0");
            return sum + (current - entry);
          }, 0) / animals.length
        : 0,
    totalWeight: animals.reduce(
      (sum: number, a: any) => sum + parseFloat(a.currentWeight || "0"),
      0
    ),
    heaviestAnimal: animals.reduce(
      (max: any, a: any) =>
        parseFloat(a.currentWeight || "0") >
        parseFloat(max?.currentWeight || "0")
          ? a
          : max,
      null
    ),
    lightestAnimal: animals.reduce(
      (min: any, a: any) =>
        min === null ||
        parseFloat(a.currentWeight || "0") <
          parseFloat(min?.currentWeight || "0")
          ? a
          : min,
      null
    ),
  };

  // Calculate Average Daily Gain
  const calculateADG = (animal: any) => {
    const entryWeight = parseFloat(animal.entryWeight || "0");
    const currentWeight = parseFloat(animal.currentWeight || "0");
    const entryDate = new Date(animal.entryDate || Date.now());
    const today = new Date();
    const daysSinceEntry = Math.floor(
      (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceEntry <= 0) return 0;
    return ((currentWeight - entryWeight) / daysSinceEntry).toFixed(2);
  };

  // Calculate overall ADG
  const overallADG =
    animals.length > 0
      ? (
          animals.reduce(
            (sum: number, a: any) => sum + parseFloat(calculateADG(a)),
            0
          ) / animals.length
        ).toFixed(2)
      : "0.00";

  // Get unique animal types
  const uniqueTypes = Array.from(
    new Set(animals.map((a: any) => a.animalType).filter(Boolean))
  );

  // Generate weight history for details
  const generateWeightHistory = (animal: any) => {
    const entryWeight = parseFloat(animal.entryWeight || "0");
    const currentWeight = parseFloat(animal.currentWeight || "0");
    const entryDate = new Date(animal.entryDate || Date.now());
    const today = new Date();
    const daysSinceEntry = Math.floor(
      (today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceEntry <= 0 || currentWeight <= entryWeight) {
      return [
        {
          id: 0,
          date: entryDate,
          weight: entryWeight.toFixed(1),
          gain: "0.0",
          avgDailyGain: "0.00",
          daysElapsed: 0,
          cumulativeGain: "0.0",
        },
      ];
    }

    const totalGain = currentWeight - entryWeight;
    const dailyGain = totalGain / daysSinceEntry;

    const history = [];
    const weeks = Math.min(Math.floor(daysSinceEntry / 7), 20);

    // Entry weight
    history.push({
      id: 0,
      date: entryDate,
      weight: entryWeight.toFixed(1),
      gain: "0.0",
      avgDailyGain: "0.00",
      daysElapsed: 0,
      cumulativeGain: "0.0",
    });

    // Weekly measurements
    for (let i = 1; i <= weeks; i++) {
      const daysElapsed = i * 7;
      const weight = entryWeight + dailyGain * daysElapsed;
      const weeklyGain = dailyGain * 7;
      const cumulativeGain = weight - entryWeight;

      const measurementDate = new Date(entryDate);
      measurementDate.setDate(measurementDate.getDate() + daysElapsed);

      history.push({
        id: i,
        date: measurementDate,
        weight: weight.toFixed(1),
        gain: weeklyGain.toFixed(1),
        avgDailyGain: dailyGain.toFixed(2),
        daysElapsed,
        cumulativeGain: cumulativeGain.toFixed(1),
      });
    }

    // Current weight
    if (daysSinceEntry % 7 !== 0 && daysSinceEntry > weeks * 7) {
      history.push({
        id: weeks + 1,
        date: today,
        weight: currentWeight.toFixed(1),
        gain: (dailyGain * (daysSinceEntry - weeks * 7)).toFixed(1),
        avgDailyGain: dailyGain.toFixed(2),
        daysElapsed: daysSinceEntry,
        cumulativeGain: totalGain.toFixed(1),
      });
    }

    return history;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet-600 mx-auto mb-4"></div>
          <p className="text-gray-600">جاري تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 shadow-lg">
          <Scale className="h-12 w-12 text-white" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">تسجيل الأوزان</h1>
          <p className="text-gray-600 mt-1">
            متابعة دقيقة لأوزان الحيوانات ومعدلات النمو اليومية
          </p>
        </div>
        <AddWeightDialog />
      </div>

      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Animals */}
        <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-violet-100">
                <Beef className="h-5 w-5 text-violet-600" />
              </div>
              <Badge className="bg-violet-100 text-violet-700 hover:bg-violet-100">
                إجمالي
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                إجمالي الحيوانات
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalAnimals}
              </p>
              <p className="text-xs text-gray-500 mt-1">حيوان مسجل</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Activity className="h-4 w-4 text-violet-600" />
              <span className="text-violet-600 font-medium">
                {stats.activeAnimals} نشط
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Average Current Weight */}
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
              <p className="text-sm font-medium text-gray-600 mb-1">
                متوسط الوزن الحالي
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.avgCurrentWeight.toFixed(1)}
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

        {/* Average Weight Gain */}
        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-green-100">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <Badge className="bg-green-100 text-green-700 hover:bg-green-100">
                زيادة
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                متوسط الزيادة
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.avgWeightGain.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">كيلوجرام</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <ArrowUpRight className="h-4 w-4 text-green-600" />
              <span className="text-green-600 font-medium">منذ الدخول</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Daily Gain */}
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Activity className="h-5 w-5 text-blue-600" />
              </div>
              <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
                ADG
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                معدل الزيادة اليومي
              </p>
              <p className="text-3xl font-bold text-gray-900">{overallADG}</p>
              <p className="text-xs text-gray-500 mt-1">كجم/يوم</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="text-blue-600 font-medium">متوسط عام</span>
            </div>
          </CardContent>
        </Card>

        {/* Average Entry Weight */}
        <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Calendar className="h-5 w-5 text-orange-600" />
              </div>
              <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100">
                دخول
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                متوسط وزن الدخول
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.avgEntryWeight.toFixed(1)}
              </p>
              <p className="text-xs text-gray-500 mt-1">كيلوجرام</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Calendar className="h-4 w-4 text-orange-600" />
              <span className="text-orange-600 font-medium">عند الشراء</span>
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

        {/* Heaviest Animal */}
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-emerald-100">
                <ArrowUpRight className="h-5 w-5 text-emerald-600" />
              </div>
              <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                أثقل
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                أثقل حيوان
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.heaviestAnimal
                  ? parseFloat(stats.heaviestAnimal.currentWeight).toFixed(1)
                  : "0.0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">كيلوجرام</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Beef className="h-4 w-4 text-emerald-600" />
              <span className="text-emerald-600 font-medium">
                {stats.heaviestAnimal?.earTag || "-"}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Lightest Animal */}
        <Card className="border-2 border-rose-200 bg-gradient-to-br from-rose-50/50 to-transparent hover:shadow-lg transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg bg-rose-100">
                <ArrowDownRight className="h-5 w-5 text-rose-600" />
              </div>
              <Badge className="bg-rose-100 text-rose-700 hover:bg-rose-100">
                أخف
              </Badge>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 mb-1">
                أخف حيوان
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.lightestAnimal
                  ? parseFloat(stats.lightestAnimal.currentWeight).toFixed(1)
                  : "0.0"}
              </p>
              <p className="text-xs text-gray-500 mt-1">كيلوجرام</p>
            </div>
            <div className="flex items-center gap-1 mt-3 text-sm">
              <Beef className="h-4 w-4 text-rose-600" />
              <span className="text-rose-600 font-medium">
                {stats.lightestAnimal?.earTag || "-"}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50/50 to-transparent">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Search className="h-4 w-4 text-violet-600" />
                البحث
              </label>
              <Input
                placeholder="رقم الأذن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Filter className="h-4 w-4 text-violet-600" />
                نوع الحيوان
              </label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="جميع الأنواع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">جميع الأنواع</SelectItem>
                  {uniqueTypes.map((type: any) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Activity className="h-4 w-4 text-violet-600" />
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
          </div>
        </CardContent>
      </Card>

      {/* Weight Records Table */}
      {filteredAnimals.length === 0 ? (
        <Card className="border-2 border-dashed border-gray-300">
          <CardContent className="p-12">
            <div className="text-center">
              <Scale className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                لا توجد سجلات أوزان
              </h3>
              <p className="text-gray-600 mb-4">
                لم يتم العثور على حيوانات تطابق معايير البحث
              </p>
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setTypeFilter("all");
                  setStatusFilter("all");
                }}
              >
                إعادة تعيين الفلاتر
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="border-2 border-violet-200">
          <CardContent className="p-6">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الأذن</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الجنس</TableHead>
                    <TableHead className="text-right">وزن الدخول</TableHead>
                    <TableHead className="text-right">الوزن الحالي</TableHead>
                    <TableHead className="text-right">الزيادة</TableHead>
                    <TableHead className="text-right">معدل ADG</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnimals.map((animal: any) => {
                    const entryWeight = parseFloat(animal.entryWeight || "0");
                    const currentWeight = parseFloat(
                      animal.currentWeight || "0"
                    );
                    const gain = currentWeight - entryWeight;
                    const adg = calculateADG(animal);

                    return (
                      <TableRow key={animal.id}>
                        <TableCell className="font-medium">
                          {animal.earTag}
                        </TableCell>
                        <TableCell>{animal.animalType}</TableCell>
                        <TableCell>{animal.sex}</TableCell>
                        <TableCell>{entryWeight.toFixed(1)} كجم</TableCell>
                        <TableCell className="font-bold text-purple-600">
                          {currentWeight.toFixed(1)} كجم
                        </TableCell>
                        <TableCell>
                          <span
                            className={
                              gain > 0
                                ? "text-green-600 font-medium"
                                : "text-gray-400"
                            }
                          >
                            {gain > 0 && "+"}
                            {gain.toFixed(1)} كجم
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-blue-600 font-medium">
                            {adg} كجم/يوم
                          </span>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              animal.status === "active"
                                ? "default"
                                : "secondary"
                            }
                            className={
                              animal.status === "active"
                                ? "bg-green-100 text-green-700 hover:bg-green-100"
                                : ""
                            }
                          >
                            {animal.status === "active"
                              ? "نشط"
                              : animal.status === "sold"
                              ? "مُباع"
                              : "نافق"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedAnimal(animal);
                              setIsDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 ml-2" />
                            التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              تفاصيل أوزان الحيوان {selectedAnimal?.earTag}
            </DialogTitle>
          </DialogHeader>

          {selectedAnimal && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-2 border-violet-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">النوع</p>
                    <p className="text-lg font-bold">
                      {selectedAnimal.animalType}
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-orange-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">وزن الدخول</p>
                    <p className="text-lg font-bold">
                      {selectedAnimal.entryWeight} كجم
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-purple-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">الوزن الحالي</p>
                    <p className="text-lg font-bold text-purple-600">
                      {selectedAnimal.currentWeight} كجم
                    </p>
                  </CardContent>
                </Card>
                <Card className="border-2 border-green-200">
                  <CardContent className="p-4">
                    <p className="text-sm text-gray-600 mb-1">إجمالي الزيادة</p>
                    <p className="text-lg font-bold text-green-600">
                      +
                      {(
                        parseFloat(selectedAnimal.currentWeight) -
                        parseFloat(selectedAnimal.entryWeight)
                      ).toFixed(1)}{" "}
                      كجم
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Weight History */}
              <div>
                <h3 className="text-lg font-bold mb-4">سجل الأوزان التفصيلي</h3>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">
                          الأيام المنقضية
                        </TableHead>
                        <TableHead className="text-right">الوزن</TableHead>
                        <TableHead className="text-right">
                          الزيادة الأسبوعية
                        </TableHead>
                        <TableHead className="text-right">
                          معدل الزيادة اليومية
                        </TableHead>
                        <TableHead className="text-right">
                          الزيادة التراكمية
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generateWeightHistory(selectedAnimal).map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-gray-400" />
                              {new Date(record.date).toLocaleDateString(
                                "ar-EG"
                              )}
                            </div>
                          </TableCell>
                          <TableCell>{record.daysElapsed} يوم</TableCell>
                          <TableCell className="font-bold">
                            {record.weight} كجم
                          </TableCell>
                          <TableCell>
                            {record.id === 0 ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <span className="text-green-600">
                                +{record.gain} كجم
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.id === 0 ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <span className="text-blue-600">
                                {record.avgDailyGain} كجم/يوم
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.id === 0 ? (
                              <span className="text-gray-400">-</span>
                            ) : (
                              <span className="font-medium">
                                +{record.cumulativeGain} كجم
                              </span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>

              {/* Performance Analysis */}
              <div>
                <h3 className="text-lg font-bold mb-4">تحليل الأداء</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="border-2 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="h-4 w-4 text-green-600" />
                        <p className="text-sm text-gray-600">
                          معدل الزيادة اليومية
                        </p>
                      </div>
                      <p className="text-2xl font-bold text-green-600">
                        {calculateADG(selectedAnimal)} كجم/يوم
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-blue-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="h-4 w-4 text-blue-600" />
                        <p className="text-sm text-gray-600">نسبة الزيادة</p>
                      </div>
                      <p className="text-2xl font-bold text-blue-600">
                        {(
                          ((parseFloat(selectedAnimal.currentWeight) -
                            parseFloat(selectedAnimal.entryWeight)) /
                            parseFloat(selectedAnimal.entryWeight)) *
                          100
                        ).toFixed(1)}
                        %
                      </p>
                    </CardContent>
                  </Card>
                  <Card className="border-2 border-purple-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Scale className="h-4 w-4 text-purple-600" />
                        <p className="text-sm text-gray-600">عدد القياسات</p>
                      </div>
                      <p className="text-2xl font-bold text-purple-600">
                        {generateWeightHistory(selectedAnimal).length}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
