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
import { Home, Loader2, Users, Building2, Package, Zap, MapPin, Info } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddPenDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    capacity: "",
    penType: "",
    batchName: "none",
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
        description: (
          <div className="space-y-1">
            <p>العنبر: {formData.name}</p>
            <p>السعة: {formData.capacity} حيوان</p>
            <p>النوع: {formData.penType}</p>
            {formData.batchName !== "none" && (
              <p className="text-sky-600">مخصص للدفعة: {formData.batchName}</p>
            )}
          </div>
        ),
      });
      
      setFormData({
        name: "",
        capacity: "",
        penType: "",
        batchName: "none",
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
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-sky-100 to-blue-100">
              <Home className="h-6 w-6 text-sky-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                إضافة عنبر جديد
              </DialogTitle>
              <DialogDescription>
                أنشئ عنبر جديد لإيواء الحيوانات مع إعدادات متقدمة
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="flex items-center gap-2">
              <Home className="h-4 w-4 text-sky-600" />
              اسم العنبر *
            </Label>
            <Input
              id="name"
              placeholder="مثال: عنبر 11 أو العنبر الشمالي"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              className="bg-white text-lg font-medium"
            />
            <p className="text-xs text-gray-600">اختر اسماً مميزاً وواضحاً للعنبر</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="capacity" className="flex items-center gap-2">
                <Users className="h-4 w-4 text-sky-600" />
                السعة القصوى *
              </Label>
              <div className="relative">
                <Input
                  id="capacity"
                  type="number"
                  placeholder="50"
                  value={formData.capacity}
                  onChange={(e) => handleInputChange("capacity", e.target.value)}
                  className="bg-white text-lg font-semibold pr-12"
                  min="1"
                  max="200"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">
                  حيوان
                </div>
              </div>
              <p className="text-xs text-gray-600">الحد الأقصى للحيوانات (1-200)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="penType" className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-sky-600" />
                نوع العنبر *
              </Label>
              <Select value={formData.penType} onValueChange={(value) => handleInputChange("penType", value)}>
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="اختر نوع العنبر" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="مفتوح">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      مفتوح
                    </div>
                  </SelectItem>
                  <SelectItem value="مغلق">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      مغلق
                    </div>
                  </SelectItem>
                  <SelectItem value="نصف مفتوح">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                      نصف مفتوح
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-600">نوع التهوية والبناء</p>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="batchName" className="flex items-center gap-2">
              <Package className="h-4 w-4 text-sky-600" />
              تخصيص دفعة (اختياري)
            </Label>
            <Select value={formData.batchName} onValueChange={(value) => handleInputChange("batchName", value)}>
              <SelectTrigger className="bg-white">
                <SelectValue placeholder="اختر دفعة للتخصيص..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">بدون تخصيص</SelectItem>
                <SelectItem value="الدفعة الأولى">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">الدفعة الأولى</span>
                    <span className="text-xs text-gray-500">6 حيوانات</span>
                  </div>
                </SelectItem>
                <SelectItem value="الدفعة الثانية">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">الدفعة الثانية</span>
                    <span className="text-xs text-gray-500">42 حيوان</span>
                  </div>
                </SelectItem>
                <SelectItem value="الدفعة الثالثة">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">الدفعة الثالثة</span>
                    <span className="text-xs text-gray-500">50 حيوان</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-gray-600">يمكن تخصيص العنبر لدفعة معينة</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-sky-600" />
              الموقع (اختياري)
            </Label>
            <Input
              id="location"
              placeholder="مثال: الجهة الشمالية - الصف الأول"
              value={formData.location}
              onChange={(e) => handleInputChange("location", e.target.value)}
              className="bg-white"
            />
            <p className="text-xs text-gray-600">وصف موقع العنبر في المزرعة</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="flex items-center gap-2">
              <Info className="h-4 w-4 text-sky-600" />
              ملاحظات (اختياري)
            </Label>
            <textarea
              id="notes"
              placeholder="أضف أي ملاحظات حول العنبر، المعدات، التجهيزات..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-white px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
              rows={3}
            />
            <p className="text-xs text-gray-600">معلومات إضافية عن العنبر أو تجهيزاته</p>
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