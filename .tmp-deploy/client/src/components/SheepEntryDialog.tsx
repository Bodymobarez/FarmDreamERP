import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Beef, Hash, Scale, Home, Save } from "lucide-react";

const sheepEntrySchema = z.object({
  earTag: z.string().min(1, "رقم الأذن مطلوب"),
  sex: z.enum(["ذكر", "أنثى"]),
  weight: z.string().min(1, "الوزن مطلوب"),
  penNumber: z.string().min(1, "رقم العنبر مطلوب"),
  notes: z.string().optional(),
});

type SheepEntryFormData = z.infer<typeof sheepEntrySchema>;

interface SheepEntryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sex: "ذكر" | "أنثى";
}

export function SheepEntryDialog({ open, onOpenChange, sex }: SheepEntryDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<SheepEntryFormData>({
    resolver: zodResolver(sheepEntrySchema),
    defaultValues: {
      earTag: "",
      sex: sex,
      weight: "",
      penNumber: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: SheepEntryFormData) => {
      const animalData = {
        earTag: data.earTag,
        animalType: "خراف",
        sex: data.sex,
        entryWeight: data.weight,
        currentWeight: data.weight,
        penNumber: data.penNumber,
        status: "active",
        notes: data.notes,
      };

      const response = await fetch("/api/animals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(animalData),
      });

      if (!response.ok) {
        throw new Error("فشل في تسجيل الحيوان");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "تم بنجاح ✅",
        description: "تم تسجيل دخول الحيوان بنجاح",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ ❌",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = async (data: SheepEntryFormData) => {
    setLoading(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setLoading(false);
    }
  };

  const isMale = sex === "ذكر";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 border-2 border-blue-200/50 shadow-2xl">
        <DialogHeader className="space-y-4 pb-6 border-b border-blue-100">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${isMale ? 'from-blue-500 to-blue-600' : 'from-pink-500 to-pink-600'} shadow-xl ${isMale ? 'shadow-blue-500/30' : 'shadow-pink-500/30'}`}>
              <Beef className="w-8 h-8 text-white" />
            </div>
            <div>
              <DialogTitle className={`text-3xl font-bold bg-gradient-to-r ${isMale ? 'from-blue-600 to-blue-700' : 'from-pink-600 to-pink-700'} bg-clip-text text-transparent`}>
                🐑 تسجيل دخول {sex}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 mt-1">
                إضافة حيوان جديد للمزرعة
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <Card className={`border-2 ${isMale ? 'border-blue-200/60' : 'border-pink-200/60'} bg-gradient-to-br ${isMale ? 'from-blue-50/40' : 'from-pink-50/40'} via-white to-transparent shadow-xl`}>
              <CardHeader className={`pb-4 bg-gradient-to-r ${isMale ? 'from-blue-50/50 to-blue-50/20' : 'from-pink-50/50 to-pink-50/20'} border-b ${isMale ? 'border-blue-100' : 'border-pink-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${isMale ? 'from-blue-500 to-blue-600' : 'from-pink-500 to-pink-600'} shadow-lg`}>
                    <Beef className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">📋 بيانات الحيوان</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {/* رقم الأذن */}
                <FormField
                  control={form.control}
                  name="earTag"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-800">
                        <div className={`p-1 rounded-md ${isMale ? 'bg-blue-100' : 'bg-pink-100'}`}>
                          <Hash className={`w-4 h-4 ${isMale ? 'text-blue-600' : 'text-pink-600'}`} />
                        </div>
                        رقم الأذن *
                      </FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="مثال: 001" 
                          {...field} 
                          className={`h-14 text-lg border-2 ${isMale ? 'border-blue-200 focus:border-blue-500 focus:ring-blue-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'} focus:ring-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}
                        />
                      </FormControl>
                      <FormMessage className="text-sm" />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* الوزن بالكيلو */}
                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-800">
                          <div className={`p-1 rounded-md ${isMale ? 'bg-blue-100' : 'bg-pink-100'}`}>
                            <Scale className={`w-4 h-4 ${isMale ? 'text-blue-600' : 'text-pink-600'}`} />
                          </div>
                          الوزن (كجم) *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.1"
                            placeholder="مثال: 45.5" 
                            {...field} 
                            className={`h-14 text-lg border-2 ${isMale ? 'border-blue-200 focus:border-blue-500 focus:ring-blue-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'} focus:ring-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
                      </FormItem>
                    )}
                  />

                  {/* رقم العنبر */}
                  <FormField
                    control={form.control}
                    name="penNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-800">
                          <div className={`p-1 rounded-md ${isMale ? 'bg-blue-100' : 'bg-pink-100'}`}>
                            <Home className={`w-4 h-4 ${isMale ? 'text-blue-600' : 'text-pink-600'}`} />
                          </div>
                          رقم العنبر *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: A1" 
                            {...field} 
                            className={`h-14 text-lg border-2 ${isMale ? 'border-blue-200 focus:border-blue-500 focus:ring-blue-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'} focus:ring-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}
                          />
                        </FormControl>
                        <FormMessage className="text-sm" />
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
                      <FormLabel className="text-base font-semibold text-gray-800">📝 ملاحظات (اختياري)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="أي ملاحظات إضافية..."
                          className={`min-h-[100px] resize-none text-base border-2 ${isMale ? 'border-blue-200 focus:border-blue-500 focus:ring-blue-200' : 'border-pink-200 focus:border-pink-500 focus:ring-pink-200'} focus:ring-4 rounded-xl shadow-sm`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={loading}
                className={`flex-1 h-14 text-lg bg-gradient-to-r ${isMale ? 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800' : 'from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800'} shadow-xl`}
              >
                <Save className="w-5 h-5 ml-2" />
                {loading ? "جاري الحفظ..." : "تسجيل الدخول"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  form.reset();
                  onOpenChange(false);
                }}
                className="flex-1 h-14 text-lg border-2 border-gray-300"
                disabled={loading}
              >
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

