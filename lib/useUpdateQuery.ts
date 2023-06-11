export function useUpdateQuery() {
   const router = useRouter()
   const route = useRoute()

   return async (queryKey: string, queryValue: string | undefined) => {
      if (typeof queryValue !== 'string' && typeof queryValue !== 'undefined') return
      // console.log('useUpdateQuery - queryKey', queryKey, 'queryValue', queryValue)
      // console.log({ query: { ...route.query, [queryKey]: queryValue } })
      await router.replace({ query: { ...route.query, [queryKey]: queryValue } })
   }
}
