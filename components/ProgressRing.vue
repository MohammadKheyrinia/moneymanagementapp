<template>
  <svg :width="size" :height="size" :viewBox="`0 0 ${size} ${size}`">
    <circle
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      :stroke-width="strokeWidth"
      class="progress-ring-bg"
    />
    <circle
      :cx="size / 2"
      :cy="size / 2"
      :r="radius"
      :stroke-width="strokeWidth"
      class="progress-ring"
      :style="{ strokeDasharray, strokeDashoffset }"
    />
  </svg>
</template>

<script>
export default {
  props: {
    size: { type: Number, default: 100 },
    progress: { type: Number, default: 50 }, // Percentage (0-100)
    strokeWidth: { type: Number, default: 10 }
  },
  computed: {
    radius() {
      return (this.size - this.strokeWidth) / 2;
    },
    circumference() {
      return 2 * Math.PI * this.radius;
    },
    strokeDasharray() {
      return this.circumference;
    },
    strokeDashoffset() {
      return this.circumference * (1 - this.progress / 100);
    }
  }
};
</script>

<style>
.progress-ring-bg {
  fill: none;
  stroke: #ddd;
}

.progress-ring {
  fill: none;
  stroke: #4CAF50;
  transition: stroke-dashoffset 0.3s ease;
}
</style>