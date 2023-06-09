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
