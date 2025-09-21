import { NextResponse } from 'next/server';
import { prisma } from '../../../server/prisma';

export async function GET() {
  try {
    const users = await prisma.user.count();
    return NextResponse.json({ status: 'ok', db: 'connected', users });
  } catch (error) {
    console.error('[api/health] error', error);
    return NextResponse.json(
      { status: 'error', error: 'DB connection failed' },
      { status: 500 }
    );
  }
}
