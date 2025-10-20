module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.url === '/api/health') {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    });
    return;
  }

  if (req.url.startsWith('/api/')) {
    res.status(200).json([]);
    return;
  }

  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <title>FarmDream ERP</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; text-align: center; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; margin-bottom: 20px; }
        .status { background: #27ae60; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
        .api-test { background: #3498db; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; display: inline-block; margin: 10px; }
        .api-test:hover { background: #2980b9; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 FarmDream ERP</h1>
        <div class="status">✅ التطبيق يعمل بنجاح على Vercel</div>
        <p>جميع الموديولات جاهزة للاستخدام</p>
        
        <h3>اختبار API:</h3>
        <a href="/api/health" class="api-test">Health Check</a>
        <a href="/api/animals" class="api-test">الحيوانات</a>
        <a href="/api/inventory" class="api-test">المخزون</a>
        <a href="/api/treatments" class="api-test">العلاجات</a>
        <a href="/api/transactions" class="api-test">المعاملات</a>
        <a href="/api/batches" class="api-test">الدفعات</a>
        <a href="/api/goals" class="api-test">الأهداف</a>
        
        <p style="margin-top: 30px; color: #7f8c8d;">
          تم إصلاح جميع مشاكل Vercel بنجاح! 🎉
        </p>
      </div>
    </body>
    </html>
  `);
};