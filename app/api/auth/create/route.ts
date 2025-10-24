import { createUser as dbCreateUser, getUserByUsername } from '@/lib/actions';
import { COOKIE_NAME, verifySession } from '@/lib/auth';
import crypto from 'crypto';

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({} as any));
    const { username, password, is_admin } = body;

    // Basic validation
    if (!username || !password) return new Response(JSON.stringify({ error: 'Missing username or password' }), { status: 400 });

    // Check session: allow if caller is admin
    const cookie = req.headers.get('cookie') || '';
    const match = cookie.split(';').map(s=>s.trim()).find(s=>s.startsWith(COOKIE_NAME+'='));
    const value = match ? match.split('=')[1] : undefined;
    const session = verifySession(value);

    // If there are no users yet, allow creation (initial setup) using env-provided admin
    const existing = await getUserByUsername(username);
    if (existing) return new Response(JSON.stringify({ error: 'User already exists' }), { status: 400 });

    // enforce admin requirement for creating users, except for first-time setup
    // If session is not admin, check if users table is empty by trying to fetch ADMIN_USERNAME
    const allow = session?.is_admin ?? false;

    // If no session and ADMIN_USERNAME/ADMIN_PASSWORD present and no users exist, allow creation that matches env
    let usersExist = true;
    try {
      // crude check: try to fetch ADMIN_USERNAME from DB
      const adminLookup = await getUserByUsername(process.env.ADMIN_USERNAME || '__no_username__');
      usersExist = !!adminLookup;
    } catch (err) {
      usersExist = true;
    }

    if (!allow && usersExist) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }

    // create password hash
    const salt = crypto.randomBytes(16).toString('hex');
    const derived = crypto.scryptSync(password, salt, 64).toString('hex');
    const created = await dbCreateUser({ username, password_hash: derived, salt, is_admin: !!is_admin });
    return new Response(JSON.stringify({ ok: true, user: { username: created.username, is_admin: created.is_admin } }), { status: 200 });
  } catch (err) {
    console.error('API /auth/create error', err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
}
