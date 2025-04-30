import { sql } from "drizzle-orm";
import { pgTable, text, integer, varchar } from "drizzle-orm/pg-core";

export const accounts = pgTable('accounts', {
  username: varchar('username', { length: 255 }).primaryKey(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
});

export const userStats = pgTable("user_stats", {
  username: text("username").primaryKey(),
  correctQuestions: integer("correct_questions")
    .array()
    .notNull()
    .default(sql`ARRAY[]::integer[]`),
  incorrectQuestions: integer("incorrect_questions")
    .array()
    .notNull()
    .default(sql`ARRAY[]::integer[]`),
});