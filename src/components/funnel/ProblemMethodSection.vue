<script setup lang="ts">
import { funnelImages, storyMilestones } from '@/config/funnelContent'
</script>

<template>
  <section class="story section-pad">
    <div class="story__inner funnel-container">
      <div class="story__visual">
        <img :src="funnelImages.story" alt="Scarlett Cordova de espalda con ropa deportiva DFYNE" width="700" height="1050" loading="lazy">
        <span>NO MÁS<br>CASTIGO</span>
      </div>
      <div class="story__copy">
        <p class="eyebrow"><span></span> MI HISTORIA</p>
        <h2>Del castigo<br><em>a la conexión.</em></h2>
        <p class="story__lead">Durante años, a muchas nos enseñaron a mirar nuestro cuerpo desde el rechazo. Buscando estándares inalcanzables, caemos en el ciclo de dietas extremas, comparaciones y castigos en el gimnasio.</p>
        <p class="story__label">YO ESTUVE AHÍ:</p>
        <div class="story__timeline">
          <article v-for="(milestone, index) in storyMilestones" :key="milestone"><b>0{{ index + 1 }}</b><p>{{ milestone }}</p></article>
        </div>
        <p class="story__close">Un día decidí parar la pelea con mi reflejo y empezar a entenderlo. La clave no era sufrir, sino aplicar la ciencia con un déficit calórico estratégico y sostenible.</p>
        <strong>Este ebook resume todo lo que me hubiese encantado saber antes.</strong>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.story { background: $primary-surface; }
.story__inner { align-items: stretch; gap: clamp(2.5rem, 7vw, 7rem); }
.story__visual, .story__copy { display: flex; flex: 1 1 0; flex-direction: column; width: 100%; }
.story__visual { position: relative; max-width: 31rem; min-height: 43rem; overflow: hidden; border-radius: 1rem; background: $primary-light; }
.story__visual img { width: 100%; height: 100%; object-fit: cover; }
.story__visual span { position: absolute; bottom: 1.3rem; left: 1.3rem; padding: 0.8rem 1rem; background: $primary; color: $white; font-size: 1.3rem; font-weight: 900; line-height: 0.9; transform: rotate(-3deg); }
.story__copy { justify-content: center; align-items: flex-start; gap: 1.15rem; }
.story .eyebrow { justify-content: flex-start; text-align: left; }
h2 { text-align: left; text-transform: uppercase; }
h2 em { color: $primary; font-style: normal; }
.story__lead, .story__close { color: $text-secondary; font-size: 1rem; line-height: 1.7; }
.story__label { color: $primary-dark; font-size: 0.76rem; font-weight: 900; letter-spacing: 0.14em; }
.story__timeline { display: flex; flex-direction: column; width: 100%; gap: 0.7rem; }
.story__timeline article { display: flex; align-items: center; width: 100%; gap: 1rem; padding: 0.8rem 0; border-bottom: 1px solid rgba($primary-dark, 0.12); }
.story__timeline b { color: $primary; font-size: 1.15rem; }
.story__timeline p { color: $primary-dark; line-height: 1.5; }
.story__copy > strong { width: 100%; padding: 1rem; border-left: 3px solid $secondary; background: $primary-dark; color: $white; line-height: 1.45; }
@media (max-width: 800px) { .story__inner { flex-direction: column; } .story__visual { max-width: none; min-height: 34rem; } }
</style>
