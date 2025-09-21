import { NextResponse } from 'next/server';
import { prisma } from '../../../server/prisma';
import { z, ZodError } from 'zod';
import bcrypt from 'bcryptjs';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  role: z.enum(['patient', 'health_worker']).default('patient'),
  preferredLanguage: z.enum(['en', 'hi', 'mr']).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const { email, password, fullName, role } = bodySchema.parse(json);
    const normalizedEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email: normalizedEmail,
        name: fullName,
        role: role === 'patient' ? 'PATIENT' : 'HEALTH_WORKER',
        passwordHash,
      },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    });

    // Create linked profile row
    if (role === 'patient') {
      await prisma.patientProfile.create({ data: { userId: user.id } });
    } else {
      await prisma.healthWorkerProfile.create({ data: { userId: user.id } });
    }

  return NextResponse.json({ success: true, user: { id: user.id, email: user.email, fullName: user.name, role, createdAt: user.createdAt } });
  } catch (err: any) {
    console.error('[api/register] error', err);
    if (err instanceof ZodError) {
      return NextResponse.json({ success: false, message: 'Invalid input', issues: err.issues }, { status: 400 });
    }
    // Handle unique constraint violation
    if (err?.code === 'P2002') {
      return NextResponse.json({ success: false, message: 'Email already registered.' }, { status: 409 });
    }
    const message = typeof err?.message === 'string' ? err.message : 'Registration failed';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
