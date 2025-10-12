import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { VeterinaryTreatmentDialog } from "@/components/VeterinaryTreatmentDialog";
import { 
  Stethoscope, 
  FileText, 
  Calendar, 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  Eye, 
  Edit, 
  Printer, 
  Download,
  FileSpreadsheet,
  FileDown,
  ChevronDown,
  Users,
  DollarSign
} from "lucide-react";
import { exportToPDF, exportToExcel, exportToCSV, previewReportOrientation } from "@/lib/exportUtils";
import { useToast } from "@/hooks/use-toast";

export default function Treatments() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [filterSeverity, setFilterSeverity] = useState("all");
  const [selectedTreatment, setSelectedTreatment] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch treatments
  const { data: treatments = [], isLoading } = useQuery<any[]>({
    queryKey: ["/api/treatments"],
  });

  // Fetch animals for reference
  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // Filter treatments
  const filteredTreatments = treatments.filter((treatment: any) => {
    const matchesSearch = 
      treatment.veterinarian?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      treatment.diagnosisDescription?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === "all" || treatment.treatmentType === filterType;
    const matchesSeverity = filterSeverity === "all" || treatment.severity === filterSeverity;

    return matchesSearch && matchesType && matchesSeverity;
  });

  // Calculate statistics
  const stats = {
    totalTreatments: treatments.length,
    ongoing: treatments.filter((t: any) => t.status === 'ongoing').length,
    completed: treatments.filter((t: any) => t.status === 'completed').length,
    totalCost: treatments.reduce((sum, t) => sum + parseFloat(t.estimatedCost || '0'), 0),
    avgCost: treatments.length > 0 ? treatments.reduce((sum, t) => sum + parseFloat(t.estimatedCost || '0'), 0) / treatments.length : 0,
    severeCases: treatments.filter((t: any) => t.severity === 'severe').length,
    uniqueAnimals: new Set(treatments.map((t: any) => t.animalId)).size,
    thisMonth: treatments.filter((t: any) => {
      const treatmentDate = new Date(t.treatmentDate);
      const now = new Date();
      return treatmentDate.getMonth() === now.getMonth() && treatmentDate.getFullYear() === now.getFullYear();
    }).length
  };

  // Export functions
  const prepareExportData = (data: any[]) => {
    return data.map((treatment: any) => {
      const animal = animals.find((a: any) => a.id === treatment.animalId);
      
      const treatmentDate = new Date(treatment.treatmentDate);
      const formattedDate = treatmentDate.toLocaleDateString("ar-EG", {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const formattedTime = treatmentDate.toLocaleTimeString("ar-EG", {
        hour: '2-digit',
        minute: '2-digit'
      });

      const estimatedCost = parseFloat(treatment.estimatedCost || '0');
      const actualCost = parseFloat(treatment.actualCost || '0');

      // Parse medications if exists
      let medicationsText = 'لا يوجد';
      try {
        const medications = typeof treatment.medications === 'string' 
          ? JSON.parse(treatment.medications) 
          : treatment.medications;
        if (medications && medications.length > 0) {
          medicationsText = medications.map((med: any) => 
            `${med.medicineName} (${med.dosage})`
          ).join(', ');
        }
      } catch (e) {
        medicationsText = treatment.medications || 'لا يوجد';
      }
      
      return [
        `${formattedDate} - ${formattedTime}`,
        animal?.earTag ? `#${animal.earTag}` : "غير محدد",
        animal?.animalType || "غير محدد",
        treatment.veterinarian || "غير محدد",
        getTreatmentTypeLabel(treatment.treatmentType),
        getSeverityLabel(treatment.severity),
        treatment.diagnosisDescription || "لا يوجد تشخيص",
        medicationsText,
        treatment.temperature ? `${treatment.temperature}°م` : "غير محدد",
        treatment.heartRate || "غير محدد",
        treatment.status === 'ongoing' ? "🔄 جاري" : treatment.status === 'completed' ? "✅ مكتمل" : "📅 يحتاج متابعة",
        treatment.outcome ? getOutcomeLabel(treatment.outcome) : "غير محدد",
        `${estimatedCost.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م`,
        actualCost > 0 ? `${actualCost.toLocaleString('ar-EG', { minimumFractionDigits: 2 })} ج.م` : "غير محدد",
        treatment.followUpDate ? new Date(treatment.followUpDate).toLocaleDateString("ar-EG") : "لا يوجد",
        treatment.vetNotes || "لا توجد ملاحظات"
      ];
    });
  };

  const getOutcomeLabel = (outcome: string) => {
    const outcomes: Record<string, string> = {
      recovered: "🟢 تعافى تماماً",
      improved: "🟡 تحسن جزئي", 
      unchanged: "🟠 بدون تحسن",
      deceased: "🔴 نفق"
    };
    return outcomes[outcome] || outcome;
  };

  const handleExportPDF = async () => {
    try {
      const headers = [
        "التاريخ والوقت",
        "رقم الحيوان",
        "نوع الحيوان", 
        "الطبيب البيطري",
        "نوع العلاج",
        "درجة الخطورة",
        "التشخيص",
        "الأدوية المستخدمة",
        "درجة الحرارة",
        "معدل النبض",
        "حالة العلاج",
        "النتيجة",
        "التكلفة المقدرة",
        "التكلفة الفعلية",
        "موعد المتابعة",
        "ملاحظات الطبيب"
      ];
      
      const data = prepareExportData(filteredTreatments);
      
      // معاينة التوجه المقترح
      const orientationPreview = previewReportOrientation(headers, data);
      console.log('🔍 معاينة توجه تقرير العلاجات:', orientationPreview);
      
      const success = await exportToPDF(
        "تقرير السجل الطبي البيطري",
        headers,
        data,
        `veterinary_treatments_${new Date().toISOString().split('T')[0]}.pdf`
      );
      
      if (success) {
        const totalValue = filteredTreatments.reduce((sum, t) => sum + parseFloat(t.estimatedCost || '0'), 0);
        toast({
          title: "✅ تم تصدير PDF بنجاح",
          description: `تم تصدير ${filteredTreatments.length} تقرير طبي بتوجه ${orientationPreview.recommendedOrientation === 'landscape' ? 'أفقي' : 'عمودي'} بإجمالي تكلفة ${totalValue.toLocaleString('ar-EG', { maximumFractionDigits: 2 })} ج.م`,
        });
      } else {
        throw new Error("فشل في تصدير الملف");
      }
    } catch (error) {
      toast({
        title: "❌ خطأ في التصدير",
        description: "فشل في تصدير الملف إلى PDF",
        variant: "destructive"
      });
    }
  };

  const handleExportExcel = () => {
    try {
      const headers = [
        "التاريخ والوقت",
        "رقم الحيوان",
        "نوع الحيوان", 
        "الطبيب البيطري",
        "نوع العلاج",
        "درجة الخطورة",
        "التشخيص",
        "الأدوية المستخدمة",
        "درجة الحرارة",
        "معدل النبض",
        "حالة العلاج",
        "النتيجة",
        "التكلفة المقدرة",
        "التكلفة الفعلية",
        "موعد المتابعة",
        "ملاحظات الطبيب"
      ];
      
      const data = prepareExportData(filteredTreatments);
      const success = exportToExcel(
        "تقرير السجل الطبي البيطري",
        headers,
        data,
        `veterinary_treatments_${new Date().toISOString().split('T')[0]}.xlsx`
      );
      
      if (success) {
        const totalValue = filteredTreatments.reduce((sum, t) => sum + parseFloat(t.estimatedCost || '0'), 0);
        toast({
          title: "📊 تم تصدير Excel بنجاح",
          description: `تم تصدير ${filteredTreatments.length} تقرير طبي بإجمالي تكلفة ${totalValue.toLocaleString('ar-EG', { maximumFractionDigits: 2 })} ج.م`,
        });
      } else {
        throw new Error("فشل في تصدير الملف");
      }
    } catch (error) {
      toast({
        title: "❌ خطأ في التصدير",
        description: "فشل في تصدير الملف إلى Excel",
        variant: "destructive"
      });
    }
  };

  const handleExportCSV = () => {
    try {
      const headers = [
        "التاريخ والوقت",
        "رقم الحيوان",
        "نوع الحيوان", 
        "الطبيب البيطري",
        "نوع العلاج",
        "درجة الخطورة",
        "التشخيص",
        "الأدوية المستخدمة",
        "درجة الحرارة",
        "معدل النبض",
        "حالة العلاج",
        "النتيجة",
        "التكلفة المقدرة",
        "التكلفة الفعلية",
        "موعد المتابعة",
        "ملاحظات الطبيب"
      ];
      
      const data = prepareExportData(filteredTreatments);
      const success = exportToCSV(
        headers,
        data,
        `veterinary_treatments_${new Date().toISOString().split('T')[0]}.csv`
      );
      
      if (success) {
        const totalValue = filteredTreatments.reduce((sum, t) => sum + parseFloat(t.estimatedCost || '0'), 0);
        toast({
          title: "📄 تم تصدير CSV بنجاح",
          description: `تم تصدير ${filteredTreatments.length} تقرير طبي بإجمالي تكلفة ${totalValue.toLocaleString('ar-EG', { maximumFractionDigits: 2 })} ج.م`,
        });
      } else {
        throw new Error("فشل في تصدير الملف");
      }
    } catch (error) {
      toast({
        title: "❌ خطأ في التصدير",
        description: "فشل في تصدير الملف إلى CSV",
        variant: "destructive"
      });
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "mild":
        return "bg-green-100 text-green-800 border-green-200";
      case "moderate":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "severe":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case "mild":
        return "🟢 خفيفة";
      case "moderate":
        return "🟡 متوسطة";
      case "severe":
        return "🔴 خطيرة";
      default:
        return "غير محدد";
    }
  };

  const getTreatmentTypeLabel = (type: string) => {
    const types: Record<string, string> = {
      vaccination: "💉 تطعيم",
      disease_treatment: "💊 علاج مرض",
      parasite_treatment: "🐛 علاج طفيليات",
      wound_treatment: "🩹 علاج جروح",
      preventive_care: "🛡️ رعاية وقائية",
      surgery: "⚕️ عملية جراحية",
      emergency: "🚨 حالة طوارئ",
      routine_checkup: "📋 كشف دوري",
    };
    return types[type] || type;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري تحميل السجلات الطبية...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header with Export Buttons */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-green-100 to-emerald-100">
            <Stethoscope className="h-8 w-8 text-green-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">السجل الطبي البيطري</h1>
            <p className="text-gray-600 mt-1">
              متابعة شاملة لجميع العلاجات والفحوصات الطبية للحيوانات
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <VeterinaryTreatmentDialog />
          
          {/* Export Dropdown Button */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Download className="h-5 w-5 ml-2" />
                تصدير التقارير
                <ChevronDown className="h-4 w-4 mr-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleExportPDF} className="gap-3 cursor-pointer">
                <FileText className="h-4 w-4 text-red-500" />
                <span>تصدير PDF</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportExcel} className="gap-3 cursor-pointer">
                <FileSpreadsheet className="h-4 w-4 text-green-600" />
                <span>تصدير Excel</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportCSV} className="gap-3 cursor-pointer">
                <FileDown className="h-4 w-4 text-blue-600" />
                <span>تصدير CSV</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-2 border-blue-200 bg-gradient-to-br from-blue-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-blue-600 mb-1">إجمالي التقارير</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalTreatments}</p>
                <p className="text-xs text-gray-600 mt-1">
                  جاري: {stats.ongoing} | مكتمل: {stats.completed}
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600 mb-1">الحيوانات المعالجة</p>
                <p className="text-3xl font-bold text-gray-900">{stats.uniqueAnimals}</p>
                <p className="text-xs text-gray-600 mt-1">حيوان مختلف</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-red-600 mb-1">حالات خطيرة</p>
                <p className="text-3xl font-bold text-gray-900">{stats.severeCases}</p>
                <p className="text-xs text-gray-600 mt-1">تحتاج عناية خاصة</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-amber-200 bg-gradient-to-br from-amber-50/50 to-transparent">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-amber-600 mb-1">إجمالي التكلفة</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalCost.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  متوسط: {stats.avgCost.toLocaleString('ar-EG', { maximumFractionDigits: 0 })} ج.م
                </p>
              </div>
              <div className="p-3 bg-amber-100 rounded-full">
                <DollarSign className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Additional Statistics Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border border-purple-200 bg-gradient-to-r from-purple-50 to-pink-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-purple-600 mb-1">هذا الشهر</p>
                <p className="text-2xl font-bold text-purple-900">{stats.thisMonth}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-orange-200 bg-gradient-to-r from-orange-50 to-red-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-orange-600 mb-1">العلاجات الجارية</p>
                <p className="text-2xl font-bold text-orange-900">{stats.ongoing}</p>
              </div>
              <Activity className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="border border-teal-200 bg-gradient-to-r from-teal-50 to-cyan-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-teal-600 mb-1">التقارير المكتملة</p>
                <p className="text-2xl font-bold text-teal-900">{stats.completed}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-teal-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-right">بحث</Label>
            <Input
              placeholder="ابحث بالطبيب أو التشخيص..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-right"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-right">نوع العلاج</Label>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="vaccination">💉 تطعيم</SelectItem>
                <SelectItem value="disease_treatment">💊 علاج مرض</SelectItem>
                <SelectItem value="parasite_treatment">🐛 علاج طفيليات</SelectItem>
                <SelectItem value="wound_treatment">🩹 علاج جروح</SelectItem>
                <SelectItem value="preventive_care">🛡️ رعاية وقائية</SelectItem>
                <SelectItem value="surgery">⚕️ عملية جراحية</SelectItem>
                <SelectItem value="emergency">🚨 حالة طوارئ</SelectItem>
                <SelectItem value="routine_checkup">📋 كشف دوري</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-right">درجة الخطورة</Label>
            <Select value={filterSeverity} onValueChange={setFilterSeverity}>
              <SelectTrigger className="text-right">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="mild">🟢 خفيفة</SelectItem>
                <SelectItem value="moderate">🟡 متوسطة</SelectItem>
                <SelectItem value="severe">🔴 خطيرة</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Treatments List */}
      {filteredTreatments.length === 0 ? (
        <Card className="p-12 text-center">
          <Stethoscope className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">لا توجد تقارير طبية مسجلة</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {filteredTreatments.map((treatment: any) => {
            const animal = animals.find((a: any) => a.id === treatment.animalId);
            
            return (
              <Card key={treatment.id} className="hover-elevate">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2">
                      <Badge className={getSeverityColor(treatment.severity)}>
                        {getSeverityLabel(treatment.severity)}
                      </Badge>
                      <Badge variant="outline">
                        {getTreatmentTypeLabel(treatment.treatmentType)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <CardTitle className="text-lg">
                        {animal?.earTag} - {animal?.animalType}
                      </CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {new Date(treatment.treatmentDate).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Clinical Examination Summary */}
                  {(treatment.temperature || treatment.heartRate || treatment.appetite) && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <h4 className="text-right font-bold text-blue-900 mb-2 flex items-center justify-end gap-2">
                        <Activity className="w-4 h-4" />
                        الفحص السريري
                      </h4>
                      <div className="grid grid-cols-3 gap-2 text-sm text-right">
                        {treatment.temperature && (
                          <div>
                            <span className="text-muted-foreground">الحرارة:</span>
                            <span className="font-bold mr-1">{treatment.temperature}°</span>
                          </div>
                        )}
                        {treatment.heartRate && (
                          <div>
                            <span className="text-muted-foreground">النبض:</span>
                            <span className="font-bold mr-1">{treatment.heartRate}</span>
                          </div>
                        )}
                        {treatment.appetite && (
                          <div>
                            <span className="text-muted-foreground">الشهية:</span>
                            <span className="font-bold mr-1">{treatment.appetite}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Symptoms */}
                  {treatment.symptoms && (() => {
                    try {
                      const symptomsData = typeof treatment.symptoms === 'string' 
                        ? JSON.parse(treatment.symptoms) 
                        : treatment.symptoms;
                      const symptoms = typeof symptomsData === 'string' 
                        ? JSON.parse(symptomsData) 
                        : symptomsData;
                      return symptoms && symptoms.length > 0 ? (
                        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                          <h4 className="text-right font-bold text-orange-900 mb-2">الأعراض:</h4>
                          <div className="flex flex-wrap gap-2 justify-end">
                            {symptoms.map((symptom: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {symptom}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    } catch (e) {
                      return null;
                    }
                  })()}

                  {/* Diagnosis */}
                  {treatment.diagnosisDescription && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
                      <h4 className="text-right font-bold text-purple-900 mb-2">التشخيص:</h4>
                      <p className="text-right text-sm">{treatment.diagnosisDescription}</p>
                      {treatment.diagnosisCategory && (
                        <Badge variant="secondary" className="mt-2">
                          {treatment.diagnosisCategory}
                        </Badge>
                      )}
                    </div>
                  )}

                  {/* Medications */}
                  {treatment.medications && (() => {
                    try {
                      const medicationsData = typeof treatment.medications === 'string' 
                        ? JSON.parse(treatment.medications) 
                        : treatment.medications;
                      const medications = typeof medicationsData === 'string' 
                        ? JSON.parse(medicationsData) 
                        : medicationsData;
                      return medications && medications.length > 0 ? (
                        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-3">
                          <h4 className="text-right font-bold text-indigo-900 mb-2 flex items-center justify-end gap-2">
                            <Package className="w-4 h-4" />
                            العلاج الموصوف
                          </h4>
                          <div className="space-y-2">
                            {medications.map((med: any, index: number) => (
                              <div key={index} className="bg-white rounded p-2 text-right text-sm">
                                <div className="font-bold text-indigo-900">{med.medicineName}</div>
                                <div className="text-muted-foreground mt-1">
                                  {med.dosage} - {med.frequency} - {med.duration}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : null;
                    } catch (e) {
                      return null;
                    }
                  })()}

                  {/* Follow-up */}
                  {treatment.followUpDate && (
                    <div className="bg-teal-50 border border-teal-200 rounded-lg p-3 text-right">
                      <span className="text-teal-900 font-bold">📅 موعد المتابعة:</span>
                      <span className="mr-2">
                        {new Date(treatment.followUpDate).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                  )}

                  {/* Veterinarian & Cost */}
                  <div className="flex justify-between items-center text-sm pt-3 border-t">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedTreatment(treatment);
                          setViewDialogOpen(true);
                        }}
                        className="gap-1"
                      >
                        <Eye className="w-4 h-4" />
                        عرض التفاصيل
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.print()}
                        className="gap-1"
                      >
                        <Printer className="w-4 h-4" />
                        طباعة
                      </Button>
                    </div>
                    <div className="flex items-center gap-4 text-muted-foreground">
                      <div>
                        {treatment.estimatedCost > 0 && (
                          <span className="font-bold text-green-600">{treatment.estimatedCost} جنيه</span>
                        )}
                      </div>
                      <div className="text-right">
                        {treatment.veterinarian && (
                          <span>👨‍⚕️ {treatment.veterinarian}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Results Counter */}
      {filteredTreatments.length > 0 && (
        <div className="flex items-center justify-between bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div className="text-sm text-gray-600">
            عرض <span className="font-bold text-blue-600">{filteredTreatments.length}</span> من <span className="font-bold">{treatments.length}</span> تقرير طبي
          </div>
          <div className="text-sm text-gray-500">
            التكلفة المعروضة: <span className="font-bold text-green-600">
              {filteredTreatments.reduce((sum, t) => sum + parseFloat(t.estimatedCost || '0'), 0).toLocaleString('ar-EG', { maximumFractionDigits: 2 })} ج.م
            </span>
          </div>
        </div>
      )}

      {/* View Treatment Details Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto" dir="rtl">
          <DialogHeader className="text-right">
            <DialogTitle className="text-2xl font-bold flex items-center justify-end gap-2">
              <Stethoscope className="w-6 h-6 text-primary" />
              تفاصيل التقرير الطبي الكامل
            </DialogTitle>
            <DialogDescription className="text-right">
              جميع المعلومات والتفاصيل الطبية للحالة
            </DialogDescription>
          </DialogHeader>

          {selectedTreatment && (() => {
            const animal = animals.find((a: any) => a.id === selectedTreatment.animalId);
            const parseJSON = (data: any) => {
              try {
                const parsed = typeof data === 'string' ? JSON.parse(data) : data;
                return typeof parsed === 'string' ? JSON.parse(parsed) : parsed;
              } catch {
                return [];
              }
            };
            const symptoms = parseJSON(selectedTreatment.symptoms);
            const medications = parseJSON(selectedTreatment.medications);

            return (
              <div className="space-y-6 mt-4">
                {/* Header Info */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex gap-2">
                      <Badge className={`${getSeverityColor(selectedTreatment.severity)} text-base px-3 py-1`}>
                        {getSeverityLabel(selectedTreatment.severity)}
                      </Badge>
                      <Badge variant="outline" className="text-base px-3 py-1">
                        {getTreatmentTypeLabel(selectedTreatment.treatmentType)}
                      </Badge>
                    </div>
                    <div className="text-right">
                      <h3 className="text-2xl font-bold text-blue-900">
                        {animal?.earTag} - {animal?.animalType}
                      </h3>
                      <p className="text-blue-700 mt-1">
                        📅 {new Date(selectedTreatment.treatmentDate).toLocaleDateString('ar-EG', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>
                  {animal && (
                    <div className="grid grid-cols-4 gap-4 mt-4 bg-white/50 rounded-lg p-3">
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">السلالة:</span>
                        <p className="font-bold">{animal.breed || 'غير محدد'}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">الجنس:</span>
                        <p className="font-bold">{animal.sex}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">الوزن الحالي:</span>
                        <p className="font-bold text-green-600">{animal.currentWeight} كجم</p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm text-muted-foreground">الحظيرة:</span>
                        <p className="font-bold">{animal.penNumber || 'غير محدد'}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Clinical Examination */}
                <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 rounded-xl p-5">
                  <h4 className="text-right font-bold text-indigo-900 text-xl mb-4 flex items-center justify-end gap-2">
                    <Activity className="w-5 h-5" />
                    الفحص السريري
                  </h4>
                  <div className="grid grid-cols-3 gap-4">
                    {selectedTreatment.temperature && (
                      <div className="bg-white rounded-lg p-4 text-right">
                        <span className="text-sm text-muted-foreground">🌡️ درجة الحرارة</span>
                        <p className="text-2xl font-bold text-indigo-900 mt-1">{selectedTreatment.temperature}°س</p>
                        <span className="text-xs text-muted-foreground">الطبيعي: 38-39°س</span>
                      </div>
                    )}
                    {selectedTreatment.heartRate && (
                      <div className="bg-white rounded-lg p-4 text-right">
                        <span className="text-sm text-muted-foreground">💓 معدل النبض</span>
                        <p className="text-2xl font-bold text-indigo-900 mt-1">{selectedTreatment.heartRate}</p>
                        <span className="text-xs text-muted-foreground">نبضة/دقيقة</span>
                      </div>
                    )}
                    {selectedTreatment.respiratoryRate && (
                      <div className="bg-white rounded-lg p-4 text-right">
                        <span className="text-sm text-muted-foreground">🫁 معدل التنفس</span>
                        <p className="text-2xl font-bold text-indigo-900 mt-1">{selectedTreatment.respiratoryRate}</p>
                        <span className="text-xs text-muted-foreground">نفس/دقيقة</span>
                      </div>
                    )}
                    {selectedTreatment.appetite && (
                      <div className="bg-white rounded-lg p-4 text-right">
                        <span className="text-sm text-muted-foreground">🍽️ الشهية</span>
                        <p className="text-lg font-bold text-indigo-900 mt-1">{selectedTreatment.appetite}</p>
                      </div>
                    )}
                    {selectedTreatment.behavior && (
                      <div className="bg-white rounded-lg p-4 text-right">
                        <span className="text-sm text-muted-foreground">🎭 السلوك</span>
                        <p className="text-lg font-bold text-indigo-900 mt-1">{selectedTreatment.behavior}</p>
                      </div>
                    )}
                    {selectedTreatment.mobility && (
                      <div className="bg-white rounded-lg p-4 text-right">
                        <span className="text-sm text-muted-foreground">🚶 الحركة</span>
                        <p className="text-lg font-bold text-indigo-900 mt-1">{selectedTreatment.mobility}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Symptoms */}
                {symptoms && symptoms.length > 0 && (
                  <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-xl p-5">
                    <h4 className="text-right font-bold text-orange-900 text-xl mb-4 flex items-center justify-end gap-2">
                      <AlertTriangle className="w-5 h-5" />
                      الأعراض الملاحظة
                    </h4>
                    <div className="flex flex-wrap gap-2 justify-end">
                      {symptoms.map((symptom: string, index: number) => (
                        <Badge key={index} className="bg-orange-100 text-orange-900 border-orange-300 text-sm px-3 py-1">
                          {symptom}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Diagnosis */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-xl p-5">
                  <h4 className="text-right font-bold text-purple-900 text-xl mb-4 flex items-center justify-end gap-2">
                    <FileText className="w-5 h-5" />
                    التشخيص
                  </h4>
                  {selectedTreatment.diagnosisCategory && (
                    <Badge className="bg-purple-100 text-purple-900 border-purple-300 mb-3 text-base px-3 py-1">
                      {selectedTreatment.diagnosisCategory}
                    </Badge>
                  )}
                  <div className="bg-white rounded-lg p-4 text-right">
                    <p className="text-base leading-relaxed">{selectedTreatment.diagnosisDescription}</p>
                  </div>
                </div>

                {/* Medications */}
                {medications && medications.length > 0 && (
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5">
                    <h4 className="text-right font-bold text-green-900 text-xl mb-4 flex items-center justify-end gap-2">
                      <Package className="w-5 h-5" />
                      العلاج الموصوف
                    </h4>
                    <div className="space-y-3">
                      {medications.map((med: any, index: number) => (
                        <div key={index} className="bg-white rounded-lg p-4 border border-green-200">
                          <div className="flex justify-between items-start mb-2">
                            <div className="text-left">
                              <Badge className="bg-green-100 text-green-900">{index + 1}</Badge>
                            </div>
                            <div className="text-right flex-1 mr-3">
                              <h5 className="font-bold text-green-900 text-lg">{med.medicineName}</h5>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mt-3 text-sm">
                            <div className="bg-green-50 rounded p-2 text-right">
                              <span className="text-muted-foreground">📊 الجرعة:</span>
                              <p className="font-bold text-green-900">{med.dosage}</p>
                            </div>
                            <div className="bg-green-50 rounded p-2 text-right">
                              <span className="text-muted-foreground">🔄 التكرار:</span>
                              <p className="font-bold text-green-900">{med.frequency}</p>
                            </div>
                            <div className="bg-green-50 rounded p-2 text-right">
                              <span className="text-muted-foreground">⏰ المدة:</span>
                              <p className="font-bold text-green-900">{med.duration}</p>
                            </div>
                            <div className="bg-green-50 rounded p-2 text-right">
                              <span className="text-muted-foreground">💉 طريقة الإعطاء:</span>
                              <p className="font-bold text-green-900">{med.route}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 rounded-xl p-5">
                  <h4 className="text-right font-bold text-teal-900 text-xl mb-4">
                    📝 التوصيات والإرشادات
                  </h4>
                  <div className="space-y-4">
                    {selectedTreatment.isolation && (
                      <div className="bg-white rounded-lg p-4 text-right">
                        <span className="text-sm text-muted-foreground">🚪 العزل الصحي:</span>
                        <p className="font-bold text-teal-900 mt-1">
                          {selectedTreatment.isolation === 'no' && '✅ لا يحتاج لعزل'}
                          {selectedTreatment.isolation === 'recommended' && '⚠️ يُفضل العزل'}
                          {selectedTreatment.isolation === 'required' && '🚫 يجب العزل فوراً'}
                        </p>
                      </div>
                    )}
                    {selectedTreatment.dietRecommendations && (
                      <div className="bg-white rounded-lg p-4 text-right">
                        <span className="text-sm text-muted-foreground">🥗 التوصيات الغذائية:</span>
                        <p className="mt-2 leading-relaxed">{selectedTreatment.dietRecommendations}</p>
                      </div>
                    )}
                    {selectedTreatment.specialInstructions && (
                      <div className="bg-white rounded-lg p-4 text-right">
                        <span className="text-sm text-muted-foreground">⚡ تعليمات خاصة:</span>
                        <p className="mt-2 leading-relaxed">{selectedTreatment.specialInstructions}</p>
                      </div>
                    )}
                    {selectedTreatment.followUpDate && (
                      <div className="bg-teal-100 border-2 border-teal-300 rounded-lg p-4 text-right">
                        <span className="text-teal-900 font-bold text-lg">📅 موعد المتابعة القادم:</span>
                        <p className="text-2xl font-bold text-teal-900 mt-2">
                          {new Date(selectedTreatment.followUpDate).toLocaleDateString('ar-EG', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Veterinarian Notes */}
                {selectedTreatment.vetNotes && (
                  <div className="bg-gradient-to-br from-gray-50 to-slate-50 border border-gray-200 rounded-xl p-5">
                    <h4 className="text-right font-bold text-gray-900 text-xl mb-4">
                      👨‍⚕️ ملاحظات الطبيب البيطري
                    </h4>
                    <div className="bg-white rounded-lg p-4 text-right border-r-4 border-blue-500">
                      <p className="leading-relaxed italic">{selectedTreatment.vetNotes}</p>
                    </div>
                  </div>
                )}

                {/* Footer Info */}
                <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="bg-white rounded-lg p-4">
                      <span className="text-sm text-muted-foreground">👨‍⚕️ الطبيب البيطري</span>
                      <p className="font-bold text-lg text-yellow-900 mt-1">
                        {selectedTreatment.veterinarian || 'غير محدد'}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <span className="text-sm text-muted-foreground">💰 التكلفة التقديرية</span>
                      <p className="font-bold text-2xl text-green-600 mt-1">
                        {selectedTreatment.estimatedCost} جنيه
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4">
                      <span className="text-sm text-muted-foreground">📊 حالة العلاج</span>
                      <p className="font-bold text-lg text-yellow-900 mt-1">
                        {selectedTreatment.status === 'ongoing' && '🔄 جاري'}
                        {selectedTreatment.status === 'completed' && '✅ مكتمل'}
                        {selectedTreatment.status === 'followup_required' && '📅 يحتاج متابعة'}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 text-center text-sm text-muted-foreground">
                    <p>تم إنشاء التقرير في: {new Date(selectedTreatment.createdAt).toLocaleString('ar-EG')}</p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-3 pt-4 border-t">
                  <Button onClick={() => window.print()} className="gap-2">
                    <Printer className="w-4 h-4" />
                    طباعة التقرير
                  </Button>
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    إغلاق
                  </Button>
                </div>
              </div>
            );
          })()}
        </DialogContent>
      </Dialog>
    </div>
  );
}
