import { NextResponse } from 'next/server';
import { prisma } from '../../../server/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, password } = bodySchema.parse(json);

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.name,
      role: user.role === 'PATIENT' ? 'patient' : user.role === 'HEALTH_WORKER' ? 'health_worker' : 'patient',
      createdAt: user.createdAt,
    };

    const tokenPayload = {
      user: safeUser,
      exp: Date.now() + 24 * 60 * 60 * 1000,
      iat: Date.now(),
    };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    return NextResponse.json({ success: true, user: safeUser, token });
  } catch (err: any) {
    console.error('[api/login] error', err);
    const message = typeof err?.message === 'string' ? err.message : 'Login failed';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
