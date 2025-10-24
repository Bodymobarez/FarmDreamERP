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
import { Plus, Loader2, Wallet, Pill, Users, Zap, Wrench, Truck, Home, Shield, TrendingUp, FileText, HardHat, Sparkles, DollarSign, Receipt } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

const expenseSchema = z.object({
  expenseType: z.string().min(1, "نوع المصروف مطلوب"),
  category: z.string().min(1, "الفئة مطلوبة"),
  subcategory: z.string().optional(),
  amount: z.string().min(1, "المبلغ مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  date: z.string().min(1, "التاريخ مطلوب"),
  paymentMethod: z.string().optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
  // For salary expenses
  employeeName: z.string().optional(),
  employeePosition: z.string().optional(),
  employeeId: z.string().optional(),
  salaryMonth: z.string().optional(),
  baseSalary: z.string().optional(),
  bonuses: z.string().optional(),
  deductions: z.string().optional(),
});

type ExpenseFormData = z.infer<typeof expenseSchema>;

export function AddExpenseDialog() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ExpenseFormData>({
    resolver: zodResolver(expenseSchema),
    defaultValues: {
      expenseType: "",
      category: "",
      subcategory: "",
      amount: "",
      description: "",
      date: new Date().toISOString().split('T')[0],
      paymentMethod: "cash",
      referenceNumber: "",
      notes: "",
      employeeName: "",
      employeePosition: "",
      employeeId: "",
      salaryMonth: "",
      baseSalary: "",
      bonuses: "0",
      deductions: "0",
    },
  });

  const expenseType = form.watch("expenseType");

  const onSubmit = async (data: ExpenseFormData) => {
    setLoading(true);
    try {
      // Calculate net salary if it's a salary expense
      if (data.expenseType === "salary" && data.baseSalary) {
        const base = parseFloat(data.baseSalary || "0");
        const bonus = parseFloat(data.bonuses || "0");
        const deduct = parseFloat(data.deductions || "0");
        const netSalary = base + bonus - deduct;
        
        console.log("Salary Details:", {
          ...data,
          netSalary: netSalary.toString()
        });
      }
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const expenseTypeNames: Record<string, string> = {
        feed: "أعلاف",
        medicine: "أدوية وعلاجات",
        salary: "راتب",
        utilities: "مرافق",
        maintenance: "صيانة",
        transport: "نقل",
        rent: "إيجار",
        insurance: "تأمين",
        marketing: "تسويق",
        consultation: "استشارات",
        equipment: "معدات",
        cleaning: "تنظيف",
        security: "أمن",
        taxes: "ضرائب",
        other: "أخرى"
      };
      
      toast({
        title: "✅ تم بنجاح",
        description: `تم إضافة ${expenseTypeNames[data.expenseType]} بقيمة ${data.amount} ج`,
      });
      
      form.reset({
        expenseType: "",
        category: "",
        subcategory: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split('T')[0],
        paymentMethod: "cash",
        referenceNumber: "",
        notes: "",
        employeeName: "",
        employeePosition: "",
        employeeId: "",
        salaryMonth: "",
        baseSalary: "",
        bonuses: "0",
        deductions: "0",
      });
      setOpen(false);
    } catch (error) {
      toast({
        title: "❌ خطأ",
        description: "فشل في إضافة المصروف",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const expenseCategories = [
    { value: "feed", label: "🌾 أعلاف", icon: Wallet, color: "text-green-600" },
    { value: "medicine", label: "💊 أدوية وعلاجات", icon: Pill, color: "text-blue-600" },
    { value: "salary", label: "👥 مرتبات", icon: Users, color: "text-purple-600" },
    { value: "utilities", label: "⚡ مرافق (كهرباء، مياه، غاز)", icon: Zap, color: "text-yellow-600" },
    { value: "maintenance", label: "🔧 صيانة", icon: Wrench, color: "text-orange-600" },
    { value: "transport", label: "🚚 نقل ومواصلات", icon: Truck, color: "text-indigo-600" },
    { value: "rent", label: "🏠 إيجار", icon: Home, color: "text-red-600" },
    { value: "insurance", label: "🛡️ تأمين", icon: Shield, color: "text-teal-600" },
    { value: "marketing", label: "📢 تسويق", icon: TrendingUp, color: "text-pink-600" },
    { value: "consultation", label: "📋 استشارات", icon: FileText, color: "text-cyan-600" },
    { value: "equipment", label: "🛠️ معدات وأدوات", icon: HardHat, color: "text-amber-600" },
    { value: "cleaning", label: "✨ تنظيف ونظافة", icon: Sparkles, color: "text-lime-600" },
    { value: "security", label: "🔒 أمن وحراسة", icon: Shield, color: "text-gray-600" },
    { value: "taxes", label: "📊 ضرائب ورسوم", icon: Receipt, color: "text-slate-600" },
    { value: "other", label: "📦 أخرى", icon: DollarSign, color: "text-neutral-600" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" data-testid="button-add-expense">
          <Plus className="w-5 h-5 ml-2" />
          إضافة مصروف جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">💰 إضافة مصروف جديد</DialogTitle>
          <DialogDescription>
            سجل المصروف المالي بجميع التفاصيل
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Expense Type Selection */}
            <FormField
              control={form.control}
              name="expenseType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg font-bold">نوع المصروف *</FormLabel>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {expenseCategories.map((category) => {
                      const Icon = category.icon;
                      return (
                        <Card
                          key={category.value}
                          className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                            field.value === category.value
                              ? 'ring-2 ring-primary bg-primary/5'
                              : 'hover:bg-accent'
                          }`}
                          onClick={() => {
                            field.onChange(category.value);
                            form.setValue("category", category.label);
                          }}
                        >
                          <div className="flex items-center gap-2">
                            <Icon className={`w-5 h-5 ${category.color}`} />
                            <span className="text-sm font-medium">{category.label}</span>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Common Fields */}
            {expenseType && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>المبلغ (ج) *</FormLabel>
                        <FormControl>
                          <Input type="number" step="0.01" placeholder="مثال: 12500" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Salary-Specific Fields */}
                {expenseType === "salary" && (
                  <Card className="p-4 bg-purple-50 border-purple-200">
                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                      <Users className="w-5 h-5 text-purple-600" />
                      تفاصيل الراتب
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="employeeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>اسم الموظف *</FormLabel>
                            <FormControl>
                              <Input placeholder="مثال: أحمد محمد" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employeePosition"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الوظيفة *</FormLabel>
                            <FormControl>
                              <Input placeholder="مثال: عامل تغذية" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="employeeId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>رقم الموظف</FormLabel>
                            <FormControl>
                              <Input placeholder="مثال: EMP-001" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="salaryMonth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>شهر الراتب *</FormLabel>
                            <FormControl>
                              <Input type="month" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="baseSalary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الراتب الأساسي (ج) *</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="مثال: 5000" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="bonuses"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الحوافز والبدلات (ج)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="deductions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>الخصومات (ج)</FormLabel>
                            <FormControl>
                              <Input type="number" step="0.01" placeholder="0" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="md:col-span-2 bg-purple-100 p-3 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-purple-900">صافي الراتب:</span>
                          <span className="text-2xl font-bold text-purple-600">
                            {(() => {
                              const base = parseFloat(form.watch("baseSalary") || "0");
                              const bonus = parseFloat(form.watch("bonuses") || "0");
                              const deduct = parseFloat(form.watch("deductions") || "0");
                              return (base + bonus - deduct).toLocaleString();
                            })()} ج
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>الوصف التفصيلي *</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={
                            expenseType === "salary"
                              ? "مثال: راتب شهر أكتوبر 2025"
                              : expenseType === "feed"
                              ? "مثال: علف تسمين مركز - 500 كجم"
                              : "وصف تفصيلي للمصروف..."
                          }
                          className="resize-none"
                          rows={3}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>طريقة الدفع</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر طريقة الدفع" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="cash">💵 نقدي</SelectItem>
                            <SelectItem value="bank_transfer">🏦 تحويل بنكي</SelectItem>
                            <SelectItem value="check">📝 شيك</SelectItem>
                            <SelectItem value="credit">💳 آجل</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="referenceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم المرجع</FormLabel>
                        <FormControl>
                          <Input placeholder="رقم الشيك أو الحوالة" {...field} />
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
                      <FormLabel>ملاحظات إضافية</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أي ملاحظات إضافية..."
                          className="resize-none"
                          rows={2}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={loading}
              >
                إلغاء
              </Button>
              <Button type="submit" disabled={loading || !expenseType}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                💾 حفظ المصروف
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
