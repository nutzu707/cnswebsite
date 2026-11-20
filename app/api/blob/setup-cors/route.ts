import { ensureR2Cors } from '@/lib/r2';
import { isAuthenticated } from '@/lib/auth';
import { NextResponse } from 'next/server';

/** Authenticated helper so the dashboard can force/refresh R2 CORS. */
export async function POST(): Promise<NextResponse> {
    try {
        if (!(await isAuthenticated())) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const result = await ensureR2Cors();
        return NextResponse.json(result, { status: result.ok ? 200 : 500 });
    } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error';
        return NextResponse.json({ ok: false, message }, { status: 500 });
    }
}

export async function GET(): Promise<NextResponse> {
    return POST();
}
