import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { randomBytes } from 'crypto';

// Simple password - in production, store this in environment variable
const DASHBOARD_PASSWORD = process.env.DASHBOARD_PASSWORD || 'admin123';

// In-memory rate limiting (in production, use Redis or similar)
const loginAttempts = new Map<string, { count: number; resetTime: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_TIME = 1 * 60 * 1000; // 1 minute

function getClientId(request: NextRequest): string {
    return request.ip || request.headers.get('x-forwarded-for') || 'unknown';
}

function checkRateLimit(clientId: string): boolean {
    const now = Date.now();
    const attempts = loginAttempts.get(clientId);

    if (!attempts || now > attempts.resetTime) {
        loginAttempts.set(clientId, { count: 0, resetTime: now + LOCKOUT_TIME });
        return true;
    }

    if (attempts.count >= MAX_ATTEMPTS) {
        return false; // Locked out
    }

    return true;
}

function recordFailedAttempt(clientId: string): void {
    const now = Date.now();
    const attempts = loginAttempts.get(clientId);

    if (!attempts || now > attempts.resetTime) {
        loginAttempts.set(clientId, { count: 1, resetTime: now + LOCKOUT_TIME });
    } else {
        attempts.count++;
    }
}

function clearAttempts(clientId: string): void {
    loginAttempts.delete(clientId);
}

export async function POST(request: NextRequest) {
    try {
        const clientId = getClientId(request);

        // Check rate limiting
        if (!checkRateLimit(clientId)) {
            return NextResponse.json(
                { success: false, error: 'Too many failed attempts. Please try again later.' },
                { status: 429 }
            );
        }

        const { password } = await request.json();

        if (password === DASHBOARD_PASSWORD) {
            // Generate secure session token
            const sessionToken = randomBytes(32).toString('hex');
            
            const cookieStore = await cookies();
            cookieStore.set('dashboard-auth', sessionToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            });

            // Store session token hash for verification (in production, use Redis/DB)
            // For now, we'll verify the token format in middleware
            clearAttempts(clientId);
            return NextResponse.json({ success: true });
        } else {
            recordFailedAttempt(clientId);
            return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
        }
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Invalid request' }, { status: 400 });
    }
}

