# دليل نشر FarmDreamERP على Vercel

## ✅ الإصلاحات المطبقة

### 1. إعدادات Vercel
- تم إصلاح `vercel.json` للعمل مع Express.js
- تم إنشاء `api/index.ts` منفصل لـ Vercel
- تم إصلاح مسارات API

### 2. إعدادات البناء
- تم إصلاح `package.json` scripts
- تم إصلاح `tsconfig.json` للعمل مع Vercel
- تم إضافة `.vercelignore`

### 3. متغيرات البيئة
- تم إنشاء `.env.local` مع متغيرات البيئة المطلوبة
- تم إصلاح مشكلة DATABASE_URL

## 🚀 خطوات النشر

### 1. إعداد قاعدة البيانات
```bash
# في Vercel Dashboard، أضف متغيرات البيئة:
DATABASE_URL=postgresql://username:password@host:port/database
NODE_ENV=production
```

### 2. النشر
```bash
# تأكد من أن التطبيق يعمل محلياً
npm run dev

# اختبر البناء
npm run vercel-build

# انشر على Vercel
vercel --prod
```

## 📁 هيكل الملفات المحدث

```
├── api/
│   └── index.ts          # Vercel API handler
├── server/
│   ├── index.ts          # Express server
│   ├── routes.ts         # API routes
│   └── storage.ts        # Database operations
├── client/               # React frontend
├── vercel.json          # Vercel configuration
├── .env.local           # Environment variables
└── .vercelignore        # Vercel ignore file
```

## 🔧 الإعدادات المطلوبة

### متغيرات البيئة في Vercel:
- `DATABASE_URL`: رابط قاعدة البيانات PostgreSQL
- `NODE_ENV`: production
- `CORS_ORIGIN`: https://your-domain.vercel.app

### قاعدة البيانات:
- استخدم Neon, Supabase, أو أي خدمة PostgreSQL
- تأكد من إعداد SSL
- أضف Vercel IPs إلى whitelist

## ✅ الاختبار

### محلياً:
```bash
npm run dev
curl http://localhost:3000/api/animals
```

### على Vercel:
```bash
curl https://your-app.vercel.app/api/animals
```

## 🐛 استكشاف الأخطاء

### خطأ 500:
- تحقق من `DATABASE_URL`
- تحقق من logs في Vercel Dashboard

### خطأ CORS:
- أضف domain إلى `CORS_ORIGIN`
- تحقق من `vercel.json`

### خطأ 404:
- تحقق من `vercel.json` routes
- تأكد من وجود `api/index.ts`

## 📝 ملاحظات مهمة

1. **قاعدة البيانات**: تأكد من إعداد قاعدة بيانات PostgreSQL
2. **SSL**: Vercel يتطلب SSL لـ CORS
3. **الذاكرة**: Vercel له حدود ذاكرة، راقب الاستخدام
4. **الوقت**: API calls لها timeout limit

## 🎯 النتيجة المتوقعة

بعد النشر، يجب أن يعمل:
- ✅ Frontend على `https://your-app.vercel.app`
- ✅ API على `https://your-app.vercel.app/api/*`
- ✅ جميع الموديولات تعمل بشكل صحيح
- ✅ قاعدة البيانات متصلة
- ✅ CORS يعمل بشكل صحيح
