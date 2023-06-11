<script setup lang="ts">
const width = defineProp('24')
const className = defineProp('')
const fill = defineProp('var(--fg-body-light-color)')
</script>

<template>
   <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      :width="width"
      :height="width"
      viewBox="0 0 24 24"
      :stroke="fill"
      fill="none"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      :class="className"
   >
      <line x1="19" y1="12" x2="5" y2="12"></line>
      <polyline points="12 19 5 12 12 5"></polyline>
   </svg>
</template>
