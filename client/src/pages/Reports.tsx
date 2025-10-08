import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, BarChart3, TrendingUp, DollarSign, Scale, Plus } from "lucide-react";

export default function Reports() {
  const reports = [
    {
      title: "تقرير الأداء الشامل",
      description: "تقرير تفصيلي يشمل جميع مؤشرات الأداء والتكاليف والأرباح",
      icon: BarChart3,
      color: "primary" as const,
    },
    {
      title: "تقرير التكاليف لكل رأس",
      description: "حساب التكلفة الإجمالية لكل حيوان (أعلاف + علاجات + مصروفات)",
      icon: DollarSign,
      color: "warning" as const,
    },
    {
      title: "تقرير مقارنة الدفعات",
      description: "مقارنة الأداء بين الدفعات المختلفة (ADG, FCR, التكاليف)",
      icon: TrendingUp,
      color: "success" as const,
    },
    {
      title: "تقرير الأوزان التفصيلي",
      description: "سجل كامل لجميع قياسات الأوزان مع الرسوم البيانية",
      icon: Scale,
      color: "secondary" as const,
    },
  ];

  const colorClasses = {
    primary: "bg-primary/10 text-primary",
    secondary: "bg-chart-2/10 text-chart-2",
    success: "bg-chart-1/10 text-chart-1",
    warning: "bg-chart-4/10 text-chart-4",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">التقارير والتحليلات</h1>
        <p className="text-muted-foreground">تقارير شاملة لتحليل أداء المزرعة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {reports.map((report) => (
          <Card key={report.title} className="p-6 hover-elevate" data-testid={`card-${report.title.toLowerCase().replace(/\s+/g, '-')}`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colorClasses[report.color]}`}>
                <report.icon className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold mb-2">{report.title}</h3>
                <p className="text-sm text-muted-foreground mb-4">{report.description}</p>
                <div className="flex gap-2">
                  <Button size="sm" data-testid={`button-view-${report.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <FileText className="w-4 h-4 ml-1" />
                    عرض
                  </Button>
                  <Button size="sm" variant="outline" data-testid={`button-download-${report.title.toLowerCase().replace(/\s+/g, '-')}`}>
                    <Download className="w-4 h-4 ml-1" />
                    تصدير PDF
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">تقارير مخصصة</h2>
        <p className="text-muted-foreground mb-4">قم بإنشاء تقرير مخصص حسب احتياجاتك</p>
        <Button data-testid="button-custom-report">
          <Plus className="w-5 h-5 ml-2" />
          إنشاء تقرير مخصص
        </Button>
      </Card>
    </div>
  );
}
