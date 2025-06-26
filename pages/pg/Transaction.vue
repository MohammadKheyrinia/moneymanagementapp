<template>
  <div class="bg-[#FFF6E5] flex w-[300px] h-[600px] ml-auto mr-auto flex-col">
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-4">
      <NuxtLink to="/pg/Homescreen">
        <Icon name="uiw:arrow-left" size="14" />
      </NuxtLink>
      <h1 class="text-center flex-grow">Transactions</h1>
    </div>

    <!-- Filters -->
    <div class="flex pl-3 pb-2 gap-x-4">
      <!-- Month Filter -->
      <div class="border p-2 flex items-center border-black rounded-full bg-white">
        <Icon class="mr-1 text-violet-500" name="uiw:down" size="14" />
        <select v-model="selectedMonth" class="bg-transparent text-sm focus:outline-none">
          <option value="All">All</option>
          <option value="1">Jan</option>
          <option value="2">Feb</option>
          <option value="3">Mar</option>
          <option value="4">Apr</option>
          <option value="5">May</option>
          <option value="6">Jun</option>
          <option value="7">Jul</option>
          <option value="8">Aug</option>
          <option value="9">Sep</option>
          <option value="10">Oct</option>
          <option value="11">Nov</option>
          <option value="12">Dec</option>
        </select>
      </div>

      <!-- Type Filter -->
      <div class="border p-2 flex items-center border-black rounded-full bg-white">
        <Icon class="mr-1 text-violet-500" name="uiw:down" size="14" />
        <select v-model="selectedType" class="bg-transparent text-sm focus:outline-none">
          <option value="All">All</option>
          <option value="INCOME">Income</option>
          <option value="EXPENSE">Expense</option>
        </select>
      </div>
    </div>

    <!-- Transactions List -->
    <div class="flex flex-col overflow-y-auto no-scrollbar px-2" style="max-height: 450px">
      <div
        v-for="tx in filteredTransactions"
        :key="tx._id"
        class="bg-white flex justify-between rounded-3xl my-1 p-3"
      >
        <div>
          <h1 class="font-semibold">{{ tx.category }}</h1>
          <p class="text-gray-400 text-sm">{{ tx.description || 'No description' }}</p>
        </div>
        <div class="text-right">
          <div
            :class="tx.type === 'INCOME' ? 'text-green-600' : 'text-red-600'"
            class="font-semibold"
          >
            {{ tx.type === 'INCOME' ? '+ ' : '- ' }}{{ tx.amount }}
          </div>
          <div class="text-gray-400 text-sm">{{ formatTime(tx.createdAt) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';

const transactions = ref([]);
const selectedMonth = ref('All');
const selectedType = ref('All');

// Load transactions from API
onMounted(async () => {
  const stored = localStorage.getItem('user');
  if (!stored) return;

  const user = JSON.parse(stored);
  try {
    const res = await fetch(`/api/users/${user._id}`);
    const data = await res.json();
    transactions.value = data.transactions || [];
  } catch (error) {
    console.error('Failed to load transactions:', error);
  }
});

// Format time for display
const formatTime = (iso: string) => {
  const date = new Date(iso);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Computed filtered transactions
const filteredTransactions = computed(() => {
  return transactions.value.filter(tx => {
    const date = new Date(tx.createdAt);
    const monthMatches =
      selectedMonth.value === 'All' || date.getMonth() + 1 === +selectedMonth.value;
    const typeMatches = selectedType.value === 'All' || tx.type === selectedType.value;
    return monthMatches && typeMatches;
  });
});
</script>

<style scoped>
/* Optional: Hide scrollbar */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
