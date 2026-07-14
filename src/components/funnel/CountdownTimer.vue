<script setup lang="ts">
import { useCountdown } from '@/composables/useCountdown'

const { hours, minutes, seconds, isActive, price } = useCountdown()
</script>

<template>
  <div class="countdown" :class="{ 'countdown--finished': !isActive }" :role="isActive ? 'timer' : 'status'" aria-live="polite">
    <p class="countdown__label">
      {{ isActive ? 'Precio para ti ahora mismo' : 'Tu precio base se mantiene' }}
    </p>
    <p class="countdown__price"><strong>${{ price }}</strong><span>al mes</span></p>
    <div v-if="isActive" class="countdown__time" aria-label="Tiempo restante para elegir bonos">
      <span>{{ hours }}</span><b>:</b><span>{{ minutes }}</span><b>:</b><span>{{ seconds }}</span>
    </div>
    <p v-if="isActive" class="countdown__caption">HORAS&nbsp;&nbsp;&nbsp; MINUTOS&nbsp;&nbsp;&nbsp; SEGUNDOS PARA ELEGIR TUS BONOS</p>
    <p v-else class="countdown__message">El tiempo para elegir bonos terminó, pero puedes comenzar tu transformación por los mismos $27.</p>
  </div>
</template>

<style lang="scss" scoped>
.countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 0.35rem;
  padding: 1rem;
  border: 1px solid rgba($primary, 0.4);
  border-radius: 1rem;
  background: rgba($primary-dark, 0.82);

  &__label {
    width: 100%;
    color: $primary;
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
    color: $white;
    font-size: clamp(1.8rem, 6vw, 3.1rem);
    font-weight: 900;
    line-height: 1;

    span {
      display: flex;
      justify-content: center;
      width: 100%;
      max-width: 5rem;
    }

    b { color: $primary; }
  }

  &__price {
    display: flex;
    justify-content: center;
    align-items: baseline;
    width: 100%;
    gap: 0.45rem;
    color: $white;

    strong { color: $primary; font-size: clamp(2.4rem, 8vw, 4rem); line-height: 1; }
    span { font-size: 0.85rem; font-weight: 800; }
  }

  &__caption {
    width: 100%;
    color: rgba($white, 0.55);
    font-size: 0.55rem;
    text-align: center;
  }

  &__message { width: 100%; max-width: 27rem; color: rgba($white, 0.76); font-size: 0.82rem; line-height: 1.5; text-align: center; }
}
</style>
