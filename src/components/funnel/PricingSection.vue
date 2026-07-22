<script setup lang="ts">
import { ref } from 'vue'
import CheckoutModal from './CheckoutModal.vue'
import { funnelImages } from '@/config/funnelContent'
import { trackMetaAddToCart } from '@/services/metaTracking'

const checkoutOpen = ref(false)
const openCheckout = () => {
  checkoutOpen.value = true
  trackMetaAddToCart()
}
</script>

<template>
  <section id="oferta" class="offer section-pad">
    <div class="offer__inner funnel-container">
      <div class="offer__heading"><p class="eyebrow eyebrow--light"><span></span> TU CAMBIO EMPIEZA HOY</p><h2>Llévate el método completo.</h2><p>Una guía para dejar de adivinar y empezar a transformar tu cuerpo con estrategia.</p></div>
      <div class="offer__card">
        <div class="offer__portrait"><img :src="funnelImages.portrait" alt="Scarlett Cordova" width="500" height="750"><span>POR SCARLETT CORDOVA</span></div>
        <div class="offer__content">
          <p class="offer__tag">EBOOK DIGITAL</p>
          <h3>Quema Grasa,<br>Construye Músculo</h3>
          <ul><li>Guía nutricional y déficit calórico</li><li>Calculadora personal de macros</li><li>Suplementación sin humo</li><li>Entrenamiento de lunes a viernes</li><li>Recetas, hábitos y Scar-Tips</li></ul>
          <div class="offer__price"><small>HOY POR</small><strong>$33</strong><span>USD<br>PAGO ÚNICO</span></div>
          <button type="button" class="primary-button" @click="openCheckout">QUIERO EMPEZAR MI TRANSFORMACIÓN <span>→</span></button>
          <p class="offer__secure">Pago procesado de forma segura por PayPhone.</p>
        </div>
      </div>
      <div class="offer__bumps">
        <article><span>+ $10</span><div><small>ORDER BUMP</small><strong>Recetario Secreto de Scarlett</strong><p>Comidas deliciosas, altas en proteína y bajas en calorías.</p></div></article>
      </div>
    </div>
    <CheckoutModal :open="checkoutOpen" @close="checkoutOpen = false" />
  </section>
</template>

<style lang="scss" scoped>
.offer { background: $primary; }
.offer__inner { flex-direction: column; gap: 2rem; }
.offer__heading { display: flex; flex-direction: column; align-items: center; width: 100%; gap: 0.8rem; color: $white; text-align: center; }
.offer__heading h2 { color: $white; font-size: clamp(3rem, 7vw, 5.8rem); text-transform: uppercase; }
.offer__heading > p:last-child { color: rgba($white, 0.74); }
.offer__card { display: flex; width: 100%; max-width: 61rem; overflow: hidden; border-radius: 1.2rem; background: $primary-surface; box-shadow: 0 2rem 5rem rgba($primary-dark, 0.25); }
.offer__portrait { position: relative; display: flex; flex: 0 1 22rem; width: 100%; min-height: 36rem; overflow: hidden; background: $primary-light; }
.offer__portrait img { width: 100%; height: 100%; object-fit: cover; }
.offer__portrait span { position: absolute; right: 0; bottom: 0; left: 0; padding: 0.8rem; background: $secondary; color: $primary-dark; font-size: 0.72rem; font-weight: 900; letter-spacing: 0.1em; text-align: center; }
.offer__content { display: flex; flex: 1 1 0; flex-direction: column; align-items: flex-start; width: 100%; gap: 1rem; padding: clamp(1.5rem, 5vw, 3.5rem); }
.offer__tag { color: $primary; font-size: 0.72rem; font-weight: 900; letter-spacing: 0.14em; }
.offer__content h3 { width: 100%; color: $primary-dark; font-size: clamp(2rem, 5vw, 3.4rem); line-height: 0.98; letter-spacing: -0.05em; text-transform: uppercase; }
.offer__content ul { display: flex; flex-direction: column; width: 100%; gap: 0.55rem; list-style: none; }
.offer__content li { color: $text-secondary; }
.offer__content li::before { margin-right: 0.6rem; color: $primary; content: '✓'; font-weight: 900; }
.offer__price { display: flex; align-items: center; width: 100%; gap: 0.8rem; padding: 0.8rem 0; border-top: 1px solid rgba($primary-dark, 0.12); border-bottom: 1px solid rgba($primary-dark, 0.12); }
.offer__price small { font-weight: 900; }
.offer__price strong { color: $primary; font-size: 3.5rem; line-height: 1; }
.offer__price span { color: $text-secondary; font-size: 0.7rem; font-weight: 800; line-height: 1.25; }
.offer__content .primary-button { max-width: none; cursor: pointer; }
.offer__secure { width: 100%; color: $text-secondary; font-size: 0.78rem; text-align: center; }
.offer__bumps { display: flex; width: 100%; max-width: 61rem; gap: 1rem; }
.offer__bumps article { display: flex; flex: 1 1 0; width: 100%; gap: 1rem; padding: 1.1rem; border: 1px dashed rgba($white, 0.55); border-radius: 0.8rem; color: $white; }
.offer__bumps article > span { color: $secondary; font-weight: 900; white-space: nowrap; }
.offer__bumps article > div { display: flex; flex-direction: column; width: 100%; gap: 0.25rem; }
.offer__bumps small { color: rgba($white, 0.6); font-size: 0.66rem; letter-spacing: 0.1em; }
.offer__bumps p { color: rgba($white, 0.7); font-size: 0.82rem; line-height: 1.4; }
@media (max-width: 750px) { .offer__card, .offer__bumps { flex-direction: column; } .offer__portrait { flex-basis: auto; min-height: 28rem; } }
</style>
