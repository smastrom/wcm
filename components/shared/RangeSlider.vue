<script setup lang="ts">
const props = defineProps<{
   initialValue: string
   steps: string[]
   id?: string
   width?: string
   fontSize?: string
}>()

const emit = defineEmits<{
   (event: 'change', value: string): void
}>()

const initialIndex = props.steps.indexOf(props.initialValue)

const internalIndex = ref(initialIndex === -1 ? 0 : initialIndex)

const computedPercentage = computed(() => (internalIndex.value / (props.steps.length - 1)) * 100)

watch(internalIndex, (newIndex) => emit('change', props.steps[newIndex]))
</script>

<template>
   <div class="Wrapper">
      <span class="Label">
         {{ props.steps[internalIndex] }}
      </span>
      <input
         :id="id"
         aria-label="Font size"
         class="InputRange"
         type="range"
         min="0"
         :max="steps.length - 1"
         v-model="internalIndex"
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

.Label {
   font-size: v-bind(props.fontSize);
}

.InputRange {
   -webkit-appearance: none;
   flex: 1;
   width: v-bind(props.width);
   height: var(--size-1);
   background: var(--divider-color);
   border-radius: var(--radius-max);
   background-image: linear-gradient(var(--accent-color) 0 100%);
   background-repeat: no-repeat;
   transition: box-shadow 100ms var(--easing);

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
