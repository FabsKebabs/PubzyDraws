import { type User, type InsertUser, type Entry, type InsertEntry } from "@shared/schema";
import { sheetsDb } from "./sheets";
import * as crypto from 'crypto';

// Helper function to generate IDs
function generateId(): string {
  return crypto.randomBytes(8).toString('hex');
}

// Interface for leaderboard entry
interface LeaderboardEntry {
  id: string;
  username: string;
  Giveaway: string;
  prize: string;
  Date: string;
}

interface InsertLeaderboardEntry {
  username: string;
  Giveaway: string;
  prize: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getUserCount(): Promise<number>;

  // Entry methods
  createEntry(entry: InsertEntry): Promise<Entry>;
  getAllEntries(): Promise<Entry[]>;
  getEntryCount(): Promise<number>;
  getEntryByEmail(email: string): Promise<Entry | undefined>;

  // Leaderboard methods
  getLeaderboard(): Promise<LeaderboardEntry[]>;
  addLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry>;
}

export class GoogleSheetsStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      console.log(`Fetching user with ID: ${id}`);
      const user = await sheetsDb.findOne(sheetsDb.SHEETS.USERS, { id });
      console.log(`Found user:`, user);
      return user;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      throw error;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      console.log(`Looking up user with username: ${username}`);
      // Case insensitive username lookup
      const allUsers = await sheetsDb.findAll(sheetsDb.SHEETS.USERS);
      const user = allUsers.find(
        u => u.username.toLowerCase() === username.toLowerCase()
      );
      console.log(`Found user:`, user);
      return user;
    } catch (error) {
      console.error('Error fetching user by username:', error);
      throw error;
    }
  }

  async getUserCount(): Promise<number> {
    const users = await sheetsDb.findAll(sheetsDb.SHEETS.USERS);
    return users.length;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    // Set isAdmin to true only for the Pubzy account
    const isAdmin = insertUser.username === "Pubzy" ? true : false;

    const newUser = {
      ...insertUser,
      id: generateId(),
      createdAt: new Date().toISOString(),
      avatarUrl: null,
      isAdmin,
    };

    await sheetsDb.insertOne(sheetsDb.SHEETS.USERS, newUser);
    return newUser;
  }

  // Entry methods
  async getEntryByEmail(email: string): Promise<Entry | undefined> {
    try {
      console.log(`Checking for existing entry with email: ${email}`);
      const allEntries = await sheetsDb.findAll(sheetsDb.SHEETS.ENTRIES);
      const entry = allEntries.find(
        e => e.email.toLowerCase() === email.toLowerCase()
      );
      console.log(`Found existing entry:`, entry);
      return entry;
    } catch (error) {
      console.error('Error checking for existing entry:', error);
      throw error;
    }
  }

  async createEntry(insertEntry: InsertEntry): Promise<Entry> {
    try {
      // Check for existing entry with same email
      const existingEntry = await this.getEntryByEmail(insertEntry.email);
      if (existingEntry) {
        console.log(`Duplicate entry attempt with email: ${insertEntry.email}`);
        throw new Error("Email already entered in giveaway");
      }

      const newEntry = {
        ...insertEntry,
        id: generateId(),
        enteredAt: new Date().toISOString(),
      };

      console.log(`Creating new entry:`, newEntry);
      await sheetsDb.insertOne(sheetsDb.SHEETS.ENTRIES, newEntry);
      return newEntry;
    } catch (error) {
      console.error('Error creating entry:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to create entry");
    }
  }

  async getAllEntries(): Promise<Entry[]> {
    return sheetsDb.findAll(sheetsDb.SHEETS.ENTRIES);
  }

  async getEntryCount(): Promise<number> {
    const entries = await sheetsDb.findAll(sheetsDb.SHEETS.ENTRIES);
    return entries.length;
  }

  // Leaderboard methods
  async getLeaderboard(): Promise<LeaderboardEntry[]> {
    try {
      const entries = await sheetsDb.findAll(sheetsDb.SHEETS.LEADERBOARD);
      // Sort by most recent first
      return entries.sort((a, b) => new Date(b.Date).getTime() - new Date(a.Date).getTime());
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      throw error;
    }
  }

  async addLeaderboardEntry(entry: InsertLeaderboardEntry): Promise<LeaderboardEntry> {
    try {
      const newEntry: LeaderboardEntry = {
        id: generateId(),
        username: entry.username,
        Giveaway: entry.Giveaway,
        prize: entry.prize,
        Date: new Date().toISOString(),
      };

      await sheetsDb.insertOne(sheetsDb.SHEETS.LEADERBOARD, newEntry);
      return newEntry;
    } catch (error) {
      console.error('Error adding leaderboard entry:', error);
      throw error;
    }
  }
}

// Initialize sheets
sheetsDb.initializeSheets().catch(console.error);

export const storage = new GoogleSheetsStorage();