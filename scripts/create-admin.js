// Create initial admin user from command line args or env vars
require('dotenv').config();
const postgres = require('postgres');
const crypto = require('crypto');

const sql = postgres(process.env.POSTGRES_URL, { ssl: 'require' });

async function createAdmin() {
  const username = process.argv[2] || process.env.ADMIN_USERNAME || 'admin';
  const password = process.argv[3] || process.env.ADMIN_PASSWORD;
  
  if (!password) {
    console.error('Usage: node scripts/create-admin.js <username> <password>');
    console.error('Or set ADMIN_USERNAME and ADMIN_PASSWORD in .env');
    process.exit(1);
  }

  try {
    // Check if user exists
    const existing = await sql`SELECT username FROM users WHERE username = ${username} LIMIT 1`;
    if (existing.length > 0) {
      console.log(`User "${username}" already exists.`);
      process.exit(0);
    }

    // Create password hash
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.scryptSync(password, salt, 64).toString('hex');

    // Insert admin user
    await sql`
      INSERT INTO users (username, password_hash, salt, is_admin)
      VALUES (${username}, ${hash}, ${salt}, true)
    `;

    console.log(`✓ Admin user "${username}" created successfully.`);
    process.exit(0);
  } catch (err) {
    console.error('Error creating admin user:', err);
    process.exit(1);
  }
}

createAdmin();
