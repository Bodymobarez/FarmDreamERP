import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnimalSchema, insertReceptionSchema, insertSupplierSchema, insertCustomerSchema, insertTransactionSchema, insertVoucherSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
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
        const animal = await storage.insertAnimal({
          earTag: animalData.earTag,
          animalType: animalData.animalType,
          sex: animalData.sex,
          entryWeight: animalData.weight,
          currentWeight: animalData.weight,
          penNumber: animalData.penNumber,
          batchNumber: animalData.batchNumber || "",
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
      const items = await storage.getInventoryItems();
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
      
      // Validate item exists
      const item = await storage.getInventoryItemById(itemId);
      if (!item) {
        console.log("❌ Item not found:", itemId);
        res.status(404).json({ message: "الصنف غير موجود" });
        return;
      }
      
      console.log("✅ Item found:", item.itemName, "Current stock:", item.currentStock);

      // Check stock availability
      const currentStock = parseFloat(item.currentStock);
      if (currentStock < quantity) {
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
      const transaction = await storage.insertInventoryTransaction({
        transactionNumber,
        transactionDate: new Date(),
        transactionType: "out",
        itemId,
        quantity: quantity.toString(),
        unitCost: item.unitCost,
        totalCost: (quantity * parseFloat(item.unitCost)).toFixed(2),
        penNumber,
        batchId,
        animalId,
        supplierId: null,
        purchaseOrderNumber: null,
        invoiceNumber: null,
        referenceType: batchId ? "batch_expense" : animalId ? "treatment" : null,
        referenceId: null,
        performedBy: "النظام",
        description,
        notes,
      });

      // Update batch expense if applicable
      if (batchId) {
        const batch = await storage.getBatchById(batchId);
        if (batch) {
          const expenseType = item.itemType === "feed" ? "feed" : "medicine";
          const currentCost = parseFloat(
            expenseType === "feed" ? batch.totalFeedCost : batch.totalTreatmentCost
          );
          const newCost = currentCost + parseFloat(transaction.totalCost);
          
          await storage.updateBatch(batchId, {
            [expenseType === "feed" ? "totalFeedCost" : "totalTreatmentCost"]: newCost.toString(),
          });
        }
      }

      // Update animal cost if applicable
      if (animalId) {
        const animal = await storage.getAnimalById(animalId);
        if (animal) {
          const expenseType = item.itemType === "feed" ? "Feed" : "Treatment";
          const currentCost = parseFloat(animal[`accumulated${expenseType}Cost`] || "0");
          const newCost = currentCost + parseFloat(transaction.totalCost);
          
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
      
      // Parse the data from the request
      const treatmentData = {
        animalId: req.body.animalId,
        veterinarian: req.body.veterinarian,
        treatmentDate: req.body.treatmentDate ? new Date(req.body.treatmentDate) : new Date(),
        treatmentType: req.body.treatmentType,
        temperature: req.body.temperature || null,
        heartRate: req.body.heartRate || null,
        respiratoryRate: req.body.respiratoryRate || null,
        appetite: req.body.appetite || null,
        behavior: req.body.behavior || null,
        mobility: req.body.mobility || null,
        symptoms: req.body.symptoms ? JSON.stringify(req.body.symptoms) : null,
        diagnosisCategory: req.body.diagnosisCategory || null,
        diagnosisDescription: req.body.diagnosisDescription,
        severity: req.body.severity,
        medications: req.body.medications ? JSON.stringify(req.body.medications) : null,
        isolation: req.body.isolation || null,
        dietRecommendations: req.body.dietRecommendations || null,
        followUpDate: req.body.followUpDate ? new Date(req.body.followUpDate) : null,
        specialInstructions: req.body.specialInstructions || null,
        vetNotes: req.body.vetNotes || null,
        estimatedCost: req.body.estimatedCost?.toString() || "0",
        actualCost: req.body.actualCost?.toString() || "0",
        status: req.body.status || "ongoing",
        completedDate: req.body.completedDate ? new Date(req.body.completedDate) : null,
        outcome: req.body.outcome || null,
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
        ...req.body,
        treatmentDate: req.body.treatmentDate ? new Date(req.body.treatmentDate) : undefined,
        followUpDate: req.body.followUpDate ? new Date(req.body.followUpDate) : undefined,
        completedDate: req.body.completedDate ? new Date(req.body.completedDate) : undefined,
        symptoms: req.body.symptoms ? JSON.stringify(req.body.symptoms) : undefined,
        medications: req.body.medications ? JSON.stringify(req.body.medications) : undefined,
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

  // Clear all data endpoint
  app.delete("/api/clear-all-data", async (req, res) => {
    try {
      await storage.clearAllData();
      res.json({ message: "جميع البيانات تم حذفها بنجاح" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
