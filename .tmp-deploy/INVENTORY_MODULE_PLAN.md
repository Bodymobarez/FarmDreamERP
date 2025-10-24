# خطة تطوير نظام إدارة المخزون والأعلاف

## نظرة عامة
تم تصميم نظام شامل لإدارة المخزون (أعلاف وأدوية) مع إضافة نظام الصرف من المخزن ومتابعة كاملة لجميع الحركات.

## ما تم إنجازه

### 1. ✅ تحديث Schema (shared/schema.ts)
تم إضافة جدولين جديدين:

#### أ. جدول أصناف المخزون (`inventoryItems`)
```typescript
- id: معرف فريد
- itemCode: كود الصنف
- itemName: اسم الصنف
- itemType: نوع الصنف (feed أعلاف / medicine أدوية)
- category: التصنيف الفرعي (علف مركز، أدوية، فيتامينات...)
- unit: الوحدة (كجم، عبوة، لتر)
- currentStock: الرصيد الحالي
- reorderPoint: حد إعادة الطلب
- minStock: الحد الأدنى
- maxStock: الحد الأقصى
- unitCost: تكلفة الوحدة
- totalValue: قيمة المخزون الإجمالية
- supplierId: المورد الرئيسي
- location: موقع التخزين
- expiryDate: تاريخ الانتهاء
- batchNumber: رقم الدفعة من المورد
- status: الحالة (active, inactive, expired)
```

#### ب. جدول حركات المخزون (`inventoryTransactions`)
```typescript
- id: معرف فريد
- transactionNumber: رقم الحركة
- transactionDate: تاريخ الحركة
- transactionType: نوع الحركة (in إضافة / out صرف)
- itemId: الصنف
- quantity: الكمية
- unitCost: تكلفة الوحدة
- totalCost: التكلفة الإجمالية

// بيانات الصرف
- penNumber: رقم العنبر (عند الصرف)
- batchId: رقم الدفعة (عند الصرف)
- animalId: رقم الحيوان (للعلاجات الفردية)

// بيانات الإضافة
- supplierId: المورد (عند الإضافة)
- purchaseOrderNumber: رقم أمر الشراء
- invoiceNumber: رقم الفاتورة

// معلومات إضافية
- referenceType: نوع العملية (batch_expense, treatment, purchase)
- referenceId: معرف العملية المرتبطة
- performedBy: الموظف المسؤول
- description: الوصف
- notes: ملاحظات
```

### 2. ✅ تطوير صفحة Inventory.tsx (جزئياً)
تم البدء في تطوير الصفحة بالمميزات التالية:

#### أ. State Management
- viewMode: التبديل بين عرض الأصناف وحركات المخزون
- itemTypeFilter: فلترة حسب النوع (all/feed/medicine)
- searchTerm: البحث
- Dialogs states: إدارة النوافذ المنبثقة

#### ب. API Integration
- Fetch inventory items from `/api/inventory-items`
- Fetch transactions from `/api/inventory-transactions`
- Fetch batches for dropdowns

#### ج. Mutations
- addItemMutation: إضافة صنف جديد
- updateItemMutation: تحديث صنف
- deleteItemMutation: حذف صنف
- addTransactionMutation: إضافة حركة مخزون

#### د. Statistics Dashboard
- إجمالي الأصناف (feed + medicine)
- عدد الأصناف تحت حد الطلب
- قيمة المخزون الإجمالية
- إجمالي حركات المخزون (in + out)

#### هـ. Export Functions
- Export items (PDF/Excel/CSV)
- Export transactions (PDF/Excel/CSV)

## ما يحتاج إلى إكمال

### 1. 🔄 إكمال صفحة Inventory.tsx
الصفحة تحتوي على الهيكل لكن تحتاج إكمال:

#### أ. Tabs System
```tsx
<Tabs value={viewMode} onValueChange={setViewMode}>
  <TabsList>
    <TabsTrigger value="items">الأصناف</TabsTrigger>
    <TabsTrigger value="transactions">حركات المخزون</TabsTrigger>
  </TabsList>
  
  // Tab Content for Items (جدول الأصناف)
  // Tab Content for Transactions (جدول الحركات)
</Tabs>
```

#### ب. Dialogs (النوافذ المنبثقة)

**1. Add/Edit Item Dialog**
```tsx
<Dialog open={isAddItemOpen}>
  // Fields:
  - كود الصنف
  - اسم الصنف  
  - نوع الصنف (feed/medicine)
  - التصنيف الفرعي
  - الوحدة
  - الرصيد الحالي
  - حد إعادة الطلب
  - الحد الأدنى
  - الحد الأقصى
  - تكلفة الوحدة
  - المورد الرئيسي
  - موقع التخزين
  - تاريخ الانتهاء (للأدوية)
  - رقم الدفعة
</Dialog>
```

**2. Add Transaction Dialog (الأهم - نافذة الصرف/الإضافة)**
```tsx
<Dialog open={isAddTransactionOpen}>
  // Header based on transactionType
  {transactionType === "out" ? "صرف من المخزن" : "إضافة للمخزن"}
  
  // Common Fields:
  - رقم الحركة (auto-generated)
  - التاريخ
  - الصنف (dropdown من الأصناف المتاحة)
  - الكمية
  - تكلفة الوحدة (auto-fill من الصنف)
  - التكلفة الإجمالية (auto-calculated)
  - الوصف
  - ملاحظات
  
  // Fields for OUT (صرف):
  - رقم العنبر (dropdown من الأعنبر/الدفعات)
  - رقم الدفعة (dropdown)
  - رقم الحيوان (optional - للعلاجات الفردية)
  - نوع العملية المرتبطة (batch_expense/treatment)
  
  // Fields for IN (إضافة):
  - المورد (dropdown)
  - رقم أمر الشراء
  - رقم الفاتورة
  
  // Common:
  - الموظف المسؤول
</Dialog>
```

**3. Item Details Dialog**
```tsx
<Dialog open={isDetailsItemOpen}>
  // عرض تفاصيل الصنف:
  - المعلومات الأساسية
  - الأرصدة والحدود
  - التكاليف
  - آخر 10 حركات على هذا الصنف
  - تقرير بصري (chart) للاستهلاك
</Dialog>
```

**4. Transaction Details Dialog**
```tsx
<Dialog open={isTransactionDetailsOpen}>
  // عرض تفاصيل الحركة:
  - معلومات الحركة
  - تفاصيل الصنف
  - العنبر/الدفعة المستهدفة
  - المورد (في حالة الإضافة)
  - العملية المرتبطة
</Dialog>
```

**5. Delete Confirmation Dialog**
```tsx
<AlertDialog open={isDeleteItemOpen}>
  // تأكيد الحذف
</AlertDialog>
```

### 2. 🔄 API Endpoints (server/routes.ts)
يجب إضافة:

```typescript
// Inventory Items
GET    /api/inventory-items          // جلب جميع الأصناف
POST   /api/inventory-items          // إضافة صنف
GET    /api/inventory-items/:id      // جلب صنف معين
PUT    /api/inventory-items/:id      // تحديث صنف
DELETE /api/inventory-items/:id      // حذف صنف

// Inventory Transactions  
GET    /api/inventory-transactions   // جلب جميع الحركات
POST   /api/inventory-transactions   // إضافة حركة (صرف/إضافة)
GET    /api/inventory-transactions/:id // جلب حركة معينة
GET    /api/inventory-transactions/item/:itemId // جلب حركات صنف معين

// Reports
GET    /api/inventory/low-stock      // الأصناف تحت حد الطلب
GET    /api/inventory/expired         // الأصناف المنتهية
GET    /api/inventory/value-report    // تقرير قيمة المخزون
```

### 3. 🔄 Storage Methods (server/storage.ts)
يجب إضافة:

```typescript
// Inventory Items
async getInventoryItems()
async getInventoryItem(id)
async createInventoryItem(data)
async updateInventoryItem(id, data)
async deleteInventoryItem(id)

// Inventory Transactions
async getInventoryTransactions()
async getInventoryTransaction(id)
async createInventoryTransaction(data)
async getInventoryTransactionsByItem(itemId)

// عند إضافة حركة:
- تحديث currentStock للصنف
- تحديث totalValue للصنف
- ربط الحركة بـ batchExpense إذا كانت صرف لدفعة
```

### 4. 🔄 Components إضافية

#### أ. StockLevelIndicator Component
```tsx
// مؤشر مستوى المخزون
<StockLevelIndicator 
  current={currentStock} 
  reorder={reorderPoint}
  min={minStock}
/>
// يعرض: ✅ ممتاز | ⚠️ تحذير | 🔴 حرج
```

#### ب. InventoryChart Component  
```tsx
// رسم بياني لحركة المخزون
<InventoryChart itemId={itemId} period="month" />
```

## المميزات الكاملة للنظام

### 1. إدارة الأصناف
- ✅ إضافة صنف جديد (أعلاف أو أدوية)
- ✅ تعديل معلومات الصنف
- ✅ حذف صنف
- ✅ عرض تفاصيل الصنف
- ✅ البحث والفلترة حسب النوع
- ✅ تحذيرات للأصناف تحت حد الطلب
- ✅ تحذيرات للأصناف المنتهية

### 2. حركات المخزون

#### أ. الصرف من المخزن (Out)
- تحديد الصنف
- تحديد الكمية
- **تحديد العنبر/الدفعة المستهدفة**
- تحديد نوع العملية:
  * صرف أعلاف لدفعة
  * صرف دواء لدفعة
  * صرف علاج لحيوان معين
- تسجيل الموظف المسؤول
- **ربط تلقائي مع batch_expense**
- **تحديث رصيد المخزون تلقائياً**

#### ب. الإضافة للمخزن (In)
- تحديد الصنف
- تحديد الكمية
- تحديد المورد
- رقم أمر الشراء
- رقم الفاتورة
- تكلفة الوحدة
- **تحديث رصيد المخزون تلقائياً**
- **تحديث قيمة المخزون**

### 3. التقارير
- ✅ تقرير الأصناف (PDF/Excel/CSV)
- ✅ تقرير حركات المخزون
- ✅ تقرير الأصناف تحت حد الطلب
- ✅ تقرير قيمة المخزون
- ✅ تقرير الأصناف المنتهية
- ✅ تقرير الاستهلاك (consumption report)

### 4. لوحة المعلومات
- عدد الأصناف (أعلاف/أدوية)
- الأصناف تحت حد الطلب
- قيمة المخزون الإجمالية
- حركات اليوم/الأسبوع/الشهر
- أكثر الأصناف استهلاكاً
- الأصناف القريبة من الانتهاء

### 5. المتابعة الكاملة
كل حركة صرف تسجل:
- ✅ **التاريخ والوقت**
- ✅ **الصنف المصروف**
- ✅ **الكمية**
- ✅ **التكلفة**
- ✅ **العنبر المستهدف**
- ✅ **الدفعة المستهدفة**
- ✅ **الحيوان (إن وجد)**
- ✅ **الموظف المسؤول**
- ✅ **نوع العملية**
- ✅ **رقم العملية المرتبطة**

## خطوات التنفيذ المتبقية

### المرحلة 1: إكمال Backend (الأولوية العليا)
1. إضافة API endpoints للـ inventory-items
2. إضافة API endpoints للـ inventory-transactions
3. إضافة Storage methods
4. **منطق تحديث المخزون عند الصرف/الإضافة**
5. **منطق ربط الصرف مع batch_expense**

### المرحلة 2: إكمال Frontend
1. إكمال Tabs system
2. إكمال جداول الأصناف والحركات
3. **إكمال Add Transaction Dialog (الأهم)**
4. إكمال باقي النوافذ المنبثقة
5. إضافة validation للنماذج

### المرحلة 3: التحسينات
1. إضافة Charts للاستهلاك
2. إضافة Notifications للأصناف تحت الحد
3. إضافة Barcode scanning (مستقبلاً)
4. إضافة Stock Alerts (تنبيهات تلقائية)

## ملاحظات هامة

### 🔥 الأولويات العاجلة
1. **نافذة الصرف من المخزن** - الأهم لأنها المطلوبة بشكل يومي
2. **ربط الصرف مع الدفعات** - لتتبع التكاليف بدقة
3. **تحديث الأرصدة تلقائياً** - لضمان دقة البيانات

### 💡 اقتراحات إضافية
1. **Batch Transfer**: نقل أصناف بين مواقع تخزين
2. **Stock Taking**: جرد دوري للمخزون
3. **Wastage Recording**: تسجيل التالف
4. **Reorder Automation**: طلب تلقائي عند الوصول لحد الطلب

### 📊 KPIs مقترحة
- معدل دوران المخزون (Inventory Turnover)
- تكلفة المخزون لكل حيوان
- معدل الاستهلاك اليومي لكل صنف
- نسبة التالف من المخزون

## الخلاصة

تم إنجاز:
- ✅ تصميم Schema كامل
- ✅ هيكل الصفحة الأساسي
- ✅ State Management
- ✅ Statistics Dashboard
- ✅ Export Functions

يتبقى:
- 🔄 API Endpoints
- 🔄 Storage Methods
- 🔄 Tabs and Tables
- 🔄 Dialogs (خاصة نافذة الصرف)
- 🔄 Validation Logic
- 🔄 Auto Stock Update

النظام مصمم بشكل شامل ويحتاج فقط إلى إكمال التنفيذ حسب الخطة أعلاه.
