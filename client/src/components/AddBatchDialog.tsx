import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Package, Loader2, DollarSign, Users, Calendar, Truck, TrendingUp, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export function AddBatchDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    receivedDate: new Date().toISOString().split("T")[0],
    count: "",
    supplier: "",
    averageWeight: "",
    totalCost: "",
    notes: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // جلب الموردين من API
  const { data: suppliers = [], isLoading: isLoadingSuppliers } = useQuery<any[]>({
    queryKey: ["/api/suppliers"],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.count || !formData.supplier || !formData.averageWeight || !formData.totalCost) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // Real API call to create batch
      const response = await fetch("/api/batches", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          batchName: formData.name,
          batchNumber: `B-${Date.now()}`, // Generate batch number
          capacity: parseInt(formData.count) || 50, // إضافة capacity
          batchType: "fattening", // إضافة batchType
          notes: formData.notes,
          status: "active"
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create batch");
      }

      const newBatch = await response.json();
      const costPerAnimal = (parseFloat(formData.totalCost) / parseInt(formData.count)).toFixed(2);
      
      // إعادة تحديث البيانات
      queryClient.invalidateQueries({ queryKey: ["/api/batches"] });
      
      toast({
        title: "✅ تم إنشاء الدفعة بنجاح",
        description: (
          <div className="space-y-1">
            <p>الدفعة: {formData.name}</p>
            <p>العدد: {formData.count} حيوان</p>
            <p>التكلفة: {costPerAnimal} جنيه/حيوان</p>
            <p className="text-cyan-600">المورد: {formData.supplier}</p>
          </div>
        ),
      });
      
      setFormData({
        name: "",
        receivedDate: new Date().toISOString().split("T")[0],
        count: "",
        supplier: "",
        averageWeight: "",
        totalCost: "",
        notes: ""
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "❌ خطأ في إنشاء الدفعة",
        description: "حدث خطأ أثناء حفظ البيانات",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Calculate cost per animal
  const costPerAnimal = () => {
    const count = parseInt(formData.count || "0");
    const totalCost = parseFloat(formData.totalCost || "0");
    if (count > 0 && totalCost > 0) {
      return (totalCost / count).toFixed(2);
    }
    return null;
  };

  const calculatedCost = costPerAnimal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
          data-testid="button-add-batch"
        >
          <Package className="w-5 h-5 ml-2" />
          إضافة دفعة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
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
                سجل دفعة حيوانات جديدة في النظام مع تفاصيل شاملة
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Package className="h-4 w-4 text-cyan-600" />
              اسم الدفعة *
            </Label>
            <Input
              id="name"
              placeholder="مثال: الدفعة الحادية عشر - يونيو 2025"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-white text-lg font-medium"
            />
            <p className="text-xs text-gray-600">اختر اسماً مميزاً وواضحاً للدفعة</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="receivedDate" className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-cyan-600" />
                تاريخ الاستلام *
              </Label>
              <Input
                id="receivedDate"
                type="date"
                value={formData.receivedDate}
                onChange={(e) => handleInputChange("receivedDate", e.target.value)}
                className="bg-white"
              />
              <p className="text-xs text-gray-600">تاريخ وصول الدفعة للمزرعة</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="count" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-cyan-600" />
                عدد الحيوانات *
              </Label>
              <div className="relative">
                <Input
                  id="count"
                  type="number"
                  placeholder="50"
                  value={formData.count}
                  onChange={(e) => handleInputChange("count", e.target.value)}
                  className="bg-white text-lg font-semibold pr-12"
                  min="1"
                  max="500"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  جنيه
                </div>
              </div>
              <p className="text-xs text-gray-600">العدد الإجمالي للحيوانات</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier" className="flex items-center gap-2">
              <Truck className="h-4 w-4 text-cyan-600" />
              المورد *
            </Label>
            <Select 
              value={formData.supplier} 
              onValueChange={(value) => handleInputChange("supplier", value)}
              disabled={isLoadingSuppliers}
            >
              <SelectTrigger className="bg-white">
                <SelectValue placeholder={isLoadingSuppliers ? "جاري التحميل..." : "اختر المورد..."} />
              </SelectTrigger>
              <SelectContent>
                {suppliers.length > 0 ? (
                  suppliers.map((supplier: any) => (
                    <SelectItem key={supplier.id} value={supplier.name}>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{supplier.name}</span>
                        {supplier.phone && (
                          <span className="text-xs text-gray-500">{supplier.phone}</span>
                        )}
                      </div>
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="" disabled>
                    {isLoadingSuppliers ? "جاري التحميل..." : "لا توجد موردين"}
                  </SelectItem>
                )}
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600">المورد الذي تم شراء الدفعة منه</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="averageWeight" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-cyan-600" />
                متوسط الوزن *
              </Label>
              <div className="relative">
                <Input
                  id="averageWeight"
                  type="number"
                  step="0.1"
                  placeholder="35.5"
                  value={formData.averageWeight}
                  onChange={(e) => handleInputChange("averageWeight", e.target.value)}
                  className="bg-white text-lg font-semibold pr-12"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  كجم
                </div>
              </div>
              <p className="text-xs text-gray-600">متوسط وزن الحيوان عند الاستلام</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCost" className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-cyan-600" />
                التكلفة الإجمالية *
              </Label>
              <div className="relative">
                <Input
                  id="totalCost"
                  type="number"
                  step="0.01"
                  placeholder="50000.00"
                  value={formData.totalCost}
                  onChange={(e) => handleInputChange("totalCost", e.target.value)}
                  className="bg-white text-lg font-semibold pr-12"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  جنيه
                </div>
              </div>
              <p className="text-xs text-gray-600">إجمالي تكلفة شراء الدفعة بالجنيه المصري</p>
            </div>
          </div>

          {calculatedCost && (
            <div className="p-4 border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent rounded-lg">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100">
                  <DollarSign className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 mb-1">
                    تكلفة الحيوان الواحد
                  </p>
                  <p className="text-2xl font-bold text-green-600">
                    {calculatedCost} جنيه
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <Info className="h-4 w-4 text-cyan-600" />
              ملاحظات (اختياري)
            </Label>
            <textarea
              id="notes"
              placeholder="أضف أي ملاحظات حول الدفعة، حالة الحيوانات، شروط الشراء..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-600">معلومات إضافية عن الدفعة أو شروط الشراء</p>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
            >
              {loading ? (
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
      </DialogContent>
    </Dialog>
  );
}