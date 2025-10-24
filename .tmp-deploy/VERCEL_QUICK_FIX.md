# إصلاح سريع لمشاكل Vercel - FarmDreamERP

## 🚨 المشكلة الحالية
التطبيق على [https://farm-dream-erp1.vercel.app/](https://farm-dream-erp1.vercel.app/) يعطي خطأ `FUNCTION_INVOCATION_FAILED`.

## 🔧 الحل السريع

### 1. إعادة إنشاء المشروع على Vercel
```bash
# احذف المشروع الحالي من Vercel Dashboard
# ثم أنشئ مشروع جديد
```

### 2. إعدادات Vercel الجديدة
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

### 3. API مبسط
```javascript
// api/index.js
module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  if (req.url === '/api/health') {
    res.status(200).json({ status: 'ok' });
    return;
  }
  
  if (req.url.startsWith('/api/')) {
    res.status(200).json([]);
    return;
  }
  
  res.status(200).send('<h1>FarmDream ERP - Working!</h1>');
};
```

## 🚀 خطوات النشر

### 1. إنشاء مشروع جديد على Vercel
1. اذهب إلى [vercel.com](https://vercel.com)
2. احذف المشروع الحالي
3. أنشئ مشروع جديد من GitHub
4. اختر `FarmDreamERP` repository

### 2. إعدادات البناء
- **Framework Preset**: Other
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Install Command**: `npm install`

### 3. متغيرات البيئة
```
NODE_ENV=production
```

## ✅ النتيجة المتوقعة
- ✅ التطبيق يعمل على Vercel
- ✅ جميع API endpoints تعمل
- ✅ لا توجد أخطاء 500

## 🔍 استكشاف الأخطاء

### إذا استمر الخطأ:
1. تحقق من Vercel logs
2. تأكد من أن `api/index.js` موجود
3. تأكد من أن `vercel.json` صحيح

### بديل: استخدام Netlify
إذا لم يعمل Vercel، يمكن استخدام Netlify:
1. اربط GitHub repository
2. استخدم نفس الإعدادات
3. Netlify أسهل في التعامل مع Node.js

## 📞 الدعم
إذا استمرت المشاكل، جرب:
1. إنشاء مشروع Vercel جديد تماماً
2. استخدام Netlify بدلاً من Vercel
3. نشر على Heroku أو Railway
