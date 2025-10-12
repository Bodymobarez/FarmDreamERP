import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  Loader2,
  Baby,
  Heart,
  Calendar,
  Hash,
  Info,
  Save,
  X,
  AlertCircle,
  Sparkles,
  User,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Schema for newborn animal
const newbornSchema = z.object({
  earTag: z.string().min(1, "رقم الأذن مطلوب"),
  motherId: z.string().min(1, "يجب اختيار الأم"),
  sex: z.enum(["male", "female"], {
    required_error: "يجب اختيار الجنس",
  }),
  birthDate: z.string().min(1, "تاريخ الولادة مطلوب"),
  birthWeight: z.string().min(1, "وزن الولادة مطلوب"),
  animalType: z.string().min(1, "نوع الحيوان مطلوب"),
  breed: z.string().optional(),
  healthStatus: z.enum(["healthy", "sick", "under_observation"]).default("healthy"),
  notes: z.string().optional(),
});

type NewbornFormData = z.infer<typeof newbornSchema>;

export function AddNewbornDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<NewbornFormData>({
    resolver: zodResolver(newbornSchema),
    defaultValues: {
      earTag: "",
      motherId: "",
      sex: undefined,
      birthDate: new Date().toISOString().split("T")[0],
      birthWeight: "",
      animalType: "",
      breed: "",
      healthStatus: "healthy",
      notes: "",
    },
  });

  // Fetch available mothers (female animals that are active)
  const { data: mothers = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
    select: (animals) => animals.filter((a: any) => a.sex === "female" && a.status === "active"),
  });

  const mutation = useMutation({
    mutationFn: async (data: NewbornFormData) => {
      const newbornData = {
        ...data,
        status: "active",
        entryWeight: data.birthWeight,
        currentWeight: data.birthWeight,
        entryDate: data.birthDate,
        totalCost: "0", // Newborns have 0 cost
        unitCost: "0",
        isNewborn: true,
        penNumber: "", // Will be assigned later
        batchNumber: "", // Will be assigned later
      };

      const response = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newbornData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إضافة المولود");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "🎉 مبروك!",
        description: "تم تسجيل المولود الجديد بنجاح",
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

  const onSubmit = (data: NewbornFormData) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2 bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600">
          <Baby className="w-5 h-5" />
          تسجيل مولود جديد 🐄
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-pink-500/20 to-pink-600/10 rounded-lg">
              <Baby className="w-6 h-6 text-pink-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                تسجيل مولود جديد 
                <Sparkles className="w-5 h-5 text-pink-500 animate-pulse" />
              </DialogTitle>
              <DialogDescription>
                سجل بيانات المولود الجديد (التكلفة = 0 تلقائياً)
              </DialogDescription>
            </div>
          </div>

          <Alert className="mt-4 bg-pink-50 border-pink-200">
            <Heart className="h-4 w-4 text-pink-600" />
            <AlertDescription className="text-pink-800">
              المواليد لها تكلفة صفر تلقائياً ويتم ربطها بالأم
            </AlertDescription>
          </Alert>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* القسم الأول: البيانات الأساسية */}
            <Card className="border-2 border-pink-200 bg-gradient-to-br from-pink-50/50 to-transparent shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Baby className="w-5 h-5 text-pink-600" />
                  البيانات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="earTag"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-pink-600" />
                          رقم أذن المولود <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: NB-001"
                            className="bg-white border-pink-200 focus:border-pink-400 focus:ring-pink-400"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          رقم التعريف الفريد للمولود
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="motherId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-red-600" />
                          الأم <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-red-200 focus:border-red-400 focus:ring-red-400">
                              <SelectValue placeholder="اختر الأم" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {mothers.map((mother: any) => (
                              <SelectItem key={mother.id} value={mother.id.toString()}>
                                {mother.earTag} - {mother.animalType} ({mother.breed || "غير محدد"})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription className="text-xs flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          اختر الأم من القائمة
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="w-4 h-4 text-blue-600" />
                          الجنس <span className="text-red-500">*</span>
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                              <SelectValue placeholder="اختر الجنس" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="male">ذكر 🐂</SelectItem>
                            <SelectItem value="female">أنثى 🐄</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="animalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Baby className="w-4 h-4 text-purple-600" />
                          نوع الحيوان <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: عجل"
                            className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="breed"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Info className="w-4 h-4 text-indigo-600" />
                          السلالة
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="مثال: هولشتاين"
                            className="bg-white border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="healthStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Heart className="w-4 h-4 text-green-600" />
                          الحالة الصحية
                        </FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="healthy">سليم 💚</SelectItem>
                            <SelectItem value="sick">مريض 🤒</SelectItem>
                            <SelectItem value="under_observation">تحت المراقبة 👁️</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* القسم الثاني: بيانات الولادة */}
            <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  بيانات الولادة
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-blue-600" />
                          تاريخ الولادة <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="birthWeight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-lg">
                          <Baby className="w-5 h-5 text-blue-600" />
                          وزن الولادة (كجم) <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.1"
                            min="0"
                            placeholder="مثال: 35.5"
                            className="text-lg font-bold bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription className="text-xs flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          الوزن عند الولادة بالكيلوجرام
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* القسم الثالث: الملاحظات */}
            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/30 to-transparent shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-amber-600" />
                  ملاحظات إضافية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Info className="w-4 h-4 text-amber-600" />
                        ملاحظات
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أي ملاحظات عن الولادة أو حالة المولود..."
                          className="resize-none bg-white border-amber-200 focus:border-amber-400 focus:ring-amber-400 min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Separator className="my-6" />

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 pt-2 pb-1 px-1 bg-gradient-to-r from-gray-50 to-transparent rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="w-4 h-4" />
                <span>💰 التكلفة = 0 (مولود)</span>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (form.formState.isDirty) {
                      if (confirm("هل تريد الإلغاء؟ سيتم فقدان التغييرات غير المحفوظة.")) {
                        form.reset();
                        setOpen(false);
                      }
                    } else {
                      setOpen(false);
                    }
                  }}
                  disabled={mutation.isPending}
                  className="gap-2"
                >
                  <X className="w-4 h-4" />
                  إلغاء
                </Button>
                <Button
                  type="submit"
                  disabled={mutation.isPending || !form.formState.isValid}
                  className="bg-gradient-to-r from-pink-600 to-pink-500 hover:from-pink-700 hover:to-pink-600 shadow-lg hover:shadow-xl transition-all gap-2"
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  حفظ المولود 🎉
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
