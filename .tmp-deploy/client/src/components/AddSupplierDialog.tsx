import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertSupplierSchema, type InsertSupplier } from "@shared/schema";
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  Plus, 
  Loader2, 
  Truck, 
  Phone, 
  Mail, 
  MapPin, 
  Hash, 
  FileText, 
  DollarSign, 
  CreditCard, 
  Info, 
  Save, 
  X, 
  AlertCircle,
  Package
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddSupplierDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertSupplier>({
    resolver: zodResolver(insertSupplierSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      address: "",
      taxNumber: "",
      balance: "0",
      notes: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data: InsertSupplier) => {
      // Add auto-generated supplier number
      const supplierData = {
        ...data,
        supplierNumber: `SUP-${Date.now()}`,
        balance: "0"
      };
      
      const response = await fetch("/api/suppliers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(supplierData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إضافة المورد");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/suppliers"] });
      toast({
        title: "تم بنجاح",
        description: "تم إضافة المورد بنجاح",
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

  const onSubmit = (data: InsertSupplier) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="w-5 h-5 ml-2" />
          إضافة مورد جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-orange-500/20 to-orange-600/10 rounded-lg">
              <Truck className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">إضافة مورد جديد</DialogTitle>
              <DialogDescription>
                أدخل بيانات المورد الجديد
              </DialogDescription>
            </div>
          </div>
          
          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              جميع الحقول اختيارية ماعدا اسم المورد
            </AlertDescription>
          </Alert>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* القسم الأول: البيانات الأساسية */}
            <Card className="border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Package className="w-5 h-5 text-orange-600" />
                  البيانات الأساسية
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-orange-600" />
                          اسم المورد <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: مزارع النور" 
                            className="bg-white border-orange-200 focus:border-orange-400 focus:ring-orange-400" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          اسم المورد كامل
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-600" />
                          رقم الهاتف
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: 0501234567" 
                            dir="ltr"
                            className="bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          رقم الهاتف للتواصل
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-600" />
                          البريد الإلكتروني
                        </FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="example@email.com" 
                            dir="ltr"
                            className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          البريد الإلكتروني للمراسلات
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="taxNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Hash className="w-4 h-4 text-purple-600" />
                          الرقم الضريبي
                        </FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="مثال: 123456789" 
                            className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription className="text-xs flex items-center gap-1">
                          <Info className="w-3 h-3" />
                          رقم السجل الضريبي
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* القسم الثاني: المعلومات المالية */}
            <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  المعلومات المالية
                </CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2 text-lg">
                        <CreditCard className="w-5 h-5 text-green-600" />
                        الرصيد الافتتاحي (جنيه مصري)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          className="text-lg font-semibold bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="text-xs flex items-center gap-1">
                        <Info className="w-3 h-3" />
                        الرصيد البدائي للمورد (اتركه 0 إذا لم يكن هناك رصيد سابق)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* القسم الثالث: العنوان والملاحظات */}
            <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/30 to-transparent shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  العنوان والملاحظات
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-amber-600" />
                        العنوان
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="عنوان المورد الكامل..."
                          className="resize-none bg-white border-amber-200 focus:border-amber-400 focus:ring-amber-400 min-h-[80px]"
                          {...field}
                        />
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
                      <FormLabel className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-amber-600" />
                        ملاحظات
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="أي ملاحظات إضافية..."
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
            
            <div className="flex items-center justify-between gap-3 pt-2 pb-1 px-1 bg-gradient-to-r from-gray-50 to-transparent rounded-lg">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="w-4 h-4" />
                <span>الحقل المطلوب: اسم المورد فقط</span>
              </div>
              
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (form.formState.isDirty) {
                      if (confirm('هل تريد الإلغاء؟ سيتم فقدان التغييرات غير المحفوظة.')) {
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
                  disabled={mutation.isPending || !form.watch('name')}
                  className="bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 shadow-lg hover:shadow-xl transition-all gap-2"
                >
                  {mutation.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  حفظ المورد
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
