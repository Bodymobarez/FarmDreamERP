import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Loader2,
  Scale,
  TrendingUp,
  Calendar,
  Beef,
  AlertCircle,
  Info,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const weightSchema = z.object({
  animalId: z.string().min(1, "يجب اختيار الحيوان"),
  weight: z.string()
    .min(1, "الوزن مطلوب")
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: "يجب إدخال وزن صحيح أكبر من صفر",
    }),
  weightDate: z.string().min(1, "التاريخ مطلوب"),
  notes: z.string().optional(),
});

type WeightFormData = z.infer<typeof weightSchema>;

export function AddWeightDialog() {
  const [open, setOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch animals
  const { data: animals = [], isLoading: isLoadingAnimals } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // Active animals only
  const activeAnimals = animals.filter((a: any) => a.status === "active");

  const form = useForm<WeightFormData>({
    resolver: zodResolver(weightSchema),
    defaultValues: {
      animalId: "",
      weight: "",
      weightDate: new Date().toISOString().split("T")[0],
      notes: "",
    },
  });

  // Update animal mutation
  const updateAnimalMutation = useMutation({
    mutationFn: async (data: { id: string; currentWeight: string }) => {
      const response = await fetch(`/api/animals/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentWeight: data.currentWeight }),
      });
      if (!response.ok) throw new Error("Failed to update animal weight");
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
    },
  });

  const onSubmit = async (data: WeightFormData) => {
    try {
      // Update animal's current weight
      await updateAnimalMutation.mutateAsync({
        id: data.animalId,
        currentWeight: data.weight,
      });

      const animal = activeAnimals.find((a: any) => a.id === data.animalId);
      const weightGain = animal
        ? parseFloat(data.weight) - parseFloat(animal.entryWeight || "0")
        : 0;

      toast({
        title: "✅ تم تسجيل الوزن بنجاح",
        description: (
          <div className="space-y-1">
            <p>الحيوان: {animal?.earTag}</p>
            <p>الوزن الجديد: {data.weight} كجم</p>
            {weightGain > 0 && (
              <p className="text-green-600 font-medium">
                الزيادة: +{weightGain.toFixed(1)} كجم
              </p>
            )}
          </div>
        ),
      });

      form.reset({
        animalId: "",
        weight: "",
        weightDate: new Date().toISOString().split("T")[0],
        notes: "",
      });
      setSelectedAnimal(null);
      setOpen(false);
    } catch (error) {
      toast({
        title: "❌ خطأ في تسجيل الوزن",
        description: "حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  // Watch animal selection
  const watchedAnimalId = form.watch("animalId");

  useEffect(() => {
    if (watchedAnimalId) {
      const animal = activeAnimals.find((a: any) => a.id === watchedAnimalId);
      setSelectedAnimal(animal);
    } else {
      setSelectedAnimal(null);
    }
  }, [watchedAnimalId, activeAnimals]);

  // Calculate weight gain
  const calculateGain = () => {
    if (!selectedAnimal) return null;
    const newWeight = parseFloat(form.watch("weight") || "0");
    const entryWeight = parseFloat(selectedAnimal.entryWeight || "0");
    const currentWeight = parseFloat(selectedAnimal.currentWeight || "0");
    
    if (newWeight > 0) {
      const gainFromEntry = newWeight - entryWeight;
      const gainFromCurrent = newWeight - currentWeight;
      return {
        fromEntry: gainFromEntry,
        fromCurrent: gainFromCurrent,
      };
    }
    return null;
  };

  const gain = calculateGain();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
        >
          <Scale className="w-5 h-5 ml-2" />
          تسجيل وزن جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-violet-100 to-purple-100">
              <Scale className="h-6 w-6 text-violet-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                تسجيل وزن جديد
              </DialogTitle>
              <DialogDescription>
                سجل وزن الحيوان لمتابعة معدل النمو
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Animal Selection */}
            <FormField
              control={form.control}
              name="animalId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Beef className="h-4 w-4 text-violet-600" />
                    اختر الحيوان *
                  </FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    disabled={isLoadingAnimals}
                  >
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="ابحث برقم الأذن..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {isLoadingAnimals ? (
                        <div className="p-4 text-center text-gray-500">
                          جاري التحميل...
                        </div>
                      ) : activeAnimals.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          لا توجد حيوانات نشطة
                        </div>
                      ) : (
                        activeAnimals.map((animal: any) => (
                          <SelectItem key={animal.id} value={animal.id}>
                            <div className="flex items-center gap-3">
                              <span className="font-medium">
                                رقم الأذن: {animal.earTag}
                              </span>
                              <span className="text-xs text-gray-500">
                                {animal.animalType}
                              </span>
                              <Badge variant="outline" className="text-xs">
                                {animal.penNumber || "بدون عنبر"}
                              </Badge>
                            </div>
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    اختر الحيوان الذي تريد تسجيل وزنه
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Animal Info Card */}
            {selectedAnimal && (
              <Card className="border-2 border-violet-200 bg-gradient-to-br from-violet-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">النوع</p>
                      <p className="font-semibold text-sm">
                        {selectedAnimal.animalType}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">الجنس</p>
                      <p className="font-semibold text-sm">
                        {selectedAnimal.sex}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">وزن الدخول</p>
                      <p className="font-semibold text-sm text-orange-600">
                        {parseFloat(selectedAnimal.entryWeight || "0").toFixed(
                          1
                        )}{" "}
                        كجم
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">الوزن الحالي</p>
                      <p className="font-semibold text-sm text-purple-600">
                        {parseFloat(
                          selectedAnimal.currentWeight || "0"
                        ).toFixed(1)}{" "}
                        كجم
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Weight Input */}
            <FormField
              control={form.control}
              name="weight"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Scale className="h-4 w-4 text-violet-600" />
                    الوزن الجديد (كجم) *
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="مثال: 425.5"
                        className="text-lg font-semibold bg-white pr-12"
                        {...field}
                      />
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                        كجم
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    أدخل الوزن الجديد للحيوان بالكيلوجرام
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weight Gain Display */}
            {gain && selectedAnimal && (
              <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-green-100">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="font-semibold text-sm text-gray-900">
                        تحليل الزيادة في الوزن
                      </h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            الزيادة منذ الدخول
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              gain.fromEntry > 0
                                ? "text-green-600"
                                : gain.fromEntry < 0
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {gain.fromEntry > 0 && "+"}
                            {gain.fromEntry.toFixed(1)} كجم
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-600 mb-1">
                            التغير عن الوزن الحالي
                          </p>
                          <p
                            className={`text-lg font-bold ${
                              gain.fromCurrent > 0
                                ? "text-green-600"
                                : gain.fromCurrent < 0
                                ? "text-red-600"
                                : "text-gray-600"
                            }`}
                          >
                            {gain.fromCurrent > 0 && "+"}
                            {gain.fromCurrent.toFixed(1)} كجم
                          </p>
                        </div>
                      </div>
                      {gain.fromCurrent < 0 && (
                        <div className="flex items-start gap-2 p-2 rounded bg-amber-50 border border-amber-200">
                          <AlertCircle className="h-4 w-4 text-amber-600 mt-0.5" />
                          <p className="text-xs text-amber-800">
                            تنبيه: الوزن الجديد أقل من الوزن الحالي المسجل
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Date Input */}
            <FormField
              control={form.control}
              name="weightDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-violet-600" />
                    تاريخ القياس *
                  </FormLabel>
                  <FormControl>
                    <Input type="date" className="bg-white" {...field} />
                  </FormControl>
                  <FormDescription>
                    تاريخ إجراء قياس الوزن
                  </FormDescription>
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
                  <FormLabel className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-violet-600" />
                    ملاحظات (اختياري)
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أضف أي ملاحظات عن حالة الحيوان أو القياس..."
                      className="bg-white resize-none"
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    يمكنك إضافة ملاحظات حول القياس أو حالة الحيوان
                  </FormDescription>
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
                  setSelectedAnimal(null);
                }}
                disabled={updateAnimalMutation.isPending}
              >
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={updateAnimalMutation.isPending || !selectedAnimal}
                className="bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700"
              >
                {updateAnimalMutation.isPending ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Scale className="ml-2 h-4 w-4" />
                    حفظ القياس
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
