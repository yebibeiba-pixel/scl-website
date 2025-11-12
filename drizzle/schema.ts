import { mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  id: varchar("id", { length: 64 }).primaryKey(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin", "manager", "employee"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// جدول تسجيلات العملاء للألياف البصرية
export const registrations = mysqlTable("registrations", {
  id: varchar("id", { length: 64 }).primaryKey().$defaultFn(() => `reg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  fullName: text("fullName").notNull(),
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  email: varchar("email", { length: 320 }),
  latitude: varchar("latitude", { length: 50 }),
  longitude: varchar("longitude", { length: 50 }),
  locationShared: varchar("locationShared", { length: 10 }).default("no"),
  packageType: mysqlEnum("packageType", ["100mbps", "200mbps", "500mbps"]).notNull(),
  scheduledDate: timestamp("scheduledDate"),
  technicianName: varchar("technicianName", { length: 100 }),
  technicianPhone: varchar("technicianPhone", { length: 20 }),
  status: mysqlEnum("status", ["pending", "contacted", "scheduled", "in_progress", "completed", "cancelled"]).default("pending").notNull(),
  contractSigned: varchar("contractSigned", { length: 10 }).default("no"),
  contractSignedAt: timestamp("contractSignedAt"),
  signatureData: text("signatureData"),
  contractPdfUrl: text("contractPdfUrl"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type Registration = typeof registrations.$inferSelect;
export type InsertRegistration = typeof registrations.$inferInsert;

// جدول الموظفين وصلاحياتهم
export const staffUsers = mysqlTable("staffUsers", {
  id: varchar("id", { length: 64 }).primaryKey().$defaultFn(() => `staff_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`),
  userId: varchar("userId", { length: 64 }).notNull(), // ربط مع جدول users
  role: mysqlEnum("role", ["admin", "manager", "agent", "viewer"]).default("viewer").notNull(),
  canViewRegistrations: varchar("canViewRegistrations", { length: 10 }).default("yes").notNull(),
  canEditRegistrations: varchar("canEditRegistrations", { length: 10 }).default("no").notNull(),
  canDeleteRegistrations: varchar("canDeleteRegistrations", { length: 10 }).default("no").notNull(),
  canManageUsers: varchar("canManageUsers", { length: 10 }).default("no").notNull(),
  canExportReports: varchar("canExportReports", { length: 10 }).default("no").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export type StaffUser = typeof staffUsers.$inferSelect;
export type InsertStaffUser = typeof staffUsers.$inferInsert;
