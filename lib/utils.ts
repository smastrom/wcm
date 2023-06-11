import type { GoogleAPIWeights } from '@/types/fetch'
import type { AppFontWeights } from '@/types/store'

export function getRandomIntRange(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min + 1)) + min
}

export function reloadPage() {
   location.reload()
}

export function normalizeSpaces(string: string) {
   return string.replace(/\s+/g, ' ')
}

export function validateQueryParam(queryParamValue: unknown, validValues: string[]) {
   if (typeof queryParamValue !== 'string') return false
   if (!validValues.includes(queryParamValue)) return false
   return true
}

export const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1

export function toAppWeight(weight: GoogleAPIWeights): AppFontWeights {
   return weight === 'regular' ? '400' : weight
}

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
