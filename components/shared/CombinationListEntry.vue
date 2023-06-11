<script setup lang="ts">
import { formatDistanceToNow } from 'date-fns'
import { useStore } from '@/lib/store'
import { db } from '@/lib/db'
import { downloadSingleFonts } from '@/lib/fetch'

import type { DBCombination } from '@/types/db'

const props = defineProps<{
   combination: DBCombination
}>()

const emit = defineEmits<{
   (event: 'delete', value: string): void
}>()

const store = useStore()
const router = useRouter()

// Computed

const headlineFamilyDescription = computed(() => {
   const { family, weight } = props.combination.headline
   return `${family} ${weight}`
})

const bodyFamilyDescription = computed(() => {
   const { family, weight } = props.combination.body
   return `${family} ${weight}`
})

const isActive = computed(() => store.preview.activeId === props.combination.id)

// Events

function onDelete() {
   emit('delete', props.combination.id)
}

function onPreviewClick() {
   store.preview.actions.setActiveId(props.combination.id)
   store.preview.actions.setHeadlineFont(props.combination.headline)
   store.preview.actions.setBodyFont(props.combination.body)
}

async function onEditClick() {
   const entry = await db.get(props.combination.id)

   if (!entry) {
      console.error('[combination-list-view] - Trying to navigate to a non existent entry .')
   } else {
      store.editor.actions.setCurrentEntry(entry)
      return router.push({ name: 'editor', params: { id: props.combination.id } })
   }
}

async function onDownloadClick() {
   try {
      await downloadSingleFonts(
         props.combination.headline.family,
         props.combination.headline.weight
      )
      await downloadSingleFonts(props.combination.body.family, props.combination.body.weight)
   } catch (error) {
      console.error(error)
   }
}
</script>

<template>
   <div class="Entry_Wrapper">
      <div class="Entry_Header">
         <div class="Entry_Header_Details">
            <h2>
               Name: <strong>{{ props.combination.name }}</strong>
            </h2>

            <div>
               <time> Saved {{ formatDistanceToNow(props.combination.lastUpdated) }} ago</time>
            </div>
         </div>

         <div class="Entry_Header_Family">
            <h2>{{ headlineFamilyDescription }} + {{ bodyFamilyDescription }}</h2>
         </div>
      </div>
      <div class="Entry_Content" :data-active-entry="isActive">
         <h1
            class="Entry_Content_Headline"
            :style="{
               'font-family': props.combination.headline.family,
               'font-weight': props.combination.headline.weight
            }"
         >
            Il pessimismo è la saggezza dei delusi e dei vinti.
         </h1>
         <p
            class="Entry_Content_Paragraph"
            :style="{
               'font-family': props.combination.body.family,
               'font-weight': props.combination.body.weight
            }"
         >
            This is an amazing paragraph. This is an amazing paragraph. This is an amazing
            paragraph. This is an amazing paragraph. This is an amazing paragraph. This is an
            amazing paragraph.
         </p>
      </div>
      <nav class="Entry_Nav">
         <div class="Entry_Nav_Group">
            <button @click="onEditClick" class="Entry_Nav_Button Editor_Button" data-editor-button>
               Open in the editor
            </button>
            <button @click="onPreviewClick" class="Entry_Nav_Button" :disabled="isActive">
               {{ isActive ? 'Previewing' : 'Preview' }}
            </button>
         </div>

         <div class="Entry_Nav_Group">
            <button @click="onDownloadClick" class="Entry_Nav_Button">Download</button>
            <button @click="onDelete" class="Entry_Nav_Button Delete_Button">Delete</button>
         </div>
      </nav>
   </div>
</template>

<style scoped>
.Entry_Wrapper {
   display: grid;
   padding: var(--size-6) var(--size-2);
   gap: var(--size-4);
   border-bottom: var(--border-size-2) solid var(--divider-color);
}

.Entry_Header {
   display: flex;
   flex-direction: column;
   gap: var(--size-2);
   color: var(--fg-body-light-color);
}

.Entry_Header_Details {
   display: flex;
   justify-content: space-between;
   gap: var(--size-2);
   font-size: var(--font-size-0);
}

.Entry_Content {
   max-width: var(--size-content-3);
   display: flex;
   flex-direction: column;
   gap: var(--size-2);
   padding-left: var(--size-3);
   border-left: var(--border-size-3) solid var(--divider-color);
   transition: all 100ms var(--easing);

   &[data-active-entry='true'] {
      border-color: var(--accent-color);
   }
}

.Entry_Content_Headline {
   font-size: var(--font-size-4);
   color: var(--fg-headline-color);
}

.Entry_Content_Paragraph {
   font-size: var(--font-size-2);
   color: var(--fg-body-color);
}

.Entry_Nav {
   display: flex;
   margin-top: var(--size-3);
   justify-content: space-between;
}

.Entry_Nav_Group {
   display: flex;
   gap: var(--size-4);
}

.Entry_Nav_Button {
   font-weight: 700;

   &:disabled {
      color: var(--fg-body-light-color);
      cursor: not-allowed;
   }

   &:hover:not(:disabled) {
      color: var(--accent-color);
   }
}

.Editor_Button {
   color: var(--accent-color);

   &:hover {
      text-decoration: underline;
   }
}

.Delete_Button {
   color: var(--error-color);

   &:hover {
      text-decoration: underline;
      color: var(--error-color);
   }
}
</style>
