const { pgTable, serial, text, varchar, timestamp, decimal, integer, boolean } = require('drizzle-orm/pg-core');
const { relations } = require('drizzle-orm');

// User model
const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull().unique(),
  email: varchar('email', { length: 100 }).notNull().unique(),
  password: varchar('password', { length: 255 }).notNull(),
  fullName: varchar('full_name', { length: 100 }),
  avatarUrl: varchar('avatar_url', { length: 255 }),
  bio: text('bio'),
  is_admin: boolean('is_admin').default(false).notNull(),
  tradeCount: integer('trade_count').default(0),
  avgRating: decimal('avg_rating', { precision: 3, scale: 2 }),
  walletAddress: varchar('wallet_address', { length: 42 }),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Trade model
const trades = pgTable('trades', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  type: varchar('type', { length: 4 }).notNull(), // 'buy' or 'sell'
  title: varchar('title', { length: 100 }).notNull(),
  description: text('description'),
  currency: varchar('currency', { length: 10 }).notNull(), // 'BTC', 'ETH', etc.
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(), // Price in USD
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(),
  status: varchar('status', { length: 20 }).notNull().default('open'), // 'open', 'in_progress', 'completed', 'cancelled', 'disputed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at'),
  completedAt: timestamp('completed_at'),
  cancelledAt: timestamp('cancelled_at')
});

// Message model
const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  tradeId: integer('trade_id').notNull(),
  userId: integer('user_id').notNull(),
  content: text('content').notNull(),
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Dispute model
const disputes = pgTable('disputes', {
  id: serial('id').primaryKey(),
  tradeId: integer('trade_id').notNull(),
  userId: integer('user_id').notNull(),
  reason: text('reason').notNull(),
  evidence: text('evidence'),
  status: varchar('status', { length: 20 }).notNull().default('open'), // 'open', 'under_review', 'resolved'
  resolution: text('resolution'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  resolvedAt: timestamp('resolved_at')
});

// Admin notes model
const adminNotes = pgTable('admin_notes', {
  id: serial('id').primaryKey(),
  disputeId: integer('dispute_id').notNull(),
  adminId: integer('admin_id').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Rating model
const ratings = pgTable('ratings', {
  id: serial('id').primaryKey(),
  tradeId: integer('trade_id').notNull(),
  fromUserId: integer('from_user_id').notNull(),
  toUserId: integer('to_user_id').notNull(),
  rating: integer('rating').notNull(), // 1-5 stars
  comment: text('comment'),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Wallet balance model
const walletBalances = pgTable('wallet_balances', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  currency: varchar('currency', { length: 10 }).notNull(), // 'BTC', 'ETH', 'USD', etc.
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull().default('0'),
  usdValue: decimal('usd_value', { precision: 12, scale: 2 }).notNull().default('0'), // Value in USD
  updatedAt: timestamp('updated_at').defaultNow().notNull()
});

// Transaction model
const transactions = pgTable('transactions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').notNull(),
  type: varchar('type', { length: 20 }).notNull(), // 'deposit', 'withdrawal', 'trade', 'fee'
  currency: varchar('currency', { length: 10 }).notNull(),
  amount: decimal('amount', { precision: 20, scale: 8 }).notNull(),
  usdValue: decimal('usd_value', { precision: 12, scale: 2 }).notNull(),
  relatedTradeId: integer('related_trade_id'),
  txHash: varchar('tx_hash', { length: 100 }),
  status: varchar('status', { length: 20 }).notNull().default('completed'), // 'pending', 'completed', 'failed'
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Wallet nonce model for authentication
const walletNonces = pgTable('wallet_nonces', {
  id: serial('id').primaryKey(),
  address: varchar('address', { length: 42 }).notNull().unique(),
  nonce: text('nonce').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull()
});

// Define relationships
const usersRelations = relations(users, ({ many }) => ({
  trades: many(trades),
  messages: many(messages),
  disputes: many(disputes),
  adminNotes: many(adminNotes),
  sentRatings: many(ratings, { relationName: 'sentRatings' }),
  receivedRatings: many(ratings, { relationName: 'receivedRatings' }),
  walletBalances: many(walletBalances),
  transactions: many(transactions)
}));

const tradesRelations = relations(trades, ({ one, many }) => ({
  user: one(users, {
    fields: [trades.userId],
    references: [users.id]
  }),
  messages: many(messages),
  disputes: many(disputes),
  ratings: many(ratings)
}));

const messagesRelations = relations(messages, ({ one }) => ({
  trade: one(trades, {
    fields: [messages.tradeId],
    references: [trades.id]
  }),
  user: one(users, {
    fields: [messages.userId],
    references: [users.id]
  })
}));

const disputesRelations = relations(disputes, ({ one, many }) => ({
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

const adminNotesRelations = relations(adminNotes, ({ one }) => ({
  dispute: one(disputes, {
    fields: [adminNotes.disputeId],
    references: [disputes.id]
  }),
  admin: one(users, {
    fields: [adminNotes.adminId],
    references: [users.id]
  })
}));

const ratingsRelations = relations(ratings, ({ one }) => ({
  trade: one(trades, {
    fields: [ratings.tradeId],
    references: [trades.id]
  }),
  fromUser: one(users, {
    fields: [ratings.fromUserId],
    references: [users.id],
    relationName: 'sentRatings'
  }),
  toUser: one(users, {
    fields: [ratings.toUserId],
    references: [users.id],
    relationName: 'receivedRatings'
  })
}));

const walletBalancesRelations = relations(walletBalances, ({ one }) => ({
  user: one(users, {
    fields: [walletBalances.userId],
    references: [users.id]
  })
}));

const transactionsRelations = relations(transactions, ({ one }) => ({
  user: one(users, {
    fields: [transactions.userId],
    references: [users.id]
  }),
  trade: one(trades, {
    fields: [transactions.relatedTradeId],
    references: [trades.id]
  })
}));

module.exports = {
  users,
  trades,
  messages,
  disputes,
  adminNotes,
  ratings,
  walletBalances,
  transactions,
  walletNonces,
  usersRelations,
  tradesRelations,
  messagesRelations,
  disputesRelations,
  adminNotesRelations,
  ratingsRelations,
  walletBalancesRelations,
  transactionsRelations
};