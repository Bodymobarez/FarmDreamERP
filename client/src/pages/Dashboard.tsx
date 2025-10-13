import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  Package,
  DollarSign,
  ShoppingCart,
  Beef,
  Scale,
  Activity,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Plus,
  Calendar,
  Target,
  Zap,
  BarChart3,
} from "lucide-react";

export default function Dashboard() {
  console.log('🔵 Dashboard component rendering...');
  
  // Fetch data
  const { data: animalsData, isLoading: isLoadingAnimals } = useQuery({ queryKey: ["/api/animals"] });
  const animals = (animalsData as any[]) || [];

  const { data: batchesData, isLoading: isLoadingBatches } = useQuery({ queryKey: ["/api/batches"] });
  const batches = (batchesData as any[]) || [];

  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({ queryKey: ["/api/customers"] });
  const customers = (customersData as any[]) || [];

  const { data: suppliersData, isLoading: isLoadingSuppliers } = useQuery({ queryKey: ["/api/suppliers"] });
  const suppliers = (suppliersData as any[]) || [];
  
  console.log('📊 Dashboard data:', { 
    animals: animals.length, 
    batches: batches.length,
    loading: isLoadingAnimals || isLoadingBatches || isLoadingCustomers || isLoadingSuppliers
  });

  const { data: transactionsData } = useQuery({ queryKey: ["/api/transactions"] });
  const transactions = (transactionsData as any[]) || [];

  const { data: inventoryData } = useQuery({ queryKey: ["/api/inventory"] });
  const inventory = (inventoryData as any[]) || [];

  // حساب الإحصائيات
  const totalAnimals = animals.length;
  const activeBatches = batches.filter((b: any) => b.status === "active").length;
  const totalCustomers = customers.length;
  const totalSuppliers = suppliers.length;
  
  // حساب متوسط الوزن
  const totalWeight = animals.reduce((sum: number, animal: any) => {
    return sum + parseFloat(animal.currentWeight || animal.weight || "0");
  }, 0);
  const avgWeight = totalAnimals > 0 ? Math.round(totalWeight / totalAnimals) : 0;

  const totalRevenue = transactions
    .filter((t: any) => t.transactionType === "sale" || t.transactionType === "receipt")
    .reduce((sum: number, t: any) => sum + parseFloat(t.amount || "0"), 0);

  // حساب التكاليف بشكل صحيح من الدفعات
  const totalExpenses = batches.reduce((sum: number, batch: any) => {
    const batchTotalCost = parseFloat(batch.totalCost || 0);
    return sum + batchTotalCost;
  }, 0);
  
  // حساب تكلفة الأعلاف من الدفعات
  const feedExpenses = batches.reduce((sum: number, batch: any) => {
    const batchFeedCost = parseFloat(batch.feedCost || 0);
    return sum + batchFeedCost;
  }, 0);

  const netProfit = totalRevenue - totalExpenses;
  const profitMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  const totalInventoryValue = inventory.reduce(
    (sum: number, item: any) =>
      sum + parseFloat(item.currentStock || item.quantity || "0") * parseFloat(item.unitCost || item.unitPrice || "0"),
    0
  );

  const lowStockItems = inventory.filter(
    (item: any) => parseFloat(item.currentStock || item.quantity || "0") <= parseFloat(item.minStock || item.minQuantity || "0")
  ).length;

  // إحصائيات إضافية
  const todayTransactions = transactions.filter((t: any) => {
    const today = new Date().toISOString().split("T")[0];
    return t.transactionDate && t.transactionDate.startsWith(today);
  }).length;

  const weekTransactions = transactions.filter((t: any) => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    return t.transactionDate && new Date(t.transactionDate) >= weekAgo;
  }).length;
  
  // حساب إحصائيات الدفعات
  const totalBatches = batches.length;
  const completedBatches = batches.filter((b: any) => b.status === "completed").length;
  const batchProfit = batches.reduce((sum: number, batch: any) => {
    return sum + parseFloat(batch.profitLoss || "0");
  }, 0);

  // الأنشطة الأخيرة
  const recentActivities: any[] = [];

  // Show loading state
  const isLoading = isLoadingAnimals || isLoadingBatches || isLoadingCustomers || isLoadingSuppliers;
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl font-semibold text-gray-700">جاري تحميل لوحة التحكم...</p>
          <p className="text-sm text-gray-500 mt-2">يرجى الانتظار قليلاً</p>
        </div>
      </div>
    );
  }

  console.log('✅ Dashboard rendering UI');

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
              <LayoutDashboard className="w-7 h-7 text-white" />
            </div>
            نظرة عامة
          </h1>
          <p className="text-gray-600 mt-2">
            لوحة التحكم الرئيسية - نظرة شاملة على جميع عمليات المزرعة
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar className="w-4 h-4" />
            اليوم
          </Button>
          <Button className="gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4" />
            إضافة جديد
          </Button>
        </div>
      </div>

      {/* Main KPIs - Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-5 border-2 border-emerald-200 bg-gradient-to-br from-emerald-50/50 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-600">
              <ArrowUpRight className="w-4 h-4" />
              0%
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">صافي الربح 💰</p>
            <p className="text-3xl font-bold text-emerald-600">
              {netProfit.toLocaleString("ar-EG")} ج
            </p>
          </div>
        </Card>

        <Card className="p-5 border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-blue-600">
              <ArrowUpRight className="w-4 h-4" />
              0%
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">الإيرادات 📈</p>
            <p className="text-3xl font-bold text-blue-600">
              {totalRevenue.toLocaleString("ar-EG")} ج
            </p>
          </div>
        </Card>

        <Card className="p-5 border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-red-600">
              <ArrowUpRight className="w-4 h-4" />
              0%
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">المصروفات 💸</p>
            <p className="text-3xl font-bold text-red-600">
              {totalExpenses.toLocaleString("ar-EG")} ج
            </p>
          </div>
        </Card>

        <Card className="p-5 border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex items-center gap-1 text-sm font-medium text-purple-600">
              <ArrowUpRight className="w-4 h-4" />
              0%
            </div>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">هامش الربح 📊</p>
            <p className="text-3xl font-bold text-purple-600">
              {profitMargin.toFixed(1)}%
            </p>
          </div>
        </Card>
      </div>

      {/* Secondary KPIs - Row 2 */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
        <Card className="p-4 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
              <Beef className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الحيوانات</p>
              <p className="text-2xl font-bold text-indigo-600">{totalAnimals}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-cyan-200 bg-gradient-to-br from-cyan-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-cyan-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الدفعات</p>
              <p className="text-2xl font-bold text-cyan-600">{activeBatches}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">العملاء</p>
              <p className="text-2xl font-bold text-green-600">{totalCustomers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-violet-200 bg-gradient-to-br from-violet-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-violet-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الموردين</p>
              <p className="text-2xl font-bold text-violet-600">{totalSuppliers}</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-orange-200 bg-gradient-to-br from-orange-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">المخزون</p>
              <p className="text-2xl font-bold text-orange-600">
                {totalInventoryValue.toLocaleString("ar-EG", { maximumFractionDigits: 0 })} ج
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-4 border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">متوسط الوزن</p>
              <p className="text-2xl font-bold text-amber-600">{avgWeight} كجم</p>
            </div>
          </div>
        </Card>
      </div>
      
      {/* Additional KPIs Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">المعاملات</p>
              <p className="text-2xl font-bold text-purple-600">{transactions.length}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertCircle className="w-5 h-5 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">مخزون منخفض</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-2 border-teal-200 bg-gradient-to-br from-teal-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
              <Target className="w-5 h-5 text-teal-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">الدفعات النشطة</p>
              <p className="text-2xl font-bold text-teal-600">{activeBatches}</p>
            </div>
          </div>
        </Card>
        
        <Card className="p-4 border-2 border-pink-200 bg-gradient-to-br from-pink-50/50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">إجمالي الوزن</p>
              <p className="text-2xl font-bold text-pink-600">{Math.round(totalWeight)} كجم</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Activities & Alerts */}
        <div className="lg:col-span-2 space-y-6">
          {/* Recent Activities */}
          <Card className="p-6 border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-600" />
                النشاطات الأخيرة
              </h3>
              <Button variant="outline" size="sm" className="gap-2">
                <Eye className="w-4 h-4" />
                عرض الكل
              </Button>
            </div>
            <div className="space-y-4">
              {recentActivities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Activity className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="font-medium">لا توجد أنشطة حديثة</p>
                  <p className="text-sm text-gray-400 mt-1">ستظهر الأنشطة هنا عند بدء استخدام النظام</p>
                </div>
              ) : (
                recentActivities.map((activity) => {
                  const Icon = activity.icon;
                  return (
                    <div
                      key={activity.id}
                      className="flex items-start gap-4 p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                    >
                      <div className={`w-10 h-10 ${activity.bg} rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <Icon className={`w-5 h-5 ${activity.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{activity.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{activity.time}</span>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">معاملات اليوم</h4>
                <CheckCircle2 className="w-5 h-5 text-green-600" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">العدد</span>
                  <span className="text-2xl font-bold text-green-600">{todayTransactions}</span>
                </div>
                <div className="w-full bg-green-100 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((todayTransactions / 10) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </Card>

            <Card className="p-5 border-2 border-yellow-200 bg-gradient-to-br from-yellow-50/50 to-transparent">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-semibold text-gray-900">تنبيهات المخزون</h4>
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">أصناف منخفضة</span>
                  <span className="text-2xl font-bold text-yellow-600">{lowStockItems}</span>
                </div>
                <div className="w-full bg-yellow-100 rounded-full h-2">
                  <div
                    className="bg-yellow-600 h-2 rounded-full transition-all"
                    style={{ width: `${Math.min((lowStockItems / inventory.length) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Right Column - Quick Actions & Summary */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card className="p-6 border-2 border-purple-200 bg-gradient-to-br from-purple-50/50 to-transparent">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-purple-600" />
              إجراءات سريعة
            </h3>
            <div className="space-y-3">
              <Button className="w-full justify-start gap-3 bg-green-600 hover:bg-green-700">
                <DollarSign className="w-5 h-5" />
                إضافة عملية بيع
              </Button>
              <Button className="w-full justify-start gap-3 bg-blue-600 hover:bg-blue-700">
                <ShoppingCart className="w-5 h-5" />
                إضافة عملية شراء
              </Button>
              <Button className="w-full justify-start gap-3 bg-purple-600 hover:bg-purple-700">
                <Beef className="w-5 h-5" />
                إضافة حيوانات
              </Button>
              <Button className="w-full justify-start gap-3 bg-orange-600 hover:bg-orange-700">
                <Activity className="w-5 h-5" />
                تسجيل علاج
              </Button>
              <Button className="w-full justify-start gap-3 bg-cyan-600 hover:bg-cyan-700">
                <Scale className="w-5 h-5" />
                تسجيل وزن
              </Button>
            </div>
          </Card>

          {/* Weekly Summary */}
          <Card className="p-6 border-2 border-indigo-200 bg-gradient-to-br from-indigo-50/50 to-transparent">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              ملخص الأسبوع
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100">
                <span className="text-sm font-medium text-gray-700">المعاملات</span>
                <span className="text-lg font-bold text-indigo-600">{weekTransactions}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100">
                <span className="text-sm font-medium text-gray-700">الدفعات النشطة</span>
                <span className="text-lg font-bold text-indigo-600">{activeBatches}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-indigo-100">
                <span className="text-sm font-medium text-gray-700">المخزون المنخفض</span>
                <span className="text-lg font-bold text-indigo-600">{lowStockItems}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
