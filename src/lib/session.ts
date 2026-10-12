export const ADMIN_COOKIE_NAME = 'admin_session';

/**
 * Returns the secret key used for HMAC session tokens.
 */
function getSessionSecret(): string {
  return process.env.ADMIN_SESSION_SECRET || 'academic-help-secret-admin-session-key-32chars';
}

function base64UrlEncode(str: string): string {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64UrlDecode(str: string): string {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return atob(base64);
}

function bufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return base64UrlEncode(binary);
}

function base64UrlToBuffer(str: string): Uint8Array {
  const binary = base64UrlDecode(str);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

/**
 * Portable Web-Crypto session token creator.
 * Compatible with Edge Middleware and Node.js.
 */
export async function createSessionToken(expiresInHours = 168): Promise<string> {
  const encoder = new TextEncoder();
  const secretKey = getSessionSecret();
  const expiry = Date.now() + expiresInHours * 60 * 60 * 1000;
  const payloadJson = JSON.stringify({ exp: expiry, iat: Date.now() });

  const payloadB64 = base64UrlEncode(payloadJson);

  const subtle = globalThis.crypto?.subtle;
  if (!subtle) {
    throw new Error('Web Crypto API is not available in the current environment.');
  }

  const key = await subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signatureBuffer = await subtle.sign(
    'HMAC',
    key,
    encoder.encode(payloadB64)
  );

  const signatureB64 = bufferToBase64Url(signatureBuffer);
  return `${payloadB64}.${signatureB64}`;
}

/**
 * Portable Web-Crypto session verification.
 * 100% compatible with Next.js Edge Middleware and Node runtimes without any node modules.
 */
export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;

  const parts = token.split('.');
  if (parts.length !== 2) return false;

  const [payloadB64, signatureB64] = parts;

  try {
    const encoder = new TextEncoder();
    const secretKey = getSessionSecret();
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) return false;

    const key = await subtle.importKey(
      'raw',
      encoder.encode(secretKey),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const sigBytes = base64UrlToBuffer(signatureB64);
    const isValid = await subtle.verify(
      'HMAC',
      key,
      sigBytes as unknown as BufferSource,
      encoder.encode(payloadB64)
    );

    if (!isValid) return false;

    const payloadJson = base64UrlDecode(payloadB64);
    const payload = JSON.parse(payloadJson);

    if (!payload.exp || typeof payload.exp !== 'number') return false;
    if (Date.now() > payload.exp) return false;

    return true;
  } catch {
    return false;
  }
}
