// composables/useAuth.ts

import { useRouter } from 'vue-router';

/**
 * A composable function to handle authentication logic,
 * such as logging out a user.
 */
export function useAuth() {
  const router = useRouter();

  /**
   * Logs the user out by calling the server's logout endpoint,
   * clearing local session data, and redirecting to the login page.
   */
  const logout = async () => {
    try {
      // 1. Call the backend API to invalidate the session cookie.
      // We don't need to check the response unless there's a specific error to handle.
      await fetch('/api/users/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      // Log the error but continue with the logout process on the client-side.
      // This ensures the user is logged out visually even if the server call fails.
      console.error('Failed to communicate with the logout endpoint:', error);
    } finally {
      // 2. Clear user data from localStorage.
      // This removes the client-side record of the user being logged in.
      localStorage.removeItem('user');

      // 3. Redirect to the login page.
      // This is the most crucial step to prevent the 401 error. It moves the user
      // away from any protected pages before they can make another authenticated API call.
      // Using { external: true } can help ensure a full page reload, clearing any residual state.
      await router.push({ path: '/pg/Login', force: true });
    }
  };

  // You can add other auth-related functions here in the future (e.g., login, register).
  return {
    logout,
  };
}