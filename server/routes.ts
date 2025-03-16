import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertEntrySchema, loginSchema, signupSchema, insertGiveawaySchema } from "@shared/schema";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import passport from "passport";
import { sheetsDb } from "./sheets";

// Helper function to generate IDs (copied from storage.ts for consistency)
function generateId(): string {
  return require('crypto').randomBytes(8).toString('hex');
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Middleware to handle Zod validation errors
  const validateRequest = (schema: any) => {
    return (req: Request, res: Response, next: Function) => {
      try {
        req.body = schema.parse(req.body);
        next();
      } catch (error) {
        if (error instanceof ZodError) {
          const validationError = fromZodError(error);
          return res.status(400).json({ 
            message: validationError.message,
            errors: error.errors
          });
        }
        next(error);
      }
    };
  };

  // Simple Entry routes for giveaway counter
  app.post("/api/entries", validateRequest(insertEntrySchema), async (req, res) => {
    try {
      // Check for duplicate email
      const existingEntry = await storage.getEntryByEmail(req.body.email);
      if (existingEntry) {
        return res.status(400).json({ 
          message: "This email has already been used to enter the giveaway"
        });
      }

      const entry = await storage.createEntry(req.body);
      res.status(201).json({
        message: "Entry submitted successfully",
        entry
      });
    } catch (error) {
      console.error('Error creating entry:', error);
      if (error instanceof Error && error.message === "Email already entered in giveaway") {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: "Error submitting entry" });
      }
    }
  });

  app.get("/api/entries/count", async (req, res) => {
    try {
      const count = await storage.getEntryCount();
      res.json({ count });
    } catch (error) {
      console.error('Error getting entry count:', error);
      res.status(500).json({ message: "Error fetching entry count" });
    }
  });

  // Authentication routes
  // Login route
  app.post("/api/auth/login", validateRequest(loginSchema), (req, res, next) => {
    console.log('Login attempt:', req.body.username);
    
    passport.authenticate("local", (err: Error, user: any, info: any) => {
      if (err) {
        console.error('Login error:', err);
        return next(err);
      }
      if (!user) {
        console.log('Login failed:', info?.message || 'Authentication failed');
        return res.status(401).json({ message: info?.message || "Authentication failed" });
      }
      
      console.log('User authenticated, logging in...');
      
      // Update session expiry based on remember me
      if (req.body.rememberMe) {
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      } else {
        req.session.cookie.maxAge = 24 * 60 * 60 * 1000; // 1 day
      }
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error after authentication:', err);
          return next(err);
        }
        
        // Return user data without sensitive fields
        const { password, ...safeUser } = user;
        console.log('Login successful:', safeUser.username, 'Session ID:', req.session.id);
        
        return res.json({ user: safeUser });
      });
    })(req, res, next);
  });
  
  // Signup route
  app.post("/api/auth/signup", validateRequest(signupSchema), async (req, res, next) => {
    try {
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(req.body.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }
      
      // Create new user
      const { confirmPassword, ...userData } = req.body;
      const newUser = await storage.createUser(userData);
      
      // Log in the new user
      req.logIn(newUser, (err) => {
        if (err) {
          return next(err);
        }
        
        // Return user data without sensitive fields
        const { password, ...safeUser } = newUser;
        return res.status(201).json({ user: safeUser });
      });
    } catch (error) {
      console.error('Error creating user:', error);
      res.status(500).json({ message: "Error creating user" });
    }
  });
  
  // Get current user route
  app.get("/api/auth/user", (req, res) => {
    console.log('Auth check - isAuthenticated:', req.isAuthenticated());
    console.log('Auth check - session:', req.session.id);
    
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    
    // Return user data without sensitive fields
    const { password, ...safeUser } = req.user as any;
    console.log('Auth check - returning user:', safeUser.username);
    return res.json(safeUser);
  });
  
  // Logout route
  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Error logging out" });
      }
      
      req.session.destroy(() => {
        res.clearCookie("connect.sid");
        return res.json({ message: "Logged out successfully" });
      });
    });
  });

  // Middleware to check if user is admin
  const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (!req.isAuthenticated() || !req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }
    const user = req.user as any;
    if (!user.isAdmin) {
      return res.status(403).json({ message: "Not authorized" });
    }
    next();
  };

  // Admin routes
  app.get("/api/giveaways/admin", isAdmin, async (req, res) => {
    try {
      const giveaways = await sheetsDb.findAll(sheetsDb.SHEETS.GIVEAWAYS);
      res.json(giveaways);
    } catch (error) {
      console.error('Error getting admin giveaways:', error);
      res.status(500).json({ message: "Error fetching giveaways" });
    }
  });

  app.get("/api/giveaway-entries/admin", isAdmin, async (req, res) => {
    try {
      // Get all giveaway entries and enrich them with user and giveaway data
      const entries = await sheetsDb.findAll(sheetsDb.SHEETS.GIVEAWAY_ENTRIES);
      const users = await sheetsDb.findAll(sheetsDb.SHEETS.USERS);
      const giveaways = await sheetsDb.findAll(sheetsDb.SHEETS.GIVEAWAYS);
      
      const enrichedEntries = entries.map((entry: any) => {
        const user = users.find((u: any) => u.id === entry.userId);
        const giveaway = giveaways.find((g: any) => g.id === entry.giveawayId);
        
        return {
          ...entry,
          username: user ? user.username : 'Unknown User',
          email: user ? user.email : 'Unknown Email',
          giveawayTitle: giveaway ? giveaway.title : 'Unknown Giveaway'
        };
      });
      
      res.json(enrichedEntries);
    } catch (error) {
      console.error('Error getting admin giveaway entries:', error);
      res.status(500).json({ message: "Error fetching giveaway entries" });
    }
  });

  app.post("/api/giveaways", isAdmin, validateRequest(insertGiveawaySchema), async (req, res) => {
    try {
      const newGiveaway = {
        ...req.body,
        id: generateId(),
        createdAt: new Date().toISOString(),
        isActive: true,
      };
      
      await sheetsDb.insertOne(sheetsDb.SHEETS.GIVEAWAYS, newGiveaway);
      res.status(201).json(newGiveaway);
    } catch (error) {
      console.error('Error creating giveaway:', error);
      res.status(500).json({ message: "Error creating giveaway" });
    }
  });

  app.put("/api/giveaways/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      const giveaway = await sheetsDb.findOne(sheetsDb.SHEETS.GIVEAWAYS, { id });
      
      if (!giveaway) {
        return res.status(404).json({ message: "Giveaway not found" });
      }
      
      const updatedGiveaway = {
        ...giveaway,
        ...req.body,
      };
      
      await sheetsDb.updateOne(sheetsDb.SHEETS.GIVEAWAYS, { id }, updatedGiveaway);
      res.json(updatedGiveaway);
    } catch (error) {
      console.error('Error updating giveaway:', error);
      res.status(500).json({ message: "Error updating giveaway" });
    }
  });
  
  // Delete giveaway endpoint
  app.delete("/api/giveaways/:id", isAdmin, async (req, res) => {
    try {
      const { id } = req.params;
      
      // First, check if the giveaway exists
      const giveaway = await sheetsDb.findOne(sheetsDb.SHEETS.GIVEAWAYS, { id });
      if (!giveaway) {
        return res.status(404).json({ message: "Giveaway not found" });
      }
      
      // Instead of deleting the giveaway, we'll mark it as inactive
      // This preserves the data while effectively removing it from the active giveaways
      const updatedGiveaway = {
        ...giveaway,
        isActive: false,
      };
      
      await sheetsDb.updateOne(sheetsDb.SHEETS.GIVEAWAYS, { id }, updatedGiveaway);
      
      res.json({ message: "Giveaway deleted successfully" });
    } catch (error) {
      console.error('Error deleting giveaway:', error);
      res.status(500).json({ message: "Error deleting giveaway" });
    }
  });

  // Regular API routes
  app.get("/api/giveaways", async (req, res) => {
    try {
      const allGiveaways = await sheetsDb.findAll(sheetsDb.SHEETS.GIVEAWAYS);
      // Filter to only return active giveaways to regular users
      const activeGiveaways = allGiveaways.filter((giveaway: any) => giveaway.isActive);
      res.json(activeGiveaways);
    } catch (error) {
      console.error('Error getting giveaways:', error);
      res.status(500).json({ message: "Error fetching giveaways" });
    }
  });
  
  app.get("/api/updates", (req, res) => {
    res.json([]);
  });
  
  app.get("/api/videos", (req, res) => {
    res.json([]);
  });
  

  // Leaderboard routes
  app.get("/api/leaderboard", async (req, res) => {
    try {
      const leaderboard = await storage.getLeaderboard();
      res.json(leaderboard);
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      res.status(500).json({ message: "Error fetching leaderboard" });
    }
  });

  // Protected route for adding leaderboard entries
  app.post("/api/leaderboard", isAdmin, async (req, res) => {
    try {
      const { username, prizeAmount, prizeDescription } = req.body;

      if (!username || !prizeAmount || !prizeDescription) {
        return res.status(400).json({ 
          message: "Username, prize amount, and prize description are required" 
        });
      }

      const entry = await storage.addLeaderboardEntry({
        username,
        prizeAmount: Number(prizeAmount),
        prizeDescription
      });

      res.status(201).json(entry);
    } catch (error) {
      console.error('Error adding leaderboard entry:', error);
      res.status(500).json({ message: "Error adding leaderboard entry" });
    }
  });

  // Add route to get user count
  app.get("/api/users/count", async (req, res) => {
    try {
      const count = await storage.getUserCount();
      res.json({ count });
    } catch (error) {
      console.error('Error getting user count:', error);
      res.status(500).json({ message: "Error fetching user count" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}