import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler(async (event) => {
  // Use the built-in deleteCookie utility to clear the auth_token.
  // This works by setting the cookie's expiration date to the past.
  deleteCookie(event, 'auth_token', {
    // You must provide the same options that were used to set the cookie
    httpOnly: true,
    path: '/',
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production',
  });

  return {
    message: 'Logout successful',
  };
});