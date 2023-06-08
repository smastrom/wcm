export function useUpdateQuery() {
   const router = useRouter()
   const route = useRoute()

   return (queryKey: string, queryValue: string) => {
      if (typeof queryValue !== 'string') return
      router.replace({ query: { ...route.query, [queryKey]: queryValue } })
   }
}
