import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
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
import { Plus, Loader2, BookOpen, Calendar, FileText, Scale, TrendingUp, TrendingDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const journalEntrySchema = z.object({
  entryNumber: z.string().min(1, "رقم القيد مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  debitAccount: z.string().min(1, "الحساب المدين مطلوب"),
  debitAmount: z.string().min(1, "المبلغ المدين مطلوب"),
  creditAccount: z.string().min(1, "الحساب الدائن مطلوب"),
  creditAmount: z.string().min(1, "المبلغ الدائن مطلوب"),
  notes: z.string().optional(),
});

type JournalEntryFormData = z.infer<typeof journalEntrySchema>;

export function AddJournalEntryDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const generateEntryNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const timestamp = Date.now().toString().slice(-4);
    return `JE-${year}${month}${day}-${timestamp}`;
  };

  const form = useForm<JournalEntryFormData>({
    resolver: zodResolver(journalEntrySchema),
    defaultValues: {
      entryNumber: generateEntryNumber(),
      date: new Date().toISOString().split('T')[0],
      description: "",
      debitAccount: "",
      debitAmount: "",
      creditAccount: "",
      creditAmount: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: JournalEntryFormData) => {
      // محاكاة API call - يمكن توصيله لاحقاً
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ id: Date.now(), ...data });
        }, 1000);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal-entries"] });
      toast({
        title: "✅ تم بنجاح",
        description: "تم إضافة القيد المحاسبي بنجاح",
      });
      form.reset({
        entryNumber: generateEntryNumber(),
        date: new Date().toISOString().split('T')[0],
        description: "",
        debitAccount: "",
        debitAmount: "",
        creditAccount: "",
        creditAmount: "",
        notes: "",
      });
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "❌ خطأ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: JournalEntryFormData) => {
    mutation.mutate(data);
  };

  // التحقق من التوازن
  const debitAmount = parseFloat(form.watch("debitAmount") || "0");
  const creditAmount = parseFloat(form.watch("creditAmount") || "0");
  const isBalanced = Math.abs(debitAmount - creditAmount) < 0.01;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-lg">
          <Plus className="w-4 h-4" />
          قيد جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl">
              <BookOpen className="w-7 h-7 text-indigo-600" />
            </div>
            إضافة قيد محاسبي جديد
          </DialogTitle>
          <DialogDescription className="text-base">
            قم بتسجيل قيد محاسبي جديد مع التأكد من توازن المدين والدائن
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            
            {/* معلومات القيد */}
            <Card className="border-2 border-indigo-200 bg-gradient-to-r from-indigo-50/50 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="w-5 h-5 text-indigo-600" />
                  <h3 className="font-bold text-lg text-indigo-900">معلومات القيد</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="entryNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">رقم القيد *</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            readOnly 
                            className="bg-indigo-50 border-indigo-200 font-mono text-lg font-bold" 
                          />
                        </FormControl>
                        <FormDescription className="text-xs">تلقائي</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 font-semibold">
                          <Calendar className="w-4 h-4" />
                          التاريخ *
                        </FormLabel>
                        <FormControl>
                          <Input type="date" {...field} className="text-lg" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem className="md:col-span-1">
                        <FormLabel className="font-semibold">البيان *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="وصف موجز للقيد" 
                            {...field}
                            className="text-base"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* الطرف المدين */}
            <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50/50 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingDown className="w-5 h-5 text-red-600" />
                  <h3 className="font-bold text-lg text-red-900">الطرف المدين</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="debitAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">الحساب المدين *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: الصندوق، البنك، العملاء" 
                            {...field}
                            className="text-base"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          الحساب الذي سيُدان (يزيد)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="debitAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">المبلغ المدين (ج.م) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field}
                            className="text-lg font-bold text-red-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* الطرف الدائن */}
            <Card className="border-2 border-green-200 bg-gradient-to-r from-green-50/50 to-transparent">
              <CardContent className="pt-6">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  <h3 className="font-bold text-lg text-green-900">الطرف الدائن</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="creditAccount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">الحساب الدائن *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: الموردين، المبيعات، رأس المال" 
                            {...field}
                            className="text-base"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          الحساب الذي سيُدان (ينقص)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="creditAmount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">المبلغ الدائن (ج.م) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field}
                            className="text-lg font-bold text-green-700"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* التحقق من التوازن */}
            <Alert className={isBalanced ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}>
              <Scale className={`h-5 w-5 ${isBalanced ? "text-green-600" : "text-red-600"}`} />
              <AlertDescription>
                <div className="flex items-center justify-between">
                  <div>
                    <p className={`font-bold ${isBalanced ? "text-green-700" : "text-red-700"}`}>
                      {isBalanced ? "✅ القيد متوازن" : "⚠️ القيد غير متوازن"}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      المدين: {debitAmount.toFixed(2)} ج.م | الدائن: {creditAmount.toFixed(2)} ج.م
                    </p>
                  </div>
                  <div className={`text-2xl font-bold ${isBalanced ? "text-green-600" : "text-red-600"}`}>
                    الفرق: {Math.abs(debitAmount - creditAmount).toFixed(2)} ج.م
                  </div>
                </div>
              </AlertDescription>
            </Alert>

            {/* ملاحظات */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold">ملاحظات</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="تفاصيل إضافية عن القيد..."
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
              <Button 
                type="submit" 
                disabled={mutation.isPending || !isBalanced}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 min-w-[150px]"
              >
                {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {mutation.isPending ? "جاري الحفظ..." : "حفظ القيد"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

