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
import { Home, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddPenDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    penType: "",
    batchName: "",
    location: "",
    notes: ""
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.capacity || !formData.penType) {
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
      
      toast({
        title: "✅ تم إنشاء العنبر بنجاح",
        description: `العنبر: ${formData.name} - السعة: ${formData.capacity} حيوان`,
      });
      
      setFormData({
        name: "",
        capacity: "",
        penType: "",
        batchName: "",
        location: "",
        notes: ""
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "❌ خطأ في إنشاء العنبر",
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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg" 
          className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
          data-testid="button-add-pen"
        >
          <Home className="w-5 h-5 ml-2" />
          إضافة عنبر جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <Home className="h-6 w-6 text-sky-600" />
            إضافة عنبر جديد
          </DialogTitle>
          <DialogDescription>
            أنشئ عنبر جديد لإيواء الحيوانات
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">اسم العنبر *</Label>
            <Input
              id="name"
              placeholder="مثال: عنبر 11"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="capacity">السعة *</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="50"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
                className="bg-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="penType">نوع العنبر *</Label>
              <Select value={formData.penType} onValueChange={(value) => handleInputChange("penType", value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="اختر النوع" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مفتوح">مفتوح</SelectItem>
                  <SelectItem value="مغلق">مغلق</SelectItem>
                  <SelectItem value="نصف مفتوح">نصف مفتوح</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batchName">الدفعة المخصصة (اختياري)</Label>
            <Select value={formData.batchName} onValueChange={(value) => handleInputChange("batchName", value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="اختر الدفعة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">بدون دفعة</SelectItem>
                <SelectItem value="الدفعة الأولى">الدفعة الأولى</SelectItem>
                <SelectItem value="الدفعة الثانية">الدفعة الثانية</SelectItem>
                <SelectItem value="الدفعة الثالثة">الدفعة الثالثة</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">الموقع (اختياري)</Label>
            <Input
              id="location"
              placeholder="مثال: الجهة الشمالية"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">ملاحظات (اختياري)</Label>
            <textarea
              id="notes"
              placeholder="أي ملاحظات حول العنبر..."
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
              className="bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700"
            >
              {loading ? (
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
      </DialogContent>
    </Dialog>
  );
}