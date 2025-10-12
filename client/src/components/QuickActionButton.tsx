import { LucideIcon } from "lucide-react";
import React from "react";

interface QuickActionButtonProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: "default" | "outline" | "secondary";
}

export function QuickActionButton({ title, description, icon, onClick, variant = "default" }: QuickActionButtonProps) {
  return (
    <button
      onClick={onClick}
      className="elite-button w-full p-6 text-left rounded-2xl group relative overflow-hidden transform transition-all duration-300 hover:scale-105"
    >
      {/* Dynamic background patterns */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-secondary/20 to-accent/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1),transparent_50%)]">
        </div>
      </div>
      
      {/* Floating orbs */}
      <div className="absolute top-2 right-2 w-2 h-2 bg-primary/40 rounded-full animate-pulse group-hover:animate-bounce"></div>
      <div className="absolute bottom-2 left-2 w-1 h-1 bg-secondary/40 rounded-full animate-pulse group-hover:animate-bounce" style={{animationDelay: '0.5s'}}></div>
      
      <div className="relative z-10">
        <div className="flex items-center space-x-4 rtl:space-x-reverse">
          <div className="flex-shrink-0 relative">
            <div className="w-14 h-14 bg-gradient-to-br from-primary/20 to-primary/10 rounded-2xl flex items-center justify-center text-primary group-hover:from-primary/30 group-hover:to-primary/20 transition-all duration-300 group-hover:rotate-12 group-hover:scale-110">
              <div className="animate-pulse-glow">
                {icon}
              </div>
            </div>
            {/* Glow effect */}
            <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
          </div>
          <div className="flex-1 min-w-0 space-y-2">
            <p className="text-base font-bold text-black group-hover:text-white transition-colors duration-300">
              {title}
            </p>
            <p className="text-sm text-black/80 group-hover:text-white/90 transition-colors duration-300">
              {description}
            </p>
            
            {/* Progress indicator */}
            <div className="w-full h-0.5 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-white/50 to-white/80 rounded-full transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
            </div>
          </div>
          
          {/* Arrow indicator */}
          <div className="flex-shrink-0 transform group-hover:translate-x-2 rtl:group-hover:-translate-x-2 transition-transform duration-300">
            <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center group-hover:bg-white/30 transition-colors duration-300">
              <svg className="w-4 h-4 text-primary-foreground group-hover:text-white transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}
