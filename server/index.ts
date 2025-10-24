import express, { type Request, Response, NextFunction } from "express";
import cors from "cors";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";

const app = express();

// Enable CORS
// In Vercel/production, reflect the request origin dynamically to support the deployed domain(s)
const corsOrigins = process.env.VERCEL
  ? true
  : [
      'https://farm.adsolutions-eg.com',
      'http://localhost:3000',
      'http://localhost:5173', // Vite dev server
    ];

app.use(cors({
  origin: corsOrigins,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

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

// Initialize the app
let server: any;
let isInitialized = false;
let initPromise: Promise<any> | null = null;

async function initializeApp() {
  if (isInitialized) return;
  
  server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  console.log("Environment:", app.get("env"));
  if (app.get("env") === "development") {
    console.log("Setting up Vite...");
    await setupVite(app, server);
    console.log("Vite setup complete!");
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5001 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  // For Vercel deployment, export the app instead of starting the server
  if (process.env.VERCEL) {
    // Export app for Vercel
    isInitialized = true;
    return app;
  }

  const port = parseInt(process.env.PORT || '3000', 10);
  const host = process.env.HOST || "0.0.0.0";
  server.listen(port, host, () => {
    log(`🚀 Server is running on http://${host}:${port}`);
    log(`📱 Open your browser to http://localhost:${port}`);
  });
  
  isInitialized = true;
  return app;
}

// Initialize app
initPromise = initializeApp().catch((e) => {
  console.error("App initialization failed:", e);
});

// Ensure initialization before handling any request (defensive for serverless cold starts)
app.use(async (_req, _res, next) => {
  try {
    if (!isInitialized && initPromise) {
      await initPromise;
    }
  } catch (e) {
    // Already logged
  }
  next();
});

// Export for Vercel
export default app;
