<script setup lang="ts">
import { funnelImages } from '@/config/funnelContent'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<template>
  <main class="not-found">
    <div class="not-found__bg">
      <img :src="funnelImages.portrait" alt="Scarlett Cordova" />
    </div>
    <div class="not-found__content">
      <span class="not-found__code">404</span>
      <h1 class="not-found__title">Página no encontrada</h1>
      <p class="not-found__text">Parece que te perdiste, bebé. Esta página no existe o fue movida.</p>
      <button class="not-found__btn" @click="router.push('/')">Volver al inicio</button>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.not-found {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-height: 100vh;
  overflow: hidden;
  background: $primary-dark;
}
.not-found__bg {
  position: absolute;
  inset: 0;
  opacity: 0.15;
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
.not-found__content {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  text-align: center;
  z-index: 1;
}
.not-found__code {
  font-size: 6rem;
  font-weight: 900;
  color: $primary;
  line-height: 1;
  margin-bottom: 0.5rem;
}
.not-found__title {
  font-size: 1.5rem;
  font-weight: 700;
  color: $white;
  margin: 0 0 0.75rem;
}
.not-found__text {
  font-size: 0.95rem;
  color: rgba($white, 0.7);
  max-width: 28rem;
  margin: 0 0 2rem;
  line-height: 1.6;
}
.not-found__btn {
  display: inline-flex;
  align-items: center;
  padding: 0.85rem 2rem;
  border: none;
  border-radius: 999px;
  background: $primary;
  color: $white;
  font-size: 0.9rem;
  font-weight: 800;
  cursor: pointer;
  transition: opacity 0.2s;
  &:hover { opacity: 0.85; }
}
</style>
