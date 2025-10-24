import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Calculator } from "lucide-react";

interface SellAnimalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  animal?: {
    id: string;
    earTag: string;
    currentWeight: number;
    totalCost: number;
    batchId: string;
    batchNumber: string;
  };
}

export function SellAnimalDialog({
  open,
  onOpenChange,
  animal,
}: SellAnimalDialogProps) {
  const [formData, setFormData] = useState({
    weight: animal?.currentWeight?.toString() || "",
    pricePerKg: "",
    customerId: "",
    paymentMethod: "cash",
    paymentStatus: "paid",
    paidAmount: "",
    notes: "",
  });

  // حسابات تلقائية
  const weight = parseFloat(formData.weight) || 0;
  const pricePerKg = parseFloat(formData.pricePerKg) || 0;
  const salePrice = weight * pricePerKg;
  const totalCost = animal?.totalCost || 0;
  const profit = salePrice - totalCost;
  const profitPercentage = totalCost > 0 ? (profit / totalCost) * 100 : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const saleData = {
      animalId: animal?.id,
      batchId: animal?.batchId,
      weight: formData.weight,
      pricePerKg: formData.pricePerKg,
      salePrice: salePrice.toFixed(2),
      totalCost: totalCost.toFixed(2),
      profit: profit.toFixed(2),
      profitPercentage: profitPercentage.toFixed(2),
      customerId: formData.customerId,
      paymentMethod: formData.paymentMethod,
      paymentStatus: formData.paymentStatus,
      paidAmount: formData.paidAmount || salePrice.toFixed(2),
      remainingAmount: (salePrice - parseFloat(formData.paidAmount || salePrice.toString())).toFixed(2),
      notes: formData.notes,
    };

    console.log("Sale data:", saleData);
    // TODO: إرسال البيانات للـ API
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="text-xl">
            تسجيل بيع حيوان - رقم الأذن: {animal?.earTag}
          </DialogTitle>
          <div className="text-sm text-gray-600">
            الدفعة: {animal?.batchNumber}
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-6 py-4">
            {/* بيانات البيع الأساسية */}
            <div className="grid grid-cols-2 gap-4">
              {/* الوزن */}
              <div className="space-y-2">
                <Label htmlFor="weight">الوزن عند البيع (كجم)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  required
                />
              </div>

              {/* سعر الكيلو */}
              <div className="space-y-2">
                <Label htmlFor="pricePerKg">سعر الكيلو (جنيه)</Label>
                <Input
                  id="pricePerKg"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.pricePerKg}
                  onChange={(e) =>
                    setFormData({ ...formData, pricePerKg: e.target.value })
                  }
                  required
                />
              </div>
            </div>

            {/* بطاقة الحسابات */}
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Calculator className="h-5 w-5 text-blue-600" />
                  <h3 className="font-semibold text-blue-900">حسابات البيع</h3>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">سعر البيع الإجمالي</div>
                    <div className="text-2xl font-bold text-green-600">
                      {salePrice.toLocaleString()} جنيه
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="text-sm text-gray-600">التكلفة الإجمالية</div>
                    <div className="text-2xl font-bold text-red-600">
                      {totalCost.toLocaleString()} جنيه
                    </div>
                  </div>

                  <div className="space-y-1 col-span-2 pt-3 border-t border-blue-300">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="text-sm text-gray-600">صافي الربح/الخسارة</div>
                        <div className={`text-3xl font-bold ${profit >= 0 ? "text-green-600" : "text-red-600"}`}>
                          {profit >= 0 ? "+" : ""}{profit.toLocaleString()} جنيه
                        </div>
                      </div>
                      
                      <div className="text-left">
                        <Badge
                          className={`text-lg px-4 py-2 ${
                            profit >= 0
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {profit >= 0 ? (
                            <TrendingUp className="h-5 w-5 inline ml-1" />
                          ) : (
                            <TrendingDown className="h-5 w-5 inline ml-1" />
                          )}
                          {profit >= 0 ? "+" : ""}{profitPercentage.toFixed(2)}%
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* العميل وطريقة الدفع */}
            <div className="grid grid-cols-2 gap-4">
              {/* العميل */}
              <div className="space-y-2">
                <Label htmlFor="customer">العميل (اختياري)</Label>
                <Select
                  value={formData.customerId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, customerId: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="اختر العميل" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">بدون عميل محدد</SelectItem>
                    <SelectItem value="1">عميل المزرعة الكبرى</SelectItem>
                    <SelectItem value="2">مزرعة النور</SelectItem>
                    <SelectItem value="3">الجزار الكبير</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* طريقة الدفع */}
              <div className="space-y-2">
                <Label htmlFor="paymentMethod">طريقة الدفع</Label>
                <Select
                  value={formData.paymentMethod}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentMethod: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">نقدي</SelectItem>
                    <SelectItem value="bank_transfer">تحويل بنكي</SelectItem>
                    <SelectItem value="check">شيك</SelectItem>
                    <SelectItem value="installment">تقسيط</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* حالة الدفع */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paymentStatus">حالة الدفع</Label>
                <Select
                  value={formData.paymentStatus}
                  onValueChange={(value) =>
                    setFormData({ ...formData, paymentStatus: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">مدفوع بالكامل</SelectItem>
                    <SelectItem value="partial">مدفوع جزئياً</SelectItem>
                    <SelectItem value="pending">معلق</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {formData.paymentStatus !== "paid" && (
                <div className="space-y-2">
                  <Label htmlFor="paidAmount">المبلغ المدفوع</Label>
                  <Input
                    id="paidAmount"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.paidAmount}
                    onChange={(e) =>
                      setFormData({ ...formData, paidAmount: e.target.value })
                    }
                  />
                </div>
              )}
            </div>

            {/* ملاحظات */}
            <div className="space-y-2">
              <Label htmlFor="notes">ملاحظات</Label>
              <Textarea
                id="notes"
                placeholder="أي ملاحظات إضافية..."
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              إلغاء
            </Button>
            <Button type="submit" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              تسجيل البيع
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
