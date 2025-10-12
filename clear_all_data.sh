#!/bin/bash

echo "=== بدء حذف جميع البيانات ==="

# حذف الحيوانات
echo "حذف الحيوانات..."
for i in {1..50}; do
  curl -s -X DELETE http://localhost:5001/api/animals/$i > /dev/null 2>&1
done

# حذف العملاء  
echo "حذف العملاء..."
for i in {1..50}; do
  curl -s -X DELETE http://localhost:5001/api/customers/$i > /dev/null 2>&1
done

# حذف الموردين
echo "حذف الموردين..."
for i in {1..50}; do
  curl -s -X DELETE http://localhost:5001/api/suppliers/$i > /dev/null 2>&1
done

# حذف المخزون
echo "حذف المخزون..."
for i in {1..50}; do
  curl -s -X DELETE http://localhost:5001/api/inventory/$i > /dev/null 2>&1
done

# حذف الدفعات
echo "حذف الدفعات..."
for i in {1..50}; do
  curl -s -X DELETE http://localhost:5001/api/batches/$i > /dev/null 2>&1
done

# حذف المعاملات
echo "حذف المعاملات..."
for i in {1..50}; do
  curl -s -X DELETE http://localhost:5001/api/transactions/$i > /dev/null 2>&1
done

# حذف السندات
echo "حذف السندات..."
for i in {1..50}; do
  curl -s -X DELETE http://localhost:5001/api/vouchers/$i > /dev/null 2>&1
done

# حذف الأوزان
echo "حذف الأوزان..."
for i in {1..50}; do
  curl -s -X DELETE http://localhost:5001/api/weights/$i > /dev/null 2>&1
done

# حذف العلاجات
echo "حذف العلاجات..."
for i in {1..50}; do
  curl -s -X DELETE http://localhost:5001/api/treatments/$i > /dev/null 2>&1
done

echo "=== تم الانتهاء من حذف جميع البيانات ==="

# التحقق من النتائج
echo ""
echo "=== فحص البيانات المتبقية ==="
echo "الحيوانات: $(curl -s http://localhost:5001/api/animals | grep -o '"id"' | wc -l | tr -d ' ')"
echo "العملاء: $(curl -s http://localhost:5001/api/customers | grep -o '"id"' | wc -l | tr -d ' ')"
echo "الموردين: $(curl -s http://localhost:5001/api/suppliers | grep -o '"id"' | wc -l | tr -d ' ')"
echo "المخزون: $(curl -s http://localhost:5001/api/inventory | grep -o '"id"' | wc -l | tr -d ' ')"
echo "الدفعات: $(curl -s http://localhost:5001/api/batches | grep -o '"id"' | wc -l | tr -d ' ')"
echo "المعاملات: $(curl -s http://localhost:5001/api/transactions | grep -o '"id"' | wc -l | tr -d ' ')"
