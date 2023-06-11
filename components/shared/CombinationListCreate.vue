<script setup lang="ts">
import { useStore } from '@/lib/store'
import { db } from '@/lib/db'
import { APP_CRITICAL_ERROR } from '@/lib/constants'

import { normalizeSpaces } from '@/lib/utils'

import ArrowLeftIcon from './icons/ArrowLeftIcon.vue'

const store = useStore()
const router = useRouter()

const newCombinationName = ref('')

const isValid = computed(() => newCombinationName.value.length >= 4)

function onInput(event: Event) {
   newCombinationName.value = normalizeSpaces((event.target as HTMLInputElement)?.value ?? '')
}

async function onCreateClick() {
   if (newCombinationName.value.length < 4) return

   try {
      const newEntry = await db.create(newCombinationName.value)
      store.editor.actions.setCurrentEntry(newEntry)
      await router.push({ name: 'editor', params: { id: newEntry.id } })
   } catch (error) {
      console.error(error)
      throw new Error(`[combination-list-view] - Creation failed. ${APP_CRITICAL_ERROR}`)
   }
}
</script>

<template>
   <div class="Create_Wrapper">
      <h3 class="Create_Title">Create a new combination</h3>
      <form @submit.prevent="onCreateClick" class="Create_Form">
         <input
            maxlength="30"
            type="text"
            @input="onInput"
            class="Global_InputField"
            placeholder="Enter a name of your choice"
         />
         <button type="submit" class="Global_ActionButton" :disabled="!isValid">
            Create and edit

            <ArrowLeftIcon fill="white" style="transform: rotate(180deg)" />
         </button>
      </form>
   </div>
</template>

<style scoped>
.Create_Wrapper {
   display: flex;
   flex-direction: column;
   gap: var(--size-2);
   margin: var(--size-4) 0;
   border-top: var(--border-size-1) solid var(--divider-color);
   padding: var(--size-4) 0;
}
.Create_Title {
   font-weight: 700;
   color: var(--fg-headline-color);
   font-size: var(--font-size-2);
   margin-bottom: var(--size-2);
}

.Create_Form {
   display: flex;
   gap: var(--size-2);
   align-items: center;

   & input {
      flex: 1;
   }
}

.Global_ActionButton {
   display: flex;
   gap: var(--size-2);
}
</style>
