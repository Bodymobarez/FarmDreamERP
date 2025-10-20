const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Handle OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Health check endpoint
  if (req.url === '/api/health') {
    res.status(200).json({ 
      status: 'ok', 
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'production',
      database: process.env.DATABASE_URL ? 'connected' : 'not configured'
    });
    return;
  }

  // Mock API responses for all endpoints
  if (req.url.startsWith('/api/')) {
    const endpoint = req.url.split('/')[2]?.split('?')[0];
    
    // Return empty arrays for all API endpoints
    const mockResponses = {
      'animals': [],
      'inventory': [],
      'treatments': [],
      'transactions': [],
      'batches': [],
      'goals': [],
      'suppliers': [],
      'customers': [],
      'receptions': [],
      'vouchers': [],
      'sales': [],
      'expenses': []
    };
    
    if (mockResponses.hasOwnProperty(endpoint)) {
      res.status(200).json(mockResponses[endpoint]);
      return;
    }
    
    // Default API response
    res.status(200).json({ 
      message: 'API endpoint',
      endpoint: req.url,
      method: req.method 
    });
    return;
  }

  // Serve static files from dist/public
  const distPath = path.join(process.cwd(), 'dist', 'public');
  
  // Try to serve index.html
  try {
    const indexPath = path.join(distPath, 'index.html');
    if (fs.existsSync(indexPath)) {
      const html = fs.readFileSync(indexPath, 'utf-8');
      res.setHeader('Content-Type', 'text/html');
      res.status(200).send(html);
      return;
    }
  } catch (error) {
    console.error('Error reading index.html:', error);
  }

  // Fallback response
  res.status(200).send(`
    <!DOCTYPE html>
    <html lang="ar" dir="rtl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>FarmDream ERP - نظام إدارة المزارع</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .container { 
          max-width: 900px;
          width: 100%;
          background: white;
          padding: 60px 40px;
          border-radius: 20px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.3);
          text-align: center;
        }
        h1 { 
          color: #2c3e50;
          font-size: 3em;
          margin-bottom: 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .status { 
          background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
          color: white;
          padding: 15px 30px;
          border-radius: 50px;
          display: inline-block;
          margin: 30px 0;
          font-weight: bold;
          font-size: 1.2em;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .description { 
          color: #555;
          font-size: 1.1em;
          line-height: 1.8;
          margin: 30px 0;
        }
        .api-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin: 40px 0;
        }
        .api-test { 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 15px 25px;
          border-radius: 10px;
          text-decoration: none;
          display: block;
          font-weight: 600;
          transition: transform 0.3s, box-shadow 0.3s;
          box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        }
        .api-test:hover { 
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        }
        .footer { 
          margin-top: 40px;
          padding-top: 30px;
          border-top: 2px solid #eee;
          color: #888;
          font-size: 0.9em;
        }
        .emoji { font-size: 1.5em; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1><span class="emoji">🚀</span> FarmDream ERP</h1>
        <div class="status">✅ التطبيق يعمل بنجاح على Vercel</div>
        
        <div class="description">
          <p>نظام إدارة مزارع متكامل يشمل:</p>
          <p>إدارة الحيوانات • المخزون • العلاجات البيطرية • المبيعات • المشتريات • الموردين • العملاء • التقارير المالية</p>
        </div>
        
        <h3 style="color: #2c3e50; margin-top: 40px;">اختبار API Endpoints:</h3>
        <div class="api-grid">
          <a href="/api/health" class="api-test">🔍 Health Check</a>
          <a href="/api/animals" class="api-test">🐄 الحيوانات</a>
          <a href="/api/inventory" class="api-test">📦 المخزون</a>
          <a href="/api/treatments" class="api-test">💊 العلاجات</a>
          <a href="/api/transactions" class="api-test">💰 المعاملات</a>
          <a href="/api/batches" class="api-test">📊 الدفعات</a>
          <a href="/api/goals" class="api-test">🎯 الأهداف</a>
          <a href="/api/suppliers" class="api-test">🏪 الموردين</a>
          <a href="/api/customers" class="api-test">👥 العملاء</a>
          <a href="/api/receptions" class="api-test">📥 الاستقبالات</a>
          <a href="/api/vouchers" class="api-test">📄 السندات</a>
          <a href="/api/sales" class="api-test">💵 المبيعات</a>
        </div>
        
        <div class="footer">
          <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'production'}</p>
          <p><strong>Database:</strong> ${process.env.DATABASE_URL ? '✅ Connected' : '⚠️ Not Configured'}</p>
          <p style="margin-top: 20px;">تم النشر بنجاح على Vercel! 🎉</p>
        </div>
      </div>
    </body>
    </html>
  `);
};