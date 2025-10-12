# دليل نشر FarmDreamERP
## Deployment Guide

## المشكلة الحالية / Current Issue

التطبيق يتكون من جزئين:
The application consists of two parts:

1. **Frontend (React SPA)** - منشور على Vercel
   - Deployed on Vercel at: https://farm.adsolutions-eg.com
   - يعمل بشكل صحيح / Works correctly
   
2. **Backend (Express API)** - يعمل محلياً فقط
   - Currently runs ONLY locally on port 5001
   - ❌ NOT deployed to production

**النتيجة:** الموقع المنشور لا يمكنه الوصول للـ API لأنه غير منشور!
**Result:** The deployed website cannot access the API because it's not deployed!

---

## الحل / Solution

يجب نشر الـ API Server على منصة سحابية منفصلة.
You need to deploy the API Server to a separate cloud platform.

### خيارات النشر / Deployment Options:

#### 1. **Railway.app** (موصى به / Recommended) ⭐
- ✅ مجاني للبداية / Free tier available
- ✅ سهل جداً / Very easy to use
- ✅ يدعم PostgreSQL / Supports PostgreSQL
- 🔗 https://railway.app

**خطوات النشر:**
1. سجل حساب على Railway
2. اضغط "New Project" → "Deploy from GitHub"
3. اختر الـ Repository: `FarmDreamERP`
4. Railway سيكتشف تلقائياً أنه Express app
5. أضف Environment Variables:
   ```
   DATABASE_URL=<Neon database URL>
   DATABASE_URL_UNPOOLED=<Neon unpooled URL>
   PORT=5001
   NODE_ENV=production
   ```
6. انتظر حتى ينتهي النشر
7. انسخ الـ URL المنشور (مثال: `https://farmdreamerp-production.up.railway.app`)

#### 2. **Render.com**
- ✅ مجاني للبداية / Free tier
- ✅ موثوق / Reliable
- 🔗 https://render.com

**خطوات النشر:**
1. سجل حساب على Render
2. اضغط "New +" → "Web Service"
3. اربط GitHub repository
4. املأ البيانات:
   - **Name:** farmdream-api
   - **Runtime:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. أضف Environment Variables (نفس Railway)
6. اضغط "Create Web Service"

#### 3. **Vercel (Backend + Frontend معاً)**
يمكن نشر API على Vercel أيضاً لكن يحتاج تعديلات كبيرة.
Possible but requires significant restructuring.

---

## بعد نشر الـ API / After Deploying the API

### 1. احصل على URL الـ API
مثال: `https://farmdreamerp-production.up.railway.app`

### 2. أضف Environment Variable في Vercel

اذهب إلى:
**Vercel Dashboard** → **Your Project** → **Settings** → **Environment Variables**

أضف:
```
Name: VITE_API_URL
Value: https://farmdreamerp-production.up.railway.app
```

### 3. أعد نشر الـ Frontend

في Vercel:
- اذهب إلى **Deployments**
- اضغط على أحدث Deployment
- اضغط "Redeploy"

---

## للتطوير المحلي / For Local Development

لا حاجة لتغيير شيء! الـ API والـ Frontend يعملان معاً على نفس الـ server.
No changes needed! API and Frontend run together on the same server.

```bash
npm run dev
# افتح المتصفح على http://localhost:5001
# Open browser at http://localhost:5001
```

---

## التحقق من النشر / Verify Deployment

بعد نشر الـ API، تحقق من عمله:

```bash
# استبدل URL_HERE بالـ URL الخاص بك
curl https://YOUR-API-URL.com/api/animals
```

يجب أن يعود بـ JSON response (حتى لو كان `[]` فارغ).

---

## الخلاصة / Summary

| البيئة / Environment | Frontend | Backend API |
|---------------------|----------|-------------|
| **Production** | ✅ Vercel | ❌ **يحتاج نشر!** |
| **Local Dev** | ✅ localhost:5001 | ✅ localhost:5001 |

**الخطوة التالية:** انشر الـ API على Railway أو Render!
**Next Step:** Deploy API to Railway or Render!

---

## ملاحظات مهمة / Important Notes

1. **الأمان:** لا تنشر الـ database credentials في الكود!
   - استخدم Environment Variables دائماً
   - Never commit `.env` files

2. **CORS:** تأكد من السماح للـ Frontend بالوصول للـ API
   - أضف في `server/index.ts`:
   ```typescript
   app.use(cors({
     origin: ['https://farm.adsolutions-eg.com', 'http://localhost:5001'],
     credentials: true
   }));
   ```

3. **التكلفة:** كل الخيارات المقترحة مجانية للبداية
   - Railway: 500 ساعة تشغيل مجانية/شهر
   - Render: Free tier متاح

---

**صاحب المشروع:** إذا كنت تريد نشر الـ API، أخبرني بالمنصة المفضلة وسأساعدك خطوة بخطوة!
**Project Owner:** If you want to deploy the API, let me know your preferred platform and I'll help you step by step!
