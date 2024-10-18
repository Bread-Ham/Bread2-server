// Générer un secret sécurisé pour JWT et SESSION
import crypto from 'crypto';

// Générer un secret de 32 octets (256 bits)
const jwtSecret = crypto.randomBytes(32).toString('hex');
const sessionSecret = crypto.randomBytes(32).toString('hex');

console.log(`JWT_SECRET=${jwtSecret}`);
console.log(`SESSION_SECRET=${sessionSecret}`);