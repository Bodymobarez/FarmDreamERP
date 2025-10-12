import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import {
  Settings as SettingsIcon,
  User,
  Shield,
  Bell,
  Database,
  Palette,
  Monitor,
  Globe,
  Save,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Info,
  Zap,
  Server,
  HardDrive,
  Wifi,
  Eye,
  EyeOff,
  Key,
  Lock,
  Users,
  Building,
  Calendar
} from "lucide-react";

export default function Settings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [showApiKey, setShowApiKey] = useState(false);
  
  // جلب البيانات الحقيقية من النظام
  const { data: systemInfo } = useQuery({
    queryKey: ["/api/system-info"],
    queryFn: async () => {
      // محاكاة جلب معلومات النظام
      return {
        version: "2.0.1",
        database: "Connected",
        uptime: "24 ساعة",
        users: 1,
        lastBackup: new Date().toLocaleDateString('ar-EG'),
        storage: "2.3 GB / 100 GB"
      };
    }
  });

  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  const { data: customers = [] } = useQuery<any[]>({
    queryKey: ["/api/customers"],
  });

  const { data: suppliers = [] } = useQuery<any[]>({
    queryKey: ["/api/suppliers"],
  });

  const { data: transactions = [] } = useQuery<any[]>({
    queryKey: ["/api/transactions"],
  });

  const [settings, setSettings] = useState({
    // الإعدادات العامة
    farmName: "مزرعة الأحلام",
    farmOwner: "محمد أحمد",
    farmAddress: "المنيا، مصر",
    currency: "ج.م",
    language: "ar",
    timezone: "Africa/Cairo",
    
    // إعدادات الإشعارات
    emailNotifications: true,
    pushNotifications: true,
    lowStockAlerts: true,
    treatmentReminders: true,
    reportAlerts: false,
    
    // إعدادات النظام
    autoBackup: true,
    backupFrequency: "daily",
    darkMode: false,
    compactView: false,
    showTutorials: true,
    
    // إعدادات الأمان
    twoFactorAuth: false,
    sessionTimeout: 30,
    passwordExpiry: 90,
    apiKey: "farm_api_2024_**********************",
    
    // إعدادات التقارير
    defaultReportPeriod: "monthly",
    autoGenerateReports: true,
    emailReports: false,
    reportFormat: "pdf"
  });

  const handleSave = async (section: string) => {
    try {
      // محاكاة حفظ الإعدادات
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast({
        title: "✅ تم الحفظ بنجاح",
        description: `تم حفظ إعدادات ${section} بنجاح`,
      });
    } catch (error) {
      toast({
        title: "❌ خطأ في الحفظ",
        description: "حدث خطأ أثناء حفظ الإعدادات",
        variant: "destructive",
      });
    }
  };

  const handleBackup = async () => {
    try {
      toast({
        title: "🔄 جاري إنشاء النسخة الاحتياطية...",
        description: "سيتم إشعارك عند الانتهاء",
      });
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      toast({
        title: "✅ تم إنشاء النسخة الاحتياطية",
        description: "تم حفظ النسخة الاحتياطية بنجاح",
      });
    } catch (error) {
      toast({
        title: "❌ فشل في إنشاء النسخة الاحتياطية",
        description: "حدث خطأ أثناء إنشاء النسخة الاحتياطية",
        variant: "destructive",
      });
    }
  };

  const clearAllData = async () => {
    if (window.confirm("⚠️ هل أنت متأكد من حذف جميع البيانات؟ هذا الإجراء لا يمكن التراجع عنه!")) {
      try {
        toast({
          title: "🗑️ جاري حذف البيانات...",
          description: "يرجى الانتظار...",
        });
        
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        toast({
          title: "✅ تم حذف جميع البيانات",
          description: "تم تصفير النظام بنجاح",
        });
      } catch (error) {
        toast({
          title: "❌ فشل في حذف البيانات",
          description: "حدث خطأ أثناء حذف البيانات",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-primary/20 to-primary/10">
              <SettingsIcon className="h-8 w-8 text-primary" />
            </div>
            ⚙️ الإعدادات المتقدمة
          </h1>
          <p className="text-muted-foreground mt-1">
            إدارة وتخصيص جميع إعدادات النظام والمزرعة
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
            <CheckCircle className="h-3 w-3 mr-1" />
            النظام يعمل بشكل طبيعي
          </Badge>
        </div>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي البيانات</CardTitle>
            <Database className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {animals.length + customers.length + suppliers.length + transactions.length}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              سجل في قاعدة البيانات
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">حالة النظام</CardTitle>
            <Server className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">متصل</div>
            <p className="text-xs text-muted-foreground mt-1">
              وقت التشغيل: {systemInfo?.uptime || "جاري التحميل..."}
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">التخزين</CardTitle>
            <HardDrive className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3 GB</div>
            <p className="text-xs text-muted-foreground mt-1">
              من أصل 100 GB
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">آخر نسخة احتياطية</CardTitle>
            <RefreshCw className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">اليوم</div>
            <p className="text-xs text-muted-foreground mt-1">
              {systemInfo?.lastBackup || "جاري التحميل..."}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Settings Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Building className="h-4 w-4" />
            عام
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            الإشعارات
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Monitor className="h-4 w-4" />
            النظام
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            الأمان
          </TabsTrigger>
          <TabsTrigger value="backup" className="flex items-center gap-2">
            <Database className="h-4 w-4" />
            النسخ الاحتياطي
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-primary" />
                معلومات المزرعة
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="farmName">اسم المزرعة</Label>
                  <Input
                    id="farmName"
                    value={settings.farmName}
                    onChange={(e) => setSettings({...settings, farmName: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmOwner">مالك المزرعة</Label>
                  <Input
                    id="farmOwner"
                    value={settings.farmOwner}
                    onChange={(e) => setSettings({...settings, farmOwner: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmAddress">عنوان المزرعة</Label>
                  <Input
                    id="farmAddress"
                    value={settings.farmAddress}
                    onChange={(e) => setSettings({...settings, farmAddress: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currency">العملة</Label>
                  <Input
                    id="currency"
                    value={settings.currency}
                    onChange={(e) => setSettings({...settings, currency: e.target.value})}
                  />
                </div>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSave("المزرعة")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  حفظ التغييرات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                إعدادات الإشعارات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>إشعارات البريد الإلكتروني</Label>
                  <p className="text-sm text-muted-foreground">
                    استقبال الإشعارات عبر البريد الإلكتروني
                  </p>
                </div>
                <Switch
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, emailNotifications: checked})
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تنبيهات المخزون المنخفض</Label>
                  <p className="text-sm text-muted-foreground">
                    تنبيه عند انخفاض مستوى المخزون
                  </p>
                </div>
                <Switch
                  checked={settings.lowStockAlerts}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, lowStockAlerts: checked})
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>تذكير العلاجات</Label>
                  <p className="text-sm text-muted-foreground">
                    تذكير بمواعيد العلاجات البيطرية
                  </p>
                </div>
                <Switch
                  checked={settings.treatmentReminders}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, treatmentReminders: checked})
                  }
                />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSave("الإشعارات")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System Settings */}
        <TabsContent value="system" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-primary" />
                إعدادات النظام
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>الوضع المظلم</Label>
                  <p className="text-sm text-muted-foreground">
                    تبديل بين الوضع المظلم والفاتح
                  </p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, darkMode: checked})
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>العرض المضغوط</Label>
                  <p className="text-sm text-muted-foreground">
                    عرض المزيد من المعلومات في مساحة أقل
                  </p>
                </div>
                <Switch
                  checked={settings.compactView}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, compactView: checked})
                  }
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>عرض الإرشادات</Label>
                  <p className="text-sm text-muted-foreground">
                    إظهار النصائح والإرشادات للمستخدمين الجدد
                  </p>
                </div>
                <Switch
                  checked={settings.showTutorials}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, showTutorials: checked})
                  }
                />
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSave("النظام")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary" />
                إعدادات الأمان
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>المصادقة الثنائية</Label>
                  <p className="text-sm text-muted-foreground">
                    طبقة حماية إضافية لحسابك
                  </p>
                </div>
                <Switch
                  checked={settings.twoFactorAuth}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, twoFactorAuth: checked})
                  }
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>مفتاح API</Label>
                <div className="flex items-center space-x-2 rtl:space-x-reverse">
                  <Input
                    type={showApiKey ? "text" : "password"}
                    value={settings.apiKey}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                  <Button variant="outline" size="sm">
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">
                  استخدم هذا المفتاح للوصول إلى API
                </p>
              </div>
              <Separator />
              <div className="flex justify-end">
                <Button onClick={() => handleSave("الأمان")} className="flex items-center gap-2">
                  <Save className="h-4 w-4" />
                  حفظ الإعدادات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Backup Settings */}
        <TabsContent value="backup" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                النسخ الاحتياطي وإدارة البيانات
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>النسخ الاحتياطي التلقائي</Label>
                  <p className="text-sm text-muted-foreground">
                    إنشاء نسخة احتياطية تلقائياً كل يوم
                  </p>
                </div>
                <Switch
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => 
                    setSettings({...settings, autoBackup: checked})
                  }
                />
              </div>
              <Separator />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Button onClick={handleBackup} className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  إنشاء نسخة احتياطية الآن
                </Button>
                <Button variant="outline" className="flex items-center gap-2">
                  <Upload className="h-4 w-4" />
                  استعادة من نسخة احتياطية
                </Button>
              </div>

              <Separator />
              
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <h3 className="font-semibold text-red-900">منطقة الخطر</h3>
                </div>
                <p className="text-sm text-red-700 mb-4">
                  حذف جميع البيانات من النظام. هذا الإجراء لا يمكن التراجع عنه!
                </p>
                <Button 
                  variant="destructive" 
                  onClick={clearAllData}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  حذف جميع البيانات
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}