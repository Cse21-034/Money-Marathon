// Frontend types matching backend schema
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export interface Plan {
  id: string;
  userId: string;
  name: string;
  startWager: string;
  odds: string;
  days: number;
  status: "active" | "stopped" | "completed";
  createdAt: Date;
}

export interface DayEntry {
  id: string;
  planId: string;
  day: number;
  wager: string;
  odds: string;
  winnings: string;
  result: "pending" | "win" | "loss";
}

export interface InsertUser {
  name: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface InsertPlan {
  name: string;
  startWager: number;
  odds: number;
  days: number;
}

export interface UpdateDayResult {
  result: "win" | "loss";
}

export interface RestartPlan {
  day: number;
}

export interface BookingCode {
  id: string;
  userId: string;
  bookingCode: string;
  odds: string;
  description?: string;
  betwayUrl: string;
  status: "active" | "expired";
  createdAt: Date;
  expiresAt?: Date;
}

export interface InsertBookingCode {
  bookingCode: string;
  odds: number;
  description?: string;
  betwayUrl: string;
  expiresAt?: string;
}

// Validation schemas using zod (for forms)
import { z } from "zod";

export const insertUserSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const insertPlanSchema = z.object({
  name: z.string().min(1, "Plan name is required"),
  startWager: z.coerce.number().min(1, "Start wager must be at least 1"),
  odds: z.coerce.number().min(1.01, "Odds must be at least 1.01"),
  days: z.coerce.number().min(1, "Duration must be at least 1 day").max(365, "Duration cannot exceed 365 days"),
});

export const updateDayResultSchema = z.object({
  result: z.enum(["win", "loss"]),
});

export const restartPlanSchema = z.object({
  day: z.number().min(1, "Day must be at least 1"),
});

export const insertBookingCodeSchema = z.object({
  bookingCode: z.string().min(5, "Booking code is required"),
  odds: z.coerce.number().min(1.01, "Odds must be at least 1.01"),
  description: z.string().optional(),
  betwayUrl: z.string().url("Must be a valid URL"),
  expiresAt: z.string().optional(),
});
