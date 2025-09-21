import { prisma } from '../server/prisma';

export default async function handler(_req: any, res: any) {
  try {
    const users = await prisma.user.count();
    res.status(200).json({ status: 'ok', db: 'connected', users });
  } catch (error) {
    console.error('[api/health] error', error);
    res.status(500).json({ status: 'error', error: 'DB connection failed' });
  }
}
