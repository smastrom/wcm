<script setup lang="ts">
import ContentLayout from './ContentLayout.vue'
import CombinationListHeader from './CombinationListHeader.vue'
import Preview from './Preview.vue'

import type { DBCombination } from '@/types/db'

const props = defineProps<{
   combinations: DBCombination[] | null
}>()

const combinationsRef = toRef(props, 'combinations')

console.log(combinationsRef.value)
</script>

<template>
   <div>
      <CombinationListHeader />
      <ContentLayout>
         <!-- Combination List -->

         <template #explorer>
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

         <!-- Preview -->

         <template #preview>
            <div>
               <Preview />
            </div>
         </template>
      </ContentLayout>
   </div>
</template>
