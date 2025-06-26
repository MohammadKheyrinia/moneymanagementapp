<template>
  <NuxtLink
    :to="to"
    class="flex flex-col items-center text-gray-400 hover:text-purple-500 transition"
  >
    <Icon :name="icon" size="26" />
    <span class="text-[10px] mt-1">{{ label }}</span>
  </NuxtLink>
</template>

<script setup>
defineProps({
  to: String,
  icon: String,
  label: String
})
</script>
