import { Card, CardContent } from "@/components/ui/card";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Mail,
  Lock
} from "lucide-react";

export default function Settings() {
  const settingsCategories = [
    {
      id: 1,
      name: "الملف الشخصي",
      description: "إدارة معلومات حسابك",
      icon: User,
      color: "emerald",
    },
    {
      id: 2,
      name: "الإشعارات",
      description: "تخصيص تنبيهات النظام",
      icon: Bell,
      color: "blue",
    },
    {
      id: 3,
      name: "الأمان",
      description: "كلمة المرور والصلاحيات",
      icon: Shield,
      color: "red",
    },
    {
      id: 4,
      name: "قاعدة البيانات",
      description: "النسخ الاحتياطي والاستعادة",
      icon: Database,
      color: "purple",
    },
    {
      id: 5,
      name: "المظهر",
      description: "الألوان والثيم",
      icon: Palette,
      color: "pink",
    },
    {
      id: 6,
      name: "اللغة والمنطقة",
      description: "تفضيلات اللغة والعملة",
      icon: Globe,
      color: "teal",
    },
    {
      id: 7,
      name: "البريد الإلكتروني",
      description: "إعدادات الإيميل",
      icon: Mail,
      color: "orange",
    },
    {
      id: 8,
      name: "الخصوصية",
      description: "سياسة الخصوصية",
      icon: Lock,
      color: "indigo",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-white to-green-50/30 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-gray-500 to-gray-600 flex items-center justify-center shadow-lg">
              <SettingsIcon className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">الإعدادات</h1>
              <p className="text-gray-600 mt-1">إدارة إعدادات النظام</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {settingsCategories.map((category) => {
            const Icon = category.icon;
            const colorMap: Record<string, { bg: string; border: string; hover: string }> = {
              emerald: { bg: "from-emerald-500 to-emerald-600", border: "border-emerald-200", hover: "hover:border-emerald-400" },
              blue: { bg: "from-blue-500 to-blue-600", border: "border-blue-200", hover: "hover:border-blue-400" },
              red: { bg: "from-red-500 to-red-600", border: "border-red-200", hover: "hover:border-red-400" },
              purple: { bg: "from-purple-500 to-purple-600", border: "border-purple-200", hover: "hover:border-purple-400" },
              pink: { bg: "from-pink-500 to-pink-600", border: "border-pink-200", hover: "hover:border-pink-400" },
              teal: { bg: "from-teal-500 to-teal-600", border: "border-teal-200", hover: "hover:border-teal-400" },
              orange: { bg: "from-orange-500 to-orange-600", border: "border-orange-200", hover: "hover:border-orange-400" },
              indigo: { bg: "from-indigo-500 to-indigo-600", border: "border-indigo-200", hover: "hover:border-indigo-400" },
            };
            const colorClasses = colorMap[category.color] || colorMap.emerald;

            return (
              <Card
                key={category.id}
                className={`border-2 ${colorClasses.border} ${colorClasses.hover} bg-white hover:shadow-xl transition-all duration-300 cursor-pointer`}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col items-center text-center">
                    <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${colorClasses.bg} flex items-center justify-center mb-3 shadow-md`}>
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <p className="font-bold text-lg text-gray-900 mb-1">{category.name}</p>
                    <p className="text-xs text-gray-500">{category.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* System Info */}
        <Card className="border-2 border-gray-200 bg-white">
          <CardContent className="p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">معلومات النظام</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">الإصدار</p>
                <p className="text-lg font-bold text-gray-900">v1.0.0</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">آخر تحديث</p>
                <p className="text-lg font-bold text-gray-900">{new Date().toLocaleDateString("ar-EG")}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm text-gray-600 mb-1">حالة النظام</p>
                <p className="text-lg font-bold text-green-600">يعمل بشكل طبيعي</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
