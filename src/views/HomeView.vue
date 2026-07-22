<script setup lang="ts">
import FaqSection from '@/components/funnel/FaqSection.vue'
import FunnelHero from '@/components/funnel/FunnelHero.vue'
import IncludedSection from '@/components/funnel/IncludedSection.vue'
import PricingSection from '@/components/funnel/PricingSection.vue'
import ProblemMethodSection from '@/components/funnel/ProblemMethodSection.vue'
import StickyCta from '@/components/funnel/StickyCta.vue'
import TrainingSection from '@/components/funnel/TrainingSection.vue'
</script>

<template>
  <main class="home-view">
    <a href="/login" class="already-owns">¿Ya tienes el producto? <strong>Ingresa acá</strong> →</a>
    <FunnelHero />
    <ProblemMethodSection />
    <IncludedSection />
    <TrainingSection />
    <PricingSection />
    <FaqSection />
    <StickyCta />
  </main>
</template>

<style lang="scss" scoped>
.home-view { display: flex; flex-direction: column; align-items: center; width: 100%; overflow: hidden; padding-bottom: 5rem; }
.already-owns {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  gap: 0.35rem;
  padding: 0.7rem 1rem;
  background: $primary-dark;
  color: rgba($white, 0.75);
  font-size: 0.8rem;
  text-decoration: none;
  z-index: 10;
  strong {
    color: $secondary;
    font-weight: 800;
    transition: opacity 0.2s;
  }
  &:hover strong { opacity: 0.75; }
}
</style>
