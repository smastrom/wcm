<script setup lang="ts">
import { useStore } from '@/lib/store'
const x = ref(0)

const c = defineProp(0)

console.log(c.value)

const store = useStore()

watchEffect(() => {
   console.log(store.editor.computed.selectedFontTypes)
})
</script>

<template>
   <div class="div">
      <span>IndexPage</span>

      <input type="checkbox" v-model="store.editor.fontTypes.sans" />
      <input type="checkbox" v-model="store.editor.fontTypes.serif" />
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
