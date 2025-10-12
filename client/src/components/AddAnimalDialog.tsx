import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertAnimalSchema, type InsertAnimal } from "@shared/schema";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddAnimalDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertAnimal>({
    resolver: zodResolver(insertAnimalSchema),
    defaultValues: {
      earTag: "",
      animalType: "",
      sex: "ذكر",
      entryWeight: "",
      currentWeight: "",
      penNumber: "",
      batchNumber: "",
      status: "active",
      purchaseCost: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertAnimal) => {
      const response = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إضافة الحيوان");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "تم بنجاح",
        description: "تم إضافة الحيوان بنجاح",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAnimal) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" data-testid="button-add-animal">
          <Plus className="w-5 h-5 ml-2" />
          إضافة حيوان جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">إضافة حيوان جديد</DialogTitle>
          <DialogDescription>
            املأ البيانات التالية لإضافة حيوان جديد إلى المزرعة
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="earTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الأذن *</FormLabel>
                    <FormControl>
                      <Input placeholder="مثال: 001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="animalType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>نوع الحيوان *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر نوع الحيوان" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="بقر">بقر</SelectItem>
                        <SelectItem value="جاموس">جاموس</SelectItem>
                        <SelectItem value="أغنام">أغنام</SelectItem>
                        <SelectItem value="ماعز">ماعز</SelectItem>
                        <SelectItem value="جمال">جمال</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الجنس *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر الجنس" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ذكر">ذكر</SelectItem>
                        <SelectItem value="أنثى">أنثى</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="entryWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>وزن الدخول (كجم) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="مثال: 250.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currentWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الوزن الحالي (كجم)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="مثال: 280.5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="purchaseCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>سعر الشراء (جنيه مصري)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="مثال: 5000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="penNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم العنبر</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر رقم العنبر" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="عنبر 1">عنبر 1</SelectItem>
                        <SelectItem value="عنبر 2">عنبر 2</SelectItem>
                        <SelectItem value="عنبر 3">عنبر 3</SelectItem>
                        <SelectItem value="عنبر 4">عنبر 4</SelectItem>
                        <SelectItem value="عنبر 5">عنبر 5</SelectItem>
                        <SelectItem value="عنبر 6">عنبر 6</SelectItem>
                        <SelectItem value="عنبر 7">عنبر 7</SelectItem>
                        <SelectItem value="عنبر 8">عنبر 8</SelectItem>
                        <SelectItem value="عنبر 9">عنبر 9</SelectItem>
                        <SelectItem value="عنبر 10">عنبر 10</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="batchNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>رقم الدفعة</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="اختر رقم الدفعة" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="الدفعة الأولى">الدفعة الأولى</SelectItem>
                        <SelectItem value="الدفعة الثانية">الدفعة الثانية</SelectItem>
                        <SelectItem value="الدفعة الثالثة">الدفعة الثالثة</SelectItem>
                        <SelectItem value="الدفعة الرابعة">الدفعة الرابعة</SelectItem>
                        <SelectItem value="الدفعة الخامسة">الدفعة الخامسة</SelectItem>
                        <SelectItem value="الدفعة السادسة">الدفعة السادسة</SelectItem>
                        <SelectItem value="الدفعة السابعة">الدفعة السابعة</SelectItem>
                        <SelectItem value="الدفعة الثامنة">الدفعة الثامنة</SelectItem>
                        <SelectItem value="الدفعة التاسعة">الدفعة التاسعة</SelectItem>
                        <SelectItem value="الدفعة العاشرة">الدفعة العاشرة</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <FormLabel>ملاحظات</FormLabel>
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
                disabled={mutation.isPending}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                حفظ الحيوان
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
