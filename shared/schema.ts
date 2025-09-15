import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const idCardTemplates = pgTable("id_card_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  design: text("design").notNull(), // JSON string of design configuration
  createdAt: timestamp("created_at").defaultNow(),
});

export const idCards = pgTable("id_cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  universityName: text("university_name").notNull(),
  studentName: text("student_name").notNull(),
  studentId: text("student_id").notNull(),
  dateOfBirth: text("date_of_birth").notNull(),
  phone: text("phone").notNull(),
  department: text("department").notNull(),
  address: text("address").notNull(),
  academicYear: text("academic_year").notNull(),
  photoUrl: text("photo_url"),
  templateId: varchar("template_id").references(() => idCardTemplates.id),
  qrCodeData: text("qr_code_data"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Validation schemas with comprehensive rules
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertIdCardTemplateSchema = createInsertSchema(idCardTemplates).omit({
  id: true,
  createdAt: true,
});

export const insertIdCardSchema = createInsertSchema(idCards, {
  universityName: z.string().min(1, "University name is required").max(100, "University name too long"),
  studentName: z.string().min(1, "Student name is required").max(50, "Student name too long"),
  studentId: z.string().min(1, "Student ID is required").max(20, "Student ID too long"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  phone: z.string().min(1, "Phone number is required").regex(/^[\+]?[\d\s\-\(\)]+$/, "Invalid phone number format"),
  department: z.string().min(1, "Department is required").max(50, "Department name too long"),
  address: z.string().min(1, "Address is required").max(200, "Address too long"),
  academicYear: z.string().min(1, "Academic year is required").max(20, "Academic year too long"),
  photoUrl: z.string().url("Invalid photo URL").optional(),
  qrCodeData: z.string().optional(),
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertIdCard = z.infer<typeof insertIdCardSchema>;
export type IdCard = typeof idCards.$inferSelect;
export type InsertIdCardTemplate = z.infer<typeof insertIdCardTemplateSchema>;
export type IdCardTemplate = typeof idCardTemplates.$inferSelect;
