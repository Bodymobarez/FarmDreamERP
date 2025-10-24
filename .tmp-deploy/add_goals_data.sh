#!/bin/bash

PORT=5001
echo "🎯 إضافة بيانات تجريبية للأهداف على البورت $PORT..."

# Goal 1
echo "1️⃣ إضافة هدف: تحسين معدل النمو اليومي"
curl -s -X POST http://localhost:$PORT/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "تحسين معدل النمو اليومي للدفعة الحالية",
    "goalType": "adg",
    "targetValue": "1.3",
    "currentValue": "1.15",
    "unit": "كجم/يوم",
    "priority": "high",
    "status": "active",
    "description": "هدف تحسين معدل النمو اليومي من خلال تحسين جودة الأعلاف وتقليل التوتر على الحيوانات"
  }' > /dev/null && echo "  ✅ تم"

# Goal 2
echo "2️⃣ إضافة هدف: خفض معامل التحويل الغذائي"
curl -s -X POST http://localhost:$PORT/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "خفض معامل التحويل الغذائي",
    "goalType": "fcr",
    "targetValue": "2.5",
    "currentValue": "2.8",
    "unit": "",
    "priority": "critical",
    "status": "active",
    "description": "تحسين كفاءة استخدام الأعلاف لتقليل التكاليف وزيادة الربحية"
  }' > /dev/null && echo "  ✅ تم"

# Goal 3
echo "3️⃣ إضافة هدف: رفع معدل البقاء"
curl -s -X POST http://localhost:$PORT/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "رفع معدل البقاء إلى 98%",
    "goalType": "survival_rate",
    "targetValue": "98",
    "currentValue": "95.5",
    "unit": "%",
    "priority": "critical",
    "status": "active",
    "description": "تحسين الرعاية الصحية والوقاية من الأمراض لرفع معدل البقاء"
  }' > /dev/null && echo "  ✅ تم"

# Goal 4
echo "4️⃣ إضافة هدف: تقليل التكلفة لكل رأس"
curl -s -X POST http://localhost:$PORT/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "تقليل التكلفة لكل رأس",
    "goalType": "cost_per_head",
    "targetValue": "3500",
    "currentValue": "3850",
    "unit": "ج",
    "priority": "high",
    "status": "active",
    "description": "تحسين إدارة التكاليف وتقليل الهدر في الأعلاف والعلاجات"
  }' > /dev/null && echo "  ✅ تم"

# Goal 5
echo "5️⃣ إضافة هدف: زيادة الربح الشهري"
curl -s -X POST http://localhost:$PORT/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "زيادة الربح الشهري",
    "goalType": "profit",
    "targetValue": "50000",
    "currentValue": "42000",
    "unit": "ج",
    "priority": "high",
    "status": "active",
    "description": "زيادة الربحية من خلال تحسين الكفاءة وتقليل التكاليف"
  }' > /dev/null && echo "  ✅ تم"

# Goal 6 (Achieved)
echo "6️⃣ إضافة هدف: زيادة الوزن (محقق)"
curl -s -X POST http://localhost:$PORT/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "تحقيق زيادة وزن 150 كجم",
    "goalType": "weight_gain",
    "targetValue": "150",
    "currentValue": "168",
    "unit": "كجم",
    "achievedDate": "2025-10-05",
    "priority": "medium",
    "status": "achieved",
    "description": "تم تحقيق الهدف بنجاح! زيادة الوزن المستهدفة للدفعة"
  }' > /dev/null && echo "  ✅ تم"

# Goal 7
echo "7️⃣ إضافة هدف: تحسين كفاءة الأعلاف"
curl -s -X POST http://localhost:$PORT/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "تحسين كفاءة الأعلاف",
    "goalType": "feed_efficiency",
    "targetValue": "85",
    "currentValue": "78",
    "unit": "%",
    "priority": "medium",
    "status": "active",
    "description": "تحسين معدل استخدام الأعلاف وتقليل الهدر"
  }' > /dev/null && echo "  ✅ تم"

# Goal 8 (Achieved)
echo "8️⃣ إضافة هدف: معدل نمو 1.4 (محقق)"
curl -s -X POST http://localhost:$PORT/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "معدل نمو يومي 1.4 كجم",
    "goalType": "adg",
    "targetValue": "1.4",
    "currentValue": "1.45",
    "unit": "كجم/يوم",
    "achievedDate": "2025-09-28",
    "priority": "high",
    "status": "achieved",
    "description": "تم تجاوز الهدف بنجاح! معدل نمو ممتاز للدفعة الصيفية"
  }' > /dev/null && echo "  ✅ تم"

# Goal 9 (Failed)
echo "9️⃣ إضافة هدف: معدل بقاء 95% (فاشل)"
curl -s -X POST http://localhost:$PORT/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "معدل بقاء 95%",
    "goalType": "survival_rate",
    "targetValue": "95",
    "currentValue": "89",
    "unit": "%",
    "priority": "critical",
    "status": "failed",
    "description": "لم يتم تحقيق الهدف بسبب موجة حر شديدة في الصيف"
  }' > /dev/null && echo "  ✅ تم"

# Goal 10 (Achieved)
echo "🔟 إضافة هدف: خفض التكلفة (محقق)"
curl -s -X POST http://localhost:$PORT/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "خفض التكلفة إلى 3200 جنيه",
    "goalType": "cost_per_head",
    "targetValue": "3200",
    "currentValue": "2950",
    "unit": "ج",
    "achievedDate": "2025-08-15",
    "priority": "high",
    "status": "achieved",
    "description": "تم تحقيق الهدف بنجاح من خلال تحسين إدارة المخزون والشراء بالجملة"
  }' > /dev/null && echo "  ✅ تم"

echo ""
echo "✅ تم إضافة 10 أهداف بنجاح!"
echo "📊 التحقق من البيانات..."
curl -s http://localhost:$PORT/api/performance-goals | grep -o '"id":' | wc -l | xargs echo "   عدد الأهداف المضافة:"
