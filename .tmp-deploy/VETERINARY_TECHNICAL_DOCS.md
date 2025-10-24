# 🔧 التوثيق التقني - نظام العلاجات البيطرية

## 📁 هيكل الملفات

```
FarmDreamERP/
├── client/src/
│   ├── components/
│   │   └── VeterinaryTreatmentDialog.tsx    # نموذج إضافة تقرير طبي
│   └── pages/
│       └── Treatments.tsx                    # صفحة عرض التقارير
├── server/
│   ├── routes.ts                             # API endpoints
│   └── storage.ts                            # وظائف قاعدة البيانات
└── shared/
    └── schema.ts                             # هيكل الجداول والتحقق
```

---

## 🗄️ قاعدة البيانات

### جدول `veterinary_treatments`

```typescript
export const veterinaryTreatments = pgTable("veterinary_treatments", {
  // Primary Key
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  
  // Basic Information
  animalId: varchar("animal_id", { length: 255 }).notNull(),
  veterinarian: varchar("veterinarian", { length: 255 }).notNull(),
  treatmentDate: timestamp("treatment_date").notNull().defaultNow(),
  treatmentType: varchar("treatment_type", { length: 50 }).notNull(),
  
  // Clinical Examination
  temperature: decimal("temperature", { precision: 4, scale: 1 }),
  heartRate: varchar("heart_rate", { length: 20 }),
  respiratoryRate: varchar("respiratory_rate", { length: 20 }),
  appetite: varchar("appetite", { length: 50 }),
  behavior: varchar("behavior", { length: 50 }),
  mobility: varchar("mobility", { length: 50 }),
  symptoms: text("symptoms"), // JSON array
  
  // Diagnosis
  diagnosisCategory: varchar("diagnosis_category", { length: 100 }),
  diagnosisDescription: text("diagnosis_description").notNull(),
  severity: varchar("severity", { length: 20 }).notNull(),
  
  // Treatment Plan
  medications: text("medications"), // JSON array
  
  // Recommendations
  isolation: varchar("isolation", { length: 50 }),
  dietRecommendations: text("diet_recommendations"),
  followUpDate: timestamp("follow_up_date"),
  specialInstructions: text("special_instructions"),
  
  // Additional Information
  vetNotes: text("vet_notes"),
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }).default("0"),
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }).default("0"),
  
  // Status Tracking
  status: varchar("status", { length: 20 }).notNull().default("ongoing"),
  completedDate: timestamp("completed_date"),
  outcome: varchar("outcome", { length: 50 }),
  
  // Timestamps
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
```

### Enums والقيم المسموحة

#### `treatmentType`:
- `vaccination`: تطعيم / لقاح
- `disease_treatment`: علاج مرض
- `parasite_treatment`: علاج طفيليات
- `wound_treatment`: علاج جروح
- `preventive_care`: رعاية وقائية
- `surgery`: عملية جراحية
- `emergency`: حالة طوارئ
- `routine_checkup`: كشف دوري

#### `severity`:
- `mild`: خفيفة
- `moderate`: متوسطة
- `severe`: خطيرة

#### `status`:
- `ongoing`: جاري
- `completed`: مكتمل
- `followup_required`: يحتاج متابعة

#### `outcome`:
- `recovered`: شفي
- `improved`: تحسن
- `unchanged`: لا تغيير
- `deceased`: نفق

#### `appetite`:
- `excellent`: ممتازة
- `good`: جيدة
- `moderate`: متوسطة
- `poor`: ضعيفة
- `none`: منعدمة

#### `behavior`:
- `active`: نشيط ومتنبه
- `normal`: طبيعي
- `lethargic`: خامل / كسول
- `restless`: قلق / متوتر
- `aggressive`: عدواني

#### `mobility`:
- `normal`: طبيعية
- `limping`: عرج طفيف
- `severe_limping`: عرج شديد
- `reluctant`: متردد في الحركة
- `unable`: غير قادر على الحركة

#### `isolation`:
- `no`: لا يحتاج لعزل
- `recommended`: يُفضل العزل
- `required`: يجب العزل فوراً

---

## 🔌 API Endpoints

### 1. جلب جميع التقارير
```http
GET /api/treatments
Query Parameters:
  - animalId (optional): تصفية حسب الحيوان
  
Response:
[
  {
    id: "uuid",
    animalId: "uuid",
    veterinarian: "د. محمد أحمد",
    treatmentDate: "2025-10-11T10:00:00Z",
    treatmentType: "disease_treatment",
    temperature: "39.5",
    heartRate: "75",
    respiratoryRate: "22",
    appetite: "poor",
    behavior: "lethargic",
    mobility: "normal",
    symptoms: "[\"حمى\", \"إسهال\"]",
    diagnosisCategory: "أمراض هضمية",
    diagnosisDescription: "التهاب معوي حاد",
    severity: "moderate",
    medications: "[{...}]",
    isolation: "recommended",
    dietRecommendations: "علف خفيف",
    followUpDate: "2025-10-14T10:00:00Z",
    specialInstructions: "مراقبة الحرارة",
    vetNotes: "استجابة جيدة للعلاج",
    estimatedCost: "500.00",
    actualCost: "0.00",
    status: "ongoing",
    completedDate: null,
    outcome: null,
    createdAt: "2025-10-11T10:00:00Z",
    updatedAt: "2025-10-11T10:00:00Z"
  }
]
```

### 2. جلب تقرير واحد
```http
GET /api/treatments/:id
  
Response:
{
  id: "uuid",
  animalId: "uuid",
  ...
}
```

### 3. إنشاء تقرير جديد
```http
POST /api/treatments
Content-Type: application/json

Body:
{
  animalId: "uuid",                    // مطلوب
  veterinarian: "د. محمد أحمد",
  treatmentDate: "2025-10-11",
  treatmentType: "disease_treatment",  // مطلوب
  temperature: "39.5",
  heartRate: "75",
  respiratoryRate: "22",
  appetite: "poor",
  behavior: "lethargic",
  mobility: "normal",
  symptoms: ["حمى", "إسهال"],          // array
  diagnosisCategory: "أمراض هضمية",
  diagnosisDescription: "...",         // مطلوب
  severity: "moderate",                // مطلوب
  medications: [                       // array
    {
      medicineId: "uuid",
      medicineName: "مضاد حيوي",
      dosage: "10 مل",
      frequency: "مرتين يومياً",
      duration: "5 أيام",
      route: "حقن عضلي"
    }
  ],
  isolation: "recommended",
  dietRecommendations: "علف خفيف",
  followUpDate: "2025-10-14",
  specialInstructions: "مراقبة الحرارة",
  vetNotes: "استجابة جيدة",
  estimatedCost: 500.00
}

Response:
{
  id: "uuid",
  ...
}
```

### 4. تحديث تقرير
```http
PUT /api/treatments/:id
Content-Type: application/json

Body: (same as POST, all fields optional)

Response:
{
  id: "uuid",
  ...
}
```

### 5. حذف تقرير
```http
DELETE /api/treatments/:id

Response:
{
  success: true
}
```

### 6. جلب تقارير حيوان معين
```http
GET /api/animals/:id/treatments

Response:
[
  {...},
  {...}
]
```

---

## 🎨 المكونات (Components)

### 1. VeterinaryTreatmentDialog

#### الخصائص (Props):
لا يوجد (self-contained component)

#### الحالة (State):
```typescript
// Dialog state
const [open, setOpen] = useState(false);
const [currentStep, setCurrentStep] = useState(1);

// Step 1: Basic Information
const [animalId, setAnimalId] = useState("");
const [veterinarian, setVeterinarian] = useState("");
const [treatmentDate, setTreatmentDate] = useState(new Date().toISOString().split('T')[0]);
const [treatmentType, setTreatmentType] = useState("");

// Step 2: Clinical Examination
const [temperature, setTemperature] = useState("");
const [heartRate, setHeartRate] = useState("");
const [respiratoryRate, setRespiratoryRate] = useState("");
const [appetite, setAppetite] = useState("");
const [behavior, setBehavior] = useState("");
const [mobility, setMobility] = useState("");
const [symptoms, setSymptoms] = useState<string[]>([]);

// Step 3: Diagnosis
const [diagnosisCategory, setDiagnosisCategory] = useState("");
const [diagnosis, setDiagnosis] = useState("");
const [severity, setSeverity] = useState("");

// Step 4: Treatment Plan
const [selectedMedicines, setSelectedMedicines] = useState<Array<{...}>>([]);
const [currentMedicine, setCurrentMedicine] = useState("");
const [currentDosage, setCurrentDosage] = useState("");
const [currentFrequency, setCurrentFrequency] = useState("");
const [currentDuration, setCurrentDuration] = useState("");
const [currentRoute, setCurrentRoute] = useState("");

// Step 5: Recommendations
const [isolation, setIsolation] = useState("");
const [dietRecommendation, setDietRecommendation] = useState("");
const [followUpDate, setFollowUpDate] = useState("");
const [specialInstructions, setSpecialInstructions] = useState("");
const [vetNotes, setVetNotes] = useState("");
const [estimatedCost, setEstimatedCost] = useState("");
```

#### الوظائف الرئيسية:
```typescript
// Add medicine to treatment plan
const addMedicine = () => {
  if (!currentMedicine || !currentDosage) {
    toast({ title: "خطأ", description: "...", variant: "destructive" });
    return;
  }
  
  const medicine = medicines.find((m: any) => m.id === currentMedicine);
  setSelectedMedicines([...selectedMedicines, {
    medicineId: currentMedicine,
    medicineName: medicine?.itemName || "",
    dosage: currentDosage,
    frequency: currentFrequency,
    duration: currentDuration,
    route: currentRoute,
  }]);
  
  // Reset fields
  setCurrentMedicine("");
  setCurrentDosage("");
  // ...
};

// Remove medicine from plan
const removeMedicine = (index: number) => {
  setSelectedMedicines(selectedMedicines.filter((_, i) => i !== index));
};

// Submit treatment report
const handleSubmit = () => {
  if (!animalId || !treatmentType || !diagnosis) {
    toast({ title: "خطأ", description: "...", variant: "destructive" });
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

// Reset form
const resetForm = () => {
  setCurrentStep(1);
  setAnimalId("");
  // ... reset all fields
};
```

#### الخطوات (Steps):
1. **المعلومات الأساسية**: اختيار الحيوان، الطبيب، التاريخ، نوع العلاج
2. **الفحص السريري**: العلامات الحيوية، السلوك، الأعراض
3. **التشخيص**: التصنيف، الوصف، درجة الخطورة
4. **العلاج**: إضافة الأدوية والجرعات
5. **التوصيات**: العزل، التغذية، المتابعة، الملاحظات

---

### 2. Treatments Page

#### الخصائص:
```typescript
const [searchTerm, setSearchTerm] = useState("");
const [filterType, setFilterType] = useState("all");
const [filterSeverity, setFilterSeverity] = useState("all");
```

#### Queries:
```typescript
// Fetch treatments
const { data: treatments = [], isLoading } = useQuery<any[]>({
  queryKey: ["/api/treatments"],
});

// Fetch animals
const { data: animals = [] } = useQuery<any[]>({
  queryKey: ["/api/animals"],
});
```

#### التصفية:
```typescript
const filteredTreatments = treatments.filter((treatment: any) => {
  const matchesSearch = 
    treatment.veterinarian?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    treatment.diagnosisDescription?.toLowerCase().includes(searchTerm.toLowerCase());
  
  const matchesType = filterType === "all" || treatment.treatmentType === filterType;
  const matchesSeverity = filterSeverity === "all" || treatment.severity === filterSeverity;

  return matchesSearch && matchesType && matchesSeverity;
});
```

#### الإحصائيات:
```typescript
const stats = {
  total: treatments.length,
  thisWeek: treatments.filter((t: any) => {
    const treatmentDate = new Date(t.treatmentDate);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return treatmentDate >= weekAgo;
  }).length,
  severe: treatments.filter((t: any) => t.severity === "severe").length,
  followUps: treatments.filter((t: any) => {
    if (!t.followUpDate) return false;
    const followUp = new Date(t.followUpDate);
    const today = new Date();
    const weekFromNow = new Date();
    weekFromNow.setDate(weekFromNow.getDate() + 7);
    return followUp >= today && followUp <= weekFromNow;
  }).length,
};
```

#### Helper Functions:
```typescript
const getSeverityColor = (severity: string) => {
  switch (severity) {
    case "mild": return "bg-green-100 text-green-800 border-green-200";
    case "moderate": return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "severe": return "bg-red-100 text-red-800 border-red-200";
    default: return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getSeverityLabel = (severity: string) => {
  switch (severity) {
    case "mild": return "🟢 خفيفة";
    case "moderate": return "🟡 متوسطة";
    case "severe": return "🔴 خطيرة";
    default: return "غير محدد";
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
```

---

## 🔄 تدفق البيانات (Data Flow)

### 1. إنشاء تقرير جديد:
```
User Input (Form)
    ↓
VeterinaryTreatmentDialog State
    ↓
handleSubmit()
    ↓
treatmentMutation.mutate()
    ↓
POST /api/treatments
    ↓
Server Validation (Zod Schema)
    ↓
storage.insertVeterinaryTreatment()
    ↓
Database INSERT
    ↓
Query Invalidation
    ↓
UI Update
```

### 2. عرض التقارير:
```
Page Load
    ↓
useQuery(["/api/treatments"])
    ↓
GET /api/treatments
    ↓
storage.getVeterinaryTreatments()
    ↓
Database SELECT
    ↓
Data Transform & Filter
    ↓
Render Treatment Cards
```

---

## 🎨 تخصيص الألوان والأيقونات

### نظام الألوان:
```css
/* Severity Colors */
.severity-mild { 
  background: #dcfce7;     /* green-100 */
  color: #166534;          /* green-800 */
  border: #bbf7d0;         /* green-200 */
}

.severity-moderate { 
  background: #fef3c7;     /* yellow-100 */
  color: #854d0e;          /* yellow-800 */
  border: #fde68a;         /* yellow-200 */
}

.severity-severe { 
  background: #fee2e2;     /* red-100 */
  color: #991b1b;          /* red-800 */
  border: #fecaca;         /* red-200 */
}

/* Section Colors */
.clinical-section {
  background: linear-gradient(to-br, #dbeafe, #cffafe);  /* blue-50 to cyan-50 */
  border: #bfdbfe;         /* blue-200 */
}

.symptoms-section {
  background: linear-gradient(to-br, #fed7aa, #fef3c7);  /* orange-50 to amber-50 */
  border: #fed7aa;         /* orange-200 */
}

.diagnosis-section {
  background: linear-gradient(to-br, #f3e8ff, #fce7f3);  /* purple-50 to pink-50 */
  border: #e9d5ff;         /* purple-200 */
}

.treatment-section {
  background: linear-gradient(to-br, #e0e7ff, #dbeafe);  /* indigo-50 to blue-50 */
  border: #c7d2fe;         /* indigo-200 */
}

.recommendations-section {
  background: linear-gradient(to-br, #ccfbf1, #cffafe);  /* teal-50 to cyan-50 */
  border: #99f6e4;         /* teal-200 */
}
```

### الأيقونات:
```typescript
import {
  Stethoscope,      // 🩺 رمز الطب
  FileText,         // 📄 التقارير
  Calendar,         // 📅 المواعيد
  Package,          // 📦 الأدوية
  TrendingUp,       // 📈 الإحصائيات
  AlertTriangle,    // ⚠️ التحذيرات
  Activity,         // 💓 النشاط
  Plus,             // ➕ إضافة
  Pill,             // 💊 الأدوية
} from "lucide-react";
```

---

## 🔒 التحقق من البيانات (Validation)

### Schema Validation:
```typescript
export const insertVeterinaryTreatmentSchema = createInsertSchema(veterinaryTreatments, {
  animalId: z.string().min(1, "رقم الحيوان مطلوب"),
  veterinarian: z.string().min(1, "اسم الطبيب مطلوب"),
  treatmentDate: z.date().optional(),
  treatmentType: z.enum([
    "vaccination",
    "disease_treatment",
    "parasite_treatment",
    "wound_treatment",
    "preventive_care",
    "surgery",
    "emergency",
    "routine_checkup"
  ], {
    errorMap: () => ({ message: "نوع العلاج غير صحيح" })
  }),
  diagnosisDescription: z.string().min(1, "وصف التشخيص مطلوب"),
  severity: z.enum(["mild", "moderate", "severe"], {
    errorMap: () => ({ message: "درجة الخطورة غير صحيحة" })
  }),
  // ... other fields with optional validation
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});
```

### Frontend Validation:
```typescript
const handleSubmit = () => {
  // Required fields check
  if (!animalId || !treatmentType || !diagnosis) {
    toast({
      title: "خطأ",
      description: "يرجى ملء جميع الحقول المطلوبة",
      variant: "destructive",
    });
    return;
  }

  // Medicine validation
  if (selectedMedicines.length > 0) {
    for (const med of selectedMedicines) {
      if (!med.dosage || !med.frequency) {
        toast({
          title: "خطأ في الأدوية",
          description: "يرجى تحديد الجرعة والتكرار لجميع الأدوية",
          variant: "destructive",
        });
        return;
      }
    }
  }

  // Submit
  treatmentMutation.mutate({...});
};
```

---

## 🔍 البحث والتصفية

### Search Implementation:
```typescript
const filteredTreatments = treatments.filter((treatment: any) => {
  // Text search
  const searchLower = searchTerm.toLowerCase();
  const matchesSearch = 
    !searchTerm ||
    treatment.veterinarian?.toLowerCase().includes(searchLower) ||
    treatment.diagnosisDescription?.toLowerCase().includes(searchLower) ||
    treatment.diagnosisCategory?.toLowerCase().includes(searchLower);
  
  // Type filter
  const matchesType = 
    filterType === "all" || 
    treatment.treatmentType === filterType;
  
  // Severity filter
  const matchesSeverity = 
    filterSeverity === "all" || 
    treatment.severity === filterSeverity;

  return matchesSearch && matchesType && matchesSeverity;
});
```

### Advanced Filters (Future):
```typescript
// Date range filter
const filterByDateRange = (start: Date, end: Date) => {
  return treatments.filter(t => {
    const date = new Date(t.treatmentDate);
    return date >= start && date <= end;
  });
};

// Animal filter
const filterByAnimal = (animalId: string) => {
  return treatments.filter(t => t.animalId === animalId);
};

// Status filter
const filterByStatus = (status: string) => {
  return treatments.filter(t => t.status === status);
};
```

---

## 📊 إحصائيات متقدمة

### معدل الشفاء:
```typescript
const calculateRecoveryRate = () => {
  const completed = treatments.filter(t => t.status === "completed");
  const recovered = completed.filter(t => t.outcome === "recovered");
  return (recovered.length / completed.length) * 100;
};
```

### أكثر الأمراض شيوعاً:
```typescript
const getMostCommonDiseases = () => {
  const categories = treatments.reduce((acc, t) => {
    const category = t.diagnosisCategory;
    acc[category] = (acc[category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  
  return Object.entries(categories)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);
};
```

### متوسط التكلفة:
```typescript
const getAverageCost = () => {
  const total = treatments.reduce((sum, t) => 
    sum + parseFloat(t.estimatedCost || "0"), 0
  );
  return total / treatments.length;
};
```

---

## 🚀 التحسينات والأداء

### Memoization:
```typescript
const filteredTreatments = useMemo(() => {
  return treatments.filter((treatment: any) => {
    // filtering logic
  });
}, [treatments, searchTerm, filterType, filterSeverity]);

const stats = useMemo(() => {
  return {
    total: treatments.length,
    thisWeek: /* calculation */,
    severe: /* calculation */,
    followUps: /* calculation */,
  };
}, [treatments]);
```

### Pagination (Future):
```typescript
const [page, setPage] = useState(1);
const pageSize = 10;

const paginatedTreatments = useMemo(() => {
  const start = (page - 1) * pageSize;
  return filteredTreatments.slice(start, start + pageSize);
}, [filteredTreatments, page]);
```

### Lazy Loading:
```typescript
const { data, fetchNextPage, hasNextPage } = useInfiniteQuery({
  queryKey: ["/api/treatments"],
  queryFn: ({ pageParam = 0 }) => 
    fetch(`/api/treatments?offset=${pageParam}`).then(r => r.json()),
  getNextPageParam: (lastPage, pages) => 
    lastPage.length === pageSize ? pages.length * pageSize : undefined,
});
```

---

## 🐛 التعامل مع الأخطاء

### Error Boundaries:
```typescript
class TreatmentErrorBoundary extends React.Component {
  state = { hasError: false };

  static getDerivedStateFromError(error: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Treatment error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-container">
          <h2>حدث خطأ في تحميل التقارير الطبية</h2>
          <button onClick={() => window.location.reload()}>
            إعادة المحاولة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
```

### API Error Handling:
```typescript
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
    toast({ title: "تم الحفظ بنجاح ✅" });
  },
  onError: (error: Error) => {
    toast({
      title: "خطأ في الحفظ",
      description: error.message,
      variant: "destructive",
    });
  },
});
```

---

## 🧪 اختبارات (Testing)

### Unit Tests:
```typescript
describe("VeterinaryTreatmentDialog", () => {
  test("renders all steps", () => {
    const { getByText } = render(<VeterinaryTreatmentDialog />);
    expect(getByText("المعلومات الأساسية")).toBeInTheDocument();
  });

  test("validates required fields", () => {
    const { getByText, getByRole } = render(<VeterinaryTreatmentDialog />);
    const submitButton = getByRole("button", { name: /حفظ التقرير/i });
    fireEvent.click(submitButton);
    expect(getByText(/يرجى ملء جميع الحقول المطلوبة/i)).toBeInTheDocument();
  });

  test("adds medicine to treatment plan", () => {
    // Test implementation
  });
});
```

### Integration Tests:
```typescript
describe("Treatments API", () => {
  test("creates new treatment", async () => {
    const treatment = {
      animalId: "test-animal-id",
      veterinarian: "د. Test",
      treatmentType: "disease_treatment",
      diagnosisDescription: "Test diagnosis",
      severity: "moderate",
    };

    const response = await fetch("/api/treatments", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(treatment),
    });

    expect(response.ok).toBe(true);
    const data = await response.json();
    expect(data.id).toBeDefined();
  });
});
```

---

## 📱 التوافق مع الأجهزة المحمولة

### Responsive Design:
```typescript
// Grid layouts adapt to screen size
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {/* Content */}
</div>

// Dialog sizes adjust
<DialogContent className="max-w-5xl max-h-[95vh] overflow-y-auto">
  {/* Content */}
</DialogContent>

// Touch-friendly buttons
<Button size="lg" className="gap-2 min-h-[44px]">
  {/* Content */}
</Button>
```

---

## 🔐 الأمان (Security)

### Input Sanitization:
```typescript
// Server-side validation
const sanitizeInput = (input: string) => {
  return input
    .trim()
    .replace(/[<>]/g, "")  // Remove HTML tags
    .substring(0, 1000);   // Limit length
};
```

### Authorization:
```typescript
// Future: Check user permissions
const canEditTreatment = (userId: string, treatment: Treatment) => {
  return treatment.createdBy === userId || isAdmin(userId);
};
```

---

## 📚 المراجع والموارد

### Libraries Used:
- **React Query**: للتعامل مع البيانات
- **Zod**: للتحقق من البيانات
- **Drizzle ORM**: لقاعدة البيانات
- **shadcn/ui**: للمكونات
- **Lucide React**: للأيقونات

### Best Practices:
1. استخدم TypeScript للأمان النمطي
2. استخدم React Query للـ caching
3. قم بالتحقق من البيانات في الـ frontend والـ backend
4. استخدم Zod schemas للتحقق الموحد
5. اعرض رسائل خطأ واضحة للمستخدم
6. استخدم optimistic updates للأداء الأفضل

---

**آخر تحديث: أكتوبر 2025** 📅
**الإصدار: 1.0.0** 🎯
