import NextAuth from 'next-auth';
import { authConfig } from '../../../../auth.config';
import Credentials from 'next-auth/providers/credentials';
import bcryptjs from 'bcryptjs';
import { signupSchema, getUser } from './queries';
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
        async authorize(credentials) {
            const parsedCredentials = signupSchema
                .safeParse(credentials);
            
            if (!parsedCredentials.success) return null;

            const { username, password } = parsedCredentials.data;
            const user = await getUser(username);
            if (!user) return null;
            const passwordMatch = await bcryptjs.compare(password, user.passwordHash);
            if (!passwordMatch) return null;

            return {
                id: user.username,
                name: user.username
            };
        }
    })
  ]
});