import React from 'react';

export default function App() {
  console.log('Simple App loaded');
  
  return (
    <div style={{ 
      padding: '50px', 
      fontSize: '24px', 
      backgroundColor: '#f0f0f0',
      minHeight: '100vh'
    }}>
      <h1 style={{ color: 'red', fontSize: '48px', marginBottom: '20px' }}>
        ✅ النظام يعمل!
      </h1>
      <p>إذا رأيت هذه الرسالة، فإن React يعمل بشكل صحيح</p>
      <div style={{ marginTop: '20px', padding: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
        <h2>اختبار المكونات:</h2>
        <ul>
          <li>✅ React يعمل</li>
          <li>✅ Vite يعمل</li>
          <li>✅ السيرفر يعمل</li>
        </ul>
      </div>
    </div>
  );
}
