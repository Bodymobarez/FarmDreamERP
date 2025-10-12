import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Package,
  Loader2,
  Users,
  Calendar,
  Truck,
  DollarSign,
  AlertCircle,
  Info,
  TrendingUp,
  Building2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const batchSchema = z.object({
  name: z.string().min(1, "اسم الدفعة مطلوب")
    .max(100, "اسم الدفعة يجب أن يكون أقل من 100 حرف"),
  receivedDate: z.string().min(1, "تاريخ الاستلام مطلوب"),
  count: z.string()
    .min(1, "عدد الحيوانات مطلوب")
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: "يجب إدخال عدد صحيح أكبر من صفر",
    })
    .refine((val) => parseInt(val) <= 500, {
      message: "الحد الأقصى 500 حيوان في الدفعة الواحدة",
    }),
  supplierId: z.string().min(1, "يجب اختيار المورد"),
  averageWeight: z.string()
    .min(1, "متوسط الوزن مطلوب")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "يجب إدخال وزن صحيح أكبر من صفر",
    }),
  totalCost: z.string()
    .min(1, "التكلفة الإجمالية مطلوبة")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "يجب إدخال تكلفة صحيحة أكبر من صفر",
    }),
  penId: z.string().optional(),
  notes: z.string().optional(),
});

type BatchFormData = z.infer<typeof batchSchema>;

export function AddBatchDialog() {
  const [open, setOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [selectedPen, setSelectedPen] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch suppliers
  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery<any[]>({
    queryKey: ["/api/suppliers"],
  });

  // Fetch available pens
  const { data: pens = [], isLoading: isLoadingPens } = useQuery<any[]>({
    queryKey: ["/api/pens"],
  });

  // Available pens (not full)
  const availablePens = pens.filter((p: any) => p.status === "نشط" && p.current < p.capacity);

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
      receivedDate: new Date().toISOString().split("T")[0],
      count: "",
      supplierId: "",
      averageWeight: "",
      totalCost: "",
      penId: "",
      notes: "",
    },
  });

  // Create batch mutation
  const createBatchMutation = useMutation({
    mutationFn: async (data: BatchFormData) => {
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          receivedDate: data.receivedDate,
          count: parseInt(data.count),
          supplierId: data.supplierId,
          averageWeight: parseFloat(data.averageWeight),
          totalCost: parseFloat(data.totalCost),
          costPerAnimal: parseFloat(data.totalCost) / parseInt(data.count),
          penId: data.penId || null,
          notes: data.notes,
          status: "نشط",
          avgAdg: 0,
          fcr: 0,
        }),
      });
      if (!response.ok) throw new Error("Failed to create batch");
      return response.json();
    },
    onSuccess: (newBatch) => {
      queryClient.invalidateQueries({ queryKey: ["/api/batches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/pens"] });
      
      const costPerAnimal = parseFloat(newBatch.totalCost) / parseInt(newBatch.count);
      
      toast({
        title: "✅ تم إنشاء الدفعة بنجاح",
        description: (
          <div className="space-y-1">
            <p>الدفعة: {newBatch.name}</p>
            <p>العدد: {newBatch.count} حيوان</p>
            <p>التكلفة: {costPerAnimal.toFixed(2)} جنيه/حيوان</p>
            {selectedSupplier && (
              <p className="text-cyan-600">المورد: {selectedSupplier.name}</p>
            )}
          </div>
        ),
      });

      form.reset({
        name: "",
        receivedDate: new Date().toISOString().split("T")[0],
        count: "",
        supplierId: "",
        averageWeight: "",
        totalCost: "",
        penId: "",
        notes: "",
      });
      setSelectedSupplier(null);
      setSelectedPen(null);
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "❌ خطأ في إنشاء الدفعة",
        description: "حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: BatchFormData) => {
    await createBatchMutation.mutateAsync(data);
  };

  // Watch supplier and pen selection
  const watchedSupplierId = form.watch("supplierId");
  const watchedPenId = form.watch("penId");

  useEffect(() => {
    if (watchedSupplierId) {
      const supplier = suppliers.find((s: any) => s.id === watchedSupplierId);
      setSelectedSupplier(supplier);
    } else {
      setSelectedSupplier(null);
    }
  }, [watchedSupplierId, suppliers]);

  useEffect(() => {
    if (watchedPenId) {
      const pen = availablePens.find((p: any) => p.id === watchedPenId);
      setSelectedPen(pen);
    } else {
      setSelectedPen(null);
    }
  }, [watchedPenId, availablePens]);

  // Calculate cost per animal
  const calculateCostPerAnimal = () => {
    const count = parseInt(form.watch("count") || "0");
    const totalCost = parseFloat(form.watch("totalCost") || "0");
    if (count > 0 && totalCost > 0) {
      return (totalCost / count).toFixed(2);
    }
    return null;
  };

  const costPerAnimal = calculateCostPerAnimal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
        >
          <Package className="w-5 h-5 ml-2" />
          إضافة دفعة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100">
              <Package className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                إضافة دفعة جديدة
              </DialogTitle>
              <DialogDescription>
                سجل دفعة حيوانات جديدة في النظام
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Batch Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-cyan-600" />
                    اسم الدفعة *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="مثال: الدفعة الحادية عشر - يونيو 2025"
                      className="bg-white text-lg font-medium"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    اختر اسماً مميزاً وواضحاً للدفعة
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Count Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="receivedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-cyan-600" />
                      تاريخ الاستلام *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      تاريخ وصول الدفعة للمزرعة
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-cyan-600" />
                      عدد الحيوانات *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          placeholder="50"
                          className="bg-white text-lg font-semibold pr-12"
                          min="1"
                          max="500"
                          {...field} 
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          رأس
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      العدد الإجمالي للحيوانات
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Supplier Selection */}
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-cyan-600" />
                    المورد *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingSuppliers}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="اختر المورد..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingSuppliers ? (
                        <div className="p-4 text-center text-gray-500">
                          جاري التحميل...
                        </div>
                      ) : suppliers.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          لا توجد موردين
                        </div>
                      ) : (
                        suppliers.map((supplier: any) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{supplier.name}</span>
                              <span className="text-xs text-gray-500">
                                {supplier.phone}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {supplier.city || "غير محدد"}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    المورد الذي تم شراء الدفعة منه
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selected Supplier Info Card */}
            {selectedSupplier && (
              <Card className="border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-teal-100">
                      <Truck className="h-5 w-5 text-teal-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        معلومات المورد
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">الهاتف</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedSupplier.phone || "غير محدد"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">المدينة</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedSupplier.city || "غير محدد"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weight and Cost Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="averageWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-cyan-600" />
                      متوسط الوزن *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="35.5"
                          className="bg-white text-lg font-semibold pr-12"
                          {...field} 
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          كجم
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      متوسط وزن الحيوان عند الاستلام
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-cyan-600" />
                      التكلفة الإجمالية *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="50000.00"
                          className="bg-white text-lg font-semibold pr-12"
                          {...field} 
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          جنيه
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      إجمالي تكلفة شراء الدفعة
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cost per Animal Display */}
            {costPerAnimal && (
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <DollarSign className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        تكلفة الحيوان الواحد
                      </h4>
                      <p className="text-2xl font-bold text-green-600">
                        {costPerAnimal} جنيه
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Pen Assignment */}
            <FormField
              control={form.control}
              name="penId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-cyan-600" />
                    تخصيص عنبر (اختياري)
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingPens}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="اختر عنبر للإسكان..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">بدون تخصيص</SelectItem>
                      {isLoadingPens ? (
                        <div className="p-4 text-center text-gray-500">
                          جاري التحميل...
                        </div>
                      ) : availablePens.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          لا توجد عنابر متاحة
                        </div>
                      ) : (
                        availablePens.map((pen: any) => (
                          <SelectItem key={pen.id} value={pen.id}>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{pen.name}</span>
                              <span className="text-xs text-gray-500">
                                {pen.current}/{pen.capacity}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {pen.penType}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    يمكن إسكان الدفعة في عنبر محدد
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selected Pen Info Card */}
            {selectedPen && (
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Building2 className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        معلومات العنبر المختار
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">السعة المتاحة</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedPen.capacity - selectedPen.current} حيوان
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">نوع العنبر</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedPen.penType}
                          </p>
                        </div>
                      </div>
                      
                      {parseInt(form.watch("count") || "0") > (selectedPen.capacity - selectedPen.current) && (
                        <div className="flex items-start gap-2 p-2 rounded bg-amber-50 border border-amber-200">
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                          <p className="text-xs text-amber-800">
                            تنبيه: عدد الحيوانات أكبر من السعة المتاحة في العنبر
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-cyan-600" />
                    ملاحظات (اختياري)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أضف أي ملاحظات حول الدفعة، حالة الحيوانات، شروط الشراء..."
                      className="bg-white resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    معلومات إضافية عن الدفعة أو شروط الشراء
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  form.reset();
                  setSelectedSupplier(null);
                  setSelectedPen(null);
                }}
                disabled={createBatchMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={createBatchMutation.isPending}
                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
              >
                {createBatchMutation.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Package className="ml-2 h-4 w-4" />
                    إنشاء الدفعة
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}