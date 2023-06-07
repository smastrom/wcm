<script setup lang="ts">
import SplashScreen from '@/components/shared/SplashScreen.vue'

import { APP_CRITICAL_ERROR } from '@/lib/constants'
import { db } from '@/lib/db'

import type { RouteLocationNamedRaw } from 'vue-router'

const destination = ref<RouteLocationNamedRaw>({ name: 'combinations' })

try {
   const combinations = await db.getAll()

   if (!combinations || combinations.length === 0) {
      destination.value.query = { new: 'true' }
   }
} catch (error) {
   throw new Error(`[index-route] - ${APP_CRITICAL_ERROR}`)
}
</script>

<template>
   <SplashScreen>
      <RouterLink :to="destination" class="Global_ActionButton">Go to App</RouterLink>
   </SplashScreen>
</template>
