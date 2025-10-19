import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Wheat, Package, Scale, Home, Save, Info, CheckCircle2, AlertTriangle } from "lucide-react";

const feedDispenseSchema = z.object({
  feedType: z.enum(["concentrate", "roughage"]),
  feedSubType: z.string().min(1, "نوع العلف مطلوب"),
  quantity: z.string().min(1, "الكمية مطلوبة"),
  penNumber: z.string().min(1, "رقم العنبر مطلوب"),
  notes: z.string().optional(),
});

type FeedDispenseFormData = z.infer<typeof feedDispenseSchema>;

interface FeedDispenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feedType: "concentrate" | "roughage";
}

export function FeedDispenseDialog({ open, onOpenChange, feedType }: FeedDispenseDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory
  const { data: inventory = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
  });

  // Filter feed items from inventory
  const concentrateFeed = inventory.filter((item: any) => 
    item.category === "علف مركز" || 
    item.itemName?.includes("علف مركز") ||
    item.itemName?.includes("14%") ||
    item.itemName?.includes("16%") ||
    item.itemName?.includes("21%")
  );

  const roughageFeed = inventory.filter((item: any) => 
    item.category === "مادة مالئة" ||
    item.itemName?.includes("دريس") ||
    item.itemName?.includes("تبن")
  );

  const availableFeed = feedType === "concentrate" ? concentrateFeed : roughageFeed;

  const form = useForm<FeedDispenseFormData>({
    resolver: zodResolver(feedDispenseSchema),
    defaultValues: {
      feedType: feedType,
      feedSubType: "",
      quantity: "",
      penNumber: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: FeedDispenseFormData) => {
      // 1. تسجيل في حركات المخزون
      const inventoryTransaction = {
        transactionNumber: `FEED-${Date.now()}`,
        transactionType: "dispense",
        itemId: data.feedSubType,
        quantity: data.quantity,
        referenceType: "pen",
        referenceId: data.penNumber,
        notes: `صرف ${feedType === "concentrate" ? "علف مركز" : "مادة مالئة"} - ${data.feedSubType} للعنبر ${data.penNumber}`,
      };

      const response = await fetch("/api/inventory-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inventoryTransaction),
      });

      if (!response.ok) {
        throw new Error("فشل في تسجيل الصرف");
      }

      // 2. Update FCR goal for batches in this pen
      const animalsResponse = await fetch("/api/animals");
      if (animalsResponse.ok) {
        const animals = await animalsResponse.json();
        const penAnimals = animals.filter((a: any) => a.penNumber === data.penNumber && a.status === "active");
        
        if (penAnimals.length > 0) {
          // Get unique batch numbers
          const batchNumbers = Array.from(new Set(penAnimals.map((a: any) => a.batchNumber).filter(Boolean)));
          
          for (const batchNumber of batchNumbers) {
            const batchesResponse = await fetch("/api/batches");
            if (batchesResponse.ok) {
              const batches = await batchesResponse.json();
              const batch = batches.find((b: any) => b.batchNumber === batchNumber);
              
              if (batch) {
                // Calculate total weight gain for batch
                const batchAnimals = penAnimals.filter((a: any) => a.batchNumber === batchNumber);
                const totalWeightGain = batchAnimals.reduce((sum: number, a: any) => {
                  return sum + (parseFloat(a.currentWeight || "0") - parseFloat(a.entryWeight || "0"));
                }, 0);
                
                // Update FCR goal
                const goalsResponse = await fetch("/api/goals");
                if (goalsResponse.ok) {
                  const goals = await goalsResponse.json();
                  const fcrGoal = goals.find((g: any) => g.batchId === batch.id && g.goalType === "fcr");
                  
                  if (fcrGoal && totalWeightGain > 0) {
                    // Get total feed consumed
                    const transactionsResponse = await fetch("/api/inventory-transactions");
                    if (transactionsResponse.ok) {
                      const transactions = await transactionsResponse.json();
                      const totalFeedConsumed = transactions
                        .filter((t: any) => t.transactionType === "dispense" && t.referenceType === "pen")
                        .reduce((sum: number, t: any) => sum + parseFloat(t.quantity || "0"), 0) + parseFloat(data.quantity);
                      
                      const fcr = totalFeedConsumed / totalWeightGain;
                      
                      await fetch(`/api/goals/${fcrGoal.id}`, {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          currentValue: fcr.toFixed(2),
                          status: fcr <= parseFloat(fcrGoal.targetValue) ? "achieved" : "active",
                        }),
                      });
                    }
                  }
                }
              }
            }
          }
        }
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "تم بنجاح ✅",
        description: "تم صرف العلف وتحديث الأهداف",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ ❌",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: FeedDispenseFormData) => {
    setLoading(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setLoading(false);
    }
  };

  const isConcentrate = feedType === "concentrate";
  const concentrateOptions = ["14%", "16%", "21%"];
  const roughageOptions = ["دريس", "تبن"];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-gradient-to-br from-white via-amber-50/30 to-orange-50/30 border-2 border-amber-200/50 shadow-2xl">
        <DialogHeader className="space-y-4 pb-6 border-b border-amber-100">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${isConcentrate ? 'from-amber-500 to-amber-600' : 'from-green-500 to-green-600'} shadow-xl ${isConcentrate ? 'shadow-amber-500/30' : 'shadow-green-500/30'}`}>
              {isConcentrate ? (
                <Wheat className="w-8 h-8 text-white" />
              ) : (
                <Package className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <DialogTitle className={`text-3xl font-bold bg-gradient-to-r ${isConcentrate ? 'from-amber-600 to-orange-600' : 'from-green-600 to-emerald-600'} bg-clip-text text-transparent`}>
                🌾 صرف {isConcentrate ? "علف مركز" : "مادة مالئة"}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 mt-1">
                صرف من المخزون الرئيسي للعنبر
              </DialogDescription>
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-xl p-4 flex items-start gap-3 shadow-lg">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              💡 سيتم خصم الكمية من المخزون الرئيسي تلقائياً وتسجيلها في الحسابات
            </p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <Card className={`border-2 ${isConcentrate ? 'border-amber-200/60' : 'border-green-200/60'} bg-gradient-to-br ${isConcentrate ? 'from-amber-50/40' : 'from-green-50/40'} via-white to-transparent shadow-xl`}>
              <CardHeader className={`pb-4 bg-gradient-to-r ${isConcentrate ? 'from-amber-50/50 to-amber-50/20' : 'from-green-50/50 to-green-50/20'} border-b ${isConcentrate ? 'border-amber-100' : 'border-green-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${isConcentrate ? 'from-amber-500 to-amber-600' : 'from-green-500 to-green-600'} shadow-lg`}>
                    {isConcentrate ? <Wheat className="w-5 h-5 text-white" /> : <Package className="w-5 h-5 text-white" />}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">📦 بيانات الصرف</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {/* نوع العلف من المخزون */}
                <FormField
                  control={form.control}
                  name="feedSubType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-bold text-gray-900">
                        <div className={`p-2 rounded-lg ${isConcentrate ? 'bg-amber-100' : 'bg-green-100'}`}>
                          {isConcentrate ? <Wheat className="w-5 h-5 text-amber-600" /> : <Package className="w-5 h-5 text-green-600" />}
                        </div>
                        {isConcentrate ? "اختر العلف المركز" : "اختر المادة المالئة"} *
                        <Badge variant="outline" className="mr-auto">
                          {availableFeed.length} صنف متاح
                        </Badge>
                      </FormLabel>
                      
                      {availableFeed.length > 0 ? (
                        <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3 max-h-[280px] overflow-y-auto p-3 bg-gradient-to-br ${isConcentrate ? 'from-amber-50 to-orange-50/30' : 'from-green-50 to-emerald-50/30'} rounded-xl border ${isConcentrate ? 'border-amber-200' : 'border-green-200'}`}>
                          {availableFeed.map((item: any) => {
                            const stockLevel = parseFloat(item.currentStock || item.quantity || "0");
                            const minStock = parseFloat(item.minStock || item.minimumStock || "0");
                            const isLowStock = stockLevel <= minStock;
                            
                            return (
                              <div
                                key={item.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  field.onChange(item.id);
                                  console.log("Selected feed:", item.id, item.itemName);
                                }}
                                className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                                  field.value === item.id
                                    ? `bg-gradient-to-r ${isConcentrate ? 'from-amber-500 to-amber-600' : 'from-green-500 to-green-600'} border-${isConcentrate ? 'amber' : 'green'}-600 text-white shadow-xl ring-4 ring-${isConcentrate ? 'amber' : 'green'}-200`
                                    : `border-${isConcentrate ? 'amber' : 'green'}-300 hover:border-${isConcentrate ? 'amber' : 'green'}-500 bg-white hover:bg-${isConcentrate ? 'amber' : 'green'}-50`
                                }`}
                              >
                                <div className="space-y-2">
                                  {/* Item Name */}
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`font-bold text-sm leading-tight flex-1 ${
                                      field.value === item.id ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {item.itemName}
                                    </p>
                                    {field.value === item.id && (
                                      <div className="bg-white/20 p-1 rounded-md flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Stock Info */}
                                  <div className={`flex items-center justify-between text-xs ${
                                    field.value === item.id ? 'text-white/90' : 'text-gray-600'
                                  }`}>
                                    <div className="flex items-center gap-1">
                                      <Scale className="w-3 h-3" />
                                      <span className="font-semibold">{stockLevel.toFixed(0)} {item.unit}</span>
                                    </div>
                                    {isLowStock && (
                                      <div className={`flex items-center gap-1 ${
                                        field.value === item.id ? 'text-yellow-200' : 'text-orange-600'
                                      }`}>
                                        <AlertTriangle className="w-3 h-3" />
                                        <span className="font-semibold">قليل</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Category/Type Badge */}
                                  <Badge 
                                    variant={field.value === item.id ? "secondary" : "outline"}
                                    className={`text-xs w-full justify-center ${
                                      field.value === item.id 
                                        ? 'bg-white/20 text-white border-white/30' 
                                        : `bg-${isConcentrate ? 'amber' : 'green'}-50 text-${isConcentrate ? 'amber' : 'green'}-700`
                                    }`}
                                  >
                                    {item.category || item.itemCode || "علف"}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={`p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed ${isConcentrate ? 'border-amber-300' : 'border-green-300'}`}>
                          <AlertTriangle className={`w-12 h-12 mx-auto mb-3 ${isConcentrate ? 'text-amber-400' : 'text-green-400'}`} />
                          <p className="text-base font-semibold text-gray-700">
                            لا يوجد {isConcentrate ? 'علف مركز' : 'مادة مالئة'} في المخزون
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            يرجى إضافة {isConcentrate ? 'علف مركز' : 'مواد مالئة'} للمخزون أولاً
                          </p>
                        </div>
                      )}
                      
                      <FormDescription className={`text-sm text-gray-600 flex items-center gap-1 mt-3 ${isConcentrate ? 'text-amber-700' : 'text-green-700'}`}>
                        <Info className="w-3 h-3" />
                        {isConcentrate ? 'اختر العلف المركز المتاح في المخزون' : 'اختر المادة المالئة المتاحة في المخزون'}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* الكمية بالكيلو */}
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-800">
                          <div className={`p-1 rounded-md ${isConcentrate ? 'bg-amber-100' : 'bg-green-100'}`}>
                            <Scale className={`w-4 h-4 ${isConcentrate ? 'text-amber-600' : 'text-green-600'}`} />
                          </div>
                          الكمية (كجم) *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.1"
                            placeholder="مثال: 50" 
                            {...field} 
                            className={`h-14 text-lg border-2 ${isConcentrate ? 'border-amber-200 focus:border-amber-500 focus:ring-amber-200' : 'border-green-200 focus:border-green-500 focus:ring-green-200'} focus:ring-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-600">
                          أدخل الكمية بالكيلوجرام
                        </FormDescription>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* رقم العنبر */}
                  <FormField
                    control={form.control}
                    name="penNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-800">
                          <div className={`p-1 rounded-md ${isConcentrate ? 'bg-amber-100' : 'bg-green-100'}`}>
                            <Home className={`w-4 h-4 ${isConcentrate ? 'text-amber-600' : 'text-green-600'}`} />
                          </div>
                          رقم العنبر *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: A1" 
                            {...field} 
                            className={`h-14 text-lg border-2 ${isConcentrate ? 'border-amber-200 focus:border-amber-500 focus:ring-amber-200' : 'border-green-200 focus:border-green-500 focus:ring-green-200'} focus:ring-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-600">
                          العنبر المراد صرف العلف له
                        </FormDescription>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />
                </div>

                {/* ملاحظات */}
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base font-semibold text-gray-800">📝 ملاحظات (اختياري)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="أي ملاحظات إضافية..."
                          className={`min-h-[100px] resize-none text-base border-2 ${isConcentrate ? 'border-amber-200 focus:border-amber-500 focus:ring-amber-200' : 'border-green-200 focus:border-green-500 focus:ring-green-200'} focus:ring-4 rounded-xl shadow-sm`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className={`flex-1 h-14 text-lg bg-gradient-to-r ${isConcentrate ? 'from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700' : 'from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700'} shadow-xl`}
              >
                <Save className="w-5 h-5 ml-2" />
                {loading ? "جاري الحفظ..." : "تسجيل الصرف"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className="flex-1 h-14 text-lg border-2 border-gray-300"
                disabled={loading}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

