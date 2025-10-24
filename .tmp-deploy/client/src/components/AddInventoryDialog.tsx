import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const inventorySchema = z.object({
  name: z.string().min(1, "اسم الصنف مطلوب"),
  currentStock: z.string().min(1, "الكمية الحالية مطلوبة"),
  unit: z.string().min(1, "الوحدة مطلوبة"),
  reorderPoint: z.string().min(1, "نقطة إعادة الطلب مطلوبة"),
  supplier: z.string().min(1, "اسم المورد مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
});

type InventoryFormData = z.infer<typeof inventorySchema>;

export function AddInventoryDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<InventoryFormData>({
    resolver: zodResolver(inventorySchema),
    defaultValues: {
      name: "",
      currentStock: "",
      unit: "",
      reorderPoint: "",
      supplier: "",
      category: "",
    },
  });

  const onSubmit = async (data: InventoryFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم بنجاح",
        description: `تم إضافة ${data.name} إلى المخزون`,
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إضافة الصنف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" data-testid="button-add-inventory">
          <Plus className="w-5 h-5 ml-2" />
          إضافة صنف جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">إضافة صنف جديد للمخزون</DialogTitle>
          <DialogDescription>
            املأ البيانات التالية لإضافة صنف جديد
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الصنف *</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: علف تسمين مركز" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الفئة *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الفئة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="أعلاف">أعلاف</SelectItem>
                        <SelectItem value="أدوية">أدوية</SelectItem>
                        <SelectItem value="تطعيمات">تطعيمات</SelectItem>
                        <SelectItem value="مكملات">مكملات غذائية</SelectItem>
                        <SelectItem value="مستلزمات">مستلزمات عامة</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentStock"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الكمية الحالية *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="مثال: 450" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوحدة *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الوحدة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="كجم">كجم</SelectItem>
                        <SelectItem value="عبوة">عبوة</SelectItem>
                        <SelectItem value="لتر">لتر</SelectItem>
                        <SelectItem value="قطعة">قطعة</SelectItem>
                        <SelectItem value="طن">طن</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reorderPoint"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نقطة إعادة الطلب *</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="مثال: 200" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>المورد *</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: شركة الأعلاف المصرية" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                حفظ الصنف
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
