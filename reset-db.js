import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { config } from 'dotenv';

config();

const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

async function resetDatabase() {
  console.log("🗑️ Dropping all existing tables...");
  
  try {
    // Drop all tables in correct order (respecting dependencies)
    await sql`DROP TABLE IF EXISTS accounting_entries CASCADE;`;
    await sql`DROP TABLE IF EXISTS vouchers CASCADE;`;
    await sql`DROP TABLE IF EXISTS veterinary_treatments CASCADE;`;
    await sql`DROP TABLE IF EXISTS inventory_transactions CASCADE;`;
    await sql`DROP TABLE IF EXISTS inventory_items CASCADE;`;
    await sql`DROP TABLE IF EXISTS animal_sales CASCADE;`;
    await sql`DROP TABLE IF EXISTS batch_expenses CASCADE;`;
    await sql`DROP TABLE IF EXISTS performance_goals CASCADE;`;
    await sql`DROP TABLE IF EXISTS transactions CASCADE;`;
    await sql`DROP TABLE IF EXISTS receptions CASCADE;`;
    await sql`DROP TABLE IF EXISTS customers CASCADE;`;
    await sql`DROP TABLE IF EXISTS suppliers CASCADE;`;
    await sql`DROP TABLE IF EXISTS animals CASCADE;`;
    await sql`DROP TABLE IF EXISTS batches CASCADE;`;
    await sql`DROP TABLE IF EXISTS users CASCADE;`;
    
    console.log("✅ All tables dropped successfully");
    
    // Now push the new schema
    console.log("🔄 Creating new tables with fresh schema...");
    
    process.exit(0);
  } catch (error) {
    console.error("❌ Error resetting database:", error);
    process.exit(1);
  }
}

resetDatabase();