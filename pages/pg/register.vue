<template>
  <div class="bg-[#FFF6E5] flex w-[300px] h-[600px] mx-auto flex-col justify-center">
    <div class="rounded-3xl p-6">
      <h1 class="text-2xl font-bold text-center mb-6">Register</h1>

      <form @submit.prevent="registerUser" class="flex flex-col space-y-4">
        <input
          v-model="form.name"
          type="text"
          placeholder="Name"
          class="border p-2 rounded-xl border-black"
          required
        />

        <input
          v-model="form.email"
          type="email"
          placeholder="Email"
          class="border p-2 rounded-xl border-black"
          required
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="border p-2 rounded-xl border-black"
          required
        />

        <button type="submit" class="bg-purple-600 text-white py-2 rounded-xl">
          Create Account
        </button>
      </form>

      <p class="text-center text-sm text-gray-600 mt-4">
        Already have an account?
        <NuxtLink to="/pg/Login" class="text-purple-600 underline">Login</NuxtLink>
      </p>

      <p v-if="errorMsg" class="text-red-600 text-sm text-center mt-4">
        {{ errorMsg }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const form = ref({
  name: '',
  email: '',
  password: '',
  // balance: 0 // Required by API with Zod, backend sets default if not provided, but sending 0 is safe
});

const errorMsg = ref('');

const registerUser = async () => {
  errorMsg.value = '';
  try {
    const res = await fetch('/api/users/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form.value),
      credentials: 'include' // <--- ADDED THIS LINE
    });

    const data = await res.json();

    if (!res.ok) throw new Error(data.statusMessage || 'Registration failed');

    console.log('User registered:', data.user);
    router.push('/pg/Login');
  } catch (err) {
    console.error('Registration error:', err.message);
    errorMsg.value = err.message || 'Registration failed';
  }
};
</script>