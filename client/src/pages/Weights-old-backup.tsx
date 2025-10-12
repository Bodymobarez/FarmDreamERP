import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Upload,
  Plus,
  TrendingUp,
  TrendingDown,
  Activity,
  Scale,
  Eye,
  FileText,
  Download,
  Package,
  Calendar,
} from "lucide-react";
import { AddWeightDialog } from "@/components/AddWeightDialog";
import { useToast } from "@/hooks/use-toast";
import { exportToPDF, exportToExcel, exportToCSV } from "@/lib/exportUtils";

export default function Weights() {
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterAnimalType, setFilterAnimalType] = useState("all");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch animals data
  const { data: animals = [], isLoading } = useQuery({
    queryKey: ["/api/animals"],
  });

  // Generate mock weight history for demonstration
  // In production, this should fetch from animalWeights table
  const generateWeightHistory = (animal: any) => {
    const entryWeight = parseFloat(animal.entryWeight || "0");
    const currentWeight = parseFloat(animal.currentWeight || "0");
    const entryDate = new Date(animal.entryDate || Date.now());
    const today = new Date();
    const daysSinceEntry = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceEntry <= 0 || currentWeight <= entryWeight) {
      return [{
        id: 0,
        date: entryDate,
        weight: entryWeight.toFixed(1),
        gain: "0.0",
        avgDailyGain: "0.00",
        daysElapsed: 0,
        cumulativeGain: "0.0",
      }];
    }

    const totalGain = currentWeight - entryWeight;
    const dailyGain = totalGain / daysSinceEntry;
    
    const history = [];
    const weeks = Math.min(Math.floor(daysSinceEntry / 7), 20); // Max 20 weeks for demo
    
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
      const weight = entryWeight + (dailyGain * daysElapsed);
      const weeklyGain = dailyGain * 7;
      const avgDailyGain = dailyGain;
      const cumulativeGain = weight - entryWeight;
      
      const measurementDate = new Date(entryDate);
      measurementDate.setDate(measurementDate.getDate() + daysElapsed);
      
      history.push({
        id: i,
        date: measurementDate,
        weight: weight.toFixed(1),
        gain: weeklyGain.toFixed(1),
        avgDailyGain: avgDailyGain.toFixed(2),
        daysElapsed,
        cumulativeGain: cumulativeGain.toFixed(1),
      });
    }
    
    // Current weight (if not exactly on a week)
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

  // Calculate Average Daily Gain
  const calculateADG = (animal: any) => {
    const entryWeight = parseFloat(animal.entryWeight || "0");
    const currentWeight = parseFloat(animal.currentWeight || "0");
    const entryDate = new Date(animal.entryDate || Date.now());
    const today = new Date();
    const daysSinceEntry = Math.floor((today.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceEntry <= 0) return 0;
    return ((currentWeight - entryWeight) / daysSinceEntry).toFixed(2);
  };

  // Filter animals
  const filteredAnimals = animals.filter((animal: any) => {
    const matchesSearch = animal.earTag?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterAnimalType === "all" || animal.animalType === filterAnimalType;
    return matchesSearch && matchesType;
  });

  // Calculate statistics
  const stats = {
    totalAnimals: animals.length,
    activeAnimals: animals.filter((a: any) => a.status === "نشط").length,
    avgCurrentWeight: animals.length > 0
      ? (animals.reduce((sum: number, a: any) => sum + parseFloat(a.currentWeight || "0"), 0) / animals.length).toFixed(1)
      : "0.0",
    avgWeightGain: animals.length > 0
      ? (animals.reduce((sum: number, a: any) => {
          const entry = parseFloat(a.entryWeight || "0");
          const current = parseFloat(a.currentWeight || "0");
          return sum + (current - entry);
        }, 0) / animals.length).toFixed(1)
      : "0.0",
  };

  // Get unique animal types for filter
  const animalTypes = Array.from(new Set(animals.map((a: any) => a.animalType).filter(Boolean)));

  // Export handlers
  const handleExportPDF = async () => {
    const headers = ["رقم الأذن", "النوع", "الجنس", "العنبر", "وزن الدخول", "الوزن الحالي", "الزيادة", "معدل الزيادة", "الحالة"];
    const data = filteredAnimals.map((animal: any) => [
      animal.earTag || "-",
      animal.animalType || "-",
      animal.sex || "-",
      animal.pen || "-",
      `${animal.entryWeight || "0"} كجم`,
      `${animal.currentWeight || "0"} كجم`,
      `${(parseFloat(animal.currentWeight || "0") - parseFloat(animal.entryWeight || "0")).toFixed(1)} كجم`,
      `${calculateADG(animal)} كجم/يوم`,
      animal.status || "-",
    ]);

    const success = await exportToPDF(
      "تقرير أوزان الحيوانات",
      headers,
      data,
      "تقرير_الأوزان.pdf"
    );

    if (success) {
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير البيانات إلى PDF بنجاح",
      });
    } else {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التقرير",
        variant: "destructive",
      });
    }
  };

  const handleExportExcel = () => {
    const headers = ["رقم الأذن", "النوع", "الجنس", "العنبر", "وزن الدخول (كجم)", "الوزن الحالي (كجم)", "الزيادة (كجم)", "معدل الزيادة اليومي", "الحالة"];
    const data = filteredAnimals.map((animal: any) => [
      animal.earTag || "-",
      animal.animalType || "-",
      animal.sex || "-",
      animal.pen || "-",
      animal.entryWeight || "0",
      animal.currentWeight || "0",
      (parseFloat(animal.currentWeight || "0") - parseFloat(animal.entryWeight || "0")).toFixed(1),
      calculateADG(animal),
      animal.status || "-",
    ]);

    const success = exportToExcel("تقرير الأوزان", headers, data, "تقرير_الأوزان.xlsx");

    if (success) {
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير البيانات إلى Excel بنجاح",
      });
    } else {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  const handleExportCSV = () => {
    const headers = ["رقم الأذن", "النوع", "الجنس", "العنبر", "وزن الدخول", "الوزن الحالي", "الزيادة", "معدل الزيادة", "الحالة"];
    const data = filteredAnimals.map((animal: any) => [
      animal.earTag || "-",
      animal.animalType || "-",
      animal.sex || "-",
      animal.pen || "-",
      animal.entryWeight || "0",
      animal.currentWeight || "0",
      (parseFloat(animal.currentWeight || "0") - parseFloat(animal.entryWeight || "0")).toFixed(1),
      calculateADG(animal),
      animal.status || "-",
    ]);

    const success = exportToCSV(headers, data, "تقرير_الأوزان.csv");

    if (success) {
      toast({
        title: "تم التصدير بنجاح",
        description: "تم تصدير البيانات إلى CSV بنجاح",
      });
    } else {
      toast({
        title: "خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير البيانات",
        variant: "destructive",
      });
    }
  };

  // Export individual animal report
  const handleExportAnimalReport = async (animal: any) => {
    try {
      console.log("Starting export for animal:", animal.earTag);
      
      const history = generateWeightHistory(animal);
      console.log("Generated history:", history.length, "records");
      
      const headers = ["التاريخ", "الأيام المنقضية", "الوزن", "الزيادة الأسبوعية", "متوسط الزيادة اليومية", "الزيادة التراكمية"];
      const data = history.map((record) => [
        new Date(record.date).toLocaleDateString("ar-EG"),
        record.daysElapsed.toString(),
        `${record.weight} كجم`,
        `${record.gain} كجم`,
        `${record.avgDailyGain} كجم/يوم`,
        `${record.cumulativeGain} كجم`,
      ]);

      console.log("Calling exportToPDF...");
      const success = await exportToPDF(
        `تقرير تفصيلي لأوزان الحيوان رقم ${animal.earTag}`,
        headers,
        data,
        `تقرير_أوزان_${animal.earTag}.pdf`
      );

      console.log("Export result:", success);

      if (success) {
        toast({
          title: "تم التصدير بنجاح",
          description: `تم تصدير تقرير الحيوان ${animal.earTag} بنجاح`,
        });
      } else {
        toast({
          title: "خطأ في التصدير",
          description: "حدث خطأ أثناء تصدير التقرير",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Export error:", error);
      toast({
        title: "خطأ في التصدير",
        description: error instanceof Error ? error.message : "حدث خطأ غير متوقع",
        variant: "destructive",
      });
    }
  };

  const handleViewDetails = (animal: any) => {
    setSelectedAnimal(animal);
    setIsDetailsOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">تسجيل الأوزان</h1>
          <p className="text-muted-foreground">متابعة أوزان الحيوانات ومعدلات النمو</p>
        </div>
        <div className="flex gap-3">
          <AddWeightDialog />
          <Button size="lg" variant="outline">
            <Upload className="w-5 h-5 ml-2" />
            استيراد من Excel
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              إجمالي الحيوانات
            </CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAnimals}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {stats.activeAnimals} نشط
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              متوسط الوزن الحالي
            </CardTitle>
            <Scale className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgCurrentWeight} كجم</div>
            <p className="text-xs text-muted-foreground mt-1">
              جميع الحيوانات
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              متوسط الزيادة
            </CardTitle>
            <TrendingUp className="w-4 h-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{stats.avgWeightGain} كجم</div>
            <p className="text-xs text-muted-foreground mt-1">
              منذ الدخول
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              معدل النمو
            </CardTitle>
            <Activity className="w-4 h-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {animals.length > 0
                ? (parseFloat(stats.avgWeightGain) / 60).toFixed(2)
                : "0.00"} كجم/يوم
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              متوسط يومي تقريبي
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Export */}
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <CardTitle>سجلات الأوزان</CardTitle>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" onClick={handleExportPDF}>
                <FileText className="w-4 h-4 ml-2" />
                PDF
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportExcel}>
                <Download className="w-4 h-4 ml-2" />
                Excel
              </Button>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="w-4 h-4 ml-2" />
                CSV
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Label htmlFor="search">بحث برقم الأذن</Label>
              <Input
                id="search"
                placeholder="ابحث برقم الأذن..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-48">
              <Label htmlFor="animalType">نوع الحيوان</Label>
              <select
                id="animalType"
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={filterAnimalType}
                onChange={(e) => setFilterAnimalType(e.target.value)}
              >
                <option value="all">الكل</option>
                {animalTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              جاري تحميل البيانات...
            </div>
          ) : filteredAnimals.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              لا توجد حيوانات مسجلة
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم الأذن</TableHead>
                    <TableHead className="text-right">النوع</TableHead>
                    <TableHead className="text-right">الجنس</TableHead>
                    <TableHead className="text-right">العنبر</TableHead>
                    <TableHead className="text-right">وزن الدخول</TableHead>
                    <TableHead className="text-right">الوزن الحالي</TableHead>
                    <TableHead className="text-right">الزيادة</TableHead>
                    <TableHead className="text-right">معدل الزيادة (ADG)</TableHead>
                    <TableHead className="text-right">الحالة</TableHead>
                    <TableHead className="text-right">الإجراءات</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAnimals.map((animal: any) => {
                    const entryWeight = parseFloat(animal.entryWeight || "0");
                    const currentWeight = parseFloat(animal.currentWeight || "0");
                    const gain = currentWeight - entryWeight;
                    const adg = calculateADG(animal);

                    return (
                      <TableRow key={animal.id}>
                        <TableCell className="font-medium">{animal.earTag}</TableCell>
                        <TableCell>{animal.animalType}</TableCell>
                        <TableCell>{animal.sex}</TableCell>
                        <TableCell>{animal.pen}</TableCell>
                        <TableCell>{entryWeight.toFixed(1)} كجم</TableCell>
                        <TableCell className="font-bold">{currentWeight.toFixed(1)} كجم</TableCell>
                        <TableCell>
                          <span className={gain > 0 ? "text-green-600 font-medium" : "text-muted-foreground"}>
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
                          <Badge variant={animal.status === "نشط" ? "default" : "secondary"}>
                            {animal.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(animal)}
                          >
                            <Eye className="w-4 h-4 ml-2" />
                            عرض التفاصيل
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

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
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">النوع</div>
                    <div className="text-lg font-bold">{selectedAnimal.animalType}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">وزن الدخول</div>
                    <div className="text-lg font-bold">{selectedAnimal.entryWeight} كجم</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">الوزن الحالي</div>
                    <div className="text-lg font-bold text-blue-600">
                      {selectedAnimal.currentWeight} كجم
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="pt-6">
                    <div className="text-sm text-muted-foreground">إجمالي الزيادة</div>
                    <div className="text-lg font-bold text-green-600">
                      +{(parseFloat(selectedAnimal.currentWeight) - parseFloat(selectedAnimal.entryWeight)).toFixed(1)} كجم
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Weight History Table */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold">سجل الأوزان</h3>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleExportAnimalReport(selectedAnimal)}
                  >
                    <FileText className="w-4 h-4 ml-2" />
                    تصدير التقرير
                  </Button>
                </div>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">الأيام المنقضية</TableHead>
                        <TableHead className="text-right">الوزن</TableHead>
                        <TableHead className="text-right">الزيادة الأسبوعية</TableHead>
                        <TableHead className="text-right">معدل الزيادة اليومية</TableHead>
                        <TableHead className="text-right">الزيادة التراكمية</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generateWeightHistory(selectedAnimal).map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              {new Date(record.date).toLocaleDateString("ar-EG")}
                            </div>
                          </TableCell>
                          <TableCell>{record.daysElapsed} يوم</TableCell>
                          <TableCell className="font-bold">{record.weight} كجم</TableCell>
                          <TableCell>
                            {record.id === 0 ? (
                              <span className="text-muted-foreground">-</span>
                            ) : (
                              <span className="text-green-600">+{record.gain} كجم</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.id === 0 ? (
                              <span className="text-muted-foreground">-</span>
                            ) : (
                              <span className="text-blue-600">{record.avgDailyGain} كجم/يوم</span>
                            )}
                          </TableCell>
                          <TableCell>
                            {record.id === 0 ? (
                              <span className="text-muted-foreground">-</span>
                            ) : (
                              <span className="font-medium">+{record.cumulativeGain} كجم</span>
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
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-green-600" />
                        <div className="text-sm text-muted-foreground">معدل الزيادة اليومية (ADG)</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">
                        {calculateADG(selectedAnimal)} كجم/يوم
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Activity className="w-4 h-4 text-blue-600" />
                        <div className="text-sm text-muted-foreground">نسبة الزيادة</div>
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        {((parseFloat(selectedAnimal.currentWeight) - parseFloat(selectedAnimal.entryWeight)) / parseFloat(selectedAnimal.entryWeight) * 100).toFixed(1)}%
                      </div>
                    </CardContent>
                  </Card>
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Scale className="w-4 h-4 text-purple-600" />
                        <div className="text-sm text-muted-foreground">عدد القياسات</div>
                      </div>
                      <div className="text-2xl font-bold text-purple-600">
                        {generateWeightHistory(selectedAnimal).length}
                      </div>
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
