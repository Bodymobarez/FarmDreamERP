import { WeightChart } from '../WeightChart'

export default function WeightChartExample() {
  const mockData = [
    { date: '7/5', weight: 24.8 },
    { date: '14/5', weight: 27.3 },
    { date: '21/5', weight: 30.1 },
    { date: '28/5', weight: 33.5 },
    { date: '4/6', weight: 36.8 },
    { date: '11/6', weight: 39.1 },
    { date: '18/6', weight: 42.5 },
  ];

  return (
    <div className="p-8 bg-background">
      <WeightChart data={mockData} />
    </div>
  )
}
