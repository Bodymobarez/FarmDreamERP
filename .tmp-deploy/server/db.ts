import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from "../shared/schema";

// Load environment variables
import { config } from 'dotenv';
config();

let sql: any = null;
let db: any = null;

if (!process.env.DATABASE_URL) {
  console.warn("DATABASE_URL is not set. Using mock data for development.");
  // For development/testing, we'll use mock data
  sql = null;
  db = null;
} else {
  sql = neon(process.env.DATABASE_URL);
  db = drizzle(sql, { schema });
}

export { sql, db };
