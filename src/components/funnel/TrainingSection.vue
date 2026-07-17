<script setup lang="ts">
import { funnelImages, trainingDays } from '@/config/funnelContent'
</script>

<template>
  <section class="training section-pad">
    <div class="training__inner funnel-container">
      <div class="training__copy">
        <p class="eyebrow"><span></span> TU RUTA SEMANAL</p>
        <h2>Entrena con inteligencia.<br><em>No solo con esfuerzo.</em></h2>
        <p class="section-lead">Cinco sesiones diseñadas para estimular tus músculos de verdad, maximizar la pérdida de grasa y conservar tu masa muscular.</p>
        <div class="training__days"><article v-for="item in trainingDays" :key="item.day"><b>{{ item.day }}</b><span>{{ item.focus }}</span></article></div>
        <a href="#oferta" class="primary-button">QUIERO EL PLAN COMPLETO <span>↓</span></a>
      </div>
      <div class="training__visual"><img :src="funnelImages.training" alt="Scarlett Cordova con ropa deportiva DFYNE" width="700" height="1000" loading="lazy"><div><small>LUN → VIE</small><strong>FUERZA<br>QUE SE NOTA</strong></div></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.training { background: $primary-light; }
.training__inner { align-items: stretch; gap: clamp(2rem, 7vw, 7rem); }
.training__copy, .training__visual { display: flex; flex: 1 1 0; flex-direction: column; width: 100%; }
.training__copy { justify-content: center; align-items: flex-start; gap: 1.2rem; }
.training .eyebrow { justify-content: flex-start; text-align: left; }
.training h2, .training .section-lead { text-align: left; }
.training h2 { text-transform: uppercase; }
.training h2 em { color: $primary; font-style: normal; }
.training__days { display: flex; flex-direction: column; width: 100%; }
.training__days article { display: flex; align-items: center; width: 100%; gap: 1rem; padding: 0.9rem 0; border-bottom: 1px solid rgba($primary-dark, 0.14); }
.training__days b { display: flex; justify-content: center; align-items: center; width: 3rem; height: 2rem; flex-shrink: 0; border-radius: 999px; background: $primary-dark; color: $secondary; font-size: 0.7rem; }
.training__days span { color: $primary-dark; font-weight: 700; }
.training__visual { position: relative; max-width: 31rem; min-height: 44rem; overflow: hidden; border-radius: 1rem; background: $white; }
.training__visual img { width: 100%; height: 100%; object-fit: cover; object-position: center 60%; }
.training__visual > div { position: absolute; right: 1rem; bottom: 1rem; left: 1rem; display: flex; justify-content: space-between; align-items: flex-end; padding: 1rem; background: rgba($primary-dark, 0.9); color: $white; }
.training__visual small { color: $secondary; font-weight: 900; }
.training__visual strong { font-size: 1.4rem; line-height: 0.9; text-align: right; }
@media (max-width: 800px) { .training__inner { flex-direction: column-reverse; } .training__visual { max-width: none; min-height: 35rem; } }
</style>
