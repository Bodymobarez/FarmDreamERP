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
  Package,
  Loader2,
  Users,
  Calendar,
  Truck,
  DollarSign,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const batchSchema = z.object({
  name: z.string().min(1, "اسم الدفعة مطلوب"),
  receivedDate: z.string().min(1, "تاريخ الاستلام مطلوب"),
  count: z.string().min(1, "عدد الحيوانات مطلوب"),
  supplier: z.string().min(1, "المورد مطلوب"),
  averageWeight: z.string().min(1, "متوسط الوزن مطلوب"),
  totalCost: z.string().min(1, "التكلفة مطلوبة"),
  notes: z.string().optional(),
});

type BatchFormData = z.infer<typeof batchSchema>;

export function AddBatchDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<BatchFormData>({
    resolver: zodResolver(batchSchema),
    defaultValues: {
      name: "",
      receivedDate: new Date().toISOString().split("T")[0],
      count: "",
      supplier: "",
      averageWeight: "",
      totalCost: "",
      notes: "",
    },
  });

  const onSubmit = async (data: BatchFormData) => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const costPerAnimal = (parseFloat(data.totalCost) / parseInt(data.count)).toFixed(2);
      
      toast({
        title: "✅ تم إنشاء الدفعة بنجاح",
        description: (
          <div className="space-y-1">
            <p>الدفعة: {data.name}</p>
            <p>العدد: {data.count} حيوان</p>
            <p>التكلفة: {costPerAnimal} جنيه/حيوان</p>
            <p>المورد: {data.supplier}</p>
          </div>
        ),
      });
      
      form.reset({
        name: "",
        receivedDate: new Date().toISOString().split("T")[0],
        count: "",
        supplier: "",
        averageWeight: "",
        totalCost: "",
        notes: "",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "❌ خطأ في إنشاء الدفعة",
        description: "حدث خطأ أثناء حفظ البيانات، يرجى المحاولة مرة أخرى",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Calculate cost per animal
  const calculateCostPerAnimal = () => {
    const count = parseInt(form.watch("count") || "0");
    const totalCost = parseFloat(form.watch("totalCost") || "0");
    if (count > 0 && totalCost > 0) {
      return (totalCost / count).toFixed(2);
    }
    return null;
  };

  const costPerAnimal = calculateCostPerAnimal();

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
          data-testid="button-add-batch"
        >
          <Package className="w-5 h-5 ml-2" />
          إضافة دفعة جديدة
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-cyan-100 to-teal-100">
              <Package className="h-6 w-6 text-cyan-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                إضافة دفعة جديدة
              </DialogTitle>
              <DialogDescription>
                سجل دفعة حيوانات جديدة في النظام
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            {/* Batch Name */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-cyan-600" />
                    اسم الدفعة *
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="مثال: الدفعة الحادية عشر"
                      className="bg-white"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>
                    اختر اسماً مميزاً للدفعة
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date and Count */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="receivedDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-cyan-600" />
                      تاريخ الاستلام *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="date" 
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
                name="count"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-cyan-600" />
                      عدد الحيوانات *
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
            </div>

            {/* Supplier */}
            <FormField
              control={form.control}
              name="supplier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-cyan-600" />
                    المورد *
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="اختر المورد" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="المورد الأول">المورد الأول</SelectItem>
                      <SelectItem value="المورد الثاني">المورد الثاني</SelectItem>
                      <SelectItem value="المورد الثالث">المورد الثالث</SelectItem>
                      <SelectItem value="مورد آخر">مورد آخر</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Weight and Cost */}
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="averageWeight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>متوسط الوزن *</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.1"
                        placeholder="35.5"
                        className="bg-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>كجم</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-cyan-600" />
                      التكلفة الإجمالية *
                    </FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="50000"
                        className="bg-white"
                        {...field} 
                      />
                    </FormControl>
                    <FormDescription>جنيه مصري</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Cost per Animal Display */}
            {costPerAnimal && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-sm text-gray-900">
                      تكلفة الحيوان الواحد
                    </p>
                    <p className="text-2xl font-bold text-green-600">
                      {costPerAnimal} جنيه
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Notes */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>ملاحظات (اختياري)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="أي ملاحظات حول الدفعة..."
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
                className="bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-cyan-600 hover:to-teal-700"
              >
                {loading ? (
                  <>
                    <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    جاري الإنشاء...
                  </>
                ) : (
                  <>
                    <Package className="ml-2 h-4 w-4" />
                    إنشاء الدفعة
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