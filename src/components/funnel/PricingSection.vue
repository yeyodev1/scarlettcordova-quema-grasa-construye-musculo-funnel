<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import { useAnnualOfferCountdown } from '@/composables/useAnnualOfferCountdown'
import CheckoutModal from './CheckoutModal.vue'
import PlanCard from './PlanCard.vue'

const { price, hours, minutes, seconds, isActive: monthlyOfferActive } = useCountdown()
const { hours: annualHours, minutes: annualMinutes, seconds: annualSeconds, isActive: annualOfferActive } = useAnnualOfferCountdown()
const monthlyFeatures = ['Programa de entrenamiento progresivo', 'Guías de nutrición de rendimiento', 'Transmisiones y acompañamiento', 'Comunidad privada Vital 360'] as const
const annualFeatures = ['12 meses completos de Vital 360', 'Círculo VIP incluido', 'Recetario nutricional incluido', 'Un único pago, sin mensualidades'] as const
const annualPrice = computed(() => annualOfferActive.value ? 297 : 400)
const monthlyDescription = 'Aprovecha esta oportunidad para entrenar, nutrirte mejor y construir hábitos que transformen tu vida por $27 al mes.'
const checkoutOpen = ref(false)
const selectedPlan = ref<'monthly' | 'annual'>('monthly')

const openCheckout = (plan: 'monthly' | 'annual') => {
  selectedPlan.value = plan
  checkoutOpen.value = true
}
</script>

<template>
  <section id="oferta" class="pricing section-pad">
    <div class="funnel-container pricing__inner">
      <div class="pricing__heading">
        <p class="eyebrow"><span></span> TU NUEVO COMIENZO VITAL 360</p>
        <h2>Dos formas de comenzar.</h2>
        <p class="section-lead">Empieza con la membresía mensual o asegura doce meses con todos los beneficios incluidos.</p>
      </div>
      <div class="pricing__snapshot">
        <article>
          <span>MEMBRESÍA MENSUAL</span>
          <p><del>$47</del><strong>${{ price }}<small>/mes</small></strong></p>
          <b>Ahorras $20 cada mes</b>
          <small>{{ monthlyOfferActive ? `${hours}:${minutes}:${seconds} para elegir bonos opcionales` : 'La membresía continúa disponible' }}</small>
        </article>
        <i></i>
        <article>
          <span>PLAN ANUAL</span>
          <p><del v-if="annualOfferActive">$400</del><strong>${{ annualPrice }}<small>/12 meses</small></strong></p>
          <b>{{ annualOfferActive ? 'Ahorras $103' : 'Incluye todos los beneficios' }}</b>
          <small>{{ annualOfferActive ? `${annualHours}:${annualMinutes}:${annualSeconds} para aprovechar el descuento` : 'Precio anual vigente' }}</small>
        </article>
      </div>
      <p class="pricing__hint">Selecciona una opción en las tarjetas de abajo.</p>
      <div class="pricing__plans">
        <PlanCard name="Membresía mensual" :price="price" :original-price="47" suffix="al mes" :description="monthlyDescription" :features="monthlyFeatures" featured badge-text="PRECIO ESPECIAL DE ESTA OPORTUNIDAD" button-text="QUIERO EMPEZAR POR $27" @select="openCheckout('monthly')" />
        <PlanCard name="Plan anual Vital 360" :price="annualPrice" suffix="por 12 meses" :description="annualOfferActive ? 'Oferta exclusiva de 2 horas. Precio normal: $400.' : 'Precio anual regular con todos los beneficios incluidos.'" :features="annualFeatures" :button-text="annualOfferActive ? 'APROVECHAR $297 · AHORRO $103' : 'QUIERO EL PLAN ANUAL'" @select="openCheckout('annual')" />
      </div>
      <p class="pricing__terms">La Cajita procesa el pago inicial. La membresía mensual cuesta $27; los bonos disponibles en el checkout son opcionales y se cobran una sola vez.</p>
    </div>
    <CheckoutModal :open="checkoutOpen" :plan="selectedPlan" :annual-price="annualPrice" @close="checkoutOpen = false" />
  </section>
</template>

<style lang="scss" scoped>
.pricing {
  background: $LPB-LIGHT;

  &__inner { flex-direction: column; justify-content: center; align-items: center; gap: 2rem; }
  &__heading { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 52rem; gap: 0.9rem; text-align: center; }
  &__heading h2 { font-size: clamp(2.8rem, 7vw, 5.2rem); }
  &__snapshot { display: flex; justify-content: center; align-items: stretch; width: 100%; max-width: 58rem; padding: 1.5rem 0; border-top: 1px solid rgba($primary-dark, 0.14); border-bottom: 1px solid rgba($primary-dark, 0.14); cursor: default; }
  &__snapshot article { display: flex; flex: 1 1 0; flex-direction: column; align-items: center; width: 100%; gap: 0.45rem; text-align: center; }
  &__snapshot article > span { width: 100%; color: $LPB-GREEN-D; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em; }
  &__snapshot article > p { display: flex; justify-content: center; align-items: baseline; width: 100%; gap: 0.75rem; }
  &__snapshot del { color: $alert-error; font-size: 1rem; font-weight: 800; }
  &__snapshot strong { color: $primary-dark; font-size: 2.6rem; line-height: 1; }
  &__snapshot strong small { color: $text-secondary; font-size: 0.72rem; }
  &__snapshot b { width: 100%; color: $primary-dark; font-size: 0.8rem; }
  &__snapshot article > small { width: 100%; color: $text-secondary; font-size: 0.68rem; }
  &__snapshot > i { width: 1px; flex-shrink: 0; margin: 0 2rem; background: rgba($primary-dark, 0.14); }
  &__hint { width: 100%; color: $text-secondary; font-size: 0.75rem; font-weight: 800; text-align: center; }
  &__plans { display: flex; justify-content: center; align-items: stretch; width: 100%; gap: 1.2rem; }
  &__terms { width: 100%; max-width: 48rem; color: $text-secondary; font-size: 0.72rem; text-align: center; }
}

@media (max-width: 750px) {
  .pricing {
    &__plans { flex-direction: column; }
    &__snapshot { flex-direction: column; gap: 1.2rem; }
    &__snapshot > i { width: 100%; height: 1px; margin: 0; }
  }
}
</style>
