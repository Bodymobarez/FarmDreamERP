import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
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
  batchId: varchar("batch_id", { length: 255 }),
  receptionId: varchar("reception_id", { length: 255 }),
  purchaseCost: decimal("purchase_cost", { precision: 10, scale: 2 }),
  accumulatedFeedCost: decimal("accumulated_feed_cost", { precision: 10, scale: 2 }).default(sql`0`),
  accumulatedTreatmentCost: decimal("accumulated_treatment_cost", { precision: 10, scale: 2 }).default(sql`0`),
  accumulatedOtherCost: decimal("accumulated_other_cost", { precision: 10, scale: 2 }).default(sql`0`),
  totalCost: decimal("total_cost", { precision: 10, scale: 2 }).default(sql`0`),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  saleId: varchar("sale_id", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAnimalSchema = createInsertSchema(animals, {
  earTag: z.string().min(1, "رقم الأذن مطلوب"),
  animalType: z.string().min(1, "نوع الحيوان مطلوب"),
  sex: z.enum(["ذكر", "أنثى"], { errorMap: () => ({ message: "الجنس يجب أن يكون ذكر أو أنثى" }) }),
  entryWeight: z.string().min(1, "وزن الدخول مطلوب"),
  currentWeight: z.string().optional(),
  penNumber: z.string().optional(),
  batchNumber: z.string().optional(),
  batchId: z.string().optional(),
  receptionId: z.string().optional(),
  purchaseCost: z.string().optional(),
  status: z.enum(["active", "sold", "deceased"]).default("active"),
  notes: z.string().optional(),
}).omit({
  id: true,
  entryDate: true,
  createdAt: true,
  updatedAt: true,
  accumulatedFeedCost: true,
  accumulatedTreatmentCost: true,
  accumulatedOtherCost: true,
  totalCost: true,
  saleId: true,
});

export type InsertAnimal = z.infer<typeof insertAnimalSchema>;
export type Animal = typeof animals.$inferSelect;

// Batches table (مراكز التكلفة)
export const batches = pgTable("batches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchNumber: varchar("batch_number", { length: 50 }).notNull().unique(),
  batchName: varchar("batch_name", { length: 100 }).notNull(),
  capacity: integer("capacity").notNull(),
  batchType: varchar("batch_type", { length: 50 }).notNull().default("open"),
  status: varchar("status", { length: 50 }).notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBatchSchema = createInsertSchema(batches).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBatch = z.infer<typeof insertBatchSchema>;
export type Batch = typeof batches.$inferSelect;

// Suppliers table
export const suppliers = pgTable("suppliers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  supplierNumber: varchar("supplier_number", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  email: varchar("email", { length: 100 }),
  taxNumber: varchar("tax_number", { length: 50 }),
  bankAccount: varchar("bank_account", { length: 50 }),
  creditLimit: decimal("credit_limit", { precision: 15, scale: 2 }).default("0"),
  currentBalance: decimal("current_balance", { precision: 15, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertSupplierSchema = createInsertSchema(suppliers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertSupplier = z.infer<typeof insertSupplierSchema>;
export type Supplier = typeof suppliers.$inferSelect;

// Customers table
export const customers = pgTable("customers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerNumber: varchar("customer_number", { length: 50 }).notNull().unique(),
  name: varchar("name", { length: 100 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  address: text("address"),
  email: varchar("email", { length: 100 }),
  taxNumber: varchar("tax_number", { length: 50 }),
  creditLimit: decimal("credit_limit", { precision: 15, scale: 2 }).default("0"),
  currentBalance: decimal("current_balance", { precision: 15, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertCustomerSchema = createInsertSchema(customers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type Customer = typeof customers.$inferSelect;

// Receptions table
export const receptions = pgTable("receptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  receptionNumber: varchar("reception_number", { length: 50 }).notNull().unique(),
  receptionDate: timestamp("reception_date").notNull().defaultNow(),
  supplierId: varchar("supplier_id", { length: 255 }).notNull(),
  totalAnimals: integer("total_animals").notNull(),
  totalWeight: decimal("total_weight", { precision: 10, scale: 2 }).notNull(),
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull().default("cash"),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertReceptionSchema = createInsertSchema(receptions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertReception = z.infer<typeof insertReceptionSchema>;
export type Reception = typeof receptions.$inferSelect;

// Barns table
export const barns = pgTable("barns", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  barnNumber: varchar("barn_number", { length: 50 }).notNull().unique(),
  barnName: varchar("barn_name", { length: 100 }).notNull(),
  capacity: integer("capacity").notNull().default(50),
  currentOccupancy: integer("current_occupancy").notNull().default(0),
  barnType: varchar("barn_type", { length: 50 }).notNull().default("fattening"),
  location: varchar("location", { length: 100 }),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBarnSchema = createInsertSchema(barns).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBarn = z.infer<typeof insertBarnSchema>;
export type Barn = typeof barns.$inferSelect;

// Transactions table
export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionNumber: varchar("transaction_number", { length: 50 }).notNull().unique(),
  transactionDate: timestamp("transaction_date").notNull().defaultNow(),
  transactionType: varchar("transaction_type", { length: 50 }).notNull(),
  relatedId: varchar("related_id", { length: 255 }),
  relatedType: varchar("related_type", { length: 50 }),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

// Performance Goals table (مؤشرات الأداء)
export const performanceGoals = pgTable("performance_goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  goalName: varchar("goal_name", { length: 100 }).notNull(),
  targetValue: decimal("target_value", { precision: 10, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).default("0"),
  unit: varchar("unit", { length: 50 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  targetDate: timestamp("target_date"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertPerformanceGoalSchema = createInsertSchema(performanceGoals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPerformanceGoal = z.infer<typeof insertPerformanceGoalSchema>;
export type PerformanceGoal = typeof performanceGoals.$inferSelect;

// Accounting Entries table (القيود المحاسبية)
export const accountingEntries = pgTable("accounting_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  entryNumber: varchar("entry_number", { length: 50 }).notNull().unique(),
  entryDate: timestamp("entry_date").notNull().defaultNow(),
  accountCode: varchar("account_code", { length: 50 }).notNull(),
  accountName: varchar("account_name", { length: 100 }).notNull(),
  debitAmount: decimal("debit_amount", { precision: 15, scale: 2 }).default("0"),
  creditAmount: decimal("credit_amount", { precision: 15, scale: 2 }).default("0"),
  description: text("description"),
  referenceType: varchar("reference_type", { length: 50 }),
  referenceId: varchar("reference_id", { length: 255 }),
  status: varchar("status", { length: 20 }).notNull().default("approved"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAccountingEntrySchema = createInsertSchema(accountingEntries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAccountingEntry = z.infer<typeof insertAccountingEntrySchema>;
export type AccountingEntry = typeof accountingEntries.$inferSelect;

// Vouchers table (السندات)
export const vouchers = pgTable("vouchers", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  voucherNumber: varchar("voucher_number", { length: 50 }).notNull().unique(),
  voucherDate: timestamp("voucher_date").notNull().defaultNow(),
  voucherType: varchar("voucher_type", { length: 20 }).notNull(),
  relatedType: varchar("related_type", { length: 50 }),
  relatedId: varchar("related_id", { length: 255 }),
  receivedFrom: varchar("received_from", { length: 100 }),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  amountInWords: text("amount_in_words"),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull().default("cash"),
  description: text("description"),
  status: varchar("status", { length: 20 }).notNull().default("approved"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVoucherSchema = createInsertSchema(vouchers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVoucher = z.infer<typeof insertVoucherSchema>;
export type Voucher = typeof vouchers.$inferSelect;

// Additional tables for completeness
export const batchExpenses = pgTable("batch_expenses", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  batchId: varchar("batch_id", { length: 255 }).notNull(),
  expenseType: varchar("expense_type", { length: 50 }).notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  description: text("description"),
  expenseDate: timestamp("expense_date").notNull().defaultNow(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertBatchExpenseSchema = createInsertSchema(batchExpenses).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertBatchExpense = z.infer<typeof insertBatchExpenseSchema>;
export type BatchExpense = typeof batchExpenses.$inferSelect;

export const animalSales = pgTable("animal_sales", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  saleNumber: varchar("sale_number", { length: 50 }).notNull().unique(),
  saleDate: timestamp("sale_date").notNull().defaultNow(),
  customerId: varchar("customer_id", { length: 255 }).notNull(),
  animalId: varchar("animal_id", { length: 255 }).notNull(),
  saleWeight: decimal("sale_weight", { precision: 10, scale: 2 }).notNull(),
  pricePerKg: decimal("price_per_kg", { precision: 10, scale: 2 }).notNull(),
  totalAmount: decimal("total_amount", { precision: 15, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }).notNull().default("cash"),
  status: varchar("status", { length: 20 }).notNull().default("completed"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertAnimalSaleSchema = createInsertSchema(animalSales).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertAnimalSale = z.infer<typeof insertAnimalSaleSchema>;
export type AnimalSale = typeof animalSales.$inferSelect;

export const inventoryItems = pgTable("inventory_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  itemCode: varchar("item_code", { length: 50 }).notNull().unique(),
  itemName: varchar("item_name", { length: 100 }).notNull(),
  category: varchar("category", { length: 50 }).notNull(),
  unit: varchar("unit", { length: 20 }).notNull(),
  currentStock: decimal("current_stock", { precision: 10, scale: 2 }).default("0"),
  minimumStock: decimal("minimum_stock", { precision: 10, scale: 2 }).default("0"),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  totalValue: decimal("total_value", { precision: 15, scale: 2 }).default("0"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInventoryItemSchema = createInsertSchema(inventoryItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertInventoryItem = z.infer<typeof insertInventoryItemSchema>;
export type InventoryItem = typeof inventoryItems.$inferSelect;

export const inventoryTransactions = pgTable("inventory_transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  transactionNumber: varchar("transaction_number", { length: 50 }).notNull().unique(),
  transactionDate: timestamp("transaction_date").notNull().defaultNow(),
  itemId: varchar("item_id", { length: 255 }).notNull(),
  transactionType: varchar("transaction_type", { length: 20 }).notNull(),
  quantity: decimal("quantity", { precision: 10, scale: 2 }).notNull(),
  unitCost: decimal("unit_cost", { precision: 10, scale: 2 }),
  totalCost: decimal("total_cost", { precision: 15, scale: 2 }),
  referenceType: varchar("reference_type", { length: 50 }),
  referenceId: varchar("reference_id", { length: 255 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertInventoryTransactionSchema = createInsertSchema(inventoryTransactions).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertInventoryTransaction = z.infer<typeof insertInventoryTransactionSchema>;
export type InventoryTransaction = typeof inventoryTransactions.$inferSelect;

export const veterinaryTreatments = pgTable("veterinary_treatments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  animalId: varchar("animal_id", { length: 255 }).notNull(),
  veterinarian: varchar("veterinarian", { length: 100 }).notNull(),
  treatmentDate: timestamp("treatment_date").notNull().defaultNow(),
  treatmentType: varchar("treatment_type", { length: 50 }).notNull(),
  medication: text("medication"),
  dosage: varchar("dosage", { length: 100 }),
  diagnosis: text("diagnosis"),
  treatment: text("treatment"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  status: varchar("status", { length: 20 }).notNull().default("ongoing"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertVeterinaryTreatmentSchema = createInsertSchema(veterinaryTreatments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertVeterinaryTreatment = z.infer<typeof insertVeterinaryTreatmentSchema>;
export type VeterinaryTreatment = typeof veterinaryTreatments.$inferSelect;

// Goals table
export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  goalName: varchar("goal_name", { length: 255 }).notNull(),
  goalType: varchar("goal_type", { length: 50 }).notNull(),
  targetValue: decimal("target_value", { precision: 10, scale: 2 }).notNull(),
  currentValue: decimal("current_value", { precision: 10, scale: 2 }).default(sql`0`),
  unit: varchar("unit", { length: 50 }),
  batchId: varchar("batch_id", { length: 255 }),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  status: varchar("status", { length: 20 }).notNull().default("active"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;