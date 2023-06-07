<script setup lang="ts">
import SplashScreen from './SplashScreen.vue'

import { db } from '@/lib/db'
import { normalizeSpaces } from '@/lib/utils'
import { APP_CRITICAL_ERROR } from '@/lib/constants'

const router = useRouter()

const combinationName = ref('')
const inputRef = ref<HTMLInputElement | null>(null)

onMounted(() => inputRef.value?.focus())

const isValid = computed(() => combinationName.value.length > 4)

function onInput(event: Event) {
   combinationName.value = normalizeSpaces((event.target as HTMLInputElement)?.value ?? '')
}

async function onSubmit() {
   try {
      await db.init()

      const entry = await db.create({
         name: combinationName.value,
         headline: {
            family: 'Roboto',
            weight: '700'
         },
         body: {
            family: 'Roboto',
            weight: '400'
         }
      })

      router.push({ name: 'editor', params: { id: entry.id } })
   } catch (error) {
      throw new Error(`[new-combination-view] - ${APP_CRITICAL_ERROR}`)
   }
}
</script>

<template>
   <SplashScreen
      title="Create a combination."
      subtitle="Enter a name of you choice, you can change it later."
   >
      <form @submit.prevent="onSubmit" class="Form">
         <input
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
