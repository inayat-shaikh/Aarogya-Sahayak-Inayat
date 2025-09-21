import { prisma } from '../server/prisma';
import { z, ZodError } from 'zod';
import bcrypt from 'bcryptjs';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  fullName: z.string().min(1),
  role: z.enum(['patient', 'health_worker']).default('patient'),
  preferredLanguage: z.enum(['en', 'hi', 'mr']).optional(),
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { email, password, fullName, role } = bodySchema.parse(req.body ?? {});
    const normalizedEmail = email.toLowerCase();

    const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
    if (existing) {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
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

    if (role === 'patient') {
      await prisma.patientProfile.create({ data: { userId: user.id } });
    } else {
      await prisma.healthWorkerProfile.create({ data: { userId: user.id } });
    }

    return res.status(200).json({ success: true, user: { id: user.id, email: user.email, fullName: user.name, role, createdAt: user.createdAt } });
  } catch (err: any) {
    console.error('[api/register] error', err);
    if (err instanceof ZodError) {
      return res.status(400).json({ success: false, message: 'Invalid input', issues: err.issues });
    }
    if (err?.code === 'P2002') {
      return res.status(409).json({ success: false, message: 'Email already registered.' });
    }
    const message = typeof err?.message === 'string' ? err.message : 'Registration failed';
    return res.status(500).json({ success: false, message });
  }
}
