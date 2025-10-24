import { clearCookieHeader } from '@/lib/auth';

export async function POST() {
  try {
    const header = clearCookieHeader();
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { 'Set-Cookie': header, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('API /auth/logout error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
