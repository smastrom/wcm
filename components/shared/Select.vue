<script setup lang="ts" generic="T extends string">
const props = defineProps<{
   isLoading: boolean
   isAsync: boolean
   id: string
   modelValue: T
   options: readonly {
      label: string
      value: T
   }[]
}>()

const emit = defineEmits<{
   (event: 'update:modelValue', value: T): void
   (event: 'asyncChange', value: T): void
}>()

function onChange(event: Event) {
   if (props.isAsync) {
      // modelValue is updated only visually but not in the store, update is delegate to parent which will restore prev value if fetch fails
      emit('asyncChange', (event.target as HTMLInputElement).value as T)
   } else {
      // Updates the store
      emit('update:modelValue', (event.target as HTMLInputElement).value as T)
   }
}
</script>

<template>
   <select :id="id" @change="onChange" class="Select" :disabled="isLoading">
      <option v-for="option in options" :value="option.value">{{ option.label }}</option>
   </select>
</template>

<style scoped>
.Select {
   appearance: none;
   -webkit-appearance: none;
   cursor: pointer;

   padding: 0.4em 1em 0.4em 0.8em;
   border-radius: var(--radius-2);
   background-color: var(--bg-elv-color);
   transition: all 100ms var(--easing);

   background-color: var(--bg-elv-color);
   background-image: url("data:image/svg+xml;charset=utf8, %3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='feather feather-chevron-down'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E");
   background-position: right 0.45em top 50%;
   background-repeat: no-repeat;
   padding-right: 1.4em;
   background-size: auto 16px;

   &[disabled] {
      cursor: wait;
      opacity: 0.5;
   }
}
</style>
