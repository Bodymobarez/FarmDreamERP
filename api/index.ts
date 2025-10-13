import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "../server/routes";

// Create app instance for each request
const createApp = async () => {
  const app = express();

  // Enable CORS for Vercel deployment
  app.use(cors({
    origin: [
      'https://farm.adsolutions-eg.com',
      'https://farm-dream-erp.vercel.app',
      'http://localhost:5001',
      'http://localhost:5173',
    ],
    credentials: true,
  }));

  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Initialize routes
  await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
  });

  return app;
};

// Vercel serverless function handler
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const app = await createApp();
    return app(req, res);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ 
      message: error instanceof Error ? error.message : 'Internal Server Error' 
    });
  }
}