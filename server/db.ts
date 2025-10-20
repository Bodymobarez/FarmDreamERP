import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../shared/schema";

// Load environment variables
import { config } from 'dotenv';
config();

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Using mock data for development.");
  // For development/testing, we'll use mock data
  export const sql = null;
  export const db = null;
} else {
  export const sql = neon(process.env.DATABASE_URL);
  export const db = drizzle(sql, { schema });
}
