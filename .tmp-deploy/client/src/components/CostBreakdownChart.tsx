import { Card } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const data = [
  { name: "أعلاف", value: 145000, color: "hsl(var(--chart-1))" },
  { name: "علاجات", value: 28000, color: "hsl(var(--chart-3))" },
  { name: "عمالة", value: 35000, color: "hsl(var(--chart-2))" },
  { name: "مرافق", value: 18000, color: "hsl(var(--chart-4))" },
  { name: "أخرى", value: 19800, color: "hsl(var(--chart-5))" },
];

export function CostBreakdownChart() {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="p-6" data-testid="chart-cost-breakdown">
      <h3 className="text-xl font-bold mb-4">توزيع التكاليف</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                direction: 'rtl'
              }}
              formatter={(value: number) => `${value.toLocaleString()} ج`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 text-center">
        <p className="text-sm text-muted-foreground">إجمالي التكاليف</p>
        <p className="text-2xl font-bold">{total.toLocaleString()} جنيه</p>
      </div>
    </Card>
  );
}
