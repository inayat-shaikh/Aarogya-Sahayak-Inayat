import { prisma } from '../server/prisma';
import { z } from 'zod';
import bcrypt from 'bcryptjs';

const bodySchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const { email, password } = bodySchema.parse(req.body ?? {});

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const safeUser = {
      id: user.id,
      email: user.email,
      fullName: user.name,
      role: user.role === 'PATIENT' ? 'patient' : user.role === 'HEALTH_WORKER' ? 'health_worker' : 'patient',
      createdAt: user.createdAt,
    };

    const tokenPayload = { user: safeUser, exp: Date.now() + 24 * 60 * 60 * 1000, iat: Date.now() };
    const token = Buffer.from(JSON.stringify(tokenPayload)).toString('base64');

    return res.status(200).json({ success: true, user: safeUser, token });
  } catch (err: any) {
    console.error('[api/login] error', err);
    const message = typeof err?.message === 'string' ? err.message : 'Login failed';
    return res.status(500).json({ success: false, message });
  }
}
