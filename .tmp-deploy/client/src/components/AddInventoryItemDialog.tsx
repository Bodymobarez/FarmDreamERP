import React, { useState } from "react";
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
  Plus,
  Loader2,
  Package2,
  Pill,
  Barcode,
  DollarSign,
  Truck,
  AlertTriangle,
  Info,
  Calculator,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const itemSchema = z.object({
  itemCode: z.string().min(1, "كود الصنف مطلوب")
    .max(20, "كود الصنف يجب أن يكون أقل من 20 حرف"),
  itemName: z.string().min(1, "اسم الصنف مطلوب")
    .max(100, "اسم الصنف يجب أن يكون أقل من 100 حرف"),
  itemType: z.enum(["feed", "medicine"], {
    errorMap: () => ({ message: "يجب اختيار نوع الصنف" }),
  }),
  currentStock: z.string()
    .min(1, "الكمية الحالية مطلوبة")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "يجب إدخال كمية صحيحة",
    }),
  unit: z.string().min(1, "الوحدة مطلوبة"),
  reorderPoint: z.string()
    .min(1, "نقطة إعادة الطلب مطلوبة")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) >= 0, {
      message: "يجب إدخال نقطة إعادة طلب صحيحة",
    }),
  unitCost: z.string()
    .min(1, "تكلفة الوحدة مطلوبة")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "يجب إدخال تكلفة صحيحة أكبر من صفر",
    }),
  supplierId: z.string().min(1, "يجب اختيار المورد"),
  description: z.string().optional(),
  notes: z.string().optional(),
});

type ItemFormData = z.infer<typeof itemSchema>;

export function AddInventoryItemDialog() {
  const [open, setOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch suppliers
  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery<any[]>({
    queryKey: ["/api/suppliers"],
  });

  const form = useForm<ItemFormData>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      itemCode: "",
      itemName: "",
      itemType: "feed",
      currentStock: "",
      unit: "",
      reorderPoint: "",
      unitCost: "",
      supplierId: "",
      description: "",
      notes: "",
    },
  });

  // Create item mutation
  const createItemMutation = useMutation({
    mutationFn: async (data: ItemFormData) => {
      const currentStock = parseFloat(data.currentStock);
      const unitCost = parseFloat(data.unitCost);
      const totalValue = currentStock * unitCost;
      
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          currentStock: currentStock.toString(),
          reorderPoint: parseFloat(data.reorderPoint).toString(),
          unitCost: unitCost.toString(),
          totalValue: totalValue.toString(),
        }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إضافة الصنف");
      }
      return response.json();
    },
    onSuccess: (newItem) => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      
      const totalValue = parseFloat(newItem.currentStock) * parseFloat(newItem.unitCost);
      
      toast({
        title: "✅ تم إضافة الصنف بنجاح",
        description: (
          <div className="space-y-1">
            <p>الصنف: {newItem.itemName}</p>
            <p>الكود: {newItem.itemCode}</p>
            <p>الكمية: {newItem.currentStock} {newItem.unit}</p>
            <p>القيمة الإجمالية: {totalValue.toLocaleString()} جنيه</p>
            {selectedSupplier && (
              <p className="text-emerald-600">المورد: {selectedSupplier.name}</p>
            )}
          </div>
        ),
      });

      form.reset();
      setSelectedSupplier(null);
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "❌ خطأ في إضافة الصنف",
        description: error.message || "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ItemFormData) => {
    await createItemMutation.mutateAsync(data);
  };

  // Watch supplier selection
  const watchedSupplierId = form.watch("supplierId");

  React.useEffect(() => {
    if (watchedSupplierId) {
      const supplier = suppliers.find((s: any) => s.id === watchedSupplierId);
      setSelectedSupplier(supplier);
    } else {
      setSelectedSupplier(null);
    }
  }, [watchedSupplierId, suppliers]);

  // Calculate total value
  const calculateTotalValue = () => {
    const currentStock = parseFloat(form.watch("currentStock") || "0");
    const unitCost = parseFloat(form.watch("unitCost") || "0");
    if (currentStock > 0 && unitCost > 0) {
      return (currentStock * unitCost).toFixed(2);
    }
    return null;
  };

  const totalValue = calculateTotalValue();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
        >
          <Plus className="w-5 h-5 ml-2" />
          إضافة صنف جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-emerald-100 to-green-100">
              <Package2 className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                إضافة صنف جديد للمخزون
              </DialogTitle>
              <DialogDescription>
                أضف صنف جديد من الأعلاف أو الأدوية مع التفاصيل الكاملة
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Item Code and Name */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="itemCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Barcode className="h-4 w-4 text-emerald-600" />
                      كود الصنف *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="مثال: FD001"
                        className="bg-white text-lg font-medium"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      كود فريد للصنف (حتى 20 حرف)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Package2 className="h-4 w-4 text-emerald-600" />
                      اسم الصنف *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="مثال: علف نمو متكامل"
                        className="bg-white text-lg font-medium"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      الاسم التجاري للصنف
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Item Type */}
            <FormField
              control={form.control}
              name="itemType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package2 className="h-4 w-4 text-emerald-600" />
                    نوع الصنف *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="اختر نوع الصنف" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="feed">
                        <div className="flex items-center gap-2">
                          <Package2 className="w-4 h-4 text-green-600" />
                          <span>علف</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="medicine">
                        <div className="flex items-center gap-2">
                          <Pill className="w-4 h-4 text-purple-600" />
                          <span>دواء</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    تصنيف الصنف (علف أو دواء)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Stock and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Package2 className="h-4 w-4 text-emerald-600" />
                      الكمية الحالية *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="100"
                        className="bg-white text-lg font-semibold"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      الكمية المتوفرة حالياً
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وحدة القياس *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="اختر الوحدة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="كجم">كيلوجرام (كجم)</SelectItem>
                        <SelectItem value="طن">طن</SelectItem>
                        <SelectItem value="شيكارة">شيكارة</SelectItem>
                        <SelectItem value="زجاجة">زجاجة</SelectItem>
                        <SelectItem value="علبة">علبة</SelectItem>
                        <SelectItem value="عبوة">عبوة</SelectItem>
                        <SelectItem value="قرص">قرص</SelectItem>
                        <SelectItem value="حقنة">حقنة</SelectItem>
                        <SelectItem value="لتر">لتر</SelectItem>
                        <SelectItem value="مل">مليلتر (مل)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      وحدة قياس الكمية
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Reorder Point and Unit Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="reorderPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-emerald-600" />
                      نقطة إعادة الطلب *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="20"
                        className="bg-white text-lg font-semibold"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      الحد الأدنى قبل التنبيه لإعادة الطلب
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-emerald-600" />
                      تكلفة الوحدة *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="25.50"
                          className="bg-white text-lg font-semibold pr-12"
                          {...field} 
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          جنيه
                        </div>
                      </div>
                    </FormControl>
                    <FormDescription>
                      سعر الوحدة الواحدة بالجنيه المصري
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Total Value Display */}
            {totalValue && (
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Calculator className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        القيمة الإجمالية للمخزون
                      </h4>
                      <p className="text-2xl font-bold text-blue-600">
                        {totalValue} جنيه
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Supplier Selection */}
            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-emerald-600" />
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
                    المورد الرئيسي لهذا الصنف
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Selected Supplier Info Card */}
            {selectedSupplier && (
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <Truck className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        معلومات المورد المختار
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

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-emerald-600" />
                    وصف الصنف (اختياري)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="وصف تفصيلي للصنف، المكونات، الاستخدام..."
                      className="bg-white resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    معلومات تفصيلية عن الصنف واستخداماته
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
                    <Info className="h-4 w-4 text-emerald-600" />
                    ملاحظات (اختياري)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أي ملاحظات إضافية، تعليمات التخزين، تواريخ الانتهاء..."
                      className="bg-white resize-none"
                      rows={2}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    ملاحظات إضافية أو تعليمات خاصة
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
                }}
                disabled={createItemMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={createItemMutation.isPending}
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700"
              >
                {createItemMutation.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإضافة...
                  </>
                ) : (
                  <>
                    <Plus className="ml-2 h-4 w-4" />
                    إضافة الصنف
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