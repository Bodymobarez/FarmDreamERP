# تصميم نظام ERP إدارة المزرعة - دليل التصميم الشامل

## نهج التصميم المُختار

**Design System Approach: Material Design 3 (متخصص للتطبيقات الزراعية)**

**المبرر:** نظام ERP للمزرعة يتطلب واجهة وظيفية واضحة لإدخال البيانات الكثيفة وعرض التقارير المعقدة. Material Design يوفر مكونات جاهزة قوية مع إمكانية التخصيص للسياق الزراعي العربي.

**المبادئ الأساسية:**
- واجهة "تاتش-فريندلي" بأزرار كبيرة كتطبيقات الموبايل
- بطاقات Card-based لتنظيم المعلومات
- تسلسل هرمي واضح للبيانات
- دعم RTL كامل للعربية
- ألوان مستوحاة من البيئة الزراعية

---

## نظام الألوان

### الوضع الفاتح (Light Mode - الافتراضي)
**الألوان الأساسية (Primary):**
- Primary: 142 65% 45% (أخضر زراعي دافئ)
- Primary Container: 142 65% 90% (أخضر فاتح للخلفيات)

**الألوان الثانوية (Secondary):**
- Secondary: 35 55% 50% (بني ترابي)
- Secondary Container: 35 55% 92%

**الألوان المحايدة:**
- Surface: 0 0% 98%
- Surface Variant: 142 15% 94%
- Background: 0 0% 100%
- Outline: 142 10% 70%

**الألوان الوظيفية:**
- Success: 142 70% 45% (أخضر للنجاح)
- Warning: 38 95% 55% (برتقالي للتحذير)
- Error: 0 70% 50% (أحمر للخطأ)
- Info: 210 90% 55% (أزرق للمعلومات)

### الوضع الداكن (Dark Mode)
**الألوان الأساسية:**
- Primary: 142 60% 70%
- Surface: 142 10% 12%
- Background: 142 10% 8%
- Outline: 142 8% 40%

---

## نظام الطباعة (Typography)

**عائلات الخطوط:**
- الأساسي (Arabic): 'Cairo', sans-serif
- الثانوي (Numbers/English): 'Inter', sans-serif

**أحجام النصوص:**
- Display Large: text-5xl font-bold (للعناوين الرئيسية)
- Headline: text-3xl font-semibold (عناوين الصفحات)
- Title: text-xl font-semibold (عناوين البطاقات)
- Body Large: text-lg (النصوص الأساسية)
- Body: text-base (النصوص العادية)
- Label: text-sm font-medium (التسميات)
- Caption: text-xs (النصوص الصغيرة)

**الأوزان:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

---

## نظام التخطيط (Layout System)

**وحدات المسافات Tailwind المستخدمة:**
- الأساسية: 4, 6, 8 (p-4, p-6, p-8 للبطاقات والحاويات)
- الكبيرة: 12, 16 (للمسافات بين الأقسام)
- الصغيرة: 2, 3 (للمسافات الدقيقة)

**البنية:**
- Container: max-w-7xl mx-auto px-4
- Grid Cards: grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6
- Sidebar: w-64 (على اليمين في RTL)
- Main Content: flex-1

---

## مكتبة المكونات الأساسية

### 1. البطاقات (Cards) - العنصر الأساسي
- رفع خفيف: shadow-md hover:shadow-lg
- حواف مستديرة: rounded-xl
- خلفية: bg-white dark:bg-surface
- Padding داخلي: p-6
- حد خفيف: border border-outline/20

### 2. الأزرار (Buttons) - كبيرة وواضحة
**Primary Button:**
- حجم كبير: px-8 py-4 text-lg
- ألوان: bg-primary text-white
- حواف: rounded-lg
- تأثير: hover:shadow-lg transition-all

**Secondary Button:**
- bg-secondary/10 text-secondary
- border border-secondary

**FAB (Floating Action Button):**
- دائري كبير: w-16 h-16 rounded-full
- أيقونة واضحة بحجم 32px
- ظل قوي: shadow-2xl
- ثابت: fixed bottom-8 left-8 (في RTL)

### 3. النماذج (Forms)
**Input Fields:**
- حجم كبير: h-14 px-4
- حدود واضحة: border-2 border-outline focus:border-primary
- خلفية: bg-surface-variant/30
- نص كبير: text-lg

**Select/Dropdown:**
- نفس أسلوب Input
- أيقونة سهم واضحة على اليسار (RTL)

### 4. الجداول (Tables)
- خلفية صفوف متبادلة: odd:bg-surface-variant/30
- حدود خفيفة: border-b border-outline/20
- رؤوس أعمدة: bg-primary/5 font-semibold
- خلايا: py-4 px-6 text-base

### 5. التنقل (Navigation)
**Top AppBar:**
- ارتفاع: h-16
- خلفية: bg-primary text-white
- ظل: shadow-md
- محتوى: عنوان الصفحة + أيقونات الإجراءات

**Sidebar Navigation:**
- عرض: w-64
- أيقونات كبيرة: w-6 h-6
- نص واضح: text-base
- عنصر نشط: bg-primary/10 border-r-4 border-primary

### 6. الرسوم البيانية (Charts)
- مكتبة: Chart.js أو Recharts
- ألوان: استخدام Primary/Secondary من النظام
- حاويات: داخل بطاقات مع عناوين واضحة

### 7. المؤشرات (KPI Cards)
- حجم كبير: min-h-32
- رقم ضخم: text-4xl font-bold
- تسمية واضحة: text-base text-outline
- أيقونة ملونة: w-12 h-12

### 8. التراكبات (Overlays)
**Modal/Dialog:**
- حجم: max-w-2xl
- خلفية overlay: bg-black/50 backdrop-blur-sm
- محتوى: bg-white rounded-2xl shadow-2xl p-8

**Bottom Sheet (للموبايل):**
- ينزلق من الأسفل
- حواف علوية مستديرة: rounded-t-3xl

### 9. التنبيهات (Alerts/Snackbar)
- موضع: fixed bottom-4 right-4 (RTL)
- ألوان حسب النوع: success/warning/error
- أيقونة + نص + زر إغلاق
- animation: slide-in-up

---

## الحركات والتفاعلات

**مبدأ عام:** الحركات دقيقة وهادفة - لا تشتت الانتباه

**التفاعلات الأساسية:**
- Hover على البطاقات: scale-[1.02] shadow-lg
- Hover على الأزرار: brightness-110
- Loading: spinner بألوان Primary
- Page transitions: fade 200ms
- Cards entrance: stagger animation (تدريجية)

**لا تستخدم:**
- حركات معقدة أو مبالغ فيها
- تأثيرات parallax
- حركات تلقائية غير متوقعة

---

## الأيقونات

**المكتبة:** Heroicons (outline وsolid)
**الاستخدام عبر CDN:**
```
<link href="https://cdn.jsdelivr.net/npm/heroicons@2.0.0/outline/style.css" rel="stylesheet">
```

**الأحجام:**
- صغير: w-5 h-5 (في النصوص)
- متوسط: w-6 h-6 (في الأزرار)
- كبير: w-8 h-8 (في العناوين)
- ضخم: w-12 h-12 (في الـ KPI cards)

---

## الصور والرسوميات

### مواقع الصور المقترحة:

**لوحة التحكم الرئيسية:**
- صورة خلفية خفيفة للمزرعة في الهيدر (overlay gradient)
- أيقونات حيوانات في بطاقات الـ KPIs

**صفحة الحيوانات:**
- placeholder images للحيوانات (بقر، أغنام، دواجن)
- تستخدم من مكتبات مثل Unsplash API

**صفحة فارغة (Empty States):**
- رسومات توضيحية بسيطة بألوان Primary/Secondary
- نص توجيهي واضح

**لا يوجد Hero Image كبير** - هذا نظام عمل داخلي، ليس موقع تسويقي

---

## إرشادات إمكانية الوصول

- تباين ألوان عالي: WCAG AAA للنصوص
- أحجام أزرار كبيرة: min 44x44px
- دعم لوحة المفاتيح كامل
- ARIA labels بالعربية
- focus states واضحة: ring-2 ring-primary
- الوضع الداكن متسق عبر كل المكونات

---

## خصائص RTL (Right-to-Left)

- اتجاه: dir="rtl" على العنصر الجذري
- Flexbox/Grid تلقائياً معكوس
- الأيقونات على اليسار في الأزرار
- القوائم المنسدلة تفتح لليسار
- Floating buttons على اليسار السفلي