import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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

  // جلب الدفعات
  const { data: batches = [] } = useQuery<any[]>({
    queryKey: ["/api/batches"],
  });

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
      // 1. Add animal
      const response = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إضافة الحيوان");
      }

      const animal = await response.json();

      // 2. Update batch active animals count
      if (data.batchNumber) {
        const batchesResponse = await fetch("/api/batches");
        if (batchesResponse.ok) {
          const batches = await batchesResponse.json();
          const batch = batches.find((b: any) => b.batchNumber === data.batchNumber);
          
          if (batch) {
            await fetch(`/api/batches/${batch.id}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                activeAnimals: (batch.activeAnimals || 0) + 1,
              }),
            });

            // 3. Update goals for this batch
            const goalsResponse = await fetch("/api/goals");
            if (goalsResponse.ok) {
              const goals = await goalsResponse.json();
              const batchGoals = goals.filter((g: any) => g.batchId === batch.id);
              
              for (const goal of batchGoals) {
                if (goal.goalType === "weight_gain") {
                  // Update current weight
                  await fetch(`/api/goals/${goal.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      currentValue: data.entryWeight || "0",
                    }),
                  });
                }
              }
            }
          }
        }
      }

      return animal;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      queryClient.invalidateQueries({ queryKey: ["/api/batches"] });
      queryClient.invalidateQueries({ queryKey: ["/api/goals"] });
      toast({
        title: "✅ تم بنجاح",
        description: "تم إضافة الحيوان وتحديث الأهداف",
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
    console.log("Submitting animal data:", data);
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="shadow-md w-full sm:w-auto h-12 sm:h-11 text-sm sm:text-base">
          <Plus className="w-5 h-5 ml-2" />
          إضافة حيوان
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto w-[95vw] sm:w-full">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">إضافة حيوان جديد</DialogTitle>
          <DialogDescription className="text-sm">
            املأ البيانات التالية لإضافة حيوان جديد إلى المزرعة
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* رقم الأذن */}
              <FormField
                control={form.control}
                name="earTag"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">رقم الأذن *</FormLabel>
                    <FormControl>
                      <Input placeholder="001" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* نوع الحيوان */}
              <FormField
                control={form.control}
                name="animalType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">النوع *</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <Button
                        type="button"
                        variant={field.value === "عجول" ? "default" : "outline"}
                        className={`h-12 text-base ${field.value === "عجول" ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'}`}
                        onClick={() => field.onChange("عجول")}
                      >
                        🐄 عجول
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "خراف" ? "default" : "outline"}
                        className={`h-12 text-base ${field.value === "خراف" ? 'bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg' : 'border-2 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50'}`}
                        onClick={() => field.onChange("خراف")}
                      >
                        🐑 خراف
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* الجنس */}
              <FormField
                control={form.control}
                name="sex"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">الجنس *</FormLabel>
                    <div className="grid grid-cols-2 gap-3 mt-2">
                      <Button
                        type="button"
                        variant={field.value === "ذكر" ? "default" : "outline"}
                        className={`h-12 text-base ${field.value === "ذكر" ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'border-2 border-blue-200 hover:border-blue-400 hover:bg-blue-50'}`}
                        onClick={() => field.onChange("ذكر")}
                      >
                        ♂️ ذكر
                      </Button>
                      <Button
                        type="button"
                        variant={field.value === "أنثى" ? "default" : "outline"}
                        className={`h-12 text-base ${field.value === "أنثى" ? 'bg-gradient-to-r from-pink-500 to-pink-600 text-white shadow-lg' : 'border-2 border-pink-200 hover:border-pink-400 hover:bg-pink-50'}`}
                        onClick={() => field.onChange("أنثى")}
                      >
                        ♀️ أنثى
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* وزن الدخول */}
              <FormField
                control={form.control}
                name="entryWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">وزن الدخول (كجم) *</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="250" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* الوزن الحالي */}
              <FormField
                control={form.control}
                name="currentWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">الوزن الحالي (كجم)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="280" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* سعر الشراء */}
              <FormField
                control={form.control}
                name="purchaseCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">سعر الشراء (ج.م)</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" placeholder="5000" {...field} className="h-9" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* العنبر */}
              <FormField
                control={form.control}
                name="penNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm">العنبر (اختياري)</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === "none" ? "" : value)} value={field.value || "none"}>
                      <FormControl>
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="اختر العنبر" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">بدون عنبر</SelectItem>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                          <SelectItem key={num} value={`عنبر ${num}`}>
                            عنبر {num}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* الدفعة */}
              <FormField
                control={form.control}
                name="batchNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold">الدفعة (اختياري)</FormLabel>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2 max-h-[200px] overflow-y-auto p-2 border-2 border-gray-200 rounded-xl bg-gray-50">
                      <Button
                        type="button"
                        variant={(field.value || "none") === "none" ? "default" : "outline"}
                        className={`h-11 text-sm ${(field.value || "none") === "none" ? 'bg-gradient-to-r from-gray-500 to-gray-600 text-white shadow-md' : 'border-2 border-gray-300 hover:border-gray-400 hover:bg-gray-100'}`}
                        onClick={() => field.onChange("")}
                      >
                        🚫 بدون دفعة
                      </Button>
                      {Array.isArray(batches) && batches.map((batch: any) => (
                        <Button
                          key={batch.id}
                          type="button"
                          variant={field.value === batch.batchNumber ? "default" : "outline"}
                          className={`h-11 text-sm ${field.value === batch.batchNumber ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md' : 'border-2 border-purple-200 hover:border-purple-400 hover:bg-purple-50'}`}
                          onClick={() => field.onChange(batch.batchNumber)}
                        >
                          🏠 {batch.batchName || batch.name}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ملاحظات */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm">ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="ملاحظات إضافية..."
                      className="resize-none h-16"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* الأزرار */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={mutation.isPending}
                size="sm"
                className="w-full sm:w-auto"
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={mutation.isPending} size="sm" className="w-full sm:w-auto">
                {mutation.isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                حفظ
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
