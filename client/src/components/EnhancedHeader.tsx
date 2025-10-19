import { useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Logo } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  ArrowRight,
  Search,
  User,
  Settings,
  LogOut,
  Calendar,
  Bell,
  AlertTriangle,
  TrendingDown,
  Activity
} from "lucide-react";
import { Badge } from "./ui/badge";

export function EnhancedHeader() {
  const [location, setLocation] = useLocation();
  const isNotHome = location !== "/";
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch data for notifications
  const { data: inventory = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
  });

  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  const { data: treatments = [] } = useQuery<any[]>({
    queryKey: ["/api/treatments"],
  });

  // Calculate notifications
  const lowStockItems = inventory.filter(
    (item: any) => parseFloat(item.currentStock || item.quantity || "0") <= parseFloat(item.minStock || item.minQuantity || "0")
  );

  const sickAnimals = treatments.filter((t: any) => {
    const treatmentDate = new Date(t.treatmentDate || t.createdAt);
    const threeDaysAgo = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000);
    return treatmentDate >= threeDaysAgo && t.status !== "completed";
  });

  const totalNotifications = lowStockItems.length + sickAnimals.length;

  // Get current date in Arabic
  const currentDate = new Date().toLocaleDateString("ar-EG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle search functionality
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="sticky top-0 z-50 border-b-2 border-emerald-200 bg-white shadow-xl">
      <div className="bg-gradient-to-r from-emerald-50 via-green-50 to-teal-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4 gap-4">
            {/* Right Section - Logo & Back Button */}
            <div className="flex items-center gap-3">
              {/* Back Button */}
              {isNotHome && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.history.back()}
                  className="flex items-center gap-2 px-3 h-10 hover:bg-emerald-100 rounded-xl border border-emerald-200 shadow-sm"
                >
                  <ArrowRight className="w-5 h-5 text-emerald-600" />
                  <span className="hidden sm:inline text-sm font-semibold text-emerald-700">رجوع</span>
                </Button>
              )}

              {/* Logo - Always visible with text on mobile too */}
              <div 
                className="flex items-center cursor-pointer hover:opacity-80 transition-opacity duration-300"
                onClick={() => setLocation("/")}
                title="الذهاب للصفحة الرئيسية"
              >
                <Logo size="md" showText={true} />
              </div>
            </div>

            {/* Left Section - Search, Date, Notifications, Account */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Date - Hidden on small mobile */}
              <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl bg-white border-2 border-emerald-200 shadow-md">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span className="text-sm font-semibold text-gray-700">{currentDate}</span>
              </div>

              {/* Theme Toggle */}
              <div className="h-10 w-10 flex items-center justify-center hover:bg-emerald-100 rounded-xl transition-colors">
                <ThemeToggle />
              </div>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="relative h-10 w-10 p-0 hover:bg-emerald-100 rounded-xl"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {totalNotifications > 0 && (
                      <Badge className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold shadow-lg">
                        {totalNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 rounded-xl border-2 border-purple-200 shadow-2xl max-h-[400px] overflow-y-auto">
                  <DropdownMenuLabel className="font-bold text-base py-3 bg-gradient-to-r from-purple-50 to-pink-50 border-b border-purple-100">
                    🔔 التنبيهات ({totalNotifications})
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  
                  {totalNotifications === 0 ? (
                    <div className="p-6 text-center">
                      <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-gray-500 font-medium">لا توجد تنبيهات</p>
                      <p className="text-gray-400 text-sm mt-1">كل شيء على ما يرام ✅</p>
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {/* Low Stock Notifications */}
                      {lowStockItems.length > 0 && (
                        <>
                          <div className="px-3 py-2 text-xs font-bold text-red-600 bg-red-50 rounded-lg">
                            ⚠️ مخزون منخفض ({lowStockItems.length})
                          </div>
                          {lowStockItems.slice(0, 3).map((item: any) => (
                            <DropdownMenuItem 
                              key={item.id}
                              className="cursor-pointer hover:bg-red-50 rounded-lg p-3"
                              onClick={() => setLocation("/inventory")}
                            >
                              <div className="flex items-start gap-3 w-full">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                  <AlertTriangle className="w-4 h-4 text-red-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="font-semibold text-sm text-gray-900 truncate">{item.itemName}</p>
                                  <p className="text-xs text-red-600">
                                    الكمية: {parseFloat(item.currentStock || item.quantity || "0").toFixed(0)} {item.unit}
                                  </p>
                                </div>
                              </div>
                            </DropdownMenuItem>
                          ))}
                          {lowStockItems.length > 3 && (
                            <div className="px-3 py-2 text-xs text-center text-gray-500">
                              و {lowStockItems.length - 3} أصناف أخرى...
                            </div>
                          )}
                        </>
                      )}
                      
                      {/* Treatment Notifications */}
                      {sickAnimals.length > 0 && (
                        <>
                          {lowStockItems.length > 0 && <DropdownMenuSeparator />}
                          <div className="px-3 py-2 text-xs font-bold text-orange-600 bg-orange-50 rounded-lg">
                            💊 علاجات نشطة ({sickAnimals.length})
                          </div>
                          {sickAnimals.slice(0, 3).map((treatment: any) => {
                            const animal = animals.find((a: any) => a.id === treatment.animalId);
                            return (
                              <DropdownMenuItem 
                                key={treatment.id}
                                className="cursor-pointer hover:bg-orange-50 rounded-lg p-3"
                                onClick={() => setLocation("/treatments")}
                              >
                                <div className="flex items-start gap-3 w-full">
                                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <Activity className="w-4 h-4 text-orange-600" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm text-gray-900 truncate">
                                      حيوان #{animal?.earTag || "غير معروف"}
                                    </p>
                                    <p className="text-xs text-orange-600">
                                      {treatment.treatmentType} - {new Date(treatment.treatmentDate).toLocaleDateString("ar-EG")}
                                    </p>
                                  </div>
                                </div>
                              </DropdownMenuItem>
                            );
                          })}
                          {sickAnimals.length > 3 && (
                            <div className="px-3 py-2 text-xs text-center text-gray-500">
                              و {sickAnimals.length - 3} علاجات أخرى...
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* My Account Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="flex items-center gap-2 h-10 px-3 hover:bg-purple-100 rounded-xl border-2 border-transparent hover:border-purple-200 shadow-sm"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                      <User className="w-4 h-4 text-white" />
                    </div>
                    <span className="hidden lg:inline text-sm font-semibold text-gray-700">حسابي</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64 rounded-xl border-2 border-purple-200 shadow-2xl">
                  <DropdownMenuLabel className="font-bold text-base py-3 bg-gradient-to-r from-purple-50 to-pink-50">
                    👤 حسابي
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer py-3 text-base hover:bg-purple-50 rounded-lg m-1">
                    <User className="ml-2 h-5 w-5 text-purple-600" />
                    <span>الملف الشخصي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer py-3 text-base hover:bg-blue-50 rounded-lg m-1">
                    <Settings className="ml-2 h-5 w-5 text-blue-600" />
                    <span>الإعدادات</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer py-3 text-base text-red-600 hover:bg-red-50 rounded-lg m-1">
                    <LogOut className="ml-2 h-5 w-5" />
                    <span>تسجيل الخروج</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Search Bar - Full width on all devices */}
          <div className="pb-4">
            <form onSubmit={handleSearch} className="w-full relative">
              <div className="relative">
                <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
                <Input
                  type="text"
                  placeholder="🔍 ابحث في النظام عن أي شيء..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pr-12 h-12 sm:h-14 text-base sm:text-lg bg-white border-2 border-purple-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 font-medium"
                />
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Progress bar - Colorful theme */}
      <div className="h-1 bg-gray-100 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 w-full"></div>
      </div>
    </header>
  );
}

