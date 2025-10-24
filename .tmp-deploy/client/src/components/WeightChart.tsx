import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

interface WeightDataPoint {
  month: string;
  weight: number;
}

const data: WeightDataPoint[] = [
  { month: "يناير", weight: 420 },
  { month: "فبراير", weight: 435 },
  { month: "مارس", weight: 450 },
  { month: "أبريل", weight: 468 },
  { month: "مايو", weight: 485 },
  { month: "يونيو", weight: 502 },
];

export function WeightChart() {
  return (
    <div className="premium-card rounded-3xl p-8 relative overflow-hidden group">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-30 group-hover:opacity-50 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-chart-1/10 via-chart-2/10 to-chart-3/10 animate-pulse-glow"></div>
      </div>
      
      {/* Floating elements */}
      <div className="absolute top-4 right-4 w-3 h-3 bg-primary/30 rounded-full animate-float"></div>
      <div className="absolute bottom-4 left-4 w-2 h-2 bg-secondary/30 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute top-1/2 left-1/4 w-1 h-1 bg-accent/30 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-black">
            تطور الأوزان المتقدم
          </h3>
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
            <div className="w-3 h-3 rounded-full bg-secondary animate-pulse" style={{animationDelay: '0.5s'}}></div>
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>
        
        <div className="h-72 relative">
          {/* Chart container with glass effect */}
          <div className="absolute inset-0 glass rounded-2xl"></div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge> 
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid 
                strokeDasharray="3 3" 
                className="opacity-20" 
                stroke="hsl(var(--muted-foreground))"
              />
              <XAxis 
                dataKey="month" 
                className="text-xs"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <YAxis 
                className="text-xs"
                tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--primary))',
                  borderRadius: '12px',
                  boxShadow: '0 20px 40px hsl(var(--foreground) / 0.1), 0 0 20px hsl(var(--primary) / 0.3)',
                  backdropFilter: 'blur(20px)'
                }}
                labelStyle={{ color: 'hsl(var(--primary))' }}
              />
              <Area
                type="monotone"
                dataKey="weight"
                stroke="hsl(var(--primary))"
                fillOpacity={1}
                fill="url(#weightGradient)"
                strokeWidth={0}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                filter="url(#glow)"
                dot={{ 
                  fill: 'hsl(var(--primary))', 
                  strokeWidth: 3, 
                  r: 6,
                  stroke: 'hsl(var(--background))',
                  filter: 'drop-shadow(0 0 6px hsl(var(--primary)))'
                }}
                activeDot={{ 
                  r: 8, 
                  stroke: 'hsl(var(--primary))', 
                  strokeWidth: 3,
                  fill: 'hsl(var(--background))',
                  filter: 'drop-shadow(0 0 10px hsl(var(--primary)))'
                }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Stats footer */}
        <div className="mt-6 flex justify-between items-center text-sm">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-black/70">متوسط النمو الشهري</span>
            <span className="font-bold text-black">+2.3%</span>
          </div>
          <div className="px-3 py-1 rounded-full bg-black/10 text-black text-xs font-semibold">
            تحديث مباشر
          </div>
        </div>
      </div>
    </div>
  );
}
