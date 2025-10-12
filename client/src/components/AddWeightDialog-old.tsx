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

const weightSchema = z.object({
  animalEarTag: z.string().min(1, "يجب اختيار الحيوان"),
  weight: z.string().min(1, "الوزن مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  notes: z.string().optional(),
});

type WeightFormData = z.infer<typeof weightSchema>;

export function AddWeightDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<WeightFormData>({
    resolver: zodResolver(weightSchema),
    defaultValues: {
      animalEarTag: "",
      weight: "",
      date: new Date().toISOString().split('T')[0],
      notes: "",
    },
  });

  const onSubmit = async (data: WeightFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "تم بنجاح",
        description: `تم تسجيل وزن ${data.weight} كجم للحيوان رقم ${data.animalEarTag}`,
      });
      
      form.reset({
        animalEarTag: "",
        weight: "",
        date: new Date().toISOString().split('T')[0],
        notes: "",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "خطأ",
        description: "فشل في تسجيل الوزن",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" data-testid="button-add-weight">
          <Plus className="w-5 h-5 ml-2" />
          تسجيل وزن جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">تسجيل وزن جديد</DialogTitle>
          <DialogDescription>
            سجل وزن الحيوان للمتابعة
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="animalEarTag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اختر الحيوان *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger data-testid="select-animal">
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
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوزن (كجم) *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.1"
                      placeholder="مثال: 425.5"
                      data-testid="input-weight"
                      {...field}
                    />
                  </FormControl>
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
                    <Input type="date" data-testid="input-date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات (اختياري)</FormLabel>
                  <FormControl>
                    <Input placeholder="أضف أي ملاحظات..." data-testid="input-notes" {...field} />
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
              <Button type="submit" disabled={loading} data-testid="button-save-weight">
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                حفظ القياس
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
