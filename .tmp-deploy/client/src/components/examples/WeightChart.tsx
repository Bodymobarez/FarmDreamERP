import { WeightChart } from '../WeightChart'

export default function WeightChartExample() {
  // البيانات ستأتي من قاعدة البيانات
  const mockData: any[] = [];

  return (
    <div className="p-8 bg-background">
      <WeightChart data={mockData} />
    </div>
  )
}
