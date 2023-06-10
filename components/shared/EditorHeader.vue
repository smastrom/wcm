<script setup lang="ts">
import LogoIcon from './icons/LogoIcon.vue'
import ArrowLeftIcon from './icons/ArrowLeftIcon.vue'
import StatusDot from './StatusDot.vue'
import PreviewMobile from './PreviewMobile.vue'

import { StoreEditingStatus } from '@/lib/constants'
import { useRefreshLastUpdated } from '@/lib/useRefreshLastUpdated'
import { useStore } from '@/lib/store'

const store = useStore()
const route = useRoute()

useRefreshLastUpdated(route.params.id as string)

const statusMessage = computed(() =>
   store.editor.editingStatus === StoreEditingStatus.SAVING
      ? 'Saving...'
      : `Saved ${store.editor.lastUpdated}`
)
</script>

<template>
   <header class="Wrapper">
      <div class="Left">
         <RouterLink
            aria-label="Back to combinations"
            :to="{ name: 'combinations' }"
            class="Left_Arrow"
         >
            <ArrowLeftIcon />
         </RouterLink>

         <span class="Left_Divider" />
         <div class="Left_Copy">
            <LogoIcon width="50px" />
            <h1><span>Editing:</span> {{ store.editor.activeName }}</h1>
         </div>
      </div>

      <PreviewMobile />

      <div class="Right">{{ statusMessage }} <StatusDot /></div>
   </header>
</template>

<style scoped>
.Wrapper {
   margin: 0 auto;
   display: flex;
   align-items: center;
   justify-content: space-between;
   padding: var(--size-3) var(--size-4);
   background-color: var(--bg-color);
   border-bottom: var(--border-size-2) solid var(--border-color);
   flex-wrap: wrap;
   gap: var(--size-3);
}

.Left {
   display: flex;
   align-items: center;
   gap: var(--size-3);
}

.Left_Arrow {
   transition: 100ms opacity var(--easing);

   &:hover:deep(svg) {
      stroke: var(--accent-color);
   }
}

.Left_Divider {
   width: var(--border-size-1);
   align-self: stretch;
   background-color: var(--divider-color);
}

.Left_Copy {
   display: grid;
   gap: var(--size-2);
   font-size: var(--font-size-0);
   line-height: 1;

   & span {
      font-weight: 700;
   }
}

.Right {
   user-select: none;
   display: flex;
   flex-wrap: nowrap;
   align-items: center;
   gap: var(--size-2);
   font-size: var(--font-size-0);
}
</style>
