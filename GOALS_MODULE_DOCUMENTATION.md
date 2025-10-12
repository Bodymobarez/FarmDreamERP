# 🎯 نظام إدارة الأهداف - Performance Goals Module

## 📋 نظرة عامة

نظام متطور لتتبع وإدارة أهداف الأداء في المزرعة، يربط بين مؤشرات الأداء (KPIs) والأهداف المحددة، ويوفر تنبيهات تلقائية عند تحقيق الأهداف أو الفشل فيها.

---

## 🎯 الميزات الرئيسية

### 1. إدارة الأهداف
- ✅ تحديد أهداف لمؤشرات أداء متعددة
- ✅ ربط الأهداف بدفعات محددة أو عامة
- ✅ تحديد أولويات الأهداف (حرجة، عالية، متوسطة، منخفضة)
- ✅ تحديد تواريخ بداية ونهاية لكل هدف

### 2. تتبع التقدم
- ✅ حساب تلقائي لنسبة التقدم
- ✅ مؤشرات بصرية ملونة (أخضر/أزرق/أصفر/أحمر)
- ✅ تحديث تلقائي للقيم الحالية
- ✅ إشعارات عند تحقيق الأهداف

### 3. التقارير والإحصائيات
- ✅ نسبة النجاح الإجمالية
- ✅ عدد الأهداف النشطة/المحققة/الفاشلة
- ✅ تقارير تفصيلية لكل هدف
- ✅ تاريخ الأهداف المحققة

---

## 📊 أنواع الأهداف المدعومة

### 1. ADG - معدل النمو اليومي
```typescript
{
  goalType: "adg",
  targetValue: "1.2",  // كجم/يوم
  unit: "كجم/يوم"
}
```
**مثال:** الوصول لمعدل نمو 1.2 كجم يومياً

### 2. FCR - معامل التحويل الغذائي
```typescript
{
  goalType: "fcr",
  targetValue: "2.5",  // أقل = أفضل
  unit: ""
}
```
**مثال:** تحسين FCR ليصل إلى 2.5 أو أقل

### 3. Survival Rate - معدل البقاء
```typescript
{
  goalType: "survival_rate",
  targetValue: "97",   // نسبة مئوية
  unit: "%"
}
```
**مثال:** الوصول لمعدل بقاء 97% أو أكثر

### 4. Cost Per Head - التكلفة لكل رأس
```typescript
{
  goalType: "cost_per_head",
  targetValue: "2000",  // أقل = أفضل
  unit: "ج"
}
```
**مثال:** تقليل التكلفة لكل رأس إلى 2000 ج أو أقل

### 5. Profit - الربح
```typescript
{
  goalType: "profit",
  targetValue: "50000",
  unit: "ج"
}
```
**مثال:** تحقيق ربح 50,000 ج

### 6. Weight Gain - الزيادة في الوزن
```typescript
{
  goalType: "weight_gain",
  targetValue: "150",
  unit: "كجم"
}
```
**مثال:** زيادة وزن الدفعة بمقدار 150 كجم

### 7. Feed Efficiency - كفاءة الأعلاف
```typescript
{
  goalType: "feed_efficiency",
  targetValue: "85",
  unit: "%"
}
```
**مثال:** الوصول لكفاءة أعلاف 85%

---

## 🗄️ قاعدة البيانات

### جدول: `performance_goals`

```sql
CREATE TABLE performance_goals (
  id VARCHAR PRIMARY KEY,
  goal_name VARCHAR(255) NOT NULL,           -- اسم الهدف
  goal_type VARCHAR(50) NOT NULL,            -- نوع الهدف
  target_value DECIMAL(10,2) NOT NULL,       -- القيمة المستهدفة
  current_value DECIMAL(10,2) DEFAULT 0,     -- القيمة الحالية
  unit VARCHAR(20),                          -- الوحدة
  batch_id VARCHAR(255),                     -- ربط بدفعة (اختياري)
  start_date TIMESTAMP DEFAULT NOW(),
  end_date TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',       -- active, achieved, failed, expired
  achieved_date TIMESTAMP,                   -- تاريخ التحقيق
  priority VARCHAR(20) DEFAULT 'medium',     -- low, medium, high, critical
  description TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

---

## 🎨 واجهة المستخدم

### الصفحة الرئيسية `/goals`

#### 1. الإحصائيات العامة
```
┌─────────────────┬──────────────────┬──────────────────┬─────────────────┐
│ الأهداف النشطة │  الأهداف المحققة │  الأهداف الفاشلة │   نسبة النجاح  │
│       8         │        12        │         2        │      85.7%      │
└─────────────────┴──────────────────┴──────────────────┴─────────────────┘
```

#### 2. بطاقة الهدف
```
┌──────────────────────────────────────────────────────────────┐
│ تحسين معدل النمو اليومي                         [عالية] [نشط] │
│ معدل النمو اليومي (ADG)                                      │
├──────────────────────────────────────────────────────────────┤
│ القيمة المستهدفة      القيمة الحالية          نسبة التقدم   │
│   1.20 كجم/يوم          1.15 كجم/يوم              95.8%     │
├──────────────────────────────────────────────────────────────┤
│ [████████████████████░░] 95.8%                               │
├──────────────────────────────────────────────────────────────┤
│ بدأ: 1 يناير 2025    ينتهي: 31 مارس 2025                    │
└──────────────────────────────────────────────────────────────┘
```

---

## 🔢 حساب نسبة التقدم

### للمؤشرات التي "الأكثر أفضل" (ADG, Survival Rate, Profit):
```typescript
progress = (currentValue / targetValue) * 100
```

**مثال:**
- الهدف: ADG = 1.2 كجم
- الحالي: 1.15 كجم
- التقدم: (1.15 / 1.2) × 100 = **95.8%**

### للمؤشرات التي "الأقل أفضل" (FCR, Cost):
```typescript
progress = (targetValue / currentValue) * 100
```

**مثال:**
- الهدف: FCR = 2.5
- الحالي: 2.8
- التقدم: (2.5 / 2.8) × 100 = **89.3%**

---

## 🎨 الألوان والمؤشرات

### ألوان التقدم:
```css
100%+   : أخضر  #10b981  ✅ تم التحقيق
75-99%  : أزرق   #3b82f6  🔵 قريب من الهدف
50-74%  : أصفر   #f59e0b  ⚠️ يحتاج جهد
0-49%   : أحمر   #ef4444  ❌ بعيد عن الهدف
```

### ألوان الحالة:
```css
achieved : أخضر  #22c55e  ✅ محقق
active   : أزرق   #3b82f6  🔵 نشط
failed   : أحمر   #ef4444  ❌ فاشل
expired  : رمادي  #6b7280  ⏰ منتهي
```

### ألوان الأولوية:
```css
critical : أحمر     #fee2e2  🔴 حرجة
high     : برتقالي  #fed7aa  🟠 عالية
medium   : أصفر     #fef3c7  🟡 متوسطة
low      : أخضر     #d1fae5  🟢 منخفضة
```

---

## 📊 أمثلة عملية

### مثال 1: هدف تحسين ADG للدفعة الأولى
```typescript
{
  goalName: "تحسين معدل النمو - الدفعة 1",
  goalType: "adg",
  targetValue: "1.2",
  currentValue: "0.95",
  unit: "كجم/يوم",
  batchId: "batch-001",
  priority: "high",
  status: "active",
  startDate: "2025-01-01",
  endDate: "2025-03-31",
  description: "الوصول لمعدل نمو 1.2 كجم يومياً بنهاية الدورة"
}
```

**النتيجة:**
- التقدم: (0.95 / 1.2) × 100 = **79.2%** 🔵
- الحالة: قريب من الهدف
- الإجراء: متابعة التغذية وتحسين العلف

### مثال 2: هدف تقليل التكلفة
```typescript
{
  goalName: "تقليل التكلفة لكل رأس",
  goalType: "cost_per_head",
  targetValue: "2000",
  currentValue: "2150",
  unit: "ج",
  priority: "critical",
  status: "active",
  description: "تقليل التكلفة من 2150 ج إلى 2000 ج لكل رأس"
}
```

**النتيجة:**
- التقدم: (2000 / 2150) × 100 = **93.0%** 🔵
- الفارق: 150 ج متبقية للتوفير
- الإجراء: تحسين كفاءة الأعلاف وتقليل الهدر

### مثال 3: هدف معدل البقاء
```typescript
{
  goalName: "رفع معدل البقاء على قيد الحياة",
  goalType: "survival_rate",
  targetValue: "97",
  currentValue: "98.5",
  unit: "%",
  status: "achieved",
  achievedDate: "2025-02-15",
  priority: "high"
}
```

**النتيجة:**
- التقدم: (98.5 / 97) × 100 = **101.5%** ✅
- الحالة: **محقق** 🎉
- تم التحقيق في: 15 فبراير 2025

---

## 🔔 التنبيهات والإشعارات

### متى تظهر التنبيهات؟

#### 1. عند تحقيق الهدف (100%+)
```typescript
if (progress >= 100 && status === "active") {
  toast({
    title: "🎉 تم تحقيق الهدف!",
    description: `تهانينا! تم تحقيق هدف "${goalName}"`,
    variant: "success"
  });
  
  // تحديث الحالة
  updateGoal({ 
    status: "achieved",
    achievedDate: new Date()
  });
}
```

#### 2. تحذير عند اقتراب الموعد النهائي
```typescript
const daysLeft = Math.floor((endDate - now) / (1000 * 60 * 60 * 24));

if (daysLeft <= 7 && progress < 80) {
  toast({
    title: "⚠️ تحذير!",
    description: `بقي ${daysLeft} أيام لانتهاء الهدف "${goalName}" والتقدم ${progress}%`,
    variant: "warning"
  });
}
```

#### 3. عند فشل الهدف
```typescript
if (now > endDate && progress < 100) {
  toast({
    title: "❌ فشل الهدف",
    description: `لم يتم تحقيق هدف "${goalName}" في الموعد المحدد`,
    variant: "destructive"
  });
  
  updateGoal({ status: "failed" });
}
```

---

## 🔄 التحديث التلقائي

### كيف يتم تحديث القيم الحالية؟

```typescript
// دالة تحديث الأهداف بناءً على مؤشرات الأداء
async function updateGoalsFromKPIs() {
  const goals = await getActiveGoals();
  const kpis = await calculateCurrentKPIs();
  
  for (const goal of goals) {
    let currentValue = 0;
    
    switch (goal.goalType) {
      case "adg":
        currentValue = kpis.adg;
        break;
      case "fcr":
        currentValue = kpis.fcr;
        break;
      case "survival_rate":
        currentValue = kpis.survivalRate;
        break;
      case "cost_per_head":
        currentValue = kpis.costPerHead;
        break;
      // ... بقية الأنواع
    }
    
    await updateGoal(goal.id, { currentValue });
    
    // فحص إذا تم تحقيق الهدف
    const progress = calculateProgress(goal, currentValue);
    if (progress >= 100) {
      await achieveGoal(goal.id);
    }
  }
}

// تشغيل كل 24 ساعة
setInterval(updateGoalsFromKPIs, 24 * 60 * 60 * 1000);
```

---

## 📈 التكامل مع صفحة KPI

### إضافة مؤشر الأهداف في صفحة KPI:

```typescript
// في صفحة KPI.tsx
const { data: activeGoals } = useQuery({
  queryKey: ["/api/performance-goals/active"],
});

// عرض الأهداف ذات الصلة
<Card>
  <CardHeader>
    <CardTitle>الأهداف المرتبطة</CardTitle>
  </CardHeader>
  <CardContent>
    {activeGoals?.filter(g => g.goalType === "adg").map(goal => (
      <div key={goal.id} className="flex items-center gap-2">
        <Target className="h-4 w-4" />
        <span>{goal.goalName}</span>
        <Badge>{calculateProgress(goal)}%</Badge>
      </div>
    ))}
  </CardContent>
</Card>
```

---

## 🎯 سيناريوهات الاستخدام

### سيناريو 1: بداية دورة جديدة
```
1. إنشاء دفعة جديدة
2. تحديد أهداف الدفعة:
   - ADG: 1.2 كجم/يوم
   - FCR: 2.5 أو أقل
   - معدل البقاء: 97% أو أكثر
   - التكلفة/رأس: 2000 ج أو أقل
3. مراقبة التقدم يومياً
4. تعديل الاستراتيجية حسب الحاجة
```

### سيناريو 2: تحسين الأداء
```
1. مراجعة الأهداف الفاشلة السابقة
2. تحليل الأسباب
3. تحديد أهداف واقعية جديدة
4. تتبع التحسينات
```

### سيناريو 3: المنافسة والتحفيز
```
1. تحديد أهداف تحدي للفريق
2. مكافآت عند تحقيق الأهداف الحرجة
3. عرض لوحة الصدارة
4. تقارير أسبوعية للتقدم
```

---

## ✅ الخلاصة

### ما تم إنجازه:
- ✅ جدول `performance_goals` في قاعدة البيانات
- ✅ صفحة `/goals` لإدارة الأهداف
- ✅ مؤشرات بصرية متطورة
- ✅ حساب تلقائي للتقدم
- ✅ ألوان ديناميكية حسب الحالة
- ✅ إحصائيات شاملة

### القادم (مستقبلاً):
- ⏳ نموذج إضافة/تعديل الأهداف
- ⏳ API endpoints للأهداف
- ⏳ تحديث تلقائي من KPIs
- ⏳ إشعارات push عند تحقيق الأهداف
- ⏳ تقارير تفصيلية
- ⏳ تصدير الأهداف PDF/Excel

**التاريخ:** 11 أكتوبر 2025  
**الحالة:** ✅ الواجهة جاهزة - بانتظار API
