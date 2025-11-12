import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { notifyOwner } from "./_core/notification";

// تعريف أسماء الباقات
const packageNames: Record<string, string> = {
  "100mbps": "100 ميغابت/ثانية - 1500 أوقية",
  "200mbps": "200 ميغابت/ثانية - 3000 أوقية",
  "500mbps": "500 ميغابت/ثانية - 5000 أوقية"
};

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // موجهات التسجيلات
  registrations: router({
    create: publicProcedure
      .input(z.object({
        fullName: z.string().min(1),
        phoneNumber: z.string().min(1),
        email: z.string().email().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        locationShared: z.string().optional(),
        packageType: z.enum(["100mbps", "200mbps", "500mbps"]),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createRegistration(input);
        
        // إرسال إشعار للمالك
        const locationInfo = input.latitude && input.longitude
          ? `\n\n📍 الموقع الجغرافي:\nhttps://www.google.com/maps?q=${input.latitude},${input.longitude}`
          : '';

        await notifyOwner({
          title: "طلب تسجيل جديد في خدمة الألياف البصرية",
                  content: `تم استلام طلب تسجيل جديد:

🔢 رقم التتبع: ${id}

👤 الاسم: ${input.fullName}
📞 الهاتف: ${input.phoneNumber}
📧 البريد: ${input.email || 'غير متوفر'}
📦 الباقة: ${packageNames[input.packageType]}${locationInfo}`,
        });
        
        return { success: true, id };
      }),
    
    list: protectedProcedure.query(async () => {
      return await db.getAllRegistrations();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.string() }))
      .query(async ({ input }) => {
        return await db.getRegistrationById(input.id);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.string(),
        status: z.enum(["pending", "contacted", "scheduled", "in_progress", "completed", "cancelled"]),
      }))
      .mutation(async ({ input }) => {
        await db.updateRegistrationStatus(input.id, input.status);
        return { success: true };
      }),
    
    stats: protectedProcedure.query(async () => {
      return await db.getRegistrationStats();
    }),

    signContract: publicProcedure
      .input(z.object({
        id: z.string(),
        signatureData: z.string(),
      }))
      .mutation(async ({ input }) => {
        await db.signContract(input.id, input.signatureData);
        return { success: true };
      }),
  }),

  // موجهات إدارة المستخدمين
  staffUsers: router({
    create: protectedProcedure
      .input(z.object({
        userId: z.string(),
        role: z.enum(["admin", "manager", "agent", "viewer"]),
        canViewRegistrations: z.string().default("yes"),
        canEditRegistrations: z.string().default("no"),
        canDeleteRegistrations: z.string().default("no"),
        canManageUsers: z.string().default("no"),
        canExportReports: z.string().default("no"),
      }))
      .mutation(async ({ input }) => {
        const id = await db.createStaffUser(input);
        return { success: true, id };
      }),

    list: protectedProcedure.query(async () => {
      return await db.getAllStaffUsers();
    }),

    getByUserId: protectedProcedure
      .input(z.object({ userId: z.string() }))
      .query(async ({ input }) => {
        return await db.getStaffUserByUserId(input.userId);
      }),

    update: protectedProcedure
      .input(z.object({
        id: z.string(),
        role: z.enum(["admin", "manager", "agent", "viewer"]).optional(),
        canViewRegistrations: z.string().optional(),
        canEditRegistrations: z.string().optional(),
        canDeleteRegistrations: z.string().optional(),
        canManageUsers: z.string().optional(),
        canExportReports: z.string().optional(),
      }))
      .mutation(async ({ input }) => {
        const { id, ...updates } = input;
        await db.updateStaffUser(id, updates);
        return { success: true };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.string() }))
      .mutation(async ({ input }) => {
        await db.deleteStaffUser(input.id);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;
