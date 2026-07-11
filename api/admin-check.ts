import type { VercelRequest, VercelResponse } from '@vercel/node';
import { ADMIN_COOKIE, readCookie, verifySessionCookieValue } from './_lib/adminAuth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  const cookieValue = readCookie(req.headers.cookie, ADMIN_COOKIE);
  res.status(200).json({ authorized: verifySessionCookieValue(cookieValue) });
}
