import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Pill, Syringe, FileText, Scale, Home, Save, Info, CheckCircle2, AlertTriangle, Package } from "lucide-react";

const medicineDispenseSchema = z.object({
  medicineType: z.enum(["vaccination", "treatment"]),
  medicineName: z.string().min(1, "اسم الدواء مطلوب"),
  quantity: z.string().min(1, "الكمية مطلوبة"),
  penNumber: z.string().min(1, "رقم العنبر مطلوب"),
  notes: z.string().optional(),
});

type MedicineDispenseFormData = z.infer<typeof medicineDispenseSchema>;

interface MedicineDispenseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  medicineType: "vaccination" | "treatment";
}

export function MedicineDispenseDialog({ open, onOpenChange, medicineType }: MedicineDispenseDialogProps) {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch inventory
  const { data: inventory = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
  });

  // Filter medicine items from inventory
  const vaccinations = inventory.filter((item: any) => 
    item.category === "تحصينات" ||
    item.itemName?.includes("تحصين") ||
    item.itemName?.includes("لقاح")
  );

  const treatments = inventory.filter((item: any) => 
    item.category === "علاجات" ||
    item.category === "أدوية" ||
    (item.itemName?.includes("علاج") && !item.itemName?.includes("تحصين"))
  );

  const availableMedicines = medicineType === "vaccination" ? vaccinations : treatments;

  const form = useForm<MedicineDispenseFormData>({
    resolver: zodResolver(medicineDispenseSchema),
    defaultValues: {
      medicineType: medicineType,
      medicineName: "",
      quantity: "",
      penNumber: "",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: MedicineDispenseFormData) => {
      // تسجيل في حركات المخزون
      const inventoryTransaction = {
        transactionNumber: `MED-${Date.now()}`,
        transactionType: "dispense",
        itemId: data.medicineName,
        quantity: data.quantity,
        referenceType: "pen",
        referenceId: data.penNumber,
        notes: `صرف ${medicineType === "vaccination" ? "تحصين" : "علاج"} - ${data.medicineName} للعنبر ${data.penNumber}`,
      };

      const response = await fetch("/api/inventory-transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inventoryTransaction),
      });

      if (!response.ok) {
        throw new Error("فشل في تسجيل الصرف");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/inventory-transactions"] });
      queryClient.invalidateQueries({ queryKey: ["/api/inventory"] });
      queryClient.invalidateQueries({ queryKey: ["/api/treatments"] });
      toast({
        title: "تم بنجاح ✅",
        description: "تم صرف الدواء وتسجيله في المخزون والحسابات",
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

  const onSubmit = async (data: MedicineDispenseFormData) => {
    setLoading(true);
    try {
      await mutation.mutateAsync(data);
    } finally {
      setLoading(false);
    }
  };

  const isVaccination = medicineType === "vaccination";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto bg-gradient-to-br from-white via-red-50/30 to-pink-50/30 border-2 border-red-200/50 shadow-2xl">
        <DialogHeader className="space-y-4 pb-6 border-b border-red-100">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-gradient-to-br ${isVaccination ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600'} shadow-xl ${isVaccination ? 'shadow-purple-500/30' : 'shadow-red-500/30'}`}>
              {isVaccination ? (
                <Syringe className="w-8 h-8 text-white" />
              ) : (
                <Pill className="w-8 h-8 text-white" />
              )}
            </div>
            <div>
              <DialogTitle className={`text-3xl font-bold bg-gradient-to-r ${isVaccination ? 'from-purple-600 to-purple-700' : 'from-red-600 to-red-700'} bg-clip-text text-transparent`}>
                💊 صرف {isVaccination ? "تحصين" : "علاج"}
              </DialogTitle>
              <DialogDescription className="text-base text-gray-600 mt-1">
                صرف من المخزون الرئيسي
              </DialogDescription>
            </div>
          </div>

          {/* Info Alert */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200/50 rounded-xl p-4 flex items-start gap-3 shadow-lg">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Info className="h-5 w-5 text-blue-600" />
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              💡 سيتم خصم الكمية من المخزون تلقائياً وتسجيلها في العلاجات والحسابات
            </p>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-6">
            <Card className={`border-2 ${isVaccination ? 'border-purple-200/60' : 'border-red-200/60'} bg-gradient-to-br ${isVaccination ? 'from-purple-50/40' : 'from-red-50/40'} via-white to-transparent shadow-xl`}>
              <CardHeader className={`pb-4 bg-gradient-to-r ${isVaccination ? 'from-purple-50/50 to-purple-50/20' : 'from-red-50/50 to-red-50/20'} border-b ${isVaccination ? 'border-purple-100' : 'border-red-100'}`}>
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-xl bg-gradient-to-br ${isVaccination ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600'} shadow-lg`}>
                    {isVaccination ? <Syringe className="w-5 h-5 text-white" /> : <Pill className="w-5 h-5 text-white" />}
                  </div>
                  <CardTitle className="text-lg font-bold text-gray-900">💉 بيانات الصرف</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 pt-6">
                {/* اسم الدواء من المخزون */}
                <FormField
                  control={form.control}
                  name="medicineName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-base font-bold text-gray-900">
                        <div className={`p-2 rounded-lg ${isVaccination ? 'bg-purple-100' : 'bg-red-100'}`}>
                          {isVaccination ? <Syringe className="w-5 h-5 text-purple-600" /> : <Pill className="w-5 h-5 text-red-600" />}
                        </div>
                        اختر {isVaccination ? "التحصين" : "العلاج"} *
                        <Badge variant="outline" className="mr-auto">
                          {availableMedicines.length} صنف متاح
                        </Badge>
                      </FormLabel>
                      
                      {availableMedicines.length > 0 ? (
                        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 max-h-[280px] overflow-y-auto p-3 bg-gradient-to-br ${isVaccination ? 'from-purple-50 to-indigo-50/30' : 'from-red-50 to-pink-50/30'} rounded-xl border ${isVaccination ? 'border-purple-200' : 'border-red-200'}`}>
                          {availableMedicines.map((item: any) => {
                            const stockLevel = parseFloat(item.currentStock || item.quantity || "0");
                            const minStock = parseFloat(item.minStock || item.minimumStock || "0");
                            const isLowStock = stockLevel <= minStock;
                            
                            return (
                              <div
                                key={item.id}
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  field.onChange(item.id);
                                  console.log("Selected medicine:", item.id, item.itemName);
                                }}
                                className={`relative cursor-pointer p-4 rounded-xl border-2 transition-all duration-300 hover:shadow-lg ${
                                  field.value === item.id
                                    ? `bg-gradient-to-r ${isVaccination ? 'from-purple-500 to-purple-600' : 'from-red-500 to-red-600'} border-${isVaccination ? 'purple' : 'red'}-600 text-white shadow-xl ring-4 ring-${isVaccination ? 'purple' : 'red'}-200`
                                    : `border-${isVaccination ? 'purple' : 'red'}-300 hover:border-${isVaccination ? 'purple' : 'red'}-500 bg-white hover:bg-${isVaccination ? 'purple' : 'red'}-50`
                                }`}
                              >
                                <div className="space-y-2">
                                  {/* Medicine Name */}
                                  <div className="flex items-start justify-between gap-2">
                                    <p className={`font-bold text-sm leading-tight flex-1 ${
                                      field.value === item.id ? 'text-white' : 'text-gray-900'
                                    }`}>
                                      {item.itemName}
                                    </p>
                                    {field.value === item.id && (
                                      <div className="bg-white/20 p-1 rounded-md flex-shrink-0">
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Stock Info */}
                                  <div className={`flex items-center justify-between text-xs ${
                                    field.value === item.id ? 'text-white/90' : 'text-gray-600'
                                  }`}>
                                    <div className="flex items-center gap-1">
                                      <Package className="w-3 h-3" />
                                      <span className="font-semibold">{stockLevel.toFixed(0)} {item.unit || "مل"}</span>
                                    </div>
                                    {isLowStock && (
                                      <div className={`flex items-center gap-1 ${
                                        field.value === item.id ? 'text-yellow-200' : 'text-orange-600'
                                      }`}>
                                        <AlertTriangle className="w-3 h-3" />
                                        <span className="font-semibold">قليل</span>
                                      </div>
                                    )}
                                  </div>

                                  {/* Category Badge */}
                                  <Badge 
                                    variant={field.value === item.id ? "secondary" : "outline"}
                                    className={`text-xs w-full justify-center ${
                                      field.value === item.id 
                                        ? 'bg-white/20 text-white border-white/30' 
                                        : `bg-${isVaccination ? 'purple' : 'red'}-50 text-${isVaccination ? 'purple' : 'red'}-700`
                                    }`}
                                  >
                                    {item.category || item.itemCode || (isVaccination ? "تحصين" : "علاج")}
                                  </Badge>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className={`p-8 text-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border-2 border-dashed ${isVaccination ? 'border-purple-300' : 'border-red-300'}`}>
                          <AlertTriangle className={`w-12 h-12 mx-auto mb-3 ${isVaccination ? 'text-purple-400' : 'text-red-400'}`} />
                          <p className="text-base font-semibold text-gray-700">
                            لا يوجد {isVaccination ? 'تحصينات' : 'علاجات'} في المخزون
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            يرجى إضافة {isVaccination ? 'تحصينات' : 'علاجات'} للمخزون أولاً
                          </p>
                        </div>
                      )}
                      
                      <FormDescription className={`text-sm text-gray-600 flex items-center gap-1 mt-3`}>
                        <Info className="w-3 h-3" />
                        اختر {isVaccination ? 'التحصين' : 'العلاج'} المتاح في المخزون
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {/* الكمية بالملم */}
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2 text-base font-semibold text-gray-800">
                          <div className={`p-1 rounded-md ${isVaccination ? 'bg-purple-100' : 'bg-red-100'}`}>
                            <Scale className={`w-4 h-4 ${isVaccination ? 'text-purple-600' : 'text-red-600'}`} />
                          </div>
                          الكمية (ملم) *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.1"
                            placeholder="مثال: 10" 
                            {...field} 
                            className={`h-14 text-lg border-2 ${isVaccination ? 'border-purple-200 focus:border-purple-500 focus:ring-purple-200' : 'border-red-200 focus:border-red-500 focus:ring-red-200'} focus:ring-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-600">
                          أدخل الكمية بالمللي
                        </FormDescription>
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
                          <div className={`p-1 rounded-md ${isVaccination ? 'bg-purple-100' : 'bg-red-100'}`}>
                            <Home className={`w-4 h-4 ${isVaccination ? 'text-purple-600' : 'text-red-600'}`} />
                          </div>
                          رقم العنبر *
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: A1" 
                            {...field} 
                            className={`h-14 text-lg border-2 ${isVaccination ? 'border-purple-200 focus:border-purple-500 focus:ring-purple-200' : 'border-red-200 focus:border-red-500 focus:ring-red-200'} focus:ring-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-200`}
                          />
                        </FormControl>
                        <FormDescription className="text-sm text-gray-600">
                          العنبر المراد {isVaccination ? 'تحصينه' : 'علاجه'}
                        </FormDescription>
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
                          className={`min-h-[100px] resize-none text-base border-2 ${isVaccination ? 'border-purple-200 focus:border-purple-500 focus:ring-purple-200' : 'border-red-200 focus:border-red-500 focus:ring-red-200'} focus:ring-4 rounded-xl shadow-sm`}
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
                className={`flex-1 h-14 text-lg bg-gradient-to-r ${isVaccination ? 'from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800' : 'from-red-600 to-red-700 hover:from-red-700 hover:to-red-800'} shadow-xl`}
              >
                <Save className="w-5 h-5 ml-2" />
                {loading ? "جاري الحفظ..." : "تسجيل الصرف"}
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

