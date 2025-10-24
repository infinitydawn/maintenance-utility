import { getUserByUsername } from '@/lib/actions';
import { signSession, cookieHeaderForValue } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;
    if (!username || !password) return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400 });
    const user = await getUserByUsername(username);
    if (!user) return new Response(JSON.stringify({ error: 'Invalid username or password' }), { status: 401 });
    const derived = crypto.scryptSync(password, user.salt, 64).toString('hex');
    if (derived !== user.password_hash) return new Response(JSON.stringify({ error: 'Invalid username or password' }), { status: 401 });
    const { cookieValue, maxAge } = signSession({ username: user.username, is_admin: user.is_admin });
    const header = cookieHeaderForValue(cookieValue, maxAge);
    return new Response(JSON.stringify({ ok: true, username: user.username, is_admin: user.is_admin }), { status: 200, headers: { 'Set-Cookie': header, 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('API /auth/login error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
