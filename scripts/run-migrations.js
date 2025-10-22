const fs = require('fs');
const path = require('path');
const postgres = require('postgres');

// Try to load .env from repo root so the script can be run without the caller
// having to export POSTGRES_URL manually. If dotenv isn't installed or the
// file doesn't exist, silently continue and let the existing checks handle it.
try {
  const dotenvPath = path.join(__dirname, '..', '.env');
  if (fs.existsSync(dotenvPath)) {
    try {
      require('dotenv').config({ path: dotenvPath });
      console.log('Loaded environment variables from .env');
    } catch (e) {
      // dotenv not installed or failed to load; continue and rely on process.env
      console.warn('dotenv not available; relying on environment variables.');
    }
  }
} catch (e) {
  // Defensive: continue even if fs/path checks fail for any reason
}

async function run() {
  const migrationsDir = path.join(__dirname, '..', 'db', 'migrations');
  if (!process.env.POSTGRES_URL) {
    console.error('Please set POSTGRES_URL environment variable to run migrations.');
    process.exit(1);
  }

  const POSTGRES_URL = process.env.POSTGRES_URL;

  // Determine ssl option: respect explicit POSTGRES_SSL env, or infer from the
  // connection string (e.g. sslmode=require) or known hosts like neon.tech.
  let sslOption = false;
  try {
    const urlLower = (POSTGRES_URL || '').toLowerCase();
    if (process.env.POSTGRES_SSL === 'true' || urlLower.includes('sslmode=require') || urlLower.includes('neon.tech')) {
      // For many cloud providers (Neon, Heroku), rejecting unauthorized certs can
      // cause failures in some environments. Using rejectUnauthorized: false is
      // a pragmatic default for migration tooling. For stricter security, set
      // POSTGRES_SSL_REJECT_UNAUTHORIZED to 'true'.
      sslOption = { rejectUnauthorized: process.env.POSTGRES_SSL_REJECT_UNAUTHORIZED === 'true' };
    }
  } catch (e) {
    // fallback: no ssl
    sslOption = false;
  }

  const sql = postgres(POSTGRES_URL, { ssl: sslOption });

  try {
    const files = fs.readdirSync(migrationsDir).filter((f) => f.endsWith('.sql')).sort();
    for (const file of files) {
      const full = path.join(migrationsDir, file);
      console.log('Applying migration:', file);
      const sqlText = fs.readFileSync(full, 'utf8');
      // run as a single statement batch
      await sql.unsafe(sqlText);
    }
    console.log('Migrations applied successfully.');
  } catch (err) {
    console.error('Migration failed:', err);
    process.exitCode = 1;
  } finally {
    try { await sql.end(); } catch (e) { /* ignore */ }
  }
}

run();
