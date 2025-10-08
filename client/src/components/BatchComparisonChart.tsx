import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const data = [
  { batch: "الدفعة 1", adg: 0.92, fcr: 3.0, cost: 2200 },
  { batch: "الدفعة 2", adg: 0.88, fcr: 3.1, cost: 2350 },
  { batch: "الدفعة 3", adg: 0.85, fcr: 3.2, cost: 2450 },
];

export function BatchComparisonChart() {
  return (
    <Card className="p-6" data-testid="chart-batch-comparison">
      <h3 className="text-xl font-bold mb-4">مقارنة أداء الدفعات</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis dataKey="batch" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '0.5rem',
                direction: 'rtl'
              }}
            />
            <Legend wrapperStyle={{ direction: 'rtl' }} />
            <Bar dataKey="adg" fill="hsl(var(--primary))" name="ADG (كجم/يوم)" />
            <Bar dataKey="fcr" fill="hsl(var(--chart-2))" name="FCR" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
