import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from '../db';
import { accounts, userStats } from '../schema';

export const signupSchema = z.object({
    username: z.string().min(3).max(32),
    password: z.string().min(5, "Password must be at least 5 characters"),
  });

export async function getUser(username: string) {
    const result = await db
        .select()
        .from(accounts)
        .where(eq(accounts.username, username));
    return result[0];
}

export async function insertNewUser(username : string, passwordHash: string) {
    await db
        .insert(accounts)
        .values({ username, passwordHash })
        .onConflictDoNothing();
    await createUserStats(username);
}

export async function createUserStats(username: string) {
    await db
        .insert(userStats)
        .values({ username, correctQuestions: [], incorrectQuestions: [] })
        .onConflictDoNothing();
}

export async function getUserStats(username: string) {
    await createUserStats(username);
    const result = await db
        .select()
        .from(userStats)
        .where(eq(userStats.username, username));
    return { correctQuestions: result[0].correctQuestions, incorrectQuestions: result[0].incorrectQuestions};
}