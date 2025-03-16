import { z } from "zod";

// Base schemas
export const userSchema = z.object({
  id: z.string(),
  username: z.string().min(4, "Username must be at least 4 characters").max(10, "Username must be at most 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  email: z.string().email("Invalid email address"),
  avatarUrl: z.string().nullable(),
  isAdmin: z.boolean().default(false),
  createdAt: z.string(),
});

export const giveawaySchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  prize: z.string(),
  imageUrl: z.string().nullable(),
  maxEntries: z.number(),
  endDate: z.string(),
  createdAt: z.string(),
  isActive: z.boolean(),
});

export const giveawayEntrySchema = z.object({
  id: z.string(),
  giveawayId: z.string(),
  userId: z.string(),
  enteredAt: z.string(),
  isWinner: z.boolean(),
});

export const entrySchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email("Invalid email address"),
  enteredAt: z.string(),
});

export const videoSchema = z.object({
  id: z.string(),
  videoId: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  publishedAt: z.string(),
  viewCount: z.number().nullable(),
  fetchedAt: z.string(),
});

export const updateSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  type: z.string(),
  iconName: z.string().nullable(),
  createdAt: z.string(),
});

// Insert schemas (omit auto-generated fields)
export const insertUserSchema = userSchema.omit({ 
  id: true, 
  createdAt: true,
  avatarUrl: true,
});

export const insertGiveawaySchema = giveawaySchema.omit({ 
  id: true, 
  createdAt: true, 
  isActive: true 
});

export const insertGiveawayEntrySchema = giveawayEntrySchema.omit({ 
  id: true, 
  enteredAt: true, 
  isWinner: true 
});

export const insertEntrySchema = entrySchema.omit({ 
  id: true, 
  enteredAt: true 
});

export const insertVideoSchema = videoSchema.omit({ 
  id: true, 
  fetchedAt: true 
});

export const insertUpdateSchema = updateSchema.omit({ 
  id: true, 
  createdAt: true 
});

// Types
export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export type Giveaway = z.infer<typeof giveawaySchema>;
export type InsertGiveaway = z.infer<typeof insertGiveawaySchema>;

export type GiveawayEntry = z.infer<typeof giveawayEntrySchema>;
export type InsertGiveawayEntry = z.infer<typeof insertGiveawayEntrySchema>;

export type Entry = z.infer<typeof entrySchema>;
export type InsertEntry = z.infer<typeof insertEntrySchema>;

export type Video = z.infer<typeof videoSchema>;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type Update = z.infer<typeof updateSchema>;
export type InsertUpdate = z.infer<typeof insertUpdateSchema>;

// Auth schemas
export const loginSchema = z.object({
  username: z.string().min(4, "Username must be at least 4 characters").max(10, "Username must be at most 10 characters"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const signupSchema = insertUserSchema.extend({
  confirmPassword: z.string().min(6, "Password must be at least 6 characters")
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

export type LoginCredentials = z.infer<typeof loginSchema>;
export type SignupCredentials = z.infer<typeof signupSchema>;
