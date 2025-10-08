import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";

interface QuickActionButtonProps {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  variant?: "default" | "outline" | "secondary";
}

export function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  variant = "default",
}: QuickActionButtonProps) {
  return (
    <Button
      variant={variant}
      className="h-auto py-6 px-6 flex flex-col items-center gap-3"
      onClick={onClick}
      data-testid={`button-${label.toLowerCase().replace(/\s+/g, '-')}`}
    >
      <Icon className="w-8 h-8" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
