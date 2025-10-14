import type { Express, Server } from "express";
import { createServer } from "http";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { z } from "zod";
import cors from "cors";
import jwt from "jsonwebtoken";
import { storage } from "./storage";
import { insertUserSchema, loginSchema, insertPlanSchema, updateDayResultSchema, restartPlanSchema, insertBookingCodeSchema } from "./schema";
import { generatePlanEntries, recalculatePlanFromDay } from "./lib/calculations";

// Configure Passport
passport.use(new LocalStrategy(
  { usernameField: "email" },
  async (email, password, done) => {
    try {
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return done(null, false, { message: "Invalid email or password" });
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        return done(null, false, { message: "Invalid email or password" });
      }

      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }
));

// JWT Middleware
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-change-this-in-production';
function requireAuth(req: any, res: any, next: any) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    console.log("No JWT provided");
    return res.status(401).json({ message: "Authentication required" });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { sub: string };
    storage.getUser(decoded.sub).then((user) => {
      if (!user) {
        console.log("User not found for JWT:", decoded.sub);
        return res.status(401).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    }).catch((err) => {
      console.error("Error fetching user for JWT:", err);
      res.status(401).json({ message: "Invalid token" });
    });
  } catch (err) {
    console.error("JWT verification error:", err);
    res.status(401).json({ message: "Invalid token" });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  app.use(cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:3000",
        "https://money-marathon.vercel.app",
      ];
      console.log("CORS Origin Received:", origin);
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, origin || true);
      } else {
        console.error("CORS Error: Origin not allowed:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    optionsSuccessStatus: 200
  }));

  app.use(passport.initialize());

  app.get("/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use((req, res, next) => {
    console.log("Incoming request:", req.method, req.url);
    console.log("Authorization:", req.headers.authorization || "None");
    console.log("User:", req.user?.id || "None");
    next();
  });

  app.post("/api/auth/register", async (req, res) => {
    try {
      console.log("Registration attempt:", { email: req.body.email, name: req.body.name });
      if (!process.env.JWT_SECRET) {
        console.error("JWT_SECRET not configured");
        return res.status(500).json({ message: "Server configuration error" });
      }

      const { name, email, password } = insertUserSchema.parse(req.body);
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }

      console.log("Creating user hash...");
      const passwordHash = await bcrypt.hash(password, 10);
      console.log("Storing user in database...");
      const user = await storage.createUser({ name, email, passwordHash });
      console.log("User created successfully:", user.id);

      const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '24h' });
      console.log("JWT issued:", token);
      res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Validation error:", error.errors);
        return res.status(400).json({ message: error.errors[0].message });
      }
      console.error("Registration error details:", error);
      res.status(500).json({ message: "Registration failed", error: process.env.NODE_ENV === 'development' ? error.message : undefined });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    try {
      loginSchema.parse(req.body);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) {
        console.error("Passport authentication error:", err);
        return res.status(500).json({ message: "Login failed" });
      }
      if (!user) {
        console.log("Login failed for:", req.body.email, "Reason:", info?.message);
        return res.status(401).json({ message: info.message || "Invalid credentials" });
      }

      const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '24h' });
      console.log("JWT issued:", token);
      res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    console.log("User logged out successfully");
    res.json({ message: "Logged out successfully" });
  });

  app.get("/api/auth/user", requireAuth, (req, res) => {
    console.log("Auth check - User:", req.user.id);
    const user = req.user as any;
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  });

  app.post("/api/plans", requireAuth, async (req, res) => {
    try {
      const planData = insertPlanSchema.parse(req.body);
      const user = req.user as any;
      const plan = await storage.createPlan({ ...planData, userId: user.id });
      const entries = generatePlanEntries(plan);
      await storage.createDayEntries(entries);
      res.json({ plan });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to create plan" });
    }
  });

app.get("/api/plans", requireAuth, async (req, res) => {
    try {
      const user = req.user as any;
      console.log("GET /api/plans: Fetching plans for user:", user.id);
      const plans = await storage.getPlansByUserId(user.id);
      console.log("GET /api/plans: Plans fetched:", plans);
      res.json({ plans: plans || [] }); // Ensure empty array
    } catch (error) {
      console.error("GET /api/plans: Error:", error);
      res.status(500).json({ message: "Failed to fetch plans" });
    }
  });

  app.get("/api/plans/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await storage.getPlanById(id);
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      const user = req.user as any;
      if (plan.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      const dayEntries = await storage.getDayEntriesByPlanId(id);
      res.json({ plan, dayEntries });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch plan" });
    }
  });

  app.delete("/api/plans/:id", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await storage.getPlanById(id);
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      const user = req.user as any;
      if (plan.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.deletePlan(id);
      res.json({ message: "Plan deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete plan" });
    }
  });

  app.patch("/api/plans/:id/days/:day", requireAuth, async (req, res) => {
    try {
      const { id, day } = req.params;
      const { result } = updateDayResultSchema.parse(req.body);
      const plan = await storage.getPlanById(id);
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      const user = req.user as any;
      if (plan.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.updateDayResult(id, parseInt(day), result);
      if (result === "loss") {
        await storage.updatePlanStatus(id, "stopped");
      }
      const dayEntries = await storage.getDayEntriesByPlanId(id);
      const completedDays = dayEntries.filter(entry => entry.result === "win").length;
      if (completedDays === plan.days) {
        await storage.updatePlanStatus(id, "completed");
      }
      res.json({ message: "Day result updated successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to update day result" });
    }
  });

  app.post("/api/plans/:id/restart", requireAuth, async (req, res) => {
    try {
      const { id } = req.params;
      const { day } = restartPlanSchema.parse(req.body);
      const plan = await storage.getPlanById(id);
      if (!plan) {
        return res.status(404).json({ message: "Plan not found" });
      }
      const user = req.user as any;
      if (plan.userId !== user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      await storage.deleteDayEntriesFromDay(id, day);
      const newEntries = recalculatePlanFromDay(plan, day);
      await storage.createDayEntries(newEntries);
      if (plan.status === "stopped") {
        await storage.updatePlanStatus(id, "active");
      }
      res.json({ message: "Plan restarted successfully" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0].message });
      }
      res.status(500).json({ message: "Failed to restart plan" });
    }
  });
// POST /api/booking-codes - Create new booking code (Admin only)
app.post("/api/booking-codes", requireAuth, async (req, res) => {
  try {
    const user = req.user as any;
    
    // Optional: Add admin check here
    // if (!user.isAdmin) {
    //   return res.status(403).json({ message: "Admin access required" });
    // }

    const codeData = insertBookingCodeSchema.parse(req.body);
    const bookingCode = await storage.createBookingCode({ 
      ...codeData, 
      userId: user.id 
    });
    
    res.status(201).json({ bookingCode });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    console.error("Create booking code error:", error);
    res.status(500).json({ message: "Failed to create booking code" });
  }
});

// GET /api/booking-codes - Get all active booking codes (Public)
app.get("/api/booking-codes", async (req, res) => {
  try {
    const limit = parseInt(req.query.limit as string) || 50;
    const codes = await storage.getBookingCodes(limit);
    res.json({ bookingCodes: codes });
  } catch (error) {
    console.error("Get booking codes error:", error);
    res.status(500).json({ message: "Failed to fetch booking codes" });
  }
});

// GET /api/booking-codes/:id - Get specific booking code
app.get("/api/booking-codes/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const code = await storage.getBookingCodeById(id);
    
    if (!code) {
      return res.status(404).json({ message: "Booking code not found" });
    }
    
    res.json({ bookingCode: code });
  } catch (error) {
    console.error("Get booking code error:", error);
    res.status(500).json({ message: "Failed to fetch booking code" });
  }
});

// GET /api/booking-codes/code/:code - Get booking code by code string
app.get("/api/booking-codes/code/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const bookingCode = await storage.getBookingCodeByCode(code);
    
    if (!bookingCode) {
      return res.status(404).json({ message: "Booking code not found" });
    }
    
    res.json({ bookingCode });
  } catch (error) {
    console.error("Get booking code by code error:", error);
    res.status(500).json({ message: "Failed to fetch booking code" });
  }
});

// DELETE /api/booking-codes/:id - Delete booking code (Admin only)
app.delete("/api/booking-codes/:id", requireAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const { id } = req.params;
    
    const code = await storage.getBookingCodeById(id);
    if (!code) {
      return res.status(404).json({ message: "Booking code not found" });
    }
    
    // Check if user owns this code or is admin
    if (code.userId !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    await storage.deleteBookingCode(id);
    res.json({ message: "Booking code deleted successfully" });
  } catch (error) {
    console.error("Delete booking code error:", error);
    res.status(500).json({ message: "Failed to delete booking code" });
  }
});

// PATCH /api/booking-codes/:id/status - Update booking code status
app.patch("/api/booking-codes/:id/status", requireAuth, async (req, res) => {
  try {
    const user = req.user as any;
    const { id } = req.params;
    const { status } = req.body;
    
    if (!["active", "expired"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }
    
    const code = await storage.getBookingCodeById(id);
    if (!code) {
      return res.status(404).json({ message: "Booking code not found" });
    }
    
    if (code.userId !== user.id) {
      return res.status(403).json({ message: "Access denied" });
    }
    
    await storage.updateBookingCodeStatus(id, status);
    res.json({ message: "Status updated successfully" });
  } catch (error) {
    console.error("Update booking code status error:", error);
    res.status(500).json({ message: "Failed to update status" });
  }
});
  

  const httpServer = createServer(app);
  return httpServer;
}
