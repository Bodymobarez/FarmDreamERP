import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  UserPlus, 
  Receipt, 
  TrendingUp, 
  TrendingDown,
  DollarSign,
  CreditCard,
  Wallet,
  FileText,
  ArrowDownCircle,
  ArrowUpCircle,
  BarChart3,
  ShoppingCart,
  ScrollText
} from "lucide-react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";

export default function Accounts() {
  // جلب البيانات الحقيقية من API
  const { data: customers = [] } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });

  const { data: suppliers = [] } = useQuery<any[]>({
    queryKey: ["/api/suppliers"],
  });

  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  const { data: vouchers = [] } = useQuery<any[]>({
    queryKey: ["/api/vouchers"],
  });

  // حساب الإحصائيات من البيانات الحقيقية
  const stats = {
    totalSuppliers: suppliers.length,
    totalCustomers: customers.length,
    suppliersBalance: suppliers.reduce((sum: number, s: any) => sum + parseFloat(s.balance || "0"), 0),
    customersBalance: customers.reduce((sum: number, c: any) => sum + parseFloat(c.balance || "0"), 0),
    todayTransactions: transactions.filter((t: any) => {
      const today = new Date().toDateString();
      const transactionDate = new Date(t.transactionDate || t.createdAt).toDateString();
      return today === transactionDate;
    }).length,
    monthlyRevenue: transactions
      .filter((t: any) => t.transactionType === "sale" || t.transactionType === "income")
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0),
    monthlyExpenses: transactions
      .filter((t: any) => t.transactionType === "purchase" || t.transactionType === "expense")
      .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0),
  };

  const accountingModules = [
    {
      title: "العملاء",
      description: "إدارة قاعدة بيانات العملاء وحساباتهم",
      icon: UserPlus,
      href: "/customers",
      color: "bg-blue-500",
      stats: `${stats.totalCustomers} عميل`
    },
    {
      title: "الموردين",
      description: "إدارة الموردين والمشتريات",
      icon: Users,
      href: "/suppliers",
      color: "bg-purple-500",
      stats: `${stats.totalSuppliers} مورد`
    },
    {
      title: "المعاملات المالية",
      description: "جميع المعاملات والحركات المالية",
      icon: Receipt,
      href: "/transactions",
      color: "bg-green-500",
      stats: `${stats.todayTransactions} معاملة اليوم`
    },
    {
      title: "المصروفات",
      description: "إدارة وتتبع جميع المصروفات",
      icon: ShoppingCart,
      href: "/expenses",
      color: "bg-orange-500",
      stats: `${stats.monthlyExpenses.toLocaleString()} ج`
    },
    {
      title: "التقارير المالية",
      description: "تقارير شاملة عن الأداء المالي",
      icon: BarChart3,
      href: "/financial-reports",
      color: "bg-cyan-500",
      stats: "تقارير متنوعة"
    },
    {
      title: "إيصال صرف",
      description: "إصدار إيصالات صرف نقدية أو شيكات",
      icon: ArrowDownCircle,
      href: "/payment-voucher",
      color: "bg-red-500",
      stats: "نقدي / شيك"
    },
    {
      title: "إيصال استلام",
      description: "إصدار إيصالات استلام نقدية أو شيكات",
      icon: ArrowUpCircle,
      href: "/receipt-voucher",
      color: "bg-emerald-500",
      stats: "نقدي / شيك"
    },
    {
      title: "سندات القيد",
      description: "القيود اليومية والحسابات العامة",
      icon: ScrollText,
      href: "/journal-entries",
      color: "bg-indigo-500",
      stats: "قيود محاسبية"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">💼 نظام الحسابات المتكامل</h1>
          <p className="text-muted-foreground mt-1">
            إدارة شاملة لجميع العمليات المحاسبية والمالية
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">العملاء</CardTitle>
            <UserPlus className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCustomers}</div>
            <p className="text-xs text-green-600 mt-1 font-medium">
              رصيد: {stats.customersBalance.toLocaleString()} ج دائن
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الموردين</CardTitle>
            <Users className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
            <p className="text-xs text-red-600 mt-1 font-medium">
              رصيد: {Math.abs(stats.suppliersBalance).toLocaleString()} ج مدين
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الإيرادات الشهرية</CardTitle>
            <TrendingUp className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {stats.monthlyRevenue.toLocaleString()} ج
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              هذا الشهر
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المصروفات الشهرية</CardTitle>
            <TrendingDown className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {stats.monthlyExpenses.toLocaleString()} ج
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              هذا الشهر
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Net Profit Card */}
      <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">صافي الربح الشهري</p>
              <h2 className="text-4xl font-bold text-primary">
                {(stats.monthlyRevenue - stats.monthlyExpenses).toLocaleString()} ج
              </h2>
              <p className="text-sm text-muted-foreground mt-2">
                نسبة الربحية: {(((stats.monthlyRevenue - stats.monthlyExpenses) / stats.monthlyRevenue) * 100).toFixed(1)}%
              </p>
            </div>
            <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
              <DollarSign className="h-10 w-10 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounting Modules Grid */}
      <div>
        <h2 className="text-2xl font-bold mb-4">📊 الموديولات المحاسبية</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {accountingModules.map((module) => {
            const Icon = module.icon;
            return (
              <Link key={module.href} href={module.href}>
                <Card className="h-full hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer group">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className={`${module.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <CardTitle className="text-base">{module.title}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-3">
                      {module.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-primary">
                        {module.stats}
                      </span>
                      <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                        فتح ←
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>📋 آخر المعاملات</CardTitle>
            <Link href="/transactions">
              <Button variant="outline" size="sm">
                عرض الكل
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {transactions.slice(0, 3).length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>لا توجد معاملات مالية بعد</p>
                <p className="text-xs mt-1">ابدأ بإضافة أول معاملة مالية</p>
              </div>
            ) : (
              transactions.slice(0, 3).map((transaction: any) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${
                    transaction.transactionType === "sale" || transaction.transactionType === "income" ? "bg-green-100" :
                    transaction.transactionType === "purchase" || transaction.transactionType === "expense" ? "bg-red-100" :
                    "bg-blue-100"
                  }`}>
                    {transaction.transactionType === "sale" || transaction.transactionType === "income" ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : transaction.transactionType === "purchase" || transaction.transactionType === "expense" ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{transaction.description || transaction.transactionNumber}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(transaction.transactionDate || transaction.createdAt).toLocaleDateString('ar-EG')}
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className={`text-lg font-bold ${
                    transaction.transactionType === "sale" || transaction.transactionType === "income" ? "text-green-600" : "text-red-600"
                  }`}>
                    {transaction.transactionType === "sale" || transaction.transactionType === "income" ? "+" : "-"}
                    {parseFloat(transaction.amount || "0").toLocaleString()} ج
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {transaction.paymentMethod === "cash" ? "💵 نقداً" :
                     transaction.paymentMethod === "bank_transfer" ? "🏦 تحويل بنكي" :
                     transaction.paymentMethod === "check" ? "📝 شيك" :
                     "💳 غير محدد"}
                  </p>
                </div>
              </div>
            )))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
