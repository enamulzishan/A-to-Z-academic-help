import crypto from 'crypto';

export * from './session';

/**
 * Verifies the admin password against ADMIN_PASSWORD or ADMIN_PASSWORD_HASH in .env.local.
 * Runs in Node.js server route handlers.
 */
export function verifyAdminPassword(password: string): boolean {
  // 1. Direct env variable check (ADMIN_PASSWORD in .env.local)
  const plainAdminPassword = process.env.ADMIN_PASSWORD;
  if (plainAdminPassword) {
    const inputBuf = Buffer.from(password);
    const expectedBuf = Buffer.from(plainAdminPassword);
    if (inputBuf.length === expectedBuf.length && crypto.timingSafeEqual(inputBuf, expectedBuf)) {
      return true;
    }
  }

  // 2. Salted hash check (ADMIN_PASSWORD_HASH + ADMIN_PASSWORD_SALT)
  const expectedHash = process.env.ADMIN_PASSWORD_HASH;
  const salt = process.env.ADMIN_PASSWORD_SALT;

  if (expectedHash && salt) {
    try {
      const computedHash = crypto
        .pbkdf2Sync(password, salt, 100000, 64, 'sha512')
        .toString('hex');

      const expectedBuffer = Buffer.from(expectedHash, 'hex');
      const computedBuffer = Buffer.from(computedHash, 'hex');

      if (expectedBuffer.length === computedBuffer.length) {
        return crypto.timingSafeEqual(expectedBuffer, computedBuffer);
      }
    } catch (error) {
      console.error('Error during password verification:', error);
    }
  }

  // Default fallback for initial testing if no password env var is provided
  if (!plainAdminPassword && !expectedHash) {
    return password === 'admin123';
  }

  return false;
}
