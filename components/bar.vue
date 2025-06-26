<template>
  <div class="flex bottom-0 absolute h-16">
    <div class="flex items-center rounded-t-xl gap-x-[24px] p-4 bg-white w-full">
      <NuxtLink to="/pg/Homescreen" class="flex-col items-center flex">
        <Icon class="text-[#C6C6C6] hover:bg-purple-500" name="ic:baseline-house" size="26" />
        <p class="text-[9px] text-gray-400 hover:text-purple-500">Home</p>
      </NuxtLink>
      <NuxtLink to="/pg/Transaction" class="flex-col items-center flex">
        <Icon class="text-[#C6C6C6] hover:bg-purple-500" name="ic:baseline-compare-arrows" size="26" />
        <p class="text-[9px] text-gray-400 hover:text-purple-500">Transaction</p>
      </NuxtLink>
      <NuxtLink to="/pg/Add_transaction" class="bg-purple-500 mb-2 rounded-[100%] p-2 flex">
        <Icon class="text-white" name="ic:round-plus" size="26" />
      </NuxtLink>
      <NuxtLink to="/pg/statitics" class="flex-col items-center flex">
        <Icon class="text-[#C6C6C6] hover:bg-purple-500" name="ic:round-pie-chart" size="26" />
        <p class="text-[9px] text-gray-400 hover:text-purple-500">Budget</p>
      </NuxtLink>
      <NuxtLink to="/pg/profile" class="flex-col items-center flex">
        <Icon class="text-[#C6C6C6] hover:bg-purple-500" name="ic:baseline-person" size="26" />
        <p class="text-[9px] text-gray-400 hover:text-purple-500">Profile</p>
      </NuxtLink>
    </div>
  </div>
</template>