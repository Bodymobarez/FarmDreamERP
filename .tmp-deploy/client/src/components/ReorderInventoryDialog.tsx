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
  ShoppingCart,
  Loader2,
  Package,
  Truck,
  Calendar,
  DollarSign,
  Calculator,
  AlertTriangle,
  Building,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const reorderSchema = z.object({
  itemId: z.string().min(1, "يجب اختيار الصنف"),
  supplierId: z.string().min(1, "يجب اختيار المورد"),
  quantity: z.string()
    .min(1, "الكمية مطلوبة")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "يجب إدخال كمية صحيحة أكبر من صفر",
    }),
  unitCost: z.string()
    .min(1, "تكلفة الوحدة مطلوبة")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "يجب إدخال تكلفة صحيحة أكبر من صفر",
    }),
  expectedDeliveryDate: z.string().min(1, "تاريخ التسليم المتوقع مطلوب"),
  orderDate: z.string().min(1, "تاريخ الطلب مطلوب"),
  notes: z.string().optional(),
  urgencyLevel: z.enum(["low", "medium", "high", "critical"], {
    errorMap: () => ({ message: "يجب اختيار مستوى الأولوية" }),
  }),
});

type ReorderFormData = z.infer<typeof reorderSchema>;

interface ReorderInventoryDialogProps {
  item?: {
    id: string;
    itemName: string;
    currentStock: string;
    unit: string;
    reorderPoint: string;
    costPerUnit: string;
  };
}

export function ReorderInventoryDialog({ item }: ReorderInventoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(item || null);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory items if not provided
  const { data: inventoryItems = [], isLoading: isLoadingItems } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
    enabled: !item,
  });

  // Fetch suppliers
  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery<any[]>({
    queryKey: ["/api/suppliers"],
  });

  const form = useForm<ReorderFormData>({
    resolver: zodResolver(reorderSchema),
    defaultValues: {
      itemId: item?.id || "",
      supplierId: "",
      quantity: item ? (parseFloat(item.reorderPoint) * 2).toString() : "",
      unitCost: item?.costPerUnit || "",
      expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      orderDate: new Date().toISOString().split("T")[0],
      notes: "",
      urgencyLevel: "medium",
    },
  });

  // Create reorder mutation
  const reorderMutation = useMutation({
    mutationFn: async (data: ReorderFormData) => {
      const response = await fetch("/api/inventory/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إنشاء طلب الشراء");
      }
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/purchase-orders"] });
      
      toast({
        title: "✅ تم إنشاء طلب الشراء بنجاح",
        description: (
          <div className="space-y-1">
            <p>الصنف: {selectedItem?.itemName}</p>
            <p>الكمية: {result.quantity} {selectedItem?.unit}</p>
            <p>المورد: {selectedSupplier?.name}</p>
            <p>القيمة الإجمالية: {result.totalCost} جنيه</p>
          </div>
        ),
      });

      form.reset({
        itemId: item?.id || "",
        supplierId: "",
        quantity: item ? (parseFloat(item.reorderPoint) * 2).toString() : "",
        unitCost: item?.costPerUnit || "",
        expectedDeliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        orderDate: new Date().toISOString().split("T")[0],
        notes: "",
        urgencyLevel: "medium",
      });
      setSelectedSupplier(null);
      setOpen(false);
    },
    onError: (error: any) => {
      toast({
        title: "❌ خطأ في إنشاء طلب الشراء",
        description: error.message || "حدث خطأ أثناء إنشاء الطلب",
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: ReorderFormData) => {
    await reorderMutation.mutateAsync(data);
  };

  // Watch item and supplier selection
  const watchedItemId = form.watch("itemId");
  const watchedSupplierId = form.watch("supplierId");
  const watchedQuantity = form.watch("quantity");
  const watchedUnitCost = form.watch("unitCost");

  React.useEffect(() => {
    if (!item && watchedItemId) {
      const foundItem = inventoryItems.find((i: any) => i.id === watchedItemId);
      setSelectedItem(foundItem);
      if (foundItem) {
        form.setValue("quantity", (parseFloat(foundItem.reorderPoint || "0") * 2).toString());
        form.setValue("unitCost", foundItem.costPerUnit || "");
      }
    }
  }, [watchedItemId, inventoryItems, item, form]);

  React.useEffect(() => {
    if (watchedSupplierId) {
      const supplier = suppliers.find((s: any) => s.id === watchedSupplierId);
      setSelectedSupplier(supplier);
    } else {
      setSelectedSupplier(null);
    }
  }, [watchedSupplierId, suppliers]);

  // Calculate total cost
  const calculateTotalCost = () => {
    const quantity = parseFloat(watchedQuantity || "0");
    const unitCost = parseFloat(watchedUnitCost || "0");
    if (quantity > 0 && unitCost > 0) {
      return (quantity * unitCost).toFixed(2);
    }
    return "0.00";
  };

  const totalCost = calculateTotalCost();

  // Calculate suggested quantity based on reorder point
  const calculateSuggestedQuantity = () => {
    if (!selectedItem?.reorderPoint) return null;
    const reorderPoint = parseFloat(selectedItem.reorderPoint);
    const currentStock = parseFloat(selectedItem.currentStock || "0");
    return Math.max(reorderPoint * 2 - currentStock, reorderPoint).toFixed(2);
  };

  const suggestedQuantity = calculateSuggestedQuantity();

  // Get urgency level color and text
  const getUrgencyInfo = (level: string) => {
    switch (level) {
      case "low":
        return { color: "text-blue-600", bg: "bg-blue-100", text: "منخفضة" };
      case "medium":
        return { color: "text-yellow-600", bg: "bg-yellow-100", text: "متوسطة" };
      case "high":
        return { color: "text-orange-600", bg: "bg-orange-100", text: "عالية" };
      case "critical":
        return { color: "text-red-600", bg: "bg-red-100", text: "عاجلة" };
      default:
        return { color: "text-gray-600", bg: "bg-gray-100", text: "غير محدد" };
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant={item ? "outline" : "default"}
          size={item ? "sm" : "lg"}
          className={item ? "w-8 h-8 p-0" : "bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"}
        >
          <ShoppingCart className={`${item ? "w-3 h-3" : "w-5 h-5 ml-2"}`} />
          {!item && "إعادة طلب"}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-100 to-cyan-100">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                طلب شراء جديد
              </DialogTitle>
              <DialogDescription>
                إنشاء طلب شراء لإعادة تعبئة المخزون من المورد
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
                      <Package className="h-4 w-4 text-blue-600" />
                      الصنف المطلوب طلبه *
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
                                <Badge 
                                  variant="outline" 
                                  className={`text-xs ${parseFloat(inventoryItem.currentStock) < parseFloat(inventoryItem.reorderPoint) ? "border-red-300 text-red-600" : "border-green-300 text-green-600"}`}
                                >
                                  {inventoryItem.currentStock} {inventoryItem.unit}
                                </Badge>
                              </div>
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      اختر الصنف الذي تريد طلب كمية جديدة منه
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Selected Item Info Card */}
            {selectedItem && (
              <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-blue-100">
                      <Package className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        معلومات الصنف المختار
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                          <p className={`text-sm font-semibold ${parseFloat(selectedItem.currentStock) < parseFloat(selectedItem.reorderPoint) ? "text-red-600" : "text-green-600"}`}>
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
                      {parseFloat(selectedItem.currentStock) < parseFloat(selectedItem.reorderPoint) && (
                        <div className="flex items-center gap-2 mt-3 p-2 bg-red-50 rounded-lg">
                          <AlertTriangle className="h-4 w-4 text-red-600" />
                          <p className="text-xs text-red-800">
                            تحذير: المخزون الحالي أقل من نقطة إعادة الطلب
                          </p>
                        </div>
                      )}
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
                    <Truck className="h-4 w-4 text-blue-600" />
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
                          لا توجد موردين مسجلين
                        </div>
                      ) : (
                        suppliers.map((supplier: any) => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{supplier.name}</span>
                              <Badge variant="outline" className="text-xs">
                                {supplier.rating || "غير مقيم"}⭐
                              </Badge>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    اختر المورد الذي سيتم شراء الصنف منه
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
                      <Building className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        معلومات المورد المختار
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">الاسم</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedSupplier.name}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">الهاتف</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedSupplier.phone || "غير متوفر"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">التقييم</p>
                          <p className="text-sm font-semibold text-gray-900">
                            {selectedSupplier.rating || "غير مقيم"} ⭐
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quantity and Cost */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calculator className="h-4 w-4 text-blue-600" />
                      الكمية المطلوبة *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          step="0.1"
                          placeholder="100"
                          className="bg-white text-lg font-semibold pr-16"
                          {...field} 
                        />
                        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                          {selectedItem?.unit || "وحدة"}
                        </div>
                      </div>
                    </FormControl>
                    {suggestedQuantity && (
                      <div className="flex items-center gap-2 mt-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => form.setValue("quantity", suggestedQuantity)}
                          className="text-xs text-blue-600 hover:text-blue-700"
                        >
                          استخدم الكمية المقترحة: {suggestedQuantity} {selectedItem?.unit}
                        </Button>
                      </div>
                    )}
                    <FormDescription>
                      الكمية التي تريد طلبها من المورد
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
                      <DollarSign className="h-4 w-4 text-blue-600" />
                      تكلفة الوحدة *
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input 
                          type="number" 
                          step="0.01"
                          placeholder="15.50"
                          className="bg-white text-lg font-semibold pl-16"
                          {...field} 
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
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

            {/* Total Cost Display */}
            {parseFloat(totalCost) > 0 && (
              <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-purple-100">
                      <Calculator className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm text-gray-900 mb-1">
                        التكلفة الإجمالية
                      </h4>
                      <p className="text-3xl font-bold text-purple-600">
                        {totalCost} جنيه
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {watchedQuantity} {selectedItem?.unit} × {watchedUnitCost} جنيه
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Dates and Priority */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      تاريخ الطلب *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      تاريخ إنشاء الطلب
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="expectedDeliveryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-blue-600" />
                      تاريخ التسليم المتوقع *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
                        className="bg-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>
                      التاريخ المتوقع للتسليم
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="urgencyLevel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-blue-600" />
                      مستوى الأولوية *
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="اختر الأولوية" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="low">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                            <span>منخفضة</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="medium">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                            <span>متوسطة</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="high">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                            <span>عالية</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="critical">
                          <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-red-500"></div>
                            <span>عاجلة</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      مدى أهمية وعجلة هذا الطلب
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
                    <Package className="h-4 w-4 text-blue-600" />
                    ملاحظات (اختياري)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أي ملاحظات إضافية حول الطلب، مواصفات خاصة، أو تعليمات للمورد..."
                      className="bg-white resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    ملاحظات إضافية أو متطلبات خاصة للطلب
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
                disabled={reorderMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={reorderMutation.isPending || !selectedItem || !selectedSupplier}
                className="bg-gradient-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700"
              >
                {reorderMutation.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري إنشاء الطلب...
                  </>
                ) : (
                  <>
                    <ShoppingCart className="ml-2 h-4 w-4" />
                    إنشاء طلب الشراء
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