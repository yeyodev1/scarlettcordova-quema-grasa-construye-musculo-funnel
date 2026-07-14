<script setup lang="ts">
import CountdownTimer from './CountdownTimer.vue'
import { funnelImages } from '@/config/funnelContent'
</script>

<template>
  <section class="hero">
    <div class="hero__glow"></div>
    <div class="hero__inner funnel-container">
      <div class="hero__copy">
        <p class="eyebrow"><span></span> VITAL 360 · LUISA PITA BEJARANO</p>
        <h1>Deja de entrenar sin resultados. Activa tu cuerpo de forma <em>inteligente.</em></h1>
        <p class="hero__lead">
          Pierde grasa, recupera tu fuerza y construye una tonificación real sin dietas de hambre,
          rutinas eternas ni entrenar sola.
        </p>
        <a class="primary-button" href="#oferta">QUIERO ENTRAR A VITAL 360 <span>→</span></a>
        <div class="hero__proof">
          <strong>360°</strong>
          <span>entrenamiento, nutrición<br>y comunidad</span>
        </div>
      </div>
      <div class="hero__visual">
        <div class="hero__image-wrap">
          <img :src="funnelImages[0]" alt="Luisa Pita Bejarano presentando su método" fetchpriority="high">
          <div class="hero__badge"><strong>VITAL 360</strong><span>Tu transformación integral</span></div>
        </div>
        <CountdownTimer />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  margin-bottom: clamp(0.75rem, 2vw, 1.5rem);
  overflow: hidden;
  background: $primary-dark;

  &__glow {
    position: absolute;
    right: -15%;
    bottom: -30%;
    width: 100%;
    max-width: 55rem;
    height: 80%;
    border-radius: 50%;
    background: rgba($primary, 0.14);
    filter: blur(80px);
  }

  &__inner {
    position: relative;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: clamp(2rem, 6vw, 6rem);
    padding-top: 4rem;
    padding-bottom: 7rem;
  }

  &__copy, &__visual {
    display: flex;
    flex: 1 1 0;
    flex-direction: column;
    width: 100%;
  }

  &__copy { align-items: center; gap: 1.6rem; text-align: center; }
  &__visual { align-items: center; gap: 1rem; max-width: 30rem; }

  h1 {
    width: 100%;
    color: $white;
    font-size: clamp(2.7rem, 5.4vw, 4.75rem);
    line-height: 0.98;
    letter-spacing: -0.055em;
    text-align: center;

    em { color: $primary; font-style: normal; }
  }

  &__lead {
    width: 100%;
    max-width: 42rem;
    color: rgba($white, 0.7);
    font-size: clamp(1rem, 1.8vw, 1.2rem);
    line-height: 1.65;
    text-align: center;
  }

  &__proof {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 0.8rem;
    color: rgba($white, 0.66);
    font-size: 0.78rem;
    line-height: 1.35;
    text-align: left;

    strong { color: $primary; font-size: 1.8rem; }
  }

  &__image-wrap {
    position: relative;
    display: flex;
    width: 100%;
    overflow: hidden;
    border: 1px solid rgba($white, 0.14);
    border-radius: 1.5rem;

    img { width: 100%; height: auto; aspect-ratio: 4 / 5; object-fit: cover; }
  }

  &__badge {
    position: absolute;
    right: 1rem;
    bottom: 1rem;
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 13rem;
    padding: 0.9rem;
    border-radius: 0.8rem;
    background: rgba($primary-dark, 0.86);
    color: $white;
    backdrop-filter: blur(8px);

    strong { color: $primary; letter-spacing: 0.12em; }
    span { font-size: 0.72rem; }
  }
}

@media (max-width: 800px) {
  .hero {
    &__inner { flex-direction: column; padding-top: 2.5rem; }
    &__copy { align-items: center; text-align: center; }
    &__visual { max-width: 30rem; }
    &__proof { justify-content: center; }
  }
}
</style>
