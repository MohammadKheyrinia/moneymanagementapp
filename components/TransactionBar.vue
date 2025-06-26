<template>
  <div>
    <div class="flex justify-between items-center">
      <div class="border-2 px-2 py-1 flex items-center gap-2 bg-white border-blue-50 rounded-full">
        <Icon :class="[iconColor, 'rounded-full']" name="ic:sharp-circle" size="18" />
        <p class="text-sm truncate">{{ label }}</p>
      </div>
      <p class="text-red-600 font-semibold text-xl">{{ amount }}</p>
    </div>
    <div class="flex justify-between bg-blue-100 rounded-full mt-2">
      <div :class="[iconColor, 'p-2', barWidth, 'rounded-full']"></div>
      <div class="w-[30%]"></div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    iconColor: String,
    label: String,
    amount: String,
    barWidth: String,
  },
};
</script>
