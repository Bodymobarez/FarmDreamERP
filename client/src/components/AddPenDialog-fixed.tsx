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
import {
  Home,
  Loader2,
  Users,
  Building2,
  Package,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const penSchema = z.object({
  name: z.string().min(1, "اسم العنبر مطلوب"),
  capacity: z.string().min(1, "السعة مطلوبة"),
  batchName: z.string().optional(),
  penType: z.string().min(1, "نوع العنبر مطلوب"),
  location: z.string().optional(),
  notes: z.string().optional(),
});

type PenFormData = z.infer<typeof penSchema>;

export function AddPenDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<PenFormData>({
    resolver: zodResolver(penSchema),
    defaultValues: {
      name: "",
      capacity: "",
      batchName: "",
      penType: "",
      location: "",
      notes: "",
    },
  });

  const onSubmit = async (data: PenFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "✅ تم إنشاء العنبر بنجاح",
        description: (
          <div className="space-y-1">
            <p>العنبر: {data.name}</p>
            <p>السعة: {data.capacity} حيوان</p>
            <p>النوع: {data.penType}</p>
          </div>
        ),
      });
      
      form.reset();
      setOpen(false);
    } catch (error) {
      toast({
        title: "❌ خطأ في إنشاء العنبر",
        description: "حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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
                أنشئ عنبر جديد لإيواء الحيوانات
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Pen Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-sky-600" />
                    اسم العنبر *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="مثال: عنبر 11"
                      className="bg-white"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    اختر اسماً واضحاً للعنبر
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Capacity and Type */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="capacity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-sky-600" />
                      السعة *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="50"
                        className="bg-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="penType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع العنبر *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="اختر النوع" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="مفتوح">مفتوح</SelectItem>
                        <SelectItem value="مغلق">مغلق</SelectItem>
                        <SelectItem value="نصف مفتوح">نصف مفتوح</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Batch Assignment */}
            <FormField
              control={form.control}
              name="batchName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-sky-600" />
                    الدفعة المخصصة (اختياري)
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="اختر الدفعة" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="">بدون دفعة</SelectItem>
                      <SelectItem value="الدفعة الأولى">الدفعة الأولى</SelectItem>
                      <SelectItem value="الدفعة الثانية">الدفعة الثانية</SelectItem>
                      <SelectItem value="الدفعة الثالثة">الدفعة الثالثة</SelectItem>
                      <SelectItem value="الدفعة الرابعة">الدفعة الرابعة</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Location */}
            <FormField
              control={form.control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الموقع (اختياري)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="مثال: الجهة الشمالية"
                      className="bg-white"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أي ملاحظات حول العنبر..."
                      className="bg-white resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
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
                }}
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
        </Form>
      </DialogContent>
    </Dialog>
  );
}