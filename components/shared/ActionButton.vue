<script setup lang="ts">
const props = defineProps<{
   isActive: boolean
   activeColor: string
   label: string
}>()

const emit = defineEmits<{
   (event: 'click', value: void): void
}>()
</script>

<template>
   <button
      @click="emit('click')"
      :title="label"
      :aria-label="label"
      class="ActionButton"
      :data-active="props.isActive"
   >
      <slot />
   </button>
</template>

<style scoped>
.ActionButton {
   width: var(--size-6);
   height: var(--size-6);
   border-radius: var(--radius-2);
   background-color: var(--divider-color);
   display: flex;
   align-items: center;
   line-height: 1;
   justify-content: center;
   color: var(--bg-color);
   transition: all 100ms var(--easing);
   font-weight: 700;

   &[data-active='true'],
   &:hover {
      background-color: v-bind(props.activeColor);
   }
}
</style>
