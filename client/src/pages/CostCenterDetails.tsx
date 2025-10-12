import { useState } from "react";
import { useRoute } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  Plus,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Package,
  Activity,
  Pill,
  Wheat,
  FileText,
  Download,
} from "lucide-react";
import { Link } from "wouter";

export default function CostCenterDetails() {
  const [, params] = useRoute("/cost-center/:id");
  const batchId = params?.id;

  // Mock data - سيتم استبدالها بـ API calls
  const batch = {
    id: batchId,
    batchNumber: "الدفعة الأولى",
    batchName: "دفعة يناير 2024",
    startDate: "2024-01-01",
    status: "active",
    totalAnimals: 50,
    soldAnimals: 10,
    deceasedAnimals: 2,
    activeAnimals: 38,
    purchaseCost: 250000,
    feedCost: 45000,
    treatmentCost: 12000,
    otherExpenses: 8000,
    totalCost: 315000,
    totalRevenue: 85000,
    profit: -230000,
    profitPercentage: -73.02,
  };

  // Feed Expenses
  const feedExpenses = [
    {
      id: "1",
      date: "2024-01-05",
      description: "علف مركز - نوع A",
      quantity: 500,
      unit: "كجم",
      unitPrice: 15,
      amount: 7500,
      supplier: "مورد الأعلاف الذهبية",
    },
    {
      id: "2",
      date: "2024-01-12",
      description: "علف بادئ",
      quantity: 300,
      unit: "كجم",
      unitPrice: 18,
      amount: 5400,
      supplier: "مورد الأعلاف الذهبية",
    },
    {
      id: "3",
      date: "2024-01-20",
      description: "تبن",
      quantity: 1000,
      unit: "كجم",
      unitPrice: 5,
      amount: 5000,
      supplier: "مزارع النور",
    },
  ];

  // Treatment Expenses
  const treatmentExpenses = [
    {
      id: "1",
      date: "2024-01-03",
      description: "تطعيم ضد الحمى القلاعية",
      quantity: 50,
      unit: "جرعة",
      unitPrice: 120,
      amount: 6000,
      supplier: "مورد الأدوية البيطرية",
    },
    {
      id: "2",
      date: "2024-01-15",
      description: "علاج طفيليات",
      quantity: 50,
      unit: "جرعة",
      unitPrice: 80,
      amount: 4000,
      supplier: "مورد الأدوية البيطرية",
    },
    {
      id: "3",
      date: "2024-01-25",
      description: "فيتامينات ومقويات",
      quantity: 50,
      unit: "جرعة",
      unitPrice: 40,
      amount: 2000,
      supplier: "الصيدلية البيطرية",
    },
  ];

  // Other Expenses
  const otherExpenses = [
    {
      id: "1",
      date: "2024-01-02",
      description: "نقل وشحن الحيوانات",
      amount: 3000,
      category: "transport",
    },
    {
      id: "2",
      date: "2024-01-10",
      description: "عمالة ورعاية",
      amount: 2500,
      category: "labor",
    },
    {
      id: "3",
      date: "2024-01-18",
      description: "صيانة وتنظيف العنابر",
      amount: 2500,
      category: "maintenance",
    },
  ];

  // Sales
  const sales = [
    {
      id: "1",
      saleNumber: "S-001",
      date: "2024-01-28",
      earTag: "001",
      weight: 450,
      pricePerKg: 85,
      salePrice: 38250,
      cost: 6300,
      profit: 31950,
      profitPercentage: 83.53,
      customer: "عميل المزرعة الكبرى",
    },
    {
      id: "2",
      saleNumber: "S-002",
      date: "2024-02-05",
      earTag: "002",
      weight: 420,
      pricePerKg: 85,
      salePrice: 35700,
      cost: 6100,
      profit: 29600,
      profitPercentage: 82.91,
      customer: "مزرعة النور",
    },
  ];

  const statistics = [
    {
      title: "إجمالي تكلفة الشراء",
      value: `${batch.purchaseCost.toLocaleString()} جنيه مصري`,
      percentage: ((batch.purchaseCost / batch.totalCost) * 100).toFixed(1),
      icon: Package,
      color: "text-blue-500",
    },
    {
      title: "تكلفة الأعلاف",
      value: `${batch.feedCost.toLocaleString()} جنيه مصري`,
      percentage: ((batch.feedCost / batch.totalCost) * 100).toFixed(1),
      icon: Wheat,
      color: "text-green-500",
    },
    {
      title: "تكلفة العلاجات",
      value: `${batch.treatmentCost.toLocaleString()} جنيه مصري`,
      percentage: ((batch.treatmentCost / batch.totalCost) * 100).toFixed(1),
      icon: Pill,
      color: "text-red-500",
    },
    {
      title: "مصروفات أخرى",
      value: `${batch.otherExpenses.toLocaleString()} جنيه مصري`,
      percentage: ((batch.otherExpenses / batch.totalCost) * 100).toFixed(1),
      icon: DollarSign,
      color: "text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Link href="/cost-centers">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {batch.batchNumber} - {batch.batchName}
            </h1>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>تاريخ البدء: {new Date(batch.startDate).toLocaleDateString("ar-EG")}</span>
              <Badge
                className={
                  batch.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }
              >
                {batch.status === "active" ? "دفعة نشطة" : "دفعة مغلقة"}
              </Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            تصدير التقرير
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            إضافة مصروف
          </Button>
        </div>
      </div>

      {/* Main Statistics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي التكاليف
                </p>
                <p className="text-3xl font-bold text-blue-900 mt-2">
                  {batch.totalCost.toLocaleString()} جنيه مصري
                </p>
              </div>
              <Activity className="h-12 w-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  إجمالي الإيرادات
                </p>
                <p className="text-3xl font-bold text-green-900 mt-2">
                  {batch.totalRevenue.toLocaleString()} جنيه مصري
                </p>
              </div>
              <DollarSign className="h-12 w-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className={`bg-gradient-to-br ${batch.profit >= 0 ? "from-green-50 to-green-100" : "from-red-50 to-red-100"}`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  صافي الربح/الخسارة
                </p>
                <p className={`text-3xl font-bold mt-2 ${batch.profit >= 0 ? "text-green-900" : "text-red-900"}`}>
                  {batch.profit >= 0 ? "+" : ""}{batch.profit.toLocaleString()} جنيه مصري
                </p>
              </div>
              {batch.profit >= 0 ? (
                <TrendingUp className="h-12 w-12 text-green-500" />
              ) : (
                <TrendingDown className="h-12 w-12 text-red-500" />
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div>
              <p className="text-sm font-medium text-gray-600">
                نسبة الربح/الخسارة
              </p>
              <p className={`text-3xl font-bold mt-2 ${batch.profitPercentage >= 0 ? "text-green-600" : "text-red-600"}`}>
                {batch.profitPercentage >= 0 ? "+" : ""}
                {batch.profitPercentage.toFixed(2)}%
              </p>
              <p className="text-xs text-gray-500 mt-2">
                {batch.activeAnimals} حيوان نشط | {batch.soldAnimals} مباع
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Cost Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>تفصيل التكاليف</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statistics.map((stat, index) => (
              <div key={index} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <Badge variant="outline">{stat.percentage}%</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className={`text-xl font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tables */}
      <Card>
        <CardHeader>
          <CardTitle>التفاصيل المحاسبية</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="feed" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="feed">الأعلاف</TabsTrigger>
              <TabsTrigger value="treatment">العلاجات</TabsTrigger>
              <TabsTrigger value="other">مصروفات أخرى</TabsTrigger>
              <TabsTrigger value="sales">المبيعات</TabsTrigger>
            </TabsList>

            {/* Feed Tab */}
            <TabsContent value="feed" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">مصروفات الأعلاف</h3>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة علف
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الوصف</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">سعر الوحدة</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">المورد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString("ar-EG")}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        {expense.quantity} {expense.unit}
                      </TableCell>
                      <TableCell>ج.م {expense.unitPrice}</TableCell>
                      <TableCell className="font-bold">
                        ج.م {expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{expense.supplier}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell colSpan={4} className="text-right">
                      الإجمالي
                    </TableCell>
                    <TableCell className="text-green-600">
                      {feedExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()} ج.م
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* Treatment Tab */}
            <TabsContent value="treatment" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">مصروفات العلاجات</h3>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة علاج
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الوصف</TableHead>
                    <TableHead className="text-right">الكمية</TableHead>
                    <TableHead className="text-right">سعر الوحدة</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                    <TableHead className="text-right">المورد</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {treatmentExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString("ar-EG")}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        {expense.quantity} {expense.unit}
                      </TableCell>
                      <TableCell>ج.م {expense.unitPrice}</TableCell>
                      <TableCell className="font-bold">
                        ج.م {expense.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>{expense.supplier}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell colSpan={4} className="text-right">
                      الإجمالي
                    </TableCell>
                    <TableCell className="text-green-600">
                      {treatmentExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()} ج.م
                    </TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* Other Expenses Tab */}
            <TabsContent value="other" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">المصروفات الأخرى</h3>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  إضافة مصروف
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">الوصف</TableHead>
                    <TableHead className="text-right">التصنيف</TableHead>
                    <TableHead className="text-right">المبلغ</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {otherExpenses.map((expense) => (
                    <TableRow key={expense.id}>
                      <TableCell>
                        {new Date(expense.date).toLocaleDateString("ar-EG")}
                      </TableCell>
                      <TableCell>{expense.description}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {expense.category === "transport" ? "نقل" :
                           expense.category === "labor" ? "عمالة" : "صيانة"}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-bold">
                        ج.م {expense.amount.toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell colSpan={3} className="text-right">
                      الإجمالي
                    </TableCell>
                    <TableCell className="text-green-600">
                      {otherExpenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString()} ج.م
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>

            {/* Sales Tab */}
            <TabsContent value="sales" className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">سجل المبيعات</h3>
                <Button size="sm" className="gap-2">
                  <Plus className="h-4 w-4" />
                  تسجيل بيع
                </Button>
              </div>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-right">رقم البيع</TableHead>
                    <TableHead className="text-right">التاريخ</TableHead>
                    <TableHead className="text-right">رقم الأذن</TableHead>
                    <TableHead className="text-right">الوزن</TableHead>
                    <TableHead className="text-right">سعر الكيلو</TableHead>
                    <TableHead className="text-right">سعر البيع</TableHead>
                    <TableHead className="text-right">التكلفة</TableHead>
                    <TableHead className="text-right">الربح</TableHead>
                    <TableHead className="text-right">نسبة الربح</TableHead>
                    <TableHead className="text-right">العميل</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell className="font-medium">
                        {sale.saleNumber}
                      </TableCell>
                      <TableCell>
                        {new Date(sale.date).toLocaleDateString("ar-EG")}
                      </TableCell>
                      <TableCell>{sale.earTag}</TableCell>
                      <TableCell>{sale.weight} كجم</TableCell>
                      <TableCell>{sale.pricePerKg} ج.م</TableCell>
                      <TableCell className="font-bold text-green-600">
                        ج.م {sale.salePrice.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-red-600">
                        ج.م {sale.cost.toLocaleString()}
                      </TableCell>
                      <TableCell className="font-bold text-green-600">
                        ج.م {sale.profit.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          +{sale.profitPercentage.toFixed(2)}%
                        </Badge>
                      </TableCell>
                      <TableCell>{sale.customer}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow className="bg-gray-50 font-bold">
                    <TableCell colSpan={5} className="text-right">
                      الإجمالي
                    </TableCell>
                    <TableCell className="text-green-600">
                      ج.م {sales.reduce((sum, s) => sum + s.salePrice, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-red-600">
                      ج.م {sales.reduce((sum, s) => sum + s.cost, 0).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-green-600">
                      ج.م {sales.reduce((sum, s) => sum + s.profit, 0).toLocaleString()}
                    </TableCell>
                    <TableCell colSpan={2}></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
