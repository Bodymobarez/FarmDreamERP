# دليل إصلاح مشاكل Vercel - FarmDreamERP

## 🚨 المشكلة الحالية
التطبيق منشور على [https://farm-dream-erp1.vercel.app/](https://farm-dream-erp1.vercel.app/) ولكن جميع API endpoints تعطي خطأ 500.

## 🔧 الإصلاحات المطبقة

### 1. إصلاح API Handler
- تم إصلاح `api/index.ts` ليعمل مع Vercel
- تم إضافة error handling أفضل
- تم إصلاح CORS settings

### 2. إصلاح قاعدة البيانات
- تم إضافة فحص للـ DATABASE_URL
- تم إضافة fallback للعمل بدون قاعدة بيانات
- تم إصلاح `server/db.ts`

### 3. إضافة API مبسط للاختبار
- تم إنشاء `api/simple.ts` للاختبار
- تم إنشاء `api/test.ts` للاختبار

## 🚀 خطوات النشر السريع

### 1. إعداد متغيرات البيئة في Vercel
```bash
# في Vercel Dashboard، أضف:
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

### 2. النشر
```bash
# تأكد من أن التغييرات محفوظة
git add .
git commit -m "Fix Vercel deployment issues"
git push

# أو استخدم Vercel CLI
vercel --prod
```

## 🧪 اختبار الإصلاحات

### 1. اختبار API مبسط
```bash
curl https://farm-dream-erp1.vercel.app/api/simple
```

### 2. اختبار Health Check
```bash
curl https://farm-dream-erp1.vercel.app/api/health
```

### 3. اختبار API الرئيسي
```bash
curl https://farm-dream-erp1.vercel.app/api/animals
```

## 📋 الملفات المحدثة

1. **`api/index.ts`** - إصلاح Vercel handler
2. **`server/db.ts`** - إضافة fallback للقاعدة البيانات
3. **`server/storage.ts`** - إضافة فحص قاعدة البيانات
4. **`api/simple.ts`** - API مبسط للاختبار
5. **`api/test.ts`** - API للاختبار

## 🔍 استكشاف الأخطاء

### خطأ 500:
1. تحقق من Vercel logs
2. تأكد من وجود DATABASE_URL
3. تحقق من CORS settings

### خطأ CORS:
1. أضف domain إلى CORS_ORIGIN
2. تحقق من headers

### خطأ 404:
1. تحقق من vercel.json routes
2. تأكد من وجود api/index.ts

## ✅ النتيجة المتوقعة

بعد النشر:
- ✅ Frontend يعمل على Vercel
- ✅ API endpoints تعمل بدون أخطاء 500
- ✅ جميع الموديولات تعمل
- ✅ قاعدة البيانات متصلة (إذا تم إعدادها)

## 🎯 الخطوات التالية

1. **نشر التغييرات** على Vercel
2. **اختبار API endpoints** 
3. **إعداد قاعدة البيانات** إذا لم تكن مُعدة
4. **اختبار جميع الموديولات**

## 📞 الدعم

إذا استمرت المشاكل:
1. تحقق من Vercel logs
2. تأكد من متغيرات البيئة
3. اختبر API مبسط أولاً
