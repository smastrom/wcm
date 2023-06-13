<script setup lang="ts">
import SplashScreen from '@/components/shared/SplashScreen.vue'

import { db } from '@/lib/db'
import { VueAppCriticalError } from '@/lib/utils'

import type { RouteLocationNamedRaw } from 'vue-router'

const destination = ref<RouteLocationNamedRaw>({ name: 'combinations' })

try {
   const combinations = await db.getAll()

   if (!combinations || combinations.length === 0) {
      destination.value.name = 'first-combination'
   }
} catch (error) {
   throw VueAppCriticalError('[index-route] - Failed fetching combinations!')
}
</script>

<template>
   <SplashScreen>
      <RouterLink :to="destination" class="Global_ActionButton">Go to App</RouterLink>
   </SplashScreen>
</template>
