import { COOKIE_NAME, verifySession } from '@/lib/auth';

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE_NAME+'='));
    const value = match ? match.split('=')[1] : undefined;
    const session = verifySession(value);
    if (!session) return new Response(JSON.stringify({ authenticated: false }), { status: 200 });
    return new Response(JSON.stringify({ authenticated: true, username: session.username, is_admin: session.is_admin }), { status: 200 });
  } catch (err) {
    console.error('API /auth/me error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
