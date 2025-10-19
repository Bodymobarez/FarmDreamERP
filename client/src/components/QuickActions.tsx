import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Zap } from "lucide-react";

export function QuickActions() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Button 
        size="lg"
        className="h-14 w-14 rounded-full bg-gradient-to-br from-emerald-500 to-green-500 hover:from-emerald-600 hover:to-green-600 shadow-2xl hover:shadow-emerald-500/50 transition-all duration-300 hover:scale-110 active:scale-95"
        onClick={() => setOpen(!open)}
      >
        <Zap className="w-6 h-6 text-white" />
      </Button>
    </div>
  );
}
