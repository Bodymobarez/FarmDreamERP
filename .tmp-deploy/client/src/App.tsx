import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { EnhancedHeader } from "@/components/EnhancedHeader";
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
import Worker from "@/pages/Worker";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/worker" component={Worker} />
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
  return (
    <div className="flex h-screen w-full relative overflow-hidden bg-white">
      {/* Clean background - Green & White theme */}
      
      <div className="flex flex-col flex-1 overflow-hidden relative">
        {/* Enhanced Header */}
        <EnhancedHeader />
        
        {/* Clean Main Content */}
        <main className="flex-1 overflow-y-auto relative bg-white">
          <div className="relative">
            <Router />
          </div>
        </main>
      </div>
    </div>
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
