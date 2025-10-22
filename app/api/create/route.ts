import { NextResponse } from 'next/server';
import {
  createBuilding,
  createSystem,
  createNode,
  createLoop,
  createZone,
} from '@/lib/actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, payload } = body || {};

    if (!type || !payload) {
      return NextResponse.json({ error: 'Missing type or payload' }, { status: 400 });
    }

    switch (type) {
      case 'building':
        return NextResponse.json({ result: await createBuilding(payload) });
      case 'system':
        return NextResponse.json({ result: await createSystem(payload) });
      case 'node':
        return NextResponse.json({ result: await createNode(payload) });
      case 'loop':
        return NextResponse.json({ result: await createLoop(payload) });
      case 'zone':
        return NextResponse.json({ result: await createZone(payload) });
      default:
        return NextResponse.json({ error: 'Unknown type' }, { status: 400 });
    }
  } catch (err) {
    console.error('API /api/create error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
