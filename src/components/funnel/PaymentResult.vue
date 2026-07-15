<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { paymentService } from '@/services/paymentService'
import type { ConfirmPaymentResponse } from '@/services/paymentService'

type PaymentStatus = 'idle' | 'confirming' | 'approved' | 'error'

const status = ref<PaymentStatus>('idle')
const message = ref('')
const credentials = ref<Pick<ConfirmPaymentResponse, 'email' | 'plainPassword'> | null>(null)
const customerEmail = ref('')
const emailStatus = ref<'idle' | 'sent' | 'failed'>('idle')
const clientTransactionId = ref('')
const sendingAccessEmail = ref(false)
const accessEmailMessage = ref('')
const router = useRouter()

const retryPayment = () => router.replace({ path: '/', hash: '#oferta' })
const goToCommunityLogin = () => {
  window.open('https://luisapitabejarano.com/login', '_blank')
}

const sendAccessEmail = async () => {
  if (!clientTransactionId.value || sendingAccessEmail.value) return
  sendingAccessEmail.value = true
  accessEmailMessage.value = ''
  try {
    const response = await paymentService.resendWelcome(clientTransactionId.value)
    customerEmail.value = response.data.data.email || customerEmail.value
    emailStatus.value = 'sent'
    accessEmailMessage.value = 'Correo enviado correctamente. Revisa también tu carpeta de spam.'
  } catch {
    accessEmailMessage.value = 'No pudimos enviar el correo. Intenta nuevamente en unos segundos.'
  } finally {
    sendingAccessEmail.value = false
  }
}

interface CachedPaymentResult {
  status: 'approved' | 'error'
  message: string
  customerEmail: string
  emailStatus: 'idle' | 'sent' | 'failed'
  plainPassword?: string
}

const resultCacheKey = (transactionId: string) => `payphone_result_${transactionId}`

const readCachedResult = (transactionId: string): CachedPaymentResult | null => {
  try {
    const raw = localStorage.getItem(resultCacheKey(transactionId))
    return raw ? (JSON.parse(raw) as CachedPaymentResult) : null
  } catch {
    return null
  }
}

const writeCachedResult = (transactionId: string, result: CachedPaymentResult) => {
  try {
    localStorage.setItem(resultCacheKey(transactionId), JSON.stringify(result))
  } catch {
    // localStorage no disponible (modo privado): la recarga simplemente no restaurará el estado.
  }
}

const applyCachedResult = (transactionId: string, cached: CachedPaymentResult) => {
  status.value = cached.status
  message.value = cached.message
  customerEmail.value = cached.customerEmail
  emailStatus.value = cached.emailStatus
  clientTransactionId.value = transactionId
  if (cached.plainPassword) credentials.value = { email: cached.customerEmail, plainPassword: cached.plainPassword }
}

onMounted(async () => {
  const params = new URLSearchParams(window.location.search)
  const id = Number(params.get('id'))
  const transactionId = params.get('clientTransactionId')
  if (!id || !transactionId) {
    status.value = 'error'
    message.value = 'Los datos de la transacción no son válidos.'
    return
  }

  // Si ya confirmamos esta transacción antes, restauramos el resultado sin volver a
  // llamar al backend: /payments/confirm reenvía el correo de bienvenida y reporta un
  // evento "Purchase" a Meta Pixel cada vez que se ejecuta, así que reconfirmar en cada
  // recarga duplicaría esos efectos.
  const cached = readCachedResult(transactionId)
  if (cached) {
    applyCachedResult(transactionId, cached)
    return
  }

  status.value = 'confirming'
  try {
    const response = await paymentService.confirmPayment(String(id), transactionId)
    const result = response.data.data
    if (result.status !== 'approved') {
      status.value = 'error'
      const reason = result.data?.message
      message.value = result.status === 'canceled'
        ? `El pago fue cancelado${reason ? `: ${reason.toLowerCase()}` : ''}. No se activó ningún acceso. Puedes intentarlo nuevamente.`
        : 'No pudimos completar el pago. No se activó ningún acceso y puedes intentarlo nuevamente.'
      writeCachedResult(transactionId, { status: 'error', message: message.value, customerEmail: '', emailStatus: 'idle' })
      return
    }

    const pendingRaw = localStorage.getItem(`payphone_pending_${transactionId}`)
    if (pendingRaw) {
      const pending = JSON.parse(pendingRaw) as { amount?: number }
      if (result.data?.amount !== undefined && pending.amount !== result.data.amount) {
        throw new Error('El monto confirmado no coincide con la compra seleccionada.')
      }
      localStorage.removeItem(`payphone_pending_${transactionId}`)
    }

    status.value = 'approved'
    clientTransactionId.value = transactionId
    customerEmail.value = result.email || ''
    message.value = `Pago aprobado. Transacción #${result.transactionId}. Tu acceso a la comunidad ya está activo.`
    if (result.plainPassword) credentials.value = { email: result.email, plainPassword: result.plainPassword }

    if (result.emailSent) {
      emailStatus.value = 'sent'
    } else if (result.isNewUser) {
      try {
        const resendResponse = await paymentService.resendWelcome(transactionId)
        customerEmail.value = resendResponse.data.data.email || customerEmail.value
        emailStatus.value = 'sent'
      } catch {
        emailStatus.value = 'failed'
      }
    }

    writeCachedResult(transactionId, {
      status: 'approved',
      message: message.value,
      customerEmail: customerEmail.value,
      emailStatus: emailStatus.value,
      plainPassword: result.plainPassword,
    })
  } catch (error) {
    status.value = 'error'
    message.value = error instanceof Error ? error.message : 'No fue posible confirmar el pago.'
    writeCachedResult(transactionId, { status: 'error', message: message.value, customerEmail: '', emailStatus: 'idle' })
  }
})
</script>

<template>
  <Teleport to="body">
    <div v-if="status !== 'idle'" class="payment-result" :class="{ 'payment-result--error': status === 'error' }">
      <section :class="{ 'payment-result__panel--error': status === 'error', 'payment-result__panel--loading': status === 'confirming' }" role="status" aria-live="polite">
        <span v-if="status === 'confirming'" class="payment-result__spinner" aria-hidden="true"></span>
        <span v-else :class="{ 'payment-result__icon--error': status === 'error' }">{{ status === 'approved' ? '✓' : '!' }}</span>
        <small v-if="status === 'error'" class="payment-result__label">PAGO NO COMPLETADO</small>
        <small v-else-if="status === 'confirming'" class="payment-result__label payment-result__label--loading">VALIDANDO CON PAYPHONE</small>
        <h2>{{ status === 'approved' ? '¡Bienvenida a Vital 360!' : status === 'error' ? 'Necesitamos revisar tu pago' : 'Confirmando tu pago' }}</h2>
        <p>{{ status === 'confirming' ? 'No cierres ni recargues esta ventana. Estamos verificando tu transacción, esto toma solo unos segundos.' : message }}</p>
        <div v-if="status === 'approved'" class="payment-result__email">
          <strong>Tu cuenta Vital 360 está activa</strong>
          <div v-if="customerEmail" class="payment-result__account">
            <span>CUENTA DE INGRESO</span>
            <b>{{ customerEmail }}</b>
          </div>
          <p v-if="emailStatus === 'sent'">Enviamos tus datos de ingreso a tu correo electrónico.</p>
          <p v-else-if="emailStatus === 'failed'">No pudimos reenviar el correo automáticamente. Conserva las credenciales mostradas y contacta a soporte.</p>
          <p v-else>Si ya eras miembro, ingresa con tus credenciales habituales.</p>
          <small>En breve podrás encontrar tus clases grabadas dentro de la comunidad.</small>
          <p v-if="customerEmail" class="payment-result__destination">El correo de acceso se enviará a <strong>{{ customerEmail }}</strong></p>
          <button type="button" class="payment-result__send" :disabled="sendingAccessEmail" @click="sendAccessEmail">
            {{ sendingAccessEmail ? 'REENVIANDO...' : 'REENVIAR CORREO DE ACCESO' }}
          </button>
          <em v-if="accessEmailMessage" :class="{ 'payment-result__send-error': accessEmailMessage.startsWith('No pudimos') }">{{ accessEmailMessage }}</em>
        </div>
        <div v-if="credentials" class="payment-result__credentials">
          <small>TUS CREDENCIALES DE ACCESO</small>
          <p><span>Correo</span><strong>{{ credentials.email }}</strong></p>
          <p><span>Contraseña temporal</span><strong>{{ credentials.plainPassword }}</strong></p>
          <small>Por seguridad, cámbiala después de iniciar sesión.</small>
        </div>
        <div v-if="status === 'error'" class="payment-result__actions">
          <button type="button" class="payment-result__retry" @click="retryPayment">REINTENTAR PAGO <span>→</span></button>
          <button type="button" class="payment-result__home" @click="router.replace('/')">VOLVER AL INICIO</button>
        </div>
        <button v-else-if="status === 'approved'" type="button" class="payment-result__continue" @click="goToCommunityLogin">CONTINUAR A LA COMUNIDAD</button>
      </section>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.payment-result { position: fixed; inset: 0; z-index: 120; display: flex; justify-content: center; align-items: center; width: 100%; padding: 1rem; background: rgba($primary-dark, 0.9); backdrop-filter: blur(10px); }
.payment-result--error { background: rgba(#26080b, 0.94); }
.payment-result section { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 36rem; gap: 1rem; padding: clamp(2rem, 6vw, 4rem); border: 1px solid rgba($primary, 0.25); border-radius: 1.2rem; background: $white; text-align: center; box-shadow: 0 30px 90px rgba($primary-dark, 0.4); }
.payment-result__panel--error { border: 2px solid $alert-error !important; box-shadow: 0 30px 90px rgba($alert-error, 0.24) !important; }
.payment-result__panel--loading { border-color: rgba($primary, 0.3); }
.payment-result section > span { display: flex; justify-content: center; align-items: center; width: 100%; max-width: 4rem; height: 4rem; border-radius: 50%; background: $primary; color: $primary-dark; font-size: 2rem; font-weight: 900; }
.payment-result section > .payment-result__icon--error { background: $alert-error; color: $white; }
.payment-result__spinner { max-width: 4rem; height: 4rem; border: 0.32rem solid rgba($primary, 0.22); border-top-color: $primary; background: transparent !important; animation: payment-result-spin 0.75s linear infinite; }
.payment-result__label { width: 100%; color: $alert-error; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.14em; }
.payment-result__label--loading { color: $LPB-GREEN-D; animation: payment-result-pulse 1.4s ease-in-out infinite; }
@keyframes payment-result-spin { to { transform: rotate(360deg); } }
@keyframes payment-result-pulse { 0%, 100% { opacity: 0.55; } 50% { opacity: 1; } }
@media (prefers-reduced-motion: reduce) { .payment-result__spinner { animation-duration: 1.6s; } .payment-result__label--loading { animation: none; } }
.payment-result h2 { font-size: clamp(2rem, 5vw, 3.2rem); }
.payment-result p { width: 100%; color: $text-secondary; line-height: 1.6; }
.payment-result__email { display: flex; flex-direction: column; width: 100%; gap: 0.45rem; padding: 1rem; border: 1px solid rgba($primary, 0.3); border-radius: 0.7rem; background: $LPB-SURFACE; }
.payment-result__email strong { width: 100%; color: $LPB-GREEN-D; font-size: 1.05rem; }
.payment-result__email p { margin: 0; }
.payment-result__email small { width: 100%; color: $primary-dark; font-weight: 750; }
.payment-result__account { display: flex; flex-direction: column; width: 100%; gap: 0.25rem; padding: 0.8rem; border-radius: 0.55rem; background: $white; }
.payment-result__account span { width: 100%; color: $text-secondary; font-size: 0.62rem; font-weight: 900; letter-spacing: 0.1em; }
.payment-result__account b { width: 100%; color: $primary-dark; font-size: 1rem; overflow-wrap: anywhere; }
.payment-result__email .payment-result__send { border: 0; background: $primary; color: $primary-dark; }
.payment-result__email .payment-result__destination { color: $text-secondary; font-size: 0.78rem; }
.payment-result__destination strong { color: $primary-dark; overflow-wrap: anywhere; }
.payment-result__email em { width: 100%; color: $LPB-GREEN-D; font-size: 0.72rem; font-style: normal; font-weight: 750; }
.payment-result__email .payment-result__send-error { color: $alert-error; }
.payment-result__credentials { display: flex; flex-direction: column; width: 100%; gap: 0.6rem; padding: 1rem; border-radius: 0.7rem; background: $LPB-LIGHT; }
.payment-result__credentials > small { width: 100%; color: $LPB-GREEN-D; font-weight: 900; letter-spacing: 0.08em; }
.payment-result__credentials p { display: flex; justify-content: space-between; width: 100%; gap: 1rem; }
.payment-result__credentials span { color: $text-secondary; }
.payment-result__credentials strong { color: $primary-dark; }
.payment-result__actions { display: flex; flex-direction: column; width: 100%; gap: 0.7rem; margin-top: 0.5rem; }
.payment-result button { display: flex; justify-content: center; align-items: center; width: 100%; gap: 0.5rem; padding: 1rem; border-radius: 0.6rem; font-weight: 900; cursor: pointer; transition: transform 0.25s ease, background 0.25s ease; }
.payment-result button:hover { transform: translateY(-0.15rem); }
.payment-result__retry { border: 0; background: $alert-error; color: $white; }
.payment-result__retry:hover { background: #c81e31; }
.payment-result__home { border: 1px solid rgba($primary-dark, 0.15); background: $white; color: $primary-dark; }
.payment-result__continue { border: 0; background: $primary-dark; color: $white; }
</style>
