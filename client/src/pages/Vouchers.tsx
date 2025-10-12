import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Receipt, 
  TrendingDown, 
  Search, 
  Calendar,
  Filter,
  Download,
  FileText,
  DollarSign,
  User,
  Building2,
  Hash,
  Eye,
  Printer
} from "lucide-react";
import { ReceiptVoucherDialog } from "@/components/ReceiptVoucherDialog";
import { PaymentVoucherDialog } from "@/components/PaymentVoucherDialog";

interface Voucher {
  id: string;
  voucherNumber: string;
  voucherDate: string;
  voucherType: "receipt" | "payment";
  relatedName: string;
  amount: string;
  amountInWords: string;
  paymentMethod: "cash" | "bank_transfer" | "check";
  checkNumber?: string;
  bankName?: string;
  description: string;
  notes?: string;
  status: string;
  createdAt: string;
}

export default function Vouchers() {
  const [searchQuery, setSearchQuery] = useState("");
  const [voucherTypeFilter, setVoucherTypeFilter] = useState<string>("all");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState<string>("all");

  const { data: vouchers = [] } = useQuery<Voucher[]>({
    queryKey: ["/api/vouchers"],
  });

  // التصفية
  const filteredReceipts = vouchers
    .filter(v => v.voucherType === "receipt")
    .filter((voucher) => {
      const matchesSearch = 
        voucher.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.relatedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPayment = paymentMethodFilter === "all" || voucher.paymentMethod === paymentMethodFilter;
      
      return matchesSearch && matchesPayment;
    });

  const filteredPayments = vouchers
    .filter(v => v.voucherType === "payment")
    .filter((voucher) => {
      const matchesSearch = 
        voucher.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.relatedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        voucher.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesPayment = paymentMethodFilter === "all" || voucher.paymentMethod === paymentMethodFilter;
      
      return matchesSearch && matchesPayment;
    });

  // الإحصائيات
  const totalReceipts = vouchers.filter(v => v.voucherType === "receipt").length;
  const totalPayments = vouchers.filter(v => v.voucherType === "payment").length;
  const totalReceiptsAmount = vouchers
    .filter(v => v.voucherType === "receipt")
    .reduce((sum, v) => sum + parseFloat(v.amount), 0);
  const totalPaymentsAmount = vouchers
    .filter(v => v.voucherType === "payment")
    .reduce((sum, v) => sum + parseFloat(v.amount), 0);

  const getPaymentMethodLabel = (method: string) => {
    switch(method) {
      case "cash": return "💵 نقداً";
      case "bank_transfer": return "🏦 تحويل بنكي";
      case "check": return "📝 شيك";
      default: return method;
    }
  };

  const handlePrintVoucher = (voucher: Voucher) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const isReceipt = voucher.voucherType === "receipt";
    const color = isReceipt ? "#1e40af" : "#dc2626";
    const bgColor = isReceipt ? "#dbeafe" : "#fee2e2";
    const title = isReceipt ? "سند قبض نقدية" : "سند صرف نقدية";
    const emoji = isReceipt ? "🧾" : "💸";

    printWindow.document.write(`
      <!DOCTYPE html>
      <html dir="rtl">
      <head>
        <meta charset="UTF-8">
        <title>${title} - ${voucher.voucherNumber}</title>
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
            border: 3px solid ${color};
            border-radius: 12px;
            overflow: hidden;
          }
          .header {
            background: linear-gradient(135deg, ${color} 0%, ${color}dd 100%);
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
            background: ${bgColor};
            border-radius: 8px;
            border: 2px dashed ${color}66;
          }
          .info-item {
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .info-label {
            font-weight: bold;
            color: ${color};
            min-width: 120px;
          }
          .info-value {
            color: #1e293b;
            font-size: 16px;
          }
          .amount-section {
            background: ${bgColor};
            padding: 25px;
            border-radius: 10px;
            margin: 30px 0;
            border: 2px solid ${color}66;
          }
          .amount-box {
            text-align: center;
            margin-bottom: 15px;
          }
          .amount-label {
            font-size: 16px;
            color: ${color};
            font-weight: bold;
            margin-bottom: 8px;
          }
          .amount-value {
            font-size: 36px;
            color: ${color};
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
            border-right: 4px solid ${color};
          }
          .description-label {
            font-weight: bold;
            color: ${color};
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
            border-top: 2px solid ${color};
            padding-top: 10px;
            color: #64748b;
            font-size: 13px;
          }
          .footer {
            background: ${bgColor};
            padding: 20px;
            text-align: center;
            border-top: 2px solid ${color}33;
            color: ${color};
            font-size: 13px;
          }
          @media print {
            body { padding: 20px; }
            .voucher { border: 2px solid ${color}; }
          }
        </style>
      </head>
      <body>
        <div class="voucher">
          <div class="header">
            <h1>${emoji} ${title}</h1>
          </div>
          
          <div class="content">
            <div class="voucher-info">
              <div class="info-item">
                <span class="info-label">رقم السند:</span>
                <span class="info-value">${voucher.voucherNumber}</span>
              </div>
              <div class="info-item">
                <span class="info-label">التاريخ:</span>
                <span class="info-value">${new Date(voucher.voucherDate).toLocaleDateString('ar-EG')}</span>
              </div>
              <div class="info-item">
                <span class="info-label">${isReceipt ? 'استلمنا من:' : 'صُرف إلى:'}</span>
                <span class="info-value">${voucher.relatedName}</span>
              </div>
              <div class="info-item">
                <span class="info-label">طريقة الدفع:</span>
                <span class="info-value">${getPaymentMethodLabel(voucher.paymentMethod)}</span>
              </div>
              ${voucher.checkNumber ? `
                <div class="info-item">
                  <span class="info-label">رقم الشيك:</span>
                  <span class="info-value">${voucher.checkNumber}</span>
                </div>
              ` : ''}
              ${voucher.bankName ? `
                <div class="info-item">
                  <span class="info-label">اسم البنك:</span>
                  <span class="info-value">${voucher.bankName}</span>
                </div>
              ` : ''}
            </div>

            <div class="amount-section">
              <div class="amount-box">
                <div class="amount-label">${isReceipt ? 'المبلغ المستلم' : 'المبلغ المدفوع'}</div>
                <div class="amount-value">${parseFloat(voucher.amount).toLocaleString('ar-EG')} جنيه</div>
              </div>
              <div class="amount-words">
                <strong>وذلك قيمة:</strong> ${voucher.amountInWords} فقط لا غير
              </div>
            </div>

            <div class="description-box">
              <div class="description-label">📋 البيان</div>
              <div class="description-text">${voucher.description}</div>
            </div>

            ${voucher.notes ? `
              <div class="description-box" style="border-right-color: #f59e0b;">
                <div class="description-label" style="color: #f59e0b;">📝 ملاحظات</div>
                <div class="description-text">${voucher.notes}</div>
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
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <FileText className="w-7 h-7 text-white" />
            </div>
            سندات القبض والصرف
          </h1>
          <p className="text-gray-600 mt-2">إدارة سندات القبض والصرف النقدية</p>
        </div>
        <div className="flex gap-3">
          <ReceiptVoucherDialog />
          <PaymentVoucherDialog />
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">سندات القبض</p>
              <p className="text-3xl font-bold text-blue-600">{totalReceipts}</p>
            </div>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Receipt className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">سندات الصرف</p>
              <p className="text-3xl font-bold text-red-600">{totalPayments}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي القبض 💰</p>
              <p className="text-2xl font-bold text-green-600">
                {totalReceiptsAmount.toLocaleString('ar-EG')} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </Card>

        <Card className="p-5 border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">إجمالي الصرف 💸</p>
              <p className="text-2xl font-bold text-orange-600">
                {totalPaymentsAmount.toLocaleString('ar-EG')} ج
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Search Bar */}
      <Card className="p-5">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="بحث برقم السند، الجهة، أو البيان..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-10"
          />
        </div>
      </Card>

      {/* سندات القبض - Receipt Vouchers Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-r-4 border-blue-500 pr-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Receipt className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-blue-900">سندات القبض 🧾</h2>
            <p className="text-sm text-gray-600">عرض جميع سندات القبض النقدية</p>
          </div>
          <div className="mr-auto flex gap-3">
            <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 ml-2" />
                <SelectValue placeholder="طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الطرق</SelectItem>
                <SelectItem value="cash">💵 نقداً</SelectItem>
                <SelectItem value="bank_transfer">🏦 تحويل بنكي</SelectItem>
                <SelectItem value="check">📝 شيك</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mt-4">
          {filteredReceipts.map((voucher) => (
            <Card key={voucher.id} className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Receipt className="w-7 h-7 text-blue-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-lg font-bold text-blue-600">
                            {voucher.voucherNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(voucher.voucherDate).toLocaleDateString('ar-EG')}
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="text-2xl font-bold text-blue-600">
                          {parseFloat(voucher.amount).toLocaleString('ar-EG')} ج
                        </div>
                        <div className="text-xs text-gray-500">
                          {getPaymentMethodLabel(voucher.paymentMethod)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">من:</span>
                        <span className="font-semibold text-gray-900">{voucher.relatedName}</span>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">البيان:</span>
                        <span className="text-gray-900">{voucher.description}</span>
                      </div>

                      {voucher.notes && (
                        <div className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded p-2">
                          <span className="text-amber-600">📝</span>
                          <span className="text-amber-900">{voucher.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePrintVoucher(voucher)}
                  className="border-2 border-blue-200 text-blue-600 hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}

          {filteredReceipts.length === 0 && (
            <Card className="p-12 text-center border-2 border-dashed border-blue-200">
              <Receipt className="w-16 h-16 text-blue-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery || paymentMethodFilter !== "all"
                  ? "لا توجد سندات قبض تطابق معايير البحث"
                  : "لا توجد سندات قبض حتى الآن"}
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* سندات الصرف - Payment Vouchers Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3 border-r-4 border-red-500 pr-3">
          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
            <TrendingDown className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-red-900">سندات الصرف 💸</h2>
            <p className="text-sm text-gray-600">عرض جميع سندات الصرف النقدية</p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredPayments.map((voucher) => (
            <Card key={voucher.id} className="p-5 border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-14 h-14 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <TrendingDown className="w-7 h-7 text-red-600" />
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <span className="text-lg font-bold text-red-600">
                            {voucher.voucherNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {new Date(voucher.voucherDate).toLocaleDateString('ar-EG')}
                        </div>
                      </div>

                      <div className="text-left">
                        <div className="text-2xl font-bold text-red-600">
                          {parseFloat(voucher.amount).toLocaleString('ar-EG')} ج
                        </div>
                        <div className="text-xs text-gray-500">
                          {getPaymentMethodLabel(voucher.paymentMethod)}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">إلى:</span>
                        <span className="font-semibold text-gray-900">{voucher.relatedName}</span>
                      </div>

                      <div className="flex items-start gap-2 text-sm">
                        <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">البيان:</span>
                        <span className="text-gray-900">{voucher.description}</span>
                      </div>

                      {voucher.notes && (
                        <div className="flex items-start gap-2 text-sm bg-amber-50 border border-amber-200 rounded p-2">
                          <span className="text-amber-600">📝</span>
                          <span className="text-amber-900">{voucher.notes}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handlePrintVoucher(voucher)}
                  className="border-2 border-red-200 text-red-600 hover:bg-gray-50"
                >
                  <Printer className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}

          {filteredPayments.length === 0 && (
            <Card className="p-12 text-center border-2 border-dashed border-red-200">
              <TrendingDown className="w-16 h-16 text-red-200 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">
                {searchQuery || paymentMethodFilter !== "all"
                  ? "لا توجد سندات صرف تطابق معايير البحث"
                  : "لا توجد سندات صرف حتى الآن"}
              </p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
