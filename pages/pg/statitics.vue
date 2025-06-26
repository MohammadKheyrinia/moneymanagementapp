<template>
  <div class="bg-[#FFF6E5] flex flex-col w-[300px] h-[600px] mx-auto relative">
    <div class="flex items-center justify-between px-4 py-4">
      <NuxtLink to="/pg/Homescreen">
        <Icon class="" name="uiw:arrow-left" size="14" />
      </NuxtLink>
      <h1 class="text-center flex-grow">Financial Report</h1>
    </div>

    <div class="flex justify-center pt-2 pb-1">
      <div class="border-2 p-1 flex items-center gap-1 border-blue-50 rounded-full">
        <p class="text-sm">{{ currentMonth }}</p>
      </div>
    </div>

    <div v-if="isLoading" class="text-center text-gray-500 mt-8">Loading statistics...</div>
    <div v-else-if="error" class="text-center text-red-500 mt-8">Error: {{ error }}</div>

    <div v-else class="mx-auto mt-4">
      <ProgressRing :size="120" :progress="progress" :strokeWidth="10" />
      <p class="text-center mt-2 text-sm text-gray-600">
        {{ progress }}% of income spent
      </p>
    </div>

    <div class="pt-8 px-2">
      <div class="flex justify-between bg-blue-100 rounded-full p-1 text-sm font-semibold">
        <div :class="[
          'w-1/2 text-center py-2 rounded-full cursor-pointer',
          selectedType === 'EXPENSE' ? 'bg-red-400 text-white' : '' // Changed to 'EXPENSE' to match backend
        ]" @click="selectType('EXPENSE')">
          Expense
        </div>
        <div :class="[
          'w-1/2 text-center py-2 rounded-full cursor-pointer',
          selectedType === 'INCOME' ? 'bg-green-400 text-white' : '' // Changed to 'INCOME' to match backend
        ]" @click="selectType('INCOME')">
          Income
        </div>
      </div>
    </div>

    <div class="mt-6 px-4 space-y-6">
      <p v-if="filteredTransactions.length === 0 && !isLoading && !error" class="text-center text-gray-500 text-sm">
        No {{ selectedType.toLowerCase() }} transactions found.
      </p>
      <TransactionBar
        v-for="(item, index) in filteredTransactions"
        :key="index"
        :icon-color="item.type === 'INCOME' ? 'bg-green-500' : 'bg-red-500'"
        :label="item.category" :amount="item.amount"
        :bar-width="`${(item.amount / (totalAmount || 1)) * 100}%`" />
    </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router'; // Import useRouter

// Ensure these components are correctly imported/defined
import ProgressRing from "~/components/ProgressRing.vue";
import TransactionBar from "~/components/TransactionBar.vue";

const router = useRouter(); // Initialize useRouter

const selectedType = ref<"EXPENSE" | "INCOME">("EXPENSE"); // Changed to match backend enum
const transactions = ref<any[]>([]); // Fetched from the database
const isLoading = ref(true);
const error = ref<string | null>(null);

const filteredTransactions = computed(() => {
  return transactions.value.filter(
    (t) => t.type === selectedType.value
  );
});

const totalAmount = computed(() => {
  return filteredTransactions.value.reduce(
    (sum, t) => sum + t.amount,
    0
  );
});

const progress = computed(() => {
  const totalIncome = transactions.value
    .filter((t) => t.type === "INCOME")
    .reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.value
    .filter((t) => t.type === "EXPENSE")
    .reduce((sum, t) => sum + t.amount, 0);

  // Avoid division by zero
  return totalIncome > 0 ? Math.round((totalExpense / totalIncome) * 100) : 0;
});

const currentMonth = computed(() => {
  const options: Intl.DateTimeFormatOptions = { month: 'long', year: 'numeric' };
  return new Date().toLocaleDateString(undefined, options);
});

const fetchTransactions = async () => {
  isLoading.value = true;
  error.value = null; // Clear previous errors

  const storedUser = localStorage.getItem('user');
  if (!storedUser) {
    console.warn("No user found in localStorage. Redirecting to login.");
    router.push('/pg/Login'); // Redirect to login if no user is stored
    isLoading.value = false;
    return;
  }

  try {
    const user = JSON.parse(storedUser);
    if (!user || !user._id || typeof user._id !== 'string' || user._id.length !== 24) {
      console.error("Invalid user data in localStorage. Clearing and redirecting.");
      localStorage.removeItem('user');
      router.push('/pg/Login');
      isLoading.value = false;
      return;
    }

    const res = await fetch(`/api/users/${user._id}`);
    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.statusMessage || `Failed to fetch transactions: ${res.statusText}`);
    }

    const data = await res.json();
    transactions.value = data.transactions || []; // Backend returns all transactions under 'transactions'
  } catch (err: any) {
    console.error("Error fetching transactions:", err.message);
    error.value = err.message;
    // Potentially redirect to login if the error is due to authentication
    if (err.message.includes('Unauthorized') || err.message.includes('Forbidden')) {
      localStorage.removeItem('user');
      router.push('/pg/Login');
    }
  } finally {
    isLoading.value = false;
  }
};

const selectType = (type: "EXPENSE" | "INCOME") => {
  selectedType.value = type;
};

onMounted(() => {
  fetchTransactions();
});
</script>