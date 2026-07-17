<script setup lang="ts">
import { ref } from 'vue'
import { faqItems } from '@/config/funnelContent'

const openIndex = ref(0)
</script>

<template>
  <section class="faq section-pad">
    <div class="faq__inner funnel-container">
      <div class="faq__heading"><p class="eyebrow"><span></span> ROMPIENDO MITOS</p><h2>Preguntas frecuentes.</h2><p class="section-lead">Ciencia clara para que dejes de pelear con la comida y empieces a trabajar con tu cuerpo.</p></div>
      <div class="faq__list"><article v-for="(item, index) in faqItems" :key="item.question" :class="{ open: openIndex === index }"><button type="button" :aria-expanded="openIndex === index" @click="openIndex = openIndex === index ? -1 : index"><span>0{{ index + 1 }}</span><strong>{{ item.question }}</strong><b>{{ openIndex === index ? '−' : '+' }}</b></button><div><p>{{ item.answer }}</p></div></article></div>
      <div class="faq__signature"><p>“Tu proceso es tuyo. Disfrútalo y cambia desde adentro.”</p><strong>Con amor, Scar.</strong><a href="#oferta" class="primary-button">QUIERO MI EBOOK POR $33 <span>↑</span></a></div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.faq { background: $primary-surface; }
.faq__inner { flex-direction: column; gap: 2.5rem; }
.faq__heading { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 48rem; gap: 0.8rem; text-align: center; }
.faq__list { display: flex; flex-direction: column; width: 100%; max-width: 54rem; }
.faq__list article { display: flex; flex-direction: column; width: 100%; border-bottom: 1px solid rgba($primary-dark, 0.14); }
.faq__list button { display: flex; align-items: center; width: 100%; gap: 1rem; padding: 1.2rem 0; border: 0; background: transparent; color: $primary-dark; font: inherit; text-align: left; cursor: pointer; }
.faq__list button span { color: $primary; font-size: 0.7rem; font-weight: 900; }
.faq__list button strong { width: 100%; }
.faq__list button b { color: $primary; font-size: 1.4rem; }
.faq__list article > div { max-height: 0; overflow: hidden; transition: max-height 0.3s ease; }
.faq__list article > div p { padding: 0 2rem 1.2rem; color: $text-secondary; line-height: 1.65; }
.faq__list article.open > div { max-height: 12rem; }
.faq__signature { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 54rem; gap: 0.7rem; padding: 2rem; border-radius: 1rem; background: $primary-dark; color: $white; text-align: center; }
.faq__signature p { font-size: clamp(1.3rem, 3vw, 2rem); font-weight: 800; }
.faq__signature > strong { color: $secondary; }
.faq__signature .primary-button { margin-top: 0.5rem; }
</style>
