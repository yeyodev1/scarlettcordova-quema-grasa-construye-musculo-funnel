<script setup lang="ts">
import { computed, nextTick, onUnmounted, reactive, ref, watch } from 'vue'
import { useAnimatedNumber } from '@/composables/useAnimatedNumber'
import { useBonusExtensions } from '@/composables/useBonusExtensions'
import { useCountdown } from '@/composables/useCountdown'
import { useAnnualOfferCountdown } from '@/composables/useAnnualOfferCountdown'
import { getPaymentResponseUrl } from '@/config/environment'
import { funnelImages } from '@/config/funnelContent'
import { paymentService } from '@/services/paymentService'
import type { PaymentBoxConfig } from '@/services/paymentService'
import CheckoutExitConfirmation from './CheckoutExitConfirmation.vue'

const props = defineProps<{
  open: boolean
  plan: 'monthly' | 'annual'
  annualPrice: number
}>()

const emit = defineEmits<{
  close: []
}>()

const { hours, minutes, seconds, isActive } = useCountdown()
const { hours: annualHours, minutes: annualMinutes, seconds: annualSeconds } = useAnnualOfferCountdown()
const step = ref<'upgrades' | 'payment'>('upgrades')
const addVip = ref(false)
const addNutrition = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const overlay = ref<HTMLElement | null>(null)
const {
  remaining: bonusExtensionRemaining,
  used: bonusExtensionUsed,
  active: bonusExtensionActive,
  opportunitiesLeft,
  forfeited: bonusesForfeited,
  unlock: unlockBonusExtension,
  forfeit: forfeitBonuses,
  recover: recoverBonuses,
} = useBonusExtensions()
const exitConfirmationStep = ref(0)
const form = reactive({ name: '', lastName: '', email: '' })
const vipPrice = Math.min(Math.max(Number(import.meta.env.VITE_VIP_UPGRADE_PRICE) || 15, 0), 15)
const nutritionPrice = 5
const isAnnual = computed(() => props.plan === 'annual')
const annualDiscountActive = computed(() => isAnnual.value && props.annualPrice === 297)
const bonusesActive = computed(() => !bonusesForfeited.value && (isActive.value || bonusExtensionActive.value))
const canProtectBonuses = computed(() => !isAnnual.value && !bonusesForfeited.value
  && (bonusesActive.value || opportunitiesLeft.value > 0))
const bonusTimer = computed(() => {
  if (!bonusExtensionActive.value) return { hours: hours.value, minutes: minutes.value, seconds: seconds.value }
  const remaining = bonusExtensionRemaining.value
  return {
    hours: '00',
    minutes: String(Math.floor(remaining / 60000)).padStart(2, '0'),
    seconds: String(Math.floor((remaining % 60000) / 1000)).padStart(2, '0'),
  }
})
const monthlyIntro = computed(() => {
  if (bonusesForfeited.value) return opportunitiesLeft.value > 0 ? `Elegiste continuar sin bonos, pero aún te quedan ${opportunitiesLeft.value} oportunidades para recuperarlos.` : 'Agotaste tus 3 oportunidades. Tu membresía Vital 360 sigue disponible por $27.'
  if (isActive.value) return 'Tu membresía cuesta $27. Suma uno o ambos bonos solo si los quieres.'
  if (bonusExtensionActive.value) return `Activaste la oportunidad ${bonusExtensionUsed.value} de 3. Tienes 5 minutos para decidir si sumas tus bonos.`
  return 'El tiempo para elegir bonos terminó. Tu membresía base continúa disponible por solo $27.'
})
const basePrice = computed(() => isAnnual.value ? props.annualPrice : 27)
const total = computed(() => basePrice.value
  + (!isAnnual.value && addVip.value ? vipPrice : 0)
  + (!isAnnual.value && addNutrition.value ? nutritionPrice : 0))
const displayedTotal = useAnimatedNumber(total)
const close = () => {
  if (loading.value || exitConfirmationStep.value > 0) return
  if (step.value === 'upgrades' && canProtectBonuses.value) {
    exitConfirmationStep.value = 1
    overlay.value?.scrollTo({ top: 0 })
    return
  }
  emit('close')
}

const continueExit = () => {
  if (exitConfirmationStep.value < 3) {
    exitConfirmationStep.value += 1
    return
  }
  forfeitBonuses()
  exitConfirmationStep.value = 0
  emit('close')
}

const waitForSdk = async () => {
  for (let attempt = 0; attempt < 100; attempt += 1) {
    if (window.PPaymentButtonBox) return window.PPaymentButtonBox
    await new Promise((resolve) => window.setTimeout(resolve, 100))
  }
  return undefined
}

const renderPayment = async () => {
  errorMessage.value = ''
  if (!form.name.trim() || !form.lastName.trim() || !form.email.trim()) {
    errorMessage.value = 'Completa tu nombre, apellido y correo para continuar.'
    return
  }

  loading.value = true
  const preparationStartedAt = Date.now()
  const extras = isAnnual.value
    ? ['vip', 'recetario']
    : [addVip.value ? 'vip' : '', addNutrition.value ? 'recetario' : ''].filter(Boolean)

  let config: PaymentBoxConfig
  try {
    const response = await paymentService.prepareBox({
      name: form.name.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      plan: props.plan,
      amount: total.value,
      extras,
    })
    config = response.data.data
  } catch (error) {
    const apiError = error as { message?: string }
    errorMessage.value = apiError.message || 'No fue posible preparar el pago con el servidor.'
    loading.value = false
    exitConfirmationStep.value = 0
    return
  }

  const minimumPreparationTime = 2200
  const remainingPreparationTime = minimumPreparationTime - (Date.now() - preparationStartedAt)
  if (remainingPreparationTime > 0) {
    await new Promise((resolve) => window.setTimeout(resolve, remainingPreparationTime))
  }

  step.value = 'payment'
  loading.value = false
  await nextTick()
  overlay.value?.scrollTo({ top: 0 })

  const PaymentBox = await waitForSdk()
  const container = document.getElementById('payphone-button')

  if (!PaymentBox || !container) {
    const sdkStatus = window.__payphoneSdkStatus
    console.error('[PayPhone] SDK no disponible. status:', sdkStatus, 'container:', Boolean(container))
    errorMessage.value = sdkStatus === 'error'
      ? 'No se pudo descargar el proveedor de pago (revisa tu conexión, VPN o bloqueador de anuncios) y vuelve a intentar.'
      : 'El proveedor de pago tardó demasiado en responder. Vuelve a intentar en unos segundos.'
    return
  }

  container.innerHTML = ''
  const amount = Math.round(total.value * 100)
  const extrasLabel = extras.length ? extras.join(', ') : 'plan base'

  localStorage.setItem(`payphone_pending_${config.clientTransactionId}`, JSON.stringify({ amount, plan: props.plan, extras: extrasLabel }))

  new PaymentBox({
    token: config.token,
    clientTransactionId: config.clientTransactionId,
    amount,
    amountWithoutTax: amount,
    currency: 'USD',
    storeId: config.storeId,
    reference: config.reference,
    optionalParameter: extrasLabel,
    responseUrl: getPaymentResponseUrl(),
    lang: 'es',
    defaultMethod: 'card',
    timeZone: -5,
  }).render('payphone-button')
}

watch(() => props.open, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (open) {
    step.value = 'upgrades'
    addVip.value = false
    addNutrition.value = false
    errorMessage.value = ''
    loading.value = false
    form.name = ''
    form.lastName = ''
    form.email = ''
  }
})

watch(bonusesActive, (active) => {
  if (!active) {
    addVip.value = false
    addNutrition.value = false
  }
})

onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <Teleport to="body">
    <Transition name="checkout-transition">
      <div v-if="open" ref="overlay" class="checkout-overlay" :class="{ 'checkout-overlay--preparing': loading }" role="presentation" @click.self="close">
      <section class="checkout-modal" :class="{ 'checkout-modal--urgent': !isAnnual && !loading, 'checkout-modal--preparing': loading }" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
        <button v-if="!loading && !exitConfirmationStep" type="button" class="checkout-modal__close" aria-label="Cerrar checkout" @click="close">×</button>
        <Transition name="checkout-stage" mode="out-in">
        <CheckoutExitConfirmation v-if="exitConfirmationStep" :key="`exit-${exitConfirmationStep}`" :step="exitConfirmationStep" @stay="exitConfirmationStep = 0" @continue="continueExit" />
        <div v-else-if="loading" key="preparing" class="checkout-modal__preparing" aria-live="polite">
          <span></span>
          <strong>Preparando</strong>
          <small>tu pago seguro</small>
        </div>

        <div v-else-if="step === 'upgrades'" key="upgrades" class="checkout-modal__content">
          <div class="checkout-modal__visual" :class="{ 'checkout-modal__visual--annual': isAnnual }" :style="isAnnual ? { backgroundImage: `linear-gradient(90deg, rgba(8, 17, 22, 0.96), rgba(8, 17, 22, 0.62)), url('${funnelImages[5]}')` } : undefined">
            <div>
              <span>{{ isAnnual ? 'ELECCIÓN RECOMENDADA' : bonusesActive ? 'TU OPORTUNIDAD ESTÁ ACTIVA' : 'TU MEMBRESÍA SIGUE DISPONIBLE' }}</span>
              <strong :id="!isAnnual ? 'checkout-title' : undefined">{{ isAnnual ? annualDiscountActive ? 'Oferta de 2 horas: $297 en lugar de $400' : '12 meses para construir tu mejor versión' : 'Activa Vital 360 desde $27 y elige tus bonos' }}</strong>
            </div>
          </div>
          <p v-if="isAnnual" class="checkout-modal__eyebrow">TU ACCESO VITAL 360</p>
          <h2 v-if="isAnnual" id="checkout-title">Tu año completo, con todos los beneficios.</h2>
          <p class="checkout-modal__intro">
            {{ isAnnual ? 'El plan anual incluye el Círculo VIP y el recetario nutricional sin pagos adicionales.' : monthlyIntro }}
          </p>

          <div v-if="annualDiscountActive" class="checkout-modal__annual-deal">
            <div><del>$400</del><strong>$297</strong><b>AHORRAS $103</b></div>
            <span>La oferta termina en {{ annualHours }}:{{ annualMinutes }}:{{ annualSeconds }}</span>
          </div>

          <div v-if="!isAnnual && bonusesActive" class="checkout-modal__timer">
            <span>{{ bonusTimer.hours }}:{{ bonusTimer.minutes }}:{{ bonusTimer.seconds }}</span>
            <small>{{ bonusExtensionActive ? `OPORTUNIDAD ${bonusExtensionUsed} DE 3 PARA DECIDIR` : '2 HORAS PARA ELEGIR TUS BONOS OPCIONALES' }}</small>
          </div>

          <div v-else-if="!isAnnual" class="checkout-modal__expired">
            <span>!</span>
            <div>
               <strong>{{ opportunitiesLeft > 0 ? `Aún puedes recuperar tus bonos: te quedan ${opportunitiesLeft} de 3 oportunidades.` : 'Has perdido el acceso a los bonos definitivamente.' }}</strong>
               <p v-if="opportunitiesLeft > 0">Cada oportunidad reactiva los bonos por 5 minutos. Cuando uses las 3, no podrás recuperarlos nuevamente en este navegador.</p>
               <p v-else>Utilizaste tus 3 oportunidades. Los bonos ya no están disponibles, pero puedes continuar con Vital 360 por $27.</p>
             </div>
             <button v-if="opportunitiesLeft > 0" type="button" @click="bonusesForfeited ? recoverBonuses() : unlockBonusExtension()">RECUPERAR MIS BONOS · OPORTUNIDAD {{ bonusExtensionUsed + 1 }} DE 3 <b>+5 MIN</b></button>
          </div>

          <div v-if="!isAnnual && bonusesActive" class="checkout-modal__upgrades">
            <label :class="{ 'checkout-modal__upgrade--selected': addVip }" class="checkout-modal__upgrade">
              <input v-model="addVip" type="checkbox">
               <span><em>MÁS ELEGIDO</em><strong>Círculo VIP de Mujeres Vitales</strong><small>Comunidad privada, encuentro mensual y acompañamiento cercano.</small></span>
              <b>+${{ vipPrice }}</b>
            </label>
            <label :class="{ 'checkout-modal__upgrade--selected': addNutrition }" class="checkout-modal__upgrade">
              <input v-model="addNutrition" type="checkbox">
               <span><em>BIENESTAR DIARIO</em><strong>Recetario para nutrirte mejor</strong><small>Recetas prácticas para cuidar tu alimentación sin complicarte.</small></span>
              <b>+$5</b>
            </label>
          </div>

          <div v-if="isAnnual" class="checkout-modal__annual">
            <p><span>✓</span>Círculo VIP incluido</p>
            <p><span>✓</span>Recetario nutricional incluido</p>
            <p><span>✓</span>12 meses de Vital 360</p>
          </div>

          <div class="checkout-modal__details">
            <p>Crea tu acceso seguro</p>
            <div>
              <label><span>Nombre</span><input v-model="form.name" type="text" autocomplete="given-name" placeholder="Tu nombre"></label>
              <label><span>Apellido</span><input v-model="form.lastName" type="text" autocomplete="family-name" placeholder="Tu apellido"></label>
            </div>
            <label><span>Correo electrónico</span><input v-model="form.email" type="email" autocomplete="email" placeholder="tu@email.com"></label>
          </div>

          <div class="checkout-modal__total">
            <span>TOTAL DE TU SELECCIÓN<small v-if="!isAnnual">AHORRAS $20 AL MES EN TU MEMBRESÍA</small></span><strong :aria-label="`Total $${total}`">${{ displayedTotal }}</strong>
          </div>
          <p v-if="errorMessage" class="checkout-modal__error">{{ errorMessage }}</p>
          <button type="button" class="checkout-modal__continue" :disabled="loading" @click="renderPayment">
            {{ loading ? 'PREPARANDO TU PAGO...' : 'SÍ, QUIERO EMPEZAR AHORA' }} <span v-if="!loading">→</span>
          </button>
          <small class="checkout-modal__legal">
             {{ isAnnual ? 'Pago único por 12 meses con todos los beneficios indicados.' : 'Tu membresía base siempre es $27. Con ambos bonos opcionales, el pago máximo es $47.' }}
          </small>
        </div>

        <div v-else key="payment" class="checkout-modal__payment">
          <button type="button" class="checkout-modal__back" @click="step = 'upgrades'">← VOLVER A MI SELECCIÓN</button>
          <h2>Completa tu pago de ${{ total }}</h2>
          <p>Procesado de forma segura por PayPhone.</p>
          <div id="payphone-button"></div>
          <p v-if="errorMessage" class="checkout-modal__error">{{ errorMessage }}</p>
        </div>
        </Transition>
      </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.checkout-overlay { position: fixed; inset: 0; z-index: 100; display: flex; justify-content: center; align-items: safe center; width: 100%; padding: 1rem; overflow-y: auto; background: rgba($primary-dark, 0.82); backdrop-filter: blur(10px); }
.checkout-overlay--preparing { align-items: center !important; }
.checkout-modal { position: relative; display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 58rem; max-height: min(56rem, calc(100vh - 3rem)); max-height: min(56rem, calc(100dvh - 3rem)); overflow-y: auto; overscroll-behavior: contain; scrollbar-gutter: stable; border: 1px solid rgba($primary-dark, 0.12); border-radius: 1.3rem; background: $white; box-shadow: 0 30px 90px rgba($primary-dark, 0.32); transition: max-width 0.5s cubic-bezier(0.2, 0.8, 0.2, 1), min-height 0.5s ease, max-height 0.5s ease, border-radius 0.45s ease, background 0.35s ease; }
.checkout-modal::-webkit-scrollbar { width: 0.5rem; }
.checkout-modal::-webkit-scrollbar-thumb { border-radius: 999px; background: rgba($primary-dark, 0.24); }
.checkout-modal::-webkit-scrollbar-track { background: transparent; }
.checkout-modal--preparing { max-width: 11rem; min-height: 11rem; max-height: 11rem; overflow: hidden; border: 2px solid $primary; border-radius: 50%; background: $primary-dark; box-shadow: 0 24px 70px rgba($primary, 0.25); }
.checkout-modal--urgent { border-color: rgba($primary-dark, 0.12); }
.checkout-modal__preparing { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; height: 11rem; gap: 0.25rem; color: $white; text-align: center; }
.checkout-modal__preparing > span { display: flex; width: 100%; max-width: 2.8rem; height: 2.8rem; margin-bottom: 0.35rem; border: 0.25rem solid rgba($white, 0.2); border-top-color: $primary; border-radius: 50%; animation: checkout-spin 0.8s linear infinite; }
.checkout-modal__preparing strong { width: 100%; color: $primary; font-size: 0.88rem; letter-spacing: 0.04em; text-transform: uppercase; }
.checkout-modal__preparing small { width: 100%; color: rgba($white, 0.68); font-size: 0.68rem; }
.checkout-modal__close { position: sticky; top: 0.8rem; z-index: 2; display: flex; justify-content: center; align-items: center; align-self: flex-end; width: 100%; max-width: 2.5rem; height: 2.5rem; flex-shrink: 0; margin: 0.8rem 0.8rem -3.3rem 0; border: 0; border-radius: 50%; background: $primary-dark; color: $white; font-size: 1.5rem; cursor: pointer; }
.checkout-modal__content, .checkout-modal__payment { display: flex; flex-direction: column; align-items: center; width: 100%; gap: 0.8rem; padding: 1.35rem 1.6rem; text-align: center; }
.checkout-modal__visual { display: flex; align-items: stretch; width: 100%; min-height: 6rem; overflow: hidden; border-bottom: 1px solid rgba($primary-dark, 0.12); background-color: transparent; background-position: center 28%; background-size: cover; color: $primary-dark; }
.checkout-modal__visual > div { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; width: 100%; gap: 0.3rem; padding: 0.85rem 3.6rem 0.85rem 0.9rem; text-align: left; }
.checkout-modal__visual span { width: 100%; color: $primary; font-size: 12px; font-weight: 900; letter-spacing: 0.1em; }
.checkout-modal__visual--annual { border-radius: 0.75rem; background-color: $primary-dark; color: $white; }
.checkout-modal__visual strong { width: 100%; font-size: clamp(1rem, 3vw, 1.35rem); line-height: 1.3; }
.checkout-modal__eyebrow { width: 100%; color: $LPB-GREEN-D; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.12em; }
.checkout-modal h2 { max-width: 38rem; font-size: clamp(2rem, 5vw, 3.3rem); }
.checkout-modal__intro { width: 100%; max-width: 42rem; color: $text-secondary; font-size: 14px; font-weight: 500; line-height: 1.45; }
.checkout-modal__timer { display: flex; justify-content: space-between; align-items: center; width: 100%; gap: 1rem; padding: 0.75rem 1rem; border: 0; border-left: 0.22rem solid $alert-error; background: $LPB-SURFACE; color: $primary-dark; }
.checkout-modal__timer span { width: auto; flex-shrink: 0; color: $alert-error; font-size: 1.7rem; font-weight: 900; }
.checkout-modal__timer small { width: auto; color: $text-secondary; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-align: right; }
.checkout-modal__expired { display: flex; flex-direction: column; align-items: center; width: 100%; gap: 0.9rem; padding: 1.2rem; border: 2px solid $alert-error; border-radius: 0.8rem; background: $alert-error-bg; text-align: center; }
.checkout-modal__expired > span { display: flex; justify-content: center; align-items: center; width: 100%; max-width: 2.6rem; height: 2.6rem; border-radius: 50%; background: $alert-error; color: $white; font-size: 1.4rem; font-weight: 900; }
.checkout-modal__expired > div { display: flex; flex-direction: column; align-items: center; width: 100%; gap: 0.45rem; }
.checkout-modal__expired strong { width: 100%; color: $alert-error; font-size: 1.05rem; }
.checkout-modal__expired p { width: 100%; color: $primary-dark; line-height: 1.55; }
.checkout-modal__expired button { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; width: 100%; gap: 0.55rem; padding: 0.9rem; border: 0; border-radius: 0.55rem; background: $alert-error; color: $white; font-weight: 900; cursor: pointer; transition: transform 0.25s ease, background 0.25s ease; }
.checkout-modal__expired button:hover { transform: translateY(-0.15rem); background: #c81e31; }
.checkout-modal__expired button b { padding: 0.25rem 0.4rem; border-radius: 0.3rem; background: $white; color: $alert-error; font-size: 0.68rem; }
.checkout-modal__annual-deal { display: flex; flex-direction: column; align-items: center; width: 100%; gap: 0.55rem; padding: 1rem; border: 1px solid rgba($primary, 0.45); border-radius: 0.75rem; background: $primary-dark; color: $white; }
.checkout-modal__annual-deal > div { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; width: 100%; gap: 0.8rem; }
.checkout-modal__annual-deal del { color: rgba($white, 0.5); font-weight: 800; }
.checkout-modal__annual-deal strong { color: $primary; font-size: 2rem; }
.checkout-modal__annual-deal b { padding: 0.35rem 0.55rem; border-radius: 0.35rem; background: $primary; color: $primary-dark; font-size: 0.65rem; }
.checkout-modal__annual-deal > span { width: 100%; color: rgba($white, 0.72); font-size: 0.72rem; }
.checkout-modal__upgrades { display: flex; align-items: stretch; width: 100%; gap: 0.8rem; }
.checkout-modal__upgrade { display: flex; flex: 1 1 0; justify-content: center; align-items: center; width: 100%; gap: 0.8rem; padding: 1rem; border: 1px solid rgba($primary-dark, 0.14); border-radius: 0.7rem; background: $white; cursor: pointer; transition: border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
.checkout-modal__upgrade:hover { transform: translateY(-0.15rem); border-color: $primary; }
.checkout-modal__upgrade--selected { border-color: $primary; background: linear-gradient(135deg, $LPB-GREEN-D, $primary-dark); box-shadow: 0 0.8rem 1.5rem rgba($LPB-GREEN-D, 0.3); animation: bonus-selected 0.45s cubic-bezier(0.2, 0.9, 0.25, 1); }
.checkout-modal__upgrade input { width: 1.2rem; height: 1.2rem; flex-shrink: 0; appearance: none; border: 2px solid rgba($primary-dark, 0.45); border-radius: 0.3rem; background: $white; cursor: pointer; transition: background 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease, transform 0.25s ease; }
.checkout-modal__upgrade input:checked { border-color: $primary; background: $primary; box-shadow: inset 0 0 0 0.22rem $primary-dark, 0 0 0 0.2rem rgba($primary, 0.16); animation: check-selected 0.4s ease; }
.checkout-modal__upgrade > span { display: flex; flex-direction: column; align-items: flex-start; width: 100%; text-align: left; }
.checkout-modal__upgrade em { width: 100%; margin-bottom: 0.15rem; color: $LPB-GREEN-D; font-size: 10px; font-style: normal; font-weight: 900; letter-spacing: 0.1em; }
.checkout-modal__upgrade strong { width: 100%; color: $primary-dark; font-size: 14px; }
.checkout-modal__upgrade small { width: 100%; color: $text-secondary; font-size: 12px; line-height: 1.4; }
.checkout-modal__upgrade b { flex-shrink: 0; color: $LPB-GREEN-D; font-size: 1rem; transition: color 0.3s ease, transform 0.3s ease; }
.checkout-modal__upgrade--selected em, .checkout-modal__upgrade--selected b { color: $primary; }
.checkout-modal__upgrade--selected b { transform: scale(1.12); }
.checkout-modal__upgrade--selected strong { color: $white; }
.checkout-modal__upgrade--selected small { color: rgba($white, 0.7); }
.checkout-modal__annual { display: flex; flex-direction: column; width: 100%; gap: 0.7rem; padding: 1.2rem; border-radius: 0.8rem; background: $LPB-LIGHT; }
.checkout-modal__annual p { display: flex; justify-content: center; width: 100%; gap: 0.6rem; color: $primary-dark; }
.checkout-modal__annual span { color: $primary; font-weight: 900; }
.checkout-modal__details { display: flex; flex-direction: column; width: 100%; gap: 0.65rem; padding: 1rem; border: 1px solid rgba($primary-dark, 0.12); border-radius: 0.7rem; background: $LPB-SURFACE; }
.checkout-modal__details > p { width: 100%; color: $primary-dark; font-size: 14px; font-weight: 900; letter-spacing: 0.04em; text-align: left; }
.checkout-modal__details > div { display: flex; width: 100%; gap: 0.8rem; }
.checkout-modal__details label { display: flex; flex: 1 1 0; flex-direction: column; align-items: flex-start; width: 100%; gap: 0.2rem; }
.checkout-modal__details label span { width: 100%; color: $text-secondary; font-size: 12px; font-weight: 800; text-align: left; }
.checkout-modal__details input { width: 100%; padding: 0.58rem 0.65rem; border: 1px solid rgba($primary-dark, 0.14); border-radius: 0.5rem; background: $white; color: $primary-dark; font: inherit; }
.checkout-modal__details input:focus { outline: 2px solid rgba($primary, 0.35); border-color: $primary; }
.checkout-modal__total { display: flex; justify-content: center; align-items: center; width: 100%; gap: 1rem; padding-top: 0.45rem; border-top: 1px solid rgba($primary-dark, 0.14); }
.checkout-modal__total span { display: flex; flex-direction: column; color: $text-secondary; font-size: 13px; font-weight: 900; letter-spacing: 0.1em; }
.checkout-modal__total span small { color: $LPB-GREEN-D; font-size: 11px; letter-spacing: 0.06em; }
.checkout-modal__total strong { color: $primary-dark; font-size: 2.2rem; }
.checkout-modal__continue { display: flex; justify-content: center; align-items: center; width: 100%; gap: 0.6rem; padding: 0.85rem; border: 0; border-radius: 0.6rem; background: linear-gradient(90deg, $primary, #20d598); color: $primary-dark; font-weight: 900; cursor: pointer; box-shadow: 0 0.7rem 1.4rem rgba($primary, 0.24); transition: background 0.25s ease, transform 0.25s ease; }
.checkout-modal__continue:hover { transform: translateY(-0.15rem); background: $LPB-GREEN-D; color: $white; }
.checkout-modal__continue:disabled { opacity: 0.65; cursor: wait; }
.checkout-modal__legal { width: 100%; color: $text-secondary; font-size: 11px; line-height: 1.4; }
.checkout-modal__payment > p { width: 100%; color: $text-secondary; }
.checkout-modal__back { align-self: flex-start; width: 100%; border: 0; background: transparent; color: $LPB-GREEN-D; font-weight: 900; text-align: left; cursor: pointer; }
#payphone-button { display: flex; justify-content: center; width: 100%; min-height: 12rem; }
.checkout-modal__error { width: 100%; padding: 0.8rem; border-radius: 0.5rem; background: $alert-error-bg; color: $alert-error !important; }
.checkout-transition-enter-active, .checkout-transition-leave-active { transition: opacity 0.3s ease; }
.checkout-transition-enter-active .checkout-modal, .checkout-transition-leave-active .checkout-modal { transition: opacity 0.3s ease, transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1); }
.checkout-transition-enter-from, .checkout-transition-leave-to { opacity: 0; }
.checkout-transition-enter-from .checkout-modal { opacity: 0; transform: translateY(2rem) scale(0.95); }
.checkout-transition-leave-to .checkout-modal { opacity: 0; transform: translateY(1rem) scale(0.97); }
@keyframes checkout-spin {
  to { transform: rotate(360deg); }
}
@keyframes bonus-selected { 0% { transform: scale(0.97); } 55% { transform: translateY(-0.18rem) scale(1.02); } 100% { transform: scale(1); } }
@keyframes check-selected { 0% { transform: scale(0.65) rotate(-12deg); } 65% { transform: scale(1.18) rotate(4deg); } 100% { transform: scale(1); } }

@media (prefers-reduced-motion: reduce) { .checkout-modal__upgrade, .checkout-modal__upgrade input, .checkout-modal__upgrade b { transition: none; animation: none; } }
@media (max-width: 600px) {
  .checkout-overlay { padding: 0.5rem; }
  .checkout-modal { max-height: calc(100vh - 1rem); max-height: calc(100dvh - 1rem); }
  .checkout-modal__content { gap: 0.4rem; padding: 0.75rem 1rem; }
  .checkout-modal__visual { min-height: 5rem; }
  .checkout-modal__timer { gap: 0.75rem; padding: 0.6rem 0.75rem; }
  .checkout-modal__upgrades { flex-direction: column; }
  .checkout-modal__upgrade { align-items: flex-start; gap: 0.65rem; padding: 0.75rem; }
  .checkout-modal__details { gap: 0.45rem; padding: 0.75rem; }
  .checkout-modal__details > div { gap: 0.5rem; }
  .checkout-modal__upgrade b { font-size: 1rem; }
}
</style>
