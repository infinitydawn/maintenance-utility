import { createInspection } from '@/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    // basic validation
    const { system_id, node_number, loop_number, zone_number, zone_prefix, passed, comments } = body;
    if (!system_id || !node_number || !loop_number || !zone_number || typeof passed !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    try {
      const created = await createInspection({ system_id, node_number, loop_number, zone_number, zone_prefix, passed, comments });
      return new Response(JSON.stringify({ ok: true, inspection: created }), { status: 201 });
    } catch (err: any) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('relation "inspections" does not exist') || msg.includes('does not exist')) {
        return new Response(JSON.stringify({ error: 'Inspections table does not exist. Run migrations.' }), { status: 500 });
      }
      throw err;
    }
  } catch (err: any) {
    console.error('API /inspections/create error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
