import { MobileDashboardGrid } from "@/components/MobileDashboardGrid";
import { QuickActions } from "@/components/QuickActions";
import { ActivityReport } from "@/components/ActivityReport";

export default function Dashboard() {
  console.log('🔵 Dashboard component rendering...');

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        {/* App Grid - Only buttons, clean design */}
        <MobileDashboardGrid />

        {/* Activity Report - Below apps */}
        <ActivityReport />
      </div>

      {/* Quick Actions FAB - Fixed bottom left */}
      <QuickActions />
    </div>
  );
}
