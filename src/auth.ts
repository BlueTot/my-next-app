import NextAuth from 'next-auth';
import { authConfig } from '../auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import { eq } from 'drizzle-orm';
import { db } from './app/lib/db';
import { accounts } from './app/lib/schema';
import bcryptjs from 'bcryptjs';

export const signupSchema = z.object({
    username: z.string().min(3).max(32),
    password: z.string().min(8, "Password must be at least 8 characters"),
  });

async function getUser(username: string) {
    const result = await db
        .select()
        .from(accounts)
        .where(eq(accounts.username, username));
    return result[0];
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = z
                .object({ username: z.string().min(3).max(32), password: z.string().min(8) })
                .safeParse(credentials);
            
            if (!parsedCredentials.success) return null;

            const { username, password } = parsedCredentials.data;
            const user = await getUser(username);
            if (!user) return null;
            const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
            if (!passwordMatch) return null;

            return {
                id: user.username,
                username: user.username
            };
        }
    })
  ]
});