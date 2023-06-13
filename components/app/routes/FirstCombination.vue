<script setup lang="ts">
import SplashScreen from '@/components/shared/SplashScreen.vue'

import { db } from '@/lib/db'
import { VueAppCriticalError, normalizeSpaces, randomID, validateName } from '@/lib/utils'

const router = useRouter()
const combinationName = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => inputRef.value?.focus())

const isValid = computed(() => validateName(combinationName.value))

function onInput(event: Event) {
   combinationName.value = normalizeSpaces((event.target as HTMLInputElement).value)
}

async function onSubmit() {
   if (!validateName(combinationName.value)) return

   try {
      await db.init()

      const entry = await db.create(combinationName.value)
      await router.push({ name: 'editor', params: { id: entry.id } })
   } catch (error) {
      throw VueAppCriticalError('[first-combination-route] - Failed creating combination!')
   }
}

const nameTextId = randomID()
</script>

<template>
   <SplashScreen
      title="Create a combination."
      subtitle="Enter a name of you choice for your first combination."
   >
      <form @submit.prevent="onSubmit" class="Form">
         <label :for="nameTextId" class="Global_VisuallyHidden">Name</label>
         <input
            :id="nameTextId"
            class="Global_InputField InputField"
            maxlength="30"
            ref="inputRef"
            type="text"
            placeholder="Enter a name"
            :value="combinationName"
            @input="onInput"
         />
         <button type="submit" class="Global_ActionButton" :disabled="!isValid">Create</button>
      </form>
   </SplashScreen>
</template>

<style scoped>
.Form {
   display: flex;
   flex-direction: row;
   gap: var(--size-4);
   width: var(--size-content-2);
   max-width: 100%;

   @media (--size-md) {
      flex-direction: column;
   }
}

.InputField {
   flex: 1;
   min-width: var(--size-12);
}
</style>
