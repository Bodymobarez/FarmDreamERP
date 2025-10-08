import { ExpenseCard } from '../ExpenseCard'

export default function ExpenseCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="space-y-4 max-w-2xl">
        <ExpenseCard
          date="18/6/2025"
          category="أعلاف"
          amount={12500}
          description="علف تسمين مركز - 500 كجم"
          categoryColor="feed"
        />
        <ExpenseCard
          date="15/6/2025"
          category="علاجات"
          amount={3200}
          description="تطعيمات وأدوية بيطرية"
          categoryColor="treatment"
        />
        <ExpenseCard
          date="10/6/2025"
          category="عمالة"
          amount={8000}
          description="رواتب شهر يونيو"
          categoryColor="labor"
        />
      </div>
    </div>
  )
}
