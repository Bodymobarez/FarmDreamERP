# 🚀 تعليمات نشر التحديثات

## ⚠️ مهم: اختيار الإجابات الصحيحة عند تشغيل `npm run db:push`

عند تشغيل الأمر، سيسألك Drizzle عدة أسئلة. إليك الإجابات الصحيحة:

### ✅ الأسئلة والإجابات

#### 1. سؤال عن `treatment_number` في جدول `veterinary_treatments`
```
Is treatment_number column in veterinary_treatments table created or renamed from another column?
```

**الإجابة الصحيحة**: 
```
✓ + treatment_number        create column
```
**تفسير**: هذا عمود جديد، وليس إعادة تسمية لعمود موجود

---

#### 2. أسئلة مشابهة قد تظهر للحقول الجديدة الأخرى

##### `breed` في جدول `animals`
**الإجابة**: `+ breed        create column`

##### `barnId` في جدول `batches`
**الإجابة**: `+ barnId        create column`

##### `barnId` في جدول `receptions`
**الإجابة**: `+ barnId        create column`

##### `distributionStatus` في جدول `receptions`
**الإجابة**: `+ distributionStatus        create column`

---

## 🔄 الطريقة البديلة (إذا كان هناك مشكلة)

إذا واجهت مشاكل، يمكنك استخدام Migration Files:

### 1. إنشاء ملفات Migration
```bash
npx drizzle-kit generate
```

### 2. مراجعة الملفات المنشأة في مجلد `migrations`

### 3. تطبيق Migrations يدوياً
```bash
npx drizzle-kit migrate
```

---

## 📝 الأعمدة الجديدة التي سيتم إنشاؤها

### جداول جديدة كاملة:
1. ✅ `barns` - جدول العنابر
2. ✅ `weight_records` - جدول سجلات الأوزان
3. ✅ `feed_records` - جدول سجلات الأعلاف

### أعمدة جديدة في جداول موجودة:

#### `animals`:
- `breed` - السلالة
- `birthDate` - تاريخ الولادة
- `barnId` - ربط مع العنبر
- `receptionId` - ربط مع الاستقبال
- `purchasePrice` - سعر الشراء
- `healthStatus` - الحالة الصحية
- `saleDate` - تاريخ البيع
- `saleWeight` - وزن البيع
- `salePrice` - سعر البيع

#### `batches`:
- `barnId` - ربط مع العنبر
- `expectedCloseDate` - تاريخ الإغلاق المتوقع
- `currentAnimals` - عدد الحيوانات الحالية
- `laborCost` - تكلفة العمالة

#### `receptions`:
- `batchId` - ربط مع الدفعة
- `barnId` - ربط مع العنبر
- `supplierName` - اسم المورد
- `breed` - السلالة
- `averageWeight` - متوسط الوزن
- `transportCost` - تكلفة النقل
- `distributionStatus` - حالة التوزيع
- `paidAmount` - المبلغ المدفوع
- `remainingAmount` - المبلغ المتبقي
- `animalType` - نوع الحيوان
- `otherCosts` - تكاليف أخرى

#### `veterinary_treatments`:
- `treatmentNumber` - رقم العلاج ⭐ (هذا الذي سأل عنه)
- `batchId` - ربط مع الدفعة
- `symptoms` - الأعراض
- `frequency` - تكرار الجرعة
- `duration` - مدة العلاج
- `medicationCost` - تكلفة الأدوية
- `consultationCost` - تكلفة الاستشارة
- `otherCosts` - تكاليف أخرى
- `totalCost` - التكلفة الإجمالية
- `followUpDate` - تاريخ المتابعة
- `followUpRequired` - هل المتابعة مطلوبة
- `outcome` - نتيجة العلاج

---

## ✅ الخطوات النهائية بعد التطبيق

### 1. تأكد من نجاح التطبيق
```bash
npm run db:push
```
يجب أن ترى: `✓ Changes applied`

### 2. شغّل الخادم
```bash
npm run dev
```

### 3. اختبر API
```bash
# اختبر العنابر
curl http://localhost:5001/api/barns

# اختبر سجل الأوزان
curl http://localhost:5001/api/weight-records

# اختبر سجل الأعلاف
curl http://localhost:5001/api/feed-records
```

---

## 🎉 تم!

بعد إتمام هذه الخطوات، سيكون النظام جاهزاً بالكامل مع جميع المديولات مربوطة!

**ملاحظة**: جميع الحقول الجديدة اختيارية (nullable)، لذلك لن تتأثر البيانات الموجودة.

