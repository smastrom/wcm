export function getRandomIntRange(min: number, max: number): number {
   return Math.floor(Math.random() * (max - min + 1)) + min
}

export function reloadPage() {
   location.reload()
}
