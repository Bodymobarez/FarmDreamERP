// إضافة بيانات تجريبية شاملة للنظام
const fetch = require('node-fetch');

const API_BASE = 'http://localhost:5001/api';

async function addTestData() {
  console.log('🚀 بدء إضافة البيانات التجريبية...');

  try {
    // 1. إضافة عنابر
    console.log('📦 إضافة العنابر...');
    const barns = [
      {
        barnNumber: "B001",
        barnName: "عنبر التسمين الرئيسي",
        capacity: 100,
        barnType: "fattening",
        location: "المنطقة الشمالية",
        status: "active",
        notes: "عنبر مخصص لتسمين العجول"
      },
      {
        barnNumber: "B002", 
        barnName: "عنبر التربية",
        capacity: 50,
        barnType: "breeding",
        location: "المنطقة الجنوبية",
        status: "active",
        notes: "عنبر مخصص لتربية الأبقار"
      },
      {
        barnNumber: "B003",
        barnName: "عنبر العجول الصغيرة",
        capacity: 30,
        barnType: "young",
        location: "المنطقة الشرقية", 
        status: "active",
        notes: "عنبر مخصص للعجول الصغيرة"
      }
    ];

    for (const barn of barns) {
      try {
        const response = await fetch(`${API_BASE}/barns`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(barn)
        });
        if (response.ok) {
          console.log(`✅ تم إضافة العنبر: ${barn.barnName}`);
        } else {
          console.log(`❌ فشل إضافة العنبر: ${barn.barnName}`);
        }
      } catch (error) {
        console.log(`❌ خطأ في إضافة العنبر: ${barn.barnName}`, error.message);
      }
    }

    // 2. إضافة سجلات أوزان
    console.log('⚖️ إضافة سجلات الأوزان...');
    const weightRecords = [
      {
        animalId: "cebc56f3-cfb4-4302-8e13-2e57f47f8ee9",
        earTag: "NEW_MODULE_001",
        weight: "380.50",
        weightGain: "30.50",
        averageDailyGain: "1.2",
        notes: "زيادة وزن ممتازة"
      },
      {
        animalId: "648a6e5a-73e6-4ba8-8b30-a578d0d541b7",
        earTag: "DEBUG_TEST_001", 
        weight: "275.75",
        weightGain: "25.75",
        averageDailyGain: "1.1",
        notes: "زيادة وزن جيدة"
      },
      {
        animalId: "7024694a-4a82-4c2c-a1e7-fc2fe76f6150",
        earTag: "AFTER_FIX_002",
        weight: "425.25",
        weightGain: "25.25", 
        averageDailyGain: "1.0",
        notes: "زيادة وزن طبيعية"
      }
    ];

    for (const weight of weightRecords) {
      try {
        const response = await fetch(`${API_BASE}/weight-records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(weight)
        });
        if (response.ok) {
          console.log(`✅ تم إضافة سجل وزن: ${weight.earTag}`);
        } else {
          console.log(`❌ فشل إضافة سجل وزن: ${weight.earTag}`);
        }
      } catch (error) {
        console.log(`❌ خطأ في إضافة سجل وزن: ${weight.earTag}`, error.message);
      }
    }

    // 3. إضافة سجلات أعلاف
    console.log('🌾 إضافة سجلات الأعلاف...');
    const feedRecords = [
      {
        recordNumber: "FEED001",
        batchId: "96a64ea0-0545-483f-a297-11a8d711ccf5",
        batchNumber: "FR-2024-001",
        barnId: "B001",
        barnNumber: "B001",
        feedType: "علف مركز",
        feedName: "علف تسمين فريزيان",
        quantity: "500",
        unit: "kg",
        unitPrice: "8.50",
        totalCost: "4250.00",
        notes: "علف عالي الجودة للعجول"
      },
      {
        recordNumber: "FEED002",
        batchId: "96a64ea0-0545-483f-a297-11a8d711ccf5", 
        batchNumber: "FR-2024-001",
        barnId: "B001",
        barnNumber: "B001",
        feedType: "تبن",
        feedName: "تبن برسيم",
        quantity: "200",
        unit: "kg",
        unitPrice: "2.50",
        totalCost: "500.00",
        notes: "تبن برسيم طازج"
      },
      {
        recordNumber: "FEED003",
        batchId: "dcfc604a-5adc-4464-9e34-cfc8290d50d6",
        batchNumber: "TEST_REAL_BATCH_001",
        barnId: "B002", 
        barnNumber: "B002",
        feedType: "علف مركب",
        feedName: "علف مركب متوازن",
        quantity: "300",
        unit: "kg",
        unitPrice: "6.75",
        totalCost: "2025.00",
        notes: "علف مركب للتربية"
      }
    ];

    for (const feed of feedRecords) {
      try {
        const response = await fetch(`${API_BASE}/feed-records`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(feed)
        });
        if (response.ok) {
          console.log(`✅ تم إضافة سجل علف: ${feed.recordNumber}`);
        } else {
          console.log(`❌ فشل إضافة سجل علف: ${feed.recordNumber}`);
        }
      } catch (error) {
        console.log(`❌ خطأ في إضافة سجل علف: ${feed.recordNumber}`, error.message);
      }
    }

    // 4. إضافة معاملات مالية إضافية
    console.log('💰 إضافة معاملات مالية إضافية...');
    const transactions = [
      {
        transactionNumber: "TXN-006",
        transactionDate: new Date().toISOString(),
        transactionType: "income",
        relatedType: "customer",
        amount: "45000.00",
        description: "بيع 3 عجول فريزيان للعميل أحمد محمد",
        status: "completed"
      },
      {
        transactionNumber: "TXN-007", 
        transactionDate: new Date().toISOString(),
        transactionType: "expense",
        relatedType: "supplier",
        amount: "25000.00",
        description: "شراء أعلاف مركزة - شحنة أكتوبر",
        status: "completed"
      },
      {
        transactionNumber: "TXN-008",
        transactionDate: new Date().toISOString(), 
        transactionType: "expense",
        relatedType: "other",
        amount: "5000.00",
        description: "تكاليف صيانة المعدات",
        status: "completed"
      }
    ];

    for (const transaction of transactions) {
      try {
        const response = await fetch(`${API_BASE}/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(transaction)
        });
        if (response.ok) {
          console.log(`✅ تم إضافة معاملة: ${transaction.transactionNumber}`);
        } else {
          console.log(`❌ فشل إضافة معاملة: ${transaction.transactionNumber}`);
        }
      } catch (error) {
        console.log(`❌ خطأ في إضافة معاملة: ${transaction.transactionNumber}`, error.message);
      }
    }

    console.log('🎉 تم إضافة جميع البيانات التجريبية بنجاح!');
    console.log('📊 يمكنك الآن اختبار النظام بالكامل');

  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات:', error);
  }
}

// تشغيل الدالة
addTestData();
