import { fetchBuildings } from '@/lib/data';

export async function GET() {
  try {
    const buildings = await fetchBuildings();
    return new Response(JSON.stringify(buildings), { status: 200 });
  } catch (err) {
    console.error('API /buildings error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
