<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ step: number }>()
const emit = defineEmits<{ stay: []; continue: [] }>()

const messages = [
  {
    eyebrow: 'ANTES DE IRTE',
    title: '¿Segura que quieres dejar tus bonos?',
    text: 'Todavía puedes sumar el acompañamiento y las herramientas diseñadas para ayudarte a avanzar con más enfoque y constancia.',
    warning: 'Salir ahora inicia la renuncia definitiva a estos beneficios.',
    leave: 'SÍ, QUIERO CONTINUAR SIN LOS BONOS',
    quote: '“Entrenar 3 veces por semana ha cambiado mi vida. Hoy me siento súper tonificada, fuerte y en mi mejor momento físico. Hormonalmente me siento increíble y con una estabilidad emocional enorme.”',
    name: 'Irene Icaza',
    role: 'Independiente',
  },
  {
    eyebrow: 'PIÉNSALO UNA VEZ MÁS',
    title: 'No tienes que recorrer este proceso sola.',
    text: 'El Círculo VIP y el recetario pueden darte estructura, apoyo y opciones prácticas para sostener el cambio que hoy quieres comenzar.',
    warning: 'Si continúas, solo quedará una confirmación antes de perderlos.',
    leave: 'ENTIENDO, QUIERO RENUNCIAR A ELLOS',
    quote: '“Llevar las riendas de Fritega, viajar por trabajo y ser mamá de tres no es fácil, pero mi salud es prioridad. Entrenar me mantiene fuerte, regia y súper tonificada.”',
    name: 'Cristina Vargas',
    role: 'Empresaria y mamá de 3 hijos',
  },
  {
    eyebrow: 'ÚLTIMA CONFIRMACIÓN',
    title: 'Estás a punto de dejar tus bonos.',
    text: 'Al confirmar, los bonos desaparecerán de tu checkout. Solo podrás recuperarlos usando una de tus 3 oportunidades de 5 minutos.',
    warning: 'Cuando agotes las 3 oportunidades, los perderás definitivamente en este navegador.',
    leave: 'SÍ, CONTINUAR SIN MIS BONOS',
    quote: '“Ser mamá de cuatro y trabajar a tiempo completo no me impidió cambiar mi vida. ¡He bajado casi 40 libras! Hoy me siento más fuerte, activa y segura de mí misma.”',
    name: 'Blanka Zurita',
    role: 'Mamá de 4 hijos y trabajadora',
  },
] as const

const content = computed(() => messages[props.step - 1] ?? messages[2])
</script>

<template>
  <div class="checkout-exit">
    <span class="checkout-exit__step">CONFIRMACIÓN {{ step }} DE 3</span>
    <div class="checkout-exit__icon">!</div>
    <p class="checkout-exit__eyebrow">{{ content.eyebrow }}</p>
    <h2 id="checkout-title">{{ content.title }}</h2>
    <p class="checkout-exit__text">{{ content.text }}</p>
    <blockquote class="checkout-exit__proof"><span>HISTORIA REAL</span><p>{{ content.quote }}</p><footer><strong>{{ content.name }}</strong><small>{{ content.role }}</small></footer></blockquote>
    <strong class="checkout-exit__warning">{{ content.warning }}</strong>
    <button type="button" class="checkout-exit__stay" @click="emit('stay')">NO, QUIERO CONSERVAR MIS BONOS <span>→</span></button>
    <button type="button" class="checkout-exit__leave" @click="emit('continue')">{{ content.leave }}</button>
    <small>Tu selección actual se conserva si decides quedarte.</small>
  </div>
</template>

<style lang="scss" scoped>
.checkout-exit { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; min-height: 34rem; gap: 1rem; padding: clamp(1.5rem, 5vw, 3rem); text-align: center; }
.checkout-exit__step { width: auto; padding: 0.35rem 0.65rem; border-radius: 999px; background: $alert-error-bg; color: $alert-error; font-size: 0.62rem; font-weight: 900; letter-spacing: 0.1em; }
.checkout-exit__icon { display: flex; justify-content: center; align-items: center; width: 4rem; height: 4rem; border: 2px solid $alert-error; border-radius: 50%; background: $alert-error-bg; color: $alert-error; font-size: 2rem; font-weight: 900; }
.checkout-exit__eyebrow { width: 100%; color: $alert-error; font-size: 0.68rem; font-weight: 900; letter-spacing: 0.12em; }
.checkout-exit h2 { width: 100%; max-width: 35rem; font-size: clamp(2rem, 5vw, 3.2rem); }
.checkout-exit__text { width: 100%; max-width: 36rem; color: $text-secondary; line-height: 1.65; }
.checkout-exit__proof { display: flex; flex-direction: column; width: 100%; max-width: 36rem; gap: 0.45rem; padding: 0.85rem 1rem; border-left: 0.25rem solid $primary; border-radius: 0 0.6rem 0.6rem 0; background: $LPB-LIGHT; text-align: left; }
.checkout-exit__proof > span { width: 100%; color: $LPB-GREEN-D; font-size: 0.55rem; font-weight: 900; letter-spacing: 0.1em; }
.checkout-exit__proof > p { width: 100%; color: $primary-dark; font-size: 0.75rem; font-style: italic; line-height: 1.5; }
.checkout-exit__proof footer { display: flex; justify-content: space-between; align-items: baseline; width: 100%; gap: 0.75rem; }
.checkout-exit__proof footer strong { color: $primary-dark; font-size: 0.72rem; }
.checkout-exit__proof footer small { color: $text-secondary; font-size: 0.62rem; }
.checkout-exit__warning { width: 100%; max-width: 36rem; padding: 0.9rem; border-left: 0.25rem solid $alert-error; background: $alert-error-bg; color: $primary-dark; line-height: 1.5; }
.checkout-exit button { display: flex; justify-content: center; align-items: center; width: 100%; max-width: 32rem; padding: 1rem; border-radius: 0.65rem; font-weight: 900; cursor: pointer; }
.checkout-exit__stay { gap: 0.6rem; border: 0; background: $primary; color: $primary-dark; box-shadow: 0 0.7rem 1.5rem rgba($primary-dark, 0.16); }
.checkout-exit__leave { border: 1px solid rgba($alert-error, 0.4); background: transparent; color: $alert-error; font-size: 0.72rem; }
.checkout-exit small { width: 100%; color: $text-secondary; font-size: 0.65rem; }
</style>

<style>
.checkout-stage-enter-active, .checkout-stage-leave-active { transition: opacity 0.28s ease, transform 0.35s cubic-bezier(0.2, 0.85, 0.25, 1); }
.checkout-stage-enter-from { opacity: 0; transform: translateY(1.2rem) scale(0.97); }
.checkout-stage-leave-to { opacity: 0; transform: translateY(-0.7rem) scale(0.98); }
@media (prefers-reduced-motion: reduce) { .checkout-stage-enter-active, .checkout-stage-leave-active { transition: none; } }
</style>
