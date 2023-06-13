<script setup lang="ts">
import LoadingScreen from '@/components/shared/LoadingScreen.vue'
import SplashScreen from '../shared/SplashScreen.vue'

import { reloadPage } from '@/lib/utils'
import { useAppCriticalError } from '@/lib/useAppCriticalError'

const { isCriticalError } = useAppCriticalError()

// Each route has async logic that needs to be loaded before the route can be rendered.
</script>

<template>
   <div v-if="isCriticalError">
      <SplashScreen
         title="Something went wrong."
         subtitle="Please check your connection and try to reload the page."
      >
         <button class="Global_ActionButton" @click="reloadPage">Reload Page</button>
      </SplashScreen>
   </div>

   <RouterView v-slot="{ Component }" v-else>
      <template v-if="Component">
         <Suspense timeout="0">
            <template #default>
               <Component :is="Component" />
            </template>

            <template #fallback>
               <LoadingScreen />
            </template>
         </Suspense>
      </template>
   </RouterView>
</template>
