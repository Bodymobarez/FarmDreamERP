#!/bin/bash

# Script to add sample performance goals

echo "🎯 Adding sample performance goals..."

# Goal 1: ADG Improvement
curl -X POST http://localhost:5000/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "تحسين معدل النمو اليومي للدفعة الحالية",
    "goalType": "adg",
    "targetValue": "1.3",
    "currentValue": "1.15",
    "unit": "كجم/يوم",
    "startDate": "2025-09-01",
    "endDate": "2025-12-31",
    "priority": "high",
    "status": "active",
    "description": "هدف تحسين معدل النمو اليومي من خلال تحسين جودة الأعلاف وتقليل التوتر على الحيوانات"
  }'

echo ""

# Goal 2: FCR Reduction
curl -X POST http://localhost:5000/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "خفض معامل التحويل الغذائي",
    "goalType": "fcr",
    "targetValue": "2.5",
    "currentValue": "2.8",
    "unit": "",
    "startDate": "2025-09-15",
    "endDate": "2025-12-31",
    "priority": "critical",
    "status": "active",
    "description": "تحسين كفاءة استخدام الأعلاف لتقليل التكاليف وزيادة الربحية"
  }'

echo ""

# Goal 3: Survival Rate
curl -X POST http://localhost:5000/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "رفع معدل البقاء إلى 98%",
    "goalType": "survival_rate",
    "targetValue": "98",
    "currentValue": "95.5",
    "unit": "%",
    "startDate": "2025-10-01",
    "endDate": "2026-03-31",
    "priority": "critical",
    "status": "active",
    "description": "تحسين الرعاية الصحية والوقاية من الأمراض لرفع معدل البقاء"
  }'

echo ""

# Goal 4: Cost Per Head
curl -X POST http://localhost:5000/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "تقليل التكلفة لكل رأس",
    "goalType": "cost_per_head",
    "targetValue": "3500",
    "currentValue": "3850",
    "unit": "ج",
    "startDate": "2025-09-01",
    "endDate": "2025-12-31",
    "priority": "high",
    "status": "active",
    "description": "تحسين إدارة التكاليف وتقليل الهدر في الأعلاف والعلاجات"
  }'

echo ""

# Goal 5: Profit Increase
curl -X POST http://localhost:5000/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "زيادة الربح الشهري",
    "goalType": "profit",
    "targetValue": "50000",
    "currentValue": "42000",
    "unit": "ج",
    "startDate": "2025-10-01",
    "endDate": "2025-12-31",
    "priority": "high",
    "status": "active",
    "description": "زيادة الربحية من خلال تحسين الكفاءة وتقليل التكاليف"
  }'

echo ""

# Goal 6: Weight Gain (Achieved)
curl -X POST http://localhost:5000/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "تحقيق زيادة وزن 150 كجم",
    "goalType": "weight_gain",
    "targetValue": "150",
    "currentValue": "168",
    "unit": "كجم",
    "startDate": "2025-08-01",
    "endDate": "2025-11-30",
    "achievedDate": "2025-10-05",
    "priority": "medium",
    "status": "achieved",
    "description": "تم تحقيق الهدف بنجاح! زيادة الوزن المستهدفة للدفعة"
  }'

echo ""

# Goal 7: Feed Efficiency
curl -X POST http://localhost:5000/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "تحسين كفاءة الأعلاف",
    "goalType": "feed_efficiency",
    "targetValue": "85",
    "currentValue": "78",
    "unit": "%",
    "startDate": "2025-09-01",
    "endDate": "2025-12-31",
    "priority": "medium",
    "status": "active",
    "description": "تحسين معدل استخدام الأعلاف وتقليل الهدر"
  }'

echo ""

# Goal 8: ADG High (Achieved)
curl -X POST http://localhost:5000/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "معدل نمو يومي 1.4 كجم",
    "goalType": "adg",
    "targetValue": "1.4",
    "currentValue": "1.45",
    "unit": "كجم/يوم",
    "startDate": "2025-07-01",
    "endDate": "2025-09-30",
    "achievedDate": "2025-09-28",
    "priority": "high",
    "status": "achieved",
    "description": "تم تجاوز الهدف بنجاح! معدل نمو ممتاز للدفعة الصيفية"
  }'

echo ""

# Goal 9: Survival Rate (Failed)
curl -X POST http://localhost:5000/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "معدل بقاء 95%",
    "goalType": "survival_rate",
    "targetValue": "95",
    "currentValue": "89",
    "unit": "%",
    "startDate": "2025-06-01",
    "endDate": "2025-08-31",
    "priority": "critical",
    "status": "failed",
    "description": "لم يتم تحقيق الهدف بسبب موجة حر شديدة في الصيف"
  }'

echo ""

# Goal 10: Cost Reduction (Achieved)
curl -X POST http://localhost:5000/api/performance-goals \
  -H "Content-Type: application/json" \
  -d '{
    "goalName": "خفض التكلفة إلى 3200 جنيه",
    "goalType": "cost_per_head",
    "targetValue": "3200",
    "currentValue": "2950",
    "unit": "ج",
    "startDate": "2025-05-01",
    "endDate": "2025-08-31",
    "achievedDate": "2025-08-15",
    "priority": "high",
    "status": "achieved",
    "description": "تم تحقيق الهدف بنجاح من خلال تحسين إدارة المخزون والشراء بالجملة"
  }'

echo ""
echo "✅ All sample goals added successfully!"
