<script setup lang="ts">
import { useCountdown } from '@/composables/useCountdown'

const { hours, minutes, seconds, isActive } = useCountdown()
</script>

<template>
  <div class="countdown" :class="{ 'countdown--finished': !isActive }" :role="isActive ? 'timer' : 'status'" aria-live="polite">
    <p class="countdown__label">
      {{ isActive ? 'Ventana para elegir bonos opcionales' : 'Ventana de bonos finalizada' }}
    </p>
    <div v-if="isActive" class="countdown__time" aria-label="Tiempo restante para elegir bonos">
      <span>{{ hours }}</span><b>:</b><span>{{ minutes }}</span><b>:</b><span>{{ seconds }}</span>
    </div>
    <p v-if="isActive" class="countdown__caption">HORAS&nbsp;&nbsp;&nbsp; MINUTOS&nbsp;&nbsp;&nbsp; SEGUNDOS</p>
    <p v-else class="countdown__message">El tiempo para elegir bonos terminó, pero puedes comenzar tu transformación por los mismos $27.</p>
    <small>CONTADOR INFORMATIVO · LOS BONOS SE ELIGEN DENTRO DEL CHECKOUT</small>
  </div>
</template>

<style lang="scss" scoped>
.countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0.5rem;
  padding: 1.2rem 0;
  border-top: 1px solid rgba($primary-dark, 0.14);
  border-bottom: 1px solid rgba($primary-dark, 0.14);
  cursor: default;

  &__label {
    width: 100%;
    color: $LPB-GREEN-D;
    font-size: 0.78rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-align: center;
    text-transform: uppercase;
  }

  &__time {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 0.5rem;
    color: $primary-dark;
    font-size: clamp(1.8rem, 6vw, 3.1rem);
    font-weight: 900;
    line-height: 1;

    span {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 5rem;
    }

    b { color: $LPB-GREEN-D; }
  }

  &__caption {
    width: 100%;
    color: $text-secondary;
    font-size: 0.55rem;
    text-align: center;
  }

  &__message { width: 100%; max-width: 27rem; color: $text-secondary; font-size: 0.82rem; line-height: 1.5; text-align: center; }
  > small { width: 100%; color: rgba($primary-dark, 0.48); font-size: 0.55rem; font-weight: 800; letter-spacing: 0.08em; text-align: center; }
}
</style>
