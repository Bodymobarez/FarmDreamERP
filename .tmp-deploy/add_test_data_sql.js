// إضافة بيانات تجريبية باستخدام SQL مباشرة
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL);

async function addTestData() {
  console.log('🚀 بدء إضافة البيانات التجريبية...');
  
  try {
    // 1. إضافة عنابر
    console.log('📦 إضافة العنابر...');
    
    await sql`
      INSERT INTO barns (barn_number, barn_name, capacity, barn_type, location, status, notes)
      VALUES 
        ('B001', 'عنبر التسمين الرئيسي', 100, 'fattening', 'المنطقة الشمالية', 'active', 'عنبر مخصص لتسمين العجول'),
        ('B002', 'عنبر التربية', 50, 'breeding', 'المنطقة الجنوبية', 'active', 'عنبر مخصص لتربية الأبقار'),
        ('B003', 'عنبر العجول الصغيرة', 30, 'young', 'المنطقة الشرقية', 'active', 'عنبر مخصص للعجول الصغيرة')
      ON CONFLICT (barn_number) DO NOTHING
    `;
    console.log('✅ تم إضافة العنابر');

    // 2. إضافة سجلات أوزان
    console.log('⚖️ إضافة سجلات الأوزان...');
    
    await sql`
      INSERT INTO weight_records (animal_id, ear_tag, weight, weight_gain, average_daily_gain, notes)
      VALUES 
        ('cebc56f3-cfb4-4302-8e13-2e57f47f8ee9', 'NEW_MODULE_001', 380.50, 30.50, 1.2, 'زيادة وزن ممتازة'),
        ('648a6e5a-73e6-4ba8-8b30-a578d0d541b7', 'DEBUG_TEST_001', 275.75, 25.75, 1.1, 'زيادة وزن جيدة'),
        ('7024694a-4a82-4c2c-a1e7-fc2fe76f6150', 'AFTER_FIX_002', 425.25, 25.25, 1.0, 'زيادة وزن طبيعية')
    `;
    console.log('✅ تم إضافة سجلات الأوزان');

    // 3. إضافة سجلات أعلاف
    console.log('🌾 إضافة سجلات الأعلاف...');
    
    await sql`
      INSERT INTO feed_records (record_number, batch_id, batch_number, barn_id, barn_number, feed_type, feed_name, quantity, unit, unit_price, total_cost, notes)
      VALUES 
        ('FEED001', '96a64ea0-0545-483f-a297-11a8d711ccf5', 'FR-2024-001', 'B001', 'B001', 'علف مركز', 'علف تسمين فريزيان', 500, 'kg', 8.50, 4250.00, 'علف عالي الجودة للعجول'),
        ('FEED002', '96a64ea0-0545-483f-a297-11a8d711ccf5', 'FR-2024-001', 'B001', 'B001', 'تبن', 'تبن برسيم', 200, 'kg', 2.50, 500.00, 'تبن برسيم طازج'),
        ('FEED003', 'dcfc604a-5adc-4464-9e34-cfc8290d50d6', 'TEST_REAL_BATCH_001', 'B002', 'B002', 'علف مركب', 'علف مركب متوازن', 300, 'kg', 6.75, 2025.00, 'علف مركب للتربية')
    `;
    console.log('✅ تم إضافة سجلات الأعلاف');

    // 4. إضافة معاملات مالية إضافية
    console.log('💰 إضافة معاملات مالية إضافية...');
    
    await sql`
      INSERT INTO transactions (transaction_number, transaction_date, transaction_type, related_type, amount, description, status)
      VALUES 
        ('TXN-006', NOW(), 'income', 'customer', 45000.00, 'بيع 3 عجول فريزيان للعميل أحمد محمد', 'completed'),
        ('TXN-007', NOW(), 'expense', 'supplier', 25000.00, 'شراء أعلاف مركزة - شحنة أكتوبر', 'completed'),
        ('TXN-008', NOW(), 'expense', 'other', 5000.00, 'تكاليف صيانة المعدات', 'completed')
    `;
    console.log('✅ تم إضافة المعاملات المالية');

    console.log('🎉 تم إضافة جميع البيانات التجريبية بنجاح!');
    console.log('📊 يمكنك الآن اختبار النظام بالكامل');
    
  } catch (error) {
    console.error('❌ خطأ في إضافة البيانات:', error);
  }
}

// تشغيل الدالة
addTestData();
