<template>
  <nav class="fixed bottom-0 inset-x-0 h-16 bg-white shadow-md rounded-t-xl z-50">
    <div class="flex justify-around items-center h-full">
      <NavItem to="/pg/Homescreen" icon="ic:baseline-house" label="Home" />
      <NavItem to="/pg/Transaction" icon="ic:baseline-compare-arrows" label="Transaction" />

      <!-- FAB with animation -->
      <NuxtLink
        to="/pg/Add_transaction"
        class="bg-purple-500 rounded-full p-3 -mt-8 shadow-lg transform transition-all duration-200 active:scale-90 hover:scale-110"
        aria-label="Add Transaction"
      >
        <Icon name="ic:round-plus" size="26" class="text-white" />
      </NuxtLink>

      <NavItem to="/pg/statitics" icon="ic:round-pie-chart" label="Budget" />
      <NavItem to="/pg/profile" icon="ic:baseline-person" label="Profile" />
    </div>
  </nav>
</template>

<script setup>
import NavItem from '~/components/NavItem.vue'
</script>
