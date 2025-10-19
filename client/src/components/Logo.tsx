import { Building2, Sprout } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
}

export function Logo({ size = "md", showText = true }: LogoProps) {
  const sizes = {
    sm: { container: "w-8 h-8", icon: "w-4 h-4", text: "text-sm" },
    md: { container: "w-10 h-10", icon: "w-5 h-5", text: "text-base" },
    lg: { container: "w-12 h-12", icon: "w-6 h-6", text: "text-lg" }
  };

  const current = sizes[size];

  return (
    <div className="flex items-center gap-2">
      <div className={`${current.container} bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-white/20"></div>
        
        {/* Icon */}
        <div className="relative flex items-center justify-center">
          <Sprout className={`${current.icon} text-white`} />
        </div>
      </div>
      
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${current.text} font-bold bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-transparent tracking-tight`}>
            FarmDream
          </span>
          <span className="text-xs text-gray-500 -mt-1">ERP System</span>
        </div>
      )}
    </div>
  );
}

