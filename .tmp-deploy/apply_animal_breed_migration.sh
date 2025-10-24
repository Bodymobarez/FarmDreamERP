#!/bin/bash

# Script to apply animal_breed migration
# نص لتطبيق تحديث السلالة على قاعدة البيانات

echo "🐄 تطبيق تحديث نظام تصنيف الحيوانات..."
echo ""

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo "❌ خطأ: DATABASE_URL غير معرف"
    echo "📝 يرجى تعريف DATABASE_URL أولاً:"
    echo "   export DATABASE_URL='postgresql://user:password@host:port/database'"
    echo ""
    exit 1
fi

# Apply migration
echo "📊 إضافة حقل animal_breed إلى جدول receptions..."
psql "$DATABASE_URL" -f "db/migrations/add_animal_breed_to_receptions.sql"

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ تم تطبيق التحديث بنجاح!"
    echo ""
    echo "📋 التفاصيل:"
    echo "   - تم إضافة حقل: animal_breed (VARCHAR 100)"
    echo "   - الحقل اختياري (يمكن أن يكون NULL)"
    echo "   - البيانات الموجودة لم تتأثر"
    echo ""
    echo "🎯 الخطوات التالية:"
    echo "   1. افتح صفحة /receptions في المتصفح"
    echo "   2. جرب إضافة دفعة استقبال جديدة"
    echo "   3. اختر نوع الحيوان ثم السلالة"
    echo ""
else
    echo ""
    echo "❌ فشل تطبيق التحديث"
    echo "📝 يرجى التحقق من:"
    echo "   - صحة DATABASE_URL"
    echo "   - أن قاعدة البيانات تعمل"
    echo "   - أن لديك صلاحيات كافية"
    echo ""
    exit 1
fi
