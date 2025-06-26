<template>
  <div class="bg-[#FFF6E5] flex w-[300px] h-[600px] ml-auto mr-auto flex-col relative">
    <div class="pb-12 pt-[80px] flex pl-4 items-center gap-x-8">
      <div class="rounded-full border-purple-700 border">
        <img src="/assets/Rectangle 8.png" alt="Profile" />
      </div>
      <div class="w-2/4">
        <p class="pl-1 text-sm text-[#91919F]">Username</p>
        <h1 class="font-bold text-nowrap text-lg">{{ currentUser?.name || 'Guest' }}</h1>
        <p class="pl-1 text-xs text-[#91919F]">{{ currentUser?.email || 'N/A' }}</p>
      </div>
      <button class="w-1/4 pl-3">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
          stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
        </svg>
      </button>
    </div>

    <div class="bg-white mx-4 rounded-lg">
      <div class="flex items-center p-4 border-b-2 border-gray-100">
        <div class="bg-purple-200 rounded-lg p-2">
          <Icon name="ic:round-account-balance-wallet" size="24" />
        </div>
        <p class="pl-2 text-sm">Account</p>
      </div>

      <div class="flex items-center p-4 border-b-2 border-gray-100">
        <div class="bg-purple-200 rounded-lg p-2">
          <Icon name="ic:sharp-settings" size="24" />
        </div>
        <p class="pl-2 text-sm">Settings</p>
      </div>

      <div class="flex items-center p-4 border-b-2 border-gray-100">
        <div class="bg-purple-200 rounded-lg p-2">
          <Icon name="ic:baseline-ios-share" size="24" />
        </div>
        <p class="pl-2 text-sm">Export Data</p>
      </div>

      <div class="flex items-center p-4 cursor-pointer" @click="handleLogout">
        <div class="bg-red-200 rounded-lg p-2">
          <Icon name="ic:outline-logout" size="24" />
        </div>
        <p class="text-red-600 pl-2 text-sm hover:underline">Logout</p>
      </div>
    </div>

    <bar />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// In your profile page component (<script setup> section)

import { useAuth } from '~/composables/useAuth';

const { logout } = useAuth();
const router = useRouter(); // Initialize useRouter

const currentUser = ref(null);

onMounted(() => {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    try {
      currentUser.value = JSON.parse(storedUser);
    } catch (error) {
      console.error('Error parsing user data from localStorage:', error);
      localStorage.removeItem('user'); // Clear corrupt data
      router.push('/pg/Login'); // Redirect if data is corrupt
    }
  } else {
    router.push('/pg/Login'); // Redirect if no user data is found
  }
});

const handleLogout = async () => {
  // This call will now run the robust logic from your composable.
  await logout();
};
</script>
