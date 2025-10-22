import { renameZone } from '@/lib/actions';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { system_id, node_number, loop_number, zone_number, zone_prefix, new_zone_number, new_zone_prefix } = body;
    if (!system_id || !node_number || !loop_number || !zone_number || typeof new_zone_number !== 'number') {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    await renameZone({ system_id, node_number, loop_number, zone_number, zone_prefix }, new_zone_number, new_zone_prefix);
    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('API /zones/rename error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
