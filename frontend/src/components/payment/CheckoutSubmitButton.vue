<template>
  <button :class="['btn w-full py-3 text-base font-medium', variantClass]" :disabled="disabled || submitting" @click="emit('click')">
    <span v-if="submitting" class="flex items-center justify-center gap-2">
      <span class="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
      {{ t('common.processing') }}
    </span>
    <span v-else>{{ t('payment.createOrder') }} {{ amountText }}</span>
  </button>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

defineProps<{
  /** Payment-method accent class, e.g. btn-alipay / btn-wxpay / btn-primary. */
  variantClass: string
  amountText: string
  disabled: boolean
  submitting: boolean
}>()

const emit = defineEmits<{ click: [] }>()

const { t } = useI18n()
</script>
