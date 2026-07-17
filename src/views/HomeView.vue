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
</style>
