<template>
  <div class="space-y-2 text-sm">
    <div class="flex justify-between">
      <span class="text-gray-500 dark:text-gray-400">{{ amountLabel }}</span>
      <span class="text-gray-900 dark:text-white">{{ format(amounts.payment) }}</span>
    </div>
    <template v-if="feeRate > 0">
      <div class="flex justify-between">
        <span class="text-gray-500 dark:text-gray-400">{{ t('payment.fee') }} ({{ feeRate }}%)</span>
        <span class="text-gray-900 dark:text-white">{{ format(amounts.fee) }}</span>
      </div>
      <div class="flex justify-between border-t border-gray-200 pt-2 dark:border-dark-600">
        <span class="font-medium text-gray-700 dark:text-gray-300">{{ t('payment.actualPay') }}</span>
        <span class="text-lg font-bold text-primary-600 dark:text-primary-400">{{ format(amounts.total) }}</span>
      </div>
    </template>
    <slot name="extra" />
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { formatPaymentAmount } from '@/components/payment/currency'
import type { CheckoutAmounts } from '@/components/payment/checkoutAmounts'

const props = defineProps<{
  amountLabel: string
  amounts: CheckoutAmounts
  feeRate: number
  currency: string
  locale?: string
}>()

const { t } = useI18n()

function format(value: number): string {
  return formatPaymentAmount(value, props.currency, props.locale)
}
</script>
