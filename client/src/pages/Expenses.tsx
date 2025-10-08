import { ExpenseCard } from "@/components/ExpenseCard";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, DollarSign, TrendingUp, TrendingDown } from "lucide-react";

export default function Expenses() {
  const mockExpenses = [
    { date: "18/6/2025", category: "أعلاف", amount: 12500, description: "علف تسمين مركز - 500 كجم", categoryColor: "feed" as const },
    { date: "15/6/2025", category: "علاجات", amount: 3200, description: "تطعيمات وأدوية بيطرية", categoryColor: "treatment" as const },
    { date: "10/6/2025", category: "عمالة", amount: 8000, description: "رواتب شهر يونيو", categoryColor: "labor" as const },
    { date: "8/6/2025", category: "مرافق", amount: 1500, description: "فاتورة كهرباء ومياه", categoryColor: "utilities" as const },
    { date: "5/6/2025", category: "أعلاف", amount: 11800, description: "برسيم وتبن - 300 كجم", categoryColor: "feed" as const },
  ];

  const totalExpenses = mockExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">المصروفات المالية</h1>
          <p className="text-muted-foreground">تتبع جميع المصروفات والنفقات</p>
        </div>
        <Button size="lg" data-testid="button-add-expense">
          <Plus className="w-5 h-5 ml-2" />
          إضافة مصروف جديد
        </Button>
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
              <p className="text-xl font-bold">الأعلاف</p>
              <p className="text-sm text-muted-foreground">24,300 ج</p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">مقارنة بالشهر الماضي</p>
              <p className="text-xl font-bold text-destructive">+12%</p>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-4">
        {mockExpenses.map((expense, index) => (
          <ExpenseCard key={index} {...expense} />
        ))}
      </div>
    </div>
  );
}
