import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { insertCustomerSchema, type InsertCustomer } from "@shared/schema";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  FormDescription,
} from "@/components/ui/form";
import { Plus, Loader2, User, Phone, Mail, MapPin, Hash, FileText, DollarSign, CreditCard, Info, Save, X, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function AddCustomerDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertCustomer>({
    resolver: zodResolver(insertCustomerSchema),
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
    mutationFn: async (data: InsertCustomer) => {
      const response = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في إضافة العميل");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/customers"] });
      toast({
        title: "تم بنجاح",
        description: "تم إضافة العميل بنجاح",
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

  const onSubmit = (data: InsertCustomer) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg">
          <Plus className="w-5 h-5 ml-2" />
          إضافة عميل جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[92vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10">
              <User className="w-6 h-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl">إضافة عميل جديد</DialogTitle>
          </div>
          <DialogDescription className="text-base">
            أدخل بيانات العميل الجديد وتفاصيل الاتصال
          </DialogDescription>
          
          <Alert className="mt-3 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-sm text-blue-800">
              💡 جميع الحقول اختيارية ماعدا اسم العميل
            </AlertDescription>
          </Alert>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            {/* Section 1: المعلومات الأساسية */}
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-primary/10">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <CardTitle className="text-base">المعلومات الأساسية</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-1.5 text-base">
                          <User className="w-3.5 h-3.5 text-primary" />
                          اسم العميل
                          <span className="text-red-500">*</span>
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: محمد أحمد" className="text-base" {...field} />
                        </FormControl>
                        <FormDescription className="flex items-center gap-1 text-xs">
                          <Info className="w-3 h-3" />
                          الاسم الكامل للعميل
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
                        <FormLabel className="flex items-center gap-1.5 text-base">
                          <Phone className="w-3.5 h-3.5 text-green-600" />
                          رقم الهاتف
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: 0501234567" className="text-base" dir="ltr" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          رقم الجوال أو الهاتف الثابت
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
                        <FormLabel className="flex items-center gap-1.5 text-base">
                          <Mail className="w-3.5 h-3.5 text-blue-600" />
                          البريد الإلكتروني
                        </FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="example@email.com" className="text-base" dir="ltr" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          للتواصل الإلكتروني وإرسال الفواتير
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
                        <FormLabel className="flex items-center gap-1.5 text-base">
                          <Hash className="w-3.5 h-3.5 text-purple-600" />
                          الرقم الضريبي
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="مثال: 123456789" className="text-base" dir="ltr" {...field} />
                        </FormControl>
                        <FormDescription className="text-xs">
                          رقم التسجيل الضريبي إن وجد
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Section 2: المعلومات المالية */}
            <Card className="border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-green-100">
                    <DollarSign className="w-4 h-4 text-green-700" />
                  </div>
                  <CardTitle className="text-base">الرصيد الافتتاحي</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="balance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-base">
                        <CreditCard className="w-3.5 h-3.5 text-green-600" />
                        الرصيد الافتتاحي (ج)
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          className="text-lg font-semibold bg-white" 
                          dir="ltr"
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription className="flex items-center gap-1 text-xs">
                        <Info className="w-3 h-3" />
                        الرصيد البدائي للعميل (اتركه 0 إذا لم يكن لديه رصيد)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Section 3: العنوان والملاحظات */}
            <Card className="border-amber-200 bg-gradient-to-br from-amber-50/30 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-md bg-amber-100">
                    <MapPin className="w-4 h-4 text-amber-700" />
                  </div>
                  <CardTitle className="text-base">العنوان والملاحظات</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-base">
                        <MapPin className="w-3.5 h-3.5 text-amber-600" />
                        العنوان
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="مثال: شارع الملك فيصل، الرياض، المملكة العربية السعودية"
                          className="resize-none bg-white text-base min-h-[80px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        العنوان الكامل للعميل
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5 text-base">
                        <FileText className="w-3.5 h-3.5 text-blue-600" />
                        ملاحظات
                        <span className="text-muted-foreground text-xs">(اختياري)</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="مثال: عميل مميز، دفع منتظم، تفضيلات معينة..."
                          className="resize-none bg-white text-base min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        أي معلومات إضافية عن العميل
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Separator />
            
            <div className="flex justify-between items-center gap-3 pt-4 border-t bg-gradient-to-b from-transparent to-muted/20">
              <div className="text-sm text-muted-foreground flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span className="text-red-500">*</span> الحقول المطلوبة
              </div>
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    if (form.formState.isDirty) {
                      if (confirm("هل تريد إغلاق النموذج؟ سيتم فقد البيانات المدخلة.")) {
                        setOpen(false);
                        form.reset();
                      }
                    } else {
                      setOpen(false);
                      form.reset();
                    }
                  }}
                  disabled={mutation.isPending}
                  size="lg"
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <X className="ml-2 h-5 w-5" />
                  إلغاء
                </Button>
                <Button 
                  type="submit" 
                  disabled={mutation.isPending || !form.formState.isValid}
                  size="lg"
                  className="min-w-[150px] bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all"
                >
                  {mutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    <>
                      <Save className="ml-2 h-5 w-5" />
                      حفظ العميل
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
