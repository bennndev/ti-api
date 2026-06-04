import { SignJWT, jwtVerify } from 'jose';

export interface JwtPayload {
  sub: string;
  email: string;
  name?: string | null;
  orgId?: number | null;
  roleId?: number | null;
  type: 'api' | 'xr';
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET || 'change-me-in-production';
  return new TextEncoder().encode(secret);
}

function parseDuration(value: string): number {
  const match = value.match(/^(\d+)\s*(s|m|h|d)$/);
  if (!match)
    throw new Error(
      `Invalid duration format: ${value}. Use like "24h", "7d", "30m"`,
    );

  const num = parseInt(match[1], 10);
  const unit = match[2];

  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return num * multipliers[unit];
}

function getExpiryMs(): number {
  const raw = process.env.JWT_EXPIRY || '7d';
  return parseDuration(raw);
}

export async function signJwt(
  payload: JwtPayload,
  expiresInMs?: number,
): Promise<string> {
  const expiresAt = new Date(Date.now() + (expiresInMs ?? getExpiryMs()));

  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expiresAt)
    .setIssuedAt()
    .sign(getSecret());
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload as unknown as JwtPayload;
  } catch {
    return null;
  }
}
