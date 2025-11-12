import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, registrations, InsertRegistration, staffUsers, InsertStaffUser } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.id) {
    throw new Error("User ID is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      id: user.id,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role === undefined) {
      if (user.id === ENV.ownerId) {
        user.role = 'admin';
        values.role = 'admin';
        updateSet.role = 'admin';
      }
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUser(id: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// دوال إدارة التسجيلات
export async function createRegistration(registration: InsertRegistration) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  const result = await db.insert(registrations).values(registration);
  return registration.id || `reg_${Date.now()}`;
}

export async function getAllRegistrations() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(registrations).orderBy(desc(registrations.createdAt));
}

export async function getRegistrationById(id: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(registrations).where(eq(registrations.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateRegistrationStatus(id: string, status: "pending" | "contacted" | "scheduled" | "in_progress" | "completed" | "cancelled") {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(registrations)
    .set({ status, updatedAt: new Date() })
    .where(eq(registrations.id, id));
}

export async function signContract(id: string, signatureData: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(registrations)
    .set({
      contractSigned: "yes",
      contractSignedAt: new Date(),
      signatureData,
      updatedAt: new Date(),
    })
    .where(eq(registrations.id, id));
}

export async function getRegistrationStats() {
  const db = await getDb();
  if (!db) {
    return { total: 0, byPackage: {}, byStatus: {} };
  }

  const allRegs = await db.select().from(registrations);
  
  const byPackage = allRegs.reduce((acc, reg) => {
    acc[reg.packageType] = (acc[reg.packageType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byStatus = allRegs.reduce((acc, reg) => {
    acc[reg.status] = (acc[reg.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return {
    total: allRegs.length,
    byPackage,
    byStatus,
  };
}

// دوال إدارة المستخدمين
export async function createStaffUser(staffUser: InsertStaffUser) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.insert(staffUsers).values(staffUser);
  return staffUser.id;
}

export async function getAllStaffUsers() {
  const db = await getDb();
  if (!db) {
    return [];
  }

  return await db.select().from(staffUsers).orderBy(desc(staffUsers.createdAt));
}

export async function getStaffUserByUserId(userId: string) {
  const db = await getDb();
  if (!db) {
    return undefined;
  }

  const result = await db.select().from(staffUsers).where(eq(staffUsers.userId, userId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function updateStaffUser(id: string, updates: Partial<InsertStaffUser>) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.update(staffUsers)
    .set({ ...updates, updatedAt: new Date() })
    .where(eq(staffUsers.id, id));
}

export async function deleteStaffUser(id: string) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }

  await db.delete(staffUsers).where(eq(staffUsers.id, id));
}
