import { NextResponse } from 'next/server';
import { showTables, createTable } from '@/app/lib/actions';

export async function GET() {
  try {
    const tables = await showTables();
    return NextResponse.json({ tables });
  } catch (err) {
    console.error('API GET /api/tables error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({} as any));
    const tableName = body?.tableName || 'zones';
    const result = await createTable(tableName);
    return NextResponse.json({ result });
  } catch (err) {
    console.error('API POST /api/tables error', err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
