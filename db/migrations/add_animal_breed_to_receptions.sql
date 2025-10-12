-- Migration: Add animal_breed column to receptions table
-- Date: 2025-10-11
-- Description: إضافة حقل السلالة/الفصيلة للحيوانات في جدول استقبال الدفعات

-- Add the animal_breed column
ALTER TABLE receptions 
ADD COLUMN IF NOT EXISTS animal_breed VARCHAR(100);

-- Add a comment to explain the column
COMMENT ON COLUMN receptions.animal_breed IS 'السلالة أو الفصيلة الفرعية للحيوان (مثل: فريزيان، برقي، إلخ)';

-- Optional: Update existing records to have a default breed value if needed
-- UPDATE receptions SET animal_breed = 'غير محدد' WHERE animal_breed IS NULL;
