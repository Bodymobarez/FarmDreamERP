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
  insertBatchExpense(expense: InsertBatchExpense): Promise<BatchExpense>;
  updateBatchExpense(id: string, expense: Partial<InsertBatchExpense>): Promise<BatchExpense | undefined>;
  deleteBatchExpense(id: string): Promise<void>;
  
  // Animal Sales methods
  getAnimalSales(batchId?: string): Promise<AnimalSale[]>;
  getAnimalSaleById(id: string): Promise<AnimalSale | undefined>;
  insertAnimalSale(sale: InsertAnimalSale): Promise<AnimalSale>;
  updateAnimalSale(id: string, sale: Partial<InsertAnimalSale>): Promise<AnimalSale | undefined>;
  deleteAnimalSale(id: string): Promise<void>;
  
  // Performance Goals methods
  getPerformanceGoals(): Promise<PerformanceGoal[]>;
  getPerformanceGoalById(id: string): Promise<PerformanceGoal | undefined>;
  insertPerformanceGoal(goal: InsertPerformanceGoal): Promise<PerformanceGoal>;
  updatePerformanceGoal(id: string, goal: Partial<InsertPerformanceGoal>): Promise<PerformanceGoal | undefined>;
  deletePerformanceGoal(id: string): Promise<void>;
  
  // Inventory Items methods
  getInventoryItems(): Promise<InventoryItem[]>;
  getInventoryItemById(id: string): Promise<InventoryItem | undefined>;
  insertInventoryItem(item: InsertInventoryItem): Promise<InventoryItem>;
  updateInventoryItem(id: string, item: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined>;
  deleteInventoryItem(id: string): Promise<void>;
  
  // Inventory Transactions methods
  getInventoryTransactions(): Promise<InventoryTransaction[]>;
  getInventoryTransactionById(id: string): Promise<InventoryTransaction | undefined>;
  insertInventoryTransaction(transaction: InsertInventoryTransaction): Promise<InventoryTransaction>;
  
  // Veterinary Treatments methods
  getVeterinaryTreatments(animalId?: string): Promise<VeterinaryTreatment[]>;
  getVeterinaryTreatmentById(id: string): Promise<VeterinaryTreatment | undefined>;
  insertVeterinaryTreatment(treatment: InsertVeterinaryTreatment): Promise<VeterinaryTreatment>;
  updateVeterinaryTreatment(id: string, treatment: Partial<InsertVeterinaryTreatment>): Promise<VeterinaryTreatment | undefined>;
  deleteVeterinaryTreatment(id: string): Promise<void>;
  
  // Vouchers methods
  getVouchers(): Promise<Voucher[]>;
  getVoucherById(id: string): Promise<Voucher | undefined>;
  insertVoucher(voucher: InsertVoucher): Promise<Voucher>;
  deleteVoucher(id: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private animals: Map<string, Animal>;
  private receptions: Map<string, Reception>;
  private suppliers: Map<string, Supplier>;
  private customers: Map<string, Customer>;
  private transactions: Map<string, Transaction>;
  private batches: Map<string, Batch>;
  private batchExpenses: Map<string, BatchExpense>;
  private animalSales: Map<string, AnimalSale>;
  private performanceGoals: Map<string, PerformanceGoal>;
  private inventoryItems: Map<string, InventoryItem>;
  private inventoryTransactions: Map<string, InventoryTransaction>;
  private veterinaryTreatments: Map<string, VeterinaryTreatment>;
  private vouchers: Map<string, Voucher>;

  constructor() {
    this.users = new Map();
    this.animals = new Map();
    this.receptions = new Map();
    this.suppliers = new Map();
    this.customers = new Map();
    this.transactions = new Map();
    this.batches = new Map();
    this.batchExpenses = new Map();
    this.animalSales = new Map();
    this.performanceGoals = new Map();
    this.inventoryItems = new Map();
    this.inventoryTransactions = new Map();
    this.veterinaryTreatments = new Map();
    this.vouchers = new Map();
    
    // Initialize with mock data for demonstration
    // this.initializeMockData(); // تم تعطيل البيانات التجريبية
  }
  
  private initializeMockData() {
    const now = new Date();
    
    // Add mock batches
    const batch1: Batch = {
      id: "batch-1",
      batchNumber: "B-2025-001",
      startDate: new Date("2025-01-15"),
      endDate: null,
      totalAnimals: 5,
      activeAnimals: 5,
      soldAnimals: 0,
      deadAnimals: 0,
      totalPurchaseCost: "125000",
      totalFeedCost: "45000",
      totalTreatmentCost: "8500",
      totalRevenue: "0",
      profitLoss: "-178500",
      status: "active",
      notes: "دفعة تسمين - يناير 2025"
    };
    
    const batch2: Batch = {
      id: "batch-2",
      batchNumber: "B-2024-012",
      startDate: new Date("2024-12-01"),
      endDate: new Date("2025-03-15"),
      totalAnimals: 3,
      activeAnimals: 0,
      soldAnimals: 3,
      deadAnimals: 0,
      totalPurchaseCost: "75000",
      totalFeedCost: "32000",
      totalTreatmentCost: "5000",
      totalRevenue: "145000",
      profitLoss: "33000",
      status: "completed",
      notes: "دفعة مكتملة - ربح جيد"
    };
    
    this.batches.set(batch1.id, batch1);
    this.batches.set(batch2.id, batch2);
    
    // Add third batch for more variety
    const batch3: Batch = {
      id: "batch-3",
      batchNumber: "B-2025-002",
      startDate: new Date("2025-02-01"),
      endDate: null,
      totalAnimals: 8,
      activeAnimals: 7,
      soldAnimals: 1,
      deadAnimals: 0,
      totalPurchaseCost: "180000",
      totalFeedCost: "52000",
      totalTreatmentCost: "12000",
      totalRevenue: "45000",
      profitLoss: "-199000",
      status: "active",
      notes: "دفعة كبيرة - خليط من الأبقار والجاموس"
    };
    this.batches.set(batch3.id, batch3);
    
    // Add mock animals
    const animals: Animal[] = [
      {
        id: "animal-1",
        earTag: "A-001",
        animalType: "بقر",
        sex: "ذكر",
        entryWeight: "250",
        currentWeight: "385",
        entryDate: new Date("2025-01-15"),
        penNumber: "عنبر 1",
        batchNumber: "B-2025-001",
        batchId: "batch-1",
        purchaseCost: "25000",
        accumulatedFeedCost: "9500",
        accumulatedTreatmentCost: "1800",
        totalCost: "36300",
        status: "active",
        notes: "أداء ممتاز - نمو سريع"
      },
      {
        id: "animal-2",
        earTag: "A-002",
        animalType: "بقر",
        sex: "ذكر",
        entryWeight: "245",
        currentWeight: "372",
        entryDate: new Date("2025-01-15"),
        penNumber: "عنبر 1",
        batchNumber: "B-2025-001",
        batchId: "batch-1",
        purchaseCost: "24500",
        accumulatedFeedCost: "9200",
        accumulatedTreatmentCost: "1500",
        totalCost: "35200",
        status: "active",
        notes: null
      },
      {
        id: "animal-3",
        earTag: "A-003",
        animalType: "جاموس",
        sex: "أنثى",
        entryWeight: "280",
        currentWeight: "425",
        entryDate: new Date("2025-01-15"),
        penNumber: "عنبر 2",
        batchNumber: "B-2025-001",
        batchId: "batch-1",
        purchaseCost: "28000",
        accumulatedFeedCost: "10800",
        accumulatedTreatmentCost: "2200",
        totalCost: "41000",
        status: "active",
        notes: "جاموس حلاب - إنتاج ممتاز"
      },
      {
        id: "animal-4",
        earTag: "A-004",
        animalType: "أغنام",
        sex: "ذكر",
        entryWeight: "45",
        currentWeight: "68",
        entryDate: new Date("2025-01-15"),
        penNumber: "عنبر 3",
        batchNumber: "B-2025-001",
        batchId: "batch-1",
        purchaseCost: "4500",
        accumulatedFeedCost: "1800",
        accumulatedTreatmentCost: "500",
        totalCost: "6800",
        status: "active",
        notes: null
      },
      {
        id: "animal-5",
        earTag: "A-005",
        animalType: "ماعز",
        sex: "أنثى",
        entryWeight: "38",
        currentWeight: "55",
        entryDate: new Date("2025-01-15"),
        penNumber: "عنبر 3",
        batchNumber: "B-2025-001",
        batchId: "batch-1",
        purchaseCost: "3800",
        accumulatedFeedCost: "1500",
        accumulatedTreatmentCost: "600",
        totalCost: "5900",
        status: "active",
        notes: "ماعز حلاب"
      },
      // حيوانات الدفعة الثالثة
      {
        id: "animal-6",
        earTag: "A-006",
        animalType: "بقر",
        sex: "ذكر",
        entryWeight: "260",
        currentWeight: "395",
        entryDate: new Date("2025-02-01"),
        penNumber: "عنبر 1",
        batchNumber: "B-2025-002",
        batchId: "batch-3",
        purchaseCost: "26000",
        accumulatedFeedCost: "8500",
        accumulatedTreatmentCost: "1200",
        totalCost: "35700",
        status: "active",
        notes: null
      },
      {
        id: "animal-7",
        earTag: "A-007",
        animalType: "جاموس",
        sex: "ذكر",
        entryWeight: "300",
        currentWeight: "445",
        entryDate: new Date("2025-02-01"),
        penNumber: "عنبر 2",
        batchNumber: "B-2025-002",
        batchId: "batch-3",
        purchaseCost: "32000",
        accumulatedFeedCost: "11000",
        accumulatedTreatmentCost: "2500",
        totalCost: "45500",
        status: "active",
        notes: "أداء جيد"
      },
      {
        id: "animal-8",
        earTag: "A-008",
        animalType: "بقر",
        sex: "أنثى",
        entryWeight: "240",
        currentWeight: "365",
        entryDate: new Date("2025-02-01"),
        penNumber: "عنبر 1",
        batchNumber: "B-2025-002",
        batchId: "batch-3",
        purchaseCost: "24000",
        accumulatedFeedCost: "7800",
        accumulatedTreatmentCost: "1100",
        totalCost: "32900",
        status: "active",
        notes: "بقرة حلاب"
      },
      // مواليد (تكلفة صفر)
      {
        id: "animal-9",
        earTag: "N-001",
        animalType: "بقر",
        sex: "أنثى",
        entryWeight: "35",
        currentWeight: "42",
        entryDate: new Date("2025-05-10"),
        penNumber: "عنبر 1",
        batchNumber: "B-2025-001",
        batchId: "batch-1",
        purchaseCost: "0",
        accumulatedFeedCost: "450",
        accumulatedTreatmentCost: "200",
        totalCost: "650",
        status: "active",
        notes: "🐄 مولود جديد - من A-003"
      },
      {
        id: "animal-10",
        earTag: "N-002",
        animalType: "جاموس",
        sex: "ذكر",
        entryWeight: "40",
        currentWeight: "48",
        entryDate: new Date("2025-05-15"),
        penNumber: "عنبر 2",
        batchNumber: "B-2025-002",
        batchId: "batch-3",
        purchaseCost: "0",
        accumulatedFeedCost: "380",
        accumulatedTreatmentCost: "150",
        totalCost: "530",
        status: "active",
        notes: "🐄 مولود جديد - صحة ممتازة"
      }
    ];
    
    animals.forEach(animal => {
      this.animals.set(animal.id, animal);
    });
    
    // Add mock suppliers
    const suppliers: Supplier[] = [
      {
        id: "supplier-1",
        name: "مورد الأعلاف المتحدة",
        phone: "01001234567",
        address: "القاهرة - المعادي",
        email: "feed@supplier.com",
        supplierType: "feed",
        totalTransactions: "145000",
        lastTransactionDate: new Date("2025-06-15"),
        notes: "مورد موثوق - أسعار ممتازة"
      },
      {
        id: "supplier-2",
        name: "صيدلية النيل البيطرية",
        phone: "01112345678",
        address: "الجيزة - الدقي",
        email: "vet@pharmacy.com",
        supplierType: "medicine",
        totalTransactions: "28500",
        lastTransactionDate: new Date("2025-06-10"),
        notes: null
      },
      {
        id: "supplier-3",
        name: "مزرعة الخير للماشية",
        phone: "01201234567",
        address: "الفيوم - إطسا",
        email: "info@kheirfarm.com",
        supplierType: "animals",
        totalTransactions: "320000",
        lastTransactionDate: new Date("2025-05-25"),
        notes: "مورد رئيسي للعجول والجاموس"
      },
      {
        id: "supplier-4",
        name: "شركة الأعلاف الذهبية",
        phone: "01151234567",
        address: "الشرقية - الزقازيق",
        email: "golden@feeds.com",
        supplierType: "feed",
        totalTransactions: "85000",
        lastTransactionDate: new Date("2025-06-08"),
        notes: "مورد بديل - جودة جيدة"
      },
      {
        id: "supplier-5",
        name: "مستلزمات المزارع الحديثة",
        phone: "01091234567",
        address: "القاهرة - مدينة نصر",
        email: null,
        supplierType: "equipment",
        totalTransactions: "45000",
        lastTransactionDate: new Date("2025-04-20"),
        notes: "معدات وأدوات زراعية"
      }
    ];
    
    suppliers.forEach(supplier => {
      this.suppliers.set(supplier.id, supplier);
    });
    
    // Add mock customers
    const customers: Customer[] = [
      {
        id: "customer-1",
        name: "محمد أحمد التاجر",
        phone: "01551234567",
        address: "القاهرة - عين شمس",
        email: null,
        totalPurchases: "95000",
        lastPurchaseDate: new Date("2025-03-15"),
        notes: "عميل دائم - يدفع نقداً"
      },
      {
        id: "customer-2",
        name: "شركة اللحوم الطازجة",
        phone: "01221234567",
        address: "الإسكندرية - سيدي جابر",
        email: "sales@freshmeat.com",
        totalPurchases: "250000",
        lastPurchaseDate: new Date("2025-05-20"),
        notes: "شركة كبيرة - عقود طويلة الأجل"
      },
      {
        id: "customer-3",
        name: "عبد الرحمن سالم",
        phone: "01331234567",
        address: "الجيزة - 6 أكتوبر",
        email: null,
        totalPurchases: "75000",
        lastPurchaseDate: new Date("2025-06-01"),
        notes: "عميل جديد - دفعات منتظمة"
      },
      {
        id: "customer-4",
        name: "مطعم الأصالة",
        phone: "01441234567",
        address: "القاهرة - التجمع الخامس",
        email: "asala@restaurant.com",
        totalPurchases: "120000",
        lastPurchaseDate: new Date("2025-06-12"),
        notes: "طلبات أسبوعية منتظمة"
      },
      {
        id: "customer-5",
        name: "سوبر ماركت النور",
        phone: "01661234567",
        address: "الإسكندرية - المنتزه",
        email: null,
        totalPurchases: "180000",
        lastPurchaseDate: new Date("2025-06-15"),
        notes: "شراء بكميات كبيرة - عقد سنوي"
      }
    ];
    
    customers.forEach(customer => {
      this.customers.set(customer.id, customer);
    });
    
    // Add mock receptions
    const receptions: Reception[] = [
      {
        id: "reception-1",
        receptionNumber: "RC-2025-001",
        receptionDate: new Date("2025-01-15"),
        animalType: "بقر",
        totalAnimals: 3,
        totalWeight: "745",
        totalPrice: "74500",
        supplier: "مزرعة الخير للماشية",
        status: "completed",
        notes: "عجول تسمين - حالة ممتازة",
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15"),
      },
      {
        id: "reception-2",
        receptionNumber: "RC-2025-002",
        receptionDate: new Date("2025-02-01"),
        animalType: "جاموس",
        totalAnimals: 2,
        totalWeight: "580",
        totalPrice: "60000",
        supplier: "مزرعة الخير للماشية",
        status: "completed",
        notes: "جاموس حلاب - إنتاج عالي",
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-01"),
      },
      {
        id: "reception-3",
        receptionNumber: "RC-2025-003",
        receptionDate: new Date("2025-06-18"),
        animalType: "بقر",
        totalAnimals: 5,
        totalWeight: "1250",
        totalPrice: "125000",
        supplier: "مزرعة الخير للماشية",
        status: "pending",
        notes: "دفعة جديدة قيد الفحص البيطري",
        createdAt: new Date("2025-06-18"),
        updatedAt: new Date("2025-06-18"),
      },
    ];
    
    receptions.forEach(reception => {
      this.receptions.set(reception.id, reception);
    });
    
    // Add mock transactions
    const transactions: Transaction[] = [
      {
        id: "trans-1",
        transactionNumber: "TRX-2025-001",
        transactionDate: new Date("2025-01-15"),
        transactionType: "purchase",
        relatedType: "supplier",
        relatedId: "supplier-3",
        amount: "74500",
        paymentMethod: "bank_transfer",
        referenceNumber: "RC-2025-001",
        description: "شراء 3 عجول بقر",
        notes: "تحويل بنكي - البنك الأهلي",
        createdAt: new Date("2025-01-15"),
        updatedAt: new Date("2025-01-15"),
      },
      {
        id: "trans-2",
        transactionNumber: "TRX-2025-002",
        transactionDate: new Date("2025-02-01"),
        transactionType: "purchase",
        relatedType: "supplier",
        relatedId: "supplier-3",
        amount: "60000",
        paymentMethod: "check",
        referenceNumber: "RC-2025-002",
        description: "شراء 2 جاموس حلاب",
        notes: "شيك بنك مصر - رقم CH-445566",
        createdAt: new Date("2025-02-01"),
        updatedAt: new Date("2025-02-01"),
      },
      {
        id: "trans-3",
        transactionNumber: "TRX-2025-003",
        transactionDate: new Date("2025-03-15"),
        transactionType: "sale",
        relatedType: "customer",
        relatedId: "customer-1",
        amount: "45000",
        paymentMethod: "cash",
        referenceNumber: "SAL-2025-001",
        description: "بيع حيوان A-001 - وزن 385 كجم",
        notes: "دفع نقدي كامل",
        createdAt: new Date("2025-03-15"),
        updatedAt: new Date("2025-03-15"),
      },
      {
        id: "trans-4",
        transactionNumber: "TRX-2025-004",
        transactionDate: new Date("2025-05-20"),
        transactionType: "sale",
        relatedType: "customer",
        relatedId: "customer-2",
        amount: "95000",
        paymentMethod: "bank_transfer",
        referenceNumber: "SAL-2025-002",
        description: "بيع 2 حيوانات للشركة",
        notes: "تحويل بنكي - عقد شهري",
        createdAt: new Date("2025-05-20"),
        updatedAt: new Date("2025-05-20"),
      },
      {
        id: "trans-5",
        transactionNumber: "TRX-2025-005",
        transactionDate: new Date("2025-06-10"),
        transactionType: "expense",
        relatedType: "supplier",
        relatedId: "supplier-1",
        amount: "12500",
        paymentMethod: "cash",
        referenceNumber: "PO-2025-020",
        description: "شراء أعلاف مركزة",
        notes: "دفع نقدي",
        createdAt: new Date("2025-06-10"),
        updatedAt: new Date("2025-06-10"),
      },
      {
        id: "trans-6",
        transactionNumber: "TRX-2025-006",
        transactionDate: new Date("2025-06-12"),
        transactionType: "expense",
        relatedType: "supplier",
        relatedId: "supplier-2",
        amount: "8500",
        paymentMethod: "cash",
        referenceNumber: "INV-VET-445",
        description: "شراء أدوية ومستلزمات بيطرية",
        notes: "فاتورة شهرية",
        createdAt: new Date("2025-06-12"),
        updatedAt: new Date("2025-06-12"),
      },
      {
        id: "trans-7",
        transactionNumber: "TRX-2025-007",
        transactionDate: new Date("2025-06-15"),
        transactionType: "sale",
        relatedType: "customer",
        relatedId: "customer-5",
        amount: "85000",
        paymentMethod: "bank_transfer",
        referenceNumber: "SAL-2025-003",
        description: "بيع 3 حيوانات لسوبر ماركت النور",
        notes: "تحويل بنكي - دفعة كاملة",
        createdAt: new Date("2025-06-15"),
        updatedAt: new Date("2025-06-15"),
      },
    ];
    
    transactions.forEach(transaction => {
      this.transactions.set(transaction.id, transaction);
    });
    
    // Add mock inventory items
    const inventoryItems: InventoryItem[] = [
      // Feeds
      {
        id: "inv-1",
        itemCode: "FEED-001",
        itemName: "علف بادئ مركز",
        itemType: "feed",
        category: "علف مركز",
        unit: "كجم",
        currentStock: "500",
        reorderPoint: "200",
        minStock: "150",
        maxStock: "1000",
        unitCost: "5.50",
        totalValue: "2750",
        supplierId: "supplier-1",
        location: "مخزن رئيسي",
        expiryDate: null,
        batchNumber: null,
        status: "active",
        description: "علف بادئ عالي البروتين للعجول الصغيرة",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "inv-2",
        itemCode: "FEED-002",
        itemName: "علف نامي",
        itemType: "feed",
        category: "علف مركز",
        unit: "كجم",
        currentStock: "750",
        reorderPoint: "300",
        minStock: "250",
        maxStock: "1500",
        unitCost: "4.80",
        totalValue: "3600",
        supplierId: "supplier-1",
        location: "مخزن رئيسي",
        expiryDate: null,
        batchNumber: null,
        status: "active",
        description: "علف نامي للحيوانات متوسطة العمر",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "inv-3",
        itemCode: "FEED-003",
        itemName: "علف تسمين",
        itemType: "feed",
        category: "علف مركز",
        unit: "كجم",
        currentStock: "150",
        reorderPoint: "200",
        minStock: "100",
        maxStock: "800",
        unitCost: "5.20",
        totalValue: "780",
        supplierId: "supplier-1",
        location: "مخزن رئيسي",
        expiryDate: null,
        batchNumber: null,
        status: "active",
        description: "علف تسمين نهائي",
        notes: "مخزون منخفض - يحتاج إعادة طلب",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "inv-4",
        itemCode: "FEED-004",
        itemName: "برسيم جاف",
        itemType: "feed",
        category: "علف خشن",
        unit: "كجم",
        currentStock: "300",
        reorderPoint: "150",
        minStock: "100",
        maxStock: "500",
        unitCost: "2.50",
        totalValue: "750",
        supplierId: "supplier-1",
        location: "مخزن ثانوي",
        expiryDate: null,
        batchNumber: null,
        status: "active",
        description: null,
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Medicines
      {
        id: "inv-5",
        itemCode: "MED-001",
        itemName: "مضاد حيوي - بنسلين",
        itemType: "medicine",
        category: "مضادات حيوية",
        unit: "قرص",
        currentStock: "50",
        reorderPoint: "20",
        minStock: "15",
        maxStock: "100",
        unitCost: "2.50",
        totalValue: "125",
        supplierId: "supplier-2",
        location: "صيدلية",
        expiryDate: new Date("2026-12-31"),
        batchNumber: "PEN-2025-A",
        status: "active",
        description: "مضاد حيوي واسع الطيف",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "inv-6",
        itemCode: "MED-002",
        itemName: "فيتامينات AD3E",
        itemType: "medicine",
        category: "فيتامينات",
        unit: "عبوة",
        currentStock: "30",
        reorderPoint: "10",
        minStock: "8",
        maxStock: "50",
        unitCost: "15.00",
        totalValue: "450",
        supplierId: "supplier-2",
        location: "صيدلية",
        expiryDate: new Date("2027-06-30"),
        batchNumber: "VIT-2025-B",
        status: "active",
        description: "فيتامينات تقوية عامة",
        notes: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: "inv-7",
        itemCode: "MED-003",
        itemName: "مطهر جروح - بيتادين",
        itemType: "medicine",
        category: "مطهرات",
        unit: "عبوة",
        currentStock: "15",
        reorderPoint: "25",
        minStock: "10",
        maxStock: "50",
        unitCost: "8.50",
        totalValue: "127.5",
        supplierId: "supplier-2",
        location: "صيدلية",
        expiryDate: new Date("2026-08-31"),
        batchNumber: "BET-2025-C",
        status: "active",
        description: "مطهر موضعي للجروح",
        notes: "مخزون منخفض",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];
    
    inventoryItems.forEach(item => {
      this.inventoryItems.set(item.id, item);
    });
    
    // Add mock inventory transactions
    const inventoryTransactions: InventoryTransaction[] = [
      {
        id: "invtrans-1",
        transactionNumber: "OUT-2025-001",
        transactionDate: new Date("2025-06-18"),
        transactionType: "out",
        itemId: "inv-1",
        quantity: "50",
        unitCost: "5.50",
        totalCost: "275",
        penNumber: "عنبر 1",
        batchId: "batch-1",
        animalId: null,
        supplierId: null,
        purchaseOrderNumber: null,
        invoiceNumber: null,
        referenceType: "batch_expense",
        referenceId: null,
        performedBy: "أحمد محمد",
        description: "صرف علف بادئ للدفعة B-2025-001",
        notes: "تغذية يومية",
        createdAt: new Date("2025-06-18"),
      },
      {
        id: "invtrans-2",
        transactionNumber: "OUT-2025-002",
        transactionDate: new Date("2025-06-17"),
        transactionType: "out",
        itemId: "inv-5",
        quantity: "10",
        unitCost: "2.50",
        totalCost: "25",
        penNumber: null,
        batchId: null,
        animalId: "animal-1",
        supplierId: null,
        purchaseOrderNumber: null,
        invoiceNumber: null,
        referenceType: "treatment",
        referenceId: null,
        performedBy: "د. محمد",
        description: "علاج فردي - حيوان A-001",
        notes: "علاج التهاب",
        createdAt: new Date("2025-06-17"),
      },
      {
        id: "invtrans-3",
        transactionNumber: "IN-2025-001",
        transactionDate: new Date("2025-06-15"),
        transactionType: "in",
        itemId: "inv-2",
        quantity: "500",
        unitCost: "4.80",
        totalCost: "2400",
        penNumber: null,
        batchId: null,
        animalId: null,
        supplierId: "supplier-1",
        purchaseOrderNumber: "PO-2025-015",
        invoiceNumber: "INV-5678",
        referenceType: "purchase",
        referenceId: null,
        performedBy: "علي حسن",
        description: "شراء علف نامي",
        notes: "توريد جديد من المورد",
        createdAt: new Date("2025-06-15"),
      },
      {
        id: "invtrans-4",
        transactionNumber: "IN-2025-002",
        transactionDate: new Date("2025-06-10"),
        transactionType: "in",
        itemId: "inv-3",
        quantity: "300",
        unitCost: "5.20",
        totalCost: "1560",
        penNumber: null,
        batchId: null,
        animalId: null,
        supplierId: "supplier-4",
        purchaseOrderNumber: "PO-2025-014",
        invoiceNumber: "INV-5501",
        referenceType: "purchase",
        referenceId: null,
        performedBy: "علي حسن",
        description: "شراء علف تسمين",
        notes: "مورد بديل",
        createdAt: new Date("2025-06-10"),
      },
      {
        id: "invtrans-5",
        transactionNumber: "OUT-2025-003",
        transactionDate: new Date("2025-06-16"),
        transactionType: "out",
        itemId: "inv-2",
        quantity: "80",
        unitCost: "4.80",
        totalCost: "384",
        penNumber: "عنبر 2",
        batchId: "batch-3",
        animalId: null,
        supplierId: null,
        purchaseOrderNumber: null,
        invoiceNumber: null,
        referenceType: "batch_expense",
        referenceId: null,
        performedBy: "محمود سعيد",
        description: "صرف علف نامي للدفعة B-2025-002",
        notes: null,
        createdAt: new Date("2025-06-16"),
      },
      {
        id: "invtrans-6",
        transactionNumber: "IN-2025-003",
        transactionDate: new Date("2025-06-12"),
        transactionType: "in",
        itemId: "inv-6",
        quantity: "20",
        unitCost: "15.00",
        totalCost: "300",
        penNumber: null,
        batchId: null,
        animalId: null,
        supplierId: "supplier-2",
        purchaseOrderNumber: "PO-2025-016",
        invoiceNumber: "INV-VET-445",
        referenceType: "purchase",
        referenceId: null,
        performedBy: "أحمد محمد",
        description: "شراء فيتامينات AD3E",
        notes: "مستلزمات بيطرية شهرية",
        createdAt: new Date("2025-06-12"),
      },
      {
        id: "invtrans-7",
        transactionNumber: "OUT-2025-004",
        transactionDate: new Date("2025-06-14"),
        transactionType: "out",
        itemId: "inv-6",
        quantity: "5",
        unitCost: "15.00",
        totalCost: "75",
        penNumber: "عنبر 1",
        batchId: "batch-1",
        animalId: null,
        supplierId: null,
        purchaseOrderNumber: null,
        invoiceNumber: null,
        referenceType: "batch_treatment",
        referenceId: null,
        performedBy: "د. محمد",
        description: "فيتامينات تقوية للدفعة B-2025-001",
        notes: "جرعة وقائية",
        createdAt: new Date("2025-06-14"),
      },
    ];
    
    inventoryTransactions.forEach(trans => {
      this.inventoryTransactions.set(trans.id, trans);
    });
    
    // Add mock veterinary treatments
    const treatments: VeterinaryTreatment[] = [
      {
        id: "treatment-1",
        animalId: "animal-1",
        veterinarian: "د. محمد علي",
        treatmentDate: new Date("2025-06-17"),
        treatmentType: "sick",
        temperature: "39.5",
        heartRate: "85",
        respiratoryRate: "28",
        appetite: "fair",
        behavior: "lethargic",
        mobility: "slow",
        symptoms: "ارتفاع طفيف في الحرارة، خمول",
        diagnosisCategory: "respiratory",
        diagnosisDescription: "التهاب تنفسي خفيف",
        severity: "mild",
        medications: "مضاد حيوي - بنسلين 10 أقراص، خافض حرارة",
        isolation: false,
        dietRecommendations: "علف خفيف، ماء وفير",
        followUpDate: new Date("2025-06-24"),
        specialInstructions: "مراقبة الحرارة يومياً",
        vetNotes: "استجابة جيدة للعلاج المتوقعة",
        estimatedCost: "450",
        actualCost: "425",
        status: "completed",
        completedDate: new Date("2025-06-20"),
        outcome: "تحسن كامل",
        createdAt: new Date("2025-06-17"),
        updatedAt: new Date("2025-06-20"),
      },
      {
        id: "treatment-2",
        animalId: "animal-3",
        veterinarian: "د. سارة أحمد",
        treatmentDate: new Date("2025-06-10"),
        treatmentType: "checkup",
        temperature: "38.5",
        heartRate: "75",
        respiratoryRate: "24",
        appetite: "good",
        behavior: "normal",
        mobility: "normal",
        symptoms: null,
        diagnosisCategory: null,
        diagnosisDescription: "فحص دوري - حالة صحية ممتازة",
        severity: "none",
        medications: "فيتامينات AD3E - جرعة وقائية",
        isolation: null,
        dietRecommendations: "الاستمرار على النظام الغذائي الحالي",
        followUpDate: new Date("2025-07-10"),
        specialInstructions: "فحص شهري منتظم",
        vetNotes: "جاموس حلاب بصحة ممتازة، إنتاج عالي",
        estimatedCost: "200",
        actualCost: "180",
        status: "completed",
        completedDate: new Date("2025-06-10"),
        outcome: "حالة ممتازة",
        createdAt: new Date("2025-06-10"),
        updatedAt: new Date("2025-06-10"),
      },
      {
        id: "treatment-3",
        animalId: "animal-7",
        veterinarian: "د. محمد علي",
        treatmentDate: new Date("2025-06-15"),
        treatmentType: "sick",
        temperature: "40.2",
        heartRate: "92",
        respiratoryRate: "32",
        appetite: "poor",
        behavior: "lethargic",
        mobility: "limited",
        symptoms: "ارتفاع في الحرارة، إسهال، فقدان شهية",
        diagnosisCategory: "digestive",
        diagnosisDescription: "التهاب معوي حاد",
        severity: "moderate",
        medications: "مضاد حيوي قوي، محلول معالجة جفاف، مثبت إسهال",
        isolation: true,
        dietRecommendations: "إيقاف العلف لمدة 24 ساعة، ماء فقط",
        followUpDate: new Date("2025-06-18"),
        specialInstructions: "عزل الحيوان، مراقبة مستمرة، قياس الحرارة كل 6 ساعات",
        vetNotes: "حالة متوسطة تحتاج متابعة دقيقة",
        estimatedCost: "800",
        actualCost: "750",
        status: "ongoing",
        completedDate: null,
        outcome: null,
        createdAt: new Date("2025-06-15"),
        updatedAt: new Date("2025-06-18"),
      },
      {
        id: "treatment-4",
        animalId: "animal-9",
        veterinarian: "د. سارة أحمد",
        treatmentDate: new Date("2025-05-10"),
        treatmentType: "birth",
        temperature: "38.8",
        heartRate: "110",
        respiratoryRate: "35",
        appetite: "good",
        behavior: "active",
        mobility: "normal",
        symptoms: null,
        diagnosisCategory: null,
        diagnosisDescription: "ولادة طبيعية - مولود سليم",
        severity: "none",
        medications: "فيتامينات للأم، تطعيم للمولود",
        isolation: null,
        dietRecommendations: "رضاعة طبيعية، مراقبة الوزن",
        followUpDate: new Date("2025-05-20"),
        specialInstructions: "متابعة نمو المولود، تطعيمات دورية",
        vetNotes: "ولادة ناجحة، حالة الأم والمولود ممتازة",
        estimatedCost: "300",
        actualCost: "280",
        status: "completed",
        completedDate: new Date("2025-05-10"),
        outcome: "ولادة ناجحة",
        createdAt: new Date("2025-05-10"),
        updatedAt: new Date("2025-05-10"),
      },
    ];
    
    treatments.forEach(treatment => {
      this.veterinaryTreatments.set(treatment.id, treatment);
    });
    
    // Add mock vouchers - Receipt Vouchers (سندات قبض)
    const receiptVouchers: Voucher[] = [
      {
        id: "voucher-r1",
        voucherNumber: "RV-2025-001",
        voucherDate: new Date("2025-06-18"),
        voucherType: "receipt",
        relatedType: "customer",
        relatedId: "customer-1",
        relatedName: "محمد أحمد التاجر",
        amount: "45000",
        amountInWords: "خمسة وأربعون ألف جنيه مصري فقط لا غير",
        paymentMethod: "cash",
        checkNumber: null,
        checkDate: null,
        bankName: null,
        description: "استلام دفعة من بيع حيوانات",
        notes: "تم الاستلام نقداً بالكامل",
        status: "completed",
        createdBy: "أحمد محمد",
        createdAt: new Date("2025-06-18"),
        updatedAt: new Date("2025-06-18"),
      },
      {
        id: "voucher-r2",
        voucherNumber: "RV-2025-002",
        voucherDate: new Date("2025-06-15"),
        voucherType: "receipt",
        relatedType: "customer",
        relatedId: "customer-2",
        relatedName: "شركة اللحوم الطازجة",
        amount: "95000",
        amountInWords: "خمسة وتسعون ألف جنيه مصري فقط لا غير",
        paymentMethod: "bank_transfer",
        checkNumber: null,
        checkDate: null,
        bankName: "البنك الأهلي المصري",
        description: "استلام قيمة فاتورة رقم INV-2025-045",
        notes: "تحويل بنكي - تم التأكيد",
        status: "completed",
        createdBy: "علي حسن",
        createdAt: new Date("2025-06-15"),
        updatedAt: new Date("2025-06-15"),
      },
      {
        id: "voucher-r3",
        voucherNumber: "RV-2025-003",
        voucherDate: new Date("2025-06-12"),
        voucherType: "receipt",
        relatedType: "customer",
        relatedId: "customer-1",
        relatedName: "محمد أحمد التاجر",
        amount: "30000",
        amountInWords: "ثلاثون ألف جنيه مصري فقط لا غير",
        paymentMethod: "check",
        checkNumber: "CH-789456",
        checkDate: new Date("2025-06-20"),
        bankName: "بنك مصر",
        description: "استلام شيك دفعة مقدمة",
        notes: "الشيك مؤجل - تاريخ الاستحقاق 20/6/2025",
        status: "pending",
        createdBy: "أحمد محمد",
        createdAt: new Date("2025-06-12"),
        updatedAt: new Date("2025-06-12"),
      },
      {
        id: "voucher-r4",
        voucherNumber: "RV-2025-004",
        voucherDate: new Date("2025-06-10"),
        voucherType: "receipt",
        relatedType: "other",
        relatedId: null,
        relatedName: "أخرى - عميل نقدي",
        amount: "18500",
        amountInWords: "ثمانية عشر ألف وخمسمائة جنيه مصري فقط لا غير",
        paymentMethod: "cash",
        checkNumber: null,
        checkDate: null,
        bankName: null,
        description: "بيع نقدي - عميل عابر",
        notes: "تم الاستلام والتسليم فوراً",
        status: "completed",
        createdBy: "محمود سعيد",
        createdAt: new Date("2025-06-10"),
        updatedAt: new Date("2025-06-10"),
      },
    ];
    
    // Add mock vouchers - Payment Vouchers (سندات صرف)
    const paymentVouchers: Voucher[] = [
      {
        id: "voucher-p1",
        voucherNumber: "PV-2025-001",
        voucherDate: new Date("2025-06-17"),
        voucherType: "payment",
        relatedType: "supplier",
        relatedId: "supplier-1",
        relatedName: "مورد الأعلاف المتحدة",
        amount: "42000",
        amountInWords: "اثنان وأربعون ألف جنيه مصري فقط لا غير",
        paymentMethod: "bank_transfer",
        checkNumber: null,
        checkDate: null,
        bankName: "البنك الأهلي المصري",
        description: "سداد قيمة فاتورة أعلاف رقم PO-2025-015",
        notes: "تحويل بنكي - تم السداد",
        status: "completed",
        createdBy: "علي حسن",
        createdAt: new Date("2025-06-17"),
        updatedAt: new Date("2025-06-17"),
      },
      {
        id: "voucher-p2",
        voucherNumber: "PV-2025-002",
        voucherDate: new Date("2025-06-16"),
        voucherType: "payment",
        relatedType: "supplier",
        relatedId: "supplier-2",
        relatedName: "صيدلية النيل البيطرية",
        amount: "8500",
        amountInWords: "ثمانية آلاف وخمسمائة جنيه مصري فقط لا غير",
        paymentMethod: "cash",
        checkNumber: null,
        checkDate: null,
        bankName: null,
        description: "سداد قيمة أدوية ومستلزمات طبية",
        notes: "دفع نقدي - تم الاستلام بالكامل",
        status: "completed",
        createdBy: "أحمد محمد",
        createdAt: new Date("2025-06-16"),
        updatedAt: new Date("2025-06-16"),
      },
      {
        id: "voucher-p3",
        voucherNumber: "PV-2025-003",
        voucherDate: new Date("2025-06-14"),
        voucherType: "payment",
        relatedType: "employee",
        relatedId: null,
        relatedName: "محمود سعيد - عامل",
        amount: "3500",
        amountInWords: "ثلاثة آلاف وخمسمائة جنيه مصري فقط لا غير",
        paymentMethod: "cash",
        checkNumber: null,
        checkDate: null,
        bankName: null,
        description: "صرف راتب شهر يونيو 2025",
        notes: "راتب شهري - موظف دائم",
        status: "completed",
        createdBy: "علي حسن",
        createdAt: new Date("2025-06-14"),
        updatedAt: new Date("2025-06-14"),
      },
      {
        id: "voucher-p4",
        voucherNumber: "PV-2025-004",
        voucherDate: new Date("2025-06-13"),
        voucherType: "payment",
        relatedType: "other",
        relatedId: null,
        relatedName: "مصاريف كهرباء ومياه",
        amount: "2800",
        amountInWords: "ألفان وثمانمائة جنيه مصري فقط لا غير",
        paymentMethod: "cash",
        checkNumber: null,
        checkDate: null,
        bankName: null,
        description: "سداد فواتير الخدمات - يونيو 2025",
        notes: "مصاريف عمومية",
        status: "completed",
        createdBy: "أحمد محمد",
        createdAt: new Date("2025-06-13"),
        updatedAt: new Date("2025-06-13"),
      },
      {
        id: "voucher-p5",
        voucherNumber: "PV-2025-005",
        voucherDate: new Date("2025-06-11"),
        voucherType: "payment",
        relatedType: "supplier",
        relatedId: "supplier-1",
        relatedName: "مورد الأعلاف المتحدة",
        amount: "55000",
        amountInWords: "خمسة وخمسون ألف جنيه مصري فقط لا غير",
        paymentMethod: "check",
        checkNumber: "CH-123456",
        checkDate: new Date("2025-06-25"),
        bankName: "بنك القاهرة",
        description: "دفع دفعة مقدمة لطلبية أعلاف جديدة",
        notes: "شيك مؤجل - استحقاق 25/6/2025",
        status: "pending",
        createdBy: "علي حسن",
        createdAt: new Date("2025-06-11"),
        updatedAt: new Date("2025-06-11"),
      },
    ];
    
    // Add all vouchers to storage
    [...receiptVouchers, ...paymentVouchers].forEach(voucher => {
      this.vouchers.set(voucher.id, voucher);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Animals methods
  async getAnimals(): Promise<Animal[]> {
    return Array.from(this.animals.values());
  }

  async getAnimalById(id: string): Promise<Animal | undefined> {
    return this.animals.get(id);
  }

  async insertAnimal(insertAnimal: InsertAnimal): Promise<Animal> {
    const id = randomUUID();
    const now = new Date();
    const animal: Animal = {
      id,
      earTag: insertAnimal.earTag,
      animalType: insertAnimal.animalType,
      sex: insertAnimal.sex,
      entryWeight: insertAnimal.entryWeight,
      currentWeight: insertAnimal.currentWeight || insertAnimal.entryWeight,
      entryDate: insertAnimal.entryDate || now,
      penNumber: insertAnimal.penNumber || null,
      batchNumber: insertAnimal.batchNumber || null,
      batchId: insertAnimal.batchId || null,
      receptionId: insertAnimal.receptionId || null,
      purchaseCost: insertAnimal.purchaseCost || null,
      accumulatedFeedCost: insertAnimal.accumulatedFeedCost || "0",
      accumulatedTreatmentCost: insertAnimal.accumulatedTreatmentCost || "0",
      accumulatedOtherCost: insertAnimal.accumulatedOtherCost || "0",
      totalCost: insertAnimal.totalCost || "0",
      status: insertAnimal.status || "active",
      saleId: insertAnimal.saleId || null,
      notes: insertAnimal.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.animals.set(id, animal);
    return animal;
  }

  async updateAnimal(id: string, updateData: Partial<InsertAnimal>): Promise<Animal | undefined> {
    const animal = this.animals.get(id);
    if (!animal) return undefined;

    const updatedAnimal: Animal = {
      ...animal,
      ...updateData,
      updatedAt: new Date(),
    };
    this.animals.set(id, updatedAnimal);
    return updatedAnimal;
  }

  async deleteAnimal(id: string): Promise<void> {
    this.animals.delete(id);
  }

  // Receptions methods
  async getReceptions(): Promise<Reception[]> {
    return Array.from(this.receptions.values());
  }

  async getReceptionById(id: string): Promise<Reception | undefined> {
    return this.receptions.get(id);
  }

  async insertReception(insertReception: InsertReception): Promise<Reception> {
    const id = randomUUID();
    const now = new Date();
    const reception: Reception = {
      id,
      receptionNumber: insertReception.receptionNumber,
      receptionDate: insertReception.receptionDate || now,
      animalType: insertReception.animalType,
      totalAnimals: insertReception.totalAnimals,
      totalWeight: insertReception.totalWeight,
      totalPrice: insertReception.totalPrice,
      supplier: insertReception.supplier || null,
      status: insertReception.status || "pending",
      notes: insertReception.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.receptions.set(id, reception);
    return reception;
  }

  async updateReception(id: string, updateData: Partial<InsertReception>): Promise<Reception | undefined> {
    const reception = this.receptions.get(id);
    if (!reception) return undefined;

    const updatedReception: Reception = {
      ...reception,
      ...updateData,
      updatedAt: new Date(),
    };
    this.receptions.set(id, updatedReception);
    return updatedReception;
  }

  async deleteReception(id: string): Promise<void> {
    this.receptions.delete(id);
  }

  // Suppliers methods
  async getSuppliers(): Promise<Supplier[]> {
    return Array.from(this.suppliers.values());
  }

  async getSupplierById(id: string): Promise<Supplier | undefined> {
    return this.suppliers.get(id);
  }

  async insertSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const id = randomUUID();
    const now = new Date();
    const supplier: Supplier = {
      id,
      name: insertSupplier.name,
      phone: insertSupplier.phone || null,
      email: insertSupplier.email || null,
      address: insertSupplier.address || null,
      taxNumber: insertSupplier.taxNumber || null,
      balance: insertSupplier.balance || "0",
      notes: insertSupplier.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.suppliers.set(id, supplier);
    return supplier;
  }

  async updateSupplier(id: string, updateData: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const supplier = this.suppliers.get(id);
    if (!supplier) return undefined;

    const updatedSupplier: Supplier = {
      ...supplier,
      ...updateData,
      updatedAt: new Date(),
    };
    this.suppliers.set(id, updatedSupplier);
    return updatedSupplier;
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

  async insertCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const id = randomUUID();
    const now = new Date();
    const customer: Customer = {
      id,
      name: insertCustomer.name,
      phone: insertCustomer.phone || null,
      email: insertCustomer.email || null,
      address: insertCustomer.address || null,
      taxNumber: insertCustomer.taxNumber || null,
      balance: insertCustomer.balance || "0",
      notes: insertCustomer.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.customers.set(id, customer);
    return customer;
  }

  async updateCustomer(id: string, updateData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const customer = this.customers.get(id);
    if (!customer) return undefined;

    const updatedCustomer: Customer = {
      ...customer,
      ...updateData,
      updatedAt: new Date(),
    };
    this.customers.set(id, updatedCustomer);
    return updatedCustomer;
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

  async insertTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const id = randomUUID();
    const now = new Date();
    const transaction: Transaction = {
      id,
      transactionNumber: insertTransaction.transactionNumber,
      transactionDate: insertTransaction.transactionDate || now,
      transactionType: insertTransaction.transactionType,
      relatedType: insertTransaction.relatedType || null,
      relatedId: insertTransaction.relatedId || null,
      amount: insertTransaction.amount,
      paymentMethod: insertTransaction.paymentMethod || null,
      referenceNumber: insertTransaction.referenceNumber || null,
      description: insertTransaction.description || null,
      notes: insertTransaction.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.transactions.set(id, transaction);
    return transaction;
  }

  async updateTransaction(id: string, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const transaction = this.transactions.get(id);
    if (!transaction) return undefined;

    const updatedTransaction: Transaction = {
      ...transaction,
      ...updateData,
      updatedAt: new Date(),
    };
    this.transactions.set(id, updatedTransaction);
    return updatedTransaction;
  }

  async deleteTransaction(id: string): Promise<void> {
    this.transactions.delete(id);
  }

  // Batches (Cost Centers) methods
  async getBatches(): Promise<Batch[]> {
    return Array.from(this.batches.values());
  }

  async getBatchById(id: string): Promise<Batch | undefined> {
    return this.batches.get(id);
  }

  async insertBatch(insertBatch: InsertBatch): Promise<Batch> {
    const id = randomUUID();
    const now = new Date();
    const batch: Batch = {
      id,
      batchNumber: insertBatch.batchNumber,
      batchName: insertBatch.batchName,
      startDate: insertBatch.startDate || now,
      closeDate: insertBatch.closeDate || null,
      status: insertBatch.status || "active",
      totalAnimals: insertBatch.totalAnimals || "0",
      soldAnimals: insertBatch.soldAnimals || "0",
      deceasedAnimals: insertBatch.deceasedAnimals || "0",
      purchaseCost: insertBatch.purchaseCost || "0",
      feedCost: insertBatch.feedCost || "0",
      treatmentCost: insertBatch.treatmentCost || "0",
      otherExpenses: insertBatch.otherExpenses || "0",
      totalCost: insertBatch.totalCost || "0",
      totalRevenue: insertBatch.totalRevenue || "0",
      profit: insertBatch.profit || "0",
      profitPercentage: insertBatch.profitPercentage || "0",
      notes: insertBatch.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.batches.set(id, batch);
    return batch;
  }

  async updateBatch(id: string, updateData: Partial<InsertBatch>): Promise<Batch | undefined> {
    const batch = this.batches.get(id);
    if (!batch) return undefined;

    const updatedBatch: Batch = {
      ...batch,
      ...updateData,
      updatedAt: new Date(),
    };
    this.batches.set(id, updatedBatch);
    return updatedBatch;
  }

  async deleteBatch(id: string): Promise<void> {
    this.batches.delete(id);
  }

  // Batch Expenses methods
  async getBatchExpenses(batchId?: string): Promise<BatchExpense[]> {
    const expenses = Array.from(this.batchExpenses.values());
    if (batchId) {
      return expenses.filter(e => e.batchId === batchId);
    }
    return expenses;
  }

  async getBatchExpenseById(id: string): Promise<BatchExpense | undefined> {
    return this.batchExpenses.get(id);
  }

  async insertBatchExpense(insertExpense: InsertBatchExpense): Promise<BatchExpense> {
    const id = randomUUID();
    const now = new Date();
    const expense: BatchExpense = {
      id,
      batchId: insertExpense.batchId,
      expenseDate: insertExpense.expenseDate || now,
      expenseType: insertExpense.expenseType,
      expenseCategory: insertExpense.expenseCategory || null,
      description: insertExpense.description,
      quantity: insertExpense.quantity || null,
      unitPrice: insertExpense.unitPrice || null,
      amount: insertExpense.amount,
      supplierId: insertExpense.supplierId || null,
      paymentMethod: insertExpense.paymentMethod || null,
      referenceNumber: insertExpense.referenceNumber || null,
      notes: insertExpense.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.batchExpenses.set(id, expense);
    return expense;
  }

  async updateBatchExpense(id: string, updateData: Partial<InsertBatchExpense>): Promise<BatchExpense | undefined> {
    const expense = this.batchExpenses.get(id);
    if (!expense) return undefined;

    const updatedExpense: BatchExpense = {
      ...expense,
      ...updateData,
      updatedAt: new Date(),
    };
    this.batchExpenses.set(id, updatedExpense);
    return updatedExpense;
  }

  async deleteBatchExpense(id: string): Promise<void> {
    this.batchExpenses.delete(id);
  }

  // Animal Sales methods
  async getAnimalSales(batchId?: string): Promise<AnimalSale[]> {
    const sales = Array.from(this.animalSales.values());
    if (batchId) {
      return sales.filter(s => s.batchId === batchId);
    }
    return sales;
  }

  async getAnimalSaleById(id: string): Promise<AnimalSale | undefined> {
    return this.animalSales.get(id);
  }

  async insertAnimalSale(insertSale: InsertAnimalSale): Promise<AnimalSale> {
    const id = randomUUID();
    const now = new Date();
    const sale: AnimalSale = {
      id,
      saleNumber: insertSale.saleNumber,
      saleDate: insertSale.saleDate || now,
      animalId: insertSale.animalId,
      batchId: insertSale.batchId,
      customerId: insertSale.customerId || null,
      weight: insertSale.weight,
      pricePerKg: insertSale.pricePerKg,
      salePrice: insertSale.salePrice,
      totalCost: insertSale.totalCost,
      profit: insertSale.profit,
      profitPercentage: insertSale.profitPercentage || null,
      paymentMethod: insertSale.paymentMethod || null,
      paymentStatus: insertSale.paymentStatus || "pending",
      paidAmount: insertSale.paidAmount || "0",
      remainingAmount: insertSale.remainingAmount || "0",
      notes: insertSale.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.animalSales.set(id, sale);
    return sale;
  }

  async updateAnimalSale(id: string, updateData: Partial<InsertAnimalSale>): Promise<AnimalSale | undefined> {
    const sale = this.animalSales.get(id);
    if (!sale) return undefined;

    const updatedSale: AnimalSale = {
      ...sale,
      ...updateData,
      updatedAt: new Date(),
    };
    this.animalSales.set(id, updatedSale);
    return updatedSale;
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

  async insertPerformanceGoal(insertGoal: InsertPerformanceGoal): Promise<PerformanceGoal> {
    const id = randomUUID();
    const now = new Date();
    const goal: PerformanceGoal = {
      id,
      goalName: insertGoal.goalName,
      goalType: insertGoal.goalType,
      targetValue: insertGoal.targetValue,
      currentValue: insertGoal.currentValue || "0",
      unit: insertGoal.unit || null,
      batchId: insertGoal.batchId || null,
      startDate: insertGoal.startDate || now,
      endDate: insertGoal.endDate || null,
      status: insertGoal.status || "active",
      achievedDate: insertGoal.achievedDate || null,
      priority: insertGoal.priority || "medium",
      description: insertGoal.description || null,
      notes: insertGoal.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.performanceGoals.set(id, goal);
    return goal;
  }

  async updatePerformanceGoal(id: string, updateData: Partial<InsertPerformanceGoal>): Promise<PerformanceGoal | undefined> {
    const goal = this.performanceGoals.get(id);
    if (!goal) return undefined;

    const updatedGoal: PerformanceGoal = {
      ...goal,
      ...updateData,
      updatedAt: new Date(),
    };
    this.performanceGoals.set(id, updatedGoal);
    return updatedGoal;
  }

  async deletePerformanceGoal(id: string): Promise<void> {
    this.performanceGoals.delete(id);
  }

  // Inventory Items methods
  async getInventoryItems(): Promise<InventoryItem[]> {
    return Array.from(this.inventoryItems.values());
  }

  async getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
    return this.inventoryItems.get(id);
  }

  async insertInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const id = randomUUID();
    const now = new Date();
    const currentStock = parseFloat(insertItem.currentStock || "0");
    const unitCost = parseFloat(insertItem.unitCost || "0");
    const totalValue = (currentStock * unitCost).toFixed(2);
    
    const item: InventoryItem = {
      id,
      itemCode: insertItem.itemCode,
      itemName: insertItem.itemName,
      itemType: insertItem.itemType,
      category: insertItem.category || null,
      unit: insertItem.unit,
      currentStock: insertItem.currentStock || "0",
      reorderPoint: insertItem.reorderPoint || "0",
      minStock: insertItem.minStock || "0",
      maxStock: insertItem.maxStock || null,
      unitCost: insertItem.unitCost || "0",
      totalValue,
      supplierId: insertItem.supplierId || null,
      location: insertItem.location || null,
      expiryDate: insertItem.expiryDate || null,
      batchNumber: insertItem.batchNumber || null,
      status: insertItem.status || "active",
      description: insertItem.description || null,
      notes: insertItem.notes || null,
      createdAt: now,
      updatedAt: now,
    };
    this.inventoryItems.set(id, item);
    return item;
  }

  async updateInventoryItem(id: string, updateData: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const item = this.inventoryItems.get(id);
    if (!item) return undefined;

    const currentStock = updateData.currentStock ? parseFloat(updateData.currentStock) : parseFloat(item.currentStock);
    const unitCost = updateData.unitCost ? parseFloat(updateData.unitCost) : parseFloat(item.unitCost);
    const totalValue = (currentStock * unitCost).toFixed(2);

    const updatedItem: InventoryItem = {
      ...item,
      ...updateData,
      totalValue,
      updatedAt: new Date(),
    };
    this.inventoryItems.set(id, updatedItem);
    return updatedItem;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    this.inventoryItems.delete(id);
  }

  // Inventory Transactions methods
  async getInventoryTransactions(): Promise<InventoryTransaction[]> {
    return Array.from(this.inventoryTransactions.values());
  }

  async getInventoryTransactionById(id: string): Promise<InventoryTransaction | undefined> {
    return this.inventoryTransactions.get(id);
  }

  async insertInventoryTransaction(insertTrans: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const id = randomUUID();
    const now = new Date();
    
    const transaction: InventoryTransaction = {
      id,
      transactionNumber: insertTrans.transactionNumber,
      transactionDate: insertTrans.transactionDate || now,
      transactionType: insertTrans.transactionType,
      itemId: insertTrans.itemId,
      quantity: insertTrans.quantity,
      unitCost: insertTrans.unitCost,
      totalCost: insertTrans.totalCost,
      penNumber: insertTrans.penNumber || null,
      batchId: insertTrans.batchId || null,
      animalId: insertTrans.animalId || null,
      supplierId: insertTrans.supplierId || null,
      purchaseOrderNumber: insertTrans.purchaseOrderNumber || null,
      invoiceNumber: insertTrans.invoiceNumber || null,
      referenceType: insertTrans.referenceType || null,
      referenceId: insertTrans.referenceId || null,
      performedBy: insertTrans.performedBy || null,
      description: insertTrans.description || null,
      notes: insertTrans.notes || null,
      createdAt: now,
    };
    
    this.inventoryTransactions.set(id, transaction);
    
    // Update inventory item stock
    const item = await this.getInventoryItemById(insertTrans.itemId);
    if (item) {
      const currentStock = parseFloat(item.currentStock);
      const quantity = parseFloat(insertTrans.quantity);
      const newStock = insertTrans.transactionType === "in" 
        ? currentStock + quantity 
        : currentStock - quantity;
      
      await this.updateInventoryItem(item.id, {
        currentStock: newStock.toString(),
      });
    }
    
    return transaction;
  }

  // Veterinary Treatments methods
  async getVeterinaryTreatments(animalId?: string): Promise<VeterinaryTreatment[]> {
    const allTreatments = Array.from(this.veterinaryTreatments.values());
    if (animalId) {
      return allTreatments.filter(t => t.animalId === animalId);
    }
    return allTreatments;
  }

  async getVeterinaryTreatmentById(id: string): Promise<VeterinaryTreatment | undefined> {
    return this.veterinaryTreatments.get(id);
  }

  async insertVeterinaryTreatment(insertTreatment: InsertVeterinaryTreatment): Promise<VeterinaryTreatment> {
    const id = randomUUID();
    const now = new Date();
    
    const treatment: VeterinaryTreatment = {
      id,
      animalId: insertTreatment.animalId,
      veterinarian: insertTreatment.veterinarian,
      treatmentDate: insertTreatment.treatmentDate || now,
      treatmentType: insertTreatment.treatmentType,
      temperature: insertTreatment.temperature || null,
      heartRate: insertTreatment.heartRate || null,
      respiratoryRate: insertTreatment.respiratoryRate || null,
      appetite: insertTreatment.appetite || null,
      behavior: insertTreatment.behavior || null,
      mobility: insertTreatment.mobility || null,
      symptoms: insertTreatment.symptoms || null,
      diagnosisCategory: insertTreatment.diagnosisCategory || null,
      diagnosisDescription: insertTreatment.diagnosisDescription,
      severity: insertTreatment.severity,
      medications: insertTreatment.medications || null,
      isolation: insertTreatment.isolation || null,
      dietRecommendations: insertTreatment.dietRecommendations || null,
      followUpDate: insertTreatment.followUpDate || null,
      specialInstructions: insertTreatment.specialInstructions || null,
      vetNotes: insertTreatment.vetNotes || null,
      estimatedCost: insertTreatment.estimatedCost || "0",
      actualCost: insertTreatment.actualCost || "0",
      status: insertTreatment.status || "ongoing",
      completedDate: insertTreatment.completedDate || null,
      outcome: insertTreatment.outcome || null,
      createdAt: now,
      updatedAt: now,
    };
    
    this.veterinaryTreatments.set(id, treatment);
    
    // Update animal's accumulated treatment cost
    const animal = await this.getAnimalById(insertTreatment.animalId);
    if (animal) {
      const currentCost = parseFloat(animal.accumulatedTreatmentCost || "0");
      const treatmentCost = parseFloat(insertTreatment.estimatedCost || "0");
      const newTreatmentCost = currentCost + treatmentCost;
      
      await this.updateAnimal(animal.id, {
        accumulatedTreatmentCost: newTreatmentCost.toString(),
      });
    }
    
    return treatment;
  }

  async updateVeterinaryTreatment(id: string, updateTreatment: Partial<InsertVeterinaryTreatment>): Promise<VeterinaryTreatment | undefined> {
    const existing = this.veterinaryTreatments.get(id);
    if (!existing) {
      return undefined;
    }
    
    const updated: VeterinaryTreatment = {
      ...existing,
      ...updateTreatment,
      updatedAt: new Date(),
    };
    
    this.veterinaryTreatments.set(id, updated);
    return updated;
  }

  async deleteVeterinaryTreatment(id: string): Promise<void> {
    this.veterinaryTreatments.delete(id);
  }

  // Vouchers methods
  async getVouchers(): Promise<Voucher[]> {
    return Array.from(this.vouchers.values()).sort((a, b) => 
      b.voucherDate.getTime() - a.voucherDate.getTime()
    );
  }

  async getVoucherById(id: string): Promise<Voucher | undefined> {
    return this.vouchers.get(id);
  }

  async insertVoucher(insertVoucher: InsertVoucher): Promise<Voucher> {
    const voucher: Voucher = {
      id: randomUUID(),
      ...insertVoucher,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    this.vouchers.set(voucher.id, voucher);
    return voucher;
  }

  async deleteVoucher(id: string): Promise<void> {
    this.vouchers.delete(id);
  }

  // Method to clear all data
  async clearAllData(): Promise<void> {
    this.animals.clear();
    this.receptions.clear();
    this.suppliers.clear();
    this.customers.clear();
    this.transactions.clear();
    this.batches.clear();
    this.batchExpenses.clear();
    this.animalSales.clear();
    this.performanceGoals.clear();
    this.inventoryItems.clear();
    this.inventoryTransactions.clear();
    this.veterinaryTreatments.clear();
    this.vouchers.clear();
  }
}

// Database Storage - uses PostgreSQL instead of memory
import { db } from "./db";
import * as schema from "@shared/schema";
import { eq, and, desc } from "drizzle-orm";

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(schema.users).where(eq(schema.users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(schema.users).values(insertUser).returning();
    return user;
  }

  // Animals methods
  async getAnimals(): Promise<Animal[]> {
    return await db.select().from(schema.animals).orderBy(desc(schema.animals.createdAt));
  }

  async getAnimalById(id: string): Promise<Animal | undefined> {
    const [animal] = await db.select().from(schema.animals).where(eq(schema.animals.id, id));
    return animal;
  }

  async insertAnimal(insertAnimal: InsertAnimal): Promise<Animal> {
    const [animal] = await db.insert(schema.animals).values(insertAnimal).returning();
    return animal;
  }

  async updateAnimal(id: string, updateData: Partial<InsertAnimal>): Promise<Animal | undefined> {
    const [animal] = await db.update(schema.animals)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.animals.id, id))
      .returning();
    return animal;
  }

  async deleteAnimal(id: string): Promise<void> {
    await db.delete(schema.animals).where(eq(schema.animals.id, id));
  }

  // Receptions methods
  async getReceptions(): Promise<Reception[]> {
    return await db.select().from(schema.receptions).orderBy(desc(schema.receptions.createdAt));
  }

  async getReceptionById(id: string): Promise<Reception | undefined> {
    const [reception] = await db.select().from(schema.receptions).where(eq(schema.receptions.id, id));
    return reception;
  }

  async insertReception(insertReception: InsertReception): Promise<Reception> {
    const [reception] = await db.insert(schema.receptions).values(insertReception).returning();
    return reception;
  }

  async updateReception(id: string, updateData: Partial<InsertReception>): Promise<Reception | undefined> {
    const [reception] = await db.update(schema.receptions)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.receptions.id, id))
      .returning();
    return reception;
  }

  async deleteReception(id: string): Promise<void> {
    await db.delete(schema.receptions).where(eq(schema.receptions.id, id));
  }

  // Suppliers methods
  async getSuppliers(): Promise<Supplier[]> {
    return await db.select().from(schema.suppliers).orderBy(schema.suppliers.name);
  }

  async getSupplierById(id: string): Promise<Supplier | undefined> {
    const [supplier] = await db.select().from(schema.suppliers).where(eq(schema.suppliers.id, id));
    return supplier;
  }

  async insertSupplier(insertSupplier: InsertSupplier): Promise<Supplier> {
    const [supplier] = await db.insert(schema.suppliers).values(insertSupplier).returning();
    return supplier;
  }

  async updateSupplier(id: string, updateData: Partial<InsertSupplier>): Promise<Supplier | undefined> {
    const [supplier] = await db.update(schema.suppliers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.suppliers.id, id))
      .returning();
    return supplier;
  }

  async deleteSupplier(id: string): Promise<void> {
    await db.delete(schema.suppliers).where(eq(schema.suppliers.id, id));
  }

  // Customers methods
  async getCustomers(): Promise<Customer[]> {
    return await db.select().from(schema.customers).orderBy(schema.customers.name);
  }

  async getCustomerById(id: string): Promise<Customer | undefined> {
    const [customer] = await db.select().from(schema.customers).where(eq(schema.customers.id, id));
    return customer;
  }

  async insertCustomer(insertCustomer: InsertCustomer): Promise<Customer> {
    const [customer] = await db.insert(schema.customers).values(insertCustomer).returning();
    return customer;
  }

  async updateCustomer(id: string, updateData: Partial<InsertCustomer>): Promise<Customer | undefined> {
    const [customer] = await db.update(schema.customers)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.customers.id, id))
      .returning();
    return customer;
  }

  async deleteCustomer(id: string): Promise<void> {
    await db.delete(schema.customers).where(eq(schema.customers.id, id));
  }

  // Transactions methods
  async getTransactions(): Promise<Transaction[]> {
    return await db.select().from(schema.transactions).orderBy(desc(schema.transactions.transactionDate));
  }

  async getTransactionById(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(schema.transactions).where(eq(schema.transactions.id, id));
    return transaction;
  }

  async insertTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(schema.transactions).values(insertTransaction).returning();
    return transaction;
  }

  async updateTransaction(id: string, updateData: Partial<InsertTransaction>): Promise<Transaction | undefined> {
    const [transaction] = await db.update(schema.transactions)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.transactions.id, id))
      .returning();
    return transaction;
  }

  async deleteTransaction(id: string): Promise<void> {
    await db.delete(schema.transactions).where(eq(schema.transactions.id, id));
  }

  // Batches methods
  async getBatches(): Promise<Batch[]> {
    return await db.select().from(schema.batches).orderBy(desc(schema.batches.startDate));
  }

  async getBatchById(id: string): Promise<Batch | undefined> {
    const [batch] = await db.select().from(schema.batches).where(eq(schema.batches.id, id));
    return batch;
  }

  async insertBatch(insertBatch: InsertBatch): Promise<Batch> {
    const [batch] = await db.insert(schema.batches).values(insertBatch).returning();
    return batch;
  }

  async updateBatch(id: string, updateData: Partial<InsertBatch>): Promise<Batch | undefined> {
    const [batch] = await db.update(schema.batches)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.batches.id, id))
      .returning();
    return batch;
  }

  async deleteBatch(id: string): Promise<void> {
    await db.delete(schema.batches).where(eq(schema.batches.id, id));
  }

  // Batch Expenses methods
  async getBatchExpenses(batchId?: string): Promise<BatchExpense[]> {
    if (batchId) {
      return await db.select().from(schema.batchExpenses)
        .where(eq(schema.batchExpenses.batchId, batchId))
        .orderBy(desc(schema.batchExpenses.expenseDate));
    }
    return await db.select().from(schema.batchExpenses).orderBy(desc(schema.batchExpenses.expenseDate));
  }

  async getBatchExpenseById(id: string): Promise<BatchExpense | undefined> {
    const [expense] = await db.select().from(schema.batchExpenses).where(eq(schema.batchExpenses.id, id));
    return expense;
  }

  async insertBatchExpense(insertExpense: InsertBatchExpense): Promise<BatchExpense> {
    const [expense] = await db.insert(schema.batchExpenses).values(insertExpense).returning();
    return expense;
  }

  async updateBatchExpense(id: string, updateData: Partial<InsertBatchExpense>): Promise<BatchExpense | undefined> {
    const [expense] = await db.update(schema.batchExpenses)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.batchExpenses.id, id))
      .returning();
    return expense;
  }

  async deleteBatchExpense(id: string): Promise<void> {
    await db.delete(schema.batchExpenses).where(eq(schema.batchExpenses.id, id));
  }

  // Animal Sales methods
  async getAnimalSales(batchId?: string): Promise<AnimalSale[]> {
    if (batchId) {
      return await db.select().from(schema.animalSales)
        .where(eq(schema.animalSales.batchId, batchId))
        .orderBy(desc(schema.animalSales.saleDate));
    }
    return await db.select().from(schema.animalSales).orderBy(desc(schema.animalSales.saleDate));
  }

  async getAnimalSaleById(id: string): Promise<AnimalSale | undefined> {
    const [sale] = await db.select().from(schema.animalSales).where(eq(schema.animalSales.id, id));
    return sale;
  }

  async insertAnimalSale(insertSale: InsertAnimalSale): Promise<AnimalSale> {
    const [sale] = await db.insert(schema.animalSales).values(insertSale).returning();
    return sale;
  }

  async updateAnimalSale(id: string, updateData: Partial<InsertAnimalSale>): Promise<AnimalSale | undefined> {
    const [sale] = await db.update(schema.animalSales)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.animalSales.id, id))
      .returning();
    return sale;
  }

  async deleteAnimalSale(id: string): Promise<void> {
    await db.delete(schema.animalSales).where(eq(schema.animalSales.id, id));
  }

  // Performance Goals methods
  async getPerformanceGoals(): Promise<PerformanceGoal[]> {
    return await db.select().from(schema.performanceGoals).orderBy(desc(schema.performanceGoals.createdAt));
  }

  async getPerformanceGoalById(id: string): Promise<PerformanceGoal | undefined> {
    const [goal] = await db.select().from(schema.performanceGoals).where(eq(schema.performanceGoals.id, id));
    return goal;
  }

  async insertPerformanceGoal(insertGoal: InsertPerformanceGoal): Promise<PerformanceGoal> {
    const [goal] = await db.insert(schema.performanceGoals).values(insertGoal).returning();
    return goal;
  }

  async updatePerformanceGoal(id: string, updateData: Partial<InsertPerformanceGoal>): Promise<PerformanceGoal | undefined> {
    const [goal] = await db.update(schema.performanceGoals)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.performanceGoals.id, id))
      .returning();
    return goal;
  }

  async deletePerformanceGoal(id: string): Promise<void> {
    await db.delete(schema.performanceGoals).where(eq(schema.performanceGoals.id, id));
  }

  // Inventory Items methods
  async getInventoryItems(): Promise<InventoryItem[]> {
    return await db.select().from(schema.inventoryItems).orderBy(schema.inventoryItems.itemName);
  }

  async getInventoryItemById(id: string): Promise<InventoryItem | undefined> {
    const [item] = await db.select().from(schema.inventoryItems).where(eq(schema.inventoryItems.id, id));
    return item;
  }

  async insertInventoryItem(insertItem: InsertInventoryItem): Promise<InventoryItem> {
    const [item] = await db.insert(schema.inventoryItems).values(insertItem).returning();
    return item;
  }

  async updateInventoryItem(id: string, updateData: Partial<InsertInventoryItem>): Promise<InventoryItem | undefined> {
    const [item] = await db.update(schema.inventoryItems)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.inventoryItems.id, id))
      .returning();
    return item;
  }

  async deleteInventoryItem(id: string): Promise<void> {
    await db.delete(schema.inventoryItems).where(eq(schema.inventoryItems.id, id));
  }

  // Inventory Transactions methods
  async getInventoryTransactions(): Promise<InventoryTransaction[]> {
    return await db.select().from(schema.inventoryTransactions).orderBy(desc(schema.inventoryTransactions.transactionDate));
  }

  async getInventoryTransactionById(id: string): Promise<InventoryTransaction | undefined> {
    const [transaction] = await db.select().from(schema.inventoryTransactions).where(eq(schema.inventoryTransactions.id, id));
    return transaction;
  }

  async insertInventoryTransaction(insertTransaction: InsertInventoryTransaction): Promise<InventoryTransaction> {
    const [transaction] = await db.insert(schema.inventoryTransactions).values(insertTransaction).returning();
    return transaction;
  }

  // Veterinary Treatments methods
  async getVeterinaryTreatments(animalId?: string): Promise<VeterinaryTreatment[]> {
    if (animalId) {
      return await db.select().from(schema.veterinaryTreatments)
        .where(eq(schema.veterinaryTreatments.animalId, animalId))
        .orderBy(desc(schema.veterinaryTreatments.treatmentDate));
    }
    return await db.select().from(schema.veterinaryTreatments).orderBy(desc(schema.veterinaryTreatments.treatmentDate));
  }

  async getVeterinaryTreatmentById(id: string): Promise<VeterinaryTreatment | undefined> {
    const [treatment] = await db.select().from(schema.veterinaryTreatments).where(eq(schema.veterinaryTreatments.id, id));
    return treatment;
  }

  async insertVeterinaryTreatment(insertTreatment: InsertVeterinaryTreatment): Promise<VeterinaryTreatment> {
    const [treatment] = await db.insert(schema.veterinaryTreatments).values(insertTreatment).returning();
    return treatment;
  }

  async updateVeterinaryTreatment(id: string, updateData: Partial<InsertVeterinaryTreatment>): Promise<VeterinaryTreatment | undefined> {
    const [treatment] = await db.update(schema.veterinaryTreatments)
      .set({ ...updateData, updatedAt: new Date() })
      .where(eq(schema.veterinaryTreatments.id, id))
      .returning();
    return treatment;
  }

  async deleteVeterinaryTreatment(id: string): Promise<void> {
    await db.delete(schema.veterinaryTreatments).where(eq(schema.veterinaryTreatments.id, id));
  }

  // Vouchers methods
  async getVouchers(): Promise<Voucher[]> {
    return await db.select().from(schema.vouchers).orderBy(desc(schema.vouchers.voucherDate));
  }

  async getVoucherById(id: string): Promise<Voucher | undefined> {
    const [voucher] = await db.select().from(schema.vouchers).where(eq(schema.vouchers.id, id));
    return voucher;
  }

  async insertVoucher(insertVoucher: InsertVoucher): Promise<Voucher> {
    const [voucher] = await db.insert(schema.vouchers).values(insertVoucher).returning();
    return voucher;
  }

  async deleteVoucher(id: string): Promise<void> {
    await db.delete(schema.vouchers).where(eq(schema.vouchers.id, id));
  }

  // Clear all data method
  async clearAllData(): Promise<void> {
    await db.delete(schema.veterinaryTreatments);
    await db.delete(schema.inventoryTransactions);
    await db.delete(schema.inventoryItems);
    await db.delete(schema.performanceGoals);
    await db.delete(schema.animalSales);
    await db.delete(schema.batchExpenses);
    await db.delete(schema.batches);
    await db.delete(schema.transactions);
    await db.delete(schema.customers);
    await db.delete(schema.suppliers);
    await db.delete(schema.receptions);
    await db.delete(schema.animals);
    await db.delete(schema.vouchers);
  }
}

// Use Database Storage instead of Memory Storage
export const storage = new DbStorage();
