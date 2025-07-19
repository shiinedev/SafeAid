// --- src/utils/encryption.ts ---
// import crypto from 'crypto';

// const key = crypto.scryptSync(process.env.JWT_SECRET!, 'salt', 32);
// const iv = Buffer.alloc(16, 0);

// export const encrypt = (text: string): string => {
//   const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
//   return Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('hex');
// };

// export const decrypt = (encrypted: string): string => {
//   const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
//   return Buffer.concat([decipher.update(Buffer.from(encrypted, 'hex')), decipher.final()]).toString('utf8');
// };

import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();
const secret = process.env.JWT_SECRET;

if (!secret) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

const key = crypto.scryptSync(secret, 'salt', 32);
const iv = Buffer.alloc(16, 0);

export const encrypt = (text: string): string => {
  if (!text || typeof text !== 'string') {
    throw new TypeError('encrypt() requires a non-empty string as input');
  }
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  return Buffer.concat([cipher.update(text, 'utf8'), cipher.final()]).toString('hex');
};
export const decrypt = (encrypted: string): string => {
  if (!encrypted || typeof encrypted !== 'string') {
    throw new TypeError('decrypt() requires a non-empty string as input');
  }
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  return Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'hex')),
    decipher.final()
  ]).toString('utf8');
};
