<script setup lang="ts">
import { FONT_SIZE_OPTIONS } from '@/lib/constants'

const props = withDefaults(
   defineProps<{
      labelId: string
      steps: string[]
   }>(),
   { steps: () => FONT_SIZE_OPTIONS as string[] }
)

const emit = defineEmits<{
   (event: 'change', value: string): void
}>()

const internalValue = ref(0)

const computedPercentage = computed(
   () => (internalValue.value / (props.steps.length - 1)) * 100
)

watch(internalValue, (newInternalValue) => {
   emit('change', props.steps[newInternalValue])
})
</script>

<template>
   <div class="Wrapper">
      <span>
         {{ props.steps[internalValue] }}
      </span>
      <input
         aria-label="Slide between sizes"
         class="InputRange"
         type="range"
         min="0"
         :max="steps.length - 1"
         v-model="internalValue"
         :style="`background-size: ${computedPercentage}% 100%;`"
      />
   </div>
</template>

<style scoped>
.Wrapper {
   display: flex;
   flex-wrap: nowrap;
   align-items: center;
   gap: var(--size-2);
}
.InputRange {
   -webkit-appearance: none;
   flex: 1;
   height: var(--size-1);
   background: var(--divider-color);
   border-radius: var(--radius-max);
   background-image: linear-gradient(var(--accent-color) 0 100%);
   background-repeat: no-repeat;

   &::-webkit-slider-thumb {
      @apply --input-range-thumb;

      &:hover {
         box-shadow: var(--ring-outline);
      }
   }

   &::-moz-range-thumb {
      @apply --input-range-thumb;

      &:hover {
         box-shadow: var(--ring-outline);
      }
   }

   &::-webkit-slider-runnable-track {
      @apply --input-range-track;
   }

   &::-moz-range-track {
      @apply --input-range-track;
   }
}
</style>
