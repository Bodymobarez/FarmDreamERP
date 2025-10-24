import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
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
  Hash,
  Printer,
  Plus,
  ArrowUpRight,
  ArrowDownRight
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

  const { data: vouchers = [], isLoading } = useQuery<Voucher[]>({
    queryKey: ["/api/vouchers"],
  });

  // التصفية
  const filteredVouchers = vouchers.filter((voucher) => {
    const matchesSearch = 
      voucher.voucherNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.relatedName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      voucher.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = voucherTypeFilter === "all" || voucher.voucherType === voucherTypeFilter;
    const matchesPayment = paymentMethodFilter === "all" || voucher.paymentMethod === paymentMethodFilter;
    
    return matchesSearch && matchesType && matchesPayment;
  });

  // الإحصائيات
  const totalReceiptsAmount = vouchers
    .filter(v => v.voucherType === "receipt")
    .reduce((sum, v) => sum + parseFloat(v.amount), 0);
  const totalPaymentsAmount = vouchers
    .filter(v => v.voucherType === "payment")
    .reduce((sum, v) => sum + parseFloat(v.amount), 0);

  const stats = {
    totalReceipts: vouchers.filter(v => v.voucherType === "receipt").length,
    totalPayments: vouchers.filter(v => v.voucherType === "payment").length,
    totalReceiptsAmount: totalReceiptsAmount,
    totalPaymentsAmount: totalPaymentsAmount,
    netBalance: totalReceiptsAmount - totalPaymentsAmount,
  };

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
    const color = isReceipt ? "#3b82f6" : "#ef4444";
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
          @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap');
          
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Cairo', 'Arial', sans-serif;
            padding: 60px;
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            color: #1a1a1a;
          }
          .voucher {
            max-width: 900px;
            margin: 0 auto;
            background: white;
            border: 4px solid ${color};
            border-radius: 20px;
            overflow: hidden;
            box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25);
          }
          .header {
            background: linear-gradient(135deg, ${color} 0%, ${color}ee 100%);
            color: white;
            padding: 40px;
            text-align: center;
            position: relative;
          }
          .header::before {
            content: '${emoji}';
            position: absolute;
            top: 20px;
            left: 40px;
            font-size: 60px;
            opacity: 0.2;
          }
          .header h1 {
            font-size: 42px;
            font-weight: 900;
            margin-bottom: 12px;
            text-shadow: 2px 2px 8px rgba(0,0,0,0.3);
            letter-spacing: 1px;
          }
          .header .subtitle {
            font-size: 18px;
            opacity: 0.95;
            font-weight: 600;
          }
          .content {
            padding: 50px;
            background: white;
          }
          .voucher-number-section {
            background: ${bgColor};
            padding: 25px;
            border-radius: 15px;
            margin-bottom: 35px;
            border: 3px dashed ${color};
            text-align: center;
          }
          .voucher-number {
            font-size: 32px;
            font-weight: 900;
            color: ${color};
            letter-spacing: 2px;
          }
          .voucher-info {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 25px;
            margin-bottom: 35px;
            padding: 30px;
            background: linear-gradient(135deg, ${bgColor} 0%, white 100%);
            border-radius: 15px;
            border: 2px solid ${color}33;
          }
          .info-item {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px;
            background: white;
            border-radius: 10px;
            border: 1px solid ${color}22;
          }
          .info-label {
            font-weight: 700;
            color: ${color};
            font-size: 16px;
            min-width: 140px;
          }
          .info-value {
            color: #1e293b;
            font-size: 18px;
            font-weight: 600;
          }
          .amount-section {
            background: linear-gradient(135deg, ${color}11 0%, ${bgColor} 100%);
            padding: 40px;
            border-radius: 20px;
            margin: 40px 0;
            border: 3px solid ${color};
            box-shadow: 0 10px 30px -10px ${color}44;
          }
          .amount-box {
            text-align: center;
            margin-bottom: 25px;
          }
          .amount-label {
            font-size: 20px;
            color: ${color};
            font-weight: 700;
            margin-bottom: 15px;
            text-transform: uppercase;
            letter-spacing: 1px;
          }
          .amount-value {
            font-size: 56px;
            color: ${color};
            font-weight: 900;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.1);
            line-height: 1.2;
          }
          .amount-words {
            font-size: 20px;
            color: #475569;
            text-align: center;
            padding: 20px 30px;
            background: white;
            border-radius: 12px;
            border: 2px solid ${color}44;
            font-weight: 600;
          }
          .description-box {
            margin: 35px 0;
            padding: 30px;
            background: linear-gradient(to right, ${bgColor}, white);
            border-radius: 15px;
            border-right: 6px solid ${color};
            box-shadow: 0 4px 15px rgba(0,0,0,0.05);
          }
          .description-label {
            font-weight: 700;
            color: ${color};
            margin-bottom: 15px;
            font-size: 20px;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          .description-text {
            color: #1e293b;
            line-height: 2;
            font-size: 18px;
            font-weight: 500;
          }
          .signature-section {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            gap: 40px;
            margin-top: 80px;
            padding-top: 40px;
            border-top: 3px solid #cbd5e1;
          }
          .signature-box {
            text-align: center;
          }
          .signature-label {
            font-weight: 700;
            color: #475569;
            margin-bottom: 60px;
            font-size: 18px;
          }
          .signature-line {
            border-top: 3px solid ${color};
            padding-top: 15px;
            color: #64748b;
            font-size: 16px;
            font-weight: 600;
          }
          .footer {
            background: linear-gradient(135deg, ${bgColor} 0%, ${color}22 100%);
            padding: 30px;
            text-align: center;
            border-top: 3px solid ${color}66;
            color: ${color};
            font-size: 16px;
            font-weight: 600;
          }
          .watermark {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(-45deg);
            font-size: 120px;
            color: ${color}08;
            font-weight: 900;
            pointer-events: none;
            z-index: 0;
          }
          .content { position: relative; z-index: 1; }
          @media print {
            body { padding: 20px; background: white; }
            .voucher { border: 3px solid ${color}; box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="voucher">
          <div class="header">
            <h1>${emoji} ${title}</h1>
            <div class="subtitle">FarmDream ERP System</div>
          </div>
          
          <div class="content">
            <div class="watermark">${emoji}</div>
            
            <div class="voucher-number-section">
              <div class="voucher-number">${voucher.voucherNumber}</div>
            </div>
            
            <div class="voucher-info">
              <div class="info-item">
                <span class="info-label">📅 التاريخ:</span>
                <span class="info-value">${new Date(voucher.voucherDate).toLocaleDateString('ar-EG')}</span>
              </div>
              <div class="info-item">
                <span class="info-label">${isReceipt ? '👤 استلمنا من:' : '👤 صُرف إلى:'}</span>
                <span class="info-value">${voucher.relatedName}</span>
              </div>
              <div class="info-item">
                <span class="info-label">💳 طريقة الدفع:</span>
                <span class="info-value">${getPaymentMethodLabel(voucher.paymentMethod)}</span>
              </div>
              <div class="info-item">
                <span class="info-label">📊 الحالة:</span>
                <span class="info-value">${voucher.status === 'approved' ? '✅ معتمد' : '⏳ قيد المراجعة'}</span>
              </div>
              ${voucher.checkNumber ? `
                <div class="info-item">
                  <span class="info-label">📝 رقم الشيك:</span>
                  <span class="info-value">${voucher.checkNumber}</span>
                </div>
              ` : ''}
              ${voucher.bankName ? `
                <div class="info-item">
                  <span class="info-label">🏦 اسم البنك:</span>
                  <span class="info-value">${voucher.bankName}</span>
                </div>
              ` : ''}
            </div>

            <div class="amount-section">
              <div class="amount-box">
                <div class="amount-label">${isReceipt ? '💰 المبلغ المستلم' : '💸 المبلغ المدفوع'}</div>
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
              <div class="description-box" style="border-right-color: #f59e0b; background: linear-gradient(to right, #fef3c7, white);">
                <div class="description-label" style="color: #f59e0b;">📝 ملاحظات إضافية</div>
                <div class="description-text">${voucher.notes}</div>
              </div>
            ` : ''}

            <div class="signature-section">
              <div class="signature-box">
                <div class="signature-label">👤 المستلم</div>
                <div class="signature-line">التوقيع</div>
              </div>
              <div class="signature-box">
                <div class="signature-label">💼 المحاسب</div>
                <div class="signature-line">التوقيع</div>
              </div>
              <div class="signature-box">
                <div class="signature-label">🎯 المدير المالي</div>
                <div class="signature-line">التوقيع والختم</div>
              </div>
            </div>
          </div>

          <div class="footer">
            🌱 تم الإنشاء بواسطة نظام FarmDream ERP - ${new Date().toLocaleString('ar-EG')}
          </div>
        </div>

        <script>
          window.onload = function() {
            setTimeout(() => window.print(), 500);
          };
        </script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-lime-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-lime-500 to-lime-600 flex items-center justify-center shadow-xl shadow-lime-500/30">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">سندات القبض والصرف</h1>
                <p className="text-gray-600 mt-1">إدارة السندات النقدية</p>
              </div>
            </div>
            
            <div className="flex gap-3 w-full sm:w-auto">
              <ReceiptVoucherDialog />
              <PaymentVoucherDialog />
            </div>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <Card className="border-2 border-blue-200 bg-white hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-3 shadow-lg">
                  <Receipt className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">سندات القبض</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalReceipts}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-red-200 bg-white hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center mb-3 shadow-lg">
                  <TrendingDown className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">سندات الصرف</p>
                <p className="text-3xl font-bold text-red-600">{stats.totalPayments}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-emerald-200 bg-white hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center mb-3 shadow-lg">
                  <ArrowUpRight className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي القبض</p>
                <p className="text-2xl font-bold text-emerald-600">{stats.totalReceiptsAmount.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-orange-200 bg-white hover:shadow-2xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-3 shadow-lg">
                  <ArrowDownRight className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">إجمالي الصرف</p>
                <p className="text-2xl font-bold text-orange-600">{stats.totalPaymentsAmount.toFixed(0)}</p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>

          <Card className={`border-2 ${stats.netBalance >= 0 ? 'border-green-200' : 'border-red-200'} bg-white hover:shadow-2xl transition-all duration-300`}>
            <CardContent className="p-6">
              <div className="flex flex-col items-center text-center">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${stats.netBalance >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} flex items-center justify-center mb-3 shadow-lg`}>
                  <DollarSign className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-gray-600 mb-1">الصافي</p>
                <p className={`text-2xl font-bold ${stats.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.netBalance.toFixed(0)}
                </p>
                <p className="text-xs text-gray-500">ج.م</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters & Search */}
        <Card className="border-2 border-purple-200 bg-white shadow-lg">
          <CardContent className="p-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative md:col-span-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="بحث برقم السند أو الجهة..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-10 h-12 text-base border-2 border-purple-200 focus:border-purple-500 rounded-xl"
                />
              </div>

              {/* Type Filter */}
              <Select value={voucherTypeFilter} onValueChange={setVoucherTypeFilter}>
                <SelectTrigger className="h-12 text-base border-2 border-purple-200 rounded-xl">
                  <Filter className="w-4 h-4 ml-2" />
                  <SelectValue placeholder="نوع السند" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-base py-3">جميع الأنواع</SelectItem>
                  <SelectItem value="receipt" className="text-base py-3">🧾 سندات قبض</SelectItem>
                  <SelectItem value="payment" className="text-base py-3">💸 سندات صرف</SelectItem>
                </SelectContent>
              </Select>

              {/* Payment Method Filter */}
              <Select value={paymentMethodFilter} onValueChange={setPaymentMethodFilter}>
                <SelectTrigger className="h-12 text-base border-2 border-purple-200 rounded-xl">
                  <DollarSign className="w-4 h-4 ml-2" />
                  <SelectValue placeholder="طريقة الدفع" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all" className="text-base py-3">جميع الطرق</SelectItem>
                  <SelectItem value="cash" className="text-base py-3">💵 نقداً</SelectItem>
                  <SelectItem value="bank_transfer" className="text-base py-3">🏦 تحويل بنكي</SelectItem>
                  <SelectItem value="check" className="text-base py-3">📝 شيك</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Vouchers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredVouchers.length === 0 ? (
            <div className="col-span-full">
              <Card className="border-2 border-gray-200 bg-white">
                <CardContent className="p-12 text-center">
                  <FileText className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-600 text-lg">لا توجد سندات</p>
                  <p className="text-gray-400 text-sm mt-2">ابدأ بإضافة سند قبض أو صرف</p>
                </CardContent>
              </Card>
            </div>
          ) : (
            filteredVouchers.map((voucher) => {
              const isReceipt = voucher.voucherType === "receipt";
              const borderColor = isReceipt ? "border-blue-200" : "border-red-200";
              const hoverBorder = isReceipt ? "hover:border-blue-400" : "hover:border-red-400";
              const bgGradient = isReceipt ? "from-blue-50/50" : "from-red-50/50";
              const iconBg = isReceipt ? "from-blue-500 to-blue-600" : "from-red-500 to-red-600";
              const textColor = isReceipt ? "text-blue-600" : "text-red-600";

              return (
                <Card
                  key={voucher.id}
                  className={`border-2 ${borderColor} ${hoverBorder} bg-gradient-to-br ${bgGradient} to-white hover:shadow-2xl transition-all duration-300`}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-5">
                      <div className="flex items-start gap-4">
                        <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${iconBg} flex items-center justify-center shadow-lg`}>
                          {isReceipt ? (
                            <Receipt className="w-7 h-7 text-white" />
                          ) : (
                            <TrendingDown className="w-7 h-7 text-white" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <span className={`text-xl font-bold ${textColor}`}>
                              {voucher.voucherNumber}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            {new Date(voucher.voucherDate).toLocaleDateString('ar-EG')}
                          </div>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePrintVoucher(voucher)}
                        className={`border-2 ${borderColor} ${textColor} hover:bg-gray-50 h-10 px-4 shadow-md`}
                      >
                        <Printer className="w-4 h-4 ml-1" />
                        طباعة
                      </Button>
                    </div>

                    {/* Amount - Big and Bold */}
                    <div className={`p-5 rounded-xl bg-gradient-to-r ${bgGradient} to-white border-2 ${borderColor} mb-4 shadow-lg`}>
                      <div className="text-center">
                        <p className="text-sm text-gray-600 mb-2">{isReceipt ? 'المبلغ المستلم' : 'المبلغ المدفوع'}</p>
                        <p className={`text-4xl font-black ${textColor}`}>
                          {parseFloat(voucher.amount).toLocaleString('ar-EG')} <span className="text-2xl">ج.م</span>
                        </p>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm bg-white rounded-lg p-3 border border-gray-200">
                        <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">{isReceipt ? 'من:' : 'إلى:'}</span>
                        <span className="font-semibold text-gray-900">{voucher.relatedName}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm bg-white rounded-lg p-3 border border-gray-200">
                        <DollarSign className="w-4 h-4 text-gray-400 flex-shrink-0" />
                        <span className="text-gray-600">طريقة الدفع:</span>
                        <span className="font-medium text-gray-900">{getPaymentMethodLabel(voucher.paymentMethod)}</span>
                      </div>

                      <div className="bg-white rounded-lg p-3 border border-gray-200">
                        <div className="flex items-start gap-2 text-sm">
                          <FileText className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">البيان:</span>
                          <span className="text-gray-900 flex-1">{voucher.description}</span>
                        </div>
                      </div>

                      {voucher.notes && (
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-3">
                          <div className="flex items-start gap-2 text-sm">
                            <span className="text-amber-600 text-lg">📝</span>
                            <span className="text-amber-900">{voucher.notes}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
