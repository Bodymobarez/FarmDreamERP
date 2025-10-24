const express = require('express');
const cors = require('cors');
const http = require('http');

// Database connection - use CommonJS paths
const { createDb } = require('./db.ts');
const { createStorage } = require('./storage.ts');

// Simple log function
const log = (message) => console.log(message);

// Initialize database
const db = createDb('postgresql://neondb_owner:FqfJy2dLNKAJ@ep-winter-grass-a5tqvpmc.us-east-2.aws.neon.tech/neondb?sslmode=require');
const storage = createStorage(db);

const app = express();

// Enable CORS
app.use(cors({
  origin: [
    'https://farm.adsolutions-eg.com',
    'http://localhost:5001',
    'http://localhost:5173', // Vite dev server
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// API Routes

// Batch routes
app.get('/api/batches', async (req, res) => {
  try {
    console.log('[STABLE SERVER] Fetching batches...');
    const batches = await storage.getBatches();
    console.log(`[STABLE SERVER] Found ${batches.length || 0} batches`);
    res.json(batches || []);
  } catch (error) {
    console.error('[STABLE SERVER] Error fetching batches:', error);
    res.status(500).json({ error: 'Failed to fetch batches' });
  }
});

app.post('/api/batches', async (req, res) => {
  try {
    console.log('[STABLE SERVER] Creating batch:', req.body);
    const batch = await storage.insertBatch(req.body);
    console.log('[STABLE SERVER] Batch created:', batch);
    res.json(batch);
  } catch (error) {
    console.error('[STABLE SERVER] Error creating batch:', error);
    res.status(500).json({ error: 'Failed to create batch' });
  }
});

// Animal routes
app.get('/api/animals', async (req, res) => {
  try {
    console.log('[STABLE SERVER] Fetching animals...');
    const animals = await storage.getAnimals();
    console.log(`[STABLE SERVER] Found ${animals.length || 0} animals`);
    res.json(animals || []);
  } catch (error) {
    console.error('[STABLE SERVER] Error fetching animals:', error);
    res.status(500).json({ error: 'Failed to fetch animals' });
  }
});

app.post('/api/animals', async (req, res) => {
  try {
    console.log('[STABLE SERVER] Creating animal:', req.body);
    const animal = await storage.insertAnimal(req.body);
    console.log('[STABLE SERVER] Animal created:', animal);
    res.json(animal);
  } catch (error) {
    console.error('[STABLE SERVER] Error creating animal:', error);
    res.status(500).json({ error: 'Failed to create animal' });
  }
});

// Accounting routes
app.get('/api/accounting', async (req, res) => {
  try {
    console.log('[STABLE SERVER] Fetching accounting entries...');
    const entries = await storage.getAccountingEntries();
    console.log(`[STABLE SERVER] Found ${entries.length || 0} accounting entries`);
    res.json(entries || []);
  } catch (error) {
    console.error('[STABLE SERVER] Error fetching accounting entries:', error);
    res.status(500).json({ error: 'Failed to fetch accounting entries' });
  }
});

app.post('/api/accounting', async (req, res) => {
  try {
    console.log('[STABLE SERVER] Creating accounting entry:', req.body);
    const entry = await storage.insertAccountingEntry(req.body);
    console.log('[STABLE SERVER] Accounting entry created:', entry);
    res.json(entry);
  } catch (error) {
    console.error('[STABLE SERVER] Error creating accounting entry:', error);
    res.status(500).json({ error: 'Failed to create accounting entry' });
  }
});

// Performance Goals routes
app.get('/api/performance-goals', async (req, res) => {
  try {
    console.log('[STABLE SERVER] Fetching performance goals...');
    const goals = await storage.getPerformanceGoals();
    console.log(`[STABLE SERVER] Found ${goals.length || 0} performance goals`);
    res.json(goals || []);
  } catch (error) {
    console.error('[STABLE SERVER] Error fetching performance goals:', error);
    res.status(500).json({ error: 'Failed to fetch performance goals' });
  }
});

app.post('/api/performance-goals', async (req, res) => {
  try {
    console.log('[STABLE SERVER] Creating performance goal:', req.body);
    const goal = await storage.insertPerformanceGoal(req.body);
    console.log('[STABLE SERVER] Performance goal created:', goal);
    res.json(goal);
  } catch (error) {
    console.error('[STABLE SERVER] Error creating performance goal:', error);
    res.status(500).json({ error: 'Failed to create performance goal' });
  }
});

// Suppliers routes
app.get('/api/suppliers', async (req, res) => {
  try {
    console.log('[STABLE SERVER] Fetching suppliers...');
    const suppliers = await storage.getSuppliers();
    console.log(`[STABLE SERVER] Found ${suppliers.length || 0} suppliers`);
    res.json(suppliers || []);
  } catch (error) {
    console.error('[STABLE SERVER] Error fetching suppliers:', error);
    res.status(500).json({ error: 'Failed to fetch suppliers' });
  }
});

// Customers routes
app.get('/api/customers', async (req, res) => {
  try {
    console.log('[STABLE SERVER] Fetching customers...');
    const customers = await storage.getCustomers();
    console.log(`[STABLE SERVER] Found ${customers.length || 0} customers`);
    res.json(customers || []);
  } catch (error) {
    console.error('[STABLE SERVER] Error fetching customers:', error);
    res.status(500).json({ error: 'Failed to fetch customers' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    server: 'stable-server',
    database: 'connected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('[STABLE SERVER] Error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

// Keep-alive mechanisms
const server = http.createServer(app);

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[STABLE SERVER] Uncaught exception:', error);
  // Don't exit, just log
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[STABLE SERVER] Unhandled rejection at:', promise, 'reason:', reason);
  // Don't exit, just log
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[STABLE SERVER] SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('[STABLE SERVER] Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('[STABLE SERVER] SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('[STABLE SERVER] Process terminated');
    process.exit(0);
  });
});

// Start server
const PORT = process.env.PORT || 5001;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`[STABLE SERVER] 🚀 Server is running on http://${HOST}:${PORT}`);
  console.log(`[STABLE SERVER] 📱 Open your browser to http://localhost:${PORT}`);
});

// Keep-alive ping every 5 minutes
setInterval(() => {
  console.log(`[STABLE SERVER] Keep-alive ping at ${new Date().toISOString()}`);
}, 5 * 60 * 1000);

module.exports = app;