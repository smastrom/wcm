export function useViewport(width: string) {
   function getValue() {
      return window.matchMedia(`(max-width: ${width})`).matches
   }

   const isMatch = ref(getValue())

   function onResize() {
      isMatch.value = getValue()
   }

   onMounted(() => window.addEventListener('resize', onResize))

   onBeforeUnmount(() => window.removeEventListener('resize', onResize))

   return { isMatch }
}
