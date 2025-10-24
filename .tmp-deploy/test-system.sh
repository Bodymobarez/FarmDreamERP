#!/bin/bash

echo "🧪 اختبار شامل للنظام - حفظ واسترجاع البيانات"
echo "=================================================="

# Function to test API endpoint
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4
    
    echo "🔧 $description"
    if [ "$method" = "POST" ]; then
        response=$(curl -s -X POST "http://localhost:5001$endpoint" \
            -H "Content-Type: application/json" \
            -d "$data")
    else
        response=$(curl -s -X GET "http://localhost:5001$endpoint")
    fi
    
    if [[ $? -eq 0 && "$response" != *"error"* && "$response" != "" ]]; then
        echo "✅ نجح: $description"
        echo "📝 الرد: $response" | head -c 100
        echo -e "\n"
    else
        echo "❌ فشل: $description"
        echo "📝 الخطأ: $response"
    fi
    echo "---"
}

# Wait for server to be ready
echo "⏳ انتظار تشغيل السيرفر..."
sleep 5

# Test 1: Add a new batch (عنبر)
test_api "POST" "/api/batches" \
    '{"batchNumber": "BATCH001", "batchName": "عنبر تجريبي 1", "capacity": 50, "batchType": "مفتوح", "status": "active"}' \
    "إضافة عنبر جديد"

# Test 2: Get all batches
test_api "GET" "/api/batches" "" "استرجاع جميع العنابر"

# Test 3: Add a supplier
test_api "POST" "/api/suppliers" \
    '{"supplierNumber": "SUP001", "name": "مورد تجريبي", "phone": "01234567890", "address": "عنوان المورد"}' \
    "إضافة مورد جديد"

# Test 4: Get all suppliers
test_api "GET" "/api/suppliers" "" "استرجاع جميع الموردين"

# Test 5: Add a customer
test_api "POST" "/api/customers" \
    '{"customerNumber": "CUST001", "name": "عميل تجريبي", "phone": "01987654321", "address": "عنوان العميل"}' \
    "إضافة عميل جديد"

# Test 6: Get all customers
test_api "GET" "/api/customers" "" "استرجاع جميع العملاء"

# Test 7: Add an animal
test_api "POST" "/api/animals" \
    '{"earTag": "A001", "animalType": "عجل", "sex": "ذكر", "entryWeight": "250.5", "penNumber": "P001"}' \
    "إضافة حيوان جديد"

# Test 8: Get all animals
test_api "GET" "/api/animals" "" "استرجاع جميع الحيوانات"

# Test 9: Test accounting entries
test_api "POST" "/api/accounting-entries" \
    '{"entryNumber": "JE001", "accountCode": "1001", "accountName": "النقدية", "debitAmount": "1000", "creditAmount": "0", "description": "قيد تجريبي"}' \
    "إضافة قيد محاسبي"

# Test 10: Get accounting entries
test_api "GET" "/api/accounting-entries" "" "استرجاع القيود المحاسبية"

# Test 11: Test performance goals (KPI)
test_api "POST" "/api/performance-goals" \
    '{"goalName": "هدف النمو", "targetValue": "1000", "currentValue": "500", "unit": "كيلو", "category": "إنتاج", "description": "زيادة الوزن المستهدفة"}' \
    "إضافة مؤشر أداء"

# Test 12: Get performance goals
test_api "GET" "/api/performance-goals" "" "استرجاع مؤشرات الأداء"

echo "🎯 انتهاء الاختبارات"
echo "======================"