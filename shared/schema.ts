import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Animals table
export const animals = pgTable("animals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  earTag: varchar("ear_tag", { length: 50 }).notNull().unique(),
  animalType: varchar("animal_type", { length: 50 }).notNull(),
  sex: varchar("sex", { length: 10 }).notNull(),
  entryWeight: decimal("entry_weight", { precision: 10, scale: 2 }).notNull(),
  currentWeight: decimal("current_weight", { precision: 10, scale: 2 }),
  entryDate: timestamp("entry_date").notNull().defaultNow(),
  penNumber: varchar("pen_number", { length: 50 }),
  batchNumber: varchar("batch_number", { length: 50 }),
  batchId: varchar("batch_id", { length: 255 }), // ربط بمركز التكلفة (الدفعة)
  receptionId: varchar("reception_id", { length: 255 }), // ربط بالاستقبال
  purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }), // تكلفة الشراء الأولية
  accumulatedFeedCost: decimal("accumulated_feed_cost", { precision: 12, scale: 2 }).notNull().default("0"), // تكلفة الأعلاف المتراكمة
  accumulatedTreatmentCost: decimal("accumulated_treatment_cost", { precision: 12, scale: 2 }).notNull().default("0"), // تكلفة العلاج المتراكمة
  accumulatedOtherCost: decimal("accumulated_other_cost", { precision: 12, scale: 2 }).notNull().default("0"), // تكاليف أخرى متراكمة
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }).notNull().default("0"), // إجمالي التكلفة
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, sold, deceased
  saleId: varchar("sale_id", { length: 255 }), // رقم عملية البيع إن تم البيع
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAnimalSchema = createInsertSchema(animals, {
  earTag: z.string().min(1, "رقم الأذن مطلوب"),
  animalType: z.string().min(1, "نوع الحيوان مطلوب"),
  sex: z.enum(["ذكر", "أنثى"], { errorMap: () => ({ message: "الجنس يجب أن يكون ذكر أو أنثى" }) }),
  entryWeight: z.string().min(1, "وزن الدخول مطلوب"),
  currentWeight: z.string().optional(),
  entryDate: z.date().optional(),
  penNumber: z.string().optional(),
  batchNumber: z.string().optional(),
  batchId: z.string().optional(),
  receptionId: z.string().optional(),
  purchaseCost: z.string().optional(),
  accumulatedFeedCost: z.string().optional(),
  accumulatedTreatmentCost: z.string().optional(),
  accumulatedOtherCost: z.string().optional(),
  totalCost: z.string().optional(),
  status: z.enum(["active", "sold", "deceased"]).default("active"),
  saleId: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectAnimalSchema = createSelectSchema(animals);

export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type Animal = typeof animals.$inferSelect;

// Receptions table - استقبال الدفعات
export const receptions = pgTable("receptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  receptionNumber: varchar("reception_number", { length: 50 }).notNull().unique(),
  receptionDate: timestamp("reception_date").notNull().defaultNow(),
  animalType: varchar("animal_type", { length: 50 }).notNull(), // نوع الحيوان الرئيسي (أبقار، أغنام، إلخ)
  animalBreed: varchar("animal_breed", { length: 100 }), // السلالة/الفصيلة (فريزيان، برقي، إلخ)
  totalAnimals: varchar("total_animals", { length: 10 }).notNull(), // عدد الحيوانات
  totalWeight: decimal("total_weight", { precision: 10, scale: 2 }).notNull(), // الوزن الإجمالي
  totalPrice: decimal("total_price", { precision: 10, scale: 2 }).notNull(), // السعر الإجمالي
  supplier: varchar("supplier", { length: 255 }), // المورد
  status: varchar("status", { length: 20 }).notNull().default("pending"), // pending, distributed, completed
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertReceptionSchema = createInsertSchema(receptions, {
  receptionNumber: z.string().min(1, "رقم الاستقبال مطلوب"),
  animalType: z.string().min(1, "نوع الحيوان مطلوب"),
  animalBreed: z.string().optional(),
  totalAnimals: z.string().min(1, "عدد الحيوانات مطلوب"),
  totalWeight: z.string().min(1, "الوزن الإجمالي مطلوب"),
  totalPrice: z.string().min(1, "السعر الإجمالي مطلوب"),
  supplier: z.string().optional(),
  status: z.enum(["pending", "distributed", "completed"]).default("pending"),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectReceptionSchema = createSelectSchema(receptions);

export type InsertReception = z.infer<typeof insertReceptionSchema>;
export type Reception = typeof receptions.$inferSelect;

// Suppliers table - الموردين
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  taxNumber: varchar("tax_number", { length: 100 }),
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default("0"), // الرصيد الحالي
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers, {
  name: z.string().min(1, "اسم المورد مطلوب"),
  phone: z.string().optional(),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
  balance: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectSupplierSchema = createSelectSchema(suppliers);

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// Customers table - العملاء
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: varchar("name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  taxNumber: varchar("tax_number", { length: 100 }),
  balance: decimal("balance", { precision: 12, scale: 2 }).notNull().default("0"), // الرصيد الحالي
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customers, {
  name: z.string().min(1, "اسم العميل مطلوب"),
  phone: z.string().optional(),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  address: z.string().optional(),
  taxNumber: z.string().optional(),
  balance: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectCustomerSchema = createSelectSchema(customers);

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Transactions table - المعاملات المالية
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionNumber: varchar("transaction_number", { length: 50 }).notNull().unique(),
  transactionDate: timestamp("transaction_date").notNull().defaultNow(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(), // purchase, sale, payment, receipt
  relatedType: varchar("related_type", { length: 50 }), // supplier, customer
  relatedId: varchar("related_id", { length: 255 }), // ID of supplier or customer
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }), // cash, bank_transfer, check
  referenceNumber: varchar("reference_number", { length: 100 }), // رقم الشيك أو الحوالة
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions, {
  transactionNumber: z.string().min(1, "رقم المعاملة مطلوب"),
  transactionDate: z.date().optional(),
  transactionType: z.enum(["purchase", "sale", "payment", "receipt"], {
    errorMap: () => ({ message: "نوع المعاملة غير صحيح" })
  }),
  relatedType: z.enum(["supplier", "customer"]).optional(),
  relatedId: z.string().optional(),
  amount: z.string().min(1, "المبلغ مطلوب"),
  paymentMethod: z.enum(["cash", "bank_transfer", "check"]).optional(),
  referenceNumber: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectTransactionSchema = createSelectSchema(transactions);

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Batches (Cost Centers) - الدفعات كمراكز تكلفة
export const batches = pgTable("batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchNumber: varchar("batch_number", { length: 50 }).notNull().unique(),
  batchName: varchar("batch_name", { length: 255 }).notNull(),
  startDate: timestamp("start_date").notNull().defaultNow(),
  closeDate: timestamp("close_date"), // تاريخ الإغلاق عند بيع كل الحيوانات
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, closed
  totalAnimals: varchar("total_animals", { length: 10 }).notNull().default("0"),
  soldAnimals: varchar("sold_animals", { length: 10 }).notNull().default("0"),
  deceasedAnimals: varchar("deceased_animals", { length: 10 }).notNull().default("0"),
  // تكاليف الدفعة
  purchaseCost: decimal("purchase_cost", { precision: 12, scale: 2 }).notNull().default("0"), // تكلفة الشراء
  feedCost: decimal("feed_cost", { precision: 12, scale: 2 }).notNull().default("0"), // تكلفة الأعلاف
  treatmentCost: decimal("treatment_cost", { precision: 12, scale: 2 }).notNull().default("0"), // تكلفة العلاجات
  otherExpenses: decimal("other_expenses", { precision: 12, scale: 2 }).notNull().default("0"), // مصروفات أخرى
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }).notNull().default("0"), // إجمالي التكلفة
  // إيرادات الدفعة
  totalRevenue: decimal("total_revenue", { precision: 12, scale: 2 }).notNull().default("0"), // إجمالي الإيرادات
  profit: decimal("profit", { precision: 12, scale: 2 }).notNull().default("0"), // صافي الربح
  profitPercentage: decimal("profit_percentage", { precision: 5, scale: 2 }).notNull().default("0"), // نسبة الربح
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBatchSchema = createInsertSchema(batches, {
  batchNumber: z.string().min(1, "رقم الدفعة مطلوب"),
  batchName: z.string().min(1, "اسم الدفعة مطلوب"),
  startDate: z.date().optional(),
  closeDate: z.date().optional().nullable(),
  status: z.enum(["active", "closed"]).default("active"),
  totalAnimals: z.string().optional(),
  soldAnimals: z.string().optional(),
  deceasedAnimals: z.string().optional(),
  purchaseCost: z.string().optional(),
  feedCost: z.string().optional(),
  treatmentCost: z.string().optional(),
  otherExpenses: z.string().optional(),
  totalCost: z.string().optional(),
  totalRevenue: z.string().optional(),
  profit: z.string().optional(),
  profitPercentage: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectBatchSchema = createSelectSchema(batches);

export type InsertBatch = z.infer<typeof insertBatchSchema>;
export type Batch = typeof batches.$inferSelect;

// Batch Expenses - مصروفات الدفعة (تفصيلية)
export const batchExpenses = pgTable("batch_expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchId: varchar("batch_id", { length: 255 }).notNull(), // ربط بالدفعة
  expenseDate: timestamp("expense_date").notNull().defaultNow(),
  expenseType: varchar("expense_type", { length: 50 }).notNull(), // feed, treatment, labor, transport, other
  expenseCategory: varchar("expense_category", { length: 100 }), // تصنيف فرعي
  description: text("description").notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }), // الكمية (للأعلاف مثلاً)
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }), // سعر الوحدة
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(), // المبلغ الإجمالي
  supplierId: varchar("supplier_id", { length: 255 }), // المورد إن وجد
  paymentMethod: varchar("payment_method", { length: 50 }), // cash, bank_transfer, check, credit
  referenceNumber: varchar("reference_number", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertBatchExpenseSchema = createInsertSchema(batchExpenses, {
  batchId: z.string().min(1, "رقم الدفعة مطلوب"),
  expenseDate: z.date().optional(),
  expenseType: z.enum(["feed", "treatment", "labor", "transport", "other"], {
    errorMap: () => ({ message: "نوع المصروف غير صحيح" })
  }),
  expenseCategory: z.string().optional(),
  description: z.string().min(1, "الوصف مطلوب"),
  quantity: z.string().optional(),
  unitPrice: z.string().optional(),
  amount: z.string().min(1, "المبلغ مطلوب"),
  supplierId: z.string().optional(),
  paymentMethod: z.enum(["cash", "bank_transfer", "check", "credit"]).optional(),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectBatchExpenseSchema = createSelectSchema(batchExpenses);

export type InsertBatchExpense = z.infer<typeof insertBatchExpenseSchema>;
export type BatchExpense = typeof batchExpenses.$inferSelect;

// Animal Sales - مبيعات الحيوانات
export const animalSales = pgTable("animal_sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleNumber: varchar("sale_number", { length: 50 }).notNull().unique(),
  saleDate: timestamp("sale_date").notNull().defaultNow(),
  animalId: varchar("animal_id", { length: 255 }).notNull(), // الحيوان المباع
  batchId: varchar("batch_id", { length: 255 }).notNull(), // الدفعة
  customerId: varchar("customer_id", { length: 255 }), // العميل
  weight: decimal("weight", { precision: 10, scale: 2 }).notNull(), // الوزن عند البيع
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }).notNull(), // سعر الكيلو
  salePrice: decimal("sale_price", { precision: 12, scale: 2 }).notNull(), // سعر البيع الإجمالي
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }).notNull(), // التكلفة الإجمالية للحيوان
  profit: decimal("profit", { precision: 12, scale: 2 }).notNull(), // صافي الربح
  profitPercentage: decimal("profit_percentage", { precision: 5, scale: 2 }), // نسبة الربح
  paymentMethod: varchar("payment_method", { length: 50 }), // cash, bank_transfer, check, installment
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("pending"), // pending, partial, paid
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }).notNull().default("0"), // المبلغ المدفوع
  remainingAmount: decimal("remaining_amount", { precision: 12, scale: 2 }).notNull().default("0"), // المبلغ المتبقي
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAnimalSaleSchema = createInsertSchema(animalSales, {
  saleNumber: z.string().min(1, "رقم البيع مطلوب"),
  saleDate: z.date().optional(),
  animalId: z.string().min(1, "رقم الحيوان مطلوب"),
  batchId: z.string().min(1, "رقم الدفعة مطلوب"),
  customerId: z.string().optional(),
  weight: z.string().min(1, "الوزن مطلوب"),
  pricePerKg: z.string().min(1, "سعر الكيلو مطلوب"),
  salePrice: z.string().min(1, "سعر البيع مطلوب"),
  totalCost: z.string().min(1, "التكلفة الإجمالية مطلوبة"),
  profit: z.string().min(1, "الربح مطلوب"),
  profitPercentage: z.string().optional(),
  paymentMethod: z.enum(["cash", "bank_transfer", "check", "installment"]).optional(),
  paymentStatus: z.enum(["pending", "partial", "paid"]).default("pending"),
  paidAmount: z.string().optional(),
  remainingAmount: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectAnimalSaleSchema = createSelectSchema(animalSales);

export type InsertAnimalSale = z.infer<typeof insertAnimalSaleSchema>;
export type AnimalSale = typeof animalSales.$inferSelect;

// Accounting Entries - القيود المحاسبية
export const accountingEntries = pgTable("accounting_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entryNumber: varchar("entry_number", { length: 50 }).notNull().unique(),
  entryDate: timestamp("entry_date").notNull().defaultNow(),
  entryType: varchar("entry_type", { length: 50 }).notNull(), // purchase, sale, expense, payment, receipt
  relatedType: varchar("related_type", { length: 50 }), // batch, animal, supplier, customer
  relatedId: varchar("related_id", { length: 255 }), // معرف العنصر المرتبط
  accountCode: varchar("account_code", { length: 50 }).notNull(), // كود الحساب
  accountName: varchar("account_name", { length: 255 }).notNull(), // اسم الحساب
  debit: decimal("debit", { precision: 12, scale: 2 }).notNull().default("0"), // مدين
  credit: decimal("credit", { precision: 12, scale: 2 }).notNull().default("0"), // دائن
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertAccountingEntrySchema = createInsertSchema(accountingEntries, {
  entryNumber: z.string().min(1, "رقم القيد مطلوب"),
  entryDate: z.date().optional(),
  entryType: z.string().min(1, "نوع القيد مطلوب"),
  relatedType: z.string().optional(),
  relatedId: z.string().optional(),
  accountCode: z.string().min(1, "كود الحساب مطلوب"),
  accountName: z.string().min(1, "اسم الحساب مطلوب"),
  debit: z.string().optional(),
  credit: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectAccountingEntrySchema = createSelectSchema(accountingEntries);

export type InsertAccountingEntry = z.infer<typeof insertAccountingEntrySchema>;
export type AccountingEntry = typeof accountingEntries.$inferSelect;

// Performance Goals - أهداف الأداء
export const performanceGoals = pgTable("performance_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  goalName: varchar("goal_name", { length: 255 }).notNull(), // اسم الهدف
  goalType: varchar("goal_type", { length: 50 }).notNull(), // adg, fcr, survival_rate, cost_per_head, profit
  targetValue: decimal("target_value", { precision: 10, scale: 2 }).notNull(), // القيمة المستهدفة
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).notNull().default("0"), // القيمة الحالية
  unit: varchar("unit", { length: 20 }), // الوحدة (كجم، %, ج، إلخ)
  batchId: varchar("batch_id", { length: 255 }), // ربط بدفعة محددة (اختياري)
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date"), // تاريخ نهاية الهدف
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, achieved, failed, expired
  achievedDate: timestamp("achieved_date"), // تاريخ تحقيق الهدف
  priority: varchar("priority", { length: 20 }).notNull().default("medium"), // low, medium, high, critical
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertPerformanceGoalSchema = createInsertSchema(performanceGoals, {
  goalName: z.string().min(1, "اسم الهدف مطلوب"),
  goalType: z.enum(["adg", "fcr", "survival_rate", "cost_per_head", "profit", "weight_gain", "feed_efficiency"], {
    errorMap: () => ({ message: "نوع الهدف غير صحيح" })
  }),
  targetValue: z.string().min(1, "القيمة المستهدفة مطلوبة"),
  currentValue: z.string().optional(),
  unit: z.string().optional(),
  batchId: z.string().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  status: z.enum(["active", "achieved", "failed", "expired"]).default("active"),
  achievedDate: z.date().optional(),
  priority: z.enum(["low", "medium", "high", "critical"]).default("medium"),
  description: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectPerformanceGoalSchema = createSelectSchema(performanceGoals);

export type InsertPerformanceGoal = z.infer<typeof insertPerformanceGoalSchema>;
export type PerformanceGoal = typeof performanceGoals.$inferSelect;

// Inventory Items - أصناف المخزون (أعلاف وأدوية)
export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemCode: varchar("item_code", { length: 50 }).notNull().unique(), // كود الصنف
  itemName: varchar("item_name", { length: 255 }).notNull(), // اسم الصنف
  itemType: varchar("item_type", { length: 50 }).notNull(), // feed, medicine
  category: varchar("category", { length: 100 }), // التصنيف الفرعي (علف مركز، علف خشن، فيتامينات، مضادات حيوية)
  unit: varchar("unit", { length: 20 }).notNull(), // الوحدة (كجم، عبوة، لتر)
  currentStock: decimal("current_stock", { precision: 10, scale: 2 }).notNull().default("0"), // الرصيد الحالي
  reorderPoint: decimal("reorder_point", { precision: 10, scale: 2 }).notNull().default("0"), // حد إعادة الطلب
  minStock: decimal("min_stock", { precision: 10, scale: 2 }).notNull().default("0"), // الحد الأدنى
  maxStock: decimal("max_stock", { precision: 10, scale: 2 }), // الحد الأقصى
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).notNull().default("0"), // تكلفة الوحدة
  totalValue: decimal("total_value", { precision: 12, scale: 2 }).notNull().default("0"), // قيمة المخزون
  supplierId: varchar("supplier_id", { length: 255 }), // المورد الرئيسي
  location: varchar("location", { length: 100 }), // موقع التخزين
  expiryDate: timestamp("expiry_date"), // تاريخ الانتهاء (للأدوية)
  batchNumber: varchar("batch_number", { length: 50 }), // رقم الدفعة من المورد
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, inactive, expired
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems, {
  itemCode: z.string().min(1, "كود الصنف مطلوب"),
  itemName: z.string().min(1, "اسم الصنف مطلوب"),
  itemType: z.enum(["feed", "medicine"], {
    errorMap: () => ({ message: "نوع الصنف يجب أن يكون أعلاف أو أدوية" })
  }),
  category: z.string().optional(),
  unit: z.string().min(1, "الوحدة مطلوبة"),
  currentStock: z.string().optional(),
  reorderPoint: z.string().optional(),
  minStock: z.string().optional(),
  maxStock: z.string().optional(),
  unitCost: z.string().optional(),
  totalValue: z.string().optional(),
  supplierId: z.string().optional(),
  location: z.string().optional(),
  expiryDate: z.date().optional(),
  batchNumber: z.string().optional(),
  status: z.enum(["active", "inactive", "expired"]).default("active"),
  description: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectInventoryItemSchema = createSelectSchema(inventoryItems);

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

// Inventory Transactions - حركات المخزون (إضافة/صرف)
export const inventoryTransactions = pgTable("inventory_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionNumber: varchar("transaction_number", { length: 50 }).notNull().unique(), // رقم الحركة
  transactionDate: timestamp("transaction_date").notNull().defaultNow(), // تاريخ الحركة
  transactionType: varchar("transaction_type", { length: 20 }).notNull(), // in (إضافة), out (صرف)
  itemId: varchar("item_id", { length: 255 }).notNull(), // الصنف
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(), // الكمية
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }).notNull(), // تكلفة الوحدة
  totalCost: decimal("total_cost", { precision: 12, scale: 2 }).notNull(), // التكلفة الإجمالية
  // بيانات الصرف
  penNumber: varchar("pen_number", { length: 50 }), // رقم العنبر (عند الصرف)
  batchId: varchar("batch_id", { length: 255 }), // رقم الدفعة (عند الصرف)
  animalId: varchar("animal_id", { length: 255 }), // رقم الحيوان (للعلاجات الفردية)
  // بيانات الإضافة
  supplierId: varchar("supplier_id", { length: 255 }), // المورد (عند الإضافة)
  purchaseOrderNumber: varchar("purchase_order_number", { length: 50 }), // رقم أمر الشراء
  invoiceNumber: varchar("invoice_number", { length: 50 }), // رقم الفاتورة
  // معلومات إضافية
  referenceType: varchar("reference_type", { length: 50 }), // batch_expense, treatment, purchase
  referenceId: varchar("reference_id", { length: 255 }), // معرف العملية المرتبطة
  performedBy: varchar("performed_by", { length: 100 }), // الموظف المسؤول
  description: text("description"),
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions, {
  transactionNumber: z.string().min(1, "رقم الحركة مطلوب"),
  transactionDate: z.date().optional(),
  transactionType: z.enum(["in", "out"], {
    errorMap: () => ({ message: "نوع الحركة يجب أن يكون إضافة أو صرف" })
  }),
  itemId: z.string().min(1, "الصنف مطلوب"),
  quantity: z.string().min(1, "الكمية مطلوبة"),
  unitCost: z.string().min(1, "تكلفة الوحدة مطلوبة"),
  totalCost: z.string().min(1, "التكلفة الإجمالية مطلوبة"),
  penNumber: z.string().optional(),
  batchId: z.string().optional(),
  animalId: z.string().optional(),
  supplierId: z.string().optional(),
  purchaseOrderNumber: z.string().optional(),
  invoiceNumber: z.string().optional(),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
  performedBy: z.string().optional(),
  description: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
});

export const selectInventoryTransactionSchema = createSelectSchema(inventoryTransactions);

export type InsertInventoryTransaction = z.infer<typeof insertInventoryTransactionSchema>;
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;

// Veterinary Treatments - السجل الطبي البيطري
export const veterinaryTreatments = pgTable("veterinary_treatments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  // Basic Information
  animalId: varchar("animal_id", { length: 255 }).notNull(), // الحيوان
  veterinarian: varchar("veterinarian", { length: 255 }).notNull(), // اسم الطبيب البيطري
  treatmentDate: timestamp("treatment_date").notNull().defaultNow(), // تاريخ العلاج
  treatmentType: varchar("treatment_type", { length: 50 }).notNull(), // نوع العلاج
  
  // Clinical Examination - الفحص السريري
  temperature: decimal("temperature", { precision: 4, scale: 1 }), // درجة الحرارة
  heartRate: varchar("heart_rate", { length: 20 }), // معدل ضربات القلب
  respiratoryRate: varchar("respiratory_rate", { length: 20 }), // معدل التنفس
  appetite: varchar("appetite", { length: 50 }), // الشهية
  behavior: varchar("behavior", { length: 50 }), // السلوك
  mobility: varchar("mobility", { length: 50 }), // الحركة
  symptoms: text("symptoms"), // الأعراض (JSON array)
  
  // Diagnosis - التشخيص
  diagnosisCategory: varchar("diagnosis_category", { length: 100 }), // تصنيف التشخيص
  diagnosisDescription: text("diagnosis_description").notNull(), // وصف التشخيص
  severity: varchar("severity", { length: 20 }).notNull(), // درجة الخطورة (mild, moderate, severe)
  
  // Treatment Plan - خطة العلاج
  medications: text("medications"), // الأدوية الموصوفة (JSON array)
  
  // Recommendations - التوصيات
  isolation: varchar("isolation", { length: 50 }), // متطلبات العزل
  dietRecommendations: text("diet_recommendations"), // توصيات النظام الغذائي
  followUpDate: timestamp("follow_up_date"), // موعد المتابعة
  specialInstructions: text("special_instructions"), // تعليمات خاصة
  
  // Additional Information
  vetNotes: text("vet_notes"), // ملاحظات الطبيب
  estimatedCost: decimal("estimated_cost", { precision: 10, scale: 2 }).notNull().default("0"), // التكلفة التقديرية
  actualCost: decimal("actual_cost", { precision: 10, scale: 2 }).notNull().default("0"), // التكلفة الفعلية
  
  // Status Tracking
  status: varchar("status", { length: 20 }).notNull().default("ongoing"), // ongoing, completed, followup_required
  completedDate: timestamp("completed_date"), // تاريخ إنهاء العلاج
  outcome: varchar("outcome", { length: 50 }), // نتيجة العلاج (recovered, improved, unchanged, deceased)
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertVeterinaryTreatmentSchema = createInsertSchema(veterinaryTreatments, {
  animalId: z.string().min(1, "رقم الحيوان مطلوب"),
  veterinarian: z.string().min(1, "اسم الطبيب مطلوب"),
  treatmentDate: z.date().optional(),
  treatmentType: z.enum([
    "vaccination",
    "disease_treatment",
    "parasite_treatment",
    "wound_treatment",
    "preventive_care",
    "surgery",
    "emergency",
    "routine_checkup"
  ], {
    errorMap: () => ({ message: "نوع العلاج غير صحيح" })
  }),
  temperature: z.string().optional(),
  heartRate: z.string().optional(),
  respiratoryRate: z.string().optional(),
  appetite: z.string().optional(),
  behavior: z.string().optional(),
  mobility: z.string().optional(),
  symptoms: z.string().optional(), // JSON string
  diagnosisCategory: z.string().optional(),
  diagnosisDescription: z.string().min(1, "وصف التشخيص مطلوب"),
  severity: z.enum(["mild", "moderate", "severe"], {
    errorMap: () => ({ message: "درجة الخطورة غير صحيحة" })
  }),
  medications: z.string().optional(), // JSON string
  isolation: z.string().optional(),
  dietRecommendations: z.string().optional(),
  followUpDate: z.date().optional(),
  specialInstructions: z.string().optional(),
  vetNotes: z.string().optional(),
  estimatedCost: z.string().optional(),
  actualCost: z.string().optional(),
  status: z.enum(["ongoing", "completed", "followup_required"]).default("ongoing"),
  completedDate: z.date().optional(),
  outcome: z.enum(["recovered", "improved", "unchanged", "deceased"]).optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectVeterinaryTreatmentSchema = createSelectSchema(veterinaryTreatments);

export type InsertVeterinaryTreatment = z.infer<typeof insertVeterinaryTreatmentSchema>;
export type VeterinaryTreatment = typeof veterinaryTreatments.$inferSelect;

// Expenses - المصروفات الشاملة
export const expenses = pgTable("expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  expenseNumber: varchar("expense_number", { length: 50 }).notNull().unique(), // رقم المصروف
  expenseDate: timestamp("expense_date").notNull().defaultNow(), // تاريخ المصروف
  
  // تصنيف المصروف
  category: varchar("category", { length: 50 }).notNull(), // الفئة الرئيسية
  subcategory: varchar("subcategory", { length: 100 }), // فئة فرعية
  expenseType: varchar("expense_type", { length: 50 }).notNull(), // feed, medicine, salary, utilities, maintenance, transport, other
  
  // المبالغ
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(), // المبلغ
  quantity: decimal("quantity", { precision: 10, scale: 2 }), // الكمية (للأعلاف والأدوية)
  unitPrice: decimal("unit_price", { precision: 10, scale: 2 }), // سعر الوحدة
  
  // بيانات المرتبات (إذا كان المصروف راتب)
  employeeName: varchar("employee_name", { length: 255 }), // اسم الموظف
  employeePosition: varchar("employee_position", { length: 100 }), // الوظيفة
  employeeId: varchar("employee_id", { length: 100 }), // رقم الموظف
  salaryMonth: varchar("salary_month", { length: 7 }), // شهر الراتب (YYYY-MM)
  baseSalary: decimal("base_salary", { precision: 10, scale: 2 }), // الراتب الأساسي
  bonuses: decimal("bonuses", { precision: 10, scale: 2 }).default("0"), // الحوافز
  deductions: decimal("deductions", { precision: 10, scale: 2 }).default("0"), // الخصومات
  netSalary: decimal("net_salary", { precision: 10, scale: 2 }), // صافي الراتب
  
  // ربط بجهات أخرى
  batchId: varchar("batch_id", { length: 255 }), // ربط بدفعة (اختياري)
  supplierId: varchar("supplier_id", { length: 255 }), // المورد
  
  // طريقة الدفع
  paymentMethod: varchar("payment_method", { length: 50 }), // cash, bank_transfer, check, credit
  paymentStatus: varchar("payment_status", { length: 20 }).notNull().default("paid"), // paid, pending, partial
  paidAmount: decimal("paid_amount", { precision: 12, scale: 2 }), // المبلغ المدفوع
  remainingAmount: decimal("remaining_amount", { precision: 12, scale: 2 }), // المبلغ المتبقي
  referenceNumber: varchar("reference_number", { length: 100 }), // رقم الشيك أو الحوالة
  
  // وصف وملاحظات
  description: text("description").notNull(), // الوصف
  notes: text("notes"), // ملاحظات
  
  // المرفقات
  attachments: text("attachments"), // روابط المرفقات (JSON array)
  
  // تتبع
  createdBy: varchar("created_by", { length: 255 }), // المستخدم المُدخل
  approvedBy: varchar("approved_by", { length: 255 }), // المعتمد
  approvedAt: timestamp("approved_at"), // تاريخ الاعتماد
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertExpenseSchema = createInsertSchema(expenses, {
  expenseNumber: z.string().min(1, "رقم المصروف مطلوب"),
  expenseDate: z.date().optional(),
  category: z.string().min(1, "الفئة مطلوبة"),
  subcategory: z.string().optional(),
  expenseType: z.enum([
    "feed",           // أعلاف
    "medicine",       // أدوية وعلاجات
    "salary",         // مرتبات
    "utilities",      // مرافق (كهرباء، مياه، غاز)
    "maintenance",    // صيانة
    "transport",      // نقل ومواصلات
    "rent",           // إيجار
    "insurance",      // تأمين
    "marketing",      // تسويق
    "consultation",   // استشارات (بيطرية، إدارية)
    "equipment",      // معدات وأدوات
    "cleaning",       // تنظيف ونظافة
    "security",       // أمن وحراسة
    "taxes",          // ضرائب ورسوم
    "other"           // أخرى
  ], {
    errorMap: () => ({ message: "نوع المصروف غير صحيح" })
  }),
  amount: z.string().min(1, "المبلغ مطلوب"),
  quantity: z.string().optional(),
  unitPrice: z.string().optional(),
  employeeName: z.string().optional(),
  employeePosition: z.string().optional(),
  employeeId: z.string().optional(),
  salaryMonth: z.string().optional(),
  baseSalary: z.string().optional(),
  bonuses: z.string().optional(),
  deductions: z.string().optional(),
  netSalary: z.string().optional(),
  batchId: z.string().optional(),
  supplierId: z.string().optional(),
  paymentMethod: z.enum(["cash", "bank_transfer", "check", "credit"]).optional(),
  paymentStatus: z.enum(["paid", "pending", "partial"]).default("paid"),
  paidAmount: z.string().optional(),
  remainingAmount: z.string().optional(),
  referenceNumber: z.string().optional(),
  description: z.string().min(1, "الوصف مطلوب"),
  notes: z.string().optional(),
  attachments: z.string().optional(),
  createdBy: z.string().optional(),
  approvedBy: z.string().optional(),
  approvedAt: z.date().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectExpenseSchema = createSelectSchema(expenses);

export type InsertExpense = z.infer<typeof insertExpenseSchema>;
export type Expense = typeof expenses.$inferSelect;

// Employees - الموظفين (للمرتبات)
export const employees = pgTable("employees", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  employeeNumber: varchar("employee_number", { length: 50 }).notNull().unique(), // رقم الموظف
  employeeName: varchar("employee_name", { length: 255 }).notNull(), // الاسم
  position: varchar("position", { length: 100 }).notNull(), // الوظيفة
  department: varchar("department", { length: 100 }), // القسم
  
  // معلومات الاتصال
  phone: varchar("phone", { length: 50 }),
  email: varchar("email", { length: 255 }),
  address: text("address"),
  
  // معلومات التوظيف
  hireDate: timestamp("hire_date").notNull(), // تاريخ التعيين
  contractType: varchar("contract_type", { length: 50 }).notNull().default("full_time"), // full_time, part_time, contract
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, inactive, resigned, terminated
  
  // معلومات الراتب
  baseSalary: decimal("base_salary", { precision: 10, scale: 2 }).notNull(), // الراتب الأساسي
  allowances: decimal("allowances", { precision: 10, scale: 2 }).default("0"), // البدلات
  
  // معلومات البنك
  bankName: varchar("bank_name", { length: 255 }),
  bankAccountNumber: varchar("bank_account_number", { length: 100 }),
  
  // معلومات إضافية
  nationalId: varchar("national_id", { length: 50 }), // الرقم القومي
  taxNumber: varchar("tax_number", { length: 50 }), // الرقم الضريبي
  socialInsuranceNumber: varchar("social_insurance_number", { length: 50 }), // رقم التأمينات
  
  notes: text("notes"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertEmployeeSchema = createInsertSchema(employees, {
  employeeNumber: z.string().min(1, "رقم الموظف مطلوب"),
  employeeName: z.string().min(1, "اسم الموظف مطلوب"),
  position: z.string().min(1, "الوظيفة مطلوبة"),
  department: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email("البريد الإلكتروني غير صحيح").optional().or(z.literal("")),
  address: z.string().optional(),
  hireDate: z.date(),
  contractType: z.enum(["full_time", "part_time", "contract"]).default("full_time"),
  status: z.enum(["active", "inactive", "resigned", "terminated"]).default("active"),
  baseSalary: z.string().min(1, "الراتب الأساسي مطلوب"),
  allowances: z.string().optional(),
  bankName: z.string().optional(),
  bankAccountNumber: z.string().optional(),
  nationalId: z.string().optional(),
  taxNumber: z.string().optional(),
  socialInsuranceNumber: z.string().optional(),
  notes: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectEmployeeSchema = createSelectSchema(employees);

export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employees.$inferSelect;

// Vouchers - السندات (القبض والصرف)
export const vouchers = pgTable("vouchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voucherNumber: varchar("voucher_number", { length: 50 }).notNull().unique(), // رقم السند
  voucherDate: timestamp("voucher_date").notNull().defaultNow(), // تاريخ السند
  voucherType: varchar("voucher_type", { length: 20 }).notNull(), // receipt (قبض), payment (صرف)
  
  // بيانات الجهة
  relatedType: varchar("related_type", { length: 50 }), // supplier, customer, employee, other
  relatedId: varchar("related_id", { length: 255 }), // معرف الجهة
  relatedName: varchar("related_name", { length: 255 }).notNull(), // اسم الجهة (يتم حفظه للتوثيق)
  
  // المبلغ
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(), // المبلغ
  amountInWords: text("amount_in_words"), // المبلغ بالحروف
  
  // طريقة الدفع
  paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // cash, bank_transfer, check
  checkNumber: varchar("check_number", { length: 100 }), // رقم الشيك
  checkDate: timestamp("check_date"), // تاريخ الشيك
  bankName: varchar("bank_name", { length: 255 }), // اسم البنك
  
  // البيان والملاحظات
  description: text("description").notNull(), // البيان
  notes: text("notes"), // ملاحظات
  
  // الربط بمعاملة مالية
  transactionId: varchar("transaction_id", { length: 255 }), // ربط بمعاملة مالية
  
  // التتبع والاعتماد
  createdBy: varchar("created_by", { length: 255 }), // المستخدم المُدخل
  approvedBy: varchar("approved_by", { length: 255 }), // المعتمد
  approvedAt: timestamp("approved_at"), // تاريخ الاعتماد
  status: varchar("status", { length: 20 }).notNull().default("approved"), // draft, approved, cancelled
  
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertVoucherSchema = createInsertSchema(vouchers, {
  voucherNumber: z.string().min(1, "رقم السند مطلوب"),
  voucherDate: z.date().optional(),
  voucherType: z.enum(["receipt", "payment"], {
    errorMap: () => ({ message: "نوع السند غير صحيح" })
  }),
  relatedType: z.enum(["supplier", "customer", "employee", "other"]).optional(),
  relatedId: z.string().optional(),
  relatedName: z.string().min(1, "اسم الجهة مطلوب"),
  amount: z.string().min(1, "المبلغ مطلوب"),
  amountInWords: z.string().optional(),
  paymentMethod: z.enum(["cash", "bank_transfer", "check"]),
  checkNumber: z.string().optional(),
  checkDate: z.date().optional(),
  bankName: z.string().optional(),
  description: z.string().min(1, "البيان مطلوب"),
  notes: z.string().optional(),
  transactionId: z.string().optional(),
  createdBy: z.string().optional(),
  approvedBy: z.string().optional(),
  approvedAt: z.date().optional(),
  status: z.enum(["draft", "approved", "cancelled"]).default("approved"),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const selectVoucherSchema = createSelectSchema(vouchers);

export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type Voucher = typeof vouchers.$inferSelect;
