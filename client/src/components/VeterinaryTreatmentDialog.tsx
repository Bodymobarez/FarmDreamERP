import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Plus, Stethoscope, AlertCircle, Activity, FileText, Pill } from "lucide-react";

export function VeterinaryTreatmentDialog() {
  const [open, setOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Basic Information
  const [animalId, setAnimalId] = useState("");
  const [veterinarian, setVeterinarian] = useState("");
  const [treatmentDate, setTreatmentDate] = useState(new Date().toISOString().split('T')[0]);
  const [treatmentType, setTreatmentType] = useState("");
  
  // Clinical Examination
  const [temperature, setTemperature] = useState("");
  const [heartRate, setHeartRate] = useState("");
  const [respiratoryRate, setRespiratoryRate] = useState("");
  const [appetite, setAppetite] = useState("");
  const [behavior, setBehavior] = useState("");
  const [mobility, setMobility] = useState("");
  
  // Symptoms Checklist
  const [symptoms, setSymptoms] = useState<string[]>([]);
  
  // Diagnosis
  const [diagnosisCategory, setDiagnosisCategory] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [severity, setSeverity] = useState("");
  
  // Treatment Plan
  const [selectedMedicines, setSelectedMedicines] = useState<Array<{
    medicineId: string;
    medicineName: string;
    dosage: string;
    frequency: string;
    duration: string;
    route: string;
  }>>([]);
  const [currentMedicine, setCurrentMedicine] = useState("");
  const [currentDosage, setCurrentDosage] = useState("");
  const [currentFrequency, setCurrentFrequency] = useState("");
  const [currentDuration, setCurrentDuration] = useState("");
  const [currentRoute, setCurrentRoute] = useState("");
  
  // Recommendations
  const [isolation, setIsolation] = useState("");
  const [dietRecommendation, setDietRecommendation] = useState("");
  const [followUpDate, setFollowUpDate] = useState("");
  const [specialInstructions, setSpecialInstructions] = useState("");
  
  // Additional Notes
  const [vetNotes, setVetNotes] = useState("");
  const [estimatedCost, setEstimatedCost] = useState("");

  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch animals
  const { data: animals = [] } = useQuery<any[]>({
    queryKey: ["/api/animals"],
  });

  // Fetch medicines from inventory
  const { data: medicines = [] } = useQuery<any[]>({
    queryKey: ["/api/inventory"],
    select: (data) => data.filter((item: any) => item.itemType === "medicine"),
  });

  const selectedAnimal = animals.find((a: any) => a.id === animalId);

  const symptomsList = [
    "حمى / ارتفاع درجة الحرارة",
    "إسهال",
    "إمساك",
    "قيء / استفراغ",
    "فقدان الشهية",
    "خمول / كسل",
    "صعوبة في التنفس",
    "سعال",
    "إفرازات أنفية",
    "إفرازات عينية",
    "عرج / صعوبة في المشي",
    "تورم في الأطراف",
    "جروح أو إصابات",
    "طفيليات خارجية",
    "فقدان وزن ملحوظ",
    "تشنجات",
    "رعشة",
    "انتفاخ البطن",
  ];

  const treatmentTypes = [
    { value: "vaccination", label: "💉 تطعيم / لقاح", icon: "💉" },
    { value: "disease_treatment", label: "💊 علاج مرض", icon: "💊" },
    { value: "parasite_treatment", label: "🐛 علاج طفيليات", icon: "🐛" },
    { value: "wound_treatment", label: "🩹 علاج جروح", icon: "🩹" },
    { value: "preventive_care", label: "🛡️ رعاية وقائية", icon: "🛡️" },
    { value: "surgery", label: "⚕️ عملية جراحية", icon: "⚕️" },
    { value: "emergency", label: "🚨 حالة طوارئ", icon: "🚨" },
    { value: "routine_checkup", label: "📋 كشف دوري", icon: "📋" },
  ];

  const diagnosisCategories = [
    "أمراض معدية",
    "أمراض طفيلية",
    "أمراض تنفسية",
    "أمراض هضمية",
    "أمراض جلدية",
    "إصابات وجروح",
    "مشاكل تناسلية",
    "أمراض عيون",
    "أمراض أطراف",
    "سوء تغذية",
    "تسمم",
    "أخرى",
  ];

  const administrationRoutes = [
    "حقن عضلي (IM)",
    "حقن وريدي (IV)",
    "حقن تحت الجلد (SC)",
    "عن طريق الفم (PO)",
    "موضعي / خارجي",
    "بالتنقيط",
  ];

  const addMedicine = () => {
    if (!currentMedicine || !currentDosage) {
      toast({
        title: "خطأ",
        description: "يرجى اختيار الدواء وتحديد الجرعة",
        variant: "destructive",
      });
      return;
    }

    const medicine = medicines.find((m: any) => m.id === currentMedicine);
    setSelectedMedicines([
      ...selectedMedicines,
      {
        medicineId: currentMedicine,
        medicineName: medicine?.itemName || "",
        dosage: currentDosage,
        frequency: currentFrequency,
        duration: currentDuration,
        route: currentRoute,
      },
    ]);

    // Reset fields
    setCurrentMedicine("");
    setCurrentDosage("");
    setCurrentFrequency("");
    setCurrentDuration("");
    setCurrentRoute("");
  };

  const removeMedicine = (index: number) => {
    setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index));
  };

  const treatmentMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await fetch("/api/treatments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "فشل في حفظ التقرير");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/treatments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/animals"] });
      toast({
        title: "تم الحفظ بنجاح ✅",
        description: "تم حفظ التقرير البيطري والعلاج",
      });
      setOpen(false);
      resetForm();
    },
    onError: (error: Error) => {
      toast({
        title: "خطأ في الحفظ",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setCurrentStep(1);
    setAnimalId("");
    setVeterinarian("");
    setTreatmentDate(new Date().toISOString().split('T')[0]);
    setTreatmentType("");
    setTemperature("");
    setHeartRate("");
    setRespiratoryRate("");
    setAppetite("");
    setBehavior("");
    setMobility("");
    setSymptoms([]);
    setDiagnosisCategory("");
    setDiagnosis("");
    setSeverity("");
    setSelectedMedicines([]);
    setIsolation("");
    setDietRecommendation("");
    setFollowUpDate("");
    setSpecialInstructions("");
    setVetNotes("");
    setEstimatedCost("");
  };

  const handleSubmit = () => {
    if (!animalId || !treatmentType || !diagnosis) {
      toast({
        title: "خطأ",
        description: "يرجى ملء جميع الحقول المطلوبة",
        variant: "destructive",
      });
      return;
    }

    treatmentMutation.mutate({
      animalId,
      veterinarian,
      treatmentDate,
      treatmentType,
      temperature,
      heartRate,
      respiratoryRate,
      appetite,
      behavior,
      mobility,
      symptoms,
      diagnosisCategory,
      diagnosisDescription: diagnosis,
      severity,
      medications: selectedMedicines,
      isolation,
      dietRecommendations: dietRecommendation,
      followUpDate: followUpDate || null,
      specialInstructions,
      vetNotes,
      estimatedCost: estimatedCost ? parseFloat(estimatedCost) : 0,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 p-5 rounded-xl">
              <h4 className="text-right font-bold text-green-900 mb-4 flex items-center justify-end gap-2">
                📋 المعلومات الأساسية
              </h4>
              
              <div className="space-y-4">
                {/* Animal Selection */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">الحيوان *</Label>
                  <Select value={animalId} onValueChange={setAnimalId}>
                    <SelectTrigger className="text-right h-11">
                      <SelectValue placeholder="اختر الحيوان المراد فحصه" />
                    </SelectTrigger>
                    <SelectContent>
                      {animals
                        .filter((a: any) => a.status === "active")
                        .map((animal: any) => (
                          <SelectItem key={animal.id} value={animal.id}>
                            <div className="flex justify-between items-center w-full gap-4">
                              <div className="flex flex-col items-start">
                                <span className="font-bold">{animal.earTag}</span>
                                <span className="text-xs text-muted-foreground">
                                  {animal.animalType} - {animal.breed}
                                </span>
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {animal.currentWeight ? `${animal.currentWeight} كجم` : ""}
                              </div>
                            </div>
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedAnimal && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div className="text-right">
                          <span className="text-muted-foreground">رقم الأذن:</span>
                          <span className="font-bold mr-2">{selectedAnimal.earTag}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground">النوع:</span>
                          <span className="font-bold mr-2">{selectedAnimal.animalType}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground">السلالة:</span>
                          <span className="font-bold mr-2">{selectedAnimal.breed}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-muted-foreground">العمر:</span>
                          <span className="font-bold mr-2">
                            {selectedAnimal.birthDate 
                              ? Math.floor((new Date().getTime() - new Date(selectedAnimal.birthDate).getTime()) / (1000 * 60 * 60 * 24 * 30))
                              : "غير محدد"} شهر
                          </span>
                        </div>
                        {selectedAnimal.currentWeight && (
                          <div className="text-right">
                            <span className="text-muted-foreground">الوزن الحالي:</span>
                            <span className="font-bold text-green-600 mr-2">
                              {selectedAnimal.currentWeight} كجم
                            </span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Veterinarian */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">اسم الطبيب البيطري</Label>
                  <Input
                    placeholder="د. محمد أحمد"
                    value={veterinarian}
                    onChange={(e) => setVeterinarian(e.target.value)}
                    className="text-right h-11"
                  />
                </div>

                {/* Treatment Date */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">تاريخ الفحص *</Label>
                  <Input
                    type="date"
                    value={treatmentDate}
                    onChange={(e) => setTreatmentDate(e.target.value)}
                    className="text-right h-11"
                  />
                </div>

                {/* Treatment Type */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">نوع الزيارة / العلاج *</Label>
                  <RadioGroup value={treatmentType} onValueChange={setTreatmentType}>
                    <div className="grid grid-cols-2 gap-3">
                      {treatmentTypes.map((type) => (
                        <div key={type.value} className="flex items-center space-x-2 space-x-reverse">
                          <RadioGroupItem value={type.value} id={type.value} />
                          <Label
                            htmlFor={type.value}
                            className="text-right cursor-pointer font-medium flex-1"
                          >
                            {type.label}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 p-5 rounded-xl">
              <h4 className="text-right font-bold text-blue-900 mb-4 flex items-center justify-end gap-2">
                <Activity className="w-5 h-5" />
                الفحص السريري
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                {/* Temperature */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">درجة الحرارة (°س)</Label>
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="38.5"
                    value={temperature}
                    onChange={(e) => setTemperature(e.target.value)}
                    className="text-right h-11"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    الطبيعي: 38-39 درجة
                  </p>
                </div>

                {/* Heart Rate */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">معدل النبض (نبضة/دقيقة)</Label>
                  <Input
                    type="number"
                    placeholder="70"
                    value={heartRate}
                    onChange={(e) => setHeartRate(e.target.value)}
                    className="text-right h-11"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    الطبيعي: 60-80
                  </p>
                </div>

                {/* Respiratory Rate */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">معدل التنفس (نفس/دقيقة)</Label>
                  <Input
                    type="number"
                    placeholder="20"
                    value={respiratoryRate}
                    onChange={(e) => setRespiratoryRate(e.target.value)}
                    className="text-right h-11"
                  />
                  <p className="text-xs text-muted-foreground text-right">
                    الطبيعي: 15-30
                  </p>
                </div>

                {/* Appetite */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">الشهية</Label>
                  <Select value={appetite} onValueChange={setAppetite}>
                    <SelectTrigger className="text-right h-11">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="excellent">ممتازة 😋</SelectItem>
                      <SelectItem value="good">جيدة 🙂</SelectItem>
                      <SelectItem value="moderate">متوسطة 😐</SelectItem>
                      <SelectItem value="poor">ضعيفة 😞</SelectItem>
                      <SelectItem value="none">منعدمة 😢</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Behavior */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">السلوك العام</Label>
                  <Select value={behavior} onValueChange={setBehavior}>
                    <SelectTrigger className="text-right h-11">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">نشيط ومتنبه ✨</SelectItem>
                      <SelectItem value="normal">طبيعي 👍</SelectItem>
                      <SelectItem value="lethargic">خامل / كسول 😴</SelectItem>
                      <SelectItem value="restless">قلق / متوتر 😰</SelectItem>
                      <SelectItem value="aggressive">عدواني 😠</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobility */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">الحركة</Label>
                  <Select value={mobility} onValueChange={setMobility}>
                    <SelectTrigger className="text-right h-11">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="normal">طبيعية 🚶</SelectItem>
                      <SelectItem value="limping">عرج طفيف 🦵</SelectItem>
                      <SelectItem value="severe_limping">عرج شديد 🚫</SelectItem>
                      <SelectItem value="reluctant">متردد في الحركة ⚠️</SelectItem>
                      <SelectItem value="unable">غير قادر على الحركة 🛑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Symptoms Checklist */}
            <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 p-5 rounded-xl">
              <h4 className="text-right font-bold text-orange-900 mb-4 flex items-center justify-end gap-2">
                <AlertCircle className="w-5 h-5" />
                الأعراض الملاحظة
              </h4>
              
              <div className="grid grid-cols-2 gap-3">
                {symptomsList.map((symptom) => (
                  <div key={symptom} className="flex items-center space-x-2 space-x-reverse">
                    <Checkbox
                      id={symptom}
                      checked={symptoms.includes(symptom)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSymptoms([...symptoms, symptom]);
                        } else {
                          setSymptoms(symptoms.filter((s) => s !== symptom));
                        }
                      }}
                    />
                    <Label htmlFor={symptom} className="text-right cursor-pointer text-sm">
                      {symptom}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 p-5 rounded-xl">
              <h4 className="text-right font-bold text-purple-900 mb-4 flex items-center justify-end gap-2">
                <FileText className="w-5 h-5" />
                التشخيص
              </h4>
              
              <div className="space-y-4">
                {/* Diagnosis Category */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">تصنيف المرض / الحالة</Label>
                  <Select value={diagnosisCategory} onValueChange={setDiagnosisCategory}>
                    <SelectTrigger className="text-right h-11">
                      <SelectValue placeholder="اختر التصنيف" />
                    </SelectTrigger>
                    <SelectContent>
                      {diagnosisCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Diagnosis Description */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">التشخيص التفصيلي</Label>
                  <Textarea
                    placeholder="اكتب التشخيص الطبي بالتفصيل..."
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    rows={4}
                    className="text-right resize-none"
                  />
                </div>

                {/* Severity */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">درجة الخطورة</Label>
                  <RadioGroup value={severity} onValueChange={setSeverity}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse p-3 rounded-lg border-2 border-green-200 bg-green-50">
                        <RadioGroupItem value="mild" id="mild" />
                        <Label htmlFor="mild" className="text-right cursor-pointer flex-1 font-medium">
                          🟢 خفيفة - لا تحتاج لمتابعة مكثفة
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse p-3 rounded-lg border-2 border-yellow-200 bg-yellow-50">
                        <RadioGroupItem value="moderate" id="moderate" />
                        <Label htmlFor="moderate" className="text-right cursor-pointer flex-1 font-medium">
                          🟡 متوسطة - تحتاج لمتابعة دورية
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse p-3 rounded-lg border-2 border-red-200 bg-red-50">
                        <RadioGroupItem value="severe" id="severe" />
                        <Label htmlFor="severe" className="text-right cursor-pointer flex-1 font-medium">
                          🔴 خطيرة - تحتاج لمتابعة مكثفة وعناية خاصة
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-indigo-50 to-blue-50 border border-indigo-200 p-5 rounded-xl">
              <h4 className="text-right font-bold text-indigo-900 mb-4 flex items-center justify-end gap-2">
                <Pill className="w-5 h-5" />
                خطة العلاج والأدوية
              </h4>
              
              <div className="space-y-4">
                {/* Medicine Selection */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <Label className="text-right block font-semibold mb-2">اختر الدواء من المخزون</Label>
                    <Select value={currentMedicine} onValueChange={setCurrentMedicine}>
                      <SelectTrigger className="text-right h-11">
                        <SelectValue placeholder="اختر الدواء" />
                      </SelectTrigger>
                      <SelectContent>
                        {medicines.map((medicine: any) => (
                          <SelectItem key={medicine.id} value={medicine.id}>
                            <div className="flex justify-between items-center w-full gap-4">
                              <span className="font-medium">{medicine.itemName}</span>
                              <span className="text-xs text-green-600">
                                متاح: {parseFloat(medicine.currentStock).toFixed(1)} {medicine.unit}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-right block font-semibold mb-2">الجرعة</Label>
                    <Input
                      placeholder="مثال: 5 مل"
                      value={currentDosage}
                      onChange={(e) => setCurrentDosage(e.target.value)}
                      className="text-right h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-right block font-semibold mb-2">التكرار</Label>
                    <Select value={currentFrequency} onValueChange={setCurrentFrequency}>
                      <SelectTrigger className="text-right h-11">
                        <SelectValue placeholder="كم مرة" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once">مرة واحدة</SelectItem>
                        <SelectItem value="twice">مرتين يومياً</SelectItem>
                        <SelectItem value="thrice">3 مرات يومياً</SelectItem>
                        <SelectItem value="four">4 مرات يومياً</SelectItem>
                        <SelectItem value="weekly">مرة أسبوعياً</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-right block font-semibold mb-2">المدة</Label>
                    <Input
                      placeholder="مثال: 7 أيام"
                      value={currentDuration}
                      onChange={(e) => setCurrentDuration(e.target.value)}
                      className="text-right h-11"
                    />
                  </div>

                  <div>
                    <Label className="text-right block font-semibold mb-2">طريقة الإعطاء</Label>
                    <Select value={currentRoute} onValueChange={setCurrentRoute}>
                      <SelectTrigger className="text-right h-11">
                        <SelectValue placeholder="اختر الطريقة" />
                      </SelectTrigger>
                      <SelectContent>
                        {administrationRoutes.map((route) => (
                          <SelectItem key={route} value={route}>
                            {route}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Button type="button" onClick={addMedicine} variant="outline" className="w-full">
                  <Plus className="w-4 h-4 ml-2" />
                  إضافة الدواء للخطة العلاجية
                </Button>

                {/* Selected Medicines List */}
                {selectedMedicines.length > 0 && (
                  <div className="space-y-2">
                    <Label className="text-right block font-semibold">الأدوية المختارة:</Label>
                    {selectedMedicines.map((med, index) => (
                      <Card key={index} className="bg-white border-indigo-200">
                        <CardContent className="p-3">
                          <div className="flex justify-between items-start">
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removeMedicine(index)}
                              className="text-red-600"
                            >
                              ✕
                            </Button>
                            <div className="flex-1 text-right">
                              <div className="font-bold text-indigo-900">{med.medicineName}</div>
                              <div className="text-sm text-muted-foreground mt-1 space-y-1">
                                <div>📊 الجرعة: {med.dosage}</div>
                                <div>🔄 التكرار: {med.frequency}</div>
                                <div>⏰ المدة: {med.duration}</div>
                                <div>💉 الطريقة: {med.route}</div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-5">
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200 p-5 rounded-xl">
              <h4 className="text-right font-bold text-teal-900 mb-4 flex items-center justify-end gap-2">
                📝 التوصيات والإرشادات
              </h4>
              
              <div className="space-y-4">
                {/* Isolation */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">العزل الصحي</Label>
                  <RadioGroup value={isolation} onValueChange={setIsolation}>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="no" id="no_isolation" />
                        <Label htmlFor="no_isolation" className="text-right cursor-pointer">
                          لا يحتاج لعزل
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="recommended" id="recommended_isolation" />
                        <Label htmlFor="recommended_isolation" className="text-right cursor-pointer">
                          يُفضل العزل
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <RadioGroupItem value="required" id="required_isolation" />
                        <Label htmlFor="required_isolation" className="text-right cursor-pointer">
                          يجب العزل فوراً (حالة معدية)
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {/* Diet Recommendation */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">التوصيات الغذائية</Label>
                  <Textarea
                    placeholder="مثال: علف خاص غني بالبروتين، إضافة فيتامينات، تقليل الأعلاف الخشنة..."
                    value={dietRecommendation}
                    onChange={(e) => setDietRecommendation(e.target.value)}
                    rows={3}
                    className="text-right resize-none"
                  />
                </div>

                {/* Follow-up Date */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">موعد المتابعة القادم</Label>
                  <Input
                    type="date"
                    value={followUpDate}
                    onChange={(e) => setFollowUpDate(e.target.value)}
                    className="text-right h-11"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>

                {/* Special Instructions */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">تعليمات خاصة</Label>
                  <Textarea
                    placeholder="أي تعليمات إضافية للرعاية اليومية..."
                    value={specialInstructions}
                    onChange={(e) => setSpecialInstructions(e.target.value)}
                    rows={3}
                    className="text-right resize-none"
                  />
                </div>

                {/* Vet Notes */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">ملاحظات الطبيب</Label>
                  <Textarea
                    placeholder="ملاحظات إضافية من الطبيب البيطري..."
                    value={vetNotes}
                    onChange={(e) => setVetNotes(e.target.value)}
                    rows={4}
                    className="text-right resize-none"
                  />
                </div>

                {/* Estimated Cost */}
                <div className="space-y-2">
                  <Label className="text-right block font-semibold">التكلفة التقديرية (جنيه)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={estimatedCost}
                    onChange={(e) => setEstimatedCost(e.target.value)}
                    className="text-right h-11"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const steps = [
    { number: 1, title: "المعلومات الأساسية", icon: "📋" },
    { number: 2, title: "الفحص السريري", icon: "🔬" },
    { number: 3, title: "التشخيص", icon: "📝" },
    { number: 4, title: "العلاج", icon: "💊" },
    { number: 5, title: "التوصيات", icon: "✅" },
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="gap-2">
          <Plus className="w-5 h-5" />
          تقرير بيطري جديد
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto" dir="rtl">
        <DialogHeader className="text-right border-b pb-4">
          <DialogTitle className="text-right text-2xl font-bold flex items-center justify-end gap-2">
            <Stethoscope className="w-7 h-7 text-primary" />
            تقرير طبي بيطري شامل
          </DialogTitle>
          <DialogDescription className="text-right text-base mt-2">
            🏥 نظام متكامل لتسجيل الفحص البيطري والتشخيص والعلاج
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-6 px-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                    currentStep === step.number
                      ? "bg-primary text-primary-foreground scale-110 shadow-lg"
                      : currentStep > step.number
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? "✓" : step.icon}
                </div>
                <div className={`text-xs mt-2 font-semibold text-center ${
                  currentStep === step.number ? "text-primary" : "text-muted-foreground"
                }`}>
                  {step.title}
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-1 flex-1 mx-2 ${
                  currentStep > step.number ? "bg-green-500" : "bg-gray-200"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <div className="min-h-[400px]">
          {renderStep()}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 justify-between pt-4 border-t">
          <div className="flex gap-2">
            {currentStep < 5 && (
              <Button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                disabled={currentStep === 1 && !animalId}
                size="lg"
              >
                التالي ←
              </Button>
            )}
            {currentStep === 5 && (
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={treatmentMutation.isPending}
                size="lg"
                className="px-8"
              >
                {treatmentMutation.isPending ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    جاري الحفظ...
                  </>
                ) : (
                  <>
                    <Stethoscope className="w-4 h-4 ml-2" />
                    حفظ التقرير
                  </>
                )}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                size="lg"
              >
                → السابق
              </Button>
            )}
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={treatmentMutation.isPending}
              size="lg"
            >
              إلغاء
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
