import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { 
  Receipt, 
  DollarSign, 
  User, 
  Calendar, 
  FileText, 
  CreditCard,
  Building2,
  Hash,
  CheckCircle2,
  Banknote,
  Printer,
  Download,
  Sparkles,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// دالة لتحويل الأرقام إلى كلمات (بالعربية)
function numberToArabicWords(num: number): string {
  if (num === 0) return "صفر";
  
  const ones = ["", "واحد", "اثنان", "ثلاثة", "أربعة", "خمسة", "ستة", "سبعة", "ثمانية", "تسعة"];
  const tens = ["", "عشرة", "عشرون", "ثلاثون", "أربعون", "خمسون", "ستون", "سبعون", "ثمانون", "تسعون"];
  const hundreds = ["", "مائة", "مئتان", "ثلاثمائة", "أربعمائة", "خمسمائة", "ستمائة", "سبعمائة", "ثمانمائة", "تسعمائة"];
  const thousands = ["", "ألف", "ألفان", "آلاف"];
  
  if (num < 10) return ones[num];
  if (num < 100) {
    const ten = Math.floor(num / 10);
    const one = num % 10;
    if (num >= 11 && num <= 19) {
      return ones[one] + " عشر";
    }
    return tens[ten] + (one > 0 ? " و" + ones[one] : "");
  }
  if (num < 1000) {
    const hundred = Math.floor(num / 100);
    const remainder = num % 100;
    return hundreds[hundred] + (remainder > 0 ? " و" + numberToArabicWords(remainder) : "");
  }
  if (num < 1000000) {
    const thousand = Math.floor(num / 1000);
    const remainder = num % 1000;
    let result = "";
    if (thousand === 1) result = "ألف";
    else if (thousand === 2) result = "ألفان";
    else if (thousand >= 3 && thousand <= 10) result = numberToArabicWords(thousand) + " آلاف";
    else result = numberToArabicWords(thousand) + " ألف";
    return result + (remainder > 0 ? " و" + numberToArabicWords(remainder) : "");
  }
  return num.toString();
}

const formSchema = z.object({
  voucherNumber: z.string().min(1, "رقم السند مطلوب"),
  voucherDate: z.string().min(1, "تاريخ السند مطلوب"),
  relatedType: z.enum(["supplier", "customer", "employee", "other"]),
  relatedId: z.string().optional(),
  relatedName: z.string().min(1, "اسم الجهة مطلوب"),
  amount: z.string().min(1, "المبلغ مطلوب"),
  paymentMethod: z.enum(["cash", "bank_transfer", "check"]),
  checkNumber: z.string().optional(),
  checkDate: z.string().optional(),
  bankName: z.string().optional(),
  description: z.string().min(1, "البيان مطلوب"),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

export function ReceiptVoucherDialog() {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      voucherNumber: `RV-${Date.now()}`,
      voucherDate: new Date().toISOString().split('T')[0],
      relatedType: "customer",
      relatedName: "",
      amount: "",
      paymentMethod: "cash",
      description: "",
      notes: "",
    },
  });

  // جلب العملاء
  const { data: customers = [] } = useQuery({
    queryKey: ["/api/customers"],
  });

  // جلب الموردين
  const { data: suppliers = [] } = useQuery({
    queryKey: ["/api/suppliers"],
  });

  const createVoucher = useMutation({
    mutationFn: async (data: FormData) => {
      const amount = parseFloat(data.amount);
      const amountInWords = numberToArabicWords(Math.floor(amount)) + " جنيه";
      
      const voucherData = {
        ...data,
        voucherType: "receipt",
        amountInWords,
        voucherDate: new Date(data.voucherDate),
        checkDate: data.checkDate ? new Date(data.checkDate) : undefined,
        status: "approved",
      };

      const response = await fetch("/api/vouchers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(voucherData),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/vouchers"] });
      toast({
        title: "✅ تم بنجاح",
        description: "تم إنشاء سند القبض بنجاح",
      });
      form.reset();
      setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        variant: "destructive",
        title: "❌ خطأ",
        description: error.message,
      });
    },
  });

  const handleSubmit = (data: FormData) => {
    createVoucher.mutate(data);
  };

  const handlePrint = () => {
    const data = form.getValues();
    const amount = parseFloat(data.amount || "0");
    const amountInWords = numberToArabicWords(Math.floor(amount)) + " جنيه";
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html dir="rtl">
        <head>
          <meta charset="UTF-8">
          <title>سند قبض - ${data.voucherNumber}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Arial', sans-serif;
              padding: 40px;
              background: white;
              color: #1a1a1a;
            }
            .voucher {
              max-width: 800px;
              margin: 0 auto;
              border: 3px solid #1e40af;
              border-radius: 12px;
              overflow: hidden;
            }
            .header {
              background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
              color: white;
              padding: 30px;
              text-align: center;
            }
            .header h1 {
              font-size: 32px;
              font-weight: bold;
              margin-bottom: 10px;
              text-shadow: 2px 2px 4px rgba(0,0,0,0.2);
            }
            .header .subtitle {
              font-size: 18px;
              opacity: 0.95;
            }
            .content {
              padding: 40px;
              background: white;
            }
            .voucher-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 20px;
              margin-bottom: 30px;
              padding: 20px;
              background: #f8fafc;
              border-radius: 8px;
              border: 2px dashed #cbd5e1;
            }
            .info-item {
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .info-label {
              font-weight: bold;
              color: #475569;
              min-width: 120px;
            }
            .info-value {
              color: #1e293b;
              font-size: 16px;
            }
            .amount-section {
              background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
              padding: 25px;
              border-radius: 10px;
              margin: 30px 0;
              border: 2px solid #93c5fd;
            }
            .amount-box {
              text-align: center;
              margin-bottom: 15px;
            }
            .amount-label {
              font-size: 16px;
              color: #1e40af;
              font-weight: bold;
              margin-bottom: 8px;
            }
            .amount-value {
              font-size: 36px;
              color: #1e40af;
              font-weight: bold;
              text-shadow: 1px 1px 2px rgba(0,0,0,0.1);
            }
            .amount-words {
              font-size: 18px;
              color: #475569;
              text-align: center;
              padding: 15px;
              background: white;
              border-radius: 8px;
              border: 1px solid #cbd5e1;
            }
            .description-box {
              margin: 25px 0;
              padding: 20px;
              background: #f1f5f9;
              border-radius: 8px;
              border-right: 4px solid #1e40af;
            }
            .description-label {
              font-weight: bold;
              color: #1e40af;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .description-text {
              color: #334155;
              line-height: 1.8;
              font-size: 15px;
            }
            .signature-section {
              display: grid;
              grid-template-columns: 1fr 1fr 1fr;
              gap: 30px;
              margin-top: 60px;
              padding-top: 30px;
              border-top: 2px solid #e2e8f0;
            }
            .signature-box {
              text-align: center;
            }
            .signature-label {
              font-weight: bold;
              color: #475569;
              margin-bottom: 40px;
              font-size: 14px;
            }
            .signature-line {
              border-top: 2px solid #1e40af;
              padding-top: 10px;
              color: #64748b;
              font-size: 13px;
            }
            .footer {
              background: #f8fafc;
              padding: 20px;
              text-align: center;
              border-top: 2px solid #e2e8f0;
              color: #64748b;
              font-size: 13px;
            }
            @media print {
              body { padding: 20px; }
              .voucher { border: 2px solid #1e40af; }
            }
          </style>
        </head>
        <body>
          <div class="voucher">
            <div class="header">
              <h1>🧾 سند قبض نقدية</h1>
              <div class="subtitle">Receipt Voucher</div>
            </div>
            
            <div class="content">
              <div class="voucher-info">
                <div class="info-item">
                  <span class="info-label">رقم السند:</span>
                  <span class="info-value">${data.voucherNumber}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">التاريخ:</span>
                  <span class="info-value">${new Date(data.voucherDate).toLocaleDateString('ar-EG')}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">استلمنا من:</span>
                  <span class="info-value">${data.relatedName}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">طريقة الدفع:</span>
                  <span class="info-value">${
                    data.paymentMethod === 'cash' ? '💵 نقداً' :
                    data.paymentMethod === 'bank_transfer' ? '🏦 تحويل بنكي' :
                    '📝 شيك'
                  }</span>
                </div>
                ${data.paymentMethod === 'check' && data.checkNumber ? `
                  <div class="info-item">
                    <span class="info-label">رقم الشيك:</span>
                    <span class="info-value">${data.checkNumber}</span>
                  </div>
                  <div class="info-item">
                    <span class="info-label">تاريخ الشيك:</span>
                    <span class="info-value">${data.checkDate ? new Date(data.checkDate).toLocaleDateString('ar-EG') : '-'}</span>
                  </div>
                ` : ''}
                ${data.paymentMethod === 'bank_transfer' && data.bankName ? `
                  <div class="info-item">
                    <span class="info-label">اسم البنك:</span>
                    <span class="info-value">${data.bankName}</span>
                  </div>
                ` : ''}
              </div>

              <div class="amount-section">
                <div class="amount-box">
                  <div class="amount-label">المبلغ المستلم</div>
                  <div class="amount-value">${amount.toLocaleString('ar-EG')} جنيه</div>
                </div>
                <div class="amount-words">
                  <strong>وذلك قيمة:</strong> ${amountInWords} فقط لا غير
                </div>
              </div>

              <div class="description-box">
                <div class="description-label">📋 البيان</div>
                <div class="description-text">${data.description}</div>
              </div>

              ${data.notes ? `
                <div class="description-box" style="border-right-color: #f59e0b;">
                  <div class="description-label" style="color: #f59e0b;">📝 ملاحظات</div>
                  <div class="description-text">${data.notes}</div>
                </div>
              ` : ''}

              <div class="signature-section">
                <div class="signature-box">
                  <div class="signature-label">المستلم</div>
                  <div class="signature-line">التوقيع</div>
                </div>
                <div class="signature-box">
                  <div class="signature-label">المحاسب</div>
                  <div class="signature-line">التوقيع</div>
                </div>
                <div class="signature-box">
                  <div class="signature-label">المدير المالي</div>
                  <div class="signature-line">التوقيع</div>
                </div>
              </div>
            </div>

            <div class="footer">
              تم الإنشاء بواسطة نظام FarmDreamERP - ${new Date().toLocaleString('ar-EG')}
            </div>
          </div>

          <script>
            window.onload = function() {
              window.print();
            };
          </script>
        </body>
        </html>
      `);
      printWindow.document.close();
    }
  };

  const relatedType = form.watch("relatedType");
  const paymentMethod = form.watch("paymentMethod");
  const amount = form.watch("amount");

  // قائمة الجهات حسب النوع
  const getRelatedList = (): any[] => {
    if (relatedType === "customer") return customers as any[];
    if (relatedType === "supplier") return suppliers as any[];
    return [];
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg"
        >
          <Receipt className="mr-2 h-5 w-5" />
          سند قبض جديد 🧾
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
            سند قبض نقدية
            <Sparkles className="w-5 h-5 text-blue-500 animate-pulse" />
          </DialogTitle>
          <DialogDescription>
            تسجيل إيصال استلام نقدية من العملاء أو الموردين
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            {/* معلومات السند */}
            <div className="space-y-4 p-5 border-2 border-blue-200 rounded-lg bg-gradient-to-br from-blue-50/50 to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <h3 className="font-semibold text-blue-900">معلومات السند</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="voucherNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Hash className="w-4 h-4 text-blue-500" />
                        رقم السند
                      </FormLabel>
                      <FormControl>
                        <Input {...field} className="bg-white border-blue-200 focus:border-blue-400" />
                      </FormControl>
                      <FormDescription>رقم تعريف فريد للسند</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="voucherDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        تاريخ السند
                      </FormLabel>
                      <FormControl>
                        <Input type="date" {...field} className="bg-white border-blue-200 focus:border-blue-400" />
                      </FormControl>
                      <FormDescription>تاريخ استلام النقدية</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* بيانات الجهة */}
            <div className="space-y-4 p-5 border-2 border-green-200 rounded-lg bg-gradient-to-br from-green-50/50 to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-green-600" />
                </div>
                <h3 className="font-semibold text-green-900">بيانات الجهة</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="relatedType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>نوع الجهة</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-green-200 focus:border-green-400">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="customer">عميل</SelectItem>
                          <SelectItem value="supplier">مورد</SelectItem>
                          <SelectItem value="employee">موظف</SelectItem>
                          <SelectItem value="other">آخر</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>اختر نوع الجهة</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {(relatedType === "customer" || relatedType === "supplier") && (
                  <FormField
                    control={form.control}
                    name="relatedId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اختيار الجهة</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const list = getRelatedList();
                            const selected = list.find((item: any) => item.id === value);
                            if (selected) {
                              form.setValue("relatedName", selected.name);
                            }
                          }} 
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="bg-white border-green-200 focus:border-green-400">
                              <SelectValue placeholder="اختر..." />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getRelatedList().map((item: any) => (
                              <SelectItem key={item.id} value={item.id}>
                                {item.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>اختر من القائمة</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="relatedName"
                  render={({ field }) => (
                    <FormItem className={relatedType === "customer" || relatedType === "supplier" ? "col-span-2" : ""}>
                      <FormLabel className="flex items-center gap-2">
                        <User className="w-4 h-4 text-green-500" />
                        اسم الجهة
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-white border-green-200 focus:border-green-400"
                          disabled={relatedType === "customer" || relatedType === "supplier"}
                        />
                      </FormControl>
                      <FormDescription>اسم الشخص أو الجهة المستلم منها</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* المبلغ وطريقة الدفع */}
            <div className="space-y-4 p-5 border-2 border-purple-200 rounded-lg bg-gradient-to-br from-purple-50/50 to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-purple-600" />
                </div>
                <h3 className="font-semibold text-purple-900">المبلغ وطريقة الدفع</h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <Banknote className="w-4 h-4 text-purple-500" />
                        المبلغ المستلم
                      </FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          {...field} 
                          className="bg-white border-purple-200 focus:border-purple-400 text-lg font-bold"
                        />
                      </FormControl>
                      <FormDescription>
                        {amount && !isNaN(parseFloat(amount)) && (
                          <span className="text-purple-600 font-semibold">
                            {numberToArabicWords(Math.floor(parseFloat(amount)))} جنيه
                          </span>
                        )}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-purple-500" />
                        طريقة الدفع
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="cash">💵 نقداً</SelectItem>
                          <SelectItem value="bank_transfer">🏦 تحويل بنكي</SelectItem>
                          <SelectItem value="check">📝 شيك</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>اختر طريقة الدفع</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {paymentMethod === "check" && (
                  <>
                    <FormField
                      control={form.control}
                      name="checkNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Hash className="w-4 h-4 text-purple-500" />
                            رقم الشيك
                          </FormLabel>
                          <FormControl>
                            <Input {...field} className="bg-white border-purple-200 focus:border-purple-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="checkDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            تاريخ الشيك
                          </FormLabel>
                          <FormControl>
                            <Input type="date" {...field} className="bg-white border-purple-200 focus:border-purple-400" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {paymentMethod === "bank_transfer" && (
                  <FormField
                    control={form.control}
                    name="bankName"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-purple-500" />
                          اسم البنك
                        </FormLabel>
                        <FormControl>
                          <Input {...field} className="bg-white border-purple-200 focus:border-purple-400" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            {/* البيان والملاحظات */}
            <div className="space-y-4 p-5 border-2 border-amber-200 rounded-lg bg-gradient-to-br from-amber-50/50 to-transparent">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-amber-600" />
                </div>
                <h3 className="font-semibold text-amber-900">البيان والملاحظات</h3>
              </div>

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>البيان</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={3}
                        className="bg-white border-amber-200 focus:border-amber-400 resize-none"
                        placeholder="وصف تفصيلي لسبب القبض..."
                      />
                    </FormControl>
                    <FormDescription>اكتب البيان بشكل واضح ودقيق</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ملاحظات إضافية (اختياري)</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={2}
                        className="bg-white border-amber-200 focus:border-amber-400 resize-none"
                        placeholder="أي ملاحظات أو تفاصيل إضافية..."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* الأزرار */}
            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                disabled={createVoucher.isPending || !form.formState.isValid}
                className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white"
              >
                {createVoucher.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    حفظ السند
                  </>
                )}
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={handlePrint}
                disabled={!form.formState.isValid}
                className="border-2 border-blue-300 text-blue-700 hover:bg-blue-50"
              >
                <Printer className="mr-2 h-4 w-4" />
                معاينة وطباعة
              </Button>

              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (form.formState.isDirty) {
                    if (confirm("هل تريد إلغاء التغييرات؟")) {
                      form.reset();
                      setOpen(false);
                    }
                  } else {
                    setOpen(false);
                  }
                }}
                className="border-2 border-gray-300"
              >
                <X className="mr-2 h-4 w-4" />
                إلغاء
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
