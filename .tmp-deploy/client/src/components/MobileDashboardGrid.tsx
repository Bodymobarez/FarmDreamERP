import { Link } from "wouter";
import { 
  Beef, 
  Weight, 
  Package, 
  Syringe, 
  Receipt, 
  Users, 
  TrendingUp,
  ShoppingCart,
  Building2,
  ClipboardList,
  DollarSign,
  BarChart3,
  Home,
  FileText,
  Target,
  BookOpen,
  Box,
  Settings,
  UserCog
} from "lucide-react";
import { Card } from "@/components/ui/card";

interface MobileAppButtonProps {
  icon: React.ElementType;
  title: string;
  subtitle: string;
  href: string;
  color: string;
  bgGradient: string;
}

function MobileAppButton({ icon: Icon, title, subtitle, href, color, bgGradient }: MobileAppButtonProps) {
  return (
    <Link href={href}>
      <Card className="relative overflow-hidden border border-emerald-200/50 bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:scale-95 cursor-pointer h-32 hover:border-emerald-400">
        <div className="relative p-4 h-full flex flex-col justify-between">
          <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center shadow-md`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg text-gray-900">{title}</h3>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

export function MobileDashboardGrid() {
  const apps = [
    {
      icon: Target,
      title: "الأهداف",
      subtitle: "تتبع الأهداف",
      href: "/goals",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      icon: UserCog,
      title: "مديول العامل",
      subtitle: "دخول وصرف",
      href: "/worker",
      color: "bg-gradient-to-br from-indigo-500 to-purple-600",
      bgGradient: "from-indigo-50 to-purple-100"
    },
    {
      icon: ShoppingCart,
      title: "الاستقبالات",
      subtitle: "استقبال دفعات",
      href: "/receptions",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      bgGradient: "from-emerald-50 to-emerald-100"
    },
    {
      icon: Home,
      title: "العنابر والدفعات",
      subtitle: "إدارة العنابر",
      href: "/pens-batches",
      color: "bg-gradient-to-br from-amber-500 to-amber-600",
      bgGradient: "from-amber-50 to-amber-100"
    },
    {
      icon: Beef,
      title: "الحيوانات",
      subtitle: "إدارة القطيع",
      href: "/animals",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100"
    },
    {
      icon: Weight,
      title: "الأوزان",
      subtitle: "تسجيل الأوزان",
      href: "/weights",
      color: "bg-gradient-to-br from-violet-500 to-violet-600",
      bgGradient: "from-violet-50 to-violet-100"
    },
    {
      icon: Syringe,
      title: "العلاجات",
      subtitle: "الرعاية البيطرية",
      href: "/treatments",
      color: "bg-gradient-to-br from-red-500 to-red-600",
      bgGradient: "from-red-50 to-red-100"
    },
    {
      icon: Package,
      title: "المخزون",
      subtitle: "إدارة المخازن",
      href: "/inventory",
      color: "bg-gradient-to-br from-cyan-500 to-cyan-600",
      bgGradient: "from-cyan-50 to-cyan-100"
    },
    {
      icon: Box,
      title: "حركات المخزون",
      subtitle: "سجل الوارد والمنصرف",
      href: "/inventory-transactions",
      color: "bg-gradient-to-br from-teal-500 to-teal-600",
      bgGradient: "from-teal-50 to-teal-100"
    },
    {
      icon: Users,
      title: "العملاء",
      subtitle: "إدارة العملاء",
      href: "/customers",
      color: "bg-gradient-to-br from-pink-500 to-pink-600",
      bgGradient: "from-pink-50 to-pink-100"
    },
    {
      icon: Building2,
      title: "الموردين",
      subtitle: "إدارة الموردين",
      href: "/suppliers",
      color: "bg-gradient-to-br from-indigo-500 to-indigo-600",
      bgGradient: "from-indigo-50 to-indigo-100"
    },
    {
      icon: Receipt,
      title: "المصروفات",
      subtitle: "تسجيل المصروفات",
      href: "/expenses",
      color: "bg-gradient-to-br from-orange-500 to-orange-600",
      bgGradient: "from-orange-50 to-orange-100"
    },
    {
      icon: DollarSign,
      title: "المحاسبة",
      subtitle: "الحسابات المالية",
      href: "/accounts",
      color: "bg-gradient-to-br from-green-500 to-green-600",
      bgGradient: "from-green-50 to-green-100"
    },
    {
      icon: ClipboardList,
      title: "المعاملات",
      subtitle: "سجل المعاملات",
      href: "/transactions",
      color: "bg-gradient-to-br from-sky-500 to-sky-600",
      bgGradient: "from-sky-50 to-sky-100"
    },
    {
      icon: BarChart3,
      title: "التقارير المالية",
      subtitle: "الأرباح والخسائر",
      href: "/profit-loss-report",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      bgGradient: "from-purple-50 to-purple-100"
    },
    {
      icon: BookOpen,
      title: "القيود اليومية",
      subtitle: "السجل المحاسبي",
      href: "/journal-entries",
      color: "bg-gradient-to-br from-rose-500 to-rose-600",
      bgGradient: "from-rose-50 to-rose-100"
    },
    {
      icon: FileText,
      title: "السندات",
      subtitle: "سندات القبض والصرف",
      href: "/vouchers",
      color: "bg-gradient-to-br from-lime-500 to-lime-600",
      bgGradient: "from-lime-50 to-lime-100"
    },
    {
      icon: Target,
      title: "مراكز التكلفة",
      subtitle: "إدارة التكاليف",
      href: "/cost-centers",
      color: "bg-gradient-to-br from-yellow-500 to-yellow-600",
      bgGradient: "from-yellow-50 to-yellow-100"
    },
    {
      icon: TrendingUp,
      title: "مؤشرات الأداء",
      subtitle: "KPI Dashboard",
      href: "/kpi",
      color: "bg-gradient-to-br from-blue-600 to-indigo-600",
      bgGradient: "from-blue-50 to-indigo-100"
    },
    {
      icon: Settings,
      title: "الإعدادات",
      subtitle: "إعدادات النظام",
      href: "/settings",
      color: "bg-gradient-to-br from-slate-500 to-slate-600",
      bgGradient: "from-slate-50 to-slate-100"
    }
  ];

  return (
    <div className="space-y-6">
      {/* App Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-6 gap-3 sm:gap-4">
        {apps.map((app, index) => (
          <MobileAppButton key={index} {...app} />
        ))}
      </div>
    </div>
  );
}

