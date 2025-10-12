import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Plus, Package } from "lucide-react";

export function AddInventoryItemDialog() {
  const [open, setOpen] = useState(false);
  const [itemCode, setItemCode] = useState("");
  const [itemName, setItemName] = useState("");
  const [itemType, setItemType] = useState<"feed" | "medicine">("feed");
  const [currentStock, setCurrentStock] = useState("");
  const [unit, setUnit] = useState("");
  const [reorderPoint, setReorderPoint] = useState("");
  const [unitCost, setUnitCost] = useState("");
  const [supplier, setSupplier] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Add item mutation
  const addItemMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/inventory", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إضافة الصنف");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      toast({
        title: "تم الإضافة بنجاح ✅",
        description: "تم إضافة الصنف إلى المخزون",
      });
      setOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في الإضافة",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setItemCode("");
    setItemName("");
    setItemType("feed");
    setCurrentStock("");
    setUnit("");
    setReorderPoint("");
    setUnitCost("");
    setSupplier("");
    setDescription("");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!itemCode || !itemName || !currentStock || !unit) {
      toast({
        title: "خطأ",
        description: "يرجى ملء الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(currentStock) < 0) {
      toast({
        title: "خطأ",
        description: "الكمية يجب أن تكون أكبر من أو تساوي صفر",
        variant: "destructive",
      });
      return;
    }

    const totalValue = (parseFloat(currentStock) * parseFloat(unitCost || "0")).toFixed(2);

    addItemMutation.mutate({
      itemCode,
      itemName,
      itemType,
      currentStock: parseFloat(currentStock),
      unit,
      reorderPoint: reorderPoint ? parseFloat(reorderPoint) : 0,
      unitCost: unitCost ? parseFloat(unitCost) : 0,
      totalValue: parseFloat(totalValue),
      supplierId: supplier || null,
      description: description || null,
      notes: notes || null,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="w-5 h-5" />
          إضافة صنف
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-right text-2xl font-bold flex items-center justify-end gap-2">
            <Package className="w-6 h-6 text-primary" />
            إضافة صنف جديد للمخزون
          </DialogTitle>
          <DialogDescription className="text-right text-base mt-2">
            📦 إضافة علف أو دواء جديد إلى المخزون
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Basic Information */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-xl">
            <h4 className="text-right font-bold text-blue-900 mb-4 flex items-center justify-end gap-2">
              📋 المعلومات الأساسية
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Item Type */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">نوع الصنف *</Label>
                <Select value={itemType} onValueChange={(value: "feed" | "medicine") => setItemType(value)}>
                  <SelectTrigger className="text-right h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="feed">🌾 علف</SelectItem>
                    <SelectItem value="medicine">💊 دواء</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Item Code */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">كود الصنف *</Label>
                <Input
                  placeholder="مثال: F001 أو M001"
                  value={itemCode}
                  onChange={(e) => setItemCode(e.target.value)}
                  required
                  className="text-right h-11"
                />
              </div>

              {/* Item Name */}
              <div className="space-y-2 md:col-span-2">
                <Label className="text-right block font-semibold">اسم الصنف *</Label>
                <Input
                  placeholder="الاسم الكامل للصنف"
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  required
                  className="text-right h-11"
                />
              </div>
            </div>
          </div>

          {/* Stock Information */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-5 rounded-xl">
            <h4 className="text-right font-bold text-green-900 mb-4 flex items-center justify-end gap-2">
              📊 معلومات المخزون
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Current Stock */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">الكمية الحالية *</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={currentStock}
                  onChange={(e) => setCurrentStock(e.target.value)}
                  required
                  className="text-right h-11"
                />
              </div>

              {/* Unit */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">الوحدة *</Label>
                <Input
                  placeholder="كجم، لتر، كيس، زجاجة..."
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  required
                  className="text-right h-11"
                />
              </div>

              {/* Reorder Point */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">نقطة إعادة الطلب</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="الحد الأدنى للتنبيه"
                  value={reorderPoint}
                  onChange={(e) => setReorderPoint(e.target.value)}
                  className="text-right h-11"
                />
              </div>

              {/* Unit Cost */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">التكلفة للوحدة (جنيه)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={unitCost}
                  onChange={(e) => setUnitCost(e.target.value)}
                  className="text-right h-11"
                />
              </div>

              {/* Total Value Display */}
              {currentStock && unitCost && (
                <div className="md:col-span-2 bg-white rounded-lg p-4 border-2 border-green-300">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-bold text-green-600">
                      {(parseFloat(currentStock) * parseFloat(unitCost)).toFixed(2)} جنيه
                    </span>
                    <span className="text-sm text-muted-foreground">القيمة الإجمالية</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-5 rounded-xl">
            <h4 className="text-right font-bold text-purple-900 mb-4 flex items-center justify-end gap-2">
              ℹ️ معلومات إضافية
            </h4>
            
            <div className="space-y-4">
              {/* Supplier */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">المورد</Label>
                <Input
                  placeholder="اسم المورد أو الشركة"
                  value={supplier}
                  onChange={(e) => setSupplier(e.target.value)}
                  className="text-right h-11"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">الوصف</Label>
                <Input
                  placeholder="وصف مختصر للصنف"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="text-right h-11"
                />
              </div>

              {/* Notes */}
              <div className="space-y-2">
                <Label className="text-right block font-semibold">ملاحظات</Label>
                <Textarea
                  placeholder="أي ملاحظات إضافية..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="text-right resize-none"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-start pt-4 border-t">
            <Button 
              type="submit" 
              disabled={addItemMutation.isPending}
              className="px-8"
              size="lg"
            >
              {addItemMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  جاري الإضافة...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة الصنف
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={addItemMutation.isPending}
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
