<script setup lang="ts">
const width = defineProp('var(--size-4)')
const className = defineProp('')
const fill = defineProp('var(--bg-color)')
</script>

<template>
   <svg
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="width"
      :class="className"
      :stroke="fill"
      viewBox="0 0 24 24"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
   >
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
      <circle cx="8.5" cy="8.5" r="1.5"></circle>
      <polyline points="21 15 16 10 5 21"></polyline>
   </svg>
</template>
