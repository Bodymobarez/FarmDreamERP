import {
  LayoutDashboard,
  Beef,
  Scale,
  Box,
  Stethoscope,
  Wallet,
  BarChart3,
  Settings,
  Home,
  TrendingUp,
  Package,
  Receipt,
  DollarSign,
  Target,
  FileBarChart,
  History,
  ChevronDown,
  UserPlus,
  Users,
  ShoppingCart,
  ScrollText,
  Bell,
  Activity,
  Zap,
  Star
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "wouter";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";

const menuItems = [
  {
    title: "لوحة التحكم",
    url: "/",
    icon: LayoutDashboard,
    badge: null,
    color: "text-blue-500",
  },
  {
    title: "العنابر والدفعات",
    url: "/pens-batches",
    icon: Home,
    badge: null,
    color: "text-cyan-500",
  },
  {
    title: "استقبال الدفعات",
    url: "/receptions",
    icon: Package,
    badge: null,
    color: "text-orange-500",
  },
  {
    title: "الحيوانات",
    url: "/animals",
    icon: Beef,
    badge: null, // سيتم تحديدها من البيانات الحقيقية
    color: "text-red-500",
  },
  {
    title: "الأوزان",
    url: "/weights",
    icon: Scale,
    badge: null,
    color: "text-yellow-500",
  },
  {
    title: "الأعلاف والمخزون",
    url: "/inventory",
    icon: Box,
    badge: null,
    color: "text-amber-500",
    subItems: [
      {
        title: "سجل حركات المخزون",
        url: "/inventory-transactions",
        icon: History,
      }
    ]
  },
  {
    title: "العلاجات البيطرية",
    url: "/treatments",
    icon: Stethoscope,
    badge: null,
    color: "text-pink-500",
  },
  {
    title: "الحسابات",
    url: "/accounts",
    icon: Receipt,
    badge: null,
    color: "text-emerald-500",
    subItems: [
      {
        title: "العملاء",
        url: "/customers",
        icon: UserPlus,
      },
      {
        title: "الموردين",
        url: "/suppliers",
        icon: Users,
      },
      {
        title: "المعاملات المالية",
        url: "/transactions",
        icon: DollarSign,
      },
      {
        title: "سندات القبض والصرف",
        url: "/vouchers",
        icon: Receipt,
        badge: "🆕",
      },
      {
        title: "المصروفات",
        url: "/expenses",
        icon: ShoppingCart,
      },
      {
        title: "سندات القيد",
        url: "/journal-entries",
        icon: ScrollText,
      },
      {
        title: "التقارير المالية",
        url: "/financial-reports",
        icon: BarChart3,
      },
    ]
  },
  {
    title: "مركز التكلفة",
    url: "/cost-center",
    icon: BarChart3,
    badge: null,
    color: "text-indigo-500",
  },
  {
    title: "تقرير الأرباح والخسائر",
    url: "/profit-loss-report",
    icon: FileBarChart,
    badge: null,
    color: "text-teal-500",
  },
  {
    title: "الأهداف ومؤشرات الأداء",
    url: "/goals",
    icon: Target,
    badge: "KPI",
    color: "text-purple-500",
    subItems: [
      {
        title: "مؤشرات الأداء",
        url: "/goals/kpi",
        icon: TrendingUp,
      }
    ]
  },
  {
    title: "الإعدادات",
    url: "/settings",
    icon: Settings,
    badge: null,
    color: "text-gray-500",
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const [openMenus, setOpenMenus] = useState<string[]>(["الحسابات", "الأعلاف والمخزون", "الأهداف ومؤشرات الأداء"]);

  // Fetch live data for sidebar stats
  const { data: animalsData } = useQuery({ queryKey: ["/api/animals"] });
  const animals = (animalsData as any[]) || [];
  
  const { data: batchesData } = useQuery({ queryKey: ["/api/batches"] });
  const batches = (batchesData as any[]) || [];
  
  const { data: inventoryData } = useQuery({ queryKey: ["/api/inventory"] });
  const inventory = (inventoryData as any[]) || [];
  
  // Calculate live stats
  const totalAnimals = animals.length;
  const activeBatches = batches.filter((b: any) => b.status === "active").length;
  const totalWeight = animals.reduce((sum: number, animal: any) => {
    return sum + parseFloat(animal.currentWeight || animal.weight || "0");
  }, 0);
  const avgWeight = totalAnimals > 0 ? Math.round(totalWeight / totalAnimals) : 0;
  const lowStockItems = inventory.filter(
    (item: any) => parseFloat(item.currentStock || item.quantity || "0") <= parseFloat(item.minStock || item.minQuantity || "0")
  ).length;

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(t => t !== title)
        : [...prev, title]
    );
  };

  // Update menu items with live data
  const updatedMenuItems = menuItems.map(item => {
    if (item.title === "الحيوانات") {
      return { ...item, badge: totalAnimals.toString() };
    }
    if (item.title === "العنابر والدفعات") {
      return { ...item, badge: activeBatches.toString() };
    }
    if (item.title === "الأعلاف والمخزون") {
      return { ...item, badge: lowStockItems > 0 ? lowStockItems.toString() : null };
    }
    return item;
  });

  return (
    <Sidebar side="left" className="w-80 relative flex flex-col h-screen overflow-hidden">
      {/* Elite background with glass morphism */}
      <div className="absolute inset-0 glass-dark"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-sidebar/90 via-sidebar/70 to-sidebar/90"></div>
      
      {/* Floating particles in sidebar */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-float"
            style={{
              left: `${20 + Math.random() * 60}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>
      
      <div className="relative z-10 flex flex-col h-full">
        {/* Elite Header */}
        <SidebarHeader className="p-4 border-b border-sidebar-border/50 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3 animate-slide-right">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-primary via-primary to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30">
                <Beef className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse"></div>
            </div>
            <div className="flex-1">
              <h2 className="text-base font-bold text-black bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                نظام المزرعة
              </h2>
              <p className="text-[10px] text-black/60 font-medium">Farm Dream ERP v2.0</p>
            </div>
          </div>
          
          {/* Quick Status Bar */}
          <div className="flex items-center justify-between px-2 py-1.5 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200/50">
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-[10px] text-green-700 font-semibold">النظام نشط</span>
            </div>
            <div className="flex items-center gap-1">
              <Activity className="w-3 h-3 text-green-600" />
              <span className="text-[10px] text-green-700 font-bold">100%</span>
            </div>
          </div>
        </SidebarHeader>
        
        {/* Elite Content with Scrollbar */}
        <SidebarContent className="p-3 flex-1 overflow-y-auto custom-scrollbar">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 py-2 text-xs font-bold bg-gradient-to-r from-primary/15 via-emerald-500/10 to-transparent rounded-lg mb-3 flex items-center gap-2">
              <LayoutDashboard className="w-3.5 h-3.5 text-primary" />
              <span className="text-primary">القوائم الرئيسية</span>
              <Badge variant="outline" className="mr-auto h-4 px-1.5 text-[9px] font-bold border-primary/30 text-primary">
                {updatedMenuItems.length}
              </Badge>
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {updatedMenuItems.map((item, index) => (
                  <SidebarMenuItem key={item.title} className={`animate-slide-right`} style={{animationDelay: `${index * 0.1}s`}}>
                    {item.subItems ? (
                      <Collapsible open={openMenus.includes(item.title)} onOpenChange={() => toggleMenu(item.title)}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className={`px-3 py-2 h-10 rounded-xl transition-all duration-300 group relative overflow-hidden justify-start text-right ${
                              location === item.url || item.subItems.some(sub => location === sub.url)
                                ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25' 
                                : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                            }`}
                          >
                            {(location === item.url || item.subItems.some(sub => location === sub.url)) && (
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
                            )}
                            
                            <div className="flex items-center justify-start gap-3 w-full">
                              <div className={`w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                                location === item.url || item.subItems.some(sub => location === sub.url) ? 'animate-pulse-glow' : ''
                              } ${item.color || ''}`}>
                                <item.icon className="w-4 h-4" />
                              </div>
                              <span className="text-[15px] font-semibold relative z-10 flex-1 text-right whitespace-nowrap">{item.title}</span>
                              {item.badge && (
                                <Badge variant="secondary" className="h-5 px-1.5 text-xs font-semibold">
                                  {item.badge}
                                </Badge>
                              )}
                              <ChevronDown className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${openMenus.includes(item.title) ? 'rotate-180' : ''}`} />
                            </div>
                            
                            {(location === item.url || item.subItems.some(sub => location === sub.url)) && (
                              <div className="w-2 h-2 rounded-full bg-primary-foreground/80 animate-pulse absolute left-1 top-1/2 -translate-y-1/2"></div>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub className="ml-4 mt-1 space-y-1 pr-2">
                            {/* عرض المخزون فقط لموديول الأعلاف والمخزون */}
                            {item.title === "الأعلاف والمخزون" && (
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={location === item.url}
                                  className={`px-3 py-2 h-9 rounded-lg transition-all duration-300 justify-start text-right ${
                                    location === item.url
                                      ? 'bg-primary/20 text-primary font-medium' 
                                      : 'hover:bg-sidebar-accent/30'
                                  }`}
                                >
                                  <Link href={item.url}>
                                    <div className="flex items-center justify-start gap-2.5 w-full">
                                      <span className="text-sm text-right flex-1">عرض المخزون</span>
                                    </div>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )}
                            {/* عرض صفحة الحسابات الرئيسية فقط لموديول الحسابات */}
                            {item.title === "الحسابات" && (
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={location === item.url}
                                  className={`px-3 py-2 h-9 rounded-lg transition-all duration-300 justify-start text-right ${
                                    location === item.url
                                      ? 'bg-primary/20 text-primary font-medium' 
                                      : 'hover:bg-sidebar-accent/30'
                                  }`}
                                >
                                  <Link href={item.url}>
                                    <div className="flex items-center justify-start gap-2.5 w-full">
                                      <span className="text-sm text-right flex-1">نظرة عامة</span>
                                    </div>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )}
                            {/* عرض صفحة الأهداف الرئيسية فقط لموديول الأهداف ومؤشرات الأداء */}
                            {item.title === "الأهداف ومؤشرات الأداء" && (
                              <SidebarMenuSubItem>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={location === item.url}
                                  className={`px-3 py-2 h-9 rounded-lg transition-all duration-300 justify-start text-right ${
                                    location === item.url
                                      ? 'bg-primary/20 text-primary font-medium' 
                                      : 'hover:bg-sidebar-accent/30'
                                  }`}
                                >
                                  <Link href={item.url}>
                                    <div className="flex items-center justify-start gap-2.5 w-full">
                                      <span className="text-sm text-right flex-1">لوحة الأهداف</span>
                                    </div>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            )}
                            {item.subItems.map((subItem) => (
                              <SidebarMenuSubItem key={subItem.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={location === subItem.url}
                                  className={`px-3 py-2 h-9 rounded-lg transition-all duration-300 justify-start text-right ${
                                    location === subItem.url
                                      ? 'bg-primary/20 text-primary font-medium' 
                                      : 'hover:bg-sidebar-accent/30'
                                  }`}
                                >
                                  <Link href={subItem.url}>
                                    <div className="flex items-center justify-start gap-2.5 w-full">
                                      <subItem.icon className="w-3.5 h-3.5 flex-shrink-0" />
                                      <span className="text-sm text-right flex-1 whitespace-nowrap">{subItem.title}</span>
                                    </div>
                                  </Link>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </Collapsible>
                    ) : (
                      <SidebarMenuButton
                        asChild
                        isActive={location === item.url}
                        data-testid={`nav-${item.url.replace('/', '') || 'dashboard'}`}
                        className={`px-3 py-2 h-10 rounded-xl transition-all duration-300 group relative overflow-hidden justify-start text-right ${
                          location === item.url 
                            ? 'bg-gradient-to-r from-primary to-primary/80 text-primary-foreground shadow-lg shadow-primary/25' 
                            : 'hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
                        }`}
                      >
                        <Link href={item.url}>
                          {location === item.url && (
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-shimmer"></div>
                          )}
                          
                          <div className="flex items-center justify-start gap-3 w-full">
                            <div className={`w-4 h-4 flex-shrink-0 transition-all duration-300 group-hover:scale-110 ${
                              location === item.url ? 'animate-pulse-glow' : ''
                            } ${item.color || ''}`}>
                              <item.icon className="w-4 h-4" />
                            </div>
                            <span className="text-[15px] font-semibold relative z-10 flex-1 text-right whitespace-nowrap">{item.title}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="h-5 px-1.5 text-xs font-semibold">
                                {item.badge}
                              </Badge>
                            )}
                          </div>
                          
                          {location === item.url && (
                            <div className="w-2 h-2 rounded-full bg-primary-foreground/80 animate-pulse absolute left-1 top-1/2 -translate-y-1/2"></div>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    )}
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        {/* Elite Footer */}
        <SidebarFooter className="p-3 border-t border-sidebar-border/50 flex-shrink-0">
          <div className="space-y-2">
            {/* Quick Stats - Mini Dashboard */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div className="px-2 py-1.5 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100/50 border border-blue-200/50">
                <div className="flex items-center gap-1.5">
                  <Beef className="w-3 h-3 text-blue-600" />
                  <div className="flex-1">
                    <p className="text-[10px] text-blue-600/70 font-medium">الحيوانات</p>
                    <p className="text-xs font-bold text-blue-700">{totalAnimals}</p>
                  </div>
                </div>
              </div>
              
              <div className="px-2 py-1.5 rounded-lg bg-gradient-to-br from-green-50 to-green-100/50 border border-green-200/50">
                <div className="flex items-center gap-1.5">
                  <Scale className="w-3 h-3 text-green-600" />
                  <div className="flex-1">
                    <p className="text-[10px] text-green-600/70 font-medium">متوسط الوزن</p>
                    <p className="text-xs font-bold text-green-700">{avgWeight} كجم</p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Last Update Info */}
            <div className="px-3 py-2 rounded-xl bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
              <div className="flex justify-between items-center mb-1">
                <span className="text-[10px] text-black/60 font-medium">آخر تحديث</span>
                <Star className="w-3 h-3 text-primary animate-pulse" />
              </div>
              <div className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                <span className="text-xs text-black font-semibold">الآن • مباشر</span>
              </div>
            </div>
            
            {/* Settings Button */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  data-testid="nav-settings" 
                  className="px-3 py-2 h-9 rounded-xl hover:bg-sidebar-accent/50 transition-all duration-300 group relative overflow-hidden"
                >
                  <Link href="/settings">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500 text-black/70" />
                    <span className="text-sm font-medium text-black">الإعدادات</span>
                    <Bell className="w-3 h-3 text-primary ml-auto" />
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>
        </SidebarFooter>
      </div>
    </Sidebar>
  );
}
