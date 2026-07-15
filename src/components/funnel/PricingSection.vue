<script setup lang="ts">
import { ref } from 'vue'
import CheckoutModal from './CheckoutModal.vue'
import PlanCard from './PlanCard.vue'
import { trackMetaAddToCart } from '@/services/metaTracking'

const monthlyFeatures = ['Método Bakano paso a paso', 'Cursos de ventas y tráfico', 'Guiones de anuncios ganadores', 'Acceso semanal a expertos'] as const
const lifetimeFeatures = ['Acceso de por vida a Bakanology', 'CRM Bakanology incluido', 'Telegram VIP incluido', 'Un único pago, sin mensualidades'] as const
const checkoutOpen = ref(false)
const selectedPlan = ref<'monthly' | 'lifetime'>('monthly')
const openCheckout = (plan: 'monthly' | 'lifetime') => {
  selectedPlan.value = plan
  checkoutOpen.value = true
  trackMetaAddToCart(plan, plan === 'monthly' ? 37 : 297)
}
</script>

<template>
  <section id="oferta" class="pricing section-pad">
    <div class="funnel-container pricing__inner">
      <div class="pricing__heading"><p class="eyebrow"><span></span> ELIGE CÓMO ENTRAR A BAKANOLOGY</p><h2>Valor incalculable. Una inversión sorprendentemente pequeña.</h2><p class="section-lead">Aprende a aplicar por tu cuenta los sistemas de Bakano.ec por $37 mensuales, o asegúralos para siempre con un único pago de $297.</p></div>
      <div class="pricing__snapshot">
        <article><span>ACCESO MENSUAL</span><p><strong>$37<small>/mes</small></strong></p><b>Empieza sin una gran inversión</b><small>Cancela cuando decidas</small></article>
        <i></i>
        <article><span>ACCESO DE POR VIDA</span><p><strong>$297<small>/pago único</small></strong></p><b>Sin suscripciones</b><small>Todo el método para siempre</small></article>
      </div>
      <div class="pricing__plans">
        <PlanCard name="Bakanology mensual" :price="37" suffix="al mes" description="Accede al método completo por un precio módico y aplícalo a tu ritmo." :features="monthlyFeatures" featured badge-text="EMPIEZA HOY" button-text="ENTRAR POR $37 AL MES" @select="openCheckout('monthly')" />
        <PlanCard name="Bakanology de por vida" :price="297" suffix="pago único" description="Llévate todo el sistema para siempre, sin mensualidades ni fecha de vencimiento." :features="lifetimeFeatures" button-text="QUIERO ACCESO PARA SIEMPRE" @select="openCheckout('lifetime')" />
      </div>
      <p class="pricing__terms">Stripe procesa el pago de forma segura. En la membresía mensual puedes agregar CRM Bakanology y Telegram VIP por $15 cada uno.</p>
    </div>
    <CheckoutModal :open="checkoutOpen" :plan="selectedPlan" :lifetime-price="297" @close="checkoutOpen = false" />
  </section>
</template>

<style lang="scss" scoped>
.pricing { background: $primary-light; }
.pricing__inner { flex-direction: column; gap: 2rem; }
.pricing__heading { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 56rem; gap: 0.9rem; text-align: center; }
.pricing__heading h2 { font-size: clamp(2.8rem, 7vw, 5.2rem); }
.pricing__snapshot { display: flex; width: 100%; max-width: 58rem; padding: 1.5rem 0; border-top: 1px solid rgba($primary-dark, 0.14); border-bottom: 1px solid rgba($primary-dark, 0.14); }
.pricing__snapshot article { display: flex; flex: 1 1 0; flex-direction: column; align-items: center; width: 100%; gap: 0.45rem; text-align: center; }
.pricing__snapshot article > span { color: $secondary-dark; font-size: 0.82rem; font-weight: 900; letter-spacing: 0.08em; }
.pricing__snapshot p { display: flex; align-items: baseline; }
.pricing__snapshot strong { color: $primary-dark; font-size: 2.6rem; }
.pricing__snapshot strong small { color: $text-secondary; font-size: 0.82rem; }
.pricing__snapshot article > small { color: $text-secondary; font-size: 0.8rem; }
.pricing__snapshot > i { width: 1px; margin: 0 2rem; background: rgba($primary-dark, 0.14); }
.pricing__plans { display: flex; width: 100%; gap: 1.2rem; }
.pricing__terms { width: 100%; max-width: 48rem; color: $text-secondary; font-size: 0.84rem; line-height: 1.55; text-align: center; }
@media (max-width: 750px) { .pricing__plans, .pricing__snapshot { flex-direction: column; } .pricing__snapshot { gap: 1.2rem; } .pricing__snapshot > i { width: 100%; height: 1px; margin: 0; } }
</style>
