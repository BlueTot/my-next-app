import { signupSchema, getUser, insertNewUser } from './queries';
import bcryptjs from 'bcryptjs';

export async function createAccount(data: unknown) {
    const parsed = signupSchema.safeParse(data);

    if (!parsed.success) {
        return { success: false, error: 'Invalid input' };
    }

    const { username, password } = parsed.data;

    const existing = await getUser(username);
    if (existing) {
        return { success: false, error: 'Username already exists' };
    }

    const passwordHash = await bcryptjs.hash(password, 10);

    await insertNewUser(username, passwordHash);
    return { success: true };
}