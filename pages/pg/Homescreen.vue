<template>
  <div class="bg-[#A89696] flex w-[300px] relative h-[600px] mx-auto flex-col">
    <div class="bg-gradient-to-b from-[#FFF6E5] to-[#beaaaa] rounded-b-xl pb-6">
      <div class="flex justify-between pl-6 pr-6 pt-4">
        <div class="border-b-2 flex pb-4 gap-x-20 items-center w-full">
          <p class="text-xs">
            {{ currentDate }}
          </p>
          <div class="flex items-center gap-x-3">
            <img class="w-10" src="/assets/Rectangle 8.png" alt="Avatar" />
            <p class="text-xs text-nowrap">{{ user?.name || "User" }}</p>
          </div>
        </div>
      </div>

      <div class="text-center pt-5">
        <p class="text-xs text-gray-500">Account Balance</p>
        <h1 class="font-bold text-4xl pt-3">${{ balance }}</h1>
      </div>

      <div class="flex justify-between px-4 pt-5 gap-x-2">
        <div class="bg-green-400 w-full rounded-3xl flex items-center px-3 py-2">
          <div class="bg-white rounded-3xl flex items-center justify-center w-8 h-8 mr-3">
            <Icon class="text-green-400" name="ic:baseline-attach-money" size="24" />
          </div>
          <div class="text-white">
            <p class="text-xs">Income</p>
            <p>${{ income }}</p>
          </div>
        </div>
        <div class="bg-red-400 w-full rounded-3xl flex items-center px-3 py-2">
          <div class="bg-white rounded-3xl flex items-center justify-center w-8 h-8 mr-3">
            <Icon class="text-red-400" name="ic:baseline-attach-money" size="24" />
          </div>
          <div class="text-white">
            <p class="text-xs">Expenses</p>
            <p>${{ expenses }}</p> </div>
        </div>
      </div>
    </div>

    <div class="pt-6">
      <div class="flex border-white border-2 rounded-xl mx-1">
        <div class="text-white text-sm w-1/4 text-center hover:bg-black rounded-xl">Today</div>
        <div class="text-white text-sm w-1/4 text-center hover:bg-black rounded-xl">Week</div>
        <div class="text-white text-sm w-1/4 text-center hover:bg-black rounded-xl">Month</div>
        <div class="text-white text-sm w-1/4 text-center hover:bg-black rounded-xl">Year</div>
      </div>

      <div class="flex justify-between px-5 pt-6">
        <p class="text-xs text-white">Recent Transactions</p>
        <NuxtLink to="/pg/Transaction" class="text-xs text-white">View All</NuxtLink>
      </div>

      <div class="overflow-y-auto max-h-48 px-1 mt-2 no-scrollbar">
        <div
          v-for="tx in recentTransactions"
          :key="tx._id"
          class="flex items-center justify-between mx-2 my-1 p-2 rounded-lg"
          :class="tx.type === 'INCOME' ? 'bg-[#beaaaa]' : 'bg-white'"
        >
          <div class="flex items-center">
            <div
              :class="tx.type === 'INCOME' ? 'bg-green-400' : 'bg-red-400'"
              class="flex items-center justify-center w-6 h-6 rounded-full"
            >
              <Icon
                :name="tx.type === 'INCOME' ? 'ic:baseline-arrow-upward' : 'ic:baseline-arrow-downward'"
                class="text-white"
                size="20"
              />
            </div>
            <p class="pl-3">${{ tx.amount }}</p>
          </div>
          <p class="text-xs text-gray-500 pr-2">{{ tx.category }}</p>
        </div>
        <p v-if="recentTransactions.length === 0" class="text-center text-white text-sm mt-4">
          No recent transactions.
        </p>
      </div>
    </div>

    <bar />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter

const router = useRouter(); // Initialize useRouter

const user = ref<any>(null);
const balance = ref(0);
const income = ref(0);
const expenses = ref(0); // Corrected variable name to match template
const recentTransactions = ref([]);
const currentDate = new Date().toLocaleDateString('en-US', {
  weekday: 'long',
  day: 'numeric',
  month: 'long'
});

// Fetch user and transactions
onMounted(async () => {
  const stored = localStorage.getItem('user');
  if (!stored) {
    console.warn("No user found in localStorage. Redirecting to login.");
    router.push('/pg/Login'); // Redirect to login if no user is stored
    return;
  }

  try {
    user.value = JSON.parse(stored);
    // Basic validation for the stored user object, especially the _id
    if (!user.value || !user.value._id || typeof user.value._id !== 'string' || user.value._id.length !== 24) {
      console.error("Invalid user data in localStorage. Clearing and redirecting.");
      localStorage.removeItem('user');
      router.push('/pg/Login');
      return;
    }

    const res = await fetch(`/api/users/${user.value._id}`, {
      credentials: 'include' // <--- ADDED THIS LINE: Crucial for sending the auth_token cookie
    });

    if (!res.ok) {
      // If the API returns a non-OK status (e.g., 401 Unauthorized, 403 Forbidden, 404 Not Found)
      // This could happen if the JWT is invalid or expired, or the ID is wrong.
      const errorData = await res.json();
      console.error("Failed to load dashboard data:", errorData.statusMessage || res.statusText);
      // Depending on the error, you might want to redirect to login
      if (res.status === 401 || res.status === 403) {
        localStorage.removeItem('user'); // Clear potentially stale user data
        router.push('/pg/Login');
      }
      return; // Stop execution if data fetch fails
    }

    const data = await res.json();

    balance.value = data.balance;
    income.value = data.income;
    expenses.value = data.expense; // Ensure this matches the backend property name 'expense'
    recentTransactions.value = data.recentTransactions || [];
  } catch (error) {
    console.error("Failed to load dashboard:", error);
    // Potentially redirect to login on network errors or parsing errors
    router.push('/pg/Login');
  }
});
</script>