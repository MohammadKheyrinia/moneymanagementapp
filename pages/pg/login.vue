<template>
  <div class="bg-[#FFF6E5] flex w-[300px] h-[600px] mx-auto flex-col justify-center">
    <div class="rounded-3xl p-6">
      <h1 class="text-2xl font-bold text-center mb-6">Login</h1>

      <form @submit.prevent="loginUser" class="flex flex-col space-y-4">
        <input
          v-model="credentials.email"
          type="email"
          placeholder="Email"
          class="border p-2 rounded-xl border-black focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
          :disabled="isLoading"
        />

        <input
          v-model="credentials.password"
          type="password"
          placeholder="Password"
          class="border p-2 rounded-xl border-black focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
          :disabled="isLoading"
        />

        <p v-if="loginError" class="text-red-500 text-sm text-center">{{ loginError }}</p>

        <button
          type="submit"
          class="bg-purple-600 text-white py-2 rounded-xl hover:bg-purple-700 transition duration-300"
          :disabled="isLoading"
        >
          <span v-if="!isLoading">Login</span>
          <span v-else>Logging in...</span>
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        Don't have an account?
        <NuxtLink to="/pg/Register" class="text-purple-600 underline hover:text-purple-700">Register</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// Assuming useAuth composable is available if you plan to use it here,
// but for now, direct fetch is fine.

const router = useRouter();

const credentials = ref({
  email: '',
  password: ''
});

const loginError = ref(''); // Reactive variable for error messages
const isLoading = ref(false); // Reactive variable for loading state

const loginUser = async () => {
  loginError.value = ''; // Clear previous errors
  isLoading.value = true; // Set loading state

  // Basic client-side validation
  if (!credentials.value.email || !credentials.value.password) {
    loginError.value = 'Please enter both email and password.';
    isLoading.value = false;
    return;
  }

  try {
    const res = await fetch('/api/users/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials.value),
      credentials: 'include' // <--- ADDED THIS LINE
    });

    const data = await res.json(); // Always parse JSON, even on error, to get statusMessage

    // Check if the response was successful (2xx status code)
    if (!res.ok) {
      console.error('Backend error response:', data); // Log the full error data
      // Use the statusMessage from the backend error, or a generic message if not available
      throw new Error(data.statusMessage || `Login failed with status ${res.status}`);
    }

    // After successful login, ensure data.user and data.user._id exist
    if (!data.user || !data.user._id) {
        console.error('Login successful, but user data missing from response:', data);
        throw new Error('Login successful, but user data is incomplete.');
    }

    console.log('Login successful, user data:', data.user);

    // Store user in localStorage (including _id)
    localStorage.setItem('user', JSON.stringify(data.user));

    // Redirect to Homescreen
    console.log('Attempting to redirect to /pg/Homescreen');
    router.push('/pg/Homescreen');
    
  } catch (err) {
    console.error('Login error:', err.message);
    loginError.value = err.message; // Display the specific error message
  } finally {
    isLoading.value = false; // Reset loading state regardless of success or failure
  }
};

// This onMounted block runs when the component is loaded.
// It checks if a user is already logged in (from previous session) and redirects.
onMounted(async () => { // <--- Added async here
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      // More robust check for a valid _id (should be a string of 24 hex characters)
      if (user?._id && typeof user._id === 'string' && /^[0-9a-fA-F]{24}$/.test(user._id)) {
        console.log('User data in localStorage looks valid. Verifying session...');

        // Verify session by calling a protected endpoint
        const res = await fetch('/api/users/me', {
          method: 'GET', // Or POST, as per your /api/users/me implementation
          credentials: 'include' // <--- Crucial for sending the cookie
        });

        if (res.ok) {
          const userData = await res.json(); //
          console.log('Session verified successfully:', userData);
          if (router.currentRoute.value.path !== '/pg/Homescreen') {
              console.log('Redirecting to /pg/Homescreen based on existing session.');
              router.push('/pg/Homescreen');
          }
        } else {
          // If /api/users/me fails (e.g., token expired/invalid), clear localStorage and stay on login
          console.warn('Session verification failed, token might be expired or invalid. Clearing localStorage.');
          localStorage.removeItem('user');
          // No redirect, stay on login page
        }
      } else {
        // If stored user data is corrupt or not a valid ObjectId, clear it
        console.warn('Invalid or corrupt user data in localStorage, clearing and staying on login:', user);
        localStorage.removeItem('user');
      }
    } catch (err) {
      console.error('Error parsing user data from localStorage or verifying session:', err);
      localStorage.removeItem('user'); // Clear corrupt data
    }
  }
});
</script>