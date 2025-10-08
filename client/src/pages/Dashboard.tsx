import { KPICard } from "@/components/KPICard";
import { WeightChart } from "@/components/WeightChart";
import { QuickActionButton } from "@/components/QuickActionButton";
import { Card } from "@/components/ui/card";
import { TrendingUp, Scale, DollarSign, Activity, Plus, Upload, FileText, AlertTriangle } from "lucide-react";

export default function Dashboard() {
  const weightData = [
    { date: '7/5', weight: 24.8 },
    { date: '14/5', weight: 27.3 },
    { date: '21/5', weight: 30.1 },
    { date: '28/5', weight: 33.5 },
    { date: '4/6', weight: 36.8 },
    { date: '11/6', weight: 39.1 },
    { date: '18/6', weight: 42.5 },
  ];

  const recentAlerts = [
    { message: "مخزون علف تسمين مركز منخفض - 120 كجم متبقي", type: "warning" },
    { message: "موعد تطعيم الدفعة الثالثة - غداً", type: "info" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">لوحة التحكم</h1>
        <p className="text-muted-foreground">نظرة شاملة على أداء المزرعة</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="إجمالي الحيوانات"
          value="98"
          subtitle="نشطة"
          icon={Activity}
          color="primary"
          trend={{ value: 12, isPositive: true }}
        />
        <KPICard
          title="متوسط الزيادة اليومية"
          value="0.85 كجم"
          subtitle="ADG"
          icon={TrendingUp}
          color="success"
          trend={{ value: 5, isPositive: true }}
        />
        <KPICard
          title="معدل تحويل العلف"
          value="3.2"
          subtitle="FCR"
          icon={Scale}
          color="secondary"
        />
        <KPICard
          title="إجمالي التكاليف"
          value="245,800 ج"
          subtitle="هذا الشهر"
          icon={DollarSign}
          color="warning"
          trend={{ value: 8, isPositive: false }}
        />
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4">إجراءات سريعة</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickActionButton
            icon={Plus}
            label="إضافة حيوان"
            onClick={() => console.log('Add animal')}
          />
          <QuickActionButton
            icon={Scale}
            label="تسجيل وزن"
            variant="secondary"
            onClick={() => console.log('Add weight')}
          />
          <QuickActionButton
            icon={Upload}
            label="استيراد Excel"
            variant="outline"
            onClick={() => console.log('Import Excel')}
          />
          <QuickActionButton
            icon={FileText}
            label="تصدير تقرير"
            variant="outline"
            onClick={() => console.log('Export report')}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <WeightChart data={weightData} title="متوسط الأوزان - آخر 6 أسابيع" />
        </div>
        <div>
          <Card className="p-6">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-chart-4" />
              تنبيهات مهمة
            </h3>
            <div className="space-y-3">
              {recentAlerts.map((alert, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg text-sm ${
                    alert.type === 'warning'
                      ? 'bg-chart-4/10 text-chart-4 border border-chart-4/20'
                      : 'bg-chart-3/10 text-chart-3 border border-chart-3/20'
                  }`}
                >
                  {alert.message}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
