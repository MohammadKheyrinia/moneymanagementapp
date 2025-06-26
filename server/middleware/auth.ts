// File: server/middleware/auth.ts

import jwt from 'jsonwebtoken';
import { getCookie, deleteCookie } from 'h3';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export default defineEventHandler(async (event) => {
  // Get the URL of the incoming request.
  const url = event.node.req.url;

  // IMPORTANT: If the URL is undefined, something is wrong with the request itself.
  // We will stop here to avoid further errors.
  if (!url) {
    return;
  }

  // This is the most critical part of the fix.
  // We check if the request is for a frontend page (like '/_nuxt/...' or '/pg/Login')
  // or a public API endpoint.
  // By checking if the URL starts with '/api/', we can separate server requests
  // from frontend page loads.
  if (!url.startsWith('/api/')) {
    // This is NOT an API call. It's a request for a page, a script, or a style file.
    // The auth middleware should IGNORE it completely.
    return;
  }
  
  // Define the list of API routes that are explicitly public.
  const publicApiRoutes = [
    '/api/users/login',
    '/api/users/register'
  ];

  // Check if the requested API route is in our public list.
  if (publicApiRoutes.includes(url)) {
    // This is a public API route (login or register).
    // The auth middleware should IGNORE it.
    return;
  }

  // --- If the code reaches this point, it is a PROTECTED API route ---
  // We must now verify the authentication token.

  const token = getCookie(event, 'auth_token');

  if (!token) {
    // No token was found. The user is not authorized.
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: No token provided',
    });
  }

  try {
    // Try to verify the token.
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    
    // If successful, attach the user's ID to the request context
    // so other API routes can use it.
    event.context.user = { userId: decoded.userId };

  } catch (error: any) {
    // The token is invalid (expired, malformed, etc.).
    // For good measure, we delete the bad cookie from the user's browser.
    deleteCookie(event, 'auth_token');

    // Throw an error to block the request.
    throw createError({
      statusCode: 401,
      statusMessage: `Unauthorized: ${error.message || 'Invalid token'}`,
    });
  }
});
