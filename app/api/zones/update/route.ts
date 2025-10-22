import { NextResponse } from 'next/server';
import { updateZoneLevelInfo } from '@/lib/actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { field, value, info } = body || {};
    if (!field || typeof info !== 'object') {
      return NextResponse.json({ error: 'Missing field or info' }, { status: 400 });
    }
    const result = await updateZoneLevelInfo(field, value, info);
    return NextResponse.json({ result });
  } catch (err) {
    console.error('API /api/zones/update error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
