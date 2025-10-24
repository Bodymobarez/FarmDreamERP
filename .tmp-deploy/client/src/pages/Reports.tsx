import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  FileText,
  Calendar,
  Download,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Activity,
  Target,
  Wallet,
  LayoutGrid,
  List,
  BarChart,
  FileSpreadsheet,
  File,
} from "lucide-react";
import * as XLSX from "xlsx";
import { useToast } from "@/hooks/use-toast";

export default function Reports() {
  const [periodFilter, setPeriodFilter] = useState<string>("month");
  const [reportType, setReportType] = useState<string>("all");
  const [viewMode, setViewMode] = useState<"cards" | "table" | "chart">("cards");
  const { toast } = useToast();

  // البيانات التجريبية
  const financialSummary = {
    totalRevenue: 485000,
    totalExpenses: 312000,
    netProfit: 173000,
    profitMargin: 35.67,
  };

  const revenueBreakdown = {
    sales: 425000,
    receipts: 60000,
  };

  const expenseBreakdown = {
    purchases: 185000,
    inventory: 67000,
    salaries: 35000,
    veterinary: 15000,
    utilities: 10000,
  };

  const reports = [
    {
      id: "1",
      title: "تقرير المبيعات",
      description: "تفاصيل جميع عمليات البيع والإيرادات",
      icon: DollarSign,
      color: "from-green-500 to-green-600",
      bgColor: "border-green-200 bg-gradient-to-br from-green-50/50",
      iconBg: "bg-green-100 text-green-600",
      value: "0 ج",
      change: "0%",
      trend: "up",
      records: 47,
    },
    {
      id: "2",
      title: "تقرير المشتريات",
      description: "تفاصيل جميع عمليات الشراء والمصروفات",
      icon: ShoppingCart,
      color: "from-red-500 to-red-600",
      bgColor: "border-red-200 bg-gradient-to-br from-red-50/50",
      iconBg: "bg-red-100 text-red-600",
      value: "0 ج",
      change: "+8.3%",
      trend: "up",
      records: 34,
    },
    {
      id: "3",
      title: "تقرير العملاء",
      description: "حسابات العملاء والأرصدة والمعاملات",
      icon: Users,
      color: "from-blue-500 to-blue-600",
      bgColor: "border-blue-200 bg-gradient-to-br from-blue-50/50",
      iconBg: "bg-blue-100 text-blue-600",
      value: "5 عملاء",
      change: "+0 جديد",
      trend: "up",
      records: 5,
    },
    {
      id: "4",
      title: "تقرير الموردين",
      description: "حسابات الموردين والأرصدة والمعاملات",
      icon: Package,
      color: "from-purple-500 to-purple-600",
      bgColor: "border-purple-200 bg-gradient-to-br from-purple-50/50",
      iconBg: "bg-purple-100 text-purple-600",
      value: "5 موردين",
      change: "+0 جديد",
      trend: "up",
      records: 5,
    },
    {
      id: "5",
      title: "تقرير المخزون",
      description: "حالة المخزون والأصناف والحركات",
      icon: Package,
      color: "from-orange-500 to-orange-600",
      bgColor: "border-orange-200 bg-gradient-to-br from-orange-50/50",
      iconBg: "bg-orange-100 text-orange-600",
      value: "0 ج",
      change: "-5.2%",
      trend: "down",
      records: 15,
    },
    {
      id: "6",
      title: "تقرير المعاملات المالية",
      description: "جميع المعاملات المالية والحركات النقدية",
      icon: Wallet,
      color: "from-cyan-500 to-cyan-600",
      bgColor: "border-cyan-200 bg-gradient-to-br from-cyan-50/50",
      iconBg: "bg-cyan-100 text-cyan-600",
      value: "7 معاملات",
      change: "+0 جديد",
      trend: "up",
      records: 7,
    },
    {
      id: "7",
      title: "تقرير الأرباح والخسائر",
      description: "بيان الدخل والمصروفات والربح الصافي",
      icon: TrendingUp,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "border-emerald-200 bg-gradient-to-br from-emerald-50/50",
      iconBg: "bg-emerald-100 text-emerald-600",
      value: "173,000 ج",
      change: "+18.7%",
      trend: "up",
      records: 1,
    },
    {
      id: "8",
      title: "تقرير التدفقات النقدية",
      description: "التدفقات النقدية الداخلة والخارجة",
      icon: Activity,
      color: "from-indigo-500 to-indigo-600",
      bgColor: "border-indigo-200 bg-gradient-to-br from-indigo-50/50",
      iconBg: "bg-indigo-100 text-indigo-600",
      value: "173,000 ج",
      change: "+15.3%",
      trend: "up",
      records: 1,
    },
  ];

  const filteredReports =
    reportType === "all"
      ? reports
      : reports.filter((r) => r.id === reportType);

  // Export functions for all formats
  const handleExportAll = async (format: 'excel' | 'pdf' | 'csv' = 'excel') => {
    try {
      const exportData = reports.map(report => ({
        'نوع التقرير': report.title,
        'الوصف': report.description,
        'القيمة': report.value,
        'التغيير': report.change,
        'عدد السجلات': report.records.toString(),
        'الحالة': report.trend === 'up' ? 'صاعد' : 'هابط'
      }));

      if (format === 'excel') {
        const wb = XLSX.utils.book_new();
        
        // Summary sheet
        const summaryData = [
          ["الملخص المالي", ""],
          ["", ""],
          ["إجمالي الإيرادات", `${financialSummary.totalRevenue.toLocaleString('ar-EG')} ج`],
          ["إجمالي المصروفات", `${financialSummary.totalExpenses.toLocaleString('ar-EG')} ج`],
          ["صافي الربح", `${financialSummary.netProfit.toLocaleString('ar-EG')} ج`],
          ["هامش الربح", `${financialSummary.profitMargin}%`],
          ["", ""],
          ["الفترة", periodFilter === "month" ? "الشهر الحالي" : 
                      periodFilter === "quarter" ? "الربع الحالي" : 
                      periodFilter === "year" ? "السنة الحالية" : "مخصص"],
          ["تاريخ التصدير", new Date().toLocaleDateString('ar-EG')],
        ];
        
        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        ws1['!cols'] = [{ wch: 20 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws1, "الملخص المالي");
        
        // Reports sheet
        const ws2 = XLSX.utils.json_to_sheet(exportData);
        ws2['!cols'] = [{ wch: 25 }, { wch: 30 }, { wch: 15 }, { wch: 12 }, { wch: 12 }, { wch: 10 }];
        XLSX.utils.book_append_sheet(wb, ws2, "التقارير");
        
        // Write file
        XLSX.writeFile(wb, `التقارير_المالية_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.xlsx`);
        
        toast({
          title: "✅ تم التصدير بنجاح",
          description: "تم تصدير جميع التقارير إلى ملف Excel",
        });
      } else if (format === 'pdf') {
        // Dynamic import for jsPDF
        const { default: jsPDF } = await import('jspdf');
        await import('jspdf-autotable');
        
        const doc = new jsPDF();
        
        // Add Arabic font support
        doc.setFont("helvetica");
        doc.setFontSize(18);
        doc.text("Financial Reports", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text(`Period: ${periodFilter}`, 20, 35);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 45);
        
        // Add table
        const tableData = reports.map(report => [
          report.title,
          report.value,
          report.records.toString(),
          report.change,
          report.trend === 'up' ? '↑' : '↓'
        ]);
        
        (doc as any).autoTable({
          head: [['Report', 'Value', 'Records', 'Change', 'Trend']],
          body: tableData,
          startY: 55,
          styles: { font: 'helvetica', fontSize: 9 },
          headStyles: { fillColor: [59, 130, 246] },
        });
        
        doc.save(`التقارير_المالية_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.pdf`);
        
        toast({
          title: "✅ تم التصدير بنجاح",
          description: "تم تصدير جميع التقارير إلى ملف PDF",
        });
      } else if (format === 'csv') {
        const csvContent = [
          ['نوع التقرير', 'الوصف', 'القيمة', 'التغيير', 'عدد السجلات', 'الحالة'].join(','),
          ...exportData.map(row => 
            [row['نوع التقرير'], row['الوصف'], row['القيمة'], row['التغيير'], row['عدد السجلات'], row['الحالة']].join(',')
          )
        ].join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `التقارير_المالية_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.csv`;
        link.click();
        
        toast({
          title: "✅ تم التصدير بنجاح",
          description: "تم تصدير جميع التقارير إلى ملف CSV",
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "❌ خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التقارير",
        variant: "destructive",
      });
    }
  };  
  
  // وظيفة عرض تقرير محدد
  const handleViewReport = (reportId: string, reportTitle: string) => {
    // توجيه المستخدم حسب نوع التقرير
    const reportRoutes: { [key: string]: string } = {
      "1": "/financial-reports?tab=detailedRevenue", // تقرير المبيعات - الإيرادات التفصيلية
      "2": "/financial-reports?tab=detailedExpenses", // تقرير المشتريات - المصروفات التفصيلية
      "3": "/financial-reports?tab=customersBalances", // تقرير العملاء - أرصدة العملاء
      "4": "/financial-reports?tab=suppliersBalances", // تقرير الموردين - أرصدة الموردين
      "5": "/inventory", // تقرير المخزون
      "6": "/transactions", // تقرير المعاملات المالية
      "7": "/financial-reports?tab=profitLoss", // تقرير الأرباح والخسائر
      "8": "/financial-reports?tab=cashFlow", // تقرير التدفقات النقدية
    };

    const route = reportRoutes[reportId];
    
    if (route) {
      // عرض toast تأكيد
      toast({
        title: `📊 ${reportTitle}`,
        description: "جاري فتح التقرير التفصيلي...",
      });
      
      // التوجيه بعد وقت قصير
      setTimeout(() => {
        window.location.href = route;
      }, 500);
    } else {
      toast({
        title: `📊 ${reportTitle}`,
        description: "جاري تطوير هذا التقرير...",
      });
    }
  };

  // Export single report with all formats
  const handleExportReport = async (reportId: string, reportTitle: string, format: 'excel' | 'pdf' | 'csv' = 'excel') => {
    try {
      const report = reports.find(r => r.id === reportId);
      if (!report) return;

      if (format === 'excel') {
        const wb = XLSX.utils.book_new();
        const reportData = [
          [reportTitle, ""],
          [""],
          ["البيان", "القيمة"],
          ["القيمة", report.value],
          ["عدد السجلات", report.records],
          ["التغيير", report.change],
          ["الوصف", report.description],
        ];
        
        const ws = XLSX.utils.aoa_to_sheet(reportData);
        XLSX.utils.book_append_sheet(wb, ws, reportTitle);
        
        XLSX.writeFile(wb, `${reportTitle}_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.xlsx`);
        
        toast({
          title: "✅ تم التصدير بنجاح",
          description: `تم تصدير ${reportTitle} إلى Excel`,
        });
      } else if (format === 'pdf') {
        // Dynamic import for jsPDF
        const { default: jsPDF } = await import('jspdf');
        
        const doc = new jsPDF();
        
        doc.setFont("helvetica");
        doc.setFontSize(18);
        doc.text(reportTitle, 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text(`Value: ${report.value}`, 20, 40);
        doc.text(`Records: ${report.records}`, 20, 50);
        doc.text(`Change: ${report.change}`, 20, 60);
        doc.text(`Description: ${report.description}`, 20, 70);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 80);
        
        doc.save(`${reportTitle}_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.pdf`);
        
        toast({
          title: "✅ تم التصدير بنجاح",
          description: `تم تصدير ${reportTitle} إلى PDF`,
        });
      } else if (format === 'csv') {
        const csvContent = [
          ['البيان', 'القيمة'].join(','),
          ['القيمة', report.value].join(','),
          ['عدد السجلات', report.records].join(','),
          ['التغيير', report.change].join(','),
          ['الوصف', report.description].join(','),
        ].join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `${reportTitle}_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.csv`;
        link.click();
        
        toast({
          title: "✅ تم التصدير بنجاح",
          description: `تم تصدير ${reportTitle} إلى CSV`,
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "❌ خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير التقرير",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <BarChart3 className="w-7 h-7 text-white" />
            </div>
            التقارير المالية
          </h1>
          <p className="text-gray-600 mt-2">
            تقارير مالية شاملة وتحليلات تفصيلية لأداء المزرعة
          </p>
        </div>
        <div className="flex gap-3">
          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white rounded-lg border border-gray-200 p-1">
            <Button
              variant={viewMode === "cards" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("cards")}
              className="gap-2"
            >
              <LayoutGrid className="w-4 h-4" />
              بطاقات
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("table")}
              className="gap-2"
            >
              <List className="w-4 h-4" />
              جدول
            </Button>
            <Button
              variant={viewMode === "chart" ? "default" : "ghost"}
              size="sm"
              onClick={() => setViewMode("chart")}
              className="gap-2"
            >
              <BarChart className="w-4 h-4" />
              رسم بياني
            </Button>
          </div>
          
          {/* Export Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="outline" 
                className="gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 border-0"
              >
                <Download className="w-4 h-4" />
                تصدير الكل
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => handleExportAll('excel')} className="gap-2 cursor-pointer">
                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                <span>تصدير Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportAll('pdf')} className="gap-2 cursor-pointer">
                <File className="w-4 h-4 text-red-600" />
                <span>تصدير PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportAll('csv')} className="gap-2 cursor-pointer">
                <File className="w-4 h-4 text-blue-600" />
                <span>تصدير CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي الإيرادات 💰
              </p>
              <p className="text-2xl font-bold text-green-600">
                {financialSummary.totalRevenue.toLocaleString("ar-EG")} ج
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-600">
                  0%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                إجمالي المصروفات 💸
              </p>
              <p className="text-2xl font-bold text-red-600">
                {financialSummary.totalExpenses.toLocaleString("ar-EG")} ج
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-red-600" />
                <span className="text-sm font-medium text-red-600">
                  +8.3%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                صافي الربح 📊
              </p>
              <p className="text-2xl font-bold text-emerald-600">
                {financialSummary.netProfit.toLocaleString("ar-EG")} ج
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-emerald-600" />
                <span className="text-sm font-medium text-emerald-600">
                  +18.7%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">
                هامش الربح (جنيه مصري)
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {financialSummary.profitMargin.toFixed(2)}%
              </p>
              <div className="flex items-center gap-1 mt-2">
                <ArrowUpRight className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-medium text-blue-600">
                  +3.2%
                </span>
              </div>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <Select value={periodFilter} onValueChange={setPeriodFilter}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="w-4 h-4 ml-2" />
              <SelectValue placeholder="الفترة" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">📅 اليوم</SelectItem>
              <SelectItem value="week">📆 هذا الأسبوع</SelectItem>
              <SelectItem value="month">🗓️ هذا الشهر</SelectItem>
              <SelectItem value="quarter">📊 هذا الربع</SelectItem>
              <SelectItem value="year">📈 هذا العام</SelectItem>
            </SelectContent>
          </Select>

          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger className="w-[200px]">
              <FileText className="w-4 h-4 ml-2" />
              <SelectValue placeholder="نوع التقرير" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع التقارير</SelectItem>
              <SelectItem value="1">💰 المبيعات</SelectItem>
              <SelectItem value="2">🛒 المشتريات</SelectItem>
              <SelectItem value="3">👥 العملاء</SelectItem>
              <SelectItem value="4">📦 الموردين</SelectItem>
              <SelectItem value="5">📋 المخزون</SelectItem>
              <SelectItem value="6">💳 المعاملات المالية</SelectItem>
              <SelectItem value="7">📊 الأرباح والخسائر</SelectItem>
              <SelectItem value="8">💹 التدفقات النقدية</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Revenue and Expense Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-5 border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            تفصيل الإيرادات
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500"></div>
                <span className="text-sm font-medium">المبيعات</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-green-600">
                  {revenueBreakdown.sales.toLocaleString("ar-EG")} ج
                </p>
                <p className="text-xs text-gray-500">
                  {((revenueBreakdown.sales / financialSummary.totalRevenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-green-100">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                <span className="text-sm font-medium">المقبوضات</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-emerald-600">
                  {revenueBreakdown.receipts.toLocaleString("ar-EG")} ج
                </p>
                <p className="text-xs text-gray-500">
                  {((revenueBreakdown.receipts / financialSummary.totalRevenue) * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            تفصيل المصروفات
          </h3>
          <div className="space-y-3">
            {[
              { label: "المشتريات", value: expenseBreakdown.purchases, color: "bg-red-500" },
              { label: "المخزون", value: expenseBreakdown.inventory, color: "bg-orange-500" },
              { label: "الرواتب", value: expenseBreakdown.salaries, color: "bg-amber-500" },
              { label: "البيطرة", value: expenseBreakdown.veterinary, color: "bg-yellow-500" },
              { label: "المرافق", value: expenseBreakdown.utilities, color: "bg-rose-500" },
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white rounded-lg border border-red-100">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${item.color}`}></div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-red-600">
                    {item.value.toLocaleString("ar-EG")} ج
                  </p>
                  <p className="text-xs text-gray-500">
                    {((item.value / financialSummary.totalExpenses) * 100).toFixed(1)}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Reports Grid */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredReports.map((report) => {
            const Icon = report.icon;

            return (
              <Card
                key={report.id}
                className={`p-5 border-2 ${report.bgColor} hover:shadow-lg transition-all duration-300 cursor-pointer group`}
                onClick={() => handleViewReport(report.id, report.title)}
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 ${report.iconBg} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex gap-2">
                      {/* Export Dropdown */}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleExportReport(report.id, report.title, 'excel');
                          }} className="gap-2 cursor-pointer">
                            <FileSpreadsheet className="w-4 h-4 text-green-600" />
                            <span>Excel</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleExportReport(report.id, report.title, 'pdf');
                          }} className="gap-2 cursor-pointer">
                            <File className="w-4 h-4 text-red-600" />
                            <span>PDF</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleExportReport(report.id, report.title, 'csv');
                          }} className="gap-2 cursor-pointer">
                            <File className="w-4 h-4 text-blue-600" />
                            <span>CSV</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewReport(report.id, report.title);
                        }}
                        title="عرض"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {report.title}
                    </h3>
                    <p className="text-sm text-gray-600">{report.description}</p>
                  </div>

                  <div className="pt-3 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-500">القيمة</span>
                      <span className="text-lg font-bold text-gray-900">
                        {report.value}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-500">السجلات</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{report.records}</span>
                        <div className={`flex items-center gap-1 text-xs font-medium ${
                          report.trend === "up" ? "text-green-600" : "text-red-600"
                        }`}>
                          {report.trend === "up" ? (
                            <ArrowUpRight className="w-3 h-3" />
                          ) : (
                            <ArrowDownRight className="w-3 h-3" />
                          )}
                          {report.change}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card className="overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-amber-50 to-orange-50">
                <TableHead className="font-bold text-gray-900">نوع التقرير</TableHead>
                <TableHead className="font-bold text-gray-900">الوصف</TableHead>
                <TableHead className="font-bold text-gray-900 text-center">القيمة</TableHead>
                <TableHead className="font-bold text-gray-900 text-center">السجلات</TableHead>
                <TableHead className="font-bold text-gray-900 text-center">التغيير</TableHead>
                <TableHead className="font-bold text-gray-900 text-center">الإجراءات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => {
                const Icon = report.icon;
                return (
                  <TableRow 
                    key={report.id} 
                    className="hover:bg-amber-50/50 transition-colors cursor-pointer"
                    onClick={() => handleViewReport(report.id, report.title)}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${report.iconBg} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold">{report.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-gray-600">{report.description}</TableCell>
                    <TableCell className="text-center font-bold text-lg">{report.value}</TableCell>
                    <TableCell className="text-center">{report.records}</TableCell>
                    <TableCell className="text-center">
                      <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        report.trend === "up" 
                          ? "bg-green-100 text-green-700" 
                          : "bg-red-100 text-red-700"
                      }`}>
                        {report.trend === "up" ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {report.change}
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="flex items-center justify-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={(e) => e.stopPropagation()}
                              className="gap-1"
                            >
                              <Download className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleExportReport(report.id, report.title, 'excel');
                            }} className="gap-2 cursor-pointer">
                              <FileSpreadsheet className="w-4 h-4 text-green-600" />
                              <span>Excel</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleExportReport(report.id, report.title, 'pdf');
                            }} className="gap-2 cursor-pointer">
                              <File className="w-4 h-4 text-red-600" />
                              <span>PDF</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={(e) => {
                              e.stopPropagation();
                              handleExportReport(report.id, report.title, 'csv');
                            }} className="gap-2 cursor-pointer">
                              <File className="w-4 h-4 text-blue-600" />
                              <span>CSV</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewReport(report.id, report.title);
                          }}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}

      {/* Chart View */}
      {viewMode === "chart" && (
        <div className="space-y-4">
          <Card className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-amber-600" />
              مخطط التقارير المالية
            </h3>
            <div className="space-y-4">
              {filteredReports.map((report) => {
                const Icon = report.icon;
                // Calculate percentage for visual representation
                const maxValue = Math.max(...filteredReports.map(r => {
                  const numStr = r.value.replace(/[^\d.]/g, '');
                  return parseFloat(numStr) || 0;
                }));
                const currentValue = parseFloat(report.value.replace(/[^\d.]/g, '')) || 0;
                const percentage = maxValue > 0 ? (currentValue / maxValue) * 100 : 0;
                
                return (
                  <div 
                    key={report.id} 
                    className="group cursor-pointer hover:bg-amber-50/50 p-4 rounded-lg transition-all"
                    onClick={() => handleViewReport(report.id, report.title)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${report.iconBg} rounded-lg flex items-center justify-center`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900">{report.title}</h4>
                          <p className="text-sm text-gray-500">{report.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{report.value}</div>
                          <div className={`text-sm font-medium flex items-center gap-1 ${
                            report.trend === "up" ? "text-green-600" : "text-red-600"
                          }`}>
                            {report.trend === "up" ? (
                              <TrendingUp className="w-4 h-4" />
                            ) : (
                              <TrendingDown className="w-4 h-4" />
                            )}
                            {report.change}
                          </div>
                        </div>
                        
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Download className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleExportReport(report.id, report.title, 'excel');
                              }} className="gap-2 cursor-pointer">
                                <FileSpreadsheet className="w-4 h-4 text-green-600" />
                                <span>Excel</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleExportReport(report.id, report.title, 'pdf');
                              }} className="gap-2 cursor-pointer">
                                <File className="w-4 h-4 text-red-600" />
                                <span>PDF</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={(e) => {
                                e.stopPropagation();
                                handleExportReport(report.id, report.title, 'csv');
                              }} className="gap-2 cursor-pointer">
                                <File className="w-4 h-4 text-blue-600" />
                                <span>CSV</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`absolute inset-y-0 left-0 rounded-full bg-gradient-to-r ${
                          report.trend === "up" 
                            ? "from-green-400 to-green-600" 
                            : "from-amber-400 to-amber-600"
                        } transition-all duration-500 flex items-center justify-end px-3`}
                        style={{ width: `${percentage}%` }}
                      >
                        <span className="text-xs font-bold text-white">
                          {percentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                    
                    {/* Records Count */}
                    <div className="mt-2 flex items-center justify-between text-sm">
                      <span className="text-gray-500">عدد السجلات</span>
                      <span className="font-semibold text-gray-700">{report.records}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {filteredReports.length === 0 && (
        <Card className="p-12 text-center border-2 border-dashed border-amber-200">
          <BarChart3 className="w-16 h-16 text-amber-200 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">
            لا توجد تقارير تطابق معايير البحث
          </p>
        </Card>
      )}
    </div>
  );
}
