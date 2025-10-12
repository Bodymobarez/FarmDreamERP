import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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
} from "@/components/ui/dropdown-menu";
import { Target, TrendingUp, AlertCircle, CheckCircle2, Clock, Plus, Trophy, Flame, Calendar, DollarSign, TrendingDown, Activity, Scale, Save, X, Info, Zap, Award, Hash, BarChart3, FileText, Package, Download, LayoutGrid, List, BarChart, FileSpreadsheet, File } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import * as XLSX from "xlsx";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

// Schema للتحقق من البيانات
const goalFormSchema = z.object({
  goalName: z.string().min(3, "اسم الهدف يجب أن يكون 3 أحرف على الأقل"),
  goalType: z.enum(["adg", "fcr", "survival_rate", "cost_per_head", "profit", "weight_gain", "feed_efficiency"]),
  targetValue: z.string().min(1, "القيمة المستهدفة مطلوبة"),
  currentValue: z.string().optional(),
  unit: z.string().optional(),
  batchId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type GoalFormValues = z.infer<typeof goalFormSchema>;

export default function Goals() {
  const { toast } = useToast();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"cards" | "table" | "chart">("cards");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPriority, setFilterPriority] = useState<string>("all");

  // Fetch goals data
  const { data: goalsData, refetch } = useQuery({
    queryKey: ["/api/performance-goals"],
  });
  const goals = (goalsData as any[]) || [];

  // Fetch batches for dropdown
  const { data: batchesData } = useQuery({
    queryKey: ["/api/batches"],
  });
  const batches = (batchesData as any[]) || [];

  // Form setup
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      goalName: "",
      goalType: "adg",
      targetValue: "",
      currentValue: "0",
      unit: "",
      batchId: "",
      startDate: "",
      endDate: "",
      priority: "medium",
      description: "",
      notes: "",
    },
  });

  // Mutation لإضافة هدف جديد
  const addGoalMutation = useMutation({
    mutationFn: async (values: GoalFormValues) => {
      const response = await fetch("/api/performance-goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          status: "active",
          startDate: values.startDate || new Date().toISOString(),
        }),
      });
      
      if (!response.ok) {
        throw new Error("فشل في إضافة الهدف");
      }
      
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "تم بنجاح!",
        description: "تم إضافة الهدف الجديد بنجاح",
      });
      refetch();
      setIsAddDialogOpen(false);
      form.reset();
    },
    onError: (error) => {
      toast({
        title: "خطأ",
        description: "فشل في إضافة الهدف. حاول مرة أخرى.",
        variant: "destructive",
      });
    },
  });

  // دالة لتحديد الوحدة تلقائياً حسب نوع الهدف
  const getDefaultUnit = (goalType: string) => {
    const units: { [key: string]: string } = {
      adg: "كجم/يوم",
      fcr: "",
      survival_rate: "%",
      cost_per_head: "ج",
      profit: "ج",
      weight_gain: "كجم",
      feed_efficiency: "%"
    };
    return units[goalType] || "";
  };

  const onSubmit = (values: GoalFormValues) => {
    addGoalMutation.mutate(values);
  };

  // وظائف التصدير
  const handleExportAll = async (format: 'excel' | 'pdf' | 'csv' = 'excel') => {
    try {
      const exportData = filteredGoals.map(goal => ({
        'اسم الهدف': goal.goalName,
        'النوع': translateGoalType(goal.goalType),
        'القيمة المستهدفة': `${goal.targetValue} ${goal.unit || ''}`,
        'القيمة الحالية': `${goal.currentValue || 0} ${goal.unit || ''}`,
        'نسبة الإنجاز': `${calculateProgress(goal).toFixed(1)}%`,
        'الحالة': translateStatus(goal.status),
        'الأولوية': translatePriority(goal.priority),
        'تاريخ البدء': goal.startDate ? new Date(goal.startDate).toLocaleDateString('ar-EG') : '-',
        'تاريخ الانتهاء': goal.endDate ? new Date(goal.endDate).toLocaleDateString('ar-EG') : '-',
      }));

      if (format === 'excel') {
        const wb = XLSX.utils.book_new();
        
        // Summary sheet
        const summaryData = [
          ["إحصائيات الأهداف", ""],
          ["", ""],
          ["إجمالي الأهداف", goals.length.toString()],
          ["الأهداف النشطة", activeGoals.toString()],
          ["الأهداف المحققة", achievedGoals.toString()],
          ["الأهداف الفاشلة", failedGoals.toString()],
          ["معدل الإنجاز", `${achievementRate}%`],
          ["", ""],
          ["تاريخ التصدير", new Date().toLocaleDateString('ar-EG')],
        ];
        
        const ws1 = XLSX.utils.aoa_to_sheet(summaryData);
        ws1['!cols'] = [{ wch: 20 }, { wch: 20 }];
        XLSX.utils.book_append_sheet(wb, ws1, "الإحصائيات");
        
        // Goals sheet
        const ws2 = XLSX.utils.json_to_sheet(exportData);
        ws2['!cols'] = [
          { wch: 25 }, { wch: 25 }, { wch: 20 }, { wch: 20 }, 
          { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 18 }
        ];
        XLSX.utils.book_append_sheet(wb, ws2, "الأهداف");
        
        XLSX.writeFile(wb, `الأهداف_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.xlsx`);
        
        toast({
          title: "✅ تم التصدير بنجاح",
          description: "تم تصدير جميع الأهداف إلى ملف Excel",
        });
      } else if (format === 'pdf') {
        const { default: jsPDF } = await import('jspdf');
        await import('jspdf-autotable');
        
        const doc = new jsPDF();
        doc.setFont("helvetica");
        doc.setFontSize(18);
        doc.text("Goals Report", 105, 20, { align: "center" });
        
        doc.setFontSize(12);
        doc.text(`Total Goals: ${goals.length}`, 20, 35);
        doc.text(`Achievement Rate: ${achievementRate}%`, 20, 45);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 20, 55);
        
        const tableData = filteredGoals.map(goal => [
          goal.goalName,
          translateGoalType(goal.goalType),
          `${goal.targetValue} ${goal.unit || ''}`,
          `${calculateProgress(goal).toFixed(1)}%`,
          translateStatus(goal.status),
        ]);
        
        (doc as any).autoTable({
          head: [['Goal', 'Type', 'Target', 'Progress', 'Status']],
          body: tableData,
          startY: 65,
          styles: { font: 'helvetica', fontSize: 9 },
          headStyles: { fillColor: [59, 130, 246] },
        });
        
        doc.save(`الأهداف_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.pdf`);
        
        toast({
          title: "✅ تم التصدير بنجاح",
          description: "تم تصدير جميع الأهداف إلى ملف PDF",
        });
      } else if (format === 'csv') {
        const csvContent = [
          Object.keys(exportData[0] || {}).join(','),
          ...exportData.map(row => Object.values(row).join(','))
        ].join('\n');
        
        const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `الأهداف_${new Date().toLocaleDateString('ar-EG').replace(/\//g, '-')}.csv`;
        link.click();
        
        toast({
          title: "✅ تم التصدير بنجاح",
          description: "تم تصدير جميع الأهداف إلى ملف CSV",
        });
      }
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "❌ خطأ في التصدير",
        description: "حدث خطأ أثناء تصدير الأهداف",
        variant: "destructive",
      });
    }
  };

  // Helper functions for translation
  const translateStatus = (status: string) => {
    const translations: { [key: string]: string } = {
      active: "نشط",
      achieved: "محقق",
      failed: "فاشل",
      expired: "منتهي",
    };
    return translations[status] || status;
  };

  const translatePriority = (priority: string) => {
    const translations: { [key: string]: string } = {
      critical: "حرج",
      high: "عالي",
      medium: "متوسط",
      low: "منخفض",
    };
    return translations[priority] || priority;
  };

  // حساب الإحصائيات
  const activeGoals = goals.filter(g => g.status === "active").length;
  const achievedGoals = goals.filter(g => g.status === "achieved").length;
  const failedGoals = goals.filter(g => g.status === "failed").length;
  const achievementRate = goals.length > 0 ? ((achievedGoals / goals.length) * 100).toFixed(1) : "0";

  // تصفية الأهداف
  const filteredGoals = goals.filter(goal => {
    const statusMatch = filterStatus === "all" || goal.status === filterStatus;
    const priorityMatch = filterPriority === "all" || goal.priority === filterPriority;
    return statusMatch && priorityMatch;
  });

  // دالة لحساب نسبة التقدم
  const calculateProgress = (goal: any) => {
    const target = parseFloat(goal.targetValue || 0);
    const current = parseFloat(goal.currentValue || 0);
    
    if (target === 0) return 0;
    
    // للمؤشرات التي الأقل أفضل (FCR, Cost)
    if (goal.goalType === "fcr" || goal.goalType === "cost_per_head") {
      const progress = ((target / current) * 100);
      return Math.min(Math.max(progress, 0), 100);
    }
    
    // للمؤشرات التي الأكثر أفضل (ADG, Survival Rate, Profit)
    const progress = ((current / target) * 100);
    return Math.min(Math.max(progress, 0), 100);
  };

  // دالة لتحديد لون الحالة
  const getStatusColor = (status: string) => {
    switch (status) {
      case "achieved":
        return "bg-green-500";
      case "active":
        return "bg-blue-500";
      case "failed":
        return "bg-red-500";
      case "expired":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  // دالة لتحديد لون الأولوية
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  // دالة لترجمة نوع الهدف
  const translateGoalType = (type: string) => {
    const translations: { [key: string]: string } = {
      adg: "معدل النمو اليومي (ADG)",
      fcr: "معامل التحويل الغذائي (FCR)",
      survival_rate: "معدل البقاء",
      cost_per_head: "التكلفة لكل رأس",
      profit: "الربح",
      weight_gain: "الزيادة في الوزن",
      feed_efficiency: "كفاءة الأعلاف"
    };
    return translations[type] || type;
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <Target className="w-7 h-7 text-white" />
            </div>
            إدارة الأهداف
          </h1>
          <p className="text-gray-600 mt-2">تتبع وإدارة أهداف الأداء للمزرعة</p>
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
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                تصدير
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

          {/* Add Goal Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800">
                <Plus className="h-4 w-4" />
                إضافة هدف جديد
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
                  <Target className="w-6 h-6 text-primary" />
                </div>
                <DialogTitle className="text-2xl">إضافة هدف جديد</DialogTitle>
              </div>
              <DialogDescription className="text-base">
                حدد الهدف المطلوب تحقيقه ومؤشرات الأداء المرتبطة به
              </DialogDescription>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-3">
                <div className="flex items-start gap-2">
                  <Info className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-sm text-blue-800">
                    💡 يمكنك تحديد أهداف على مستوى المزرعة بالكامل أو لدفعة معينة
                  </p>
                </div>
              </div>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
                {/* Section 1: معلومات أساسية */}
                <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-primary/10">
                        <Award className="w-4 h-4 text-primary" />
                      </div>
                      <CardTitle className="text-base">معلومات الهدف الأساسية</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* اسم الهدف */}
                    <FormField
                      control={form.control}
                      name="goalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 text-base">
                            <Hash className="w-3.5 h-3.5 text-primary" />
                            اسم الهدف
                            <span className="text-red-500">*</span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="مثال: تحسين معدل النمو اليومي للدفعة الحالية"
                              className="text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="flex items-center gap-1 text-xs">
                            <Info className="w-3 h-3" />
                            اختر اسماً واضحاً ومحدداً للهدف
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-2 gap-4">
                      {/* نوع الهدف */}
                      <FormField
                        control={form.control}
                        name="goalType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 text-base">
                              <BarChart3 className="w-3.5 h-3.5 text-blue-600" />
                              نوع الهدف
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                value={field.value}
                                onChange={(e) => {
                                  field.onChange(e.target.value);
                                  form.setValue("unit", getDefaultUnit(e.target.value));
                                }}
                              >
                                <option value="adg">📈 معدل النمو اليومي (ADG)</option>
                                <option value="fcr">🌾 معامل التحويل الغذائي (FCR)</option>
                                <option value="survival_rate">💚 معدل البقاء</option>
                                <option value="cost_per_head">💰 التكلفة لكل رأس</option>
                                <option value="profit">💵 الربح</option>
                                <option value="weight_gain">⚖️ الزيادة في الوزن</option>
                                <option value="feed_efficiency">⚡ كفاءة الأعلاف</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* الأولوية */}
                      <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 text-base">
                              <Zap className="w-3.5 h-3.5 text-orange-600" />
                              الأولوية
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <select
                                className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                {...field}
                              >
                                <option value="low">🟢 منخفضة</option>
                                <option value="medium">🟡 متوسطة</option>
                                <option value="high">🟠 عالية</option>
                                <option value="critical">🔴 حرجة</option>
                              </select>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Section 2: القيم والمقاييس */}
                <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-green-100">
                        <TrendingUp className="w-4 h-4 text-green-700" />
                      </div>
                      <CardTitle className="text-base">القيم والمقاييس</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      {/* القيمة المستهدفة */}
                      <FormField
                        control={form.control}
                        name="targetValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 text-base">
                              <Target className="w-3.5 h-3.5 text-green-600" />
                              القيمة المستهدفة
                              <span className="text-red-500">*</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="مثال: 1.2"
                                className="text-lg font-semibold bg-white"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              القيمة المطلوب الوصول إليها
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* القيمة الحالية */}
                      <FormField
                        control={form.control}
                        name="currentValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-1.5 text-base">
                              <Activity className="w-3.5 h-3.5 text-blue-600" />
                              القيمة الحالية
                              <span className="text-muted-foreground text-xs">(اختياري)</span>
                            </FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                step="0.01"
                                placeholder="مثال: 0.8"
                                className="text-lg font-semibold bg-white"
                                {...field}
                              />
                            </FormControl>
                            <FormDescription className="text-xs">
                              القيمة الحالية للمؤشر
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Section 3: التفاصيل الإضافية */}
                <Card className="border-amber-200 bg-gradient-to-br from-amber-50/30 to-transparent">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-md bg-amber-100">
                        <FileText className="w-4 h-4 text-amber-700" />
                      </div>
                      <CardTitle className="text-base">التفاصيل الإضافية</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* الدفعة */}
                    <FormField
                      control={form.control}
                      name="batchId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 text-base">
                            <Package className="w-3.5 h-3.5 text-purple-600" />
                            الدفعة
                            <span className="text-muted-foreground text-xs">(اختياري)</span>
                          </FormLabel>
                          <FormControl>
                            <select
                              className="flex h-10 w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                              {...field}
                            >
                              <option value="">🌍 جميع الدفعات (هدف عام على مستوى المزرعة)</option>
                              {batches.map((batch: any) => (
                                <option key={batch.id} value={batch.id}>
                                  📦 {batch.batchNumber} - {batch.animalType}
                                </option>
                              ))}
                            </select>
                          </FormControl>
                          <FormDescription className="flex items-center gap-1 text-xs">
                            <Info className="w-3 h-3" />
                            اختر دفعة محددة أو اتركه فارغاً للهدف العام
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* الوصف */}
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-1.5 text-base">
                            <FileText className="w-3.5 h-3.5 text-blue-600" />
                            الوصف التفصيلي
                            <span className="text-muted-foreground text-xs">(اختياري)</span>
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="مثال: نهدف لتحسين معدل النمو من خلال تحسين جودة الأعلاف وتقليل التوتر على الحيوانات..."
                              rows={4}
                              className="resize-none bg-white text-base"
                              {...field}
                            />
                          </FormControl>
                          <FormDescription className="text-xs">
                            اكتب تفاصيل إضافية عن الهدف والاستراتيجية المتبعة
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>
              </form>
            </Form>

            <div className="border-t pt-6 mt-6 bg-gradient-to-b from-transparent to-muted/20">
              <div className="flex justify-between items-center gap-3">
                <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4" />
                  <span className="text-red-500">*</span> الحقول المطلوبة
                </div>
                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (form.formState.isDirty) {
                        if (confirm("هل تريد إغلاق النموذج؟ سيتم فقد البيانات المدخلة.")) {
                          setIsAddDialogOpen(false);
                          form.reset();
                        }
                      } else {
                        setIsAddDialogOpen(false);
                        form.reset();
                      }
                    }}
                    disabled={addGoalMutation.isPending}
                    size="lg"
                    className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                  >
                    <X className="ml-2 h-5 w-5" />
                    إلغاء
                  </Button>
                  <Button 
                    onClick={form.handleSubmit(onSubmit)} 
                    disabled={addGoalMutation.isPending || !form.formState.isValid}
                    size="lg"
                    className="min-w-[150px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
                  >
                    {addGoalMutation.isPending ? (
                      <>
                        <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin ml-2" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <Save className="h-5 w-5 ml-2" />
                        حفظ الهدف
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأهداف النشطة</CardTitle>
            <Target className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeGoals}</div>
            <p className="text-xs text-muted-foreground">قيد التنفيذ حالياً</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأهداف المحققة</CardTitle>
            <Trophy className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{achievedGoals}</div>
            <p className="text-xs text-muted-foreground">تم تحقيقها بنجاح</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الأهداف الفاشلة</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{failedGoals}</div>
            <p className="text-xs text-muted-foreground">لم يتم تحقيقها</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">نسبة النجاح</CardTitle>
            <Flame className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{achievementRate}%</div>
            <p className="text-xs text-muted-foreground">من إجمالي الأهداف</p>
          </CardContent>
        </Card>
      </div>

      </div>

      {/* Filters */}
      <Card className="p-5">
        <div className="flex items-center gap-4 flex-wrap">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="حالة الهدف" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الحالات</SelectItem>
              <SelectItem value="active">🟢 نشط</SelectItem>
              <SelectItem value="achieved">✅ محقق</SelectItem>
              <SelectItem value="failed">❌ فاشل</SelectItem>
              <SelectItem value="expired">⏰ منتهي</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterPriority} onValueChange={setFilterPriority}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="الأولوية" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">جميع الأولويات</SelectItem>
              <SelectItem value="critical">🔴 حرج</SelectItem>
              <SelectItem value="high">🟠 عالي</SelectItem>
              <SelectItem value="medium">🟡 متوسط</SelectItem>
              <SelectItem value="low">🟢 منخفض</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex-1"></div>
          
          <div className="text-sm text-gray-600">
            عرض <span className="font-bold text-purple-600">{filteredGoals.length}</span> من {goals.length} هدف
          </div>
        </div>
      </Card>

      {/* Goals Display */}
      {filteredGoals.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Target className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium mb-2">لا توجد أهداف تطابق الفلاتر</p>
            <p className="text-sm text-muted-foreground mb-4">جرب تغيير معايير البحث</p>
            <Button onClick={() => { setFilterStatus("all"); setFilterPriority("all"); }}>
              إعادة تعيين الفلاتر
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Cards View */}
          {viewMode === "cards" && (
            <div className="grid gap-4">
              {filteredGoals.map((goal: any) => {
                const progress = calculateProgress(goal);
                const isAchieved = progress >= 100;
                
                return (
                  <Card key={goal.id} className={`transition-all hover:shadow-lg ${isAchieved ? 'border-green-500 bg-green-50/50' : ''}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <CardTitle className="text-lg">{goal.goalName}</CardTitle>
                            {isAchieved && (
                              <CheckCircle2 className="h-5 w-5 text-green-600" />
                            )}
                          </div>
                          <CardDescription>{translateGoalType(goal.goalType)}</CardDescription>
                        </div>
                        <div className="flex gap-2">
                          <Badge className={getPriorityColor(goal.priority)} variant="outline">
                            {translatePriority(goal.priority)}
                          </Badge>
                          <Badge className={getStatusColor(goal.status)}>
                            {translateStatus(goal.status)}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground mb-1">القيمة المستهدفة</p>
                          <p className="font-bold text-lg">{parseFloat(goal.targetValue).toFixed(2)} {goal.unit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">القيمة الحالية</p>
                          <p className="font-bold text-lg">{parseFloat(goal.currentValue || 0).toFixed(2)} {goal.unit}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-1">نسبة التقدم</p>
                          <p className="font-bold text-lg">{progress.toFixed(1)}%</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">التقدم</span>
                          <span className={`font-bold ${progress >= 100 ? 'text-green-600' : progress >= 75 ? 'text-blue-600' : progress >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                        <Progress 
                          value={progress} 
                          className={`h-3 ${
                            progress >= 100 ? '[&>div]:bg-green-600' :
                            progress >= 75 ? '[&>div]:bg-blue-600' :
                            progress >= 50 ? '[&>div]:bg-yellow-600' : '[&>div]:bg-red-600'
                          }`}
                        />
                      </div>

                      {goal.description && (
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">{goal.description}</p>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>بدأ: {new Date(goal.startDate).toLocaleDateString('ar-EG')}</span>
                        </div>
                        {goal.endDate && (
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>ينتهي: {new Date(goal.endDate).toLocaleDateString('ar-EG')}</span>
                          </div>
                        )}
                        {goal.achievedDate && (
                          <div className="flex items-center gap-1 text-green-600">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>تحقق: {new Date(goal.achievedDate).toLocaleDateString('ar-EG')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
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
                  <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50">
                    <TableHead className="font-bold text-gray-900">اسم الهدف</TableHead>
                    <TableHead className="font-bold text-gray-900">النوع</TableHead>
                    <TableHead className="font-bold text-gray-900 text-center">المستهدف</TableHead>
                    <TableHead className="font-bold text-gray-900 text-center">الحالي</TableHead>
                    <TableHead className="font-bold text-gray-900 text-center">التقدم</TableHead>
                    <TableHead className="font-bold text-gray-900 text-center">الحالة</TableHead>
                    <TableHead className="font-bold text-gray-900 text-center">الأولوية</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGoals.map((goal: any) => {
                    const progress = calculateProgress(goal);
                    return (
                      <TableRow key={goal.id} className="hover:bg-purple-50/50">
                        <TableCell className="font-semibold">{goal.goalName}</TableCell>
                        <TableCell>{translateGoalType(goal.goalType)}</TableCell>
                        <TableCell className="text-center">{parseFloat(goal.targetValue).toFixed(2)} {goal.unit}</TableCell>
                        <TableCell className="text-center">{parseFloat(goal.currentValue || 0).toFixed(2)} {goal.unit}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center gap-2">
                            <Progress value={progress} className="flex-1 h-2" />
                            <span className="text-xs font-bold min-w-[45px]">{progress.toFixed(1)}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={getStatusColor(goal.status)}>
                            {translateStatus(goal.status)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className={getPriorityColor(goal.priority)} variant="outline">
                            {translatePriority(goal.priority)}
                          </Badge>
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
            <Card className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <BarChart3 className="w-6 h-6 text-purple-600" />
                مخطط التقدم في الأهداف
              </h3>
              <div className="space-y-4">
                {filteredGoals.map((goal: any) => {
                  const progress = calculateProgress(goal);
                  return (
                    <div key={goal.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900">{goal.goalName}</h4>
                          <p className="text-sm text-gray-500">{translateGoalType(goal.goalType)}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-gray-900">{parseFloat(goal.currentValue || 0).toFixed(2)} {goal.unit}</div>
                          <div className="text-sm text-gray-500">من {parseFloat(goal.targetValue).toFixed(2)} {goal.unit}</div>
                        </div>
                      </div>
                      <div className="relative h-8 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 flex items-center justify-end px-3 ${
                            progress >= 100 ? 'bg-gradient-to-r from-green-400 to-green-600' :
                            progress >= 75 ? 'bg-gradient-to-r from-blue-400 to-blue-600' :
                            progress >= 50 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' :
                            'bg-gradient-to-r from-red-400 to-red-600'
                          }`}
                          style={{ width: `${Math.min(progress, 100)}%` }}
                        >
                          <span className="text-xs font-bold text-white">
                            {progress.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          )}
        </>
      )}
      </div>
  );
}
