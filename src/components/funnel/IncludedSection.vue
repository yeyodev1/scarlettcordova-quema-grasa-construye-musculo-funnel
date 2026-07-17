<script setup lang="ts">
import { funnelImages, learningItems, macroTargets } from '@/config/funnelContent'
</script>

<template>
  <section class="learning section-pad">
    <div class="learning__inner funnel-container">
      <div class="learning__heading">
        <p class="eyebrow eyebrow--light"><span></span> DENTRO DEL EBOOK</p>
        <h2>Domina tu proceso.<br><em>Sin improvisar.</em></h2>
        <p>Nutrición, hábitos y entrenamiento explicados para que entiendas qué hacer y, sobre todo, por qué funciona.</p>
      </div>
      <div class="learning__body">
        <div class="learning__visual"><img :src="funnelImages.learning" alt="Scarlett Cordova en el gimnasio" width="650" height="950" loading="lazy"><span>GUÍA PASO A PASO</span></div>
        <div class="learning__list"><article v-for="item in learningItems" :key="item.number"><b>{{ item.number }}</b><div><h3>{{ item.title }}</h3><p>{{ item.text }}</p></div></article></div>
      </div>
      <div class="macros">
        <div><small>TU FÓRMULA</small><strong>Macros sin misterio.</strong></div>
        <article v-for="macro in macroTargets" :key="macro.label"><span>{{ macro.label }}</span><b>{{ macro.value }}</b><small>{{ macro.detail }}</small></article>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.learning { background: $primary-dark; color: $white; }
.learning__inner { flex-direction: column; gap: 3rem; }
.learning__heading { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 58rem; gap: 1rem; text-align: center; }
.learning h2 { color: $white; text-transform: uppercase; }
.learning h2 em { color: $primary; font-style: normal; }
.learning__heading > p:last-child { max-width: 43rem; color: rgba($white, 0.62); line-height: 1.65; }
.learning__body { display: flex; align-items: stretch; width: 100%; gap: clamp(1.5rem, 5vw, 4rem); }
.learning__visual { position: relative; display: flex; flex: 0 1 25rem; width: 100%; min-height: 38rem; overflow: hidden; border-radius: 12rem 12rem 1rem 1rem; }
.learning__visual img { width: 100%; height: 100%; object-fit: cover; }
.learning__visual span { position: absolute; right: 1rem; bottom: 1rem; left: 1rem; padding: 0.8rem; border-radius: 999px; background: $secondary; color: $primary-dark; font-size: 0.72rem; font-weight: 900; letter-spacing: 0.12em; text-align: center; }
.learning__list { display: flex; flex: 1 1 0; flex-direction: column; width: 100%; }
.learning__list article { display: flex; width: 100%; gap: 1rem; padding: 1.15rem 0; border-bottom: 1px solid rgba($white, 0.12); }
.learning__list article > b { color: $primary; font-size: 0.8rem; }
.learning__list article > div { display: flex; flex-direction: column; width: 100%; gap: 0.35rem; }
.learning__list h3 { font-size: 1.25rem; text-transform: uppercase; }
.learning__list p { color: rgba($white, 0.58); line-height: 1.5; }
.macros { display: flex; align-items: stretch; width: 100%; overflow: hidden; border: 1px solid rgba($white, 0.14); border-radius: 1rem; }
.macros > div, .macros article { display: flex; flex: 1 1 0; flex-direction: column; justify-content: center; width: 100%; gap: 0.35rem; padding: 1.3rem; border-right: 1px solid rgba($white, 0.14); }
.macros > div { background: $primary; }
.macros > div small, .macros article span { font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em; text-transform: uppercase; }
.macros article span { color: $secondary; }
.macros article small { color: rgba($white, 0.5); }
@media (max-width: 800px) { .learning__body { flex-direction: column; } .learning__visual { flex-basis: auto; max-width: 28rem; min-height: 34rem; } .macros { flex-direction: column; } .macros > div, .macros article { border-right: 0; border-bottom: 1px solid rgba($white, 0.14); } }
</style>
