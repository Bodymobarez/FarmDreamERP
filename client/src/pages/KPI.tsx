import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  TrendingUp, 
  Scale, 
  DollarSign, 
  Activity, 
  Target,
  Calendar,
  Percent,
  AlertTriangle
} from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

export default function KPI() {
  const adgTrendData = [
    { month: 'يناير', adg: 0.78 },
    { month: 'فبراير', adg: 0.82 },
    { month: 'مارس', adg: 0.85 },
    { month: 'أبريل', adg: 0.88 },
    { month: 'مايو', adg: 0.85 },
    { month: 'يونيو', adg: 0.90 },
  ];

  const fcrTrendData = [
    { month: 'يناير', fcr: 3.5 },
    { month: 'فبراير', fcr: 3.3 },
    { month: 'مارس', fcr: 3.2 },
    { month: 'أبريل', fcr: 3.1 },
    { month: 'مايو', fcr: 3.2 },
    { month: 'يونيو', fcr: 3.0 },
  ];

  const costPerHeadData = [
    { batch: 'دفعة 1', cost: 2200 },
    { batch: 'دفعة 2', cost: 2350 },
    { batch: 'دفعة 3', cost: 2450 },
    { batch: 'دفعة 4', cost: 2380 },
  ];

  const profitabilityData = [
    { batch: 'دفعة 1', revenue: 2850, cost: 2200, profit: 650 },
    { batch: 'دفعة 2', revenue: 2950, cost: 2350, profit: 600 },
    { batch: 'دفعة 3', revenue: 2925, cost: 2450, profit: 475 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">مؤشرات الأداء الرئيسية (KPI)</h1>
        <p className="text-muted-foreground">تتبع وتحليل مؤشرات الأداء الحرجة للمزرعة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 hover-elevate" data-testid="kpi-adg">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-chart-1/10 text-chart-1 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-xs text-chart-1">↑ 5.8%</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">متوسط الزيادة اليومية</p>
          <p className="text-3xl font-bold">0.90 كجم/يوم</p>
          <p className="text-xs text-muted-foreground mt-2">ADG - Average Daily Gain</p>
        </Card>

        <Card className="p-6 hover-elevate" data-testid="kpi-fcr">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-chart-2/10 text-chart-2 rounded-lg flex items-center justify-center">
              <Scale className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-xs text-chart-1">↓ 6.2%</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">معدل تحويل العلف</p>
          <p className="text-3xl font-bold">3.0</p>
          <p className="text-xs text-muted-foreground mt-2">FCR - Feed Conversion Ratio</p>
        </Card>

        <Card className="p-6 hover-elevate" data-testid="kpi-cost">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-chart-4/10 text-chart-4 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-xs text-destructive">↑ 8.3%</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">التكلفة لكل رأس</p>
          <p className="text-3xl font-bold">2,450 ج</p>
          <p className="text-xs text-muted-foreground mt-2">Cost per Head</p>
        </Card>

        <Card className="p-6 hover-elevate" data-testid="kpi-mortality">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-xs text-chart-1">↓ 15%</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-1">معدل النفوق</p>
          <p className="text-3xl font-bold">1.2%</p>
          <p className="text-xs text-muted-foreground mt-2">3 من 250 حيوان</p>
        </Card>
      </div>

      <Tabs defaultValue="adg" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="adg" data-testid="tab-adg">ADG</TabsTrigger>
          <TabsTrigger value="fcr" data-testid="tab-fcr">FCR</TabsTrigger>
          <TabsTrigger value="cost" data-testid="tab-cost">التكاليف</TabsTrigger>
          <TabsTrigger value="profit" data-testid="tab-profit">الربحية</TabsTrigger>
        </TabsList>

        <TabsContent value="adg" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">تطور متوسط الزيادة اليومية (ADG)</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={adgTrendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      direction: 'rtl'
                    }}
                  />
                  <Legend wrapperStyle={{ direction: 'rtl' }} />
                  <Line type="monotone" dataKey="adg" stroke="hsl(var(--chart-1))" strokeWidth={3} name="ADG (كجم/يوم)" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">الهدف الشهري</p>
                  <p className="text-2xl font-bold">0.85 كجم/يوم</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">تم تحقيق الهدف بنسبة 105.9%</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Calendar className="w-8 h-8 text-chart-2" />
                <div>
                  <p className="text-sm text-muted-foreground">أفضل شهر</p>
                  <p className="text-2xl font-bold">يونيو 2025</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">ADG: 0.90 كجم/يوم</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Percent className="w-8 h-8 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">التحسن السنوي</p>
                  <p className="text-2xl font-bold text-chart-1">+15.4%</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">مقارنة بالعام الماضي</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="fcr" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">تطور معدل تحويل العلف (FCR)</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={fcrTrendData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      direction: 'rtl'
                    }}
                  />
                  <Legend wrapperStyle={{ direction: 'rtl' }} />
                  <Line type="monotone" dataKey="fcr" stroke="hsl(var(--chart-2))" strokeWidth={3} name="FCR" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8 text-chart-2" />
                <div>
                  <p className="text-sm text-muted-foreground">الهدف المثالي</p>
                  <p className="text-2xl font-bold">3.2</p>
                </div>
              </div>
              <p className="text-xs text-chart-1">تم تحسين FCR بنسبة 6.2%</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Scale className="w-8 h-8 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">أفضل أداء</p>
                  <p className="text-2xl font-bold">3.0</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">يونيو 2025</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <DollarSign className="w-8 h-8 text-chart-1" />
                <div>
                  <p className="text-sm text-muted-foreground">توفير في التكاليف</p>
                  <p className="text-2xl font-bold text-chart-1">-180 ج</p>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">لكل رأس شهرياً</p>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="cost" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">التكلفة لكل رأس حسب الدفعة</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={costPerHeadData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="batch" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      direction: 'rtl'
                    }}
                  />
                  <Legend wrapperStyle={{ direction: 'rtl' }} />
                  <Bar dataKey="cost" fill="hsl(var(--chart-4))" name="التكلفة (ج)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h4 className="font-bold mb-4">توزيع التكاليف</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-chart-1/10 rounded-lg">
                  <span className="text-sm">أعلاف</span>
                  <span className="font-bold">1,470 ج (60%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-chart-3/10 rounded-lg">
                  <span className="text-sm">علاجات بيطرية</span>
                  <span className="font-bold">294 ج (12%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-chart-2/10 rounded-lg">
                  <span className="text-sm">عمالة</span>
                  <span className="font-bold">490 ج (20%)</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-chart-4/10 rounded-lg">
                  <span className="text-sm">مرافق وأخرى</span>
                  <span className="font-bold">196 ج (8%)</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h4 className="font-bold mb-4">مقارنة الدفعات</h4>
              <div className="space-y-3">
                <div className="p-3 bg-card rounded-lg border border-card-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">الدفعة الأولى</span>
                    <span className="text-xs text-chart-1">الأقل تكلفة</span>
                  </div>
                  <p className="text-2xl font-bold">2,200 ج</p>
                </div>
                <div className="p-3 bg-card rounded-lg border border-card-border">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">الدفعة الثالثة</span>
                    <span className="text-xs text-destructive">الأعلى تكلفة</span>
                  </div>
                  <p className="text-2xl font-bold">2,450 ج</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="profit" className="space-y-6 mt-6">
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">تحليل الربحية حسب الدفعة</h3>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={profitabilityData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="batch" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '0.5rem',
                      direction: 'rtl'
                    }}
                  />
                  <Legend wrapperStyle={{ direction: 'rtl' }} />
                  <Bar dataKey="revenue" fill="hsl(var(--chart-1))" name="الإيراد (ج)" />
                  <Bar dataKey="cost" fill="hsl(var(--chart-4))" name="التكلفة (ج)" />
                  <Bar dataKey="profit" fill="hsl(var(--chart-2))" name="الربح (ج)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-chart-1/5">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">متوسط الربح لكل رأس</p>
                <p className="text-4xl font-bold text-chart-1">575 ج</p>
                <p className="text-xs text-muted-foreground mt-2">هامش ربح 19.6%</p>
              </div>
            </Card>

            <Card className="p-6 bg-chart-2/5">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">الربح المتوقع</p>
                <p className="text-4xl font-bold text-chart-2">56,350 ج</p>
                <p className="text-xs text-muted-foreground mt-2">للدفعة الكاملة (98 رأس)</p>
              </div>
            </Card>

            <Card className="p-6 bg-chart-3/5">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">ROI العائد على الاستثمار</p>
                <p className="text-4xl font-bold text-chart-3">23.5%</p>
                <p className="text-xs text-muted-foreground mt-2">خلال 3 أشهر</p>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
