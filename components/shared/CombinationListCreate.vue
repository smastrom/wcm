<script setup lang="ts">
import { db } from '@/lib/db'
import { APP_CRITICAL_ERROR } from '@/lib/constants'

import { normalizeSpaces, randomID, validateName } from '@/lib/utils'

import ArrowLeftIcon from './icons/ArrowLeftIcon.vue'

const router = useRouter()

const newCombinationName = ref('')

const isValid = computed(() => validateName(newCombinationName.value))

function onInput(event: Event) {
   newCombinationName.value = normalizeSpaces((event.target as HTMLInputElement).value)
}

async function onCreateClick() {
   if (!validateName(newCombinationName.value)) return

   try {
      const newEntry = await db.create(newCombinationName.value)
      await router.push({ name: 'editor', params: { id: newEntry.id } })
   } catch (error) {
      console.error(error)
      throw new Error(`[combination-list-view] - Creation failed. ${APP_CRITICAL_ERROR}`)
   }
}

const createNameId = randomID()
</script>

<template>
   <div class="Create_Wrapper">
      <form @submit.prevent="onCreateClick" class="Create_Form_Wrapper">
         <label :for="createNameId" class="Create_Title">Create a new combination</label>
         <div class="Create_Form">
            <input
               :id="createNameId"
               maxlength="30"
               type="text"
               @input="onInput"
               class="Global_InputField"
               placeholder="Enter a name of your choice"
               :value="newCombinationName"
            />
            <button type="submit" class="Global_ActionButton" :disabled="!isValid">
               Create and edit

               <ArrowLeftIcon fill="white" style="transform: rotate(180deg)" />
            </button>
         </div>
      </form>
   </div>
</template>

<style scoped>
.Create_Form_Wrapper {
   display: flex;
   flex-direction: column;
   gap: var(--size-2);
}
.Create_Wrapper {
   display: flex;
   flex-direction: column;
   gap: var(--size-1);
   margin: var(--size-2) 0;
   border-top: var(--border-size-1) solid var(--divider-color);
   padding: var(--size-4) 0;

   @media (--layout-switch) {
      padding: var(--size-2) 0 var(--size-2) 0;
      margin: var(--size-2) 0 0 0;
   }
}
.Create_Title {
   font-weight: 700;
   color: var(--fg-headline-color);
   font-size: var(--font-size-2);
   margin-bottom: var(--size-2);
}

.Create_Form {
   display: grid;
   grid-template-columns: 2fr 1fr;
   gap: var(--size-3);
   align-items: center;
   flex-wrap: wrap;

   @media (--size-md) {
      grid-template-columns: 1fr;
   }
}

.Global_ActionButton {
   display: flex;
   gap: var(--size-2);
   flex: 1;
   justify-content: center;
}
</style>
