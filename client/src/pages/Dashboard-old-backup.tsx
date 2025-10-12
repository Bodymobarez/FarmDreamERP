import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { KPICard } from "@/components/KPICard";
import { WeightChart } from "@/components/WeightChart";
import { QuickActionButton } from "@/components/QuickActionButton";
import { AddReceptionDialog } from "@/components/AddReceptionDialog";
import { AddBatchDialog } from "@/components/AddBatchDialog";
import { AddWeightDialog } from "@/components/AddWeightDialog";
import { AddTreatmentDialog } from "@/components/AddTreatmentDialog";
import { AddExpenseDialog } from "@/components/AddExpenseDialog";
import { AddInventoryDialog } from "@/components/AddInventoryDialog";
import { TrendingUp, Scale, Box, Beef, Plus, Stethoscope, DollarSign, Package, TruckIcon } from "lucide-react";

export default function Dashboard() {
  // Fetch real data from API
  const { data: animalsData } = useQuery({
    queryKey: ["/api/animals"],
  });
  const animals = (animalsData as any[]) || [];

  const { data: weightsData } = useQuery({
    queryKey: ["/api/weights"],
  });
  const weights = (weightsData as any[]) || [];

  const { data: batchesData } = useQuery({
    queryKey: ["/api/batches"],
  });
  const batches = (batchesData as any[]) || [];

  const { data: expensesData } = useQuery({
    queryKey: ["/api/expenses"],
  });
  const expenses = (expensesData as any[]) || [];

  // Calculate KPIs
  const totalAnimals = animals.length;
  const avgWeight = weights.length > 0
    ? (weights.reduce((sum: number, w: any) => sum + parseFloat(w.weight || 0), 0) / weights.length).toFixed(1)
    : "0";
  
  // حساب التكاليف بشكل صحيح من الدفعات
  const totalExpenses = batches.reduce((sum: number, batch: any) => {
    const batchTotalCost = parseFloat(batch.totalCost || 0);
    return sum + batchTotalCost;
  }, 0);
  
  // حساب تكلفة الأعلاف من الدفعات
  const feedExpenses = batches.reduce((sum: number, batch: any) => {
    const batchFeedCost = parseFloat(batch.feedCost || 0);
    return sum + batchFeedCost;
  }, 0);

  const activeBatches = batches.filter((b: any) => b.status === "active").length;

  return (
    <div className="relative">
      {/* Floating Particles Background */}
      <div className="particles">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 6}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="space-y-8 relative z-10">
        {/* Elite Header */}
        <div className="glass rounded-2xl p-6 animate-slide-up">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-black">
                نظام إدارة المزرعة المتطور
              </h1>
              <p className="text-black/70 mt-2">لوحة التحكم الرئيسية - إدارة شاملة ومتقدمة</p>
            </div>
            <div className="animate-pulse-glow">
              <div className="w-16 h-16 rounded-full animated-bg flex items-center justify-center">
                <TrendingUp className="h-8 w-8 text-primary-foreground animate-float" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Elite KPI Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div className="animate-slide-up" style={{animationDelay: '0.1s'}}>
            <KPICard
              title="إجمالي الحيوانات"
              value={totalAnimals.toString()}
              change={totalAnimals > 0 ? "+12.3%" : "0%"}
              trend={totalAnimals > 0 ? "up" : undefined}
              icon={<Beef className="h-5 w-5" />}
            />
          </div>
          <div className="animate-slide-up" style={{animationDelay: '0.2s'}}>
            <KPICard
              title="الوزن المتوسط"
              value={`${avgWeight} كجم`}
              change="+2.1%"
              trend="up"
              icon={<Scale className="h-5 w-5" />}
            />
          </div>
          <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
            <KPICard
              title="استهلاك الأعلاف"
              value={`ج.م ${feedExpenses.toLocaleString()}`}
              change="-5.2%"
              trend="down"
              icon={<Box className="h-5 w-5" />}
            />
          </div>
          <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
            <KPICard
              title="الدفعات النشطة"
              value={activeBatches.toString()}
              change="+0.8%"
              trend="up"
              icon={<TrendingUp className="h-5 w-5" />}
            />
          </div>
        </div>

        {/* Elite Charts Section */}
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8 animate-slide-right" style={{animationDelay: '0.5s'}}>
            <WeightChart />
          </div>
          <div className="space-y-8 animate-slide-right" style={{animationDelay: '0.6s'}}>
            <div className="glass-dark rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-6 text-center text-black">
                الإجراءات السريعة
              </h3>
              <div className="grid gap-3">
                <div className="animate-scale-in" style={{animationDelay: '0.7s'}}>
                  <AddReceptionDialog />
                </div>
                <div className="animate-scale-in" style={{animationDelay: '0.75s'}}>
                  <AddBatchDialog />
                </div>
                <div className="animate-scale-in" style={{animationDelay: '0.8s'}}>
                  <AddWeightDialog />
                </div>
                <div className="animate-scale-in" style={{animationDelay: '0.85s'}}>
                  <AddTreatmentDialog />
                </div>
                <div className="animate-scale-in" style={{animationDelay: '0.9s'}}>
                  <AddExpenseDialog />
                </div>
                <div className="animate-scale-in" style={{animationDelay: '0.95s'}}>
                  <AddInventoryDialog />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Elite Stats Banner */}
        <div className="premium-card rounded-3xl p-8 animate-slide-up" style={{animationDelay: '1s'}}>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-black">
                {totalAnimals > 0 ? "98.5%" : "0%"}
              </div>
              <div className="text-sm text-black/70">معدل البقاء على قيد الحياة</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-black">
                ج.م {totalExpenses.toLocaleString()}
              </div>
              <div className="text-sm text-black/70">إجمالي المصروفات</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-black">
                {batches.length}
              </div>
              <div className="text-sm text-black/70">إجمالي الدفعات</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}