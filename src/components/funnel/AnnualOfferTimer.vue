<script setup lang="ts">
import { useAnnualOfferCountdown } from '@/composables/useAnnualOfferCountdown'

const { hours, minutes, seconds, isActive } = useAnnualOfferCountdown()
</script>

<template>
  <div class="annual-offer" :class="{ 'annual-offer--expired': !isActive }">
    <div class="annual-offer__copy">
      <span>{{ isActive ? 'RESUMEN DEL PLAN ANUAL' : 'PRECIO ANUAL REGULAR' }}</span>
      <p v-if="isActive"><del>$400</del><strong>$297</strong><b>AHORRAS $103</b></p>
      <p v-else><strong>$400</strong></p>
    </div>
    <div v-if="isActive" class="annual-offer__timer">
      <small>DESCUENTO DISPONIBLE DURANTE</small>
      <strong>{{ hours }}:{{ minutes }}:{{ seconds }}</strong>
    </div>
    <small class="annual-offer__note">INFORMACIÓN DE PRECIO · ELIGE EL PLAN EN LA TARJETA INFERIOR</small>
  </div>
</template>

<style lang="scss" scoped>
.annual-offer { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; width: 100%; gap: 1.5rem; padding: 1.2rem 0; border-top: 1px solid rgba($primary-dark, 0.14); border-bottom: 1px solid rgba($primary-dark, 0.14); color: $primary-dark; cursor: default; }
.annual-offer__copy { display: flex; flex-direction: column; align-items: center; width: 100%; gap: 0.45rem; text-align: center; }
.annual-offer__copy > span { width: 100%; color: $LPB-GREEN-D; font-size: 0.68rem; font-weight: 900; letter-spacing: 0.11em; }
.annual-offer__copy p { display: flex; justify-content: center; align-items: center; flex-wrap: wrap; width: 100%; gap: 0.8rem; }
.annual-offer__copy del { color: $alert-error; font-size: 1.2rem; font-weight: 800; }
.annual-offer__copy strong { color: $primary-dark; font-size: 2.2rem; line-height: 1; }
.annual-offer__copy b { padding: 0.4rem 0.6rem; border-radius: 0.4rem; background: $primary; color: $primary-dark; font-size: 0.68rem; }
.annual-offer__timer { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 15rem; gap: 0.25rem; padding-left: 1.5rem; border-left: 1px solid rgba($primary-dark, 0.14); }
.annual-offer__timer small { width: 100%; color: $text-secondary; font-size: 0.58rem; letter-spacing: 0.1em; text-align: center; }
.annual-offer__timer strong { width: 100%; color: $primary-dark; font-size: 1.6rem; text-align: center; }
.annual-offer__note { width: 100%; color: rgba($primary-dark, 0.48); font-size: 0.55rem; font-weight: 800; letter-spacing: 0.08em; text-align: center; }
.annual-offer--expired { border-color: rgba($primary-dark, 0.18); }

@media (max-width: 600px) {
  .annual-offer { flex-direction: column; gap: 0.8rem; }
  .annual-offer__timer { max-width: none; padding: 0.8rem 0 0; border-top: 1px solid rgba($primary-dark, 0.14); border-left: 0; }
}
</style>
