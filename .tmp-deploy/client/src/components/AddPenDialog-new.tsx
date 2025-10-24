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
  Home,
  Loader2,
  Users,
  Building2,
  Package,
  AlertCircle,
  Info,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const penSchema = z.object({
  name: z.string().min(1, "اسم العنبر مطلوب")
    .max(50, "اسم العنبر يجب أن يكون أقل من 50 حرف"),
  capacity: z.string()
    .min(1, "السعة مطلوبة")
    .refine((val) => !isNaN(parseInt(val)) && parseInt(val) > 0, {
      message: "يجب إدخال سعة صحيحة أكبر من صفر",
    })
    .refine((val) => parseInt(val) <= 200, {
      message: "السعة القصوى المسموحة 200 حيوان",
    }),
  batchId: z.string().optional(),
  location: z.string().optional(),
  notes: z.string().optional(),
  penType: z.enum(["مفتوح", "مغلق", "نصف مفتوح"], {
    errorMap: () => ({ message: "يجب اختيار نوع العنبر" }),
  }),
});

type PenFormData = z.infer<typeof penSchema>;

export function AddPenDialog() {
  const [open, setOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch batches for assignment
  const { data: batches = [], isLoading: isLoadingBatches } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

  // Active batches only
  const activeBatches = batches.filter((b: any) => b.status === "نشط");

  const form = useForm<PenFormData>({
    resolver: zodResolver(penSchema),
    defaultValues: {
      name: "",
      capacity: "",
      batchId: "",
      location: "",
      notes: "",
      penType: "مفتوح",
    },
  });

  // Create pen mutation
  const createPenMutation = useMutation({
    mutationFn: async (data: PenFormData) => {
      const response = await fetch("/api/pens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          capacity: parseInt(data.capacity),
          batchId: data.batchId || null,
          location: data.location,
          notes: data.notes,
          penType: data.penType,
          status: "نشط",
          current: 0,
        }),
      });
      if (!response.ok) throw new Error("Failed to create pen");
      return response.json();
    },
    onSuccess: (newPen) => {
      queryClient.invalidateQueries({ queryKey: ["/api/pens"] });
      
      toast({
        title: "✅ تم إنشاء العنبر بنجاح",
        description: (
          <div className="space-y-1">
            <p>العنبر: {newPen.name}</p>
            <p>السعة: {newPen.capacity} حيوان</p>
            {selectedBatch && (
              <p className="text-sky-600">مخصص للدفعة: {selectedBatch.name}</p>
            )}
          </div>
        ),
      });

      form.reset({
        name: "",
        capacity: "",
        batchId: "",
        location: "",
        notes: "",
        penType: "مفتوح",
      });
      setSelectedBatch(null);
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "❌ خطأ في إنشاء العنبر",
        description: "حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: PenFormData) => {
    await createPenMutation.mutateAsync(data);
  };

  // Watch batch selection
  const watchedBatchId = form.watch("batchId");

  useEffect(() => {
    if (watchedBatchId) {
      const batch = activeBatches.find((b: any) => b.id === watchedBatchId);
      setSelectedBatch(batch);
    } else {
      setSelectedBatch(null);
    }
  }, [watchedBatchId, activeBatches]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
        >
          <Home className="w-5 h-5 ml-2" />
          إضافة عنبر جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100">
              <Home className="h-6 w-6 text-sky-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                إضافة عنبر جديد
              </DialogTitle>
              <DialogDescription>
                أنشئ عنبر جديد لإيواء الحيوانات
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Pen Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-sky-600" />
                    اسم العنبر *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="مثال: عنبر 11 أو العنبر الشمالي"
                      className="bg-white text-lg font-medium"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    اختر اسماً مميزاً وواضحاً للعنبر
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacity and Type Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-sky-600" />
                      السعة القصوى *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          placeholder="50"
                          className="bg-white text-lg font-semibold pr-12"
                          min="1"
                          max="200"
                          {...field} 
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          حيوان
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      الحد الأقصى للحيوانات (1-200)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="penType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-sky-600" />
                      نوع العنبر *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="اختر نوع العنبر" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="مفتوح">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            مفتوح
                          </div>
                        </SelectItem>
                        <SelectItem value="مغلق">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            مغلق
                          </div>
                        </SelectItem>
                        <SelectItem value="نصف مفتوح">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            نصف مفتوح
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      نوع التهوية والبناء
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Batch Assignment */}
            <FormField
              control={form.control}
              name="batchId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-sky-600" />
                    تخصيص دفعة (اختياري)
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingBatches}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="اختر دفعة للتخصيص..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">بدون تخصيص</SelectItem>
                      {isLoadingBatches ? (
                        <div className="p-4 text-center text-gray-500">
                          جاري التحميل...
                        </div>
                      ) : activeBatches.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          لا توجد دفعات نشطة
                        </div>
                      ) : (
                        activeBatches.map((batch: any) => (
                          <SelectItem key={batch.id} value={batch.id}>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{batch.name}</span>
                              <span className="text-xs text-gray-500">
                                {batch.count} حيوان
                              </span>
                              <Badge variant="outline" className="text-xs">
                                ADG: {batch.avgAdg}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    يمكن تخصيص العنبر لدفعة معينة
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selected Batch Info Card */}
            {selectedBatch && (
              <Card className="border-2 border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-cyan-100">
                      <Package className="h-5 w-5 text-cyan-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        معلومات الدفعة المختارة
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">عدد الحيوانات</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedBatch.count} حيوان
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">متوسط ADG</p>
                          <p className="text-sm font-semibold text-green-600">
                            {selectedBatch.avgAdg} كجم/يوم
                          </p>
                        </div>
                      </div>
                      
                      {parseInt(form.watch("capacity") || "0") < selectedBatch.count && (
                        <div className="flex items-start gap-2 p-2 rounded bg-amber-50 border border-amber-200">
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                          <p className="text-xs text-amber-800">
                            تنبيه: سعة العنبر أقل من عدد حيوانات الدفعة
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-sky-600" />
                    الموقع (اختياري)
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="مثال: الجهة الشمالية - الصف الأول"
                      className="bg-white"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    وصف موقع العنبر في المزرعة
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-sky-600" />
                    ملاحظات (اختياري)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أضف أي ملاحظات حول العنبر، المعدات، التجهيزات..."
                      className="bg-white resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    معلومات إضافية عن العنبر أو تجهيزاته
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
                  setSelectedBatch(null);
                }}
                disabled={createPenMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={createPenMutation.isPending}
                className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
              >
                {createPenMutation.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Home className="ml-2 h-4 w-4" />
                    إنشاء العنبر
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