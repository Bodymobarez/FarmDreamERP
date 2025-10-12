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
import { Package, Loader2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const costPerAnimal = (parseFloat(formData.totalCost) / parseInt(formData.count)).toFixed(2);
      
      toast({
        title: "✅ تم إنشاء الدفعة بنجاح",
        description: `الدفعة: ${formData.name} - العدد: ${formData.count} حيوان - التكلفة: ${costPerAnimal} جنيه/حيوان`,
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
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6 text-cyan-600" />
            إضافة دفعة جديدة
          </DialogTitle>
          <DialogDescription>
            سجل دفعة حيوانات جديدة في النظام
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم الدفعة *</Label>
            <Input
              id="name"
              placeholder="مثال: الدفعة الحادية عشر"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="receivedDate">تاريخ الاستلام *</Label>
              <Input
                id="receivedDate"
                type="date"
                value={formData.receivedDate}
                onChange={(e) => handleInputChange("receivedDate", e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="count">عدد الحيوانات *</Label>
              <Input
                id="count"
                type="number"
                placeholder="50"
                value={formData.count}
                onChange={(e) => handleInputChange("count", e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplier">المورد *</Label>
            <Select value={formData.supplier} onValueChange={(value) => handleInputChange("supplier", value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="اختر المورد" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="المورد الأول">المورد الأول</SelectItem>
                <SelectItem value="المورد الثاني">المورد الثاني</SelectItem>
                <SelectItem value="المورد الثالث">المورد الثالث</SelectItem>
                <SelectItem value="مورد آخر">مورد آخر</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="averageWeight">متوسط الوزن * (كجم)</Label>
              <Input
                id="averageWeight"
                type="number"
                step="0.1"
                placeholder="35.5"
                value={formData.averageWeight}
                onChange={(e) => handleInputChange("averageWeight", e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCost">التكلفة الإجمالية * (جنيه مصري)</Label>
              <Input
                id="totalCost"
                type="number"
                step="0.01"
                placeholder="50000"
                value={formData.totalCost}
                onChange={(e) => handleInputChange("totalCost", e.target.value)}
                className="bg-white"
              />
            </div>
          </div>

          {calculatedCost && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">
                    تكلفة الحيوان الواحد
                  </p>
                  <p className="text-xl font-bold text-green-600">
                    {calculatedCost} جنيه
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
            <textarea
              id="notes"
              placeholder="أي ملاحظات حول الدفعة..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              rows={3}
            />
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