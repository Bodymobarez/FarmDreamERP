-- Migration: Update animals table schema
-- Date: 2025-10-19
-- Description: إضافة الحقول المطلوبة لجدول الحيوانات وحذف الحقول القديمة

-- إضافة الحقول الجديدة إذا لم تكن موجودة
ALTER TABLE animals ADD COLUMN IF NOT EXISTS reception_id VARCHAR(255);
ALTER TABLE animals ADD COLUMN IF NOT EXISTS purchase_cost DECIMAL(10, 2);
ALTER TABLE animals ADD COLUMN IF NOT EXISTS accumulated_feed_cost DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS accumulated_treatment_cost DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS accumulated_other_cost DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS total_cost DECIMAL(10, 2) DEFAULT 0;
ALTER TABLE animals ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active';
ALTER TABLE animals ADD COLUMN IF NOT EXISTS sale_id VARCHAR(255);
ALTER TABLE animals ADD COLUMN IF NOT EXISTS notes TEXT;

-- حذف الأعمدة القديمة إذا كانت موجودة
ALTER TABLE animals DROP COLUMN IF EXISTS barn_id;
ALTER TABLE animals DROP COLUMN IF EXISTS barn_number;
ALTER TABLE animals DROP COLUMN IF EXISTS purchase_price;
ALTER TABLE animals DROP COLUMN IF EXISTS supplier_id;
ALTER TABLE animals DROP COLUMN IF EXISTS health_status;
ALTER TABLE animals DROP COLUMN IF EXISTS sale_date;
ALTER TABLE animals DROP COLUMN IF EXISTS sale_weight;
ALTER TABLE animals DROP COLUMN IF EXISTS sale_price;
ALTER TABLE animals DROP COLUMN IF EXISTS breed;
ALTER TABLE animals DROP COLUMN IF EXISTS birth_date;

-- إضافة تعليقات للحقول الجديدة
COMMENT ON COLUMN animals.reception_id IS 'معرف الاستقبال المرتبط بالحيوان';
COMMENT ON COLUMN animals.purchase_cost IS 'سعر شراء الحيوان';
COMMENT ON COLUMN animals.accumulated_feed_cost IS 'تكلفة الأعلاف المتراكمة';
COMMENT ON COLUMN animals.accumulated_treatment_cost IS 'تكلفة العلاج المتراكمة';
COMMENT ON COLUMN animals.accumulated_other_cost IS 'التكاليف الأخرى المتراكمة';
COMMENT ON COLUMN animals.total_cost IS 'إجمالي التكلفة';
COMMENT ON COLUMN animals.status IS 'حالة الحيوان (active, sold, deceased)';
COMMENT ON COLUMN animals.sale_id IS 'معرف عملية البيع';
COMMENT ON COLUMN animals.notes IS 'ملاحظات إضافية';

