<script setup lang="ts">
import { computed, onUnmounted, reactive, ref, watch } from 'vue'
import PayphoneBox from './PayphoneBox.vue'
import { paymentService, type CheckoutExtra, type PaymentBoxConfig } from '@/services/paymentService'

const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const stage = ref<'details' | 'payment'>('details')
const addRecipeBook = ref(false)
const addWhatsapp = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const paymentConfig = ref<PaymentBoxConfig | null>(null)
const form = reactive({ name: '', lastName: '', email: '' })
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const displayedTotal = computed(() => 33 + (addRecipeBook.value ? 10 : 0) + (addWhatsapp.value ? 15 : 0))

const close = () => { if (!loading.value) emit('close') }

async function continueToPayment() {
  errorMessage.value = ''
  if (!form.name.trim() || !form.lastName.trim() || !form.email.trim()) {
    errorMessage.value = 'Completa tu nombre, apellido y correo para continuar.'
    return
  }
  if (!emailPattern.test(form.email.trim())) {
    errorMessage.value = 'Ingresa un correo electrónico válido.'
    return
  }

  const extras: CheckoutExtra[] = []
  if (addRecipeBook.value) extras.push('recipe_book')
  if (addWhatsapp.value) extras.push('whatsapp_vip')
  loading.value = true
  try {
    const response = await paymentService.prepareEbookPayment({
      name: form.name.trim(),
      lastName: form.lastName.trim(),
      email: form.email.trim(),
      extras,
    })
    paymentConfig.value = response.data.data
    stage.value = 'payment'
  } catch (caught) {
    const apiError = caught as { message?: string }
    errorMessage.value = apiError.message || 'No fue posible preparar el pago.'
  } finally {
    loading.value = false
  }
}

watch(() => props.open, (open) => {
  document.body.style.overflow = open ? 'hidden' : ''
  if (!open) return
  stage.value = 'details'
  paymentConfig.value = null
  addRecipeBook.value = false
  addWhatsapp.value = false
  errorMessage.value = ''
  loading.value = false
  Object.assign(form, { name: '', lastName: '', email: '' })
})

onUnmounted(() => { document.body.style.overflow = '' })
</script>

<template>
  <Teleport to="body">
    <Transition name="checkout">
      <div v-if="open" class="checkout-overlay" @click.self="close">
        <section class="checkout-modal" role="dialog" aria-modal="true" aria-labelledby="checkout-title">
          <button class="checkout-modal__close" type="button" aria-label="Cerrar" @click="close">×</button>
          <div class="checkout-modal__header"><span>{{ stage === 'details' ? '01' : '02' }} / 02</span><p>PAGO SEGURO CON PAYPHONE</p></div>
          <div v-if="stage === 'details'" class="checkout-modal__content">
            <p class="checkout-modal__eyebrow">TU TRANSFORMACIÓN EMPIEZA AQUÍ</p>
            <h2 id="checkout-title">Completa tu método.</h2>
            <p class="checkout-modal__intro">Ebook principal <strong>$33</strong>. Elige si quieres sumar apoyo extra.</p>
            <div class="checkout-modal__bumps">
              <label :class="{ selected: addWhatsapp }"><input v-model="addWhatsapp" type="checkbox"><span><em>MÁS ACOMPAÑAMIENTO</em><strong>Grupo VIP de WhatsApp</strong><small>Comunidad privada, dudas y motivación diaria.</small></span><b>+$15</b></label>
              <label :class="{ selected: addRecipeBook }"><input v-model="addRecipeBook" type="checkbox"><span><em>MÁS VARIEDAD</em><strong>Recetario Secreto</strong><small>Alto en proteína, bajo en calorías, lleno de sabor.</small></span><b>+$10</b></label>
            </div>
            <div class="checkout-modal__form"><label><span>Nombre</span><input v-model="form.name" autocomplete="given-name" placeholder="Scarlett"></label><label><span>Apellido</span><input v-model="form.lastName" autocomplete="family-name" placeholder="Cordova"></label><label class="full"><span>Correo electrónico</span><input v-model="form.email" type="email" autocomplete="email" placeholder="tu@email.com"></label></div>
            <div class="checkout-modal__total"><span>TOTAL DE TU SELECCIÓN<small>El backend validará el monto final</small></span><strong>${{ displayedTotal }}</strong></div>
            <p v-if="errorMessage" class="checkout-modal__error">{{ errorMessage }}</p>
            <button class="checkout-modal__continue" type="button" :disabled="loading" @click="continueToPayment">{{ loading ? 'PREPARANDO PAGO…' : 'CONTINUAR A PAYPHONE →' }}</button>
          </div>
          <div v-else-if="paymentConfig" class="checkout-modal__content checkout-modal__content--payment">
            <p class="checkout-modal__eyebrow">ÚLTIMO PASO</p>
            <h2>Finaliza tu compra.</h2>
            <p class="checkout-modal__intro">PayPhone procesará <strong>${{ paymentConfig.amount / 100 }} USD</strong>. Confirma el pago sin cerrar esta ventana.</p>
            <PayphoneBox :config="paymentConfig" @error="errorMessage = $event" />
            <p v-if="errorMessage" class="checkout-modal__error">{{ errorMessage }}</p>
            <button class="checkout-modal__back" type="button" @click="stage = 'details'">← Cambiar mi selección</button>
          </div>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<style lang="scss" scoped>
.checkout-overlay { position: fixed; inset: 0; z-index: 100; display: flex; justify-content: center; align-items: safe center; width: 100%; padding: 1rem; overflow-y: auto; background: rgba($primary-dark, 0.9); backdrop-filter: blur(10px); }
.checkout-modal { position: relative; display: flex; flex-direction: column; width: 100%; max-width: 53rem; max-height: calc(100dvh - 2rem); overflow-y: auto; border-radius: 1.2rem; background: $primary-surface; box-shadow: 0 2rem 6rem rgba(#000, 0.45); }
.checkout-modal__close { position: absolute; top: 0.8rem; right: 0.8rem; z-index: 2; display: flex; justify-content: center; align-items: center; width: 2.5rem; height: 2.5rem; border: 0; border-radius: 50%; background: $primary-dark; color: $white; font-size: 1.4rem; cursor: pointer; }
.checkout-modal__header { display: flex; justify-content: space-between; width: 100%; padding: 1rem 4.2rem 1rem 1.4rem; background: $primary; color: $white; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em; }
.checkout-modal__content { display: flex; flex-direction: column; align-items: center; width: 100%; gap: 1rem; padding: clamp(1.3rem, 4vw, 2.5rem); text-align: center; }
.checkout-modal__eyebrow { color: $primary; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.13em; }
.checkout-modal h2 { font-size: clamp(2.2rem, 6vw, 4rem); text-transform: uppercase; }
.checkout-modal__intro { color: $text-secondary; line-height: 1.55; }
.checkout-modal__bumps { display: flex; width: 100%; gap: 0.8rem; }
.checkout-modal__bumps label { display: flex; flex: 1 1 0; align-items: center; width: 100%; gap: 0.75rem; padding: 1rem; border: 1px solid rgba($primary-dark, 0.13); border-radius: 0.8rem; text-align: left; cursor: pointer; transition: 0.2s ease; }
.checkout-modal__bumps label.selected { border-color: $primary; background: rgba($primary, 0.06); }
.checkout-modal__bumps input { accent-color: $primary; }
.checkout-modal__bumps label > span { display: flex; flex-direction: column; width: 100%; gap: 0.15rem; }
.checkout-modal__bumps em { color: $primary; font-size: 0.58rem; font-style: normal; font-weight: 900; letter-spacing: 0.08em; }
.checkout-modal__bumps small { color: $text-secondary; line-height: 1.35; }
.checkout-modal__bumps b { color: $primary; white-space: nowrap; }
.checkout-modal__form { display: flex; flex-wrap: wrap; width: 100%; gap: 0.8rem; }
.checkout-modal__form label { display: flex; flex: 1 1 12rem; flex-direction: column; align-items: flex-start; width: 100%; gap: 0.35rem; }
.checkout-modal__form label.full { flex-basis: 100%; }
.checkout-modal__form span { font-size: 0.72rem; font-weight: 800; }
.checkout-modal__form input { width: 100%; padding: 0.9rem; border: 1px solid rgba($primary-dark, 0.16); border-radius: 0.55rem; background: $white; color: $primary-dark; font: inherit; }
.checkout-modal__form input:focus { border-color: $primary; outline: 2px solid rgba($primary, 0.12); }
.checkout-modal__total { display: flex; justify-content: space-between; align-items: center; width: 100%; padding: 0.9rem 1rem; border-radius: 0.7rem; background: $primary-dark; color: $white; text-align: left; }
.checkout-modal__total span { display: flex; flex-direction: column; font-size: 0.72rem; font-weight: 900; letter-spacing: 0.06em; }
.checkout-modal__total small { color: rgba($white, 0.5); font-size: 0.6rem; font-weight: 500; letter-spacing: 0; }
.checkout-modal__total strong { color: $secondary; font-size: 2rem; }
.checkout-modal__continue { width: 100%; padding: 1rem; border: 0; border-radius: 999px; background: $primary; color: $white; font: inherit; font-weight: 900; cursor: pointer; }
.checkout-modal__continue:disabled { opacity: 0.6; cursor: wait; }
.checkout-modal__error { width: 100%; color: $alert-error; font-size: 0.82rem; }
.checkout-modal__back { border: 0; background: transparent; color: $text-secondary; font: inherit; cursor: pointer; }
.checkout-enter-active, .checkout-leave-active { transition: opacity 0.2s ease; } .checkout-enter-from, .checkout-leave-to { opacity: 0; }
@media (max-width: 650px) { .checkout-modal__bumps { flex-direction: column; } }
</style>
