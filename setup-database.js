import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';

async function setupDatabase() {
  try {
    console.log('🔄 Connecting to database...');
    
    const connection = await mysql.createConnection(process.env.DATABASE_URL);
    const db = drizzle(connection);
    
    console.log('✅ Connected! Creating tables...');
    
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
    console.log('✅ Created users table');
    
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
    console.log('✅ Created registrations table');
    
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
    console.log('✅ Created staffUsers table');
    
    // Create admin user
    const adminId = 'admin-' + Date.now();
    const userId = 'user-admin-' + Date.now();
    
    await connection.execute(`
      INSERT IGNORE INTO users (id, name, email, loginMethod, role)
      VALUES (?, 'Admin', 'admin@scl-communication.com', 'password', 'admin')
    `, [userId]);
    
    await connection.execute(`
      INSERT IGNORE INTO staffUsers (id, userId, role, canViewRegistrations, canEditRegistrations, canDeleteRegistrations, canManageUsers, canExportReports)
      VALUES (?, ?, 'admin', 'yes', 'yes', 'yes', 'yes', 'yes')
    `, [adminId, userId]);
    
    console.log('✅ Created admin user');
    console.log('🎉 Database setup complete!');
    
    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error setting up database:', error);
    process.exit(1);
  }
}

setupDatabase();
