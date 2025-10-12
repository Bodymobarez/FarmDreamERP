import { ExpenseCard } from "@/components/ExpenseCard";
import { Card } from "@/components/ui/card";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { useQuery } from "@tanstack/react-query";

export default function Expenses() {
  // Fetch real data from vouchers API
  const { data: vouchers = [] } = useQuery<any[]>({
    queryKey: ["/api/vouchers"],
  });

  // Convert vouchers to expenses format
  const expenses = vouchers.filter(v => v.voucherType === 'payment').map(voucher => ({
    date: new Date(voucher.voucherDate).toLocaleDateString('ar-EG'),
    category: voucher.relatedType === 'supplier' ? '🌾 أعلاف' : '💊 مصروفات أخرى',
    amount: parseFloat(voucher.amount || '0'),
    description: voucher.description,
    expenseType: voucher.relatedType === 'supplier' ? 'feed' as const : 'other' as const,
    paymentMethod: voucher.paymentMethod,
    notes: voucher.notes
  }));

  // Add inventory transaction expenses  
  const { data: inventoryTransactions = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory-transactions"],
  });

  const inventoryExpenses = inventoryTransactions
    .filter(trans => trans.transactionType === 'out')
    .map(trans => ({
      date: new Date(trans.transactionDate).toLocaleDateString('ar-EG'),
      category: '🌾 صرف مخزون',
      amount: parseFloat(trans.totalCost || '0'),
      description: trans.description,
      expenseType: 'inventory' as const,
      paymentMethod: 'internal' as const,
      notes: trans.notes
    }));

  const allExpenses = [...expenses, ...inventoryExpenses].sort((a, b) => 
    new Date(b.date.split('/').reverse().join('-')).getTime() - 
    new Date(a.date.split('/').reverse().join('-')).getTime()
  );

  // تم إزالة جميع البيانات التجريبية

  // استخدام البيانات الحقيقية فقط
  const combinedExpenses = allExpenses;
  
  const totalExpenses = combinedExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  
  // Calculate expenses by type
  const expensesByType = combinedExpenses.reduce((acc, exp) => {
    const type = exp.expenseType;
    acc[type] = (acc[type] || 0) + exp.amount;
    return acc;
  }, {} as Record<string, number>);

  const topExpenseType = Object.entries(expensesByType)
    .sort(([, a], [, b]) => b - a)[0] || ["feed", 0];

  const typeNames: Record<string, string> = {
    feed: "الأعلاف",
    salary: "المرتبات",
    medicine: "الأدوية",
    utilities: "المرافق",
    maintenance: "الصيانة",
    transport: "النقل",
    rent: "الإيجار",
    cleaning: "التنظيف"
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">المصروفات المالية</h1>
          <p className="text-muted-foreground">تتبع جميع المصروفات والنفقات</p>
        </div>
        <AddExpenseDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-chart-4/10 text-chart-4 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي المصروفات</p>
              <p className="text-2xl font-bold">{totalExpenses.toLocaleString()} ج</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-chart-1/10 text-chart-1 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">أعلى فئة</p>
              <p className="text-xl font-bold">{topExpenseType ? typeNames[topExpenseType[0]] || "غير محدد" : "لا يوجد"}</p>
              <p className="text-sm text-muted-foreground">{topExpenseType ? topExpenseType[1].toLocaleString() : "0"} ج</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">عدد المصروفات</p>
              <p className="text-xl font-bold">{combinedExpenses.length}</p>
              <p className="text-sm text-green-600">مجموع العناصر</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {combinedExpenses.map((expense, index) => (
          <ExpenseCard key={index} {...expense} />
        ))}
      </div>
    </div>
  );
}
