# نظام التوجه الذكي لتصدير PDF 📄

## نظرة عامة
تم تطوير نظام ذكي لتصدير التقارير PDF يحدد تلقائياً أفضل توجه (Portrait/Landscape) حسب محتوى التقرير وعدد الأعمدة.

## 🧠 الذكاء الاصطناعي للتوجه

### خوارزمية تحليل التقرير
```typescript
const analyzeReportDimensions = (headers: string[], data: any[][]) => {
  const numColumns = headers.length;
  const avgColumnWidth = headers.reduce((sum, header) => sum + header.length, 0) / numColumns;
  const maxDataWidth = data.reduce((max, row) => {
    const rowWidth = row.reduce((sum, cell) => sum + String(cell || '').length, 0) / row.length;
    return Math.max(max, rowWidth);
  }, 0);
  
  const estimatedWidth = numColumns * Math.max(avgColumnWidth, maxDataWidth) * 8;
  
  return {
    numColumns,
    avgColumnWidth,
    maxDataWidth,
    estimatedWidth,
    recommendLandscape: numColumns > 6 || estimatedWidth > 1000
  };
};
```

## 📐 معايير التوجه التلقائي

### التوجه الأفقي (Landscape) 🌅
**يتم اختياره عندما:**
- عدد الأعمدة > 6
- العرض المقدر > 1000 بكسل
- البيانات تحتوي على نصوص طويلة

**المميزات:**
- مساحة أكبر للأعمدة الكثيرة
- خط أصغر ولكن واضح
- تباعد محسّن للبيانات الكثيفة

### التوجه العمودي (Portrait) 📱
**يتم اختياره عندما:**
- عدد الأعمدة ≤ 6
- العرض المقدر ≤ 1000 بكسل
- البيانات بسيطة ومقروءة

**المميزات:**
- خط أكبر وأوضح
- تباعد مريح للعينين
- مناسب للطباعة العادية

## 🔧 الإعدادات التكيفية

### حسب عدد الأعمدة
| عدد الأعمدة | التوجه | حجم الخط | التباعد |
|-------------|--------|----------|----------|
| 1-4 | Portrait | 14px | 12px |
| 5-6 | Portrait | 14px | 10px |
| 7-10 | Landscape | 13px | 10px |
| 11+ | Landscape | 11px | 8px |

### حسب المحتوى
```typescript
const fontSize = isLandscape ? (dimensions.numColumns > 10 ? 11 : 13) : 14;
const cellPadding = isLandscape ? (dimensions.numColumns > 10 ? '8px 6px' : '10px 8px') : '12px 10px';
const containerWidth = isLandscape ? 1200 : 800;
```

## 📊 أمثلة التطبيق

### تقرير سجل حركات المخزون
- **الأعمدة**: 13 عمود
- **التوجه**: أفقي (Landscape)
- **السبب**: عدد الأعمدة كبير
- **النتيجة**: عرض أفضل لجميع البيانات

### تقرير الحيوانات البسيط
- **الأعمدة**: 5 أعمدة
- **التوجه**: عمودي (Portrait)  
- **السبب**: عدد الأعمدة مناسب
- **النتيجة**: قراءة مريحة وطباعة جيدة

## 🚀 الدوال الجديدة

### 1. معاينة التوجه
```typescript
const preview = previewReportOrientation(headers, data);
console.log(preview.recommendedOrientation); // 'landscape' or 'portrait'
console.log(preview.orientationReason); // سبب الاختيار
```

### 2. تصدير التقارير الكبيرة
```typescript
await exportLargeReportToPDF(title, headers, data, filename, maxRowsPerPage);
```

### 3. التصدير العادي المحسّن
```typescript
await exportToPDF(title, headers, data, filename);
// يحدد التوجه تلقائياً
```

## 📋 المميزات الجديدة

### ✅ تحسينات الأداء
- تقليل دقة الصورة للتقارير الكبيرة
- استخدام autoTable للجداول الكبيرة
- تقسيم ذكي للبيانات الكثيرة

### ✅ تحسينات التصميم
- تنسيق متجاوب حسب التوجه
- حجم خط تكيفي
- تباعد محسّن للأعمدة

### ✅ معلومات التشخيص
- عرض معلومات التحليل في الكونسول
- إضافة معلومات التوجه في التقرير
- إحصائيات الأعمدة والسجلات

## 🎯 طريقة الاستخدام

### استخدام عادي (توجه تلقائي)
```typescript
const success = await exportToPDF("تقرير المخزون", headers, data, "inventory.pdf");
```

### مع معاينة التوجه
```typescript
const preview = previewReportOrientation(headers, data);
console.log(`سيتم استخدام التوجه: ${preview.recommendedOrientation}`);
const success = await exportToPDF("تقرير المخزون", headers, data, "inventory.pdf");
```

### للتقارير الكبيرة
```typescript
const success = await exportLargeReportToPDF("تقرير شامل", headers, data, "large-report.pdf", 30);
```

## 🔍 التشخيص والمراقبة

النظام يطبع معلومات مفيدة في الكونسول:

```
📊 تحليل التقرير: {
  عدد_الأعمدة: 13,
  العرض_المقدر: 1456,
  التوجه_المقترح: "أفقي (Landscape)"
}

📄 إعدادات PDF: {
  التوجه: "landscape",
  عرض_الصفحة: "297mm",
  ارتفاع_الصفحة: "210mm",
  عرض_الصورة: "297mm",
  ارتفاع_الصورة: "180.5mm"
}
```

## 🎨 التخصيص المتقدم

يمكن تخصيص معايير التوجه عبر تعديل دالة `analyzeReportDimensions`:

```typescript
// لجعل النظام أكثر تفضيلاً للتوجه الأفقي
recommendLandscape: numColumns > 5 || estimatedWidth > 800

// لجعل النظام أكثر تحفظاً
recommendLandscape: numColumns > 8 || estimatedWidth > 1200
```

## 🚨 ملاحظات مهمة

1. **الذاكرة**: التقارير الكبيرة تستهلك ذاكرة أكثر
2. **الأداء**: قد يستغرق وقت أطول للتقارير المعقدة
3. **التوافق**: يعمل مع جميع المتصفحات الحديثة
4. **الطباعة**: التوجه الأفقي مناسب للطابعات الحديثة

---
**تم التطوير**: أكتوبر 2025  
**النظام**: FarmDream ERP  
**الإصدار**: Smart PDF v2.0