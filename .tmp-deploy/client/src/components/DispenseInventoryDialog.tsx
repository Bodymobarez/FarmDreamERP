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
  Minus,
  Loader2,
  Package,
  Users,
  Building2,
  Calendar,
  AlertTriangle,
  Info,
  Calculator,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const dispenseSchema = z.object({
  itemId: z.string().min(1, "يجب اختيار الصنف"),
  quantity: z.string()
    .min(1, "الكمية مطلوبة")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "يجب إدخال كمية صحيحة أكبر من صفر",
    }),
  dispenseTo: z.enum(["batch", "animal", "pen", "general"], {
    errorMap: () => ({ message: "يجب اختيار نوع الصرف" }),
  }),
  targetId: z.string().optional(),
  dispenseDate: z.string().min(1, "التاريخ مطلوب"),
  reason: z.string().min(1, "سبب الصرف مطلوب"),
  notes: z.string().optional(),
});

type DispenseFormData = z.infer<typeof dispenseSchema>;

interface DispenseInventoryDialogProps {
  item?: {
    id: string;
    itemName: string;
    currentStock: string;
    unit: string;
    itemType: string;
  };
}

export function DispenseInventoryDialog({ item }: DispenseInventoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(item || null);
  const [selectedTarget, setSelectedTarget] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory items if not provided
  const { data: inventoryItems = [], isLoading: isLoadingItems } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
    enabled: !item,
  });

  // Fetch targets based on dispense type
  const { data: batches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  const { data: pens = [] } = useQuery<any[]>({
    queryKey: ["/api/pens"],
  });

  const form = useForm<DispenseFormData>({
    resolver: zodResolver(dispenseSchema),
    defaultValues: {
      itemId: item?.id || "",
      quantity: "",
      dispenseTo: "general",
      targetId: "",
      dispenseDate: new Date().toISOString().split("T")[0],
      reason: "",
      notes: "",
    },
  });

  // Create dispense mutation
  const dispenseMutation = useMutation({
    mutationFn: async (data: DispenseFormData) => {
      const response = await fetch("/api/inventory/dispense", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في صرف الصنف");
      }
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/transactions"] });
      
      toast({
        title: "✅ تم صرف الصنف بنجاح",
        description: (
          <div className="space-y-1">
            <p>الصنف: {selectedItem?.itemName}</p>
            <p>الكمية المصروفة: {result.quantity} {selectedItem?.unit}</p>
            <p>السبب: {result.reason}</p>
            {selectedTarget && (
              <p className="text-red-600">إلى: {selectedTarget.name || selectedTarget.earTag}</p>
            )}
          </div>
        ),
      });

      form.reset({
        itemId: item?.id || "",
        quantity: "",
        dispenseTo: "general",
        targetId: "",
        dispenseDate: new Date().toISOString().split("T")[0],
        reason: "",
        notes: "",
      });
      setSelectedTarget(null);
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "❌ خطأ في صرف الصنف",
        description: error.message || "حدث خطأ أثناء الصرف",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: DispenseFormData) => {
    await dispenseMutation.mutateAsync(data);
  };

  // Watch item and target selection
  const watchedItemId = form.watch("itemId");
  const watchedDispenseTo = form.watch("dispenseTo");
  const watchedTargetId = form.watch("targetId");

  React.useEffect(() => {
    if (!item && watchedItemId) {
      const foundItem = inventoryItems.find((i: any) => i.id === watchedItemId);
      setSelectedItem(foundItem);
    }
  }, [watchedItemId, inventoryItems, item]);

  React.useEffect(() => {
    if (watchedTargetId) {
      let target = null;
      if (watchedDispenseTo === "batch") {
        target = batches.find((b: any) => b.id === watchedTargetId);
      } else if (watchedDispenseTo === "animal") {
        target = animals.find((a: any) => a.id === watchedTargetId);
      } else if (watchedDispenseTo === "pen") {
        target = pens.find((p: any) => p.id === watchedTargetId);
      }
      setSelectedTarget(target);
    } else {
      setSelectedTarget(null);
    }
  }, [watchedTargetId, watchedDispenseTo, batches, animals, pens]);

  // Calculate remaining stock
  const calculateRemainingStock = () => {
    if (!selectedItem) return null;
    const currentStock = parseFloat(selectedItem.currentStock || "0");
    const quantity = parseFloat(form.watch("quantity") || "0");
    if (quantity > 0) {
      return (currentStock - quantity).toFixed(2);
    }
    return null;
  };

  const remainingStock = calculateRemainingStock();

  // Get target options based on dispense type
  const getTargetOptions = () => {
    switch (watchedDispenseTo) {
      case "batch":
        return batches.filter((b: any) => b.status === "نشط");
      case "animal":
        return animals.filter((a: any) => a.status === "active");
      case "pen":
        return pens.filter((p: any) => p.status === "نشط");
      default:
        return [];
    }
  };

  const targetOptions = getTargetOptions();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={item ? "outline" : "default"}
          size={item ? "sm" : "lg"}
          className={item ? "w-8 h-8 p-0" : "bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"}
        >
          <Minus className={`${item ? "w-3 h-3" : "w-5 h-5 ml-2"}`} />
          {!item && "صرف من المخزون"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-red-100 to-pink-100">
              <Minus className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                صرف من المخزون
              </DialogTitle>
              <DialogDescription>
                صرف كمية من الأعلاف أو الأدوية مع تسجيل التفاصيل
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Item Selection (if not provided) */}
            {!item && (
              <FormField
                control={form.control}
                name="itemId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-red-600" />
                      الصنف المطلوب صرفه *
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isLoadingItems}
                    >
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="اختر الصنف..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {isLoadingItems ? (
                          <div className="p-4 text-center text-gray-500">
                            جاري التحميل...
                          </div>
                        ) : inventoryItems.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            لا توجد أصناف في المخزون
                          </div>
                        ) : (
                          inventoryItems.map((inventoryItem: any) => (
                            <SelectItem key={inventoryItem.id} value={inventoryItem.id}>
                              <div className="flex items-center gap-3">
                                <span className="font-medium">{inventoryItem.itemName}</span>
                                <span className="text-xs text-gray-500">
                                  {inventoryItem.itemCode}
                                </span>
                                <Badge variant="outline" className="text-xs">
                                  {inventoryItem.currentStock} {inventoryItem.unit}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      اختر الصنف الذي تريد صرفه من المخزون
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Selected Item Info Card */}
            {selectedItem && (
              <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-red-100">
                      <Package className="h-5 w-5 text-red-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        معلومات الصنف المختار
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">الاسم</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedItem.itemName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">النوع</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedItem.itemType === "feed" ? "علف" : "دواء"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">المخزون الحالي</p>
                          <p className="text-sm font-semibold text-green-600">
                            {selectedItem.currentStock} {selectedItem.unit}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">نقطة إعادة الطلب</p>
                          <p className="text-sm font-semibold text-orange-600">
                            {selectedItem.reorderPoint} {selectedItem.unit}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quantity */}
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calculator className="h-4 w-4 text-red-600" />
                    الكمية المطلوب صرفها *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="10"
                        className="bg-white text-lg font-semibold pr-16"
                        {...field} 
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                        {selectedItem?.unit || "وحدة"}
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    الكمية التي تريد صرفها من المخزون
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Remaining Stock Display */}
            {remainingStock && selectedItem && (
              <Card className={`border-2 ${parseFloat(remainingStock) < parseFloat(selectedItem.reorderPoint) ? "border-orange-200 bg-gradient-to-br from-orange-50/50" : "border-green-200 bg-gradient-to-br from-green-50/50"} to-transparent`}>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${parseFloat(remainingStock) < parseFloat(selectedItem.reorderPoint) ? "bg-orange-100" : "bg-green-100"}`}>
                      <Calculator className={`h-5 w-5 ${parseFloat(remainingStock) < parseFloat(selectedItem.reorderPoint) ? "text-orange-600" : "text-green-600"}`} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        المخزون المتبقي بعد الصرف
                      </h4>
                      <p className={`text-2xl font-bold ${parseFloat(remainingStock) < parseFloat(selectedItem.reorderPoint) ? "text-orange-600" : "text-green-600"}`}>
                        {remainingStock} {selectedItem.unit}
                      </p>
                      {parseFloat(remainingStock) < parseFloat(selectedItem.reorderPoint) && (
                        <div className="flex items-center gap-2 mt-2">
                          <AlertTriangle className="h-4 w-4 text-orange-600" />
                          <p className="text-xs text-orange-800">
                            تحذير: المخزون أقل من نقطة إعادة الطلب
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dispense To */}
            <FormField
              control={form.control}
              name="dispenseTo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-red-600" />
                    نوع الصرف *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="اختر نوع الصرف" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">
                        <div className="flex items-center gap-2">
                          <Package className="w-4 h-4 text-gray-600" />
                          <span>صرف عام</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="batch">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>إلى دفعة</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="animal">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-green-600" />
                          <span>إلى حيوان محدد</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="pen">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-600" />
                          <span>إلى عنبر</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    حدد إلى من سيتم صرف هذا الصنف
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Target Selection (if not general) */}
            {watchedDispenseTo !== "general" && (
              <FormField
                control={form.control}
                name="targetId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      {watchedDispenseTo === "batch" && <Users className="h-4 w-4 text-red-600" />}
                      {watchedDispenseTo === "animal" && <Users className="h-4 w-4 text-red-600" />}
                      {watchedDispenseTo === "pen" && <Building2 className="h-4 w-4 text-red-600" />}
                      اختر {watchedDispenseTo === "batch" ? "الدفعة" : watchedDispenseTo === "animal" ? "الحيوان" : "العنبر"} *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder={`اختر ${watchedDispenseTo === "batch" ? "الدفعة" : watchedDispenseTo === "animal" ? "الحيوان" : "العنبر"}...`} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {targetOptions.length === 0 ? (
                          <div className="p-4 text-center text-gray-500">
                            لا توجد خيارات متاحة
                          </div>
                        ) : (
                          targetOptions.map((option: any) => (
                            <SelectItem key={option.id} value={option.id}>
                              <div className="flex items-center gap-3">
                                <span className="font-medium">
                                  {option.name || option.earTag || `${watchedDispenseTo} ${option.id}`}
                                </span>
                                {watchedDispenseTo === "batch" && (
                                  <Badge variant="outline" className="text-xs">
                                    {option.count} حيوان
                                  </Badge>
                                )}
                                {watchedDispenseTo === "animal" && (
                                  <Badge variant="outline" className="text-xs">
                                    {option.animalType}
                                  </Badge>
                                )}
                                {watchedDispenseTo === "pen" && (
                                  <Badge variant="outline" className="text-xs">
                                    {option.current}/{option.capacity}
                                  </Badge>
                                )}
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      اختر {watchedDispenseTo === "batch" ? "الدفعة" : watchedDispenseTo === "animal" ? "الحيوان" : "العنبر"} المطلوب الصرف إليه
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Selected Target Info Card */}
            {selectedTarget && (
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      {watchedDispenseTo === "batch" && <Users className="h-5 w-5 text-blue-600" />}
                      {watchedDispenseTo === "animal" && <Users className="h-5 w-5 text-blue-600" />}
                      {watchedDispenseTo === "pen" && <Building2 className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        معلومات {watchedDispenseTo === "batch" ? "الدفعة" : watchedDispenseTo === "animal" ? "الحيوان" : "العنبر"} المختار
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">الاسم/الرقم</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedTarget.name || selectedTarget.earTag || selectedTarget.id}
                          </p>
                        </div>
                        {watchedDispenseTo === "batch" && (
                          <div>
                            <p className="text-xs text-gray-600 mb-1">عدد الحيوانات</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {selectedTarget.count} حيوان
                            </p>
                          </div>
                        )}
                        {watchedDispenseTo === "animal" && (
                          <div>
                            <p className="text-xs text-gray-600 mb-1">النوع</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {selectedTarget.animalType}
                            </p>
                          </div>
                        )}
                        {watchedDispenseTo === "pen" && (
                          <div>
                            <p className="text-xs text-gray-600 mb-1">الإشغال</p>
                            <p className="text-sm font-semibold text-gray-900">
                              {selectedTarget.current}/{selectedTarget.capacity}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Date and Reason */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="dispenseDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-red-600" />
                      تاريخ الصرف *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      تاريخ إجراء عملية الصرف
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-red-600" />
                      سبب الصرف *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="اختر سبب الصرف" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="feeding">تغذية</SelectItem>
                        <SelectItem value="treatment">علاج</SelectItem>
                        <SelectItem value="vaccination">تحصين</SelectItem>
                        <SelectItem value="maintenance">صيانة</SelectItem>
                        <SelectItem value="waste">تالف</SelectItem>
                        <SelectItem value="transfer">نقل</SelectItem>
                        <SelectItem value="other">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      السبب من وراء صرف هذا الصنف
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-red-600" />
                    ملاحظات (اختياري)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أي ملاحظات إضافية حول عملية الصرف..."
                      className="bg-white resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    ملاحظات إضافية أو تفاصيل عن عملية الصرف
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
                  setSelectedTarget(null);
                }}
                disabled={dispenseMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={dispenseMutation.isPending || !selectedItem}
                className="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
              >
                {dispenseMutation.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الصرف...
                  </>
                ) : (
                  <>
                    <Minus className="ml-2 h-4 w-4" />
                    تأكيد الصرف
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