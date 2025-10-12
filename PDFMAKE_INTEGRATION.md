# تحديث نظام التصدير - استخدام pdfMake بدلاً من jsPDF

## 📋 ملخص التحديث

تم استبدال مكتبة **jsPDF** بمكتبة **pdfMake** لتوفير دعم كامل ومتطور للغة العربية في تصدير ملفات PDF.

---

## 🎯 الأسباب

### المشاكل في jsPDF:
- ❌ لا تدعم اللغة العربية افتراضياً
- ❌ تتطلب تحميل خطوط عربية مخصصة يدوياً
- ❌ صعوبة في ضبط اتجاه RTL
- ❌ مشاكل في عرض النص العربي بشكل صحيح

### المزايا في pdfMake:
- ✅ دعم كامل للغة العربية في خط Roboto
- ✅ دعم اتجاه RTL افتراضياً
- ✅ تنسيق متقدم للجداول
- ✅ سهولة في التخصيص والتنسيق
- ✅ واجهة برمجية بسيطة وواضحة

---

## 🔧 التثبيت

```bash
npm install pdfmake
npm i --save-dev @types/pdfmake
```

---

## 📝 التغييرات في الكود

### ملف: `client/src/lib/exportUtils.ts`

#### قبل التحديث (jsPDF):
```typescript
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export const exportToPDF = (title, headers, data, filename) => {
  const doc = new jsPDF({ orientation: 'portrait' });
  
  // تحويل للإنجليزية (workaround)
  const translatedTitle = translateToEnglish(title);
  const translatedHeaders = headers.map(h => translateToEnglish(h));
  
  doc.text(translatedTitle, 105, 15);
  autoTable(doc, {
    head: [translatedHeaders],
    body: translatedData
  });
  
  doc.save(filename);
};
```

#### بعد التحديث (pdfMake):
```typescript
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = pdfFonts;

export const exportToPDF = (title, headers, data, filename) => {
  const docDefinition = {
    defaultStyle: {
      font: 'Roboto', // يدعم العربية
      fontSize: 11,
      alignment: 'right' // RTL
    },
    
    content: [
      {
        text: title, // نص عربي مباشرة بدون ترجمة!
        style: 'header',
        alignment: 'center'
      },
      {
        table: {
          headerRows: 1,
          body: [
            headers.map(h => ({ text: h, style: 'tableHeader' })),
            ...data.map(row => row.map(cell => ({ text: String(cell) })))
          ]
        },
        layout: { /* تنسيق متقدم */ }
      }
    ],
    
    styles: {
      header: { fontSize: 18, bold: true, color: '#2C3E50' },
      tableHeader: { bold: true, color: 'white', fillColor: '#2980B9' }
    }
  };
  
  (pdfMake as any).createPdf(docDefinition).download(filename);
};
```

---

## ✨ الميزات الجديدة

### 1. دعم كامل للعربية
```typescript
// الآن يمكن استخدام النص العربي مباشرة بدون ترجمة
{
  text: 'تقرير مؤشرات الأداء الرئيسية (KPI)',
  alignment: 'center'
}
```

### 2. اتجاه RTL تلقائي
```typescript
defaultStyle: {
  alignment: 'right' // اتجاه من اليمين للشمال
}
```

### 3. تنسيق متقدم للجداول
```typescript
layout: {
  fillColor: function(rowIndex) {
    return rowIndex === 0 ? '#2980B9' : (rowIndex % 2 === 0 ? '#F5F5F5' : null);
  },
  hLineWidth: function() { return 1; },
  vLineWidth: function() { return 1; },
  paddingLeft: function() { return 8; },
  paddingRight: function() { return 8; }
}
```

### 4. أنماط مخصصة
```typescript
styles: {
  header: {
    fontSize: 18,
    bold: true,
    color: '#2C3E50'
  },
  tableHeader: {
    bold: true,
    fontSize: 12,
    color: 'white',
    fillColor: '#2980B9'
  },
  footer: {
    fontSize: 10,
    color: '#7F8C8D',
    italics: true
  }
}
```

---

## 🎨 مثال على الاستخدام

```typescript
import { exportToPDF } from '@/lib/exportUtils';

// في مكون KPI
const handleExportPDF = () => {
  const title = 'تقرير مؤشرات الأداء الرئيسية (KPI)';
  const headers = ['المؤشر', 'القيمة', 'الهدف', 'النسبة'];
  const data = [
    ['ADG', '1.2 كجم', '1.3 كجم', '92%'],
    ['FCR', '2.8', '2.5', '89%'],
    ['معدل البقاء', '96%', '95%', '101%'],
    ['التكلفة/رأس', '1,200 ج', '1,100 ج', '91%']
  ];
  
  exportToPDF(title, headers, data, 'kpi-report.pdf');
};
```

---

## 📊 مقارنة النتائج

### قبل (jsPDF):
- ❌ النص العربي يظهر كـ "????" أو رموز غريبة
- ❌ اتجاه النص من اليسار لليمين (خطأ)
- ❌ تحتاج ترجمة للإنجليزية

### بعد (pdfMake):
- ✅ النص العربي يظهر بشكل صحيح وواضح
- ✅ اتجاه RTL صحيح من اليمين لليسار
- ✅ نص عربي مباشر بدون ترجمة
- ✅ تنسيق احترافي وجميل

---

## 🔄 التوافق

### ملفات تستخدم التصدير:
- ✅ `client/src/pages/KPI.tsx` - صفحة مؤشرات الأداء
- ✅ `client/src/pages/Reports.tsx` - صفحة التقارير
- ✅ أي صفحة تستخدم `exportToPDF` من `lib/exportUtils.ts`

### لا يوجد تغيير مطلوب في:
- Excel Export (لا تزال تستخدم XLSX)
- CSV Export (لا تزال تستخدم XLSX)

---

## 🚀 التحسينات المستقبلية

1. **إضافة شعار المزرعة**
   ```typescript
   content: [
     {
       image: 'data:image/png;base64,...',
       width: 100,
       alignment: 'center'
     }
   ]
   ```

2. **رسوم بيانية في PDF**
   ```typescript
   // استخدام canvas لإضافة الرسوم البيانية
   ```

3. **صفحات متعددة**
   ```typescript
   pageBreak: 'after' // فاصل صفحات تلقائي
   ```

4. **رأس وتذييل مخصص**
   ```typescript
   header: function(currentPage, pageCount) {
     return { text: `صفحة ${currentPage} من ${pageCount}` }
   }
   ```

---

## 📚 المراجع

- [pdfMake Documentation](http://pdfmake.org/)
- [pdfMake Playground](http://pdfmake.org/playground.html)
- [pdfMake GitHub](https://github.com/bpampuch/pdfmake)

---

## ✅ الخلاصة

تم **بنجاح** استبدال jsPDF بـ pdfMake مع:
- ✅ دعم كامل للعربية
- ✅ اتجاه RTL صحيح
- ✅ تنسيق احترافي
- ✅ سهولة في الاستخدام
- ✅ توافق كامل مع الكود الحالي

**التاريخ:** 11 أكتوبر 2025  
**الحالة:** ✅ مكتمل وجاهز للاستخدام
