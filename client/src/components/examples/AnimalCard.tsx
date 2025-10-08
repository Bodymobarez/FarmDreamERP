import { AnimalCard } from '../AnimalCard'

export default function AnimalCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl">
        <AnimalCard
          id="1"
          earTag="98"
          pen="عنبر 5"
          batch="الدفعة الثالثة"
          sex="ذكر"
          currentWeight={42.5}
          entryWeight={24.8}
          status="active"
          onClick={() => console.log('View animal 98')}
        />
        <AnimalCard
          id="2"
          earTag="75"
          pen="عنبر 3"
          batch="الدفعة الثانية"
          sex="ذكر"
          currentWeight={38.2}
          entryWeight={22.0}
          status="active"
          onClick={() => console.log('View animal 75')}
        />
        <AnimalCard
          id="3"
          earTag="52"
          pen="عنبر 1"
          batch="الدفعة الأولى"
          sex="أنثى"
          currentWeight={45.0}
          entryWeight={25.5}
          status="sold"
          onClick={() => console.log('View animal 52')}
        />
      </div>
    </div>
  )
}
