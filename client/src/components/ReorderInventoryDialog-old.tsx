import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Plus, ShoppingCart, TrendingUp } from "lucide-react";

interface ReorderInventoryDialogProps {
  item: {
    id: string;
    itemName: string;
    itemCode: string;
    currentStock: string;
    reorderPoint: string;
    unit: string;
    unitCost: string;
    supplierId?: string | null;
  };
}

export function ReorderInventoryDialog({ item }: ReorderInventoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [selectedSupplierId, setSelectedSupplierId] = useState(item.supplierId || "");
  const [unitCost, setUnitCost] = useState(item.unitCost || "");
  const [expectedDeliveryDate, setExpectedDeliveryDate] = useState("");
  const [notes, setNotes] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch suppliers
  const { data: suppliers = [] } = useQuery<any[]>({
    queryKey: ["/api/suppliers"],
  });

  // Calculate suggested reorder quantity
  const currentStockNum = parseFloat(item.currentStock);
  const reorderPointNum = parseFloat(item.reorderPoint);
  const suggestedQuantity = Math.max(0, reorderPointNum * 2 - currentStockNum).toFixed(2);

  // Create reorder (add to inventory)
  const reorderMutation = useMutation({
    mutationFn: async (data: any) => {
      // Generate transaction number
      const transactionNumber = `REORDER-${Date.now()}`;
      
      // Create inventory transaction for reorder
      const transactionResponse = await fetch("/api/inventory/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          transactionNumber,
          transactionType: "in",
          itemId: item.id,
          quantity: parseFloat(data.quantity),
          unitCost: parseFloat(data.unitCost),
          totalCost: (parseFloat(data.quantity) * parseFloat(data.unitCost)).toFixed(2),
          supplierId: data.supplierId || null,
          transactionDate: new Date().toISOString(),
          description: "إعادة طلب",
          notes: data.notes || "",
        }),
      });

      if (!transactionResponse.ok) {
        const error = await transactionResponse.json();
        throw new Error(error.message || "فشل في تسجيل عملية إعادة الطلب");
      }

      return await transactionResponse.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/transactions"] });
      toast({
        title: "تم إعادة الطلب بنجاح ✅",
        description: `تم إضافة ${quantity} ${item.unit} من ${item.itemName} إلى المخزون`,
      });
      setOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في إعادة الطلب",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setQuantity("");
    setSelectedSupplierId(item.supplierId || "");
    setUnitCost(item.unitCost || "");
    setExpectedDeliveryDate("");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!quantity || parseFloat(quantity) <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كمية صحيحة",
        variant: "destructive",
      });
      return;
    }

    if (!unitCost || parseFloat(unitCost) <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال تكلفة صحيحة",
        variant: "destructive",
      });
      return;
    }

    reorderMutation.mutate({
      quantity,
      unitCost,
      supplierId: selectedSupplierId || null,
      expectedDeliveryDate: expectedDeliveryDate || null,
      notes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="default">
          <Plus className="w-4 h-4 ml-1" />
          إعادة طلب
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-right text-2xl font-bold flex items-center justify-end gap-2">
            <ShoppingCart className="w-6 h-6 text-primary" />
            إعادة طلب صنف من المخزون
          </DialogTitle>
          <DialogDescription className="text-right text-base mt-2">
            🛒 طلب كمية إضافية من المورد وإضافتها للمخزون
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Information */}
          <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 p-5 rounded-xl shadow-sm">
            <h4 className="text-right font-bold text-orange-900 mb-3 flex items-center justify-end gap-2">
              📦 معلومات الصنف
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-3 text-right">
                <span className="text-muted-foreground block mb-1">اسم الصنف</span>
                <span className="font-bold text-gray-900">{item.itemName}</span>
              </div>
              <div className="bg-white rounded-lg p-3 text-right">
                <span className="text-muted-foreground block mb-1">كود الصنف</span>
                <span className="font-mono text-sm font-semibold text-gray-700">{item.itemCode}</span>
              </div>
              <div className="bg-white rounded-lg p-3 text-right">
                <span className="text-muted-foreground block mb-1">المخزون الحالي</span>
                <span className="font-bold text-red-600 text-lg">
                  {parseFloat(item.currentStock).toFixed(1)} {item.unit}
                </span>
              </div>
              <div className="bg-white rounded-lg p-3 text-right">
                <span className="text-muted-foreground block mb-1">نقطة إعادة الطلب</span>
                <span className="font-bold text-orange-600 text-lg">
                  {parseFloat(item.reorderPoint).toFixed(1)} {item.unit}
                </span>
              </div>
            </div>
          </div>

          {/* Suggested Quantity */}
          {parseFloat(suggestedQuantity) > 0 && (
            <div className="bg-blue-50 border-2 border-blue-300 rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                  <span className="font-bold text-blue-900">الكمية المقترحة للطلب:</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setQuantity(suggestedQuantity)}
                  >
                    استخدام
                  </Button>
                  <span className="text-2xl font-bold text-blue-600">
                    {suggestedQuantity} {item.unit}
                  </span>
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-2 text-right">
                💡 يتم حساب الكمية المقترحة لتصل إلى ضعف نقطة إعادة الطلب
              </p>
            </div>
          )}

          {/* Order Details */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-5 rounded-xl">
            <h4 className="text-right font-bold text-green-900 mb-4 flex items-center justify-end gap-2">
              📝 تفاصيل الطلب
            </h4>
            
            <div className="space-y-4">
              {/* Quantity */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">الكمية المطلوبة *</Label>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="أدخل الكمية"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    required
                    className="text-right h-11 text-lg"
                  />
                  <div className="flex items-center px-4 bg-gradient-to-r from-gray-100 to-gray-200 rounded-md min-w-[80px] justify-center font-bold text-gray-700">
                    {item.unit}
                  </div>
                </div>
              </div>

              {/* Unit Cost */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">تكلفة الوحدة (جنيه) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0.01"
                  placeholder="السعر من المورد"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                  required
                  className="text-right h-11 text-lg"
                />
              </div>

              {/* Total Cost Display */}
              {quantity && unitCost && (
                <div className="bg-white rounded-lg p-4 border-2 border-green-300">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      {(parseFloat(quantity) * parseFloat(unitCost)).toFixed(2)} جنيه
                    </span>
                    <span className="text-sm text-muted-foreground">التكلفة الإجمالية</span>
                  </div>
                </div>
              )}

              {/* Supplier */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">المورد</Label>
                <Select value={selectedSupplierId} onValueChange={setSelectedSupplierId}>
                  <SelectTrigger className="text-right h-11">
                    <SelectValue placeholder="اختر المورد" />
                  </SelectTrigger>
                  <SelectContent>
                    {suppliers.map((supplier: any) => (
                      <SelectItem key={supplier.id} value={supplier.id}>
                        <div className="flex justify-between items-center w-full gap-4">
                          <span className="font-medium">{supplier.name}</span>
                          {supplier.phone && (
                            <span className="text-xs text-muted-foreground">{supplier.phone}</span>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Expected Delivery Date */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">تاريخ التسليم المتوقع</Label>
                <Input
                  type="date"
                  value={expectedDeliveryDate}
                  onChange={(e) => setExpectedDeliveryDate(e.target.value)}
                  className="text-right h-11"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">ملاحظات</Label>
                <Textarea
                  placeholder="أي ملاحظات على الطلب..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="text-right resize-none"
                />
              </div>
            </div>
          </div>

          {/* New Stock Preview */}
          {quantity && (
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-5 rounded-xl">
              <h4 className="text-right font-bold text-purple-900 mb-3">📊 المخزون بعد الاستلام</h4>
              <div className="bg-white rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-3xl font-bold text-purple-600">
                    {(currentStockNum + parseFloat(quantity)).toFixed(1)} {item.unit}
                  </span>
                  <div className="text-right">
                    <span className="text-sm text-muted-foreground block">المخزون الجديد</span>
                    <span className="text-xs text-green-600">
                      ↑ زيادة {quantity} {item.unit}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 justify-start pt-4 border-t">
            <Button 
              type="submit" 
              disabled={reorderMutation.isPending}
              className="px-8"
              size="lg"
            >
              {reorderMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  جاري الطلب...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 ml-2" />
                  تأكيد الطلب
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={reorderMutation.isPending}
              size="lg"
            >
              إلغاء
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
