<script setup lang="ts">
import { useStore } from '@/lib/store'

const store = useStore()
</script>

<template>
   <div>
      <div v-for="font in store.editor.activeFontsComputed">
         {{ font.family }}
         <!--          <div>{{ store.editor.inputValueModel || 'De gustibus non est disputandum.' }}</div> -->
      </div>
   </div>
</template>
