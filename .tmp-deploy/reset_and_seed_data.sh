#!/bin/bash

echo "🔄 بدء عملية مسح البيانات القديمة وإنشاء بيانات جديدة..."

# الانتقال لمجلد المشروع
cd "/Volumes/My Drive/Dev/dream farm/FarmDreamERP"

# مسح البيانات القديمة
echo "🗑️  مسح البيانات القديمة..."

# إيقاف السيرفر إذا كان يعمل
pkill -f "tsx server/index.ts" 2>/dev/null || true
sleep 2

# حذف قاعدة البيانات القديمة
rm -f farm.db 2>/dev/null || true

echo "✅ تم مسح البيانات القديمة بنجاح"

# إنشاء البيانات الجديدة
echo "📦 إنشاء بيانات جديدة شاملة..."

# تشغيل السيرفر في الخلفية
npm run dev &
SERVER_PID=$!

# انتظار تشغيل السيرفر
echo "⏳ انتظار تشغيل السيرفر..."
sleep 8

# إضافة الموردين
echo "➕ إضافة الموردين..."
curl -s -X POST http://localhost:5001/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "مورد الأعلاف المركزة",
    "type": "feed",
    "contactPerson": "أحمد محمود",
    "phone": "01012345678",
    "email": "feed@supplier.com",
    "address": "القاهرة، مصر",
    "balance": 45000,
    "notes": "مورد رئيسي للأعلاف المركزة عالية الجودة"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "مورد الأدوية البيطرية",
    "type": "veterinary",
    "contactPerson": "د. خالد السيد",
    "phone": "01098765432",
    "email": "vet@supplier.com",
    "address": "الإسكندرية، مصر",
    "balance": 28500,
    "notes": "متخصص في الأدوية واللقاحات البيطرية"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/suppliers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "مورد العجول المستوردة",
    "type": "animals",
    "contactPerson": "محمد فتحي",
    "phone": "01123456789",
    "email": "cattle@import.com",
    "address": "الجيزة، مصر",
    "balance": 125000,
    "notes": "استيراد عجول عالية الجودة من أوروبا"
  }' > /dev/null

# إضافة العملاء
echo "➕ إضافة العملاء..."
curl -s -X POST http://localhost:5001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "محمد أحمد التاجر",
    "type": "wholesale",
    "contactPerson": "محمد أحمد",
    "phone": "01234567890",
    "email": "mohamed@trader.com",
    "address": "القاهرة، مصر",
    "balance": 75000,
    "notes": "عميل رئيسي - تجارة الجملة"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "شركة اللحوم المتحدة",
    "type": "corporate",
    "contactPerson": "علي حسن",
    "phone": "01098765432",
    "email": "info@meatco.com",
    "address": "الإسكندرية، مصر",
    "balance": 150000,
    "notes": "شركة كبرى متخصصة في تجارة اللحوم"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/customers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "سوبر ماركت النخبة",
    "type": "retail",
    "contactPerson": "أحمد سعيد",
    "phone": "01156789012",
    "email": "elite@supermarket.com",
    "address": "الجيزة، مصر",
    "balance": 45000,
    "notes": "سلسلة محلات تجزئة"
  }' > /dev/null

# إضافة المخزون
echo "➕ إضافة أصناف المخزون..."
curl -s -X POST http://localhost:5001/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "itemCode": "FEED-001",
    "itemName": "علف مركز - بروتين 18%",
    "category": "feed",
    "unit": "كجم",
    "quantity": 5000,
    "minQuantity": 1000,
    "unitPrice": 8.5,
    "totalValue": 42500,
    "location": "مخزن A",
    "notes": "علف عالي البروتين للتسمين"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "itemCode": "MED-001",
    "itemName": "لقاح الحمى القلاعية",
    "category": "veterinary",
    "unit": "جرعة",
    "quantity": 500,
    "minQuantity": 100,
    "unitPrice": 15,
    "totalValue": 7500,
    "location": "ثلاجة الأدوية",
    "notes": "يحفظ في الثلاجة 2-8 درجة"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/inventory \
  -H "Content-Type: application/json" \
  -d '{
    "itemCode": "SUPP-001",
    "itemName": "مكمل فيتامينات ومعادن",
    "category": "supplements",
    "unit": "كجم",
    "quantity": 300,
    "minQuantity": 50,
    "unitPrice": 45,
    "totalValue": 13500,
    "location": "مخزن B",
    "notes": "يضاف للعلف يومياً"
  }' > /dev/null

# إضافة الدفعات
echo "➕ إضافة دفعات التربية..."
curl -s -X POST http://localhost:5001/api/batches \
  -H "Content-Type: application/json" \
  -d '{
    "batchName": "دفعة يناير 2024 - فريزيان",
    "batchCode": "B-2024-01",
    "startDate": "2024-01-15",
    "animalType": "cattle",
    "breed": "friesian",
    "initialCount": 50,
    "currentCount": 48,
    "status": "active",
    "targetWeight": 500,
    "averageWeight": 380,
    "feedType": "علف مركز 18%",
    "notes": "دفعة متميزة من العجول الفريزيان"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/batches \
  -H "Content-Type: application/json" \
  -d '{
    "batchName": "دفعة مارس 2024 - بلدي",
    "batchCode": "B-2024-03",
    "startDate": "2024-03-10",
    "animalType": "cattle",
    "breed": "baladi",
    "initialCount": 30,
    "currentCount": 30,
    "status": "active",
    "targetWeight": 450,
    "averageWeight": 320,
    "feedType": "علف مركز 16%",
    "notes": "عجول بلدية للتسمين السريع"
  }' > /dev/null

# إضافة الحيوانات
echo "➕ إضافة الحيوانات..."
for i in {1..15}; do
  curl -s -X POST http://localhost:5001/api/animals \
    -H "Content-Type: application/json" \
    -d "{
      \"earTag\": \"FR-$(printf '%03d' $i)\",
      \"animalType\": \"cattle\",
      \"breed\": \"friesian\",
      \"birthDate\": \"2023-10-$((i % 28 + 1))\",
      \"gender\": \"$([[ $((i % 2)) -eq 0 ]] && echo 'male' || echo 'female')\",
      \"weight\": $((350 + RANDOM % 100)),
      \"healthStatus\": \"healthy\",
      \"batchId\": \"1\",
      \"status\": \"active\",
      \"acquisitionDate\": \"2024-01-15\",
      \"acquisitionPrice\": $((15000 + RANDOM % 5000)),
      \"notes\": \"عجل فريزيان عالي الجودة\"
    }" > /dev/null
  echo -n "."
done

for i in {1..10}; do
  curl -s -X POST http://localhost:5001/api/animals \
    -H "Content-Type: application/json" \
    -d "{
      \"earTag\": \"BL-$(printf '%03d' $i)\",
      \"animalType\": \"cattle\",
      \"breed\": \"baladi\",
      \"birthDate\": \"2023-12-$((i % 28 + 1))\",
      \"gender\": \"$([[ $((i % 2)) -eq 0 ]] && echo 'male' || echo 'female')\",
      \"weight\": $((280 + RANDOM % 80)),
      \"healthStatus\": \"healthy\",
      \"batchId\": \"2\",
      \"status\": \"active\",
      \"acquisitionDate\": \"2024-03-10\",
      \"acquisitionPrice\": $((12000 + RANDOM % 3000)),
      \"notes\": \"عجل بلدي للتسمين\"
    }" > /dev/null
  echo -n "."
done
echo ""

# إضافة الأهداف
echo "➕ إضافة أهداف الأداء..."
curl -s -X POST http://localhost:5001/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "معدل النمو اليومي - دفعة يناير",
    "goalType": "adg",
    "targetValue": "1.4",
    "currentValue": "1.25",
    "unit": "كجم/يوم",
    "batchId": "1",
    "startDate": "2024-01-15",
    "endDate": "2024-07-15",
    "priority": "high",
    "status": "active",
    "description": "تحقيق معدل نمو يومي 1.4 كجم",
    "notes": "متابعة دقيقة للوزن أسبوعياً"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "معامل التحويل الغذائي - FCR",
    "goalType": "fcr",
    "targetValue": "6.5",
    "currentValue": "7.2",
    "unit": "",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "priority": "critical",
    "status": "active",
    "description": "تحسين كفاءة استخدام الأعلاف",
    "notes": "الهدف الأساسي لزيادة الربحية"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "معدل البقاء على قيد الحياة",
    "goalType": "survival_rate",
    "targetValue": "98",
    "currentValue": "96",
    "unit": "%",
    "startDate": "2024-01-01",
    "endDate": "2024-12-31",
    "priority": "high",
    "status": "active",
    "description": "تحقيق معدل بقاء 98%",
    "notes": "تحسين الرعاية البيطرية"
  }' > /dev/null

# إضافة العلاجات البيطرية
echo "➕ إضافة السجلات البيطرية..."
curl -s -X POST http://localhost:5001/api/treatments \
  -H "Content-Type: application/json" \
  -d '{
    "animalId": "1",
    "treatmentDate": "2024-10-01",
    "treatmentType": "vaccination",
    "diagnosis": "برنامج التحصين الروتيني",
    "medication": "لقاح الحمى القلاعية",
    "dosage": "5 مل",
    "administeredBy": "د. محمد أحمد",
    "cost": 45,
    "nextVisitDate": "2024-11-01",
    "notes": "تم التطعيم بنجاح - لا توجد آثار جانبية"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/treatments \
  -H "Content-Type: application/json" \
  -d '{
    "animalId": "2",
    "treatmentDate": "2024-10-05",
    "treatmentType": "preventive",
    "diagnosis": "مكافحة الطفيليات الداخلية",
    "medication": "إيفرمكتين",
    "dosage": "10 مل",
    "administeredBy": "د. خالد حسن",
    "cost": 35,
    "notes": "جرعة وقائية ضد الطفيليات"
  }' > /dev/null

# إضافة المعاملات المالية
echo "➕ إضافة المعاملات المالية..."
curl -s -X POST http://localhost:5001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionNumber": "TRX-2024-001",
    "transactionDate": "2024-01-15",
    "transactionType": "purchase",
    "description": "شراء دفعة عجول فريزيان",
    "amount": 750000,
    "paymentMethod": "bank_transfer",
    "relatedEntity": "supplier",
    "relatedEntityId": "3",
    "status": "completed",
    "notes": "دفعة يناير 2024 - 50 رأس"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionNumber": "TRX-2024-002",
    "transactionDate": "2024-02-01",
    "transactionType": "purchase",
    "description": "شراء علف مركز - 5 طن",
    "amount": 42500,
    "paymentMethod": "cash",
    "relatedEntity": "supplier",
    "relatedEntityId": "1",
    "status": "completed",
    "notes": "علف بروتين 18%"
  }' > /dev/null

curl -s -X POST http://localhost:5001/api/transactions \
  -H "Content-Type: application/json" \
  -d '{
    "transactionNumber": "TRX-2024-003",
    "transactionDate": "2024-09-15",
    "transactionType": "sale",
    "description": "بيع 10 رؤوس عجول مسمنة",
    "amount": 285000,
    "paymentMethod": "bank_transfer",
    "relatedEntity": "customer",
    "relatedEntityId": "1",
    "status": "completed",
    "notes": "عجول وزن متوسط 500 كجم"
  }' > /dev/null

echo ""
echo "✅ تم إنشاء البيانات الجديدة بنجاح!"
echo ""
echo "📊 ملخص البيانات المضافة:"
echo "  • 3 موردين"
echo "  • 3 عملاء"
echo "  • 3 أصناف مخزون"
echo "  • 2 دفعات تربية"
echo "  • 25 حيوان"
echo "  • 3 أهداف أداء"
echo "  • 2 سجل بيطري"
echo "  • 3 معاملات مالية"
echo ""
echo "🌐 السيرفر يعمل على: http://localhost:5001"
echo "📱 يمكنك الآن فتح المتصفح والتحقق من البيانات"
echo ""
echo "⚠️  ملاحظة: السيرفر لا يزال يعمل في الخلفية (PID: $SERVER_PID)"
echo "   لإيقافه استخدم: kill $SERVER_PID"
echo ""
