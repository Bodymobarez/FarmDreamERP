// Seed minimal, compatible tables using raw SQL (Neon)
import { neon } from '@neondatabase/serverless';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL);

async function seed() {
  console.log('🚀 Seeding minimal data into new DB...');
  try {
    // Barns
    console.log('📦 Inserting barns...');
    await sql`
      INSERT INTO barns (barn_number, barn_name, capacity, barn_type, location, status, notes)
      VALUES 
        ('B001', 'عنبر التسمين الرئيسي', 100, 'fattening', 'المنطقة الشمالية', 'active', 'عنبر مخصص لتسمين العجول'),
        ('B002', 'عنبر التربية', 50, 'breeding', 'المنطقة الجنوبية', 'active', 'عنبر مخصص لتربية الأبقار'),
        ('B003', 'عنبر العجول الصغيرة', 30, 'young', 'المنطقة الشرقية', 'active', 'عنبر مخصص للعجول الصغيرة')
      ON CONFLICT (barn_number) DO NOTHING
    `;

    // Transactions
    console.log('💰 Inserting transactions...');
    await sql`
      INSERT INTO transactions (transaction_number, transaction_date, transaction_type, related_type, amount, description, status)
      VALUES 
        ('TXN-006', NOW(), 'income', 'customer', 45000.00, 'بيع 3 عجول فريزيان للعميل أحمد محمد', 'completed'),
        ('TXN-007', NOW(), 'expense', 'supplier', 25000.00, 'شراء أعلاف مركزة - شحنة أكتوبر', 'completed'),
        ('TXN-008', NOW(), 'expense', 'other', 5000.00, 'تكاليف صيانة المعدات', 'completed')
      ON CONFLICT (transaction_number) DO NOTHING
    `;

    // Performance goals (optional quick data)
    console.log('🎯 Inserting performance goals...');
    await sql`
      INSERT INTO performance_goals (goal_name, target_value, current_value, unit, category, target_date, status, description)
      VALUES
        ('معدل زيادة الوزن اليومي', 1.20, 0, 'kg/day', 'growth', NOW() + interval '30 days', 'active', 'رفع ADG إلى 1.2 كجم/يوم'),
        ('تقليل نفوق القطيع', 1.00, 0.0, '%', 'health', NOW() + interval '60 days', 'active', 'خفض معدل النفوق إلى أقل من 1%')
    `;

    // Inventory items (optional minimal)
    console.log('📦 Inserting inventory items...');
    await sql`
      INSERT INTO inventory_items (item_code, item_name, category, unit, current_stock, minimum_stock, unit_cost, total_value, status, notes)
      VALUES
        ('FEED-001', 'علف تسمين مركّز', 'feed', 'kg', 1000, 200, 8.50, 8500.00, 'active', 'علف مركّز للجمال والأبقار'),
        ('MED-001', 'فيتامينات متعددة', 'medicine', 'box', 50, 10, 120.00, 6000.00, 'active', 'مكمّلات غذائية')
      ON CONFLICT (item_code) DO NOTHING
    `;

    console.log('🎉 Seeding complete.');
  } catch (err) {
    console.error('❌ Seeding error:', err);
    process.exitCode = 1;
  }
}

await seed();
