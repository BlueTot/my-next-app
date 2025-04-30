'use server';

import { signIn } from '@/app/lib/auth/login';
import { AuthError } from 'next-auth';
import { createAccount } from '@/app/lib/auth/create';
import { redirect } from 'next/navigation';

export async function authenticate(
    prevState: string | undefined,
    formData: FormData,
) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            const err = error as AuthError & { type?: string }; // Cast to expected structure
            switch (err.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function registerUser(prevState: string | undefined, formData: FormData) {
    const username = formData.get('username');
    const password = formData.get('password');
  
    const result = await createAccount({ username, password });
    if (!result.success) {
      return result.error;
    }
  
    // // Auto-login after signup (optional)
    // await signIn('credentials', { username, password });
    redirect('/login');
  
    return 'Success';
}