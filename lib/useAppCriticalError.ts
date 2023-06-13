import { APP_CRITICAL_ERROR } from '@/lib/constants'

/** Handles exceptions thrown top-level in Vue components */
export function useAppCriticalError() {
   const isCriticalError = ref(false)

   onErrorCaptured((error) => {
      if (error.message.includes(APP_CRITICAL_ERROR)) {
         isCriticalError.value = true
         return false
      }
   })

   return { isCriticalError }
}
