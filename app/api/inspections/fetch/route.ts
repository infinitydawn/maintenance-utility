import { fetchInspectionsForZone } from '@/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { system_id, node_number, loop_number, zone_number, zone_prefix } = body;
    if (!system_id || !node_number || !loop_number || !zone_number) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const limit = typeof body.limit === 'number' ? body.limit : undefined;
    const rows = await fetchInspectionsForZone({ system_id, node_number, loop_number, zone_number, zone_prefix });
    // If a limit is requested, slice locally (the query already orders by tested_at DESC)
    const limited = typeof limit === 'number' ? rows.slice(0, limit) : rows;
    return new Response(JSON.stringify({ ok: true, inspections: limited }), { status: 200 });
  } catch (err: any) {
    console.error('API /inspections/fetch error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
