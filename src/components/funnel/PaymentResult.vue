<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { getAcademyLoginUrl } from '@/config/environment'
import { paymentService } from '@/services/paymentService'
import type { ConfirmPaymentResponse } from '@/services/paymentService'
import { trackMetaPurchase } from '@/services/metaTracking'

type PaymentStatus = 'idle' | 'confirming' | 'approved' | 'error'
type CachedPaymentResult = Pick<ConfirmPaymentResponse, 'plainPassword'> & {
  message: string
  email: string
  amount?: number
  plan?: ConfirmPaymentResponse['plan']
}

const status = ref<PaymentStatus>('idle')
const message = ref('')
const credentials = ref<Pick<ConfirmPaymentResponse, 'email' | 'plainPassword'> | null>(null)
const customerEmail = ref('')
const sessionId = ref('')
const sendingAccessEmail = ref(false)
const accessEmailMessage = ref('')
const router = useRouter()
const academyUrl = getAcademyLoginUrl()

const retryPayment = () => router.replace({ path: '/', hash: '#oferta' })
const goToAcademy = () => window.location.assign(academyUrl)
const cacheKey = (id: string) => `stripe_result_${id}`

const readCachedResult = (id: string): CachedPaymentResult | null => {
  try {
    const raw = sessionStorage.getItem(cacheKey(id))
    return raw ? (JSON.parse(raw) as CachedPaymentResult) : null
  } catch {
    return null
  }
}

const writeCachedResult = (id: string, result: CachedPaymentResult) => {
  try { sessionStorage.setItem(cacheKey(id), JSON.stringify(result)) } catch {}
}

const applyApprovedResult = (id: string, result: CachedPaymentResult) => {
  sessionId.value = id
  status.value = 'approved'
  message.value = result.message
  customerEmail.value = result.email
  if (result.plainPassword) credentials.value = { email: result.email, plainPassword: result.plainPassword }
  if (result.amount && !sessionStorage.getItem(`meta_purchase_${id}`)) {
    trackMetaPurchase(id, result.amount, result.plan)
    sessionStorage.setItem(`meta_purchase_${id}`, 'sent')
  }
}

const sendAccessEmail = async () => {
  if (!sessionId.value || sendingAccessEmail.value) return
  sendingAccessEmail.value = true
  accessEmailMessage.value = ''
  try {
    const response = await paymentService.resendWelcomeEmail(sessionId.value)
    customerEmail.value = response.data.data.email || customerEmail.value
    accessEmailMessage.value = 'Correo enviado correctamente. Revisa también tu carpeta de spam.'
  } catch {
    accessEmailMessage.value = 'No pudimos enviar el correo. Intenta nuevamente en unos segundos.'
  } finally {
    sendingAccessEmail.value = false
  }
}

onMounted(async () => {
  const id = new URLSearchParams(window.location.search).get('session_id')
  if (!id) {
    status.value = 'error'
    message.value = 'No se encontró la sesión de pago de Stripe.'
    return
  }

  const cached = readCachedResult(id)
  if (cached) {
    applyApprovedResult(id, cached)
    return
  }

  status.value = 'confirming'
  try {
    const response = await paymentService.verifyPayment(id)
    const result = response.data.data
    if (result.status !== 'approved') {
      status.value = 'error'
      message.value = result.status === 'canceled'
        ? 'El pago fue cancelado. No se activó ningún acceso.'
        : 'Stripe todavía no confirma el pago. Si completaste el cobro, espera unos segundos y recarga esta página.'
      return
    }

    const approved: CachedPaymentResult = {
      message: 'Pago aprobado. Tu acceso a Bakanology ya está activo.',
      email: result.email || '',
      plainPassword: result.plainPassword,
      amount: result.amount,
      plan: result.plan,
    }
    writeCachedResult(id, approved)
    applyApprovedResult(id, approved)
  } catch (error) {
    status.value = 'error'
    const apiError = error as { message?: string }
    message.value = apiError.message || 'No fue posible confirmar el pago con Stripe.'
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="status !== 'idle'" class="payment-result" :class="{ 'payment-result--error': status === 'error' }">
      <section :class="{ 'payment-result__panel--error': status === 'error', 'payment-result__panel--loading': status === 'confirming' }" role="status" aria-live="polite">
        <span v-if="status === 'confirming'" class="payment-result__spinner" aria-hidden="true"></span>
        <span v-else :class="{ 'payment-result__icon--error': status === 'error' }">{{ status === 'approved' ? '✓' : '!' }}</span>
        <small v-if="status === 'error'" class="payment-result__label">PAGO NO CONFIRMADO</small>
        <small v-else-if="status === 'confirming'" class="payment-result__label payment-result__label--loading">VALIDANDO CON STRIPE</small>
        <h2>{{ status === 'approved' ? '¡Bienvenido a Bakanology!' : status === 'error' ? 'Necesitamos revisar tu pago' : 'Confirmando tu pago' }}</h2>
        <p>{{ status === 'confirming' ? 'No cierres ni recargues esta ventana. Stripe está verificando tu transacción.' : message }}</p>
        <div v-if="status === 'approved'" class="payment-result__email">
          <strong>Tu cuenta de Bakanology está activa</strong>
          <div v-if="customerEmail" class="payment-result__account"><span>CUENTA DE INGRESO</span><b>{{ customerEmail }}</b></div>
          <p>{{ credentials ? 'Enviamos las instrucciones y tus credenciales de ingreso a tu correo electrónico.' : 'Enviamos la confirmación a tu correo. Ingresa con tus credenciales actuales.' }}</p>
          <a class="payment-result__academy-link" :href="academyUrl" target="_blank" rel="noopener noreferrer">https://bakanology.com/</a>
          <small>Revisa también Spam o Correo no deseado.</small>
          <button type="button" class="payment-result__send" :disabled="sendingAccessEmail" @click="sendAccessEmail">{{ sendingAccessEmail ? 'REENVIANDO...' : 'REENVIAR CORREO DE ACCESO' }}</button>
          <em v-if="accessEmailMessage" :class="{ 'payment-result__send-error': accessEmailMessage.startsWith('No pudimos') }">{{ accessEmailMessage }}</em>
        </div>
        <div v-if="credentials" class="payment-result__credentials"><small>TUS CREDENCIALES DE ACCESO</small><p><span>Correo</span><strong>{{ credentials.email }}</strong></p><p><span>Contraseña temporal</span><strong>{{ credentials.plainPassword }}</strong></p><small>Por seguridad, cámbiala después de iniciar sesión.</small></div>
        <div v-if="status === 'error'" class="payment-result__actions"><button type="button" class="payment-result__retry" @click="retryPayment">REINTENTAR PAGO <span>→</span></button><button type="button" class="payment-result__home" @click="router.replace('/')">VOLVER AL INICIO</button></div>
        <button v-else-if="status === 'approved'" type="button" class="payment-result__continue" @click="goToAcademy">INGRESAR A BAKANOLOGY</button>
      </section>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.payment-result { position: fixed; inset: 0; z-index: 120; display: flex; justify-content: center; align-items: safe center; width: 100%; padding: 1rem; overflow-y: auto; background: rgba($primary-dark, 0.9); backdrop-filter: blur(10px); }
.payment-result--error { background: rgba(#26080b, 0.94); }
.payment-result section { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 36rem; max-height: calc(100dvh - 2rem); gap: 1rem; padding: clamp(2rem, 6vw, 4rem); overflow-y: auto; border: 1px solid rgba($primary, 0.25); border-radius: 1.2rem; background: $white; text-align: center; box-shadow: 0 30px 90px rgba($primary-dark, 0.4); }
.payment-result__panel--error { border: 2px solid $alert-error; box-shadow: 0 30px 90px rgba($alert-error, 0.24); }
.payment-result__panel--loading { border-color: rgba($primary, 0.3); }
.payment-result section > span { display: flex; justify-content: center; align-items: center; width: 4rem; height: 4rem; border-radius: 50%; background: $primary; color: $primary-dark; font-size: 2rem; font-weight: 900; }
.payment-result section > .payment-result__icon--error { background: $alert-error; color: $white; }
.payment-result__spinner { border: 0.32rem solid rgba($primary, 0.22); border-top-color: $primary; background: transparent !important; animation: payment-result-spin 0.75s linear infinite; }
.payment-result__label { width: 100%; color: $alert-error; font-size: 0.8rem; font-weight: 900; letter-spacing: 0.1em; }
.payment-result__label--loading { color: $secondary-dark; animation: payment-result-pulse 1.4s ease-in-out infinite; }
.payment-result h2 { font-size: clamp(2rem, 5vw, 3.2rem); }
.payment-result p { width: 100%; color: $text-secondary; line-height: 1.6; }
.payment-result__email, .payment-result__credentials { display: flex; flex-direction: column; width: 100%; gap: 0.55rem; padding: 1rem; border-radius: 0.7rem; background: $primary-surface; }
.payment-result__email > strong, .payment-result__credentials > small { color: $secondary-dark; font-weight: 900; }
.payment-result__account { display: flex; flex-direction: column; width: 100%; gap: 0.25rem; padding: 0.8rem; border-radius: 0.55rem; background: $white; }
.payment-result__account span { color: $text-secondary; font-size: 0.78rem; font-weight: 900; }
.payment-result__account b { overflow-wrap: anywhere; }
.payment-result__academy-link { color: $secondary-dark; font-weight: 900; overflow-wrap: anywhere; }
.payment-result__email .payment-result__send { border: 0; background: $primary; color: $white; }
.payment-result__email em { color: $secondary-dark; font-size: 0.82rem; font-style: normal; }
.payment-result__email .payment-result__send-error { color: $alert-error; }
.payment-result__credentials p { display: flex; justify-content: space-between; gap: 1rem; }
.payment-result__actions { display: flex; flex-direction: column; width: 100%; gap: 0.7rem; }
.payment-result button { display: flex; justify-content: center; align-items: center; width: 100%; gap: 0.5rem; padding: 1rem; border-radius: 0.6rem; font-weight: 900; cursor: pointer; }
.payment-result__retry { border: 0; background: $alert-error; color: $white; }
.payment-result__home { border: 1px solid rgba($primary-dark, 0.15); background: $white; color: $primary-dark; }
.payment-result__continue { border: 0; background: $primary-dark; color: $white; }
@keyframes payment-result-spin { to { transform: rotate(360deg); } }
@keyframes payment-result-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
</style>
