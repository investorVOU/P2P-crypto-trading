import { eq } from "drizzle-orm";
import { db } from "./db";
import session from "express-session";
import connectPg from "connect-pg-simple";
import { pool } from "./db";
import {
  users, trades, messages, disputes, adminNotes, ratings, walletBalances, transactions, walletNonces,
  type User, type InsertUser, 
  type Trade, type InsertTrade,
  type Message, type InsertMessage,
  type Dispute, type InsertDispute,
  type AdminNote, type InsertAdminNote,
  type Rating, type InsertRating,
  type WalletBalance, type InsertWalletBalance,
  type Transaction, type InsertTransaction,
  type WalletNonce, type InsertWalletNonce
} from "../shared/schema";

// Create PostgreSQL session store
const PostgresSessionStore = connectPg(session);

// Interface for our storage methods
export interface IStorage {
  // Session store
  sessionStore: session.SessionStore;
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  
  // Trade methods
  getTrade(id: number): Promise<Trade | undefined>;
  getTrades(userId?: number, status?: string): Promise<Trade[]>;
  createTrade(trade: InsertTrade): Promise<Trade>;
  updateTradeStatus(id: number, status: string, completedAt?: Date, cancelledAt?: Date): Promise<Trade | undefined>;
  
  // Message methods
  getMessages(tradeId: number): Promise<Message[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  markMessageAsRead(id: number): Promise<Message | undefined>;
  
  // Dispute methods
  getDispute(id: number): Promise<Dispute | undefined>;
  getDisputesByTradeId(tradeId: number): Promise<Dispute[]>;
  getDisputes(status?: string): Promise<Dispute[]>;
  createDispute(dispute: InsertDispute): Promise<Dispute>;
  resolveDispute(id: number, resolution: string): Promise<Dispute | undefined>;
  
  // Admin note methods
  getAdminNotes(disputeId: number): Promise<AdminNote[]>;
  createAdminNote(note: InsertAdminNote): Promise<AdminNote>;
  
  // Rating methods
  getRating(id: number): Promise<Rating | undefined>;
  getRatingsByUser(userId: number): Promise<Rating[]>;
  getRatingsByTrade(tradeId: number): Promise<Rating[]>;
  createRating(rating: InsertRating): Promise<Rating>;
  
  // Wallet methods
  getWalletBalances(userId: number): Promise<WalletBalance[]>;
  updateWalletBalance(userId: number, currency: string, amount: number, usdValue: number): Promise<WalletBalance>;
  
  // Transaction methods
  getTransactions(userId: number): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;
  
  // Wallet authentication methods
  getUserByWalletAddress(address: string): Promise<User | undefined>;
  getWalletNonce(address: string): Promise<WalletNonce | undefined>;
  createOrUpdateWalletNonce(address: string, nonce: string): Promise<WalletNonce>;
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  sessionStore: session.SessionStore;
  
  constructor() {
    this.sessionStore = new PostgresSessionStore({ 
      pool, 
      createTableIfMissing: true
    });
  }
  // User methods
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(user: InsertUser): Promise<User> {
    const [newUser] = await db.insert(users).values(user).returning();
    return newUser;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Trade methods
  async getTrade(id: number): Promise<Trade | undefined> {
    const [trade] = await db.select().from(trades).where(eq(trades.id, id));
    return trade;
  }

  async getTrades(userId?: number, status?: string): Promise<Trade[]> {
    if (userId && status) {
      return await db
        .select()
        .from(trades)
        .where(eq(trades.userId, userId))
        .where(eq(trades.status, status));
    } else if (userId) {
      return await db
        .select()
        .from(trades)
        .where(eq(trades.userId, userId));
    } else if (status) {
      return await db
        .select()
        .from(trades)
        .where(eq(trades.status, status));
    } else {
      return await db.select().from(trades);
    }
  }

  async createTrade(trade: InsertTrade): Promise<Trade> {
    const [newTrade] = await db.insert(trades).values(trade).returning();
    return newTrade;
  }

  async updateTradeStatus(id: number, status: string, completedAt?: Date, cancelledAt?: Date): Promise<Trade | undefined> {
    const updateData: any = { status };
    
    if (completedAt) {
      updateData.completedAt = completedAt;
    }
    
    if (cancelledAt) {
      updateData.cancelledAt = cancelledAt;
    }
    
    const [updatedTrade] = await db
      .update(trades)
      .set(updateData)
      .where(eq(trades.id, id))
      .returning();
      
    return updatedTrade;
  }

  // Message methods
  async getMessages(tradeId: number): Promise<Message[]> {
    return await db.select().from(messages).where(eq(messages.tradeId, tradeId));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db.insert(messages).values(message).returning();
    return newMessage;
  }

  async markMessageAsRead(id: number): Promise<Message | undefined> {
    const [updatedMessage] = await db
      .update(messages)
      .set({ isRead: true })
      .where(eq(messages.id, id))
      .returning();
      
    return updatedMessage;
  }

  // Dispute methods
  async getDispute(id: number): Promise<Dispute | undefined> {
    const [dispute] = await db.select().from(disputes).where(eq(disputes.id, id));
    return dispute;
  }

  async getDisputesByTradeId(tradeId: number): Promise<Dispute[]> {
    return await db.select().from(disputes).where(eq(disputes.tradeId, tradeId));
  }

  async getDisputes(status?: string): Promise<Dispute[]> {
    if (status) {
      return await db.select().from(disputes).where(eq(disputes.status, status));
    }
    
    return await db.select().from(disputes);
  }

  async createDispute(dispute: InsertDispute): Promise<Dispute> {
    const [newDispute] = await db.insert(disputes).values(dispute).returning();
    return newDispute;
  }

  async resolveDispute(id: number, resolution: string): Promise<Dispute | undefined> {
    const [updatedDispute] = await db
      .update(disputes)
      .set({
        status: 'resolved',
        resolution,
        resolvedAt: new Date()
      })
      .where(eq(disputes.id, id))
      .returning();
      
    return updatedDispute;
  }

  // Admin note methods
  async getAdminNotes(disputeId: number): Promise<AdminNote[]> {
    return await db.select().from(adminNotes).where(eq(adminNotes.disputeId, disputeId));
  }

  async createAdminNote(note: InsertAdminNote): Promise<AdminNote> {
    const [newNote] = await db.insert(adminNotes).values(note).returning();
    return newNote;
  }

  // Rating methods
  async getRating(id: number): Promise<Rating | undefined> {
    const [rating] = await db.select().from(ratings).where(eq(ratings.id, id));
    return rating;
  }

  async getRatingsByUser(userId: number): Promise<Rating[]> {
    return await db.select().from(ratings).where(eq(ratings.userId, userId));
  }

  async getRatingsByTrade(tradeId: number): Promise<Rating[]> {
    return await db.select().from(ratings).where(eq(ratings.tradeId, tradeId));
  }

  async createRating(rating: InsertRating): Promise<Rating> {
    const [newRating] = await db.insert(ratings).values(rating).returning();
    return newRating;
  }

  // Wallet methods
  async getWalletBalances(userId: number): Promise<WalletBalance[]> {
    return await db.select().from(walletBalances).where(eq(walletBalances.userId, userId));
  }

  async updateWalletBalance(userId: number, currency: string, amount: number, usdValue: number): Promise<WalletBalance> {
    // First check if the wallet balance exists
    const existingBalances = await db
      .select()
      .from(walletBalances)
      .where(eq(walletBalances.userId, userId))
      .where(eq(walletBalances.currency, currency));
    
    const existingBalance = existingBalances[0];
    
    // If the balance exists, update it
    if (existingBalance) {
      const amountStr = amount.toString();
      const usdValueStr = usdValue.toString();
      
      const [updatedBalance] = await db
        .update(walletBalances)
        .set({
          amount: amountStr,
          usdValue: usdValueStr
        })
        .where(eq(walletBalances.id, existingBalance.id))
        .returning();
        
      return updatedBalance;
    }
    
    // If the balance doesn't exist, create a new one
    const amountStr = amount.toString();
    const usdValueStr = usdValue.toString();
    
    const [newBalance] = await db
      .insert(walletBalances)
      .values([{
        userId,
        currency,
        amount: amountStr,
        usdValue: usdValueStr
      }])
      .returning();
      
    return newBalance;
  }

  // Transaction methods
  async getTransactions(userId: number): Promise<Transaction[]> {
    return await db.select().from(transactions).where(eq(transactions.userId, userId));
  }

  async createTransaction(transaction: InsertTransaction): Promise<Transaction> {
    const [newTransaction] = await db.insert(transactions).values(transaction).returning();
    return newTransaction;
  }
  
  // Wallet authentication methods
  async getUserByWalletAddress(address: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.walletAddress, address));
    return user;
  }
  
  async getWalletNonce(address: string): Promise<WalletNonce | undefined> {
    const [nonce] = await db.select().from(walletNonces).where(eq(walletNonces.address, address));
    return nonce;
  }
  
  async createOrUpdateWalletNonce(address: string, nonce: string): Promise<WalletNonce> {
    // Check if nonce exists for this address
    const existingNonce = await this.getWalletNonce(address);
    
    if (existingNonce) {
      // Update existing nonce
      const [updatedNonce] = await db
        .update(walletNonces)
        .set({ 
          nonce,
          createdAt: new Date()
        })
        .where(eq(walletNonces.address, address))
        .returning();
      return updatedNonce;
    } else {
      // Create new nonce
      const [newNonce] = await db
        .insert(walletNonces)
        .values({
          address,
          nonce
        })
        .returning();
      return newNonce;
    }
  }
}

// Create and export an instance of the storage
export const storage = new DatabaseStorage();