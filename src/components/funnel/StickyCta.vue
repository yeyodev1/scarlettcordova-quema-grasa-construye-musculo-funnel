<script setup lang="ts">
import { useCountdown } from '@/composables/useCountdown'

const { minutes, seconds, price, isActive } = useCountdown()
</script>

<template>
  <aside class="sticky-cta">
    <div class="sticky-cta__inner funnel-container">
      <div class="sticky-cta__offer">
        <span>MEMBRESÍA BASE</span><strong>${{ price }}</strong><small>al mes</small>
      </div>
      <div v-if="isActive" class="sticky-cta__timer"><span>{{ minutes }}:{{ seconds }}</span><small>PARA ELEGIR BONOS</small></div>
      <a href="#oferta">VER OFERTA <span>↑</span></a>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.sticky-cta {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0.65rem 0;
  border-top: 1px solid rgba($primary, 0.35);
  background: rgba($primary-dark, 0.94);
  backdrop-filter: blur(12px);

  &__inner { justify-content: center; align-items: center; gap: 1rem; }
  &__offer { display: flex; justify-content: center; align-items: baseline; width: 100%; gap: 0.5rem; color: $white; text-align: center; }
  &__offer > span { color: $primary; font-size: 0.65rem; font-weight: 900; letter-spacing: 0.08em; }
  &__offer strong { font-size: 1.7rem; }
  &__offer small { color: rgba($white, 0.55); }
  &__timer { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 9rem; color: $white; }
  &__timer span { font-size: 1.1rem; font-weight: 900; }
  &__timer small { color: rgba($white, 0.5); font-size: 0.52rem; }
  a { display: flex; justify-content: center; align-items: center; width: 100%; max-width: 15rem; gap: 0.5rem; padding: 0.8rem 1rem; border-radius: 0.5rem; background: $primary; color: $primary-dark; font-size: 0.8rem; font-weight: 900; text-decoration: none; transition: background 0.25s ease, transform 0.25s ease; }
  a:hover { transform: translateY(-0.15rem); background: $white; }
}

@media (max-width: 600px) {
  .sticky-cta {
    &__offer > span, &__offer small, &__timer small { display: none; }
    &__offer { max-width: 4rem; }
    &__timer { max-width: 5rem; }
    a { max-width: none; }
  }
}
</style>
