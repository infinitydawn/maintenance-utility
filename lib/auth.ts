import crypto from 'crypto';

const COOKIE_NAME = process.env.SESSION_COOKIE_NAME || 'mu_session';
const SECRET = process.env.AUTH_SECRET || process.env.SESSION_SECRET || 'please_change_this_secret';
const DEFAULT_MAX_AGE = Number(process.env.SESSION_MAX_AGE || String(60 * 60 * 24 * 7)); // 7 days

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64').replace(/=+$/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function unbase64url(input: string) {
  input = input.replace(/-/g, '+').replace(/_/g, '/');
  // pad
  while (input.length % 4) input += '=';
  return Buffer.from(input, 'base64').toString();
}

export function signSession(payload: { username: string; is_admin: boolean; iat?: number; exp?: number }, maxAgeSeconds = DEFAULT_MAX_AGE) {
  const iat = Date.now();
  const exp = iat + (maxAgeSeconds * 1000);
  const body = { username: payload.username, is_admin: Boolean(payload.is_admin), iat, exp };
  const bodyStr = JSON.stringify(body);
  const bodyB64 = base64url(bodyStr);
  const hmac = crypto.createHmac('sha256', SECRET).update(bodyB64).digest('base64');
  const sig = base64url(hmac);
  const cookieValue = `${bodyB64}.${sig}`;
  return { cookieName: COOKIE_NAME, cookieValue, maxAge: maxAgeSeconds };
}

export function verifySession(cookieValue: string | undefined) {
  if (!cookieValue) return null;
  try {
    const parts = cookieValue.split('.');
    if (parts.length !== 2) return null;
    const [bodyB64, sig] = parts;
    const expectedHmac = crypto.createHmac('sha256', SECRET).update(bodyB64).digest('base64');
    const expectedSig = base64url(expectedHmac);
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expectedSig))) return null;
    const bodyStr = unbase64url(bodyB64);
    const body = JSON.parse(bodyStr) as { username: string; is_admin: boolean; iat: number; exp: number };
    if (Date.now() > body.exp) return null;
    return { username: body.username, is_admin: Boolean(body.is_admin) };
  } catch (err) {
    console.error('verifySession error', err);
    return null;
  }
}

export function cookieHeaderForValue(cookieValue: string, maxAgeSeconds?: number) {
  const parts = [`${COOKIE_NAME}=${cookieValue}`, 'Path=/', 'HttpOnly', 'SameSite=Lax'];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  if (typeof maxAgeSeconds === 'number') parts.push(`Max-Age=${maxAgeSeconds}`);
  return parts.join('; ');
}

export function clearCookieHeader() {
  const parts = [`${COOKIE_NAME}=deleted`, 'Path=/', 'HttpOnly', 'SameSite=Lax', 'Expires=Thu, 01 Jan 1970 00:00:00 GMT'];
  if (process.env.NODE_ENV === 'production') parts.push('Secure');
  return parts.join('; ');
}

export { COOKIE_NAME };
