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
import { Package, Minus } from "lucide-react";

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
  const [quantity, setQuantity] = useState("");
  const [selectedItemId, setSelectedItemId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [animalId, setAnimalId] = useState("");
  const [penNumber, setPenNumber] = useState("");
  const [description, setDescription] = useState("");
  const [notes, setNotes] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory items if not provided
  const { data: inventoryItems = [], isLoading: isLoadingItems } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
    enabled: !item,
  });

  // Fetch batches for selection
  const { data: batches = [], isLoading: isLoadingBatches } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

  // Fetch animals for selection
  const { data: animals = [], isLoading: isLoadingAnimals } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // Extract unique pen numbers from batches
  const penNumbers = Array.from(new Set(
    batches
      .map((batch: any) => batch.penNumber)
      .filter((pen: string) => pen && pen.trim())
  )).sort();

  const selectedItem = item || (selectedItemId ? inventoryItems.find((i: any) => i.id === selectedItemId) : null);
  const selectedBatch = batchId ? batches.find((b: any) => b.id === batchId) : null;

  // Dispense mutation
  const dispenseMutation = useMutation({
    mutationFn: async (data: any) => {
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory/transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/batches"] });
      toast({
        title: "تم الصرف بنجاح",
        description: "تم تسجيل عملية الصرف وتحديث المخزون",
      });
      setOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في الصرف",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setQuantity("");
    setSelectedItemId("");
    setBatchId("");
    setAnimalId("");
    setPenNumber("");
    setDescription("");
    setNotes("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const itemIdToUse = item?.id || selectedItemId;

    if (!itemIdToUse) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الصنف",
        variant: "destructive",
      });
      return;
    }

    if (!quantity || parseFloat(quantity) <= 0) {
      toast({
        title: "خطأ",
        description: "يرجى إدخال كمية صحيحة",
        variant: "destructive",
      });
      return;
    }

    const availableStock = parseFloat(selectedItem?.currentStock || "0");
    if (parseFloat(quantity) > availableStock) {
      toast({
        title: "خطأ",
        description: `الكمية المطلوبة أكبر من المتاح في المخزون (${availableStock} ${selectedItem?.unit})`,
        variant: "destructive",
      });
      return;
    }

    dispenseMutation.mutate({
      itemId: itemIdToUse,
      quantity: parseFloat(quantity),
      batchId: batchId || null,
      animalId: animalId || null,
      penNumber: penNumber || null,
      description,
      notes,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {item ? (
          <Button variant="outline" size="sm">
            <Minus className="w-4 h-4 ml-2" />
            صرف
          </Button>
        ) : (
          <Button>
            <Package className="w-5 h-5 ml-2" />
            صرف من المخزون
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-right text-2xl font-bold flex items-center justify-end gap-2">
            <Package className="w-6 h-6 text-primary" />
            صرف من المخزون
          </DialogTitle>
          <DialogDescription className="text-right text-base mt-2">
            📋 تسجيل عملية صرف أعلاف أو أدوية للحيوانات أو الدفعات
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Item Selection */}
          {!item && (
            <div className="space-y-2">
              <Label className="text-right block font-semibold">الصنف المراد صرفه *</Label>
              {inventoryItems.length === 0 ? (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-right">
                  <p className="text-sm text-yellow-800">لا توجد أصناف متاحة في المخزون</p>
                </div>
              ) : (
                <Select value={selectedItemId} onValueChange={setSelectedItemId}>
                  <SelectTrigger className="text-right h-11">
                    <SelectValue placeholder="اختر الصنف من القائمة" />
                  </SelectTrigger>
                  <SelectContent>
                    {inventoryItems.map((invItem: any) => (
                      <SelectItem key={invItem.id} value={invItem.id}>
                        <div className="flex justify-between items-center w-full gap-4">
                          <span className="font-medium">{invItem.itemName}</span>
                          <span className="text-xs text-muted-foreground">
                            متاح: {parseFloat(invItem.currentStock).toFixed(1)} {invItem.unit}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}

          {selectedItem && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-5 rounded-xl shadow-sm">
              <h4 className="text-right font-bold text-blue-900 mb-3 flex items-center justify-end gap-2">
                <Package className="w-4 h-4" />
                معلومات الصنف
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-lg p-3 text-right">
                  <span className="text-muted-foreground block mb-1">اسم الصنف</span>
                  <span className="font-bold text-gray-900">{selectedItem.itemName}</span>
                </div>
                <div className="bg-white rounded-lg p-3 text-right">
                  <span className="text-muted-foreground block mb-1">الكمية المتاحة</span>
                  <span className="font-bold text-green-600 text-lg">
                    {parseFloat(selectedItem.currentStock).toFixed(1)} {selectedItem.unit}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 text-right">
                  <span className="text-muted-foreground block mb-1">نوع الصنف</span>
                  <span className="font-bold text-blue-600">
                    {selectedItem.itemType === "feed" ? "🌾 علف" : "💊 دواء"}
                  </span>
                </div>
                <div className="bg-white rounded-lg p-3 text-right">
                  <span className="text-muted-foreground block mb-1">كود الصنف</span>
                  <span className="font-mono text-sm font-semibold text-gray-700">
                    {selectedItem.itemCode || "غير محدد"}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="space-y-2">
            <Label className="text-right block font-semibold">الكمية المراد صرفها *</Label>
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
                {selectedItem?.unit || "وحدة"}
              </div>
            </div>
            {quantity && selectedItem && parseFloat(quantity) > parseFloat(selectedItem.currentStock) && (
              <p className="text-sm text-red-600 text-right">⚠️ الكمية المطلوبة أكبر من المتاح!</p>
            )}
          </div>

          {/* Batch Selection */}
          <div className="space-y-2">
            <Label className="text-right block font-semibold">الدفعة (اختياري)</Label>
            <p className="text-xs text-muted-foreground text-right">📦 اختر دفعة محددة إذا كان الصرف لجميع حيوانات الدفعة</p>
            <div className="flex gap-2">
              <Select value={batchId} onValueChange={setBatchId}>
                <SelectTrigger className="text-right h-11 flex-1">
                  <SelectValue placeholder="اختر الدفعة إذا كان الصرف للدفعة كاملة" />
                </SelectTrigger>
                <SelectContent>
                  {batches.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      لا توجد دفعات متاحة
                    </div>
                  ) : (
                    batches.map((batch: any) => (
                      <SelectItem key={batch.id} value={batch.id}>
                        <div className="flex justify-between items-center w-full gap-4">
                          <div className="flex flex-col items-start">
                            <span className="font-bold">{batch.batchNumber}</span>
                            {batch.penNumber && (
                              <span className="text-xs text-blue-600">📍 عنبر: {batch.penNumber}</span>
                            )}
                          </div>
                          <div className="flex flex-col items-end">
                            <span className="text-xs text-green-600 font-semibold">
                              {batch.activeAnimals} حيوان نشط
                            </span>
                            {batch.averageWeight && (
                              <span className="text-xs text-muted-foreground">
                                متوسط: {parseFloat(batch.averageWeight).toFixed(1)} كجم
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {batchId && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setBatchId("")}
                  className="h-11 w-11 flex-shrink-0"
                >
                  ✕
                </Button>
              )}
            </div>
            {selectedBatch && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mt-2">
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-right">
                    <span className="text-muted-foreground">رقم الدفعة:</span>
                    <span className="font-bold mr-2">{selectedBatch.batchNumber}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-muted-foreground">الحيوانات:</span>
                    <span className="font-bold text-green-600 mr-2">{selectedBatch.activeAnimals}</span>
                  </div>
                  {selectedBatch.penNumber && (
                    <div className="text-right">
                      <span className="text-muted-foreground">العنبر:</span>
                      <span className="font-bold text-blue-600 mr-2">{selectedBatch.penNumber}</span>
                    </div>
                  )}
                  {selectedBatch.averageWeight && (
                    <div className="text-right">
                      <span className="text-muted-foreground">متوسط الوزن:</span>
                      <span className="font-bold mr-2">{parseFloat(selectedBatch.averageWeight).toFixed(1)} كجم</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Animal Selection */}
          {selectedItem?.itemType === "medicine" && (
            <div className="space-y-2">
              <Label className="text-right block font-semibold">الحيوان (للعلاج الفردي)</Label>
              <div className="flex gap-2">
                <Select value={animalId} onValueChange={setAnimalId}>
                  <SelectTrigger className="text-right h-11 flex-1">
                    <SelectValue placeholder="اختر الحيوان إذا كان علاج فردي" />
                  </SelectTrigger>
                  <SelectContent>
                    {animals
                      .filter((a: any) => a.status === "active")
                      .map((animal: any) => (
                        <SelectItem key={animal.id} value={animal.id}>
                          {animal.earTag} - {animal.animalType}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                {animalId && (
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={() => setAnimalId("")}
                    className="h-11 w-11 flex-shrink-0"
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Pen Number */}
          <div className="space-y-2">
            <Label className="text-right block font-semibold">العنبر (اختياري)</Label>
            <p className="text-xs text-muted-foreground text-right">🏠 حدد العنبر الذي تم فيه الصرف</p>
            <div className="flex gap-2">
              <Select value={penNumber} onValueChange={setPenNumber}>
                <SelectTrigger className="text-right h-11 flex-1">
                  <SelectValue placeholder="اختر رقم العنبر" />
                </SelectTrigger>
                <SelectContent>
                  {penNumbers.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                      لا توجد عنابر محددة في الدفعات
                    </div>
                  ) : (
                    penNumbers.map((pen: string) => (
                      <SelectItem key={pen} value={pen}>
                        <div className="flex items-center gap-2">
                          <span className="font-bold">🏠 عنبر {pen}</span>
                          <span className="text-xs text-muted-foreground">
                            ({batches.filter((b: any) => b.penNumber === pen).length} دفعة)
                          </span>
                        </div>
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
              {penNumber && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setPenNumber("")}
                  className="h-11 w-11 flex-shrink-0"
                >
                  ✕
                </Button>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="text-right block font-semibold">الغرض من الصرف</Label>
            <p className="text-xs text-muted-foreground text-right">✍️ وضح سبب الصرف لسهولة المتابعة</p>
            <Select value={description} onValueChange={setDescription}>
              <SelectTrigger className="text-right h-11">
                <SelectValue placeholder="اختر الغرض من الصرف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="تغذية يومية">🌾 تغذية يومية</SelectItem>
                <SelectItem value="تغذية تكميلية">🍽️ تغذية تكميلية</SelectItem>
                <SelectItem value="علاج">💊 علاج</SelectItem>
                <SelectItem value="تطعيم">💉 تطعيم</SelectItem>
                <SelectItem value="فيتامينات">💪 فيتامينات ومقويات</SelectItem>
                <SelectItem value="وقاية">🛡️ وقاية</SelectItem>
                <SelectItem value="تجربة">🔬 تجربة علف جديد</SelectItem>
                <SelectItem value="أخرى">📝 أخرى (حدد في الملاحظات)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label className="text-right block font-semibold">ملاحظات إضافية</Label>
            <Textarea
              placeholder="أي ملاحظات أخرى تخص عملية الصرف..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="text-right resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex gap-3 justify-start pt-4 border-t">
            <Button 
              type="submit" 
              disabled={dispenseMutation.isPending || !selectedItem || inventoryItems.length === 0}
              className="px-6"
              size="lg"
            >
              {dispenseMutation.isPending ? (
                <>
                  <span className="animate-spin mr-2">⏳</span>
                  جاري الصرف...
                </>
              ) : (
                <>
                  <Package className="w-4 h-4 ml-2" />
                  تأكيد الصرف
                </>
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={dispenseMutation.isPending}
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
