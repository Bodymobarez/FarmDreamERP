import { TreatmentCard } from '../TreatmentCard'

export default function TreatmentCardExample() {
  return (
    <div className="p-8 bg-background">
      <div className="space-y-4 max-w-2xl">
        <TreatmentCard
          date="15/6/2025"
          treatment="تطعيم ضد الحمى القلاعية"
          medicine="فوت فاكس"
          dose="2 مل"
          cost={150}
          vet="د. أحمد محمود"
        />
        <TreatmentCard
          date="10/6/2025"
          treatment="علاج إسهال"
          medicine="نيوميسين"
          dose="5 مل"
          cost={80}
          vet="د. محمد علي"
        />
      </div>
    </div>
  )
}
