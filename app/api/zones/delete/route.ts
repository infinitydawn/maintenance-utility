import { deleteZone } from '@/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const { system_id, node_number, loop_number, zone_number, zone_prefix } = body;
    if (!system_id || !node_number || !loop_number || !zone_number) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const deleted = await deleteZone({ system_id, node_number, loop_number, zone_number, zone_prefix });
    return new Response(JSON.stringify({ ok: true, deleted }), { status: 200 });
  } catch (err) {
    console.error('API /zones/delete error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
