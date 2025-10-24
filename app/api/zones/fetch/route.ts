import { fetchZonesInfo } from '@/lib/data';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const { system_id, node_number, loop_number, query } = body;
    if (!system_id || !node_number || !loop_number) {
      return new Response(JSON.stringify({ error: 'Missing required fields' }), { status: 400 });
    }
    const rows = await fetchZonesInfo(system_id, node_number, loop_number, query);
    return new Response(JSON.stringify({ ok: true, rows }), { status: 200 });
  } catch (err) {
    console.error('API /zones/fetch error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
