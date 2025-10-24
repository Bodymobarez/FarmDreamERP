// Import with .js extension so Node ESM can resolve it at runtime on Vercel
import app from "../server/index.js";

// Vercel's @vercel/node detects Express apps when exported as default
export default app;
