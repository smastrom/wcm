export function useUpdateQuery() {
   const router = useRouter()
   const route = useRoute()

   return async (queryKey: string, queryValue: string | undefined) => {
      if (typeof queryValue !== 'string' && typeof queryValue !== 'undefined') return
      await router.replace({ query: { ...route.query, [queryKey]: queryValue } })
   }
}
