<script setup lang="ts">
import type { DBCombination } from '@/types/db'

const props = defineProps<{
   combinations: DBCombination[] | null
}>()

const combinationsRef = toRef(props, 'combinations')

console.log(combinationsRef.value)
</script>

<template>
   <div>
      <RouterLink
         v-for="combination in combinations"
         :key="combination.id"
         :to="{
            name: 'editor',
            params: { id: combination.id }
         }"
      >
         {{ combination.name }} - {{ combination.id }}
      </RouterLink>
   </div>
</template>
