<template>
  <div>
    <!-- 小标题走首页 eyebrow：11px / 600 / .14em 字距 / 橙 -->
    <p class="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-primary-600 dark:text-primary-400">
      {{ t('payment.rechargeAmount') }}
    </p>

    <!-- 金额是全页视觉焦点，用首页 stats 那档橙色大数字 -->
    <div
      class="flex items-baseline gap-2.5 rounded-[14px] border px-5 py-4 transition-colors"
      :class="focused
        ? 'border-primary-400 bg-white dark:border-primary-400 dark:bg-dark-800'
        : 'border-gray-200 bg-gray-50 dark:border-dark-700 dark:bg-dark-800/60'"
    >
      <span class="text-2xl font-bold text-gray-300 dark:text-dark-500">$</span>
      <input
        type="text"
        inputmode="decimal"
        :value="customText"
        :placeholder="placeholderText"
        class="w-full border-0 bg-transparent p-0 text-[38px] font-extrabold leading-none tabular-nums tracking-[-0.03em] text-primary-600 placeholder:text-lg placeholder:font-normal placeholder:tracking-normal placeholder:text-gray-400 focus:outline-none focus:ring-0 dark:text-primary-400 dark:placeholder:text-dark-500"
        @focus="focused = true"
        @blur="focused = false"
        @input="handleInput"
      />
    </div>

    <!-- 快捷金额沿用首页 .chips：暖灰底 pill，hover 转橙 -->
    <div class="mt-4 flex flex-wrap gap-2">
      <button
        v-for="amt in filteredAmounts"
        :key="amt"
        type="button"
        :class="[
          'rounded-full border px-4 py-[7px] text-[13px] tabular-nums transition-colors',
          modelValue === amt
            ? 'border-primary-500 bg-primary-500 font-medium text-white dark:border-primary-400 dark:bg-primary-500'
            : 'border-gray-200 bg-gray-100 text-gray-500 hover:border-primary-300 hover:text-primary-600 dark:border-dark-700 dark:bg-dark-800 dark:text-gray-400 dark:hover:border-primary-500 dark:hover:text-primary-400',
        ]"
        @click="selectAmount(amt)"
      >
        ${{ amt }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'

const props = withDefaults(defineProps<{
  amounts?: number[]
  modelValue: number | null
  min?: number
  max?: number
}>(), {
  amounts: () => [10, 20, 50, 100, 200, 500, 1000, 2000, 5000],
  min: 0,
  max: 0,
})

const emit = defineEmits<{
  'update:modelValue': [value: number | null]
}>()

const { t } = useI18n()

const customText = ref('')
const focused = ref(false)

// 0 = no limit
const filteredAmounts = computed(() =>
  props.amounts.filter((a) => (props.min <= 0 || a >= props.min) && (props.max <= 0 || a <= props.max))
)

const placeholderText = computed(() => {
  if (props.min > 0 && props.max > 0) return `${props.min} - ${props.max}`
  if (props.min > 0) return `≥ ${props.min}`
  if (props.max > 0) return `≤ ${props.max}`
  return t('payment.enterAmount')
})

const AMOUNT_PATTERN = /^\d*(\.\d{0,2})?$/

function selectAmount(amt: number) {
  customText.value = String(amt)
  emit('update:modelValue', amt)
}

function handleInput(e: Event) {
  const val = (e.target as HTMLInputElement).value
  if (!AMOUNT_PATTERN.test(val)) return
  customText.value = val
  if (val === '') {
    emit('update:modelValue', null)
    return
  }
  const num = parseFloat(val)
  if (!isNaN(num) && num > 0) {
    emit('update:modelValue', num)
  } else {
    emit('update:modelValue', null)
  }
}

watch(() => props.modelValue, (v) => {
  if (v !== null && String(v) !== customText.value) {
    customText.value = String(v)
  }
}, { immediate: true })
</script>
