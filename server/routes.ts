import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import { insertAnimalSchema, insertReceptionSchema, insertSupplierSchema, insertCustomerSchema, insertTransactionSchema, insertVoucherSchema } from "../shared/schema.js";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health endpoint
  app.get("/api/health", async (_req, res) => {
    try {
      // Light probe: list 1 barn if exists to check DB
      try {
        const barns = await storage.getBarns();
        res.json({ status: "ok", barnsCount: barns.length });
      } catch {
        res.json({ status: "ok" });
      }
    } catch (error: any) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });
  // Animals endpoints
  app.get("/api/animals", async (req, res) => {
    try {
      const animals = await storage.getAnimals();
      res.json(animals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/animals", async (req, res) => {
    try {
      const validatedData = insertAnimalSchema.parse(req.body);
      const animal = await storage.insertAnimal(validatedData);
      res.status(201).json(animal);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  app.get("/api/animals/:id", async (req, res) => {
    try {
      const animal = await storage.getAnimalById(req.params.id);
      if (!animal) {
        res.status(404).json({ message: "الحيوان غير موجود" });
        return;
      }
      res.json(animal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/animals/:id", async (req, res) => {
    try {
      const validatedData = insertAnimalSchema.partial().parse(req.body);
      const animal = await storage.updateAnimal(req.params.id, validatedData);
      if (!animal) {
        res.status(404).json({ message: "الحيوان غير موجود" });
        return;
      }
      res.json(animal);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  app.delete("/api/animals/:id", async (req, res) => {
    try {
      await storage.deleteAnimal(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Receptions endpoints
  app.get("/api/receptions", async (req, res) => {
    try {
      const receptions = await storage.getReceptions();
      res.json(receptions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/receptions", async (req, res) => {
    try {
      const validatedData = insertReceptionSchema.parse(req.body);
      const reception = await storage.insertReception(validatedData);
      res.status(201).json(reception);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  app.get("/api/receptions/:id", async (req, res) => {
    try {
      const reception = await storage.getReceptionById(req.params.id);
      if (!reception) {
        res.status(404).json({ message: "الاستقبال غير موجود" });
        return;
      }
      res.json(reception);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/receptions/:id/distribute", async (req, res) => {
    try {
      const { animals } = req.body;
      const reception = await storage.getReceptionById(req.params.id);
      
      if (!reception) {
        res.status(404).json({ message: "الاستقبال غير موجود" });
        return;
      }

      // إضافة كل حيوان إلى قاعدة البيانات
      const addedAnimals = [];
      for (const animalData of animals) {
        // البحث عن الدفعة للحصول على ID
        let batchId: string | null = null;
        if (animalData.batchNumber) {
          const batches = await storage.getBatches();
          const batch = batches.find(b => b.batchNumber === animalData.batchNumber);
          if (batch) {
            batchId = batch.id;
          }
        }

        const animal = await storage.insertAnimal({
          earTag: animalData.earTag,
          animalType: animalData.animalType,
          sex: animalData.sex,
          entryWeight: animalData.weight,
          currentWeight: animalData.weight,
          penNumber: animalData.penNumber,
          batchNumber: animalData.batchNumber || "",
          batchId: batchId ?? undefined,
          purchaseCost: animalData.calculatedCost,
          notes: `من دفعة ${reception.receptionNumber}`,
          status: "active",
        });
        addedAnimals.push(animal);
      }

      // تحديث حالة الاستقبال
      await storage.updateReception(req.params.id, { status: "distributed" });

      res.status(201).json({ animals: addedAnimals });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/receptions/:id", async (req, res) => {
    try {
      const validatedData = insertReceptionSchema.partial().parse(req.body);
      const reception = await storage.updateReception(req.params.id, validatedData);
      if (!reception) {
        res.status(404).json({ message: "الاستقبال غير موجود" });
        return;
      }
      res.json(reception);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  app.delete("/api/receptions/:id", async (req, res) => {
    try {
      await storage.deleteReception(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Suppliers endpoints
  app.get("/api/suppliers", async (req, res) => {
    try {
      const suppliers = await storage.getSuppliers();
      res.json(suppliers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/suppliers", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.parse(req.body);
      const supplier = await storage.insertSupplier(validatedData);
      res.status(201).json(supplier);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  app.get("/api/suppliers/:id", async (req, res) => {
    try {
      const supplier = await storage.getSupplierById(req.params.id);
      if (!supplier) {
        res.status(404).json({ message: "المورد غير موجود" });
        return;
      }
      res.json(supplier);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/suppliers/:id", async (req, res) => {
    try {
      const validatedData = insertSupplierSchema.partial().parse(req.body);
      const supplier = await storage.updateSupplier(req.params.id, validatedData);
      if (!supplier) {
        res.status(404).json({ message: "المورد غير موجود" });
        return;
      }
      res.json(supplier);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  app.delete("/api/suppliers/:id", async (req, res) => {
    try {
      await storage.deleteSupplier(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Customers endpoints
  app.get("/api/customers", async (req, res) => {
    try {
      const customers = await storage.getCustomers();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/customers", async (req, res) => {
    try {
      const validatedData = insertCustomerSchema.parse(req.body);
      const customer = await storage.insertCustomer(validatedData);
      res.status(201).json(customer);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  // Transactions endpoints
  app.get("/api/transactions", async (req, res) => {
    try {
      const transactions = await storage.getTransactions();
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/transactions", async (req, res) => {
    try {
      const validatedData = insertTransactionSchema.parse(req.body);
      const transaction = await storage.insertTransaction(validatedData);
      res.status(201).json(transaction);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  // Batches (Cost Centers) endpoints
  app.get("/api/batches", async (req, res) => {
    try {
      const batches = await storage.getBatches();
      res.json(batches);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/batches", async (req, res) => {
    try {
      const batch = await storage.insertBatch(req.body);
      res.status(201).json(batch);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/batches/:id", async (req, res) => {
    try {
      const batch = await storage.getBatchById(req.params.id);
      if (!batch) {
        res.status(404).json({ message: "الدفعة غير موجودة" });
        return;
      }
      res.json(batch);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/batches/:id", async (req, res) => {
    try {
      const batch = await storage.updateBatch(req.params.id, req.body);
      if (!batch) {
        res.status(404).json({ message: "الدفعة غير موجودة" });
        return;
      }
      res.json(batch);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/batches/:id", async (req, res) => {
    try {
      await storage.deleteBatch(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Performance Goals endpoints
  app.get("/api/performance-goals", async (req, res) => {
    try {
      const goals = await storage.getPerformanceGoals();
      res.json(goals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/performance-goals", async (req, res) => {
    try {
      const goal = await storage.insertPerformanceGoal(req.body);
      res.status(201).json(goal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/performance-goals/:id", async (req, res) => {
    try {
      const goal = await storage.getPerformanceGoalById(req.params.id);
      if (!goal) {
        res.status(404).json({ message: "الهدف غير موجود" });
        return;
      }
      res.json(goal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/performance-goals/:id", async (req, res) => {
    try {
      const goal = await storage.updatePerformanceGoal(req.params.id, req.body);
      if (!goal) {
        res.status(404).json({ message: "الهدف غير موجود" });
        return;
      }
      res.json(goal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/performance-goals/:id", async (req, res) => {
    try {
      await storage.deletePerformanceGoal(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Batch Expenses endpoints
  app.get("/api/batch-expenses", async (req, res) => {
    try {
      const expenses = await storage.getBatchExpenses();
      res.json(expenses);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/batch-expenses", async (req, res) => {
    try {
      const expense = await storage.insertBatchExpense(req.body);
      res.status(201).json(expense);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/batch-expenses/:id", async (req, res) => {
    try {
      const expense = await storage.getBatchExpenseById(req.params.id);
      if (!expense) {
        res.status(404).json({ message: "المصروف غير موجود" });
        return;
      }
      res.json(expense);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/batch-expenses/:id", async (req, res) => {
    try {
      await storage.deleteBatchExpense(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Inventory Items endpoints
  app.get("/api/inventory", async (req, res) => {
    try {
      const items = await storage.getInventory();
      res.json(items);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Inventory Transactions endpoints - must come before /api/inventory/:id
  app.get("/api/inventory/transactions", async (req, res) => {
    try {
      const transactions = await storage.getInventoryTransactions();
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/inventory/transactions/:id", async (req, res) => {
    try {
      const transaction = await storage.getInventoryTransactionById(req.params.id);
      if (!transaction) {
        res.status(404).json({ message: "الحركة غير موجودة" });
        return;
      }
      res.json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/inventory/transactions", async (req, res) => {
    try {
      const transaction = await storage.insertInventoryTransaction(req.body);
      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/inventory/:id", async (req, res) => {
    try {
      const item = await storage.getInventoryItemById(req.params.id);
      if (!item) {
        res.status(404).json({ message: "الصنف غير موجود" });
        return;
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/inventory", async (req, res) => {
    try {
      const item = await storage.insertInventoryItem(req.body);
      res.status(201).json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/inventory/:id", async (req, res) => {
    try {
      const item = await storage.updateInventoryItem(req.params.id, req.body);
      if (!item) {
        res.status(404).json({ message: "الصنف غير موجود" });
        return;
      }
      res.json(item);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/inventory/:id", async (req, res) => {
    try {
      await storage.deleteInventoryItem(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Dispense from inventory (صرف)
  app.post("/api/inventory/dispense", async (req, res) => {
    try {
      const { itemId, quantity, batchId, animalId, penNumber, description, notes } = req.body;
      
      console.log("🔵 Dispense request received:", { itemId, quantity, batchId, animalId, penNumber, description });
      
      // Validate input
      if (!itemId || typeof itemId !== "string") {
        res.status(400).json({ message: "itemId is required" });
        return;
      }
      if (quantity == null || isNaN(Number(quantity))) {
        res.status(400).json({ message: "quantity is required" });
        return;
      }
      const qtyNum = Number(quantity);

      // Validate item exists
      const item = await storage.getInventoryItemById(itemId as string);
      if (!item) {
        console.log("❌ Item not found:", itemId);
        res.status(404).json({ message: "الصنف غير موجود" });
        return;
      }
      
      console.log("✅ Item found:", item.itemName, "Current stock:", item.currentStock);

      // Check stock availability
      const currentStock = parseFloat(item.currentStock);
      if (currentStock < qtyNum) {
        console.log("❌ Insufficient stock. Available:", currentStock, "Requested:", quantity);
        res.status(400).json({ 
          message: `المخزون غير كافٍ. المتاح: ${currentStock} ${item.unit}` 
        });
        return;
      }

      // Generate transaction number
      const transactionCount = (await storage.getInventoryTransactions()).filter(
        t => t.transactionType === "out"
      ).length;
      const transactionNumber = `OUT-${new Date().getFullYear()}-${String(transactionCount + 1).padStart(3, "0")}`;

      // Create transaction
      const unitCost = parseFloat(item.unitCost || "0");
      const transaction = await storage.insertInventoryTransaction({
        transactionNumber,
        transactionDate: new Date(),
        transactionType: "out",
        itemId,
        quantity: qtyNum.toString(),
        unitCost: item.unitCost ?? undefined,
        totalCost: (qtyNum * unitCost).toFixed(2),
        referenceType: batchId ? "batch_expense" : animalId ? "treatment" : undefined,
        referenceId: undefined,
        notes,
      });

      // Update animal cost if applicable
      if (typeof animalId === "string" && animalId.length > 0) {
        const animal = await storage.getAnimalById(animalId);
        if (animal) {
          const categoryLower = item.category.toLowerCase();
          const expenseType = (categoryLower.includes("feed") || categoryLower.includes("علف")) ? "Feed" : "Treatment";
          const currentCost = parseFloat(animal[`accumulated${expenseType}Cost`] || "0");
          const newCost = currentCost + parseFloat(transaction.totalCost || "0");
          
          await storage.updateAnimal(animalId, {
            [`accumulated${expenseType}Cost`]: newCost.toString(),
          });
        }
      }

      console.log("✅ Dispense completed successfully. Transaction ID:", transaction.id);
      res.status(201).json(transaction);
    } catch (error: any) {
      console.error("❌ Dispense error:", error.message);
      res.status(500).json({ message: error.message });
    }
  });

  // Veterinary Treatments endpoints
  app.get("/api/treatments", async (req, res) => {
    try {
      const animalId = req.query.animalId as string | undefined;
      const treatments = await storage.getVeterinaryTreatments(animalId);
      res.json(treatments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/treatments/:id", async (req, res) => {
    try {
      const treatment = await storage.getVeterinaryTreatmentById(req.params.id);
      if (!treatment) {
        res.status(404).json({ message: "التقرير الطبي غير موجود" });
        return;
      }
      res.json(treatment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/treatments", async (req, res) => {
    try {
      console.log("📋 Creating veterinary treatment:", req.body);
      
      // Parse the data from the request (align with schema)
      const treatmentData = {
        animalId: req.body.animalId,
        veterinarian: req.body.veterinarian,
        treatmentDate: req.body.treatmentDate ? new Date(req.body.treatmentDate) : new Date(),
        treatmentType: req.body.treatmentType,
        medication: req.body.medication || null,
        dosage: req.body.dosage || null,
        diagnosis: req.body.diagnosis || null,
        treatment: req.body.treatment || null,
        cost: req.body.cost?.toString() || null,
        status: req.body.status || "ongoing",
        notes: req.body.notes || null,
      };

      const treatment = await storage.insertVeterinaryTreatment(treatmentData);
      console.log("✅ Treatment created successfully. ID:", treatment.id);
      res.status(201).json(treatment);
    } catch (error: any) {
      console.error("❌ Treatment creation error:", error.message);
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/treatments/:id", async (req, res) => {
    try {
      const updateData = {
        treatmentDate: req.body.treatmentDate ? new Date(req.body.treatmentDate) : undefined,
        treatmentType: req.body.treatmentType,
        veterinarian: req.body.veterinarian,
        medication: req.body.medication,
        dosage: req.body.dosage,
        diagnosis: req.body.diagnosis,
        treatment: req.body.treatment,
        cost: req.body.cost?.toString(),
        status: req.body.status,
        notes: req.body.notes,
      };

      const treatment = await storage.updateVeterinaryTreatment(req.params.id, updateData);
      if (!treatment) {
        res.status(404).json({ message: "التقرير الطبي غير موجود" });
        return;
      }
      res.json(treatment);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/treatments/:id", async (req, res) => {
    try {
      await storage.deleteVeterinaryTreatment(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Get animal treatment history
  app.get("/api/animals/:id/treatments", async (req, res) => {
    try {
      const treatments = await storage.getVeterinaryTreatments(req.params.id);
      res.json(treatments);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Vouchers endpoints
  app.get("/api/vouchers", async (req, res) => {
    try {
      const vouchers = await storage.getVouchers();
      res.json(vouchers);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/vouchers", async (req, res) => {
    try {
      const validatedData = insertVoucherSchema.parse(req.body);
      const voucher = await storage.insertVoucher(validatedData);
      res.status(201).json(voucher);
    } catch (error: any) {
      if (error.name === "ZodError") {
        res.status(400).json({ message: "بيانات غير صحيحة", errors: error.errors });
      } else {
        res.status(500).json({ message: error.message });
      }
    }
  });

  app.get("/api/vouchers/:id", async (req, res) => {
    try {
      const voucher = await storage.getVoucherById(req.params.id);
      if (!voucher) {
        res.status(404).json({ message: "السند غير موجود" });
        return;
      }
      res.json(voucher);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/vouchers/:id", async (req, res) => {
    try {
      await storage.deleteVoucher(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // 💰 ACCOUNTING ENTRIES ENDPOINTS
  app.get("/api/accounting-entries", async (req, res) => {
    try {
      const entries = await storage.getAccountingEntries();
      res.json(entries);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/accounting-entries", async (req, res) => {
    try {
      const entry = await storage.insertAccountingEntry(req.body);
      res.status(201).json(entry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/accounting-entries/:id", async (req, res) => {
    try {
      const entry = await storage.getAccountingEntryById(req.params.id);
      if (!entry) {
        res.status(404).json({ message: "القيد المحاسبي غير موجود" });
        return;
      }
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/accounting-entries/:id", async (req, res) => {
    try {
      const entry = await storage.updateAccountingEntry(req.params.id, req.body);
      if (!entry) {
        res.status(404).json({ message: "القيد المحاسبي غير موجود" });
        return;
      }
      res.json(entry);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/accounting-entries/:id", async (req, res) => {
    try {
      await storage.deleteAccountingEntry(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // 📊 FINANCIAL REPORTS ENDPOINTS
  app.get("/api/reports/trial-balance", async (req, res) => {
    try {
      const trialBalance = await storage.getTrialBalance();
      res.json(trialBalance);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reports/profit-loss", async (req, res) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(new Date().getFullYear(), 0, 1);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      
      const report = await storage.getProfitLossReport(startDate, endDate);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reports/balance-sheet", async (req, res) => {
    try {
      const date = req.query.date ? new Date(req.query.date as string) : new Date();
      
      const report = await storage.getBalanceSheet(date);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/reports/cash-flow", async (req, res) => {
    try {
      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : new Date(new Date().getFullYear(), 0, 1);
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : new Date();
      
      const report = await storage.getCashFlowReport(startDate, endDate);
      res.json(report);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // 🔄 AUTO-ACCOUNTING: Create accounting entries when transactions happen
  app.post("/api/auto-accounting/animal-purchase", async (req, res) => {
    try {
      const { animalId, supplierId, amount, description } = req.body;
      
      // Generate entry number
      const entryNumber = `AP-${Date.now()}`;
      
      // Debit: Animals Asset
      await storage.insertAccountingEntry({
        entryNumber: entryNumber + "-1",
        relatedType: "animal",
        relatedId: animalId,
        accountCode: "1200",
        accountName: "الحيوانات",
        debitAmount: amount.toString(),
        creditAmount: "0",
        description: `شراء حيوان - ${description}`
      } as any);
      
      // Credit: Accounts Payable or Cash
      await storage.insertAccountingEntry({
        entryNumber: entryNumber + "-2", 
        relatedType: "supplier",
        relatedId: supplierId,
        accountCode: "2100",
        accountName: "الموردين",
        debitAmount: "0",
        creditAmount: amount.toString(),
        description: `شراء حيوان - ${description}`
      } as any);
      
      res.json({ message: "تم إنشاء القيود المحاسبية بنجاح", entryNumber });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/auto-accounting/animal-sale", async (req, res) => {
    try {
      const { animalId, customerId, saleAmount, costAmount, description } = req.body;
      
      const entryNumber = `AS-${Date.now()}`;
      
      // Debit: Cash/Customers
      await storage.insertAccountingEntry({
        entryNumber: entryNumber + "-1",
        relatedType: "customer",
        relatedId: customerId,
        accountCode: "1010",
        accountName: "النقدية",
        debitAmount: saleAmount.toString(),
        creditAmount: "0",
        description: `بيع حيوان - ${description}`
      } as any);
      
      // Credit: Sales Revenue
      await storage.insertAccountingEntry({
        entryNumber: entryNumber + "-2",
        relatedType: "animal",
        relatedId: animalId,
        accountCode: "4100",
        accountName: "إيرادات المبيعات",
        debitAmount: "0",
        creditAmount: saleAmount.toString(),
        description: `بيع حيوان - ${description}`
      } as any);
      
      // Debit: Cost of Goods Sold
      await storage.insertAccountingEntry({
        entryNumber: entryNumber + "-3",
        relatedType: "animal", 
        relatedId: animalId,
        accountCode: "5100",
        accountName: "تكلفة البضاعة المباعة",
        debitAmount: costAmount.toString(),
        creditAmount: "0",
        description: `تكلفة حيوان مباع - ${description}`
      } as any);
      
      // Credit: Animals Asset
      await storage.insertAccountingEntry({
        entryNumber: entryNumber + "-4",
        relatedType: "animal",
        relatedId: animalId, 
        accountCode: "1200",
        accountName: "الحيوانات",
        debitAmount: "0",
        creditAmount: costAmount.toString(),
        description: `تكلفة حيوان مباع - ${description}`
      } as any);
      
      res.json({ message: "تم إنشاء قيود البيع بنجاح", entryNumber });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Clear all data endpoint
  // Barns endpoints
  app.get("/api/barns", async (req, res) => {
    try {
      const barns = await storage.getBarns();
      res.json(barns);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/barns", async (req, res) => {
    try {
      const barn = await storage.insertBarn(req.body);
      res.status(201).json(barn);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.get("/api/barns/:id", async (req, res) => {
    try {
      const barn = await storage.getBarnById(req.params.id);
      if (!barn) {
        res.status(404).json({ message: "العنبر غير موجود" });
        return;
      }
      res.json(barn);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/barns/:id", async (req, res) => {
    try {
      const barn = await storage.updateBarn(req.params.id, req.body);
      if (!barn) {
        res.status(404).json({ message: "العنبر غير موجود" });
        return;
      }
      res.json(barn);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/barns/:id", async (req, res) => {
    try {
      await storage.deleteBarn(req.params.id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/clear-all-data", async (req, res) => {
    try {
      await storage.clearAllData();
      res.json({ message: "جميع البيانات تم حذفها بنجاح" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  // Goals endpoints
  app.get("/api/goals", async (req, res) => {
    try {
      const goals = await storage.getGoals();
      res.json(goals);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const goal = await storage.insertGoal(req.body);
      res.status(201).json(goal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.put("/api/goals/:id", async (req, res) => {
    try {
      const goal = await storage.updateGoal(req.params.id, req.body);
      res.json(goal);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  app.delete("/api/goals/:id", async (req, res) => {
    try {
      await storage.deleteGoal(req.params.id);
      res.json({ message: "تم حذف الهدف بنجاح" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  // ========= BULK IMPORT ENDPOINT =========
  // Accepts arrays of entities and upserts by natural unique keys
  app.post("/api/import/bulk", async (req, res) => {
    const body = req.body || {};

    const result: any = {};
    async function processArray<T>(items: T[] | undefined, handler: (item: any) => Promise<void>, label: string) {
      const summary = { inserted: 0, updated: 0, errors: 0, errorDetails: [] as any[] };
      if (!Array.isArray(items) || items.length === 0) {
        result[label] = summary;
        return;
      }
      for (const item of items) {
        try {
          await handler(item);
        } catch (e: any) {
          summary.errors += 1;
          summary.errorDetails.push({ item, message: e?.message || String(e) });
        }
      }
      result[label] = summary;
    }

    try {
      // Animals: upsert by earTag
      await processArray(body.animals, async (raw) => {
        if (!raw?.earTag) throw new Error("animal.earTag is required");
        // Keep partial allowed but enforce required for insert
        const exists = await storage.getAnimalByEarTag(raw.earTag);
        if (!exists) {
          // For insert, require minimum fields
          const required = { earTag: raw.earTag, animalType: raw.animalType, sex: raw.sex, entryWeight: raw.entryWeight };
          if (!required.animalType || !required.sex || !required.entryWeight) {
            throw new Error("animal insert requires animalType, sex, entryWeight");
          }
        }
        const { action } = await storage.upsertAnimalByEarTag(raw);
        const s = result.animals || { inserted: 0, updated: 0, errors: 0, errorDetails: [] };
        s[action === "insert" ? "inserted" : "updated"] += 1;
        result.animals = s;
      }, "animals");

      // Suppliers: upsert by supplierNumber
      await processArray(body.suppliers, async (raw) => {
        if (!raw?.supplierNumber) throw new Error("supplier.supplierNumber is required");
        const exists = await storage.getSupplierByNumber(raw.supplierNumber);
        if (!exists) {
          if (!raw.name) throw new Error("supplier insert requires name");
        }
        const { action } = await storage.upsertSupplierByNumber(raw);
        const s = result.suppliers || { inserted: 0, updated: 0, errors: 0, errorDetails: [] };
        s[action === "insert" ? "inserted" : "updated"] += 1;
        result.suppliers = s;
      }, "suppliers");

      // Customers: upsert by customerNumber
      await processArray(body.customers, async (raw) => {
        if (!raw?.customerNumber) throw new Error("customer.customerNumber is required");
        const exists = await storage.getCustomerByNumber(raw.customerNumber);
        if (!exists) {
          if (!raw.name) throw new Error("customer insert requires name");
        }
        const { action } = await storage.upsertCustomerByNumber(raw);
        const s = result.customers || { inserted: 0, updated: 0, errors: 0, errorDetails: [] };
        s[action === "insert" ? "inserted" : "updated"] += 1;
        result.customers = s;
      }, "customers");

      // Inventory Items: upsert by itemCode
      await processArray(body.inventoryItems, async (raw) => {
        if (!raw?.itemCode) throw new Error("inventory.itemCode is required");
        const exists = await storage.getInventoryItemByCode(raw.itemCode);
        if (!exists) {
          if (!raw.itemName || !raw.category || !raw.unit) {
            throw new Error("inventory insert requires itemName, category, unit");
          }
        }
        const { action } = await storage.upsertInventoryItemByCode(raw);
        const s = result.inventoryItems || { inserted: 0, updated: 0, errors: 0, errorDetails: [] };
        s[action === "insert" ? "inserted" : "updated"] += 1;
        result.inventoryItems = s;
      }, "inventoryItems");

      // Transactions: upsert by transactionNumber
      await processArray(body.transactions, async (raw) => {
        if (!raw?.transactionNumber) throw new Error("transaction.transactionNumber is required");
        const exists = await storage.getTransactionByNumber(raw.transactionNumber);
        if (!exists) {
          if (!raw.transactionType || !raw.amount) {
            throw new Error("transaction insert requires transactionType, amount");
          }
        }
        const { action } = await storage.upsertTransactionByNumber(raw);
        const s = result.transactions || { inserted: 0, updated: 0, errors: 0, errorDetails: [] };
        s[action === "insert" ? "inserted" : "updated"] += 1;
        result.transactions = s;
      }, "transactions");

      // Batches: upsert by batchNumber
      await processArray(body.batches, async (raw) => {
        if (!raw?.batchNumber) throw new Error("batch.batchNumber is required");
        const exists = await storage.getBatchByNumber(raw.batchNumber);
        if (!exists) {
          if (!raw.batchName || typeof raw.capacity === "undefined") {
            throw new Error("batch insert requires batchName, capacity");
          }
        }
        const { action } = await storage.upsertBatchByNumber(raw);
        const s = result.batches || { inserted: 0, updated: 0, errors: 0, errorDetails: [] };
        s[action === "insert" ? "inserted" : "updated"] += 1;
        result.batches = s;
      }, "batches");

      // Receptions: upsert by receptionNumber
      await processArray(body.receptions, async (raw) => {
        if (!raw?.receptionNumber) throw new Error("reception.receptionNumber is required");
        const exists = await storage.getReceptionByNumber(raw.receptionNumber);
        if (!exists) {
          if (!raw.supplierId || !raw.totalAnimals || !raw.totalWeight || !raw.pricePerKg) {
            throw new Error("reception insert requires supplierId, totalAnimals, totalWeight, pricePerKg");
          }
        }
        const { action } = await storage.upsertReceptionByNumber(raw);
        const s = result.receptions || { inserted: 0, updated: 0, errors: 0, errorDetails: [] };
        s[action === "insert" ? "inserted" : "updated"] += 1;
        result.receptions = s;
      }, "receptions");

      // Barns: upsert by barnNumber
      await processArray(body.barns, async (raw) => {
        if (!raw?.barnNumber) throw new Error("barn.barnNumber is required");
        const exists = await storage.getBarnByNumber(raw.barnNumber);
        if (!exists) {
          if (!raw.barnName || typeof raw.capacity === "undefined") {
            throw new Error("barn insert requires barnName, capacity");
          }
        }
        const { action } = await storage.upsertBarnByNumber(raw);
        const s = result.barns || { inserted: 0, updated: 0, errors: 0, errorDetails: [] };
        s[action === "insert" ? "inserted" : "updated"] += 1;
        result.barns = s;
      }, "barns");

      res.status(200).json({ message: "Import completed", result });
    } catch (error: any) {
      res.status(500).json({ message: error.message, result });
    }
  });

  return httpServer;
}
