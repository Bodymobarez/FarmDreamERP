import { type User, type InsertUser, type Animal, type InsertAnimal, type Reception, type InsertReception, type Supplier, type InsertSupplier, type Customer, type InsertCustomer, type Transaction, type InsertTransaction, type Batch, type InsertBatch, type BatchExpense, type InsertBatchExpense, type AnimalSale, type InsertAnimalSale, type PerformanceGoal, type InsertPerformanceGoal, type InventoryItem, type InsertInventoryItem, type InventoryTransaction, type InsertInventoryTransaction, type VeterinaryTreatment, type InsertVeterinaryTreatment, type Voucher, type InsertVoucher, type AccountingEntry, type InsertAccountingEntry, type Goal, type InsertGoal, type Barn, type InsertBarn } from "../shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db.js";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  // Bulk/Upsert helpers (by natural unique keys)
  getAnimalByEarTag(earTag: string): Promise<Animal | undefined>;
  upsertAnimalByEarTag(data: InsertAnimal): Promise<{ action: "insert" | "update"; record: Animal }>;
  getSupplierByNumber(supplierNumber: string): Promise<Supplier | undefined>;
  upsertSupplierByNumber(data: InsertSupplier): Promise<{ action: "insert" | "update"; record: Supplier }>;
  getCustomerByNumber(customerNumber: string): Promise<Customer | undefined>;
  upsertCustomerByNumber(data: InsertCustomer): Promise<{ action: "insert" | "update"; record: Customer }>;
  getInventoryItemByCode(itemCode: string): Promise<InventoryItem | undefined>;
  upsertInventoryItemByCode(data: InsertInventoryItem): Promise<{ action: "insert" | "update"; record: InventoryItem }>;
  getTransactionByNumber(transactionNumber: string): Promise<Transaction | undefined>;
  upsertTransactionByNumber(data: InsertTransaction): Promise<{ action: "insert" | "update"; record: Transaction }>;
  getBatchByNumber(batchNumber: string): Promise<Batch | undefined>;
  upsertBatchByNumber(data: InsertBatch): Promise<{ action: "insert" | "update"; record: Batch }>;
  getReceptionByNumber(receptionNumber: string): Promise<Reception | undefined>;
  upsertReceptionByNumber(data: InsertReception): Promise<{ action: "insert" | "update"; record: Reception }>;
  getBarnByNumber(barnNumber: string): Promise<Barn | undefined>;
  upsertBarnByNumber(data: InsertBarn): Promise<{ action: "insert" | "update"; record: Barn }>;
  
  // Animals methods
  getAnimals(): Promise<Animal[]>;
  getAnimalById(id: string): Promise<Animal | undefined>;
  insertAnimal(animal: InsertAnimal): Promise<Animal>;
  updateAnimal(id: string, animal: Partial<InsertAnimal>): Promise<Animal | undefined>;
  deleteAnimal(id: string): Promise<void>;
  
  // Receptions methods
  getReceptions(): Promise<Reception[]>;
  getReceptionById(id: string): Promise<Reception | undefined>;
  insertReception(reception: InsertReception): Promise<Reception>;
  updateReception(id: string, reception: Partial<InsertReception>): Promise<Reception | undefined>;
  deleteReception(id: string): Promise<void>;
  
  // Suppliers methods
  getSuppliers(): Promise<Supplier[]>;
  getSupplierById(id: string): Promise<Supplier | undefined>;
  insertSupplier(supplier: InsertSupplier): Promise<Supplier>;
  updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined>;
  deleteSupplier(id: string): Promise<void>;
  
  // Customers methods
  getCustomers(): Promise<Customer[]>;
  getCustomerById(id: string): Promise<Customer | undefined>;
  insertCustomer(customer: InsertCustomer): Promise<Customer>;
  updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined>;
  deleteCustomer(id: string): Promise<void>;
  
  // Transactions methods
  getTransactions(): Promise<Transaction[]>;
  getTransactionById(id: string): Promise<Transaction | undefined>;
  insertTransaction(transaction: InsertTransaction): Promise<Transaction>;
  updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined>;
  deleteTransaction(id: string): Promise<void>;
  
  // Batches (Cost Centers) methods
  getBatches(): Promise<Batch[]>;
  getBatchById(id: string): Promise<Batch | undefined>;
  insertBatch(batch: InsertBatch): Promise<Batch>;
  updateBatch(id: string, batch: Partial<InsertBatch>): Promise<Batch | undefined>;
  deleteBatch(id: string): Promise<void>;
  
  // Batch Expenses methods
  getBatchExpenses(batchId?: string): Promise<BatchExpense[]>;
  getBatchExpenseById(id: string): Promise<BatchExpense | undefined>;
  insertBatchExpense(batchExpense: InsertBatchExpense): Promise<BatchExpense>;
  updateBatchExpense(id: string, batchExpense: Partial<InsertBatchExpense>): Promise<BatchExpense | undefined>;
  deleteBatchExpense(id: string): Promise<void>;
  
  // Animal Sales methods
  getAnimalSales(batchId?: string): Promise<AnimalSale[]>;
  getAnimalSaleById(id: string): Promise<AnimalSale | undefined>;
  insertAnimalSale(animalSale: InsertAnimalSale): Promise<AnimalSale>;
  updateAnimalSale(id: string, animalSale: Partial<InsertAnimalSale>): Promise<AnimalSale | undefined>;
  deleteAnimalSale(id: string): Promise<void>;
  
  // Performance Goals methods
  getPerformanceGoals(): Promise<PerformanceGoal[]>;
  getPerformanceGoalById(id: string): Promise<PerformanceGoal | undefined>;
  insertPerformanceGoal(goal: InsertPerformanceGoal): Promise<PerformanceGoal>;
  updatePerformanceGoal(id: string, goal: Partial<InsertPerformanceGoal>): Promise<PerformanceGoal | undefined>;
  deletePerformanceGoal(id: string): Promise<void>;
  
  // Inventory methods
  getInventory(): Promise<InventoryItem[]>;
  getInventoryItemById(id: string): Promise<InventoryItem | undefined>;
  insertInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: string): Promise<void>;
  
  // Inventory Transactions methods
  getInventoryTransactions(): Promise<InventoryTransaction[]>;
  getInventoryTransactionById(id: string): Promise<InventoryTransaction | undefined>;
  insertInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;
  updateInventoryTransaction(id: string, transaction: Partial<InsertInventoryTransaction>): Promise<InventoryTransaction | undefined>;
  deleteInventoryTransaction(id: string): Promise<void>;
  
  // Veterinary Treatments methods
  getTreatments(): Promise<VeterinaryTreatment[]>;
  getTreatmentById(id: string): Promise<VeterinaryTreatment | undefined>;
  insertTreatment(treatment: InsertVeterinaryTreatment): Promise<VeterinaryTreatment>;
  updateTreatment(id: string, treatment: Partial<InsertVeterinaryTreatment>): Promise<VeterinaryTreatment | undefined>;
  deleteTreatment(id: string): Promise<void>;
  
  // Vouchers methods
  getVouchers(): Promise<Voucher[]>;
  getVoucherById(id: string): Promise<Voucher | undefined>;
  insertVoucher(voucher: InsertVoucher): Promise<Voucher>;
  updateVoucher(id: string, voucher: Partial<InsertVoucher>): Promise<Voucher | undefined>;
  deleteVoucher(id: string): Promise<void>;
  
  // Accounting Entries methods
  getAccountingEntries(): Promise<AccountingEntry[]>;
  getAccountingEntryById(id: string): Promise<AccountingEntry | undefined>;
  insertAccountingEntry(entry: InsertAccountingEntry): Promise<AccountingEntry>;
  updateAccountingEntry(id: string, entry: Partial<InsertAccountingEntry>): Promise<AccountingEntry | undefined>;
  deleteAccountingEntry(id: string): Promise<void>;
  
  // Financial Reports methods
  getTrialBalance(): Promise<any[]>;
  getProfitLossReport(startDate: Date, endDate: Date): Promise<any>;
  getBalanceSheet(date: Date): Promise<any>;
  getCashFlowReport(startDate: Date, endDate: Date): Promise<any>;
  
  // Barns methods
  getBarns(): Promise<Barn[]>;
  getBarnById(id: string): Promise<Barn | undefined>;
  insertBarn(barn: InsertBarn): Promise<Barn>;
  updateBarn(id: string, barn: Partial<InsertBarn>): Promise<Barn | undefined>;
  deleteBarn(id: string): Promise<void>;

  // Goals methods
  getGoals(): Promise<Goal[]>;
  getGoalById(id: string): Promise<Goal | undefined>;
  insertGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<void>;

  // Utilities
  clearAllData(): Promise<void>;
}

export class InMemoryStorage implements IStorage {
  private users = new Map<string, User>();
  private animals = new Map<string, Animal>();
  private receptions = new Map<string, Reception>();
  private suppliers = new Map<string, Supplier>();
  private customers = new Map<string, Customer>();
  private transactions = new Map<string, Transaction>();
  private batches = new Map<string, Batch>();
  private batchExpenses = new Map<string, BatchExpense>();
  private animalSales = new Map<string, AnimalSale>();
  private performanceGoals = new Map<string, PerformanceGoal>();
  private inventory = new Map<string, InventoryItem>();
  private inventoryTransactions = new Map<string, InventoryTransaction>();
  private veterinaryTreatments = new Map<string, VeterinaryTreatment>();
  private vouchers = new Map<string, Voucher>();
  private barns = new Map<string, Barn>();
  private goals = new Map<string, Goal>();
  private accounting = new Map<string, AccountingEntry>();

  constructor() {
    // Initialize with some mock data
    this.initializeMockData();
  }
  // Upsert helpers - InMemory implementation
  async getAnimalByEarTag(earTag: string): Promise<Animal | undefined> {
    return Array.from(this.animals.values()).find(a => a.earTag === earTag);
  }
  async upsertAnimalByEarTag(data: InsertAnimal) {
    const existing = await this.getAnimalByEarTag(data.earTag);
    if (existing) {
      const updated = { ...existing, ...data, updatedAt: new Date() } as Animal;
      this.animals.set(updated.id, updated);
      return { action: "update" as const, record: updated };
    }
    const inserted = await this.insertAnimal(data);
    return { action: "insert" as const, record: inserted };
  }
  async getSupplierByNumber(supplierNumber: string): Promise<Supplier | undefined> {
    return Array.from(this.suppliers.values()).find(s => s.supplierNumber === supplierNumber);
  }
  async upsertSupplierByNumber(data: InsertSupplier) {
    const existing = await this.getSupplierByNumber(data.supplierNumber);
    if (existing) {
      const updated = { ...existing, ...data, updatedAt: new Date() } as Supplier;
      this.suppliers.set(updated.id, updated);
      return { action: "update" as const, record: updated };
    }
    const inserted = await this.insertSupplier(data);
    return { action: "insert" as const, record: inserted };
  }
  async getCustomerByNumber(customerNumber: string): Promise<Customer | undefined> {
    return Array.from(this.customers.values()).find(c => c.customerNumber === customerNumber);
  }
  async upsertCustomerByNumber(data: InsertCustomer) {
    const existing = await this.getCustomerByNumber(data.customerNumber);
    if (existing) {
      const updated = { ...existing, ...data, updatedAt: new Date() } as Customer;
      this.customers.set(updated.id, updated);
      return { action: "update" as const, record: updated };
    }
    const inserted = await this.insertCustomer(data);
    return { action: "insert" as const, record: inserted };
  }
  async getInventoryItemByCode(itemCode: string): Promise<InventoryItem | undefined> {
    return Array.from(this.inventory.values()).find(i => i.itemCode === itemCode);
  }
  async upsertInventoryItemByCode(data: InsertInventoryItem) {
    const existing = await this.getInventoryItemByCode(data.itemCode);
    if (existing) {
      const updated = { ...existing, ...data, updatedAt: new Date() } as InventoryItem;
      this.inventory.set(updated.id, updated);
      return { action: "update" as const, record: updated };
    }
    const inserted = await this.insertInventoryItem(data);
    return { action: "insert" as const, record: inserted };
  }
  async getTransactionByNumber(transactionNumber: string): Promise<Transaction | undefined> {
    return Array.from(this.transactions.values()).find(t => t.transactionNumber === transactionNumber);
  }
  async upsertTransactionByNumber(data: InsertTransaction) {
    const existing = await this.getTransactionByNumber(data.transactionNumber);
    if (existing) {
      const updated = { ...existing, ...data, updatedAt: new Date() } as Transaction;
      this.transactions.set(updated.id, updated);
      return { action: "update" as const, record: updated };
    }
    const inserted = await this.insertTransaction(data);
    return { action: "insert" as const, record: inserted };
  }
  async getBatchByNumber(batchNumber: string): Promise<Batch | undefined> {
    return Array.from(this.batches.values()).find(b => b.batchNumber === batchNumber);
  }
  async upsertBatchByNumber(data: InsertBatch) {
    const existing = await this.getBatchByNumber(data.batchNumber);
    if (existing) {
      const updated = { ...existing, ...data, updatedAt: new Date() } as Batch;
      this.batches.set(updated.id, updated);
      return { action: "update" as const, record: updated };
    }
    const inserted = await this.insertBatch(data);
    return { action: "insert" as const, record: inserted };
  }
  async getReceptionByNumber(receptionNumber: string): Promise<Reception | undefined> {
    return Array.from(this.receptions.values()).find(r => r.receptionNumber === receptionNumber);
  }
  async upsertReceptionByNumber(data: InsertReception) {
    const existing = await this.getReceptionByNumber(data.receptionNumber);
    if (existing) {
      const updated = { ...existing, ...data, updatedAt: new Date() } as Reception;
      this.receptions.set(updated.id, updated);
      return { action: "update" as const, record: updated };
    }
    const inserted = await this.insertReception(data);
    return { action: "insert" as const, record: inserted };
  }
  async getBarnByNumber(barnNumber: string): Promise<Barn | undefined> {
    return Array.from(this.barns.values()).find((b) => b.barnNumber === barnNumber);
  }
  async upsertBarnByNumber(data: InsertBarn) {
    const existing = await this.getBarnByNumber(data.barnNumber);
    if (existing) {
      const updated: Barn = { ...existing, ...data, updatedAt: new Date() } as Barn;
      this.barns.set(updated.id, updated);
      return { action: "update" as const, record: updated };
    }
    const inserted = await this.insertBarn(data);
    return { action: "insert" as const, record: inserted };
  }

  private initializeMockData() {
    // Add mock user
    const mockUser: User = {
      id: "1",
      username: "admin",
      password: "admin123",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.users.set(mockUser.id, mockUser);

    // Add minimal mock batches per current schema
    const batch1: Batch = {
      id: "batch-1",
      batchNumber: "B-2025-001",
      batchName: "دفعة يناير 2025",
      capacity: 50,
      batchType: "open",
      status: "active",
      notes: "دفعة تسمين - يناير 2025",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    const batch2: Batch = {
      id: "batch-2",
      batchNumber: "B-2024-012",
      batchName: "دفعة ديسمبر 2024",
      capacity: 40,
      batchType: "open",
      status: "active",
      notes: "دفعة قيد التشغيل",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.batches.set(batch1.id, batch1);
    this.batches.set(batch2.id, batch2);

    // Add minimal mock data for other entities
    const animals: Animal[] = [];
    animals.forEach(animal => {
      this.animals.set(animal.id, animal);
    });

    // Add mock suppliers
    const suppliers: Supplier[] = [];
    suppliers.forEach(supplier => {
      this.suppliers.set(supplier.id, supplier);
    });

    // Add mock customers
    const customers: Customer[] = [];
    customers.forEach(customer => {
      this.customers.set(customer.id, customer);
    });

    // Add inventory
    const inventory: InventoryItem[] = [];
    inventory.forEach(item => {
      this.inventory.set(item.id, item);
    });
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(user: InsertUser): Promise<User> {
    const id = randomUUID();
    const newUser: User = { ...user, id, createdAt: new Date(), updatedAt: new Date() } as User;
    this.users.set(id, newUser);
    return newUser;
  }

  // Batches methods
  async getBatches(): Promise<Batch[]> {
    return Array.from(this.batches.values());
  }

  async getBatchById(id: string): Promise<Batch | undefined> {
    return this.batches.get(id);
  }

  async insertBatch(batch: InsertBatch): Promise<Batch> {
    const id = randomUUID();
    const newBatch: Batch = { 
      ...batch,
      id,
      notes: batch.notes || null,
      batchType: batch.batchType || "open",
      status: batch.status || "active",
      capacity: typeof (batch as any).capacity === "number" ? (batch as any).capacity : 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Batch;
    this.batches.set(id, newBatch);
    return newBatch;
  }

  async updateBatch(id: string, batch: Partial<InsertBatch>): Promise<Batch | undefined> {
    const existing = this.batches.get(id);
    if (!existing) return undefined;
    
    const updated: Batch = { ...existing, ...batch, updatedAt: new Date() };
    this.batches.set(id, updated);
    return updated;
  }

  async deleteBatch(id: string): Promise<void> {
    this.batches.delete(id);
  }

  // Animals methods
  async getAnimals(): Promise<Animal[]> {
    return Array.from(this.animals.values());
  }

  async getAnimalById(id: string): Promise<Animal | undefined> {
    return this.animals.get(id);
  }

  async insertAnimal(animal: InsertAnimal): Promise<Animal> {
    const id = randomUUID();
    const newAnimal: Animal = { 
      ...animal, 
      id, 
      notes: animal.notes || null,
      batchNumber: animal.batchNumber || null,
      batchId: animal.batchId || null,
      penNumber: animal.penNumber || null,
      currentWeight: animal.currentWeight || null,
      purchaseCost: animal.purchaseCost || "0",
      accumulatedFeedCost: (animal as any).accumulatedFeedCost || "0",
      accumulatedTreatmentCost: (animal as any).accumulatedTreatmentCost || "0",
      accumulatedOtherCost: (animal as any).accumulatedOtherCost || "0",
      totalCost: (animal as any).totalCost || "0",
      receptionId: animal.receptionId || null,
      saleId: (animal as any).saleId || null,
      entryDate: (animal as any).entryDate || new Date(),
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.animals.set(id, newAnimal);
    return newAnimal;
  }

  async updateAnimal(id: string, animal: Partial<InsertAnimal>): Promise<Animal | undefined> {
    const existing = this.animals.get(id);
    if (!existing) return undefined;
    
    const updated: Animal = { ...existing, ...animal, updatedAt: new Date() };
    this.animals.set(id, updated);
    return updated;
  }

  async deleteAnimal(id: string): Promise<void> {
    this.animals.delete(id);
  }

  // Suppliers methods
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplierById(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async insertSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const currentBalanceVal = (supplier as any).currentBalance;
    const creditLimitVal = (supplier as any).creditLimit;
    const statusVal = (supplier as any).status;
    const bankAccountVal = (supplier as any).bankAccount;
    const newSupplier: Supplier = {
      id,
      supplierNumber: supplier.supplierNumber,
      name: supplier.name,
      phone: supplier.phone || null,
      address: supplier.address || null,
      email: supplier.email || null,
      taxNumber: supplier.taxNumber || null,
      bankAccount: typeof bankAccountVal === "string" ? bankAccountVal : null,
      creditLimit: typeof creditLimitVal === "string" ? creditLimitVal : "0",
      currentBalance: typeof currentBalanceVal === "string" ? currentBalanceVal : "0",
      status: typeof statusVal === "string" ? statusVal : "active",
      notes: supplier.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.suppliers.set(id, newSupplier);
    return newSupplier;
  }

  async updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const existing = this.suppliers.get(id);
    if (!existing) return undefined;
    
    const updated: Supplier = { ...existing, ...supplier, updatedAt: new Date() };
    this.suppliers.set(id, updated);
    return updated;
  }

  async deleteSupplier(id: string): Promise<void> {
    this.suppliers.delete(id);
  }

  // Customers methods
  async getCustomers(): Promise<Customer[]> {
    return Array.from(this.customers.values());
  }

  async getCustomerById(id: string): Promise<Customer | undefined> {
    return this.customers.get(id);
  }

  async insertCustomer(customer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const currentBalanceVal = (customer as any).currentBalance;
    const creditLimitVal = (customer as any).creditLimit;
    const statusVal = (customer as any).status;
    const newCustomer: Customer = {
      id,
      customerNumber: customer.customerNumber,
      name: customer.name,
      phone: customer.phone || null,
      address: customer.address || null,
      email: customer.email || null,
      taxNumber: customer.taxNumber || null,
      creditLimit: typeof creditLimitVal === "string" ? creditLimitVal : "0",
      currentBalance: typeof currentBalanceVal === "string" ? currentBalanceVal : "0",
      status: typeof statusVal === "string" ? statusVal : "active",
      notes: customer.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.customers.set(id, newCustomer);
    return newCustomer;
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const existing = this.customers.get(id);
    if (!existing) return undefined;
    
    const updated: Customer = { ...existing, ...customer, updatedAt: new Date() };
    this.customers.set(id, updated);
    return updated;
  }

  async deleteCustomer(id: string): Promise<void> {
    this.customers.delete(id);
  }

  // Transactions methods
  async getTransactions(): Promise<Transaction[]> {
    return Array.from(this.transactions.values());
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    return this.transactions.get(id);
  }

  async insertTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const newTransaction: Transaction = { 
      ...transaction, 
      id, 
      relatedType: transaction.relatedType || null,
      relatedId: transaction.relatedId || null,
      description: transaction.description || null,
      status: (transaction as any).status || "completed",
      transactionDate: transaction.transactionDate || new Date(),
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const existing = this.transactions.get(id);
    if (!existing) return undefined;
    
    const updated: Transaction = { ...existing, ...transaction, updatedAt: new Date() };
    this.transactions.set(id, updated);
    return updated;
  }

  async deleteTransaction(id: string): Promise<void> {
    this.transactions.delete(id);
  }

  // Inventory methods
  async getInventory(): Promise<InventoryItem[]> {
    return Array.from(this.inventory.values());
  }

  async getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
    return this.inventory.get(id);
  }

  async insertInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const id = randomUUID();
    const newItem: InventoryItem = {
      ...item,
      id,
      currentStock: item.currentStock || "0",
      minimumStock: (item as any).minimumStock || "0",
      totalValue: item.totalValue || "0",
      unitCost: item.unitCost || null,
      notes: (item as any).notes || null,
      status: (item as any).status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as InventoryItem;
    this.inventory.set(id, newItem);
    return newItem;
  }

  async updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const existing = this.inventory.get(id);
    if (!existing) return undefined;
    
    const updated: InventoryItem = { ...existing, ...item, updatedAt: new Date() };
    this.inventory.set(id, updated);
    return updated;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    this.inventory.delete(id);
  }

  // Receptions methods
  async getReceptions(): Promise<Reception[]> {
    return Array.from(this.receptions.values());
  }

  async getReceptionById(id: string): Promise<Reception | undefined> {
    return this.receptions.get(id);
  }

  async insertReception(reception: InsertReception): Promise<Reception> {
    const id = randomUUID();
    const paymentMethodVal = (reception as any).paymentMethod;
    const statusVal = (reception as any).status;
    const newReception: Reception = { 
      ...reception, 
      id, 
      notes: reception.notes || null,
      status: typeof statusVal === "string" ? statusVal : "completed",
      paymentMethod: typeof paymentMethodVal === "string" ? paymentMethodVal : "cash",
      receptionDate: reception.receptionDate || new Date(),
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
    this.receptions.set(id, newReception);
    return newReception;
  }

  async updateReception(id: string, reception: Partial<InsertReception>): Promise<Reception | undefined> {
    const existing = this.receptions.get(id);
    if (!existing) return undefined;
    
    const updated: Reception = { ...existing, ...reception, updatedAt: new Date() };
    this.receptions.set(id, updated);
    return updated;
  }

  async deleteReception(id: string): Promise<void> {
    this.receptions.delete(id);
  }

  // Batch Expenses methods
  async getBatchExpenses(batchId?: string): Promise<BatchExpense[]> {
    const allExpenses = Array.from(this.batchExpenses.values());
    return batchId ? allExpenses.filter(e => e.batchId === batchId) : allExpenses;
  }

  async getBatchExpenseById(id: string): Promise<BatchExpense | undefined> {
    return this.batchExpenses.get(id);
  }

  async insertBatchExpense(batchExpense: InsertBatchExpense): Promise<BatchExpense> {
    const id = randomUUID();
    const newExpense: BatchExpense = { 
      ...batchExpense,
      id,
      description: (batchExpense as any).description || null,
      expenseDate: batchExpense.expenseDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.batchExpenses.set(id, newExpense);
    return newExpense;
  }

  async updateBatchExpense(id: string, batchExpense: Partial<InsertBatchExpense>): Promise<BatchExpense | undefined> {
    const existing = this.batchExpenses.get(id);
    if (!existing) return undefined;
    
    const updated: BatchExpense = { ...existing, ...batchExpense, updatedAt: new Date() };
    this.batchExpenses.set(id, updated);
    return updated;
  }

  async deleteBatchExpense(id: string): Promise<void> {
    this.batchExpenses.delete(id);
  }

  // Animal Sales methods
  async getAnimalSales(batchId?: string): Promise<AnimalSale[]> {
    const allSales = Array.from(this.animalSales.values());
    // Current schema has no batchId on sales; return all for now
    return allSales;
  }

  async getAnimalSaleById(id: string): Promise<AnimalSale | undefined> {
    return this.animalSales.get(id);
  }

  async insertAnimalSale(animalSale: InsertAnimalSale): Promise<AnimalSale> {
    const id = randomUUID();
    const newSale: AnimalSale = { 
      ...animalSale,
      id,
      saleDate: animalSale.saleDate || new Date(),
      notes: (animalSale as any).notes || null,
      paymentMethod: (animalSale as any).paymentMethod || "cash",
      status: (animalSale as any).status || "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.animalSales.set(id, newSale);
    return newSale;
  }

  async updateAnimalSale(id: string, animalSale: Partial<InsertAnimalSale>): Promise<AnimalSale | undefined> {
    const existing = this.animalSales.get(id);
    if (!existing) return undefined;
    
    const updated: AnimalSale = { ...existing, ...animalSale, updatedAt: new Date() };
    this.animalSales.set(id, updated);
    return updated;
  }

  async deleteAnimalSale(id: string): Promise<void> {
    this.animalSales.delete(id);
  }

  // Performance Goals methods
  async getPerformanceGoals(): Promise<PerformanceGoal[]> {
    return Array.from(this.performanceGoals.values());
  }

  async getPerformanceGoalById(id: string): Promise<PerformanceGoal | undefined> {
    return this.performanceGoals.get(id);
  }

  async insertPerformanceGoal(goal: InsertPerformanceGoal): Promise<PerformanceGoal> {
    const id = randomUUID();
    const newGoal: PerformanceGoal = { 
      ...goal,
      id,
      targetDate: (goal as any).targetDate || null,
      description: (goal as any).description || null,
      currentValue: goal.currentValue || "0",
      status: (goal as any).status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.performanceGoals.set(id, newGoal);
    return newGoal;
  }

  async updatePerformanceGoal(id: string, goal: Partial<InsertPerformanceGoal>): Promise<PerformanceGoal | undefined> {
    const existing = this.performanceGoals.get(id);
    if (!existing) return undefined;
    
    const updated: PerformanceGoal = { ...existing, ...goal, updatedAt: new Date() };
    this.performanceGoals.set(id, updated);
    return updated;
  }

  async deletePerformanceGoal(id: string): Promise<void> {
    this.performanceGoals.delete(id);
  }

  // Inventory Transactions methods
  async getInventoryTransactions(): Promise<InventoryTransaction[]> {
    return Array.from(this.inventoryTransactions.values());
  }

  async getInventoryTransactionById(id: string): Promise<InventoryTransaction | undefined> {
    return this.inventoryTransactions.get(id);
  }

  async insertInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const id = randomUUID();
    const newTransaction: InventoryTransaction = {
      ...transaction,
      id,
      transactionDate: transaction.transactionDate || new Date(),
      unitCost: transaction.unitCost || null,
      totalCost: transaction.totalCost || null,
      referenceType: transaction.referenceType || null,
      referenceId: transaction.referenceId || null,
      notes: (transaction as any).notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as InventoryTransaction;
    this.inventoryTransactions.set(id, newTransaction);
    return newTransaction;
  }

  async updateInventoryTransaction(id: string, transaction: Partial<InsertInventoryTransaction>): Promise<InventoryTransaction | undefined> {
    const existing = this.inventoryTransactions.get(id);
    if (!existing) return undefined;
    
    const updated: InventoryTransaction = { ...existing, ...transaction };
    this.inventoryTransactions.set(id, updated);
    return updated;
  }

  async deleteInventoryTransaction(id: string): Promise<void> {
    this.inventoryTransactions.delete(id);
  }

  // Veterinary Treatments methods
  async getTreatments(): Promise<VeterinaryTreatment[]> {
    return Array.from(this.veterinaryTreatments.values());
  }

  async getTreatmentById(id: string): Promise<VeterinaryTreatment | undefined> {
    return this.veterinaryTreatments.get(id);
  }

  async insertTreatment(treatment: InsertVeterinaryTreatment): Promise<VeterinaryTreatment> {
    const id = randomUUID();
    const newTreatment: VeterinaryTreatment = {
      ...treatment,
      id,
      treatmentDate: treatment.treatmentDate || new Date(),
      medication: (treatment as any).medication || null,
      dosage: (treatment as any).dosage || null,
      diagnosis: (treatment as any).diagnosis || null,
      treatment: (treatment as any).treatment || null,
      cost: (treatment as any).cost || null,
      notes: (treatment as any).notes || null,
      status: (treatment as any).status || "ongoing",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as VeterinaryTreatment;
    this.veterinaryTreatments.set(id, newTreatment);
    return newTreatment;
  }

  async updateTreatment(id: string, treatment: Partial<InsertVeterinaryTreatment>): Promise<VeterinaryTreatment | undefined> {
    const existing = this.veterinaryTreatments.get(id);
    if (!existing) return undefined;
    
    const updated: VeterinaryTreatment = { ...existing, ...treatment, updatedAt: new Date() };
    this.veterinaryTreatments.set(id, updated);
    return updated;
  }

  async deleteTreatment(id: string): Promise<void> {
    this.veterinaryTreatments.delete(id);
  }

  // --- Compatibility methods used by routes (veterinary prefix) ---
  async getVeterinaryTreatments(animalId?: string): Promise<VeterinaryTreatment[]> {
    const all = await this.getTreatments();
    if (animalId) {
      return all.filter(t => (t as any).animalId === animalId);
    }
    return all;
  }

  async getVeterinaryTreatmentById(id: string): Promise<VeterinaryTreatment | undefined> {
    return this.getTreatmentById(id);
  }

  async insertVeterinaryTreatment(treatment: InsertVeterinaryTreatment): Promise<VeterinaryTreatment> {
    return this.insertTreatment(treatment);
  }

  async updateVeterinaryTreatment(id: string, treatment: Partial<InsertVeterinaryTreatment>): Promise<VeterinaryTreatment | undefined> {
    return this.updateTreatment(id, treatment);
  }

  async deleteVeterinaryTreatment(id: string): Promise<void> {
    return this.deleteTreatment(id);
  }

  // Vouchers methods
  async getVouchers(): Promise<Voucher[]> {
    return Array.from(this.vouchers.values());
  }

  async getVoucherById(id: string): Promise<Voucher | undefined> {
    return this.vouchers.get(id);
  }

  async insertVoucher(voucher: InsertVoucher): Promise<Voucher> {
    const id = randomUUID();
    const newVoucher: Voucher = {
      ...voucher,
      id,
      voucherDate: voucher.voucherDate || new Date(),
      amountInWords: voucher.amountInWords || null,
      relatedType: voucher.relatedType || null,
      relatedId: voucher.relatedId || null,
      description: (voucher as any).description || null,
      status: (voucher as any).status || "approved",
      paymentMethod: (voucher as any).paymentMethod || "cash",
      receivedFrom: (voucher as any).receivedFrom || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Voucher;
    this.vouchers.set(id, newVoucher);
    return newVoucher;
  }

  async updateVoucher(id: string, voucher: Partial<InsertVoucher>): Promise<Voucher | undefined> {
    const existing = this.vouchers.get(id);
    if (!existing) return undefined;
    
    const updated: Voucher = { ...existing, ...voucher, updatedAt: new Date() };
    this.vouchers.set(id, updated);
    return updated;
  }

  async deleteVoucher(id: string): Promise<void> {
    this.vouchers.delete(id);
  }

  // Goals methods
  async getGoals(): Promise<Goal[]> {
    return Array.from(this.goals.values());
  }

  async getGoalById(id: string): Promise<Goal | undefined> {
    return this.goals.get(id);
  }

  async insertGoal(goal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const newGoal: Goal = {
      ...goal,
      id,
      unit: goal.unit || null,
      batchId: goal.batchId || null,
      startDate: goal.startDate ? new Date(goal.startDate) : null,
      endDate: goal.endDate ? new Date(goal.endDate) : null,
      status: goal.status || "active",
      notes: goal.notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Goal;
    this.goals.set(id, newGoal);
    return newGoal;
  }

  async updateGoal(id: string, goal: Partial<InsertGoal>): Promise<Goal | undefined> {
    const existing = this.goals.get(id);
    if (!existing) return undefined;
    const updated: Goal = { ...existing, ...goal, updatedAt: new Date() } as Goal;
    this.goals.set(id, updated);
    return updated;
  }

  async deleteGoal(id: string): Promise<void> {
    this.goals.delete(id);
  }

  // Barns methods (in-memory)
  async getBarns(): Promise<Barn[]> {
    return Array.from(this.barns.values());
  }

  async getBarnById(id: string): Promise<Barn | undefined> {
    return this.barns.get(id);
  }

  async insertBarn(barn: InsertBarn): Promise<Barn> {
    const id = randomUUID();
    const newBarn: Barn = {
      ...barn,
      id,
      location: (barn as any).location || null,
      notes: (barn as any).notes || null,
      currentOccupancy: (barn as any).currentOccupancy ?? 0,
      status: (barn as any).status || "active",
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Barn;
    this.barns.set(id, newBarn);
    return newBarn;
  }

  async updateBarn(id: string, barn: Partial<InsertBarn>): Promise<Barn | undefined> {
    const existing = this.barns.get(id);
    if (!existing) return undefined;
    const updated: Barn = { ...existing, ...barn, updatedAt: new Date() } as Barn;
    this.barns.set(id, updated);
    return updated;
  }

  async deleteBarn(id: string): Promise<void> {
    this.barns.delete(id);
  }

  // Accounting entries (in-memory)
  async getAccountingEntries(): Promise<AccountingEntry[]> {
    return Array.from(this.accounting.values());
  }

  async getAccountingEntryById(id: string): Promise<AccountingEntry | undefined> {
    return this.accounting.get(id);
  }

  async insertAccountingEntry(entry: InsertAccountingEntry): Promise<AccountingEntry> {
    const id = randomUUID();
    const ensuredEntryNumber = (entry as any).entryNumber || `JE-${new Date().getFullYear()}-${String(this.accounting.size + 1).padStart(4, "0")}`;
    const record: AccountingEntry = {
      ...entry,
      id,
      entryNumber: ensuredEntryNumber,
      debitAmount: (entry as any).debitAmount || "0",
      creditAmount: (entry as any).creditAmount || "0",
      description: (entry as any).description || null,
      referenceType: (entry as any).referenceType || null,
      referenceId: (entry as any).referenceId || null,
      status: (entry as any).status || "approved",
      entryDate: entry.entryDate || new Date(),
      createdAt: new Date(),
      updatedAt: new Date(),
    } as AccountingEntry;
    this.accounting.set(id, record);
    return record;
  }

  async updateAccountingEntry(id: string, entry: Partial<InsertAccountingEntry>): Promise<AccountingEntry | undefined> {
    const existing = this.accounting.get(id);
    if (!existing) return undefined;
    const updated: AccountingEntry = { ...existing, ...entry, updatedAt: new Date() } as AccountingEntry;
    this.accounting.set(id, updated);
    return updated;
  }

  async deleteAccountingEntry(id: string): Promise<void> {
    this.accounting.delete(id);
  }

  async getTrialBalance(): Promise<any[]> {
    const accounts = new Map<string, any>();
    for (const entry of this.accounting.values()) {
      const key = `${entry.accountCode}-${entry.accountName}`;
      if (!accounts.has(key)) {
        accounts.set(key, {
          accountCode: entry.accountCode,
          accountName: entry.accountName,
          totalDebit: 0,
          totalCredit: 0,
          balance: 0,
        });
      }
      const acc = accounts.get(key);
      acc.totalDebit += parseFloat(entry.debitAmount || "0");
      acc.totalCredit += parseFloat(entry.creditAmount || "0");
      acc.balance = acc.totalDebit - acc.totalCredit;
    }
    return Array.from(accounts.values());
  }

  async getProfitLossReport(startDate: Date, endDate: Date): Promise<any> {
    const entries = Array.from(this.accounting.values()).filter(e => {
      const d = new Date(e.entryDate || new Date());
      return d >= startDate && d <= endDate;
    });
    let revenue = 0;
    let expenses = 0;
    for (const e of entries) {
      if (e.accountCode.startsWith("4")) {
        revenue += parseFloat(e.creditAmount || "0") - parseFloat(e.debitAmount || "0");
      } else if (e.accountCode.startsWith("5")) {
        expenses += parseFloat(e.debitAmount || "0") - parseFloat(e.creditAmount || "0");
      }
    }
    return {
      period: { startDate, endDate },
      revenue,
      expenses,
      profit: revenue - expenses,
      profitMargin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0,
    };
  }

  async getBalanceSheet(date: Date): Promise<any> {
    const entries = Array.from(this.accounting.values()).filter(e => new Date(e.entryDate || new Date()) <= date);
    let assets = 0;
    let liabilities = 0;
    let equity = 0;
    for (const e of entries) {
      const balance = parseFloat(e.debitAmount || "0") - parseFloat(e.creditAmount || "0");
      if (e.accountCode.startsWith("1")) assets += balance;
      else if (e.accountCode.startsWith("2")) liabilities += -balance;
      else if (e.accountCode.startsWith("3")) equity += -balance;
    }
    return { date, assets, liabilities, equity, totalLiabilitiesAndEquity: liabilities + equity };
  }

  async getCashFlowReport(startDate: Date, endDate: Date): Promise<any> {
    const entries = Array.from(this.accounting.values()).filter(e => {
      const d = new Date(e.entryDate || new Date());
      return d >= startDate && d <= endDate && e.accountCode === "1010";
    });
    let inflow = 0;
    let outflow = 0;
    for (const e of entries) {
      const debit = parseFloat(e.debitAmount || "0");
      const credit = parseFloat(e.creditAmount || "0");
      if (debit > credit) inflow += debit - credit; else outflow += credit - debit;
    }
    return { period: { startDate, endDate }, inflow, outflow, netFlow: inflow - outflow };
  }

  async clearAllData(): Promise<void> {
    this.users.clear();
    this.animals.clear();
    this.receptions.clear();
    this.suppliers.clear();
    this.customers.clear();
    this.transactions.clear();
    this.batches.clear();
    this.batchExpenses.clear();
    this.animalSales.clear();
    this.performanceGoals.clear();
    this.inventory.clear();
    this.inventoryTransactions.clear();
    this.veterinaryTreatments.clear();
    this.vouchers.clear();
    this.barns.clear();
    this.accounting.clear();
  }

}

// Database Storage Implementation using Drizzle ORM
import { users, animals, receptions, suppliers, customers, transactions, batches, batchExpenses, animalSales, performanceGoals, inventoryItems, inventoryTransactions, veterinaryTreatments, vouchers, accountingEntries, barns, goals } from "../shared/schema.js";
import { eq, and, gte, lte, desc, asc, sql } from "drizzle-orm";

export class DbStorage implements IStorage {
  private checkDatabase() {
    if (!db) {
      throw new Error("Database not initialized. Please set DATABASE_URL environment variable.");
    }
  }

  // Users methods
  async getUser(id: string): Promise<User | undefined> {
    this.checkDatabase();
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }
  // Upsert helpers - Database implementation
  async getAnimalByEarTag(earTag: string): Promise<Animal | undefined> {
    const result = await db.select().from(animals).where(eq(animals.earTag, earTag)).limit(1);
    return result[0];
  }
  async upsertAnimalByEarTag(data: InsertAnimal) {
    const existing = await this.getAnimalByEarTag(data.earTag);
    if (existing) {
      const updated = await this.updateAnimal(existing.id, data);
      return { action: "update" as const, record: updated! };
    }
    const inserted = await this.insertAnimal(data);
    return { action: "insert" as const, record: inserted };
  }

  async getSupplierByNumber(supplierNumber: string): Promise<Supplier | undefined> {
    const result = await db.select().from(suppliers).where(eq(suppliers.supplierNumber, supplierNumber)).limit(1);
    return result[0];
  }
  async upsertSupplierByNumber(data: InsertSupplier) {
    const existing = await this.getSupplierByNumber(data.supplierNumber);
    if (existing) {
      const updated = await this.updateSupplier(existing.id, data);
      return { action: "update" as const, record: updated! };
    }
    const inserted = await this.insertSupplier(data);
    return { action: "insert" as const, record: inserted };
  }

  async getCustomerByNumber(customerNumber: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.customerNumber, customerNumber)).limit(1);
    return result[0];
  }
  async upsertCustomerByNumber(data: InsertCustomer) {
    const existing = await this.getCustomerByNumber(data.customerNumber);
    if (existing) {
      const updated = await this.updateCustomer(existing.id, data);
      return { action: "update" as const, record: updated! };
    }
    const inserted = await this.insertCustomer(data);
    return { action: "insert" as const, record: inserted };
  }

  async getInventoryItemByCode(itemCode: string): Promise<InventoryItem | undefined> {
    const result = await db.select().from(inventoryItems).where(eq(inventoryItems.itemCode, itemCode)).limit(1);
    return result[0];
  }
  async upsertInventoryItemByCode(data: InsertInventoryItem) {
    const existing = await this.getInventoryItemByCode(data.itemCode);
    if (existing) {
      const updated = await this.updateInventoryItem(existing.id, data);
      return { action: "update" as const, record: updated! };
    }
    const inserted = await this.insertInventoryItem(data);
    return { action: "insert" as const, record: inserted };
  }

  async getTransactionByNumber(transactionNumber: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.transactionNumber, transactionNumber)).limit(1);
    return result[0];
  }
  async upsertTransactionByNumber(data: InsertTransaction) {
    const existing = await this.getTransactionByNumber(data.transactionNumber);
    if (existing) {
      const updated = await this.updateTransaction(existing.id, data);
      return { action: "update" as const, record: updated! };
    }
    const inserted = await this.insertTransaction(data);
    return { action: "insert" as const, record: inserted };
  }

  async getBatchByNumber(batchNumber: string): Promise<Batch | undefined> {
    const result = await db.select().from(batches).where(eq(batches.batchNumber, batchNumber)).limit(1);
    return result[0];
  }
  async upsertBatchByNumber(data: InsertBatch) {
    const existing = await this.getBatchByNumber(data.batchNumber);
    if (existing) {
      const updated = await this.updateBatch(existing.id, data);
      return { action: "update" as const, record: updated! };
    }
    const inserted = await this.insertBatch(data);
    return { action: "insert" as const, record: inserted };
  }

  async getReceptionByNumber(receptionNumber: string): Promise<Reception | undefined> {
    const result = await db.select().from(receptions).where(eq(receptions.receptionNumber, receptionNumber)).limit(1);
    return result[0];
  }
  async upsertReceptionByNumber(data: InsertReception) {
    const existing = await this.getReceptionByNumber(data.receptionNumber);
    if (existing) {
      const updated = await this.updateReception(existing.id, data);
      return { action: "update" as const, record: updated! };
    }
    const inserted = await this.insertReception(data);
    return { action: "insert" as const, record: inserted };
  }

  async getBarnByNumber(barnNumber: string): Promise<Barn | undefined> {
    const result = await db.select().from(barns).where(eq(barns.barnNumber, barnNumber)).limit(1);
    return result[0];
  }
  async upsertBarnByNumber(data: InsertBarn) {
    const existing = await this.getBarnByNumber(data.barnNumber);
    if (existing) {
      const updated = await this.updateBarn(existing.id, data);
      return { action: "update" as const, record: updated! };
    }
    const inserted = await this.insertBarn(data);
    return { action: "insert" as const, record: inserted };
  }

  async createUser(user: InsertUser): Promise<User> {
    const result = await db.insert(users).values(user).returning();
    return result[0];
  }

  // Animals methods
  async getAnimals(): Promise<Animal[]> {
    return await db.select().from(animals).orderBy(desc(animals.createdAt)).limit(1000);
  }

  async getAnimalById(id: string): Promise<Animal | undefined> {
    const result = await db.select().from(animals).where(eq(animals.id, id)).limit(1);
    return result[0];
  }

  async insertAnimal(animal: InsertAnimal): Promise<Animal> {
    const result = await db.insert(animals).values(animal).returning();
    return result[0];
  }

  async updateAnimal(id: string, animal: Partial<InsertAnimal>): Promise<Animal | undefined> {
    const result = await db.update(animals).set({ ...animal, updatedAt: new Date() }).where(eq(animals.id, id)).returning();
    return result[0];
  }

  async deleteAnimal(id: string): Promise<void> {
    await db.delete(animals).where(eq(animals.id, id));
  }

  // Receptions methods
  async getReceptions(): Promise<Reception[]> {
    return await db.select().from(receptions).orderBy(desc(receptions.createdAt)).limit(500);
  }

  async getReceptionById(id: string): Promise<Reception | undefined> {
    const result = await db.select().from(receptions).where(eq(receptions.id, id)).limit(1);
    return result[0];
  }

  async insertReception(reception: InsertReception): Promise<Reception> {
    const result = await db.insert(receptions).values(reception).returning();
    return result[0];
  }

  async updateReception(id: string, reception: Partial<InsertReception>): Promise<Reception | undefined> {
    const result = await db.update(receptions).set({ ...reception, updatedAt: new Date() }).where(eq(receptions.id, id)).returning();
    return result[0];
  }

  async deleteReception(id: string): Promise<void> {
    await db.delete(receptions).where(eq(receptions.id, id));
  }

  // Suppliers methods
  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(suppliers).orderBy(asc(suppliers.name)).limit(200);
  }

  async getSupplierById(id: string): Promise<Supplier | undefined> {
    const result = await db.select().from(suppliers).where(eq(suppliers.id, id)).limit(1);
    return result[0];
  }

  async insertSupplier(supplier: InsertSupplier): Promise<Supplier> {
    const result = await db.insert(suppliers).values(supplier).returning();
    return result[0];
  }

  async updateSupplier(id: string, supplier: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const result = await db.update(suppliers).set({ ...supplier, updatedAt: new Date() }).where(eq(suppliers.id, id)).returning();
    return result[0];
  }

  async deleteSupplier(id: string): Promise<void> {
    await db.delete(suppliers).where(eq(suppliers.id, id));
  }

  // Customers methods
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(customers).orderBy(asc(customers.name)).limit(200);
  }

  async getCustomerById(id: string): Promise<Customer | undefined> {
    const result = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
    return result[0];
  }

  async insertCustomer(customer: InsertCustomer): Promise<Customer> {
    const result = await db.insert(customers).values(customer).returning();
    return result[0];
  }

  async updateCustomer(id: string, customer: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const result = await db.update(customers).set({ ...customer, updatedAt: new Date() }).where(eq(customers.id, id)).returning();
    return result[0];
  }

  async deleteCustomer(id: string): Promise<void> {
    await db.delete(customers).where(eq(customers.id, id));
  }

  // Transactions methods
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(transactions).orderBy(desc(transactions.createdAt)).limit(1000);
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const result = await db.select().from(transactions).where(eq(transactions.id, id)).limit(1);
    return result[0];
  }

  async insertTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const result = await db.insert(transactions).values(transaction).returning();
    return result[0];
  }

  async updateTransaction(id: string, transaction: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const result = await db.update(transactions).set({ ...transaction, updatedAt: new Date() }).where(eq(transactions.id, id)).returning();
    return result[0];
  }

  async deleteTransaction(id: string): Promise<void> {
    await db.delete(transactions).where(eq(transactions.id, id));
  }

  // Batches methods
  async getBatches(): Promise<Batch[]> {
    return await db.select().from(batches).orderBy(desc(batches.createdAt)).limit(100);
  }

  async getBatchById(id: string): Promise<Batch | undefined> {
    const result = await db.select().from(batches).where(eq(batches.id, id)).limit(1);
    return result[0];
  }

  async insertBatch(batch: InsertBatch): Promise<Batch> {
    const result = await db.insert(batches).values(batch).returning();
    return result[0];
  }

  async updateBatch(id: string, batch: Partial<InsertBatch>): Promise<Batch | undefined> {
    const result = await db.update(batches).set({ ...batch, updatedAt: new Date() }).where(eq(batches.id, id)).returning();
    return result[0];
  }

  async deleteBatch(id: string): Promise<void> {
    await db.delete(batches).where(eq(batches.id, id));
  }

  // Batch Expenses methods
  async getBatchExpenses(): Promise<BatchExpense[]> {
    return await db.select().from(batchExpenses).orderBy(desc(batchExpenses.createdAt));
  }

  async getBatchExpenseById(id: string): Promise<BatchExpense | undefined> {
    const result = await db.select().from(batchExpenses).where(eq(batchExpenses.id, id)).limit(1);
    return result[0];
  }

  async insertBatchExpense(expense: InsertBatchExpense): Promise<BatchExpense> {
    const result = await db.insert(batchExpenses).values(expense).returning();
    return result[0];
  }

  async updateBatchExpense(id: string, expense: Partial<InsertBatchExpense>): Promise<BatchExpense | undefined> {
    const result = await db.update(batchExpenses).set({ ...expense, updatedAt: new Date() }).where(eq(batchExpenses.id, id)).returning();
    return result[0];
  }

  async deleteBatchExpense(id: string): Promise<void> {
    await db.delete(batchExpenses).where(eq(batchExpenses.id, id));
  }

  // Animal Sales methods
  async getAnimalSales(): Promise<AnimalSale[]> {
    return await db.select().from(animalSales).orderBy(desc(animalSales.createdAt));
  }

  async getAnimalSaleById(id: string): Promise<AnimalSale | undefined> {
    const result = await db.select().from(animalSales).where(eq(animalSales.id, id)).limit(1);
    return result[0];
  }

  async insertAnimalSale(sale: InsertAnimalSale): Promise<AnimalSale> {
    const result = await db.insert(animalSales).values(sale).returning();
    return result[0];
  }

  async updateAnimalSale(id: string, sale: Partial<InsertAnimalSale>): Promise<AnimalSale | undefined> {
    const result = await db.update(animalSales).set({ ...sale, updatedAt: new Date() }).where(eq(animalSales.id, id)).returning();
    return result[0];
  }

  async deleteAnimalSale(id: string): Promise<void> {
    await db.delete(animalSales).where(eq(animalSales.id, id));
  }

  // Performance Goals methods
  async getPerformanceGoals(): Promise<PerformanceGoal[]> {
    return await db.select().from(performanceGoals).orderBy(desc(performanceGoals.createdAt));
  }

  async getPerformanceGoalById(id: string): Promise<PerformanceGoal | undefined> {
    const result = await db.select().from(performanceGoals).where(eq(performanceGoals.id, id)).limit(1);
    return result[0];
  }

  async insertPerformanceGoal(goal: InsertPerformanceGoal): Promise<PerformanceGoal> {
    const result = await db.insert(performanceGoals).values(goal).returning();
    return result[0];
  }

  async updatePerformanceGoal(id: string, goal: Partial<InsertPerformanceGoal>): Promise<PerformanceGoal | undefined> {
    const result = await db.update(performanceGoals).set({ ...goal, updatedAt: new Date() }).where(eq(performanceGoals.id, id)).returning();
    return result[0];
  }

  async deletePerformanceGoal(id: string): Promise<void> {
    await db.delete(performanceGoals).where(eq(performanceGoals.id, id));
  }

  // Inventory methods
  async getInventory(): Promise<InventoryItem[]> {
    return await db.select().from(inventoryItems).orderBy(asc(inventoryItems.itemName)).limit(500);
  }

  async getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
    const result = await db.select().from(inventoryItems).where(eq(inventoryItems.id, id)).limit(1);
    return result[0];
  }

  async insertInventoryItem(item: InsertInventoryItem): Promise<InventoryItem> {
    const result = await db.insert(inventoryItems).values(item).returning();
    return result[0];
  }

  async updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const result = await db.update(inventoryItems).set({ ...item, updatedAt: new Date() }).where(eq(inventoryItems.id, id)).returning();
    return result[0];
  }

  async deleteInventoryItem(id: string): Promise<void> {
    await db.delete(inventoryItems).where(eq(inventoryItems.id, id));
  }

  // Inventory Transactions methods
  async getInventoryTransactions(): Promise<InventoryTransaction[]> {
    return await db.select().from(inventoryTransactions).orderBy(desc(inventoryTransactions.createdAt));
  }

  async getInventoryTransactionById(id: string): Promise<InventoryTransaction | undefined> {
    const result = await db.select().from(inventoryTransactions).where(eq(inventoryTransactions.id, id)).limit(1);
    return result[0];
  }

  async insertInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const result = await db.insert(inventoryTransactions).values(transaction).returning();
    
    // Update inventory item stock
    if (transaction.itemId) {
      const item = await this.getInventoryItemById(transaction.itemId as string);
      if (item) {
        const currentStock = parseFloat(item.currentStock);
        const transactionQty = parseFloat(transaction.quantity);
        const newStock = transaction.transactionType === "in" 
          ? currentStock + transactionQty 
          : currentStock - transactionQty;
        
        await this.updateInventoryItem(transaction.itemId as string, {
          currentStock: newStock.toString()
        });
      }
    }
    
    return result[0];
  }

  async updateInventoryTransaction(id: string, transaction: Partial<InsertInventoryTransaction>): Promise<InventoryTransaction | undefined> {
    const result = await db.update(inventoryTransactions).set({ ...transaction, updatedAt: new Date() }).where(eq(inventoryTransactions.id, id)).returning();
    return result[0];
  }

  async deleteInventoryTransaction(id: string): Promise<void> {
    await db.delete(inventoryTransactions).where(eq(inventoryTransactions.id, id));
  }

  // Veterinary Treatments methods
  async getVeterinaryTreatments(animalId?: string): Promise<VeterinaryTreatment[]> {
    if (animalId) {
      return await db.select().from(veterinaryTreatments).where(eq(veterinaryTreatments.animalId, animalId)).orderBy(desc(veterinaryTreatments.treatmentDate));
    }
    return await db.select().from(veterinaryTreatments).orderBy(desc(veterinaryTreatments.treatmentDate));
  }

  async getVeterinaryTreatmentById(id: string): Promise<VeterinaryTreatment | undefined> {
    const result = await db.select().from(veterinaryTreatments).where(eq(veterinaryTreatments.id, id)).limit(1);
    return result[0];
  }

  async insertVeterinaryTreatment(treatment: InsertVeterinaryTreatment): Promise<VeterinaryTreatment> {
    const result = await db.insert(veterinaryTreatments).values(treatment).returning();
    return result[0];
  }

  async updateVeterinaryTreatment(id: string, treatment: Partial<InsertVeterinaryTreatment>): Promise<VeterinaryTreatment | undefined> {
    const result = await db.update(veterinaryTreatments).set({ ...treatment, updatedAt: new Date() }).where(eq(veterinaryTreatments.id, id)).returning();
    return result[0];
  }

  async deleteVeterinaryTreatment(id: string): Promise<void> {
    await db.delete(veterinaryTreatments).where(eq(veterinaryTreatments.id, id));
  }

  // Legacy method names for compatibility
  async getTreatments(): Promise<VeterinaryTreatment[]> {
    return this.getVeterinaryTreatments();
  }

  async getTreatmentById(id: string): Promise<VeterinaryTreatment | undefined> {
    return this.getVeterinaryTreatmentById(id);
  }

  async insertTreatment(treatment: InsertVeterinaryTreatment): Promise<VeterinaryTreatment> {
    return this.insertVeterinaryTreatment(treatment);
  }

  async updateTreatment(id: string, treatment: Partial<InsertVeterinaryTreatment>): Promise<VeterinaryTreatment | undefined> {
    return this.updateVeterinaryTreatment(id, treatment);
  }

  async deleteTreatment(id: string): Promise<void> {
    return this.deleteVeterinaryTreatment(id);
  }

  // Vouchers methods
  async getVouchers(): Promise<Voucher[]> {
    return await db.select().from(vouchers).orderBy(desc(vouchers.createdAt));
  }

  async getVoucherById(id: string): Promise<Voucher | undefined> {
    const result = await db.select().from(vouchers).where(eq(vouchers.id, id)).limit(1);
    return result[0];
  }

  async insertVoucher(voucher: InsertVoucher): Promise<Voucher> {
    const result = await db.insert(vouchers).values(voucher).returning();
    return result[0];
  }

  async updateVoucher(id: string, voucher: Partial<InsertVoucher>): Promise<Voucher | undefined> {
    const result = await db.update(vouchers).set({ ...voucher, updatedAt: new Date() }).where(eq(vouchers.id, id)).returning();
    return result[0];
  }

  async deleteVoucher(id: string): Promise<void> {
    await db.delete(vouchers).where(eq(vouchers.id, id));
  }

  // 💰 ACCOUNTING ENTRIES METHODS
  async getAccountingEntries(): Promise<AccountingEntry[]> {
    return await db.select().from(accountingEntries).orderBy(desc(accountingEntries.entryDate));
  }

  async getAccountingEntryById(id: string): Promise<AccountingEntry | undefined> {
    const result = await db.select().from(accountingEntries).where(eq(accountingEntries.id, id)).limit(1);
    return result[0];
  }

  async insertAccountingEntry(entry: InsertAccountingEntry): Promise<AccountingEntry> {
    // Auto-generate entry number if not provided
    if (!entry.entryNumber) {
      const count = await db.select({ count: sql`count(*)` }).from(accountingEntries);
      const entryCount = parseInt(count[0].count.toString()) + 1;
      entry.entryNumber = `JE-${new Date().getFullYear()}-${String(entryCount).padStart(4, '0')}`;
    }
    
    const result = await db.insert(accountingEntries).values(entry).returning();
    return result[0];
  }

  async updateAccountingEntry(id: string, entry: Partial<InsertAccountingEntry>): Promise<AccountingEntry | undefined> {
    const result = await db.update(accountingEntries).set({ ...entry, updatedAt: new Date() }).where(eq(accountingEntries.id, id)).returning();
    return result[0];
  }

  async deleteAccountingEntry(id: string): Promise<void> {
    await db.delete(accountingEntries).where(eq(accountingEntries.id, id));
  }

  // 📊 FINANCIAL REPORTS METHODS
  async getTrialBalance(): Promise<any[]> {
    const entries = await db.select({
      accountCode: accountingEntries.accountCode,
      accountName: accountingEntries.accountName,
      debitAmount: accountingEntries.debitAmount,
      creditAmount: accountingEntries.creditAmount,
    }).from(accountingEntries);

    // Group by account and sum debits/credits
    const accounts = new Map<string, any>();
    
    entries.forEach((entry: any) => {
      const key = `${entry.accountCode}-${entry.accountName}`;
      if (!accounts.has(key)) {
        accounts.set(key, {
          accountCode: entry.accountCode,
          accountName: entry.accountName,
          totalDebit: 0,
          totalCredit: 0,
          balance: 0
        });
      }
      
      const account = accounts.get(key);
      account.totalDebit += parseFloat(String(entry.debitAmount));
      account.totalCredit += parseFloat(String(entry.creditAmount));
      account.balance = account.totalDebit - account.totalCredit;
    });

    return Array.from(accounts.values());
  }

  async getProfitLossReport(startDate: Date, endDate: Date): Promise<any> {
    const entries = await db.select().from(accountingEntries)
      .where(and(
        gte(accountingEntries.entryDate, startDate),
        lte(accountingEntries.entryDate, endDate)
      ));

    let revenue = 0;
    let expenses = 0;
    
    entries.forEach((entry: any) => {
      // Revenue accounts (4xxxx)
      if (entry.accountCode.startsWith('4')) {
        revenue += parseFloat((entry as any).creditAmount) - parseFloat((entry as any).debitAmount);
      }
      // Expense accounts (5xxxx)
      else if (entry.accountCode.startsWith('5')) {
        expenses += parseFloat((entry as any).debitAmount) - parseFloat((entry as any).creditAmount);
      }
    });

    return {
      period: { startDate, endDate },
      revenue,
      expenses,
      profit: revenue - expenses,
      profitMargin: revenue > 0 ? ((revenue - expenses) / revenue) * 100 : 0
    };
  }

  async getBalanceSheet(date: Date): Promise<any> {
    const entries = await db.select().from(accountingEntries)
      .where(lte(accountingEntries.entryDate, date));

    let assets = 0;
    let liabilities = 0;
    let equity = 0;
    
    entries.forEach((entry: any) => {
      const balance = parseFloat((entry as any).debitAmount) - parseFloat((entry as any).creditAmount);
      
      // Assets (1xxxx)
      if (entry.accountCode.startsWith('1')) {
        assets += balance;
      }
      // Liabilities (2xxxx)
      else if (entry.accountCode.startsWith('2')) {
        liabilities += -balance; // Credit balance
      }
      // Equity (3xxxx)
      else if (entry.accountCode.startsWith('3')) {
        equity += -balance; // Credit balance
      }
    });

    return {
      date,
      assets,
      liabilities,
      equity,
      totalLiabilitiesAndEquity: liabilities + equity
    };
  }

  async getCashFlowReport(startDate: Date, endDate: Date): Promise<any> {
    const entries = await db.select().from(accountingEntries)
      .where(and(
        gte(accountingEntries.entryDate, startDate),
        lte(accountingEntries.entryDate, endDate),
        eq(accountingEntries.accountCode, '1010') // Cash account
      ));

    let inflow = 0;
    let outflow = 0;
    
    entries.forEach((entry: any) => {
      const debit = parseFloat((entry as any).debitAmount);
      const credit = parseFloat((entry as any).creditAmount);
      
      if (debit > credit) {
        inflow += debit - credit;
      } else {
        outflow += credit - debit;
      }
    });

    return {
      period: { startDate, endDate },
      inflow,
      outflow,
      netFlow: inflow - outflow
    };
  }

  // Clear all data method
  async clearAllData(): Promise<void> {
    try {
      await db.delete(accountingEntries);
      await db.delete(vouchers);
      await db.delete(veterinaryTreatments);
      await db.delete(inventoryTransactions);
      await db.delete(inventoryItems);
      await db.delete(performanceGoals);
      await db.delete(animalSales);
      await db.delete(batchExpenses);
      await db.delete(batches);
      await db.delete(transactions);
      await db.delete(customers);
      await db.delete(suppliers);
      await db.delete(receptions);
      await db.delete(animals);
      await db.delete(users);
      console.log("✅ All data cleared successfully");
    } catch (error) {
      console.error("❌ Error clearing data:", error);
      throw error;
    }
  }

  // Barns methods
  async getBarns(): Promise<Barn[]> {
    const result = await db.select().from(barns);
    return result;
  }

  async getBarnById(id: string): Promise<Barn | undefined> {
    const result = await db.select().from(barns).where(eq(barns.id, id));
    return result[0];
  }

  async insertBarn(barn: InsertBarn): Promise<Barn> {
    const result = await db.insert(barns).values(barn).returning();
    return result[0];
  }

  async updateBarn(id: string, barn: Partial<InsertBarn>): Promise<Barn | undefined> {
    const result = await db.update(barns).set(barn).where(eq(barns.id, id)).returning();
    return result[0];
  }

  async deleteBarn(id: string): Promise<void> {
    await db.delete(barns).where(eq(barns.id, id));
  }

  // Goals methods
  async getGoals(): Promise<Goal[]> {
    const result = await db.select().from(goals);
    return result;
  }

  async getGoalById(id: string): Promise<Goal | undefined> {
    const result = await db.select().from(goals).where(eq(goals.id, id));
    return result[0];
  }

  async insertGoal(goal: InsertGoal): Promise<Goal> {
    const result = await db.insert(goals).values(goal).returning();
    return result[0];
  }

  async updateGoal(id: string, goal: Partial<InsertGoal>): Promise<Goal | undefined> {
    const result = await db.update(goals).set({ ...goal, updatedAt: new Date() }).where(eq(goals.id, id)).returning();
    return result[0];
  }

  async deleteGoal(id: string): Promise<void> {
    await db.delete(goals).where(eq(goals.id, id));
  }
}

// Choose storage implementation based on env: if DATABASE_URL is missing
// fall back to in-memory to avoid 500s in environments where DB isn't configured.
export const storage = process.env.DATABASE_URL ? new DbStorage() : new InMemoryStorage();