import { NextResponse } from 'next/server';
import { createZone } from '@/lib/actions';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { info, rows } = body as any;
    if (!info || !rows || !Array.isArray(rows)) {
      return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
    }

    const results: { ok: any[]; errors: any[] } = { ok: [], errors: [] };

    for (const r of rows) {
      try {
        const payload = {
          zone_number: Number(r.zone_number) || 0,
          zone_prefix: r.zone_prefix ?? '',
          zone_tag_1: r.zone_tag_1 ?? '',
          zone_tag_2: r.zone_tag_2 ?? '',
          loop_number: Number(info.loop_number),
          loop_info: '',
          node_number: Number(info.node_number),
          system_id: Number(info.system_id),
          building_id: Number(info.building_id),
        };
        await createZone(payload);
        results.ok.push(payload);
      } catch (err: any) {
        results.errors.push({ row: r, error: err?.message ?? String(err) });
      }
    }

    return NextResponse.json({ imported: results.ok.length, errors: results.errors });
  } catch (err: any) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
