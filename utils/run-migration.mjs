/**
 * Runs the Supabase migration SQL using the Supabase Management API.
 * Usage: node utils/run-migration.mjs
 */
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const PROJECT_REF = 'lfzumrxprnyakxtulqrx';
// Service role or management API – we'll use the REST v1 SQL endpoint
// This requires the SUPABASE_ACCESS_TOKEN (personal access token from dashboard)
// OR we can run using the anon key's pg-meta endpoint.

// Alternative: use @supabase/supabase-js to run raw SQL via rpc
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://lfzumrxprnyakxtulqrx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmenVtcnhwcm55YWt4dHVscXJ4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMxNzE4NDgsImV4cCI6MjA4ODc0Nzg0OH0.-w-NWoojObDmOJ1Ee5LW6m4fWMUYYEsSThNNGHRvYeY';

const sqlFile = join(__dirname, '../supabase/migration.sql');
const sql = readFileSync(sqlFile, 'utf-8');

// We'll use the Supabase Management API v1 to execute SQL
// Endpoint: POST https://api.supabase.com/v1/projects/{ref}/database/query
// Auth header: Bearer <personal access token>
// 
// Since we don't have the PAT, let's try using the pg-meta REST endpoint
// which is available at: https://{ref}.supabase.co/rest/v1/rpc/exec_sql (if exists)
// 
// The recommended approach without CLI is via the dashboard SQL editor.
// Instead, let's split and run statements one by one via fetch to the pg-meta endpoint.

const statements = sql
  .split(';')
  .map(s => s.trim())
  .filter(s => s.length > 0 && !s.startsWith('--'));

console.log(`Found ${statements.length} SQL statements to run.`);

let successCount = 0;
let errorCount = 0;

for (const statement of statements) {
  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ query: statement + ';' })
    });
    
    if (response.ok) {
      successCount++;
    } else {
      const text = await response.text();
      // Ignore "already exists" errors (idempotent)
      if (text.includes('already exists') || text.includes('duplicate')) {
        successCount++;
      } else {
        console.warn(`⚠ Statement warning (${response.status}):`, text.substring(0, 120));
        errorCount++;
      }
    }
  } catch (err) {
    console.error('Fetch error:', err.message);
    errorCount++;
  }
}

console.log(`\nDone. ✅ ${successCount} succeeded, ❌ ${errorCount} errors.`);
