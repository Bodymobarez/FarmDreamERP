import { QuickActionButton } from '../QuickActionButton'
import { Plus, Upload, Scale, FileText } from 'lucide-react'

export default function QuickActionButtonExample() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
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
  )
}
