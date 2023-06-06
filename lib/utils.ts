export function getCheckedValues(object: Record<string, boolean>) {
   return Object.keys(object).filter((key) => object[key])
}
