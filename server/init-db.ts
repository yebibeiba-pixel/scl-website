import mysql from 'mysql2/promise';

export async function initDatabase() {
  if (!process.env.DATABASE_URL) {
    console.warn('[Database] DATABASE_URL not set, skipping initialization');
    return;
  }

  try {
    console.log('[Database] Initializing database...');
    
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    
    // Create users table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id varchar(64) NOT NULL,
        name text,
        email varchar(320),
        loginMethod varchar(64),
        role enum('user','admin') NOT NULL DEFAULT 'user',
        createdAt timestamp DEFAULT (now()),
        lastSignedIn timestamp DEFAULT (now()),
        CONSTRAINT users_id PRIMARY KEY(id)
      )
    `);
    console.log('[Database] ✓ users table ready');
    
    // Create registrations table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS registrations (
        id varchar(64) NOT NULL,
        fullName text NOT NULL,
        phoneNumber varchar(20) NOT NULL,
        email varchar(320),
        address text NOT NULL,
        packageType enum('100mbps','200mbps','500mbps') NOT NULL,
        notes text,
        status enum('pending','contacted','completed','cancelled') NOT NULL DEFAULT 'pending',
        createdAt timestamp DEFAULT (now()),
        updatedAt timestamp DEFAULT (now()),
        CONSTRAINT registrations_id PRIMARY KEY(id)
      )
    `);
    console.log('[Database] ✓ registrations table ready');
    
    // Create staffUsers table
    await connection.execute(`
      CREATE TABLE IF NOT EXISTS staffUsers (
        id varchar(64) NOT NULL,
        userId varchar(64) NOT NULL,
        role enum('admin','manager','agent','viewer') NOT NULL DEFAULT 'viewer',
        canViewRegistrations varchar(10) NOT NULL DEFAULT 'yes',
        canEditRegistrations varchar(10) NOT NULL DEFAULT 'no',
        canDeleteRegistrations varchar(10) NOT NULL DEFAULT 'no',
        canManageUsers varchar(10) NOT NULL DEFAULT 'no',
        canExportReports varchar(10) NOT NULL DEFAULT 'no',
        createdAt timestamp DEFAULT (now()),
        updatedAt timestamp DEFAULT (now()),
        CONSTRAINT staffUsers_id PRIMARY KEY(id)
      )
    `);
    console.log('[Database] ✓ staffUsers table ready');
    
    await connection.end();
    console.log('[Database] ✅ Initialization complete');
  } catch (error) {
    console.error('[Database] ❌ Initialization failed:', error);
    // Don't throw - let the app start anyway
  }
}
