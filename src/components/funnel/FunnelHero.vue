<script setup lang="ts">
import { funnelImages } from '@/config/funnelContent'
</script>

<template>
  <section class="hero">
    <div class="hero__glow"></div>
    <div class="hero__inner funnel-container">
      <div class="hero__copy">
        <p class="hero__brand">SCARLETT CORDOVA <span>01</span></p>
        <p class="hero__kicker">NUTRICIÓN + ENTRENAMIENTO + AMOR PROPIO</p>
        <h1>Quema grasa.<br><em>Construye músculo.</em></h1>
        <p class="hero__lead">El método científico y sin culpas para transformar tu cuerpo desde adentro hacia afuera.</p>
        <blockquote>“Este no es un libro de dietas extremas ni soluciones mágicas. Es el manual para entender tu cuerpo, dejar de tenerle miedo a la comida y lograr tu mejor versión.”</blockquote>
        <a class="primary-button" href="#oferta">QUIERO MI EBOOK POR $33 <span>↘</span></a>
        <small>Compra digital segura · Pago único</small>
      </div>
      <div class="hero__visual">
        <img :src="funnelImages.hero" alt="Scarlett Cordova entrenando con ropa deportiva DFYNE" width="700" height="980" fetchpriority="high">
        <div class="hero__stamp"><strong>33</strong><span>USD<br>PAGO ÚNICO</span></div>
        <p>FUERZA<br>CON CIENCIA</p>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.hero { position: relative; display: flex; justify-content: center; width: 100%; min-height: 100svh; overflow: hidden; background: $primary-dark; }
.hero::before { position: absolute; inset: 0; background: repeating-linear-gradient(90deg, transparent 0, transparent calc(20% - 1px), rgba($white, 0.045) 20%); content: ''; pointer-events: none; }
.hero__glow { position: absolute; top: -20rem; left: 15%; width: 45rem; height: 45rem; border-radius: 50%; background: rgba($primary, 0.16); filter: blur(100px); }
.hero__inner { position: relative; flex-direction: row; gap: clamp(2rem, 6vw, 6rem); padding-top: 3rem; padding-bottom: 3rem; }
.hero__copy { display: flex; flex: 1 1 0; flex-direction: column; align-items: flex-start; width: 100%; max-width: 42rem; gap: 1.2rem; color: $white; }
.hero__brand { display: flex; justify-content: space-between; width: 100%; color: rgba($white, 0.72); font-size: 0.75rem; font-weight: 800; letter-spacing: 0.2em; }
.hero__brand span, .hero__kicker { color: $secondary; }
.hero__kicker { font-size: 0.72rem; font-weight: 900; letter-spacing: 0.14em; }
h1 { width: 100%; max-width: 48rem; font-size: clamp(3.2rem, 7vw, 6.6rem); line-height: 0.86; letter-spacing: -0.075em; text-transform: uppercase; }
h1 em { color: $primary; font-style: normal; }
.hero__lead { width: 100%; max-width: 36rem; font-size: clamp(1.15rem, 2.2vw, 1.5rem); font-weight: 650; line-height: 1.45; }
blockquote { width: 100%; max-width: 36rem; padding-left: 1rem; border-left: 2px solid $primary; color: rgba($white, 0.62); font-size: 0.94rem; line-height: 1.6; }
.hero__copy small { width: 100%; max-width: 25rem; color: rgba($white, 0.5); text-align: center; }
.hero__visual { position: relative; display: flex; flex: 0 1 31rem; align-self: stretch; width: 100%; min-height: 42rem; overflow: hidden; border-radius: 10rem 10rem 1rem 1rem; background: #292724; }
.hero__visual img { width: 100%; height: 100%; object-fit: cover; object-position: 50% 44%; filter: contrast(1.04) saturate(0.9); }
.hero__visual::after { position: absolute; inset: 0; background: linear-gradient(180deg, transparent 55%, rgba($primary-dark, 0.88)); content: ''; }
.hero__stamp { position: absolute; top: 1.2rem; right: 1rem; z-index: 1; display: flex; justify-content: center; align-items: center; width: 8rem; height: 8rem; gap: 0.35rem; border-radius: 50%; background: $secondary; color: $primary-dark; transform: rotate(7deg); }
.hero__stamp strong { font-size: 2.8rem; line-height: 1; }
.hero__stamp span { font-size: 0.6rem; font-weight: 900; line-height: 1.25; }
.hero__visual > p { position: absolute; right: 1.4rem; bottom: 1.2rem; z-index: 1; color: $white; font-size: 1.4rem; font-weight: 900; line-height: 0.9; text-align: right; }
@media (max-width: 850px) { .hero__inner { flex-direction: column; padding-top: 2rem; } .hero__copy { align-items: center; text-align: center; } blockquote { border-right: 2px solid $primary; } .hero__visual { flex-basis: auto; max-width: 32rem; min-height: 38rem; } }
@media (max-width: 480px) { h1 { font-size: clamp(3rem, 15vw, 4.6rem); } .hero__visual { min-height: 32rem; border-radius: 7rem 7rem 1rem 1rem; } }
</style>
