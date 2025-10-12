import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Tag, Edit, Trash2, Wallet, Pill, Users, Zap, Wrench, Truck, Home, Shield, TrendingUp, FileText, HardHat, Sparkles, DollarSign, Receipt } from "lucide-react";

interface ExpenseCardProps {
  date: string;
  category: string;
  amount: number;
  description: string;
  expenseType?: "feed" | "medicine" | "salary" | "utilities" | "maintenance" | "transport" | "rent" | "insurance" | "marketing" | "consultation" | "equipment" | "cleaning" | "security" | "taxes" | "other";
  employeeName?: string;
  employeePosition?: string;
  salaryMonth?: string;
  paymentMethod?: string;
  notes?: string;
}

export function ExpenseCard({ 
  date, 
  category, 
  amount, 
  description, 
  expenseType = "other",
  employeeName,
  employeePosition,
  salaryMonth,
  paymentMethod,
  notes
}: ExpenseCardProps) {
  
  const expenseConfig = {
    feed: { 
      icon: Wallet, 
      color: "bg-green-100 text-green-700 border-green-200",
      bgColor: "bg-green-50"
    },
    medicine: { 
      icon: Pill, 
      color: "bg-blue-100 text-blue-700 border-blue-200",
      bgColor: "bg-blue-50"
    },
    salary: { 
      icon: Users, 
      color: "bg-purple-100 text-purple-700 border-purple-200",
      bgColor: "bg-purple-50"
    },
    utilities: { 
      icon: Zap, 
      color: "bg-yellow-100 text-yellow-700 border-yellow-200",
      bgColor: "bg-yellow-50"
    },
    maintenance: { 
      icon: Wrench, 
      color: "bg-orange-100 text-orange-700 border-orange-200",
      bgColor: "bg-orange-50"
    },
    transport: { 
      icon: Truck, 
      color: "bg-indigo-100 text-indigo-700 border-indigo-200",
      bgColor: "bg-indigo-50"
    },
    rent: { 
      icon: Home, 
      color: "bg-red-100 text-red-700 border-red-200",
      bgColor: "bg-red-50"
    },
    insurance: { 
      icon: Shield, 
      color: "bg-teal-100 text-teal-700 border-teal-200",
      bgColor: "bg-teal-50"
    },
    marketing: { 
      icon: TrendingUp, 
      color: "bg-pink-100 text-pink-700 border-pink-200",
      bgColor: "bg-pink-50"
    },
    consultation: { 
      icon: FileText, 
      color: "bg-cyan-100 text-cyan-700 border-cyan-200",
      bgColor: "bg-cyan-50"
    },
    equipment: { 
      icon: HardHat, 
      color: "bg-amber-100 text-amber-700 border-amber-200",
      bgColor: "bg-amber-50"
    },
    cleaning: { 
      icon: Sparkles, 
      color: "bg-lime-100 text-lime-700 border-lime-200",
      bgColor: "bg-lime-50"
    },
    security: { 
      icon: Shield, 
      color: "bg-gray-100 text-gray-700 border-gray-200",
      bgColor: "bg-gray-50"
    },
    taxes: { 
      icon: Receipt, 
      color: "bg-slate-100 text-slate-700 border-slate-200",
      bgColor: "bg-slate-50"
    },
    other: { 
      icon: DollarSign, 
      color: "bg-neutral-100 text-neutral-700 border-neutral-200",
      bgColor: "bg-neutral-50"
    },
  };

  const config = expenseConfig[expenseType];
  const Icon = config.icon;

  const paymentMethodLabels: Record<string, string> = {
    cash: "💵 نقدي",
    bank_transfer: "🏦 تحويل بنكي",
    check: "📝 شيك",
    credit: "💳 آجل"
  };

  return (
    <Card className={`p-5 hover-elevate transition-all border-l-4 ${config.bgColor}`} data-testid="card-expense">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className={`p-2 rounded-lg ${config.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <Badge className={config.color}>
              <Tag className="w-3 h-3 ml-1" />
              {category}
            </Badge>
            {paymentMethod && (
              <Badge variant="outline" className="text-xs">
                {paymentMethodLabels[paymentMethod] || paymentMethod}
              </Badge>
            )}
          </div>
          
          <p className="font-medium mb-2">{description}</p>
          
          {/* Salary-specific details */}
          {expenseType === "salary" && employeeName && (
            <div className="bg-purple-100 border border-purple-200 rounded-lg p-3 mb-2">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-muted-foreground">الموظف:</span>
                  <span className="font-medium mr-2">{employeeName}</span>
                </div>
                {employeePosition && (
                  <div>
                    <span className="text-muted-foreground">الوظيفة:</span>
                    <span className="font-medium mr-2">{employeePosition}</span>
                  </div>
                )}
                {salaryMonth && (
                  <div className="col-span-2">
                    <span className="text-muted-foreground">شهر الراتب:</span>
                    <span className="font-medium mr-2">{new Date(salaryMonth + "-01").toLocaleDateString('ar-EG', { year: 'numeric', month: 'long' })}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {notes && (
            <p className="text-xs text-muted-foreground italic bg-white/50 p-2 rounded mt-2">
              📝 {notes}
            </p>
          )}
          
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
            <Calendar className="w-3 h-3" />
            <span>{date}</span>
          </div>
        </div>
        
        <div className="text-left">
          <p className="text-3xl font-bold text-primary" data-testid="text-amount">
            {amount.toLocaleString()}
          </p>
          <p className="text-xs text-muted-foreground mb-3">جنيه</p>
          
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="h-8 px-2">
              <Edit className="w-3 h-3" />
            </Button>
            <Button size="sm" variant="ghost" className="h-8 px-2 text-destructive">
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
