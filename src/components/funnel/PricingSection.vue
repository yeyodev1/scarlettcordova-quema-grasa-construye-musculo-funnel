<script setup lang="ts">
import { computed, ref } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import { useAnnualOfferCountdown } from '@/composables/useAnnualOfferCountdown'
import AnnualOfferTimer from './AnnualOfferTimer.vue'
import CheckoutModal from './CheckoutModal.vue'
import CountdownTimer from './CountdownTimer.vue'
import PlanCard from './PlanCard.vue'

const { price } = useCountdown()
const { isActive: annualOfferActive } = useAnnualOfferCountdown()
const monthlyFeatures = ['Programa de entrenamiento progresivo', 'Guías de nutrición de rendimiento', 'Transmisiones y acompañamiento', 'Comunidad privada Vital 360'] as const
const annualFeatures = ['12 meses completos de Vital 360', 'Círculo VIP incluido', 'Recetario nutricional incluido', 'Un único pago, sin mensualidades'] as const
const annualPrice = computed(() => annualOfferActive.value ? 297 : 400)
const annualSavings = computed(() => annualOfferActive.value ? 103 : 0)
const monthlyDescription = 'Comienza a entrenar, nutrirte mejor y construir hábitos que mejoren tu vida por $27 al mes.'
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
        <h2>Empieza por $27 o asegura tu año completo.</h2>
        <p class="section-lead">Elige la opción que mejor se adapta a tu compromiso y comienza a entrenar con Luisa.</p>
      </div>
      <div class="pricing__value">
        <span>Tu membresía base</span><strong>${{ price }} al mes</strong><small>Elige bonos opcionales solo si los quieres</small>
      </div>
      <CountdownTimer />
      <AnnualOfferTimer />
      <div class="pricing__plans">
        <PlanCard name="Membresía mensual" :price="price" suffix="al mes" :description="monthlyDescription" :features="monthlyFeatures" featured badge-text="EMPIEZA HOY POR SOLO $27" button-text="QUIERO EMPEZAR MI CAMBIO" @select="openCheckout('monthly')" />
        <PlanCard name="Plan anual Vital 360" :price="annualPrice" suffix="por 12 meses" :description="annualOfferActive ? 'Oferta exclusiva de 2 horas. Precio normal: $400.' : 'Precio anual regular con todos los beneficios incluidos.'" :features="annualFeatures" :button-text="annualOfferActive ? 'APROVECHAR $297 · AHORRO $103' : 'QUIERO EL PLAN ANUAL'" @select="openCheckout('annual')" />
      </div>
      <div class="pricing__upgrades">
        <div><span>✓</span><p><strong>Tu base siempre es $27</strong>Los bonos son opcionales: tú decides si deseas sumarlos para potenciar tu experiencia.</p></div>
        <div><span>↑</span><p><strong>{{ annualOfferActive ? `Oferta anual: ahorra $${annualSavings}` : 'Plan anual a precio regular' }}</strong>{{ annualOfferActive ? 'Durante 2 horas pagas $297 en lugar de $400.' : 'El precio anual volvió a $400.' }}</p></div>
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
  &__value { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; width: 100%; gap: 0.8rem; color: $text-secondary; }
  &__value del { color: $alert-error; font-weight: 800; }
  &__value strong { padding: 0.55rem 0.8rem; border-radius: 0.4rem; background: $primary; color: $primary-dark; }
  &__value small { width: 100%; font-size: 0.72rem; text-align: center; }
  :deep(.countdown) { max-width: 34rem; }
  &__plans { display: flex; justify-content: center; align-items: stretch; width: 100%; gap: 1.2rem; }
  &__upgrades { display: flex; justify-content: center; align-items: stretch; width: 100%; gap: 1rem; }
  &__upgrades > div { display: flex; flex: 1 1 0; justify-content: center; align-items: center; width: 100%; gap: 1rem; padding: 1.3rem; border: 1px solid rgba($primary-dark, 0.1); border-radius: 0.8rem; background: $white; }
  &__upgrades > div > span { display: flex; justify-content: center; align-items: center; width: 100%; max-width: 2.5rem; height: 2.5rem; flex-shrink: 0; border-radius: 50%; background: $primary; font-size: 1.5rem; font-weight: 900; }
  &__upgrades p { display: flex; flex-direction: column; align-items: center; width: 100%; color: $text-secondary; font-size: 0.82rem; text-align: center; }
  &__upgrades strong { width: 100%; color: $primary-dark; font-size: 1rem; }
  &__terms { width: 100%; max-width: 48rem; color: $text-secondary; font-size: 0.72rem; text-align: center; }
}

@media (max-width: 750px) {
  .pricing {
    &__plans, &__upgrades { flex-direction: column; }
  }
}
</style>
