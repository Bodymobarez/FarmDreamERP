import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider, useQuery } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ThemeToggle } from "@/components/ThemeToggle";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import KPI from "@/pages/KPI";
import Animals from "@/pages/Animals";
import Weights from "@/pages/Weights";
import PensBatches from "@/pages/PensBatches";
import Inventory from "@/pages/Inventory";
import InventoryTransactions from "@/pages/InventoryTransactions";
import Treatments from "@/pages/Treatments";
import Expenses from "@/pages/Expenses";
import Receptions from "@/pages/Receptions";
import Accounts from "@/pages/Accounts";
import Suppliers from "@/pages/Suppliers";
import Customers from "@/pages/Customers";
import Transactions from "@/pages/Transactions";
import Vouchers from "@/pages/Vouchers";
import CostCenter from "@/pages/CostCenter";
import CostCenters from "@/pages/CostCenters";
import CostCenterDetails from "@/pages/CostCenterDetails";
import ProfitLossReport from "@/pages/ProfitLossReport";
import Goals from "@/pages/Goals";
import FinancialReports from "@/pages/FinancialReports";
import JournalEntries from "@/pages/JournalEntries";
import Settings from "@/pages/Settings";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/goals" component={Goals} />
      <Route path="/goals/kpi" component={KPI} />
      <Route path="/kpi" component={KPI} />
      <Route path="/animals" component={Animals} />
      <Route path="/receptions" component={Receptions} />
      <Route path="/accounts" component={Accounts} />
      <Route path="/suppliers" component={Suppliers} />
      <Route path="/customers" component={Customers} />
      <Route path="/transactions" component={Transactions} />
      <Route path="/vouchers" component={Vouchers} />
      <Route path="/cost-center" component={CostCenter} />
      <Route path="/cost-centers" component={CostCenters} />
      <Route path="/cost-center/:id" component={CostCenterDetails} />
      <Route path="/profit-loss-report" component={ProfitLossReport} />
      <Route path="/financial-reports" component={FinancialReports} />
      <Route path="/journal-entries" component={JournalEntries} />
      <Route path="/weights" component={Weights} />
      <Route path="/pens-batches" component={PensBatches} />
      <Route path="/inventory" component={Inventory} />
      <Route path="/inventory-transactions" component={InventoryTransactions} />
      <Route path="/treatments" component={Treatments} />
      <Route path="/expenses" component={Expenses} />
      <Route path="/settings" component={Settings} />
      <Route component={NotFound} />
    </Switch>
  );
}

function AppContent() {
  // جلب البيانات الحقيقية
  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // حساب الإحصائيات
  const totalAnimals = animals.length;
  const avgWeight = animals.length > 0 ? 
    animals.reduce((sum, a) => sum + parseFloat(a.currentWeight || '0'), 0) / animals.length : 0;

  const style = {
    "--sidebar-width": "14rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties} defaultOpen={true}>
      <div className="flex h-screen w-full relative overflow-hidden">
        {/* Animated background overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-background via-muted/20 to-background"></div>
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float"></div>
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-secondary/10 rounded-full blur-3xl animate-float" style={{animationDelay: '3s'}}></div>
            <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-accent/10 rounded-full blur-3xl animate-float" style={{animationDelay: '6s'}}></div>
          </div>
        </div>
        
        {/* Elite Sidebar - moved to right */}
        <AppSidebar />
        
        <div className="flex flex-col flex-1 overflow-hidden ml-0 relative z-10">
          {/* Elite Header */}
          <header className="glass sticky top-0 z-20 border-b border-border/50">
            <div className="flex items-center justify-between p-6">
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                <ThemeToggle />
                <div className="hidden md:flex items-center space-x-2 rtl:space-x-reverse text-sm text-black/70">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <span>النظام متصل</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-4 rtl:space-x-reverse">
                {/* Status indicators */}
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                  <div className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full bg-black/10 text-black text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
                    <span>{totalAnimals.toLocaleString()} حيوان</span>
                  </div>
                  <div className="flex items-center space-x-1 rtl:space-x-reverse px-3 py-1 rounded-full bg-black/10 text-black text-xs font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-black animate-pulse"></div>
                    <span>{avgWeight.toFixed(0)} كجم متوسط</span>
                  </div>
                </div>
                
                <SidebarTrigger 
                  data-testid="button-sidebar-toggle" 
                  className="elite-button px-3 py-2 rounded-lg"
                />
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="h-0.5 bg-muted overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary via-secondary to-accent animate-shimmer w-full"></div>
            </div>
          </header>
          
          {/* Elite Main Content */}
          <main className="flex-1 overflow-y-auto relative">
            {/* Scrolling background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="absolute inset-0" style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, hsl(var(--primary)) 0%, transparent 50%),
                                 radial-gradient(circle at 75% 75%, hsl(var(--secondary)) 0%, transparent 50%)`
              }}></div>
            </div>
            
            <div className="relative z-10 p-8">
              <div className="max-w-full mx-auto">
                <Router />
              </div>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  console.log('=== App component rendering ===');

  try {
    return (
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppContent />
        </TooltipProvider>
        <Toaster />
      </QueryClientProvider>
    );
  } catch (error) {
    console.error('Error in App component:', error);
    return (
      <div className="p-4">
        <h1>خطأ في تحميل التطبيق</h1>
        <p>حدث خطأ أثناء تحميل التطبيق. يرجى إعادة تحميل الصفحة.</p>
      </div>
    );
  }
}
