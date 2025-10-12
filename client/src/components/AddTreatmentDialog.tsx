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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const treatmentSchema = z.object({
  animalEarTag: z.string().min(1, "يجب اختيار الحيوان"),
  treatment: z.string().min(1, "نوع العلاج مطلوب"),
  medicine: z.string().min(1, "اسم الدواء مطلوب"),
  dose: z.string().min(1, "الجرعة مطلوبة"),
  cost: z.string().min(1, "التكلفة مطلوبة"),
  vet: z.string().min(1, "اسم الطبيب البيطري مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  notes: z.string().optional(),
});

type TreatmentFormData = z.infer<typeof treatmentSchema>;

export function AddTreatmentDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<TreatmentFormData>({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      animalEarTag: "",
      treatment: "",
      medicine: "",
      dose: "",
      cost: "",
      vet: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  const onSubmit = async (data: TreatmentFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم بنجاح",
        description: `تم إضافة العلاج للحيوان رقم ${data.animalEarTag}`,
      });
      
      form.reset({
        animalEarTag: "",
        treatment: "",
        medicine: "",
        dose: "",
        cost: "",
        vet: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في إضافة العلاج",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" data-testid="button-add-treatment">
          <Plus className="w-5 h-5 ml-2" />
          إضافة علاج جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">إضافة علاج بيطري جديد</DialogTitle>
          <DialogDescription>
            سجل العلاج أو التطعيم للحيوان
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="animalEarTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اختر الحيوان *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ابحث برقم الأذن..." />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="98">رقم 98 - عنبر 5</SelectItem>
                        <SelectItem value="75">رقم 75 - عنبر 3</SelectItem>
                        <SelectItem value="52">رقم 52 - عنبر 1</SelectItem>
                        <SelectItem value="89">رقم 89 - عنبر 5</SelectItem>
                        <SelectItem value="64">رقم 64 - عنبر 3</SelectItem>
                        <SelectItem value="45">رقم 45 - عنبر 5</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="treatment"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع العلاج *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع العلاج" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="تطعيم">تطعيم</SelectItem>
                        <SelectItem value="علاج مرض">علاج مرض</SelectItem>
                        <SelectItem value="علاج طفيليات">علاج طفيليات</SelectItem>
                        <SelectItem value="فيتامينات">فيتامينات</SelectItem>
                        <SelectItem value="مضاد حيوي">مضاد حيوي</SelectItem>
                        <SelectItem value="أخرى">أخرى</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="medicine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>اسم الدواء *</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: إيفرمكتين" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dose"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الجرعة *</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: 5 مل" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التكلفة (جنيه مصري) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="مثال: 150" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="vet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الطبيب البيطري *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الطبيب" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="د. أحمد محمود">د. أحمد محمود</SelectItem>
                        <SelectItem value="د. محمد علي">د. محمد علي</SelectItem>
                        <SelectItem value="د. سارة حسن">د. سارة حسن</SelectItem>
                        <SelectItem value="د. فاطمة يوسف">د. فاطمة يوسف</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>التاريخ *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أي ملاحظات إضافية..."
                      className="resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                حفظ العلاج
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
