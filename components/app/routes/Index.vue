<script setup lang="ts">
const x = ref(0)

const c = defineProp(0)

console.log(c.value)
</script>

<template>
   <div class="div">
      <span>IndexPage</span>
   </div>
</template>

<style>
.div {
   padding: var(--size-2);

   & span {
      background: red;
   }
}
</style>
