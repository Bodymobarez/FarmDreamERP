import { useState, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { 
  Target, 
  Plus, 
  Award, 
  Hash, 
  Info, 
  BarChart3, 
  Calendar,
  TrendingUp,
  Users,
  Weight,
  DollarSign,
  Zap,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  AlertCircle,
  Calculator,
  Eye,
  LineChart,
  Package,
  Loader2
} from "lucide-react";

const goalFormSchema = z.object({
  goalName: z.string().min(3, "اسم الهدف يجب أن يكون 3 أحرف على الأقل"),
  goalType: z.string().min(1, "نوع الهدف مطلوب"),
  targetValue: z.string().min(1, "القيمة المستهدفة مطلوبة"),
  currentValue: z.string().optional(),
  unit: z.string().optional(),
  batchId: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  notes: z.string().optional(),
});

type GoalFormData = z.infer<typeof goalFormSchema>;

export function AddGoalDialog() {
  const [open, setOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState("info");
  const [selectedBatchData, setSelectedBatchData] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<GoalFormData>({
    resolver: zodResolver(goalFormSchema),
    defaultValues: {
      goalName: "",
      goalType: "",
      targetValue: "",
      currentValue: "0",
      unit: "",
      batchId: "",
      startDate: new Date().toISOString().split("T")[0],
      endDate: "",
      notes: "",
    },
  });

  // Fetch data
  const { data: batches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  const { data: existingGoals = [] } = useQuery<any[]>({
    queryKey: ["/api/goals"],
  });

  // Watch form values
  const watchedBatchId = form.watch("batchId");
  const watchedGoalType = form.watch("goalType");
  const watchedTargetValue = form.watch("targetValue");
  const watchedCurrentValue = form.watch("currentValue");

  // Calculate batch statistics
  useEffect(() => {
    if (watchedBatchId && batches.length > 0 && animals.length > 0) {
      const batch = batches.find((b: any) => b.id === watchedBatchId);
      if (batch) {
        const batchAnimals = animals.filter((a: any) => a.batchNumber === batch.batchNumber && a.status === "active");
        
        const totalWeight = batchAnimals.reduce((sum: number, a: any) => 
          sum + parseFloat(a.currentWeight || a.entryWeight || "0"), 0);
        const totalEntryWeight = batchAnimals.reduce((sum: number, a: any) => 
          sum + parseFloat(a.entryWeight || "0"), 0);
        const avgWeight = batchAnimals.length > 0 ? totalWeight / batchAnimals.length : 0;
        const weightGain = totalWeight - totalEntryWeight;
        
        const startDate = new Date(batch.startDate || batch.createdAt);
        const today = new Date();
        const daysSinceStart = Math.max(1, Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
        const adg = batchAnimals.length > 0 ? weightGain / (batchAnimals.length * daysSinceStart) : 0;
        
        setSelectedBatchData({
          batch,
          animalCount: batchAnimals.length,
          avgWeight: avgWeight.toFixed(2),
          weightGain: weightGain.toFixed(2),
          adg: adg.toFixed(3),
          daysSinceStart,
        });
      }
    } else {
      setSelectedBatchData(null);
    }
  }, [watchedBatchId, batches, animals]);

  // Generate recommendations
  useEffect(() => {
    if (watchedGoalType) {
      const animalType = selectedBatchData?.batch?.animalType || "عجول";
      let recs: any = {};
      
      switch (watchedGoalType) {
        case "adg":
          recs = {
            title: "معدل النمو اليومي",
            recommended: animalType === "خراف" ? "0.25" : "1.2",
            current: selectedBatchData?.adg || "0",
            unit: "كجم/يوم",
            description: animalType === "خراف" 
              ? "🐑 الأغنام: 0.2-0.3 كجم/يوم"
              : "🐄 العجول: 1.0-1.5 كجم/يوم",
            icon: <TrendingUp className="w-5 h-5" />,
            color: "from-blue-500 to-blue-600",
          };
          if (!watchedTargetValue) form.setValue("targetValue", recs.recommended);
          break;
        case "weight_gain":
          const targetWeight = animalType === "خراف" ? "45" : "450";
          recs = {
            title: "الوزن المستهدف",
            recommended: targetWeight,
            current: selectedBatchData?.avgWeight || "0",
            unit: "كجم",
            description: `🎯 وزن البيع المثالي: ${targetWeight} كجم`,
            icon: <Weight className="w-5 h-5" />,
            color: "from-purple-500 to-purple-600",
          };
          if (!watchedTargetValue) form.setValue("targetValue", recs.recommended);
          break;
        case "fcr":
          recs = {
            title: "معامل التحويل الغذائي",
            recommended: animalType === "خراف" ? "5.0" : "6.5",
            current: "0",
            unit: "نسبة",
            description: "🌾 كلما كان المعامل أقل كان أفضل",
            icon: <BarChart3 className="w-5 h-5" />,
            color: "from-amber-500 to-amber-600",
          };
          if (!watchedTargetValue) form.setValue("targetValue", recs.recommended);
          break;
        case "survival_rate":
          recs = {
            title: "معدل البقاء",
            recommended: "95",
            current: "100",
            unit: "%",
            description: "❤️ يجب أن يكون 95% أو أكثر",
            icon: <CheckCircle2 className="w-5 h-5" />,
            color: "from-green-500 to-green-600",
          };
          if (!watchedTargetValue) form.setValue("targetValue", recs.recommended);
          break;
        case "profit":
          const profitPerHead = animalType === "خراف" ? 500 : 3000;
          const totalProfit = (selectedBatchData?.animalCount || 10) * profitPerHead;
          recs = {
            title: "الربح المستهدف",
            recommended: totalProfit.toString(),
            current: "0",
            unit: "ج.م",
            description: `💵 ${profitPerHead} ج.م لكل رأس`,
            icon: <DollarSign className="w-5 h-5" />,
            color: "from-emerald-500 to-emerald-600",
          };
          if (!watchedTargetValue) form.setValue("targetValue", recs.recommended);
          break;
        case "cost_per_head":
          const costPerHead = animalType === "خراف" ? 2000 : 8000;
          recs = {
            title: "التكلفة لكل رأس",
            recommended: costPerHead.toString(),
            current: "0",
            unit: "ج.م",
            description: `💰 متوسط التكلفة: ${costPerHead} ج.م`,
            icon: <DollarSign className="w-5 h-5" />,
            color: "from-orange-500 to-orange-600",
          };
          if (!watchedTargetValue) form.setValue("targetValue", recs.recommended);
          break;
        case "feed_efficiency":
          recs = {
            title: "كفاءة العلف",
            recommended: "85",
            current: "0",
            unit: "%",
            description: "🎯 كفاءة استخدام العلف",
            icon: <Zap className="w-5 h-5" />,
            color: "from-cyan-500 to-cyan-600",
          };
          if (!watchedTargetValue) form.setValue("targetValue", recs.recommended);
          break;
        default:
          recs = null;
      }
      
      setRecommendations(recs);
    }
  }, [watchedGoalType, selectedBatchData, watchedTargetValue, form]);

  const mutation = useMutation({
    mutationFn: async (data: GoalFormData) => {
      const response = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      
      if (!response.ok) {
        throw new Error("فشل في إضافة الهدف");
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "✅ تم بنجاح",
        description: "تم إضافة الهدف وربطه بالنظام",
      });
      form.reset();
      setOpen(false);
      setCurrentTab("info");
    },
    onError: (error: Error) => {
      toast({
        title: "❌ خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: GoalFormData) => {
    mutation.mutate(data);
  };

  const goalTypes = [
    { value: "adg", label: "معدل النمو اليومي", unit: "كجم/يوم", icon: "📈", color: "blue" },
    { value: "weight_gain", label: "الوزن المستهدف", unit: "كجم", icon: "⚖️", color: "purple" },
    { value: "fcr", label: "معامل التحويل", unit: "نسبة", icon: "🌾", color: "amber" },
    { value: "survival_rate", label: "معدل البقاء", unit: "%", icon: "❤️", color: "green" },
    { value: "profit", label: "الربح المستهدف", unit: "ج.م", icon: "💵", color: "emerald" },
    { value: "cost_per_head", label: "التكلفة/رأس", unit: "ج.م", icon: "💰", color: "orange" },
    { value: "feed_efficiency", label: "كفاءة العلف", unit: "%", icon: "🎯", color: "cyan" },
  ];

  const currentProgress = watchedTargetValue && watchedCurrentValue
    ? Math.min((parseFloat(watchedCurrentValue) / parseFloat(watchedTargetValue)) * 100, 100)
    : 0;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-emerald-600 to-green-600 hover:from-purple-700 hover:to-pink-700 text-white h-11 sm:h-12 px-4 sm:px-6 shadow-lg hover:shadow-xl transition-all duration-300">
          <Plus className="w-4 h-4 sm:w-5 sm:h-5 ml-2" />
          <span className="hidden sm:inline">إضافة هدف جديد</span>
          <span className="sm:hidden">هدف جديد</span>
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-6xl max-h-[95vh] overflow-hidden bg-gradient-to-br from-white via-purple-50/20 to-pink-50/20 border-2 border-emerald-300 shadow-2xl">
        <DialogHeader className="space-y-3 pb-4 border-b-2 border-emerald-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 via-purple-600 to-pink-600 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                  ✨ إنشاء هدف ذكي
                </DialogTitle>
                <DialogDescription className="text-sm text-gray-600 mt-0.5">
                  مع توصيات وتحليلات في الوقت الفعلي
                </DialogDescription>
              </div>
            </div>
            
            {/* Step Indicator */}
            <div className="hidden sm:flex items-center gap-2 bg-white p-2 rounded-xl border border-emerald-200">
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${currentTab === "info" ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>1</div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${currentTab === "target" ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>2</div>
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${currentTab === "preview" ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white" : "bg-gray-100 text-gray-400"}`}>3</div>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 bg-emerald-100/50 p-1 rounded-xl h-12">
                <TabsTrigger 
                  value="info" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Sparkles className="w-4 h-4 ml-1.5" />
                  <span className="hidden sm:inline">المعلومات</span>
                  <span className="sm:hidden">1</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="target" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Calculator className="w-4 h-4 ml-1.5" />
                  <span className="hidden sm:inline">الأهداف</span>
                  <span className="sm:hidden">2</span>
                </TabsTrigger>
                <TabsTrigger 
                  value="preview" 
                  className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-500 data-[state=active]:to-emerald-600 data-[state=active]:text-white rounded-lg transition-all duration-300"
                >
                  <Eye className="w-4 h-4 ml-1.5" />
                  <span className="hidden sm:inline">المعاينة</span>
                  <span className="sm:hidden">3</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Basic Info */}
              <TabsContent value="info" className="space-y-4 mt-4 max-h-[55vh] overflow-y-auto px-1">
                {/* Goal Name */}
                <Card className="border-2 border-emerald-200 bg-white shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    <FormField
                      control={form.control}
                      name="goalName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2 text-lg font-bold text-gray-900">
                            <Hash className="w-5 h-5 text-emerald-600" />
                            اسم الهدف *
                          </FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="مثال: تحسين معدل النمو للدفعة الحالية" 
                              {...field} 
                              className="h-14 text-lg border-2 border-emerald-200 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 rounded-xl shadow-sm"
                            />
                          </FormControl>
                          <FormDescription className="text-sm text-gray-600 flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            اختر اسماً واضحاً ومحدداً لهدفك
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Goal Type Selection */}
                <Card className="border-2 border-emerald-200 bg-white shadow-lg">
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-bold">
                      <BarChart3 className="w-5 h-5 text-pink-600" />
                      نوع الهدف *
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="goalType"
                      render={({ field }) => (
                        <FormItem>
                          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                            {goalTypes.map((type) => (
                              <div
                                key={type.value}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  field.onChange(type.value);
                                  form.setValue("unit", type.unit);
                                  // Auto-generate goal name
                                  if (!form.getValues("goalName")) {
                                    form.setValue("goalName", `تحسين ${type.label}`);
                                  }
                                  console.log("Selected goal type:", type.value, "unit:", type.unit);
                                }}
                                className={`relative cursor-pointer h-28 flex flex-col items-center justify-center gap-2 p-3 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                                  field.value === type.value 
                                    ? 'bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-2xl scale-105 border-emerald-400 ring-4 ring-emerald-200' 
                                    : 'border-emerald-200 hover:border-emerald-400 bg-white hover:bg-emerald-50 hover:scale-102'
                                }`}
                              >
                                {field.value === type.value && (
                                  <div className="absolute top-2 left-2 bg-white/20 p-1 rounded-lg">
                                    <CheckCircle2 className="w-5 h-5 text-white drop-shadow-lg" />
                                  </div>
                                )}
                                <span className="text-4xl mb-1">{type.icon}</span>
                                <span className={`font-bold text-xs leading-tight text-center px-1 ${
                                  field.value === type.value ? 'text-white' : 'text-gray-800'
                                }`}>
                                  {type.label}
                                </span>
                                <Badge 
                                  variant={field.value === type.value ? "secondary" : "outline"}
                                  className={`text-xs mt-1 ${
                                    field.value === type.value ? 'bg-white/20 text-white border-white/30' : 'text-gray-600'
                                  }`}
                                >
                                  {type.unit}
                                </Badge>
                              </div>
                            ))}
                          </div>
                          <FormDescription className="text-sm text-gray-600 flex items-center gap-1 mt-3">
                            <Sparkles className="w-3 h-3 text-emerald-500" />
                            اختر المؤشر الذي تريد تحقيق هدف فيه
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Batch Selection */}
                <Card className="border-2 border-emerald-200 bg-white shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <CardTitle className="flex items-center gap-2 text-lg font-bold">
                        <Package className="w-5 h-5 text-amber-600" />
                        الدفعة المستهدفة
                      </CardTitle>
                      <Badge variant="outline" className="text-xs">
                        {batches.length} دفعة متاحة
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <FormField
                      control={form.control}
                      name="batchId"
                      render={({ field }) => (
                        <FormItem>
                          <div className="space-y-3">
                            {/* Farm-wide option */}
                            <div 
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                field.onChange("");
                                setSelectedBatchData(null);
                                console.log("Selected: Farm-wide, value:", "");
                              }}
                              className={`cursor-pointer p-4 rounded-xl border-3 transition-all duration-300 hover:shadow-lg ${
                                !field.value || field.value === "" 
                                  ? 'bg-gradient-to-r from-purple-500 to-purple-600 border-purple-600 shadow-xl ring-4 ring-emerald-200' 
                                  : 'border-emerald-300 hover:border-emerald-500 bg-white hover:bg-emerald-50'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shadow-md ${
                                  !field.value || field.value === "" ? 'bg-white/20' : 'bg-emerald-100'
                                }`}>
                                  <span className="text-3xl">🌍</span>
                                </div>
                                <div className="flex-1">
                                  <p className={`font-bold text-lg ${
                                    !field.value || field.value === "" ? 'text-white' : 'text-gray-900'
                                  }`}>
                                    المزرعة بالكامل
                                  </p>
                                  <p className={`text-sm ${
                                    !field.value || field.value === "" ? 'text-purple-100' : 'text-gray-600'
                                  }`}>
                                    هدف عام لجميع الحيوانات في المزرعة
                                  </p>
                                </div>
                                {(!field.value || field.value === "") && (
                                  <div className="bg-white/20 p-2 rounded-lg">
                                    <CheckCircle2 className="w-6 h-6 text-white" />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Individual Batches */}
                            {batches.length > 0 ? (
                              <div className="space-y-3">
                                <Separator className="my-2" />
                                <div className="flex items-center justify-between px-1">
                                  <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                    <Package className="w-4 h-4 text-amber-600" />
                                    أو اختر دفعة محددة:
                                  </p>
                                  <Badge variant="secondary" className="text-xs">
                                    {batches.length} دفعة
                                  </Badge>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[220px] overflow-y-auto p-3 bg-gradient-to-br from-amber-50/50 to-orange-50/30 rounded-xl border border-amber-200">
                                  {batches.map((batch: any) => (
                                    <div
                                      key={batch.id}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        field.onChange(batch.id);
                                        console.log("Selected batch:", batch.id, batch.batchName);
                                      }}
                                      className={`cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                                        field.value === batch.id
                                          ? 'bg-gradient-to-r from-amber-500 to-amber-600 border-amber-600 shadow-xl ring-4 ring-amber-200'
                                          : 'border-amber-300 hover:border-amber-500 bg-white hover:bg-amber-50'
                                      }`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center shadow-md ${
                                          field.value === batch.id ? 'bg-white/20' : 'bg-amber-100'
                                        }`}>
                                          <span className="text-2xl">🏠</span>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <p className={`font-bold text-base truncate ${
                                            field.value === batch.id ? 'text-white' : 'text-gray-900'
                                          }`}>
                                            {batch.batchName || batch.batchNumber}
                                          </p>
                                          <div className={`flex items-center gap-2 text-xs mt-1 ${
                                            field.value === batch.id ? 'text-amber-100' : 'text-gray-600'
                                          }`}>
                                            <span className="font-medium">{batch.animalType || "غير محدد"}</span>
                                            <span>•</span>
                                            <span>{batch.totalAnimals || "0"} حيوان</span>
                                            {batch.status === "active" && (
                                              <>
                                                <span>•</span>
                                                <span className={`font-semibold ${field.value === batch.id ? 'text-white' : 'text-green-600'}`}>نشط</span>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                        {field.value === batch.id && (
                                          <div className="bg-white/20 p-1.5 rounded-lg">
                                            <CheckCircle2 className="w-6 h-6 text-white flex-shrink-0" />
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <div className="p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                                <p className="text-base font-semibold text-gray-700">لا توجد دفعات متاحة حالياً</p>
                                <p className="text-sm text-gray-500 mt-2">يمكنك إضافة هدف للمزرعة بالكامل أو إنشاء دفعة جديدة أولاً</p>
                              </div>
                            )}
                          </div>
                          <FormDescription className="text-sm text-gray-600 mt-3 flex items-center gap-1">
                            <Info className="w-3 h-3 text-emerald-500" />
                            اختر دفعة محددة لتتبع الهدف أو اتركه للمزرعة بالكامل
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Batch Statistics - Show when batch selected */}
                {selectedBatchData && (
                  <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50 to-white shadow-xl">
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2 text-base font-bold text-amber-900">
                        <LineChart className="w-5 h-5" />
                        📊 إحصائيات الدفعة المختارة
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="bg-white p-3 rounded-lg border border-amber-200 text-center">
                          <Users className="w-5 h-5 mx-auto mb-1 text-amber-600" />
                          <p className="text-xs text-gray-600">عدد الحيوانات</p>
                          <p className="text-lg font-bold text-amber-600">{selectedBatchData.animalCount}</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-blue-200 text-center">
                          <Weight className="w-5 h-5 mx-auto mb-1 text-blue-600" />
                          <p className="text-xs text-gray-600">متوسط الوزن</p>
                          <p className="text-lg font-bold text-blue-600">{selectedBatchData.avgWeight} كجم</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-green-200 text-center">
                          <TrendingUp className="w-5 h-5 mx-auto mb-1 text-green-600" />
                          <p className="text-xs text-gray-600">الزيادة</p>
                          <p className="text-lg font-bold text-green-600">{selectedBatchData.weightGain} كجم</p>
                        </div>
                        <div className="bg-white p-3 rounded-lg border border-emerald-200 text-center">
                          <Calendar className="w-5 h-5 mx-auto mb-1 text-emerald-600" />
                          <p className="text-xs text-gray-600">الأيام</p>
                          <p className="text-lg font-bold text-emerald-600">{selectedBatchData.daysSinceStart}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end pt-2">
                  <Button
                    type="button"
                    onClick={() => setCurrentTab("target")}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    التالي: تحديد الأهداف
                    <ChevronRight className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 2: Target Settings */}
              <TabsContent value="target" className="space-y-4 mt-4 max-h-[55vh] overflow-y-auto px-1">
                {/* Recommendations Card */}
                {recommendations && (
                  <Card className={`border-2 border-${recommendations.color || 'purple'}-300 bg-gradient-to-br from-${recommendations.color || 'purple'}-50 to-white shadow-xl`}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg bg-gradient-to-br ${recommendations.color === 'blue' ? 'from-blue-500 to-blue-600' : recommendations.color === 'green' ? 'from-green-500 to-green-600' : recommendations.color === 'amber' ? 'from-amber-500 to-amber-600' : 'from-purple-500 to-purple-600'}`}>
                          {recommendations.icon}
                        </div>
                        <div className="flex-1">
                          <CardTitle className="text-base font-bold text-gray-900">
                            💡 توصية ذكية: {recommendations.title}
                          </CardTitle>
                          <p className="text-xs text-gray-600 mt-1">{recommendations.description}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="bg-white p-4 rounded-xl border-2 border-emerald-300 text-center shadow-md">
                          <p className="text-xs text-gray-600 mb-1">القيمة الحالية</p>
                          <p className="text-2xl font-bold text-blue-600">{recommendations.current}</p>
                          <p className="text-xs text-gray-500 mt-1">{recommendations.unit}</p>
                        </div>
                        <div className="bg-gradient-to-br from-emerald-500 to-green-600 p-4 rounded-xl text-center shadow-lg">
                          <p className="text-xs text-purple-100 mb-1">القيمة الموصى بها</p>
                          <p className="text-2xl font-bold text-white">{recommendations.recommended}</p>
                          <p className="text-xs text-purple-100 mt-1">{recommendations.unit}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Target Value Input */}
                <Card className="border-2 border-emerald-200 bg-white shadow-lg">
                  <CardContent className="pt-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="targetValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-bold text-gray-900 flex items-center gap-2">
                              <Target className="w-4 h-4 text-emerald-600" />
                              القيمة المستهدفة *
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder="أدخل القيمة" 
                                {...field} 
                                className="h-14 text-xl font-bold border-2 border-emerald-300 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-200 rounded-xl"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="currentValue"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base font-bold text-gray-900 flex items-center gap-2">
                              <LineChart className="w-4 h-4 text-blue-600" />
                              القيمة الحالية
                            </FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                step="0.01"
                                placeholder="0" 
                                {...field} 
                                className="h-14 text-xl font-bold border-2 border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-200 rounded-xl bg-blue-50/30"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="unit"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold text-gray-800">الوحدة</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              readOnly
                              className="h-12 text-base border-2 border-gray-300 rounded-xl bg-gray-50 font-medium"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                {/* Date Range */}
                <Card className="border-2 border-blue-200 bg-white shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-base font-bold">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      الفترة الزمنية
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">تاريخ البدء</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                className="h-12 border-2 border-blue-200 focus:border-blue-500 rounded-xl"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-sm font-semibold">تاريخ الانتهاء (اختياري)</FormLabel>
                            <FormControl>
                              <Input 
                                type="date" 
                                {...field} 
                                className="h-12 border-2 border-blue-200 focus:border-blue-500 rounded-xl"
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentTab("info")}
                    className="border-2 border-gray-300"
                  >
                    السابق
                  </Button>
                  <Button
                    type="button"
                    onClick={() => setCurrentTab("preview")}
                    className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-purple-600 hover:to-pink-700"
                  >
                    التالي: المعاينة
                    <ChevronRight className="w-4 h-4 mr-2" />
                  </Button>
                </div>
              </TabsContent>

              {/* Tab 3: Preview */}
              <TabsContent value="preview" className="space-y-4 mt-4 max-h-[55vh] overflow-y-auto px-1">
                {/* Goal Preview Card */}
                <Card className="border-2 border-emerald-300 bg-gradient-to-br from-white to-purple-50 shadow-2xl">
                  <CardHeader className="pb-4 bg-gradient-to-r from-purple-100/50 to-pink-100/50 border-b-2 border-emerald-200">
                    <CardTitle className="text-xl font-bold text-center text-gray-900">
                      🎯 معاينة الهدف
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-6 space-y-5">
                    {/* Goal Name Display */}
                    <div className="text-center">
                      <h3 className="text-2xl font-bold text-purple-900 mb-2">
                        {form.watch("goalName") || "اسم الهدف"}
                      </h3>
                      <Badge variant="outline" className="text-sm">
                        {goalTypes.find(t => t.value === form.watch("goalType"))?.label || "نوع الهدف"}
                      </Badge>
                    </div>

                    <Separator />

                    {/* Progress Visualization */}
                    <div className="bg-white p-6 rounded-2xl border-2 border-emerald-200 shadow-lg">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-semibold text-gray-700">التقدم المتوقع</span>
                        <span className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent">
                          {currentProgress.toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={currentProgress} className="h-4 mb-4" />
                      
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200">
                          <p className="text-xs text-gray-600 mb-1">القيمة الحالية</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {parseFloat(form.watch("currentValue") || "0").toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{form.watch("unit")}</p>
                        </div>
                        <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl border-2 border-emerald-300 shadow-md">
                          <p className="text-xs text-gray-600 mb-1">الهدف</p>
                          <p className="text-2xl font-bold text-emerald-600">
                            {parseFloat(form.watch("targetValue") || "0").toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{form.watch("unit")}</p>
                        </div>
                      </div>
                    </div>

                    {/* Additional Info */}
                    {selectedBatchData && (
                      <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                        <p className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
                          <Package className="w-4 h-4" />
                          الدفعة: {selectedBatchData.batch.batchName}
                        </p>
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div className="flex justify-between">
                            <span className="text-gray-600">معدل النمو الحالي:</span>
                            <span className="font-bold">{selectedBatchData.adg} كجم/يوم</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">إجمالي الزيادة:</span>
                            <span className="font-bold">{selectedBatchData.weightGain} كجم</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Notes */}
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base font-semibold flex items-center gap-2">
                            <Info className="w-4 h-4 text-gray-600" />
                            ملاحظات إضافية
                          </FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="أضف أي ملاحظات أو تفاصيل إضافية..." 
                              {...field} 
                              rows={4}
                              className="resize-none border-2 border-emerald-200 focus:border-emerald-500 rounded-xl"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </CardContent>
                </Card>

                <div className="flex justify-between pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentTab("target")}
                    className="border-2 border-gray-300"
                  >
                    السابق
                  </Button>
                  <Button
                    type="submit"
                    disabled={mutation.isPending}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl px-8"
                  >
                    {mutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 ml-2 animate-spin" />
                        جاري الحفظ...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 ml-2" />
                        حفظ الهدف
                      </>
                    )}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
