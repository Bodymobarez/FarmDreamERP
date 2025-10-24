-- Migration: Create goals table
-- Date: 2025-10-19
-- Description: إنشاء جدول الأهداف

CREATE TABLE IF NOT EXISTS goals (
  id VARCHAR(255) PRIMARY KEY DEFAULT gen_random_uuid()::text,
  goal_name VARCHAR(255) NOT NULL,
  goal_type VARCHAR(50) NOT NULL,
  target_value DECIMAL(10, 2) NOT NULL,
  current_value DECIMAL(10, 2) DEFAULT 0,
  unit VARCHAR(50),
  batch_id VARCHAR(255),
  start_date TIMESTAMP,
  end_date TIMESTAMP,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add comments
COMMENT ON TABLE goals IS 'جدول الأهداف';
COMMENT ON COLUMN goals.goal_name IS 'اسم الهدف';
COMMENT ON COLUMN goals.goal_type IS 'نوع الهدف (adg, fcr, survival_rate, ...)';
COMMENT ON COLUMN goals.target_value IS 'القيمة المستهدفة';
COMMENT ON COLUMN goals.current_value IS 'القيمة الحالية';
COMMENT ON COLUMN goals.unit IS 'الوحدة';
COMMENT ON COLUMN goals.batch_id IS 'معرف الدفعة (اختياري)';
COMMENT ON COLUMN goals.start_date IS 'تاريخ البداية';
COMMENT ON COLUMN goals.end_date IS 'تاريخ النهاية';
COMMENT ON COLUMN goals.status IS 'الحالة (active, achieved, cancelled)';
COMMENT ON COLUMN goals.notes IS 'ملاحظات';

