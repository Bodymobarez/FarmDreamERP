import { Card } from "@/components/ui/card";
import { LucideIcon, ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import React from "react";

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  change?: string;
  trend?: "up" | "down";
  color?: "primary" | "secondary" | "success" | "warning";
}

export function KPICard({ title, value, subtitle, icon, change, trend, color = "primary" }: KPICardProps) {
  return (
    <div className="premium-card rounded-2xl p-6 group relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 animate-pulse-glow"></div>
      </div>
      
      {/* Shimmer effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-black/70 tracking-wide">{title}</p>
            <p className="text-3xl font-bold text-black">
              {value}
            </p>
            {subtitle && (
              <p className="text-xs text-black/60">{subtitle}</p>
            )}
          </div>
          <div className="flex flex-col items-end space-y-3">
            <div className="p-3 rounded-full bg-gradient-to-br from-primary/20 to-primary/10 group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 animate-float">
              <div className="text-primary group-hover:scale-110 transition-transform duration-300">
                {icon}
              </div>
            </div>
            {change && trend && (
              <div className={`flex items-center text-sm font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
                trend === "up" 
                  ? "text-green-600 bg-green-50 dark:bg-green-900/20 group-hover:bg-green-100 dark:group-hover:bg-green-900/30" 
                  : "text-red-600 bg-red-50 dark:bg-red-900/20 group-hover:bg-red-100 dark:group-hover:bg-red-900/30"
              }`}>
                {trend === "up" ? (
                  <ArrowUpIcon className="mr-1 h-4 w-4 animate-bounce" />
                ) : (
                  <ArrowDownIcon className="mr-1 h-4 w-4 animate-bounce" />
                )}
                {change}
              </div>
            )}
          </div>
        </div>
        
        {/* Progress bar at bottom */}
        <div className="mt-4 h-1 bg-muted rounded-full overflow-hidden">
          <div className={`h-full rounded-full transition-all duration-1000 animate-shimmer ${
            trend === "up" 
              ? "bg-gradient-to-r from-green-400 to-green-600 w-3/4" 
              : trend === "down"
              ? "bg-gradient-to-r from-red-400 to-red-600 w-1/2"
              : "bg-gradient-to-r from-primary to-primary/70 w-2/3"
          }`}></div>
        </div>
      </div>
    </div>
  );
}
