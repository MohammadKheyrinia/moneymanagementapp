// File: ~/server/utils/jwt.ts

import jwt from 'jsonwebtoken';

// Make sure this is the same secret key used in your auth.ts middleware
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

/**
 * Generates a JSON Web Token with the correct payload structure.
 * The payload MUST be an object with a 'userId' key, because that is
 * what your auth middleware looks for.
 * * @param userId The user's ID from the database.
 * @returns The signed JWT string.
 */
export function generateToken(userId: string): string {
  // Define the payload with the 'userId' key
  const payload = {
    userId: userId 
  };

  // Sign the token
  const token = jwt.sign(payload, JWT_SECRET, {
    expiresIn: '7d', // It's good practice to set an expiration
  });

  return token;
}