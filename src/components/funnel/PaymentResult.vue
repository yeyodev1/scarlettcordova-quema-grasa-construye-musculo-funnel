<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { paymentService, type ConfirmEbookPaymentResponse } from '@/services/paymentService'
import { trackMetaPurchase } from '@/services/metaTracking'

type ViewStatus = 'confirming' | 'approved' | 'error'
const status = ref<ViewStatus>('confirming')
const message = ref('Confirmando tu pago con PayPhone…')
const result = ref<ConfirmEbookPaymentResponse | null>(null)
const cacheKey = (clientTransactionId: string) => `ebook_payment_${clientTransactionId}`

function readApprovedCache(clientTransactionId: string) {
  try {
    const cached = sessionStorage.getItem(cacheKey(clientTransactionId))
    return cached ? JSON.parse(cached) as ConfirmEbookPaymentResponse : null
  } catch {
    return null
  }
}

function applyApproved(payment: ConfirmEbookPaymentResponse) {
  result.value = payment
  status.value = 'approved'
  message.value = 'Tu pago fue aprobado y tu compra quedó registrada.'
  const eventKey = `meta_purchase_${payment.clientTransactionId}`
  if (!sessionStorage.getItem(eventKey)) {
    trackMetaPurchase(payment.clientTransactionId, payment.amount)
    sessionStorage.setItem(eventKey, 'sent')
  }
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const id = params.get('id')
  const clientTransactionId = params.get('clientTransactionId')
  if (!id || !clientTransactionId) {
    status.value = 'error'
    message.value = 'PayPhone no devolvió los datos necesarios para confirmar el pago.'
    return
  }

  const cached = readApprovedCache(clientTransactionId)
  if (cached) {
    applyApproved(cached)
    return
  }

  try {
    const response = await paymentService.confirmEbookPayment(id, clientTransactionId)
    const payment = response.data.data
    if (payment.status !== 'approved') {
      status.value = 'error'
      message.value = payment.status === 'canceled'
        ? 'El pago fue cancelado. No se realizó ningún cobro.'
        : 'PayPhone no aprobó el pago. Intenta nuevamente con otro método.'
      return
    }
    sessionStorage.setItem(cacheKey(clientTransactionId), JSON.stringify(payment))
    applyApproved(payment)
  } catch (caught) {
    const apiError = caught as { message?: string }
    status.value = 'error'
    message.value = apiError.message || 'No fue posible confirmar el pago con PayPhone.'
  }
})
</script>

<template>
  <main class="result-page">
    <section class="result-card" :class="`result-card--${status}`">
      <div class="result-card__mark"><span v-if="status === 'confirming'"></span><b v-else>{{ status === 'approved' ? '✓' : '!' }}</b></div>
      <p class="result-card__eyebrow">QUEMA GRASA, CONSTRUYE MÚSCULO</p>
      <h1>{{ status === 'confirming' ? 'Un momento…' : status === 'approved' ? '¡Lo hiciste, bebé!' : 'No pudimos completar el pago' }}</h1>
      <p class="result-card__message">{{ message }}</p>
      <template v-if="status === 'approved' && result">
        <div class="result-card__summary"><span><small>Total pagado</small><strong>${{ result.amount }} USD</strong></span><span><small>Correo</small><strong>{{ result.email }}</strong></span></div>
        <div class="result-card__items"><p><b>✓</b> Ebook Quema Grasa, Construye Músculo</p><p v-if="result.extras.includes('recipe_book')"><b>✓</b> Recetario Secreto de Scarlett</p><p v-if="result.extras.includes('whatsapp_vip')"><b>✓</b> Grupo VIP de WhatsApp</p></div>
        <p class="result-card__next">En la siguiente fase conectaremos esta compra con tu acceso al sitio de Scarlett Cordova. Conserva el correo usado en el pago.</p>
      </template>
      <a v-if="status !== 'confirming'" href="/#oferta">{{ status === 'approved' ? 'VOLVER AL INICIO' : 'INTENTAR NUEVAMENTE' }}</a>
      <small class="result-card__secure">Pago protegido y confirmado por PayPhone</small>
    </section>
  </main>
</template>

<style lang="scss" scoped>
.result-page { display: flex; justify-content: center; align-items: center; width: 100%; min-height: 100svh; padding: 1rem; background: radial-gradient(circle at top, rgba($primary, 0.23), transparent 36%), $primary-dark; }
.result-card { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 39rem; gap: 1rem; padding: clamp(1.5rem, 5vw, 3rem); border-radius: 1.2rem; background: $primary-surface; text-align: center; box-shadow: 0 2rem 6rem rgba(#000, 0.35); }
.result-card__mark { display: flex; justify-content: center; align-items: center; width: 4.5rem; height: 4.5rem; border-radius: 50%; background: $primary; color: $white; font-size: 2rem; }
.result-card__mark span { width: 2rem; height: 2rem; border: 3px solid rgba($white, 0.35); border-top-color: $white; border-radius: 50%; animation: spin 0.8s linear infinite; }
.result-card--approved .result-card__mark { background: $secondary; color: $primary-dark; }
.result-card--error .result-card__mark { background: $alert-error; }
.result-card__eyebrow { color: $primary; font-size: 0.68rem; font-weight: 900; letter-spacing: 0.13em; }
h1 { color: $primary-dark; font-size: clamp(2.2rem, 7vw, 4rem); line-height: 0.95; letter-spacing: -0.055em; text-transform: uppercase; }
.result-card__message, .result-card__next { color: $text-secondary; line-height: 1.6; }
.result-card__summary { display: flex; width: 100%; overflow: hidden; border-radius: 0.8rem; background: $primary-dark; color: $white; }
.result-card__summary span { display: flex; flex: 1 1 0; flex-direction: column; width: 100%; gap: 0.2rem; padding: 1rem; }
.result-card__summary span + span { border-left: 1px solid rgba($white, 0.14); }
.result-card__summary small { color: rgba($white, 0.5); }
.result-card__summary strong { overflow-wrap: anywhere; }
.result-card__items { display: flex; flex-direction: column; align-items: flex-start; width: 100%; gap: 0.6rem; padding: 1rem; border: 1px solid rgba($primary-dark, 0.12); border-radius: 0.8rem; text-align: left; }
.result-card__items b { color: $primary; }
.result-card__next { padding: 0.9rem; border-left: 3px solid $secondary; background: $primary-light; font-size: 0.85rem; text-align: left; }
.result-card > a { width: 100%; padding: 1rem; border-radius: 999px; background: $primary; color: $white; font-weight: 900; text-decoration: none; }
.result-card__secure { color: $text-secondary; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 520px) { .result-card__summary { flex-direction: column; } .result-card__summary span + span { border-top: 1px solid rgba($white, 0.14); border-left: 0; } }
</style>
