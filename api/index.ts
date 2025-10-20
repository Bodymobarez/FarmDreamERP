import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "../server/routes";
import { serveStatic } from "../server/vite";

const app = express();

// Enable CORS for production deployment
app.use(cors({
  origin: [
    'https://farm.adsolutions-eg.com',
    'https://farm-dream-erp1.vercel.app',
    'http://localhost:3000',
    'http://localhost:5173',
  ],
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Simple logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Initialize the app
let isInitialized = false;

async function initializeApp() {
  if (isInitialized) return app;
  
  try {
    await registerRoutes(app);

    app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
      console.error('Error:', err);
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      res.status(status).json({ message });
    });

    // Serve static files for production
    serveStatic(app);

    isInitialized = true;
    return app;
  } catch (error) {
    console.error('Failed to initialize app:', error);
    throw error;
  }
}

// Export for Vercel
export default async function handler(req: Request, res: Response) {
  try {
    const app = await initializeApp();
    return app(req, res);
  } catch (error) {
    console.error('Handler error:', error);
    res.status(500).json({ message: 'Server initialization failed' });
  }
}