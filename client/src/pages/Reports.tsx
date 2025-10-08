import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Download, Printer } from "lucide-react";
import { PerformanceMetrics } from "@/components/PerformanceMetrics";
import { BatchComparisonChart } from "@/components/BatchComparisonChart";
import { CostBreakdownChart } from "@/components/CostBreakdownChart";
import { DetailedReportTable } from "@/components/DetailedReportTable";
import { ProfitabilityAnalysis } from "@/components/ProfitabilityAnalysis";
import { WeightChart } from "@/components/WeightChart";

export default function Reports() {
  const weightTrendData = [
    { date: '7/5', weight: 24.8 },
    { date: '14/5', weight: 27.3 },
    { date: '21/5', weight: 30.1 },
    { date: '28/5', weight: 33.5 },
    { date: '4/6', weight: 36.8 },
    { date: '11/6', weight: 39.1 },
    { date: '18/6', weight: 42.5 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">التقارير والتحليلات</h1>
          <p className="text-muted-foreground">تحليلات شاملة لأداء المزرعة وتقارير تفصيلية</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-print-report">
            <Printer className="w-4 h-4 ml-2" />
            طباعة
          </Button>
          <Button data-testid="button-export-pdf">
            <Download className="w-4 h-4 ml-2" />
            تصدير PDF
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="overview" data-testid="tab-overview">نظرة عامة</TabsTrigger>
          <TabsTrigger value="performance" data-testid="tab-performance">تحليل الأداء</TabsTrigger>
          <TabsTrigger value="costs" data-testid="tab-costs">التكاليف والربحية</TabsTrigger>
          <TabsTrigger value="detailed" data-testid="tab-detailed">تقرير تفصيلي</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <PerformanceMetrics />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeightChart data={weightTrendData} title="متوسط تطور الأوزان" />
            <BatchComparisonChart />
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">ملخص الأداء</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-card rounded-lg border border-card-border">
                <p className="text-sm text-muted-foreground mb-2">إجمالي الحيوانات</p>
                <p className="text-3xl font-bold">98</p>
                <p className="text-xs text-muted-foreground mt-1">نشطة حالياً</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-card-border">
                <p className="text-sm text-muted-foreground mb-2">متوسط العمر</p>
                <p className="text-3xl font-bold">45 يوم</p>
                <p className="text-xs text-muted-foreground mt-1">من تاريخ الدخول</p>
              </div>
              <div className="text-center p-4 bg-card rounded-lg border border-card-border">
                <p className="text-sm text-muted-foreground mb-2">إجمالي الزيادة</p>
                <p className="text-3xl font-bold">1,734 كجم</p>
                <p className="text-xs text-muted-foreground mt-1">لجميع الحيوانات</p>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">مؤشرات ADG (الزيادة اليومية)</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-card-border">
                  <span className="text-sm">الدفعة الأولى</span>
                  <div className="text-left">
                    <span className="text-xl font-bold text-chart-1">0.92</span>
                    <span className="text-sm text-muted-foreground mr-1">كجم/يوم</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-card-border">
                  <span className="text-sm">الدفعة الثانية</span>
                  <div className="text-left">
                    <span className="text-xl font-bold text-chart-1">0.88</span>
                    <span className="text-sm text-muted-foreground mr-1">كجم/يوم</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-card-border">
                  <span className="text-sm">الدفعة الثالثة</span>
                  <div className="text-left">
                    <span className="text-xl font-bold text-chart-1">0.85</span>
                    <span className="text-sm text-muted-foreground mr-1">كجم/يوم</span>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-bold mb-4">مؤشرات FCR (معدل تحويل العلف)</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-card-border">
                  <span className="text-sm">الدفعة الأولى</span>
                  <div className="text-left">
                    <span className="text-xl font-bold text-chart-2">3.0</span>
                    <span className="text-sm text-muted-foreground mr-1">FCR</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-card-border">
                  <span className="text-sm">الدفعة الثانية</span>
                  <div className="text-left">
                    <span className="text-xl font-bold text-chart-2">3.1</span>
                    <span className="text-sm text-muted-foreground mr-1">FCR</span>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-card rounded-lg border border-card-border">
                  <span className="text-sm">الدفعة الثالثة</span>
                  <div className="text-left">
                    <span className="text-xl font-bold text-chart-2">3.2</span>
                    <span className="text-sm text-muted-foreground mr-1">FCR</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          <BatchComparisonChart />
        </TabsContent>

        <TabsContent value="costs" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <CostBreakdownChart />
            <ProfitabilityAnalysis />
          </div>

          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">مقارنة التكاليف حسب الدفعة</h3>
            <div className="space-y-3">
              {[
                { batch: "الدفعة الأولى", avgCost: 2350, totalCost: 14100, count: 6 },
                { batch: "الدفعة الثانية", avgCost: 2480, totalCost: 104160, count: 42 },
                { batch: "الدفعة الثالثة", avgCost: 2520, totalCost: 126000, count: 50 },
              ].map((item) => (
                <div key={item.batch} className="p-4 bg-card rounded-lg border border-card-border">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-bold">{item.batch}</h4>
                    <span className="text-sm text-muted-foreground">{item.count} رأس</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">متوسط التكلفة</p>
                      <p className="text-xl font-bold">{item.avgCost.toLocaleString()} ج</p>
                    </div>
                    <div className="text-left">
                      <p className="text-sm text-muted-foreground">التكلفة الإجمالية</p>
                      <p className="text-xl font-bold text-chart-4">{item.totalCost.toLocaleString()} ج</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="detailed" className="space-y-6">
          <DetailedReportTable />
          
          <Card className="p-6">
            <h3 className="text-xl font-bold mb-4">إجراءات التقرير</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="outline">
                <FileText className="w-4 h-4 ml-2" />
                تصدير Excel
              </Button>
              <Button variant="outline">
                <FileText className="w-4 h-4 ml-2" />
                تصدير CSV
              </Button>
              <Button variant="outline">
                <Printer className="w-4 h-4 ml-2" />
                طباعة التقرير
              </Button>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
