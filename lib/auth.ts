import { cookies } from 'next/headers';

export async function isAuthenticated(): Promise<boolean> {
    const cookieStore = await cookies();
    const authCookie = cookieStore.get('dashboard-auth');
    // Verify token format (64 char hex string)
    return authCookie?.value ? /^[a-f0-9]{64}$/.test(authCookie.value) : false;
}

