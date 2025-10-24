import express from "express";
import cors from "cors";
import { storage } from "./server/storage.ts";

const app = express();

app.use(cors());
app.use(express.json());

// Keep alive mechanism
let isAlive = true;
setInterval(() => {
  if (isAlive) {
    console.log("🔄 Server keep-alive ping:", new Date().toLocaleTimeString());
  }
}, 30000);

// Test endpoints
app.get("/api/batches", async (req, res) => {
  try {
    const batches = await storage.getBatches();
    console.log(`📦 Retrieved ${batches.length} batches`);
    res.json(batches);
  } catch (error) {
    console.error("❌ Error getting batches:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/batches", async (req, res) => {
  try {
    console.log("📝 Creating batch:", req.body);
    const batch = await storage.insertBatch(req.body);
    console.log("✅ Batch created:", batch.id);
    res.status(201).json(batch);
  } catch (error) {
    console.error("❌ Error creating batch:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/animals", async (req, res) => {
  try {
    const animals = await storage.getAnimals();
    console.log(`🐄 Retrieved ${animals.length} animals`);
    res.json(animals);
  } catch (error) {
    console.error("❌ Error getting animals:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/animals", async (req, res) => {
  try {
    console.log("📝 Creating animal:", req.body);
    const animal = await storage.insertAnimal(req.body);
    console.log("✅ Animal created:", animal.id);
    res.status(201).json(animal);
  } catch (error) {
    console.error("❌ Error creating animal:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/accounting-entries", async (req, res) => {
  try {
    const entries = await storage.getAccountingEntries();
    console.log(`💰 Retrieved ${entries.length} accounting entries`);
    res.json(entries);
  } catch (error) {
    console.error("❌ Error getting accounting entries:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/accounting-entries", async (req, res) => {
  try {
    console.log("📝 Creating accounting entry:", req.body);
    const entry = await storage.insertAccountingEntry(req.body);
    console.log("✅ Accounting entry created:", entry.id);
    res.status(201).json(entry);
  } catch (error) {
    console.error("❌ Error creating accounting entry:", error);
    res.status(500).json({ message: error.message });
  }
});

app.get("/api/performance-goals", async (req, res) => {
  try {
    const goals = await storage.getPerformanceGoals();
    console.log(`📈 Retrieved ${goals.length} performance goals (KPIs)`);
    res.json(goals);
  } catch (error) {
    console.error("❌ Error getting performance goals:", error);
    res.status(500).json({ message: error.message });
  }
});

app.post("/api/performance-goals", async (req, res) => {
  try {
    console.log("📝 Creating performance goal:", req.body);
    const goal = await storage.insertPerformanceGoal(req.body);
    console.log("✅ Performance goal created:", goal.id);
    res.status(201).json(goal);
  } catch (error) {
    console.error("❌ Error creating performance goal:", error);
    res.status(500).json({ message: error.message });
  }
});

// Health check
app.get("/health", (req, res) => {
  res.json({ 
    status: "ok", 
    time: new Date().toISOString(),
    uptime: process.uptime()
  });
});

const port = 5002;
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`🧪 Test server running on http://0.0.0.0:${port}`);
  console.log(`📊 Ready to test data persistence!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 Received SIGTERM, shutting down gracefully');
  isAlive = false;
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 Received SIGINT, shutting down gracefully');
  isAlive = false;
  server.close(() => {
    console.log('👋 Server closed');
    process.exit(0);
  });
});