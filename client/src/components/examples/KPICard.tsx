import { KPICard } from '../KPICard'
import { TrendingUp, Scale, DollarSign, Activity } from 'lucide-react'

export default function KPICardExample() {
  return (
    <div className="p-8 bg-background">
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
    </div>
  )
}
