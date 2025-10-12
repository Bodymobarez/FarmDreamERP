import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  Download,
  Filter,
  DollarSign,
  Package,
  Beef,
  FileText,
  FileSpreadsheet,
  FileDown,
  ChevronDown,
  Calculator,
  Target,
  Calendar,
  Activity
} from "lucide-react";
import { exportToPDF, exportToExcel, exportToCSV, previewReportOrientation } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

export default function ProfitLossReport() {
  const [filterLevel, setFilterLevel] = useState<string>("batch");
  const [selectedBatch, setSelectedBatch] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("animal");
  const { toast } = useToast();

  // جلب البيانات الحقيقية من API
  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });
  
  const { data: batches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });
  
  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });
  
  // حساب تقارير الحيوانات من البيانات الحقيقية
  const animalReports = animals.map((animal: any) => {
    const purchaseCost = parseFloat(animal.purchasePrice || "0");
    const currentWeight = parseFloat(animal.currentWeight || "0");
    const entryWeight = parseFloat(animal.entryWeight || "0");
    const weightGain = currentWeight - entryWeight;
    const daysInFarm = animal.entryDate ? 
      Math.floor((new Date().getTime() - new Date(animal.entryDate).getTime()) / (1000 * 60 * 60 * 24)) : 0;
    const dailyGain = daysInFarm > 0 ? weightGain / daysInFarm : 0;
    const feedCost = parseFloat(animal.feedCost || "0");
    const treatmentCost = parseFloat(animal.treatmentCost || "0");
    const otherCost = parseFloat(animal.otherCost || "0");
    const totalCost = purchaseCost + feedCost + treatmentCost + otherCost;
    const salePrice = parseFloat(animal.salePrice || "0");
    const profit = salePrice - totalCost;
    const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    
    return {
      id: animal.id,
      earTag: animal.earTag,
      batchNumber: animal.batchNumber || "غير محدد",
      entryWeight,
      entryDate: animal.entryDate,
      saleWeight: currentWeight,
      saleDate: animal.saleDate,
      daysInFarm,
      purchaseCost,
      feedCost,
      treatmentCost,
      otherCost,
      totalCost,
      salePrice,
      profit,
      profitPercentage,
      weightGain,
      dailyGain,
    };
  });

  // حساب تقارير الدفعات من البيانات الحقيقية
  const batchReports = batches.map((batch: any) => {
    const batchAnimals = animals.filter((a: any) => a.batchId === batch.id);
    const totalPurchaseCost = batchAnimals.reduce((sum: number, a: any) => sum + parseFloat(a.purchasePrice || "0"), 0);
    const totalFeedCost = batchAnimals.reduce((sum: number, a: any) => sum + parseFloat(a.feedCost || "0"), 0);
    const totalTreatmentCost = batchAnimals.reduce((sum: number, a: any) => sum + parseFloat(a.treatmentCost || "0"), 0);
    const totalOtherCost = batchAnimals.reduce((sum: number, a: any) => sum + parseFloat(a.otherCost || "0"), 0);
    const totalCost = totalPurchaseCost + totalFeedCost + totalTreatmentCost + totalOtherCost;
    const totalSalePrice = batchAnimals.reduce((sum: number, a: any) => sum + parseFloat(a.salePrice || "0"), 0);
    const profit = totalSalePrice - totalCost;
    const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;
    
    return {
      id: batch.id,
      batchNumber: batch.batchNumber,
      totalAnimals: batch.totalAnimals || batchAnimals.length,
      totalPurchaseCost,
      totalFeedCost,
      totalTreatmentCost,
      totalOtherCost,
      totalCost,
      totalSalePrice,
      profit,
      profitPercentage,
      startDate: batch.startDate,
      endDate: batch.endDate,
    };
  });
  
  const generalReports = [
    {
      id: "1",
      batchNumber: "الدفعة الأولى",
      batchName: "دفعة يناير 2024",
      startDate: "2024-01-01",
      totalAnimals: 50,
      soldAnimals: 10,
      activeAnimals: 38,
      deceasedAnimals: 2,
      purchaseCost: 250000,
      feedCost: 45000,
      treatmentCost: 12000,
      otherExpenses: 8000,
      totalCost: 315000,
      totalRevenue: 85000,
      profit: -230000,
      profitPercentage: -73.02,
      averageCostPerAnimal: 6300,
      averageRevenuePerAnimal: 8500,
      averageProfitPerAnimal: 2200,
    },
    {
      id: "2",
      batchNumber: "الدفعة الثانية",
      batchName: "دفعة فبراير 2024",
      startDate: "2024-02-01",
      totalAnimals: 40,
      soldAnimals: 38,
      activeAnimals: 0,
      deceasedAnimals: 2,
      purchaseCost: 200000,
      feedCost: 52000,
      treatmentCost: 15000,
      otherExpenses: 10000,
      totalCost: 277000,
      totalRevenue: 340000,
      profit: 63000,
      profitPercentage: 22.74,
      averageCostPerAnimal: 6925,
      averageRevenuePerAnimal: 8500,
      averageProfitPerAnimal: 1575,
    },
  ];

  // تقرير مقارنة بين مجموعات
  const groupComparison = [
    {
      group: "حيوانات الوزن الثقيل (>400 كجم)",
      count: 15,
      averageCost: 6500,
      averageRevenue: 9200,
      averageProfit: 2700,
      profitPercentage: 41.54,
      totalProfit: 40500,
    },
    {
      group: "حيوانات الوزن المتوسط (300-400 كجم)",
      count: 25,
      averageCost: 6100,
      averageRevenue: 8500,
      averageProfit: 2400,
      profitPercentage: 39.34,
      totalProfit: 60000,
    },
    {
      group: "حيوانات الوزن الخفيف (<300 كجم)",
      count: 8,
      averageCost: 5800,
      averageRevenue: 7800,
      averageProfit: 2000,
      profitPercentage: 34.48,
      totalProfit: 16000,
    },
  ];

  const overallStats = [
    {
      title: "إجمالي الأرباح المحققة",
      value: `${(animalReports.reduce((sum, a) => sum + a.profit, 0)).toLocaleString()} جنيه مصري`,
      change: "+15.3%",
      icon: TrendingUp,
      color: "text-green-500",
    },
    {
      title: "عدد الحيوانات المباعة",
      value: animalReports.length,
      change: "من 50 حيوان",
      icon: Beef,
      color: "text-blue-500",
    },
    {
      title: "متوسط الربح لكل حيوان",
      value: `${Math.round(animalReports.reduce((sum, a) => sum + a.profit, 0) / animalReports.length).toLocaleString()} جنيه مصري`,
      change: "ممتاز",
      icon: DollarSign,
      color: "text-purple-500",
    },
    {
      title: "معدل نسبة الربح",
      value: `${(animalReports.reduce((sum, a) => sum + a.profitPercentage, 0) / animalReports.length).toFixed(2)}%`,
      change: "فوق المتوسط",
      icon: BarChart3,
      color: "text-orange-500",
    },
  ];

  // Export functions
  const prepareAnimalExportData = () => {
    return animalReports.map((animal) => [
      animal.earTag,
      animal.batchNumber,
      `${animal.entryWeight} كجم`,
      `${animal.saleWeight} كجم`,
      `+${animal.weightGain} كجم (${animal.dailyGain.toFixed(2)} كجم/يوم)`,
      `${animal.daysInFarm} يوم`,
      `${animal.totalCost.toLocaleString('ar-EG')} ج.م`,
      `${animal.salePrice.toLocaleString('ar-EG')} ج.م`,
      `${animal.profit.toLocaleString('ar-EG')} ج.م`,
      `+${animal.profitPercentage.toFixed(2)}%`,
      new Date(animal.entryDate).toLocaleDateString('ar-EG'),
      new Date(animal.saleDate).toLocaleDateString('ar-EG'),
      `شراء: ${animal.purchaseCost} | أعلاف: ${animal.feedCost} | علاج: ${animal.treatmentCost}`
    ]);
  };

  const prepareBatchExportData = () => {
    return batchReports.map((batch) => [
      batch.batchNumber,
      batch.batchName,
      new Date(batch.startDate).toLocaleDateString('ar-EG'),
      `إجمالي: ${batch.totalAnimals} | مباع: ${batch.soldAnimals} | نشط: ${batch.activeAnimals} | نافق: ${batch.deceasedAnimals}`,
      `${batch.totalCost.toLocaleString('ar-EG')} ج.م`,
      `${batch.totalRevenue.toLocaleString('ar-EG')} ج.م`,
      `${batch.profit >= 0 ? '+' : ''}${batch.profit.toLocaleString('ar-EG')} ج.م`,
      `${batch.profit >= 0 ? '+' : ''}${batch.profitPercentage.toFixed(2)}%`,
      `${batch.averageCostPerAnimal.toLocaleString('ar-EG')} ج.م`,
      `${batch.averageRevenuePerAnimal.toLocaleString('ar-EG')} ج.م`,
      `${batch.averageProfitPerAnimal >= 0 ? '+' : ''}${batch.averageProfitPerAnimal.toLocaleString('ar-EG')} ج.م`
    ]);
  };

  const prepareGroupExportData = () => {
    return groupComparison.map((group) => [
      group.group,
      `${group.count} حيوان`,
      `${group.averageCost.toLocaleString('ar-EG')} ج.م`,
      `${group.averageRevenue.toLocaleString('ar-EG')} ج.م`,
      `${group.averageProfit.toLocaleString('ar-EG')} ج.م`,
      `+${group.profitPercentage.toFixed(2)}%`,
      `${group.totalProfit.toLocaleString('ar-EG')} ج.م`
    ]);
  };

  const getExportData = () => {
    switch (activeTab) {
      case 'animal':
        return {
          headers: [
            "رقم الأذن", "الدفعة", "وزن الدخول", "وزن البيع", "الزيادة", 
            "المدة", "التكلفة الإجمالية", "سعر البيع", "صافي الربح", "نسبة الربح",
            "تاريخ الدخول", "تاريخ البيع", "تفصيل التكاليف"
          ],
          data: prepareAnimalExportData(),
          title: "تقرير الأرباح والخسائر - مستوى الحيوان"
        };
      case 'batch':
        return {
          headers: [
            "رقم الدفعة", "اسم الدفعة", "تاريخ البدء", "إحصائيات الحيوانات",
            "إجمالي التكاليف", "إجمالي الإيرادات", "صافي الربح/الخسارة", "نسبة الربح",
            "متوسط التكلفة/حيوان", "متوسط الإيراد/حيوان", "متوسط الربح/حيوان"
          ],
          data: prepareBatchExportData(),
          title: "تقرير الأرباح والخسائر - مستوى الدفعة"
        };
      case 'group':
        return {
          headers: [
            "المجموعة", "العدد", "متوسط التكلفة", "متوسط الإيرادات",
            "متوسط الربح", "نسبة الربح", "إجمالي الربح"
          ],
          data: prepareGroupExportData(),
          title: "تقرير الأرباح والخسائر - مستوى المجموعة"
        };
      default:
        return {
          headers: [],
          data: [],
          title: ""
        };
    }
  };

  const handleExportPDF = async () => {
    try {
      const exportData = getExportData();
      const orientationPreview = previewReportOrientation(exportData.headers, exportData.data);
      console.log('🔍 معاينة توجه تقرير الأرباح والخسائر:', orientationPreview);
      
      const success = await exportToPDF(
        exportData.title,
        exportData.headers,
        exportData.data,
        `profit_loss_report_${activeTab}_${new Date().toISOString().split('T')[0]}.pdf`
      );
      
      if (success) {
        const totalProfit = activeTab === 'animal' 
          ? animalReports.reduce((sum, a) => sum + a.profit, 0)
          : activeTab === 'batch'
          ? batchReports.reduce((sum, b) => sum + b.profit, 0)
          : groupComparison.reduce((sum, g) => sum + g.totalProfit, 0);
          
        toast({
          title: "✅ تم تصدير PDF بنجاح",
          description: `تم تصدير تقرير ${exportData.title} بتوجه ${orientationPreview.recommendedOrientation === 'landscape' ? 'أفقي' : 'عمودي'} بإجمالي أرباح ${totalProfit.toLocaleString('ar-EG')} ج.م`,
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
      const exportData = getExportData();
      const success = exportToExcel(
        exportData.title,
        exportData.headers,
        exportData.data,
        `profit_loss_report_${activeTab}_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      
      if (success) {
        const totalProfit = activeTab === 'animal' 
          ? animalReports.reduce((sum, a) => sum + a.profit, 0)
          : activeTab === 'batch'
          ? batchReports.reduce((sum, b) => sum + b.profit, 0)
          : groupComparison.reduce((sum, g) => sum + g.totalProfit, 0);
          
        toast({
          title: "📊 تم تصدير Excel بنجاح",
          description: `تم تصدير ${exportData.data.length} سجل بإجمالي أرباح ${totalProfit.toLocaleString('ar-EG')} ج.م`,
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
      const exportData = getExportData();
      const success = exportToCSV(
        exportData.headers,
        exportData.data,
        `profit_loss_report_${activeTab}_${new Date().toISOString().split('T')[0]}.csv`
      );
      
      if (success) {
        const totalProfit = activeTab === 'animal' 
          ? animalReports.reduce((sum, a) => sum + a.profit, 0)
          : activeTab === 'batch'
          ? batchReports.reduce((sum, b) => sum + b.profit, 0)
          : groupComparison.reduce((sum, g) => sum + g.totalProfit, 0);
          
        toast({
          title: "📄 تم تصدير CSV بنجاح",
          description: `تم تصدير ${exportData.data.length} سجل بإجمالي أرباح ${totalProfit.toLocaleString('ar-EG')} ج.م`,
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

  return (
    <div className="space-y-6 p-6">
      {/* Header with Export Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-100 to-green-100">
            <Calculator className="h-8 w-8 text-emerald-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">تقرير الأرباح والخسائر</h1>
            <p className="text-gray-600 mt-1">
              تحليل مالي شامل للأرباح والخسائر على جميع المستويات مع مؤشرات الأداء
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            فلترة متقدمة
          </Button>
          
          {/* Export Dropdown Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="h-5 w-5 ml-2" />
                تصدير التقرير
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

      {/* Enhanced Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-emerald-600 mb-1">إجمالي الأرباح المحققة</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(animalReports.reduce((sum, a) => sum + a.profit, 0)).toLocaleString('ar-EG')} جنيه مصري
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  +15.3% عن الشهر السابق
                </p>
              </div>
              <div className="p-3 bg-emerald-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">عدد الحيوانات المباعة</p>
                <p className="text-3xl font-bold text-gray-900">{animalReports.length}</p>
                <p className="text-xs text-gray-600 mt-1">
                  من إجمالي 50 حيوان
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Beef className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">متوسط الربح لكل حيوان</p>
                <p className="text-3xl font-bold text-gray-900">
                  {Math.round(animalReports.reduce((sum, a) => sum + a.profit, 0) / animalReports.length).toLocaleString('ar-EG')} جنيه مصري
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  أداء ممتاز
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">معدل نسبة الربح</p>
                <p className="text-3xl font-bold text-gray-900">
                  {(animalReports.reduce((sum, a) => sum + a.profitPercentage, 0) / animalReports.length).toFixed(1)}%
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  فوق المتوسط المطلوب
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <Target className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Financial Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">إجمالي الإيرادات</p>
                <p className="text-2xl font-bold text-green-900">
                  ج.م {animalReports.reduce((sum, a) => sum + a.salePrice, 0).toLocaleString('ar-EG')}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-red-200 bg-gradient-to-r from-red-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">إجمالي التكاليف</p>
                <p className="text-2xl font-bold text-red-900">
                  ج.م {animalReports.reduce((sum, a) => sum + a.totalCost, 0).toLocaleString('ar-EG')}
                </p>
              </div>
              <Package className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-blue-200 bg-gradient-to-r from-blue-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">فترة التربية المتوسطة</p>
                <p className="text-2xl font-bold text-blue-900">
                  {Math.round(animalReports.reduce((sum, a) => sum + a.daysInFarm, 0) / animalReports.length)} يوم
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enhanced Navigation Tabs */}
      <Card className="border-t-4 border-t-blue-500 shadow-lg">
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 h-12">
              <TabsTrigger 
                value="animal" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-blue-100"
              >
                <Beef className="ml-2 h-4 w-4" />
                <span className="font-medium">مستوى الحيوان</span>
              </TabsTrigger>
              <TabsTrigger 
                value="batch" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-blue-100"
              >
                <Package className="ml-2 h-4 w-4" />
                <span className="font-medium">مستوى المجموعة</span>
              </TabsTrigger>
              <TabsTrigger 
                value="group" 
                className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 hover:bg-blue-100"
              >
                <BarChart3 className="ml-2 h-4 w-4" />
                <span className="font-medium">مستوى التصنيف</span>
              </TabsTrigger>
            </TabsList>

            {/* Animal Level Report */}
            <TabsContent value="animal" className="space-y-6 mt-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Beef className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">تقرير الأرباح والخسائر - مستوى الحيوان</h3>
                    <p className="text-sm text-gray-600">تحليل مفصل لأرباح كل حيوان على حدة</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Select value={selectedBatch} onValueChange={setSelectedBatch}>
                    <SelectTrigger className="w-[200px] border-blue-200 focus:ring-blue-500">
                      <SelectValue placeholder="اختر الدفعة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">🐄 جميع الدفعات</SelectItem>
                      <SelectItem value="1">📦 الدفعة الأولى</SelectItem>
                      <SelectItem value="2">📦 الدفعة الثانية</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200">
                        <TableHead className="text-right font-bold text-blue-900 py-4">🏷️ رقم الأذن</TableHead>
                        <TableHead className="text-right font-bold text-blue-900">📦 الدفعة</TableHead>
                        <TableHead className="text-right font-bold text-blue-900">⚖️ وزن الدخول</TableHead>
                        <TableHead className="text-right font-bold text-blue-900">🎯 وزن البيع</TableHead>
                        <TableHead className="text-right font-bold text-blue-900">📈 الزيادة</TableHead>
                        <TableHead className="text-right font-bold text-blue-900">📅 المدة</TableHead>
                        <TableHead className="text-right font-bold text-blue-900">💰 التكلفة</TableHead>
                        <TableHead className="text-right font-bold text-blue-900">💵 سعر البيع</TableHead>
                        <TableHead className="text-right font-bold text-blue-900">💎 الربح</TableHead>
                        <TableHead className="text-right font-bold text-blue-900">📊 نسبة الربح</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {animalReports.map((animal, index) => (
                        <TableRow 
                          key={animal.id} 
                          className={`hover:bg-blue-50/50 transition-colors duration-200 ${
                            index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                          }`}
                        >
                          <TableCell className="font-bold text-blue-900 py-4">
                            {animal.earTag}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-300">
                              {animal.batchNumber}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-medium">{animal.entryWeight} كجم</TableCell>
                          <TableCell className="font-medium">{animal.saleWeight} كجم</TableCell>
                          <TableCell>
                            <div className="text-emerald-600 font-bold">
                              +{animal.weightGain} كجم
                            </div>
                            <div className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded mt-1">
                              {animal.dailyGain.toFixed(2)} كجم/يوم
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary" className="bg-gray-100">
                              {animal.daysInFarm} يوم
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-red-600 font-bold">
                              ج.م {animal.totalCost.toLocaleString('ar-EG')}
                            </div>
                            <div className="text-xs text-gray-500 bg-red-50 px-2 py-1 rounded mt-1">
                              شراء: {animal.purchaseCost} | أعلاف: {animal.feedCost}
                            </div>
                          </TableCell>
                          <TableCell className="font-bold text-green-700">
                            ج.م {animal.salePrice.toLocaleString('ar-EG')}
                          </TableCell>
                          <TableCell className="font-bold text-emerald-600">
                            ج.م {animal.profit.toLocaleString('ar-EG')}
                          </TableCell>
                          <TableCell>
                            <Badge className={`font-bold ${
                              animal.profitPercentage > 40 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : animal.profitPercentage > 25 
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                              +{animal.profitPercentage.toFixed(1)}%
                            </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-gradient-to-r from-blue-100 to-indigo-100 font-bold border-t-2 border-blue-300">
                      <TableCell colSpan={6} className="text-right py-4">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-blue-600" />
                          <span className="text-blue-900 font-bold">الإجمالي النهائي ({animalReports.length} حيوان)</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-red-700 font-bold py-4">
                        ج.م {animalReports.reduce((sum, a) => sum + a.totalCost, 0).toLocaleString('ar-EG')}
                      </TableCell>
                      <TableCell className="text-green-700 font-bold py-4">
                        ج.م {animalReports.reduce((sum, a) => sum + a.salePrice, 0).toLocaleString('ar-EG')}
                      </TableCell>
                      <TableCell className="text-emerald-700 font-bold py-4">
                        ج.م {animalReports.reduce((sum, a) => sum + a.profit, 0).toLocaleString('ar-EG')}
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className="bg-emerald-200 text-emerald-900 font-bold px-3 py-1">
                          +{(animalReports.reduce((sum, a) => sum + a.profitPercentage, 0) / animalReports.length).toFixed(1)}%
                        </Badge>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </div>
              </div>
            </TabsContent>

            {/* Batch Level Report */}
            <TabsContent value="batch" className="space-y-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Package className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">تقرير الأرباح والخسائر - مستوى المجموعة</h3>
                  <p className="text-sm text-gray-600">مقارنة الأداء المالي بين المجموعات المختلفة</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-purple-50 to-indigo-50 border-b border-purple-200">
                        <TableHead className="text-right font-bold text-purple-900 py-4">📦 المجموعة</TableHead>
                        <TableHead className="text-right font-bold text-purple-900">🔢 العدد</TableHead>
                        <TableHead className="text-right font-bold text-purple-900">💰 متوسط التكلفة</TableHead>
                        <TableHead className="text-right font-bold text-purple-900">💵 متوسط الإيرادات</TableHead>
                        <TableHead className="text-right font-bold text-purple-900">💎 متوسط الربح</TableHead>
                        <TableHead className="text-right font-bold text-purple-900">📊 نسبة الربح</TableHead>
                        <TableHead className="text-right font-bold text-purple-900">💰 إجمالي الربح</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {groupComparison.map((group, index) => (
                      <TableRow 
                        key={index} 
                        className={`hover:bg-purple-50/50 transition-colors duration-200 ${
                          index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                        }`}
                      >
                        <TableCell className="font-bold text-purple-900 py-4">
                          {group.group}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-300">
                            {group.count} حيوان
                          </Badge>
                        </TableCell>
                        <TableCell className="text-red-600 font-bold">
                          ج.م {group.averageCost.toLocaleString('ar-EG')}
                        </TableCell>
                        <TableCell className="text-green-600 font-bold">
                          ج.م {group.averageRevenue.toLocaleString('ar-EG')}
                        </TableCell>
                        <TableCell className="font-bold text-emerald-600">
                          ج.م {group.averageProfit.toLocaleString('ar-EG')}
                        </TableCell>
                        <TableCell>
                          <Badge className={`font-bold ${
                            group.profitPercentage > 35 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : group.profitPercentage > 25 
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            +{group.profitPercentage.toFixed(1)}%
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-emerald-600">
                          ج.م {group.totalProfit.toLocaleString('ar-EG')}
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-gradient-to-r from-purple-100 to-indigo-100 font-bold border-t-2 border-purple-300">
                      <TableCell className="py-4">
                        <div className="flex items-center gap-2">
                          <Calculator className="h-5 w-5 text-purple-600" />
                          <span className="text-purple-900 font-bold">الإجمالي النهائي</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-4">
                        <Badge className="bg-purple-200 text-purple-900 font-bold">
                          {groupComparison.reduce((sum, g) => sum + g.count, 0)} حيوان
                        </Badge>
                      </TableCell>
                      <TableCell colSpan={4} className="text-right text-purple-900 font-bold py-4">
                        إجمالي الأرباح المحققة
                      </TableCell>
                      <TableCell className="text-emerald-700 font-bold py-4">
                        ج.م {groupComparison.reduce((sum, g) => sum + g.totalProfit, 0).toLocaleString('ar-EG')}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </div>
              </div>
            </TabsContent>

            {/* Group Level Report */}
            <TabsContent value="group" className="space-y-6 mt-6">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">تقرير الأرباح والخسائر - مستوى التصنيف</h3>
                  <p className="text-sm text-gray-600">تحليل الأداء المالي حسب دفعات الشراء والتربية</p>
                </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200">
                        <TableHead className="text-right font-bold text-green-900 py-4">📦 الدفعة</TableHead>
                        <TableHead className="text-right font-bold text-green-900">📅 تاريخ البدء</TableHead>
                        <TableHead className="text-right font-bold text-green-900">🐄 الحيوانات</TableHead>
                        <TableHead className="text-right font-bold text-green-900">💰 التكاليف</TableHead>
                          <TableHead className="text-right font-bold text-green-900">💵 الإيرادات</TableHead>
                        <TableHead className="text-right font-bold text-green-900">💎 الربح/الخسارة</TableHead>
                        <TableHead className="text-right font-bold text-green-900">📊 نسبة الربح</TableHead>
                        <TableHead className="text-right font-bold text-green-900">🎯 متوسط الربح/حيوان</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {batchReports.map((batch, index) => (
                        <TableRow 
                          key={batch.id} 
                          className={`hover:bg-green-50/50 transition-colors duration-200 ${
                            index % 2 === 0 ? 'bg-gray-50/30' : 'bg-white'
                          }`}
                        >
                          <TableCell className="font-bold text-green-900 py-4">
                            <div className="font-bold">{batch.batchNumber}</div>
                            <div className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded mt-1">
                              {batch.batchName}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              {new Date(batch.startDate).toLocaleDateString("ar-EG")}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm space-y-1">
                              <div className="font-bold">إجمالي: {batch.totalAnimals}</div>
                              <div className="text-xs bg-green-50 px-2 py-1 rounded">
                                <span className="text-green-600">مباع: {batch.soldAnimals}</span> | 
                                <span className="text-blue-600"> نشط: {batch.activeAnimals}</span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-red-600 font-bold">
                              ج.م {batch.totalCost.toLocaleString('ar-EG')}
                            </div>
                            <div className="text-xs text-gray-500 bg-red-50 px-2 py-1 rounded mt-1">
                              متوسط: ج.م {batch.averageCostPerAnimal.toLocaleString('ar-EG')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-green-600 font-bold">
                              ج.م {batch.totalRevenue.toLocaleString('ar-EG')}
                            </div>
                            <div className="text-xs text-gray-500 bg-green-50 px-2 py-1 rounded mt-1">
                              متوسط: ج.م {batch.averageRevenuePerAnimal.toLocaleString('ar-EG')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className={`font-bold ${batch.profit >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                              {batch.profit >= 0 ? "+" : ""}ج.م {batch.profit.toLocaleString('ar-EG')}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={`font-bold ${
                                batch.profit >= 0
                                  ? "bg-emerald-100 text-emerald-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {batch.profit >= 0 ? <TrendingUp className="h-4 w-4 inline ml-1" /> : <TrendingDown className="h-4 w-4 inline ml-1" />}
                              {batch.profit >= 0 ? "+" : ""}{batch.profitPercentage.toFixed(1)}%
                            </Badge>
                          </TableCell>
                          <TableCell className={`font-bold ${batch.averageProfitPerAnimal >= 0 ? "text-emerald-600" : "text-red-600"}`}>
                            {batch.averageProfitPerAnimal >= 0 ? "+" : ""}ج.م {batch.averageProfitPerAnimal.toLocaleString('ar-EG')}
                          </TableCell>
                        </TableRow>
                      ))}
                      <TableRow className="bg-gradient-to-r from-green-100 to-emerald-100 font-bold border-t-2 border-green-300">
                        <TableCell colSpan={3} className="text-right py-4">
                          <div className="flex items-center gap-2">
                            <Calculator className="h-5 w-5 text-green-600" />
                            <span className="text-green-900 font-bold">الإجمالي النهائي - جميع الدفعات</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-red-700 font-bold py-4">
                          ج.م {batchReports.reduce((sum, b) => sum + b.totalCost, 0).toLocaleString('ar-EG')}
                        </TableCell>
                        <TableCell className="text-green-700 font-bold py-4">
                          ج.م {batchReports.reduce((sum, b) => sum + b.totalRevenue, 0).toLocaleString('ar-EG')}
                        </TableCell>
                        <TableCell className={`font-bold py-4 ${batchReports.reduce((sum, b) => sum + b.profit, 0) >= 0 ? "text-emerald-700" : "text-red-700"}`}>
                          ج.م {batchReports.reduce((sum, b) => sum + b.profit, 0).toLocaleString('ar-EG')}
                        </TableCell>
                        <TableCell className="py-4">
                          <Badge className="bg-emerald-200 text-emerald-900 font-bold px-3 py-1">
                            إجمالي {batchReports.reduce((sum, b) => sum + b.totalAnimals, 0)} حيوان
                          </Badge>
                        </TableCell>
                        <TableCell className="py-4"></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
