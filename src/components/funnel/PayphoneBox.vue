<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import type { PaymentBoxConfig } from '@/services/paymentService'

const props = defineProps<{ config: PaymentBoxConfig }>()
const emit = defineEmits<{ error: [message: string] }>()
const loading = ref(true)
const error = ref('')
const containerId = `payphone-${Math.random().toString(36).slice(2, 9)}`
let box: { render: (target: string) => void; destroy?: () => void } | undefined

const cssUrl = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.css'
const scriptUrl = 'https://cdn.payphonetodoesposible.com/box/v2.0/payphone-payment-box.js'

function loadCss() {
  if (document.querySelector(`link[href="${cssUrl}"]`)) return
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = cssUrl
  document.head.appendChild(link)
}

function loadScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.PPaymentButtonBox) return resolve()
    const existing = document.querySelector(`script[src="${scriptUrl}"]`)
    if (existing) {
      existing.addEventListener('load', () => resolve(), { once: true })
      existing.addEventListener('error', () => reject(new Error('No se pudo cargar PayPhone')), { once: true })
      return
    }
    const script = document.createElement('script')
    script.src = scriptUrl
    script.type = 'module'
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('No se pudo cargar PayPhone'))
    document.head.appendChild(script)
  })
}

onMounted(async () => {
  try {
    loadCss()
    await loadScript()
    if (!window.PPaymentButtonBox) throw new Error('El SDK de PayPhone no está disponible')
    box = new window.PPaymentButtonBox({
      token: props.config.token,
      clientTransactionId: props.config.clientTransactionId,
      amount: props.config.amount,
      amountWithoutTax: props.config.amountWithoutTax,
      currency: props.config.currency,
      storeId: props.config.storeId,
      reference: props.config.reference,
      lang: 'es',
      defaultMethod: 'card',
      timeZone: -5,
    })
    box.render(containerId)
    loading.value = false
  } catch (caught) {
    error.value = caught instanceof Error ? caught.message : 'No se pudo abrir la pasarela de pago.'
    loading.value = false
    emit('error', error.value)
  }
})

onUnmounted(() => box?.destroy?.())
</script>

<template>
  <div class="payphone-box">
    <p v-if="loading">Cargando pago seguro…</p>
    <p v-else-if="error" class="payphone-box__error">{{ error }}</p>
    <div :id="containerId" class="payphone-box__container"></div>
  </div>
</template>

<style lang="scss" scoped>
.payphone-box { display: flex; flex-direction: column; align-items: center; width: 100%; min-height: 8rem; gap: 1rem; color: $text-secondary; text-align: center; }
.payphone-box__container { display: flex; justify-content: center; width: 100%; min-height: 4rem; }
.payphone-box__error { color: $alert-error; }
</style>
