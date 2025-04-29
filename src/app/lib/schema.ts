import { pgTable, varchar } from 'drizzle-orm/pg-core';

export const accounts = pgTable('accounts', {
  username: varchar('username', { length: 255 }).primaryKey(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
});