import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import {
  Receipt,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  Wallet,
  CreditCard,
  Banknote,
  Calendar,
  FileText,
  Save,
  X,
  AlertCircle,
  Info,
  DollarSign,
  Users,
  Truck,
  Building2,
} from "lucide-react";

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionDialog({
  open,
  onOpenChange,
}: AddTransactionDialogProps) {
  const [formData, setFormData] = useState({
    type: "",
    entityType: "",
    entityId: "",
    amount: "",
    paymentMethod: "",
    date: new Date().toISOString().split("T")[0],
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Transaction data:", formData);
    // TODO: Connect to API
    onOpenChange(false);
    // Reset form
    setFormData({
      type: "",
      entityType: "",
      entityId: "",
      amount: "",
      paymentMethod: "",
      date: new Date().toISOString().split("T")[0],
      notes: "",
    });
  };

  const getTransactionIcon = () => {
    switch (formData.type) {
      case "purchase":
        return ShoppingCart;
      case "sale":
        return TrendingUp;
      case "payment":
        return TrendingDown;
      case "receipt":
        return Receipt;
      default:
        return Wallet;
    }
  };

  const getTransactionColor = () => {
    switch (formData.type) {
      case "purchase":
        return "from-red-500/20 to-red-600/10";
      case "sale":
        return "from-green-500/20 to-green-600/10";
      case "payment":
        return "from-orange-500/20 to-orange-600/10";
      case "receipt":
        return "from-blue-500/20 to-blue-600/10";
      default:
        return "from-primary/20 to-primary/10";
    }
  };

  const getTransactionTextColor = () => {
    switch (formData.type) {
      case "purchase":
        return "text-red-600";
      case "sale":
        return "text-green-600";
      case "payment":
        return "text-orange-600";
      case "receipt":
        return "text-blue-600";
      default:
        return "text-primary";
    }
  };

  const getTransactionLabel = () => {
    switch (formData.type) {
      case "purchase":
        return "مشتريات";
      case "sale":
        return "مبيعات";
      case "payment":
        return "مدفوعات";
      case "receipt":
        return "مقبوضات";
      default:
        return "معاملة مالية";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className={`p-2 bg-gradient-to-br ${getTransactionColor()} rounded-lg`}>
              {(() => {
                const Icon = getTransactionIcon();
                return <Icon className={`w-6 h-6 ${getTransactionTextColor()}`} />;
              })()}
            </div>
            <div>
              <DialogTitle className="text-2xl font-bold">
                إضافة {formData.type ? getTransactionLabel() : "معاملة مالية جديدة"}
              </DialogTitle>
              <DialogDescription>
                {formData.type 
                  ? `سجل معاملة ${getTransactionLabel()} جديدة` 
                  : "اختر نوع المعاملة لبدء التسجيل"}
              </DialogDescription>
            </div>
          </div>

          <Alert className="mt-4 bg-blue-50 border-blue-200">
            <Info className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              جميع الحقول مطلوبة ماعدا الملاحظات
            </AlertDescription>
          </Alert>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* القسم الأول: نوع المعاملة والجهة */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wallet className="w-5 h-5 text-purple-600" />
                نوع المعاملة والجهة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Transaction Type */}
                <div className="space-y-2">
                  <Label htmlFor="type" className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-purple-600" />
                    نوع المعاملة <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value) =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="bg-white border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                      <SelectValue placeholder="اختر نوع المعاملة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="purchase">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="w-4 h-4 text-red-600" />
                          <span>مشتريات</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="sale">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-green-600" />
                          <span>مبيعات</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="payment">
                        <div className="flex items-center gap-2">
                          <TrendingDown className="w-4 h-4 text-orange-600" />
                          <span>مدفوعات</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="receipt">
                        <div className="flex items-center gap-2">
                          <Receipt className="w-4 h-4 text-blue-600" />
                          <span>مقبوضات</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Entity Type */}
                <div className="space-y-2">
                  <Label htmlFor="entityType" className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-600" />
                    نوع الجهة <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.entityType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, entityType: value })
                    }
                    disabled={!formData.type}
                  >
                    <SelectTrigger className="bg-white border-indigo-200 focus:border-indigo-400 focus:ring-indigo-400">
                      <SelectValue placeholder="اختر نوع الجهة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="supplier">
                        <div className="flex items-center gap-2">
                          <Truck className="w-4 h-4 text-orange-600" />
                          <span>مورد</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="customer">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600" />
                          <span>عميل</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Entity Selection */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="entityId" className="flex items-center gap-2">
                    {formData.entityType === "supplier" ? (
                      <Truck className="w-4 h-4 text-orange-600" />
                    ) : (
                      <Users className="w-4 h-4 text-blue-600" />
                    )}
                    {formData.entityType === "supplier" ? "المورد" : "العميل"} <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.entityId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, entityId: value })
                    }
                    disabled={!formData.entityType}
                  >
                    <SelectTrigger className="bg-white border-gray-200 focus:border-primary focus:ring-primary">
                      <SelectValue
                        placeholder={
                          formData.entityType === "supplier"
                            ? "اختر المورد"
                            : "اختر العميل"
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {/* TODO: Load from API based on entityType */}
                      <SelectItem value="1">
                        {formData.entityType === "supplier"
                          ? "مورد الأعلاف الذهبية"
                          : "عميل المزرعة الكبرى"}
                      </SelectItem>
                      <SelectItem value="2">
                        {formData.entityType === "supplier"
                          ? "مورد الأدوية البيطرية"
                          : "مزرعة النور"}
                      </SelectItem>
                      <SelectItem value="3">
                        {formData.entityType === "supplier"
                          ? "مورد المعدات الزراعية"
                          : "مزرعة الخير"}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* القسم الثاني: المبلغ وطريقة الدفع */}
          <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-600" />
                المبلغ وطريقة الدفع
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Amount */}
                <div className="space-y-2">
                  <Label htmlFor="amount" className="flex items-center gap-2 text-lg">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    المبلغ (جنيه مصري) <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    className="text-lg font-bold bg-white border-green-200 focus:border-green-400 focus:ring-green-400"
                    required
                  />
                  <p className="text-xs text-gray-500 flex items-center gap-1">
                    <Info className="w-3 h-3" />
                    أدخل المبلغ الإجمالي للمعاملة
                  </p>
                </div>

                {/* Payment Method */}
                <div className="space-y-2">
                  <Label htmlFor="paymentMethod" className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-600" />
                    طريقة الدفع <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) =>
                      setFormData({ ...formData, paymentMethod: value })
                    }
                  >
                    <SelectTrigger className="bg-white border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                      <SelectValue placeholder="اختر طريقة الدفع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">
                        <div className="flex items-center gap-2">
                          <Banknote className="w-4 h-4 text-green-600" />
                          <span>نقدي</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="bank_transfer">
                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-blue-600" />
                          <span>تحويل بنكي</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="check">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-600" />
                          <span>شيك</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="installment">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-4 h-4 text-orange-600" />
                          <span>تقسيط</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Date */}
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="date" className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    تاريخ المعاملة <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) =>
                      setFormData({ ...formData, date: e.target.value })
                    }
                    className="bg-white border-amber-200 focus:border-amber-400 focus:ring-amber-400"
                    required
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* القسم الثالث: الملاحظات */}
          <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/30 to-transparent shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-600" />
                الملاحظات والتفاصيل
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="notes" className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-amber-600" />
                  ملاحظات
                </Label>
                <Textarea
                  id="notes"
                  placeholder="أدخل أي ملاحظات أو تفاصيل إضافية عن المعاملة..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="resize-none bg-white border-amber-200 focus:border-amber-400 focus:ring-amber-400 min-h-[100px]"
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>

          <Separator className="my-6" />

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 pt-2 pb-1 px-1 bg-gradient-to-r from-gray-50 to-transparent rounded-lg">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <AlertCircle className="w-4 h-4" />
              <span>جميع الحقول مطلوبة ماعدا الملاحظات</span>
            </div>

            <div className="flex gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  if (formData.amount || formData.notes) {
                    if (confirm('هل تريد الإلغاء؟ سيتم فقدان التغييرات غير المحفوظة.')) {
                      onOpenChange(false);
                    }
                  } else {
                    onOpenChange(false);
                  }
                }}
                className="gap-2"
              >
                <X className="w-4 h-4" />
                إلغاء
              </Button>
              <Button
                type="submit"
                disabled={!formData.type || !formData.entityType || !formData.entityId || !formData.amount || !formData.paymentMethod}
                className={`gap-2 shadow-lg hover:shadow-xl transition-all ${
                  formData.type === "purchase"
                    ? "bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600"
                    : formData.type === "sale"
                    ? "bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
                    : formData.type === "payment"
                    ? "bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600"
                    : formData.type === "receipt"
                    ? "bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
                    : "bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                }`}
              >
                <Save className="w-4 h-4" />
                حفظ المعاملة
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
