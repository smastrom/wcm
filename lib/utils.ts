export function reloadPage() {
   location.reload()
}

export function normalizeSpaces(string: string) {
   return string.replace(/\s+/g, ' ').trim()
}

export function validateQueryParam(queryParamValue: unknown, validValues: string[]) {
   if (typeof queryParamValue !== 'string') return false
   if (!validValues.includes(queryParamValue)) return false
   return true
}

export function validateName(name: unknown) {
   return typeof name === 'string' && name.length >= 4 && name.length <= 30
}

export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

export function debounce<T extends (...args: any[]) => any>(
   fn: T,
   delay: number
): (...args: Parameters<T>) => void {
   let timeoutId: NodeJS.Timeout

   return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => fn(...args), delay)
   }
}

export function randomID() {
   if (!window.crypto || !window.crypto?.randomUUID) return Math.random().toString(36).substr(2, 9)
   return window.crypto.randomUUID()
}

export const APP_CRITICAL_ERROR = randomID()

export function VueAppCriticalError(message: string) {
   return new Error(message + ' ' + APP_CRITICAL_ERROR)
}
