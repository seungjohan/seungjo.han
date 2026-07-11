import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createSessionCookieValue, sessionCookieHeader, verifyPassword } from './_lib/adminAuth';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = typeof req.body === 'string' ? safeJsonParse(req.body) : req.body;
  const password = body?.password;

  if (!verifyPassword(password)) {
    res.status(401).json({ error: 'Incorrect password.' });
    return;
  }

  res.setHeader('Set-Cookie', sessionCookieHeader(createSessionCookieValue()));
  res.status(200).json({ ok: true });
}

function safeJsonParse(raw: string): { password?: unknown } {
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
