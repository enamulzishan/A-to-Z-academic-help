import crypto from 'crypto';

const password = process.argv[2] || 'admin123';
const salt = crypto.randomBytes(16).toString('hex');
const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');

console.log('=== ADMIN PASSWORD CREDENTIALS GENERATOR ===');
console.log(`Password: ${password}`);
console.log(`\nAdd these to your .env.local file:`);
console.log(`ADMIN_PASSWORD_HASH=${hash}`);
console.log(`ADMIN_PASSWORD_SALT=${salt}`);
console.log(`ADMIN_SESSION_SECRET=${crypto.randomBytes(32).toString('hex')}`);
console.log('============================================');
