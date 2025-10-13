import { type User, type InsertUser, type Animal, type InsertAnimal, type Reception, type InsertReception, type Supplier, type InsertSupplier, type Customer, type InsertCustomer, type Transaction, type InsertTransaction, type Batch, type InsertBatch, type BatchExpense, type InsertBatchExpense, type AnimalSale, type InsertAnimalSale, type PerformanceGoal, type InsertPerformanceGoal, type InventoryItem, type InsertInventoryItem, type InventoryTransaction, type InsertInventoryTransaction, type VeterinaryTreatment, type InsertVeterinaryTreatment, type Voucher, type InsertVoucher } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
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

  constructor() {
    // Initialize with some mock data
    this.initializeMockData();
  }

  private initializeMockData() {
    // Add mock user
    const mockUser: User = {
      id: "1",
      username: "admin",
      password: "admin123"
    };
    this.users.set(mockUser.id, mockUser);

    // Add mock batches with correct cost data
    const batch1: Batch = {
      id: "batch-1",
      batchNumber: "B-2025-001",
      batchName: "دفعة يناير 2025",
      startDate: new Date("2025-01-15"),
      closeDate: null,
      totalAnimals: "5",
      soldAnimals: "0",
      deceasedAnimals: "0",
      purchaseCost: "125000",
      feedCost: "45000",
      treatmentCost: "8500",
      otherExpenses: "0",
      totalCost: "178500",
      totalRevenue: "0",
      profit: "-178500",
      profitPercentage: "0",
      status: "active",
      notes: "دفعة تسمين - يناير 2025",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const batch2: Batch = {
      id: "batch-2",
      batchNumber: "B-2024-012",
      batchName: "دفعة ديسمبر 2024",
      startDate: new Date("2024-12-01"),
      closeDate: new Date("2025-03-15"),
      totalAnimals: "3",
      soldAnimals: "3",
      deceasedAnimals: "0",
      purchaseCost: "75000",
      feedCost: "32000",
      treatmentCost: "5000",
      otherExpenses: "0",
      totalCost: "112000",
      totalRevenue: "145000",
      profit: "33000",
      profitPercentage: "29.46",
      status: "completed",
      notes: "دفعة مكتملة - ربح جيد",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const batch3: Batch = {
      id: "batch-3",
      batchNumber: "B-2025-002",
      batchName: "دفعة فبراير 2025",
      startDate: new Date("2025-02-01"),
      closeDate: null,
      totalAnimals: "8",
      soldAnimals: "1",
      deceasedAnimals: "0",
      purchaseCost: "180000",
      feedCost: "52000",
      treatmentCost: "12000",
      otherExpenses: "0",
      totalCost: "244000",
      totalRevenue: "45000",
      profit: "-199000",
      profitPercentage: "-81.56",
      status: "active",
      notes: "دفعة كبيرة - خليط من الأبقار والجاموس",
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    this.batches.set(batch1.id, batch1);
    this.batches.set(batch2.id, batch2);
    this.batches.set(batch3.id, batch3);

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
    const newUser: User = { ...user, id };
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
      purchaseCost: batch.purchaseCost || "0",
      feedCost: batch.feedCost || "0",
      treatmentCost: batch.treatmentCost || "0",
      otherExpenses: batch.otherExpenses || "0",
      totalCost: batch.totalCost || "0",
      totalRevenue: batch.totalRevenue || "0",
      profit: batch.profit || "0",
      profitPercentage: batch.profitPercentage || "0",
      soldAnimals: batch.soldAnimals || "0",
      deceasedAnimals: batch.deceasedAnimals || "0",
      startDate: batch.startDate || new Date(),
      closeDate: batch.closeDate || null,
      totalAnimals: batch.totalAnimals || "0",
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
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
      accumulatedFeedCost: animal.accumulatedFeedCost || "0",
      accumulatedTreatmentCost: animal.accumulatedTreatmentCost || "0",
      accumulatedOtherCost: animal.accumulatedOtherCost || "0",
      totalCost: animal.totalCost || "0",
      receptionId: animal.receptionId || null,
      saleId: animal.saleId || null,
      entryDate: animal.entryDate || new Date(),
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
    const newSupplier: Supplier = { 
      ...supplier, 
      id, 
      address: supplier.address || null,
      notes: supplier.notes || null,
      phone: supplier.phone || null,
      email: supplier.email || null,
      taxNumber: supplier.taxNumber || null,
      balance: supplier.balance || "0",
      createdAt: new Date(), 
      updatedAt: new Date() 
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
    const newCustomer: Customer = { 
      ...customer, 
      id, 
      address: customer.address || null,
      notes: customer.notes || null,
      phone: customer.phone || null,
      email: customer.email || null,
      taxNumber: customer.taxNumber || null,
      balance: customer.balance || "0",
      createdAt: new Date(), 
      updatedAt: new Date() 
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
      paymentMethod: transaction.paymentMethod || null,
      description: transaction.description || null,
      notes: transaction.notes || null,
      referenceNumber: transaction.referenceNumber || null,
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
      description: item.description || null,
      notes: item.notes || null,
      category: item.category || null,
      supplierId: item.supplierId || null,
      location: item.location || null,
      expiryDate: item.expiryDate || null,
      batchNumber: item.batchNumber || null,
      currentStock: item.currentStock || "0",
      minStock: item.minStock || "0",
      totalValue: item.totalValue || "0",
      reorderPoint: item.reorderPoint || "0",
      unitCost: item.unitCost || "0",
      maxStock: item.maxStock || null,
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
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
    const newReception: Reception = { 
      ...reception, 
      id, 
      animalBreed: reception.animalBreed || null,
      notes: reception.notes || null,
      supplier: reception.supplier || null,
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
      paymentMethod: batchExpense.paymentMethod || null,
      notes: batchExpense.notes || null,
      supplierId: batchExpense.supplierId || null,
      quantity: batchExpense.quantity || null,
      unitPrice: batchExpense.unitPrice || null,
      referenceNumber: batchExpense.referenceNumber || null,
      expenseCategory: batchExpense.expenseCategory || null,
      expenseDate: batchExpense.expenseDate || new Date(),
      createdAt: new Date(), 
      updatedAt: new Date() 
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
    return batchId ? allSales.filter(s => s.batchId === batchId) : allSales;
  }

  async getAnimalSaleById(id: string): Promise<AnimalSale | undefined> {
    return this.animalSales.get(id);
  }

  async insertAnimalSale(animalSale: InsertAnimalSale): Promise<AnimalSale> {
    const id = randomUUID();
    const newSale: AnimalSale = { 
      ...animalSale, 
      id, 
      paymentMethod: animalSale.paymentMethod || null,
      notes: animalSale.notes || null,
      profitPercentage: animalSale.profitPercentage || null,
      customerId: animalSale.customerId || null,
      paidAmount: animalSale.paidAmount || "0",
      remainingAmount: animalSale.remainingAmount || "0",
      saleDate: animalSale.saleDate || new Date(),
      createdAt: new Date(), 
      updatedAt: new Date() 
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
      description: goal.description || null,
      notes: goal.notes || null,
      unit: goal.unit || null,
      batchId: goal.batchId || null,
      achievedDate: goal.achievedDate || null,
      startDate: goal.startDate || new Date(),
      endDate: goal.endDate || new Date(),
      currentValue: goal.currentValue || "0",
      targetValue: goal.targetValue || "0",
      priority: goal.priority || "medium",
      createdAt: new Date(), 
      updatedAt: new Date() 
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
      animalId: transaction.animalId || null,
      description: transaction.description || null,
      notes: transaction.notes || null,
      supplierId: transaction.supplierId || null,
      penNumber: transaction.penNumber || null,
      performedBy: transaction.performedBy || null,
      batchId: transaction.batchId || null,
      referenceId: transaction.referenceId || null,
      purchaseOrderNumber: transaction.purchaseOrderNumber || null,
      referenceType: transaction.referenceType || null,
      invoiceNumber: transaction.invoiceNumber || null,
      createdAt: new Date() 
    };
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
      behavior: treatment.behavior || null,
      temperature: treatment.temperature || null,
      heartRate: treatment.heartRate || null,
      respiratoryRate: treatment.respiratoryRate || null,
      appetite: treatment.appetite || null,
      mobility: treatment.mobility || null,
      followUpDate: treatment.followUpDate || null,
      outcome: treatment.outcome || null,
      treatmentDate: treatment.treatmentDate || new Date(),
      medications: treatment.medications || null,
      symptoms: treatment.symptoms || null,
      completedDate: treatment.completedDate || null,
      diagnosisCategory: treatment.diagnosisCategory || null,
      actualCost: treatment.actualCost || "0",
      isolation: treatment.isolation || null,
      estimatedCost: treatment.estimatedCost || "0",
      dietRecommendations: treatment.dietRecommendations || null,
      vetNotes: treatment.vetNotes || null,
      specialInstructions: treatment.specialInstructions || null,
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
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
      transactionId: voucher.transactionId || null,
      approvedBy: voucher.approvedBy || null,
      approvedAt: voucher.approvedAt || null,
      notes: voucher.notes || null,
      voucherDate: voucher.voucherDate || new Date(),
      relatedType: voucher.relatedType || null,
      relatedId: voucher.relatedId || null,
      description: voucher.description || "",
      amountInWords: voucher.amountInWords || null,
      checkNumber: voucher.checkNumber || null,
      bankName: voucher.bankName || null,
      createdBy: voucher.createdBy || null,
      checkDate: voucher.checkDate || null,
      createdAt: new Date(), 
      updatedAt: new Date() 
    };
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
}

export const storage = new InMemoryStorage();