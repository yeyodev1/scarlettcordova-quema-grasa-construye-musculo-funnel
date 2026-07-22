<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { paymentService, type ConfirmEbookPaymentResponse } from '@/services/paymentService'
import { trackMetaPurchase } from '@/services/metaTracking'

type ViewStatus = 'confirming' | 'approved' | 'error'
const status = ref<ViewStatus>('confirming')
const message = ref('Confirmando tu pago con PayPhone…')
const result = ref<ConfirmEbookPaymentResponse | null>(null)
const cacheKey = (clientTransactionId: string) => `ebook_payment_${clientTransactionId}`

const resending = ref(false)
const resendMessage = ref('')
const newEmail = ref('')

function redirectToPurchaseOrigin(payment: ConfirmEbookPaymentResponse): boolean {
  if (!payment.returnUrl) return false
  try {
    const target = new URL(payment.returnUrl)
    if (target.origin === window.location.origin) return false
    window.location.replace(target.toString())
    return true
  } catch {
    return false
  }
}

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

async function handleResend() {
  if (!result.value) return
  resending.value = true
  resendMessage.value = ''
  try {
    const response = await paymentService.resendCredentials(
      result.value.clientTransactionId,
      newEmail.value || undefined,
    )
    const creds = response.data.data
    result.value.credentials = creds
    result.value.email = creds.email
    resendMessage.value = 'Credenciales reenviadas correctamente'
    newEmail.value = ''
  } catch (caught) {
    const apiError = caught as { message?: string }
    resendMessage.value = apiError.message || 'Error al reenviar credenciales'
  } finally {
    resending.value = false
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
    if (redirectToPurchaseOrigin(cached)) return
    applyApproved(cached)
    return
  }

  try {
    const response = await paymentService.confirmEbookPayment(id, clientTransactionId)
    const payment = response.data.data
    if (redirectToPurchaseOrigin(payment)) return
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
        <div class="result-card__items"><p><b>✓</b> Ebook {{ result.productName }}</p><p v-if="result.extras.includes('recipe_book')"><b>✓</b> Recetario Secreto de Scarlett</p></div>
        <p class="result-card__next">{{ result.emailSent ? 'Te enviamos el comprobante detallado de tu compra por correo.' : 'Tu compra está registrada. Conserva el correo usado en el pago para vincular tu acceso.' }}</p>

        <div v-if="result.credentials" class="result-card__credentials">
          <p class="result-card__credentials-title">Tus credenciales de acceso</p>
          <div class="result-card__credential"><span>Email</span><strong>{{ result.credentials.email }}</strong></div>
          <div class="result-card__credential"><span>Contraseña</span><strong>{{ result.credentials.password }}</strong></div>
          <p class="result-card__credentials-hint">Usá estas credenciales para iniciar sesión en <a href="/login">ebook.scarlettcordova.com/login</a>. También te las enviamos por correo.</p>
        </div>

        <div class="result-card__resend">
          <p class="result-card__resend-title">¿No recibiste las credenciales?</p>
          <label class="result-card__resend-field">
            <span>Cambiar email (opcional)</span>
            <input v-model="newEmail" type="email" placeholder="nuevo@email.com" />
          </label>
          <button class="result-card__resend-btn" :disabled="resending" @click="handleResend">
            {{ resending ? 'Reenviando…' : 'Reenviar credenciales' }}
          </button>
          <p v-if="resendMessage" class="result-card__resend-message">{{ resendMessage }}</p>
        </div>
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
.result-card__credentials { display: flex; flex-direction: column; width: 100%; gap: 0.5rem; padding: 1.25rem; border: 2px dashed $primary; border-radius: 0.8rem; background: rgba($primary, 0.05); }
.result-card__credentials-title { font-size: 0.78rem; font-weight: 700; color: $primary-dark; margin: 0; text-transform: uppercase; letter-spacing: 0.05em; }
.result-card__credential { display: flex; flex-direction: column; gap: 0.15rem; padding: 0.6rem 0.8rem; border-radius: 0.5rem; background: $white; text-align: left; }
.result-card__credential span { font-size: 0.68rem; color: $text-secondary; text-transform: uppercase; letter-spacing: 0.06em; }
.result-card__credential strong { font-size: 1rem; font-family: 'Courier New', monospace; letter-spacing: 0.03em; word-break: break-all; }
.result-card__credentials-hint { font-size: 0.75rem; color: $text-secondary; margin: 0; line-height: 1.5; }
.result-card__credentials-hint a { color: $primary; }
.result-card__resend { display: flex; flex-direction: column; width: 100%; gap: 0.6rem; padding: 1rem; border: 1px solid #e0d8cf; border-radius: 0.8rem; }
.result-card__resend-title { font-size: 0.82rem; font-weight: 700; color: $primary-dark; margin: 0; }
.result-card__resend-field { display: flex; flex-direction: column; gap: 0.25rem; }
.result-card__resend-field span { font-size: 0.72rem; color: $text-secondary; }
.result-card__resend-field input { padding: 0.6rem 0.8rem; border: 1px solid #e0d8cf; border-radius: 0.5rem; font-size: 0.85rem; outline: none; &:focus { border-color: $primary; } }
.result-card__resend-btn { padding: 0.75rem; border: none; border-radius: 999px; background: $primary; color: $white; font-size: 0.82rem; font-weight: 800; cursor: pointer; &:disabled { opacity: 0.5; cursor: not-allowed; } &:hover:not(:disabled) { opacity: 0.85; } }
.result-card__resend-message { margin: 0; font-size: 0.78rem; color: $secondary; text-align: center; }
.result-card > a { width: 100%; padding: 1rem; border-radius: 999px; background: $primary; color: $white; font-weight: 900; text-decoration: none; }
.result-card__secure { color: $text-secondary; }
@keyframes spin { to { transform: rotate(360deg); } }
@media (max-width: 520px) { .result-card__summary { flex-direction: column; } .result-card__summary span + span { border-top: 1px solid rgba($white, 0.14); border-left: 0; } }
</style>

