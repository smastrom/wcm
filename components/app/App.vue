<script setup lang="ts">
import LoadingScreen from '@/components/shared/LoadingScreen.vue'
import SplashScreen from '../shared/SplashScreen.vue'

import { reloadPage } from '@/lib/utils'
import { useAppErrors } from '@/lib/useAppErrors'

const { isCriticalError } = useAppErrors()
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

   <div v-else>
      <RouterView v-slot="{ Component: Route }">
         <template v-if="Route">
            <Suspense>
               <div>
                  <Component :is="Route" />
               </div>

               <template #fallback>
                  <LoadingScreen />
               </template>
            </Suspense>
         </template>
      </RouterView>
   </div>
</template>
