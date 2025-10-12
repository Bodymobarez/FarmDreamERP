# إصلاح تصدير PDF مع دعم اللغة العربية

## 🔧 المشكلة
كان تصدير PDF يظهر النصوص العربية بشكل غير صحيح (رموز غريبة) بسبب:
- عدم دعم الخطوط العربية في jsPDF
- مشاكل ترميز UTF-8
- عدم وجود خط عربي محمل

## ✅ الحل المُنفذ

### 1. الترجمة التلقائية للإنجليزية
بما أن jsPDF لا يدعم العربية بدون خطوط إضافية، تم إنشاء نظام ترجمة تلقائي:

```typescript
function translateToEnglish(text: string): string {
  const translations: { [key: string]: string } = {
    // العناوين
    'تقرير مؤشرات الأداء الرئيسية (KPI)': 'Key Performance Indicators (KPI) Report',
    'تقرير مؤشرات الأداء': 'Performance Indicators Report',
    
    // رؤوس الأعمدة
    'المؤشر': 'Indicator',
    'القيمة': 'Value',
    'الهدف': 'Target',
    'النسبة': 'Percentage',
    
    // المؤشرات
    'ADG': 'ADG',
    'FCR': 'FCR',
    'معدل البقاء': 'Survival Rate',
    'التكلفة/رأس': 'Cost per Head',
    
    // الوحدات
    'كجم': 'kg',
    'ج': 'EGP',
  };
  
  // البحث والاستبدال
  ...
}
```

### 2. تحسينات التصميم

#### أ) إعدادات المستند:
```typescript
const doc = new jsPDF({
  orientation: 'portrait',  // عمودي
  unit: 'mm',               // المليمتر
  format: 'a4',             // حجم A4
});
```

#### ب) تنسيق العنوان:
```typescript
doc.setFontSize(16);
doc.setFont('helvetica', 'bold');
doc.text(translatedTitle, 105, 15, { align: 'center' });
```

#### ج) تنسيق الجدول:
```typescript
autoTable(doc, {
  head: [translatedHeaders],
  body: translatedData,
  startY: 25,
  styles: {
    font: 'helvetica',
    fontSize: 10,
    cellPadding: 3,
    halign: 'center',      // محاذاة أفقية
    valign: 'middle',      // محاذاة عمودية
  },
  headStyles: {
    fillColor: [41, 128, 185],    // أزرق
    textColor: [255, 255, 255],   // أبيض
    fontStyle: 'bold',
    halign: 'center',
  },
  alternateRowStyles: {
    fillColor: [245, 245, 245],   // رمادي فاتح
  },
  columnStyles: {
    0: { cellWidth: 40 },
    1: { cellWidth: 40 },
    2: { cellWidth: 40 },
    3: { cellWidth: 40 },
  },
  margin: { top: 25, left: 15, right: 15 },
});
```

#### د) إضافة تاريخ التقرير:
```typescript
const currentDate = new Date().toLocaleDateString('en-US');
doc.text(`Report Date: ${currentDate}`, 105, doc.internal.pageSize.height - 10, { align: 'center' });
```

## 📊 مثال على التحويل

### قبل:
```
العنوان: تقرير مؤشرات الأداء الرئيسية (KPI)

| المؤشر       | القيمة    | الهدف     | النسبة  |
|--------------|-----------|-----------|---------|
| ADG          | 0.92 كجم  | 0.85 كجم  | 108.2%  |
| FCR          | 2.9       | 3.2       | 110.3%  |
| معدل البقاء  | 100%      | 97%       | 103.1%  |
| التكلفة/رأس  | 2,300 ج   | 2,200 ج   | 95.7%   |
```

### بعد (في PDF):
```
Title: Key Performance Indicators (KPI) Report

| Indicator         | Value      | Target     | Percentage |
|-------------------|------------|------------|------------|
| ADG               | 0.92 kg    | 0.85 kg    | 108.2%     |
| FCR               | 2.9        | 3.2        | 110.3%     |
| Survival Rate     | 100%       | 97%        | 103.1%     |
| Cost per Head     | 2,300 EGP  | 2,200 EGP  | 95.7%      |

Report Date: 10/11/2025
```

## 🎨 التنسيق النهائي

### الألوان:
- **رأس الجدول**: أزرق (#2980B9) مع نص أبيض
- **الصفوف المتناوبة**: رمادي فاتح (#F5F5F5)
- **النص**: أسود (#000000)

### الخطوط:
- **العنوان**: Helvetica Bold - 16pt
- **الجدول**: Helvetica - 10pt
- **التاريخ**: Helvetica - 10pt

### المحاذاة:
- **العنوان**: وسط الصفحة
- **الجدول**: جميع الخلايا في الوسط
- **التاريخ**: أسفل الصفحة في الوسط

## 🔄 التحويلات المتاحة

### العناوين:
| العربية | الإنجليزية |
|---------|------------|
| تقرير مؤشرات الأداء الرئيسية (KPI) | Key Performance Indicators (KPI) Report |
| تقرير مؤشرات الأداء | Performance Indicators Report |

### رؤوس الأعمدة:
| العربية | الإنجليزية |
|---------|------------|
| المؤشر | Indicator |
| القيمة | Value |
| الهدف | Target |
| النسبة | Percentage |

### المؤشرات:
| العربية | الإنجليزية |
|---------|------------|
| ADG | ADG |
| FCR | FCR |
| معدل البقاء | Survival Rate |
| التكلفة/رأس | Cost per Head |

### الوحدات:
| العربية | الإنجليزية |
|---------|------------|
| كجم | kg |
| ج | EGP |

## 🚀 كيفية إضافة ترجمات جديدة

إذا أردت إضافة مصطلحات جديدة للترجمة:

```typescript
const translations: { [key: string]: string } = {
  // أضف هنا
  'مصطلح عربي جديد': 'New English Term',
  'وحدة قياس': 'Unit of Measure',
  // ... إلخ
};
```

## 📝 ملاحظات مهمة

### 1. Excel و CSV يدعمان العربية
- **Excel**: يدعم UTF-8 بشكل كامل ✅
- **CSV**: يدعم UTF-8 بشكل كامل ✅
- **PDF**: يحتاج ترجمة أو خط عربي ⚠️

### 2. حل بديل للمستقبل
لإضافة دعم كامل للعربية في PDF:
1. تحميل خط عربي (مثل: Amiri, Cairo, Tajawal)
2. تضمينه في jsPDF
3. استخدامه بدلاً من helvetica

### 3. الترجمة الذكية
الدالة `translateToEnglish()`:
- تبحث عن ترجمة كاملة أولاً
- ثم تبحث عن ترجمات جزئية
- تستبدل جميع التطابقات

## ✅ الخلاصة

### ما تم إصلاحه:
- ✅ PDF الآن يُصدّر بنص إنجليزي واضح
- ✅ لا رموز غريبة
- ✅ تنسيق احترافي
- ✅ ألوان متناسقة
- ✅ جدول منظم
- ✅ تاريخ التقرير

### ما يعمل بشكل صحيح:
- ✅ Excel - يدعم العربية كاملة
- ✅ CSV - يدعم العربية كاملة
- ✅ PDF - يُصدّر بالإنجليزية بشكل احترافي

### الملفات المعدلة:
- ✅ `client/src/lib/exportUtils.ts`

النظام جاهز الآن! 🎊
