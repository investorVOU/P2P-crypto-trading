import { pgTable, serial, varchar, boolean, integer, decimal, timestamp, text } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: varchar("username", { length: 50 }).unique().notNull(),
  email: varchar("email", { length: 100 }).unique().notNull(),
  fullName: varchar("full_name", { length: 100 }),
  password: varchar("password", { length: 255 }).notNull(),
  verified: boolean("verified").default(false),
  walletAddress: varchar("wallet_address", { length: 255 }).unique(),
  completedTrades: integer("completed_trades").default(0),
  successRate: decimal("success_rate").default("0"),
  responseTime: integer("response_time").default(0),
  rating: decimal("rating").default("0"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow()
});

// Define the User type for TypeScript
export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Trades table
export const trades = pgTable("trades", {
  id: serial("id").primaryKey(),
  type: varchar("type", { length: 10 }).notNull(), // 'buy' or 'sell'
  amount: decimal("amount").notNull(),
  price: decimal("price").notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'open', 'in_escrow', 'completed', 'disputed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
  userId: integer("user_id").notNull().references(() => users.id),
  counterpartyId: integer("counterparty_id").references(() => users.id),
  paymentMethod: varchar("payment_method", { length: 50 })
});

export type Trade = typeof trades.$inferSelect;
export type InsertTrade = typeof trades.$inferInsert;

// Messages table
export const messages = pgTable("messages", {
  id: serial("id").primaryKey(),
  tradeId: integer("trade_id").notNull().references(() => trades.id),
  senderId: integer("sender_id").notNull().references(() => users.id),
  receiverId: integer("receiver_id").notNull().references(() => users.id),
  text: text("text").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  isRead: boolean("is_read").default(false)
});

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Disputes table
export const disputes = pgTable("disputes", {
  id: serial("id").primaryKey(),
  tradeId: integer("trade_id").notNull().references(() => trades.id),
  tradeAmount: decimal("trade_amount").notNull(),
  tradeCurrency: varchar("trade_currency", { length: 10 }).notNull(),
  reason: varchar("reason", { length: 50 }).notNull(),
  description: text("description").notNull(),
  status: varchar("status", { length: 20 }).notNull(), // 'pending', 'reviewing', 'resolved'
  resolution: varchar("resolution", { length: 20 }), // 'buyer', 'seller'
  createdAt: timestamp("created_at").defaultNow(),
  resolvedAt: timestamp("resolved_at"),
  userId: integer("user_id").notNull().references(() => users.id)
});

export type Dispute = typeof disputes.$inferSelect;
export type InsertDispute = typeof disputes.$inferInsert;

// Admin notes (for disputes)
export const adminNotes = pgTable("admin_notes", {
  id: serial("id").primaryKey(),
  disputeId: integer("dispute_id").notNull().references(() => disputes.id),
  text: text("text").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
  adminId: integer("admin_id").notNull().references(() => users.id)
});

export type AdminNote = typeof adminNotes.$inferSelect;
export type InsertAdminNote = typeof adminNotes.$inferInsert;

// Ratings table
export const ratings = pgTable("ratings", {
  id: serial("id").primaryKey(),
  tradeId: integer("trade_id").notNull().references(() => trades.id),
  raterId: integer("rater_id").notNull().references(() => users.id),
  ratedId: integer("rated_id").notNull().references(() => users.id),
  stars: integer("stars").notNull(),
  text: text("text"),
  createdAt: timestamp("created_at").defaultNow()
});

export type Rating = typeof ratings.$inferSelect;
export type InsertRating = typeof ratings.$inferInsert;

// Wallet balances table
export const walletBalances = pgTable("wallet_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  currency: varchar("currency", { length: 10 }).notNull(),
  amount: decimal("amount").notNull().default("0"),
  usdValue: decimal("usd_value").notNull().default("0")
});

export type WalletBalance = typeof walletBalances.$inferSelect;
export type InsertWalletBalance = typeof walletBalances.$inferInsert;

// Transactions table
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().references(() => users.id),
  type: varchar("type", { length: 20 }).notNull(), // 'deposit', 'withdraw', 'trade'
  amount: decimal("amount").notNull(),
  currency: varchar("currency", { length: 10 }).notNull(),
  date: timestamp("date").defaultNow(),
  details: text("details")
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// Wallet nonces table for wallet authentication
export const walletNonces = pgTable("wallet_nonces", {
  address: varchar("address", { length: 255 }).primaryKey(),
  nonce: text("nonce").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export type WalletNonce = typeof walletNonces.$inferSelect;
export type InsertWalletNonce = typeof walletNonces.$inferInsert;

// Define relations
export const usersRelations = relations(users, ({ many }) => ({
  trades: many(trades, { relationName: "user_trades" }),
  counterpartyTrades: many(trades, { relationName: "counterparty_trades" }),
  sentMessages: many(messages, { relationName: "sent_messages" }),
  receivedMessages: many(messages, { relationName: "received_messages" }),
  disputes: many(disputes),
  receivedRatings: many(ratings, { relationName: "rated" }),
  givenRatings: many(ratings, { relationName: "rater" }),
  walletBalances: many(walletBalances),
  transactions: many(transactions),
  adminNotes: many(adminNotes)
}));

export const tradesRelations = relations(trades, ({ one, many }) => ({
  user: one(users, {
    fields: [trades.userId],
    references: [users.id],
    relationName: "user_trades"
  }),
  counterparty: one(users, {
    fields: [trades.counterpartyId],
    references: [users.id],
    relationName: "counterparty_trades"
  }),
  messages: many(messages),
  disputes: many(disputes),
  ratings: many(ratings)
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  trade: one(trades, {
    fields: [messages.tradeId],
    references: [trades.id]
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
    relationName: "sent_messages"
  }),
  receiver: one(users, {
    fields: [messages.receiverId],
    references: [users.id],
    relationName: "received_messages"
  })
}));

export const disputesRelations = relations(disputes, ({ one, many }) => ({
  trade: one(trades, {
    fields: [disputes.tradeId],
    references: [trades.id]
  }),
  user: one(users, {
    fields: [disputes.userId],
    references: [users.id]
  }),
  adminNotes: many(adminNotes)
}));

export const adminNotesRelations = relations(adminNotes, ({ one }) => ({
  dispute: one(disputes, {
    fields: [adminNotes.disputeId],
    references: [disputes.id]
  }),
  admin: one(users, {
    fields: [adminNotes.adminId],
    references: [users.id]
  })
}));

export const ratingsRelations = relations(ratings, ({ one }) => ({
  rater: one(users, {
    fields: [ratings.raterId],
    references: [users.id]
  }),
  rated: one(users, {
    fields: [ratings.ratedId],
    references: [users.id]
  }),
  trade: one(trades, {
    fields: [ratings.tradeId],
    references: [trades.id]
  })
}));

export const walletBalancesRelations = relations(walletBalances, ({ one }) => ({
  user: one(users, {
    fields: [walletBalances.userId],
    references: [users.id]
  })
}));

export const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id]
  })
}));