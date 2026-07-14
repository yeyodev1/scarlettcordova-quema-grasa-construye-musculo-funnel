<script setup lang="ts">
import { computed } from 'vue'
import { useCountdown } from '@/composables/useCountdown'
import { useAnnualOfferCountdown } from '@/composables/useAnnualOfferCountdown'

const { price } = useCountdown()
const { isActive: annualOfferActive } = useAnnualOfferCountdown()
const vipUpgradePrice = Number(import.meta.env.VITE_VIP_UPGRADE_PRICE) || 15
const regularAnnualValue = 400
const annualPrice = computed(() => annualOfferActive.value ? 297 : regularAnnualValue)
const annualSavings = computed(() => regularAnnualValue - annualPrice.value)

const valueItems = [
  { number: '01', title: 'Plan anual de entrenamiento', text: 'Programación funcional progresiva para avanzar mes a mes.', value: 197 },
  { number: '02', title: 'Guías de nutrición', text: 'Orientación para alimentarte antes y después de entrenar.', value: 97 },
  { number: '03', title: 'Sesiones en vivo', text: 'Entrenamientos y espacios grupales guiados por Luisa.', value: 147 },
  { number: '04', title: 'Comunidad Vital 360', text: 'Acompañamiento para compartir avances y mantenerte enfocada.', value: 97 },
  { number: '05', title: 'Retos de transformación', text: 'Desafíos periódicos para renovar tu motivación y constancia.', value: 67 },
  { number: '06', title: 'Biblioteca funcional', text: 'Sesiones organizadas por objetivo, intensidad y nivel.', value: 97 },
  { number: '07', title: 'Calendario de progreso', text: 'Una ruta clara para registrar hábitos, sesiones y avances.', value: 47 },
  { number: '08', title: 'Actualizaciones anuales', text: 'Nuevas rutinas, recursos y contenidos durante tu acceso.', value: 47 },
] as const

const totalStackValue = valueItems.reduce((total, item) => total + item.value, 0)

const vipFeatures = [
  { number: '01', title: 'Comunidad con intención', text: 'Conecta con mujeres que comparten tu compromiso y celebran cada avance contigo.' },
  { number: '02', title: 'Encuentro mensual con Luisa', text: 'Un espacio VIP para reforzar tu enfoque, resolver bloqueos y seguir avanzando.' },
  { number: '03', title: 'Retos y objetivos medibles', text: 'Convierte tus metas en acciones concretas que puedas sostener y reconocer.' },
  { number: '04', title: 'Acompañamiento prioritario', text: 'Comparte tus dudas dentro del círculo y recibe orientación con mayor cercanía.' },
] as const
</script>

<template>
  <section class="value-stack section-pad">
    <div class="funnel-container value-stack__inner">
      <div class="value-stack__heading">
        <p class="eyebrow"><span></span> 8 ENTREGABLES DENTRO DE VITAL 360</p>
        <h2>Esto es exactamente lo que recibes al entrar.</h2>
        <p class="section-lead">Ocho recursos que reúnen entrenamiento, nutrición, seguimiento y comunidad para sostener tu proceso.</p>
      </div>

      <div class="value-stack__items">
        <article v-for="item in valueItems" :key="item.number" class="value-stack__item">
          <span>{{ item.number }}</span>
          <h3>{{ item.title }}</h3>
          <p>{{ item.text }}</p>
          <div class="value-stack__item-value"><small>VALOR</small><strong>${{ item.value }}</strong></div>
        </article>
      </div>

      <div class="value-stack__summary">
        <p>VALOR REFERENCIAL POR SEPARADO</p>
        <del>${{ totalStackValue }}</del>
        <span class="value-stack__regular">Precio regular del programa anual: ${{ regularAnnualValue }}</span>
        <div class="value-stack__prices">
          <span class="value-stack__recommended"><small>EMPIEZA HOY · LOW TICKET</small><strong>${{ price }}/mes</strong></span>
          <b>O</b>
          <span><small>{{ annualOfferActive ? 'OFERTA ANUAL · 2 HORAS' : 'PRECIO ANUAL REGULAR' }}</small><strong>${{ annualPrice }}</strong></span>
        </div>
        <p v-if="annualOfferActive" class="value-stack__saving">Durante 2 horas ahorras ${{ annualSavings }}: pagas $297 en lugar del precio normal de $400.</p>
      </div>

      <div class="vip-upgrade">
        <div class="vip-upgrade__copy">
          <p class="eyebrow eyebrow--light"><span></span> UPGRADE EXCLUSIVO</p>
          <h2>Círculo VIP de Mujeres Vitales</h2>
          <p>Un espacio íntimo de acompañamiento para mujeres que decidieron dejar de postergarse y avanzar con más enfoque, constancia y confianza.</p>
          <div class="vip-upgrade__features">
            <article v-for="feature in vipFeatures" :key="feature.number">
              <span>{{ feature.number }}</span>
              <div><strong>{{ feature.title }}</strong><p>{{ feature.text }}</p></div>
            </article>
          </div>
        </div>
        <div class="vip-upgrade__offer">
          <span>AGREGA EL NIVEL VIP POR</span>
          <div><sup>+$</sup><strong>{{ vipUpgradePrice }}</strong><small>pago único</small></div>
          <p>Disponible como bono al seleccionar la membresía mensual de Vital 360.</p>
          <a href="#oferta">ELEGIR MI MEMBRESÍA <span>→</span></a>
          <small>El plan anual de ${{ annualPrice }} ya incluye este beneficio.</small>
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.value-stack {
  background: $white;

  &__inner { flex-direction: column; justify-content: center; align-items: center; gap: 2.5rem; }
  &__heading { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 54rem; gap: 1rem; text-align: center; }
  &__items { display: flex; justify-content: center; align-items: stretch; flex-wrap: wrap; width: 100%; gap: 1rem; }
  &__item { display: flex; flex: 1 1 15rem; flex-direction: column; align-items: center; width: 100%; gap: 0.8rem; padding: 1.5rem; border: 1px solid rgba($primary-dark, 0.1); border-radius: 1rem; background: $LPB-SURFACE; text-align: center; transition: transform 0.25s ease, border-color 0.25s ease; }
  &__item:hover { transform: translateY(-0.35rem); border-color: $primary; }
  &__item > span { width: 100%; color: $primary; font-size: 0.75rem; font-weight: 900; letter-spacing: 0.1em; }
  &__item h3 { width: 100%; color: $primary-dark; font-size: 1.15rem; }
  &__item p { width: 100%; color: $text-secondary; line-height: 1.55; }
  &__item-value { display: flex; justify-content: center; align-items: center; width: 100%; gap: 0.45rem; margin-top: auto; padding-top: 0.8rem; border-top: 1px solid rgba($primary-dark, 0.08); }
  &__item-value small { color: $text-secondary; font-size: 0.6rem; font-weight: 800; letter-spacing: 0.1em; }
  &__item-value strong { color: $LPB-GREEN-D; font-size: 1.25rem; }
  &__summary { display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%; gap: 0.8rem; padding: clamp(1.5rem, 4vw, 2.5rem); border-radius: 1.2rem; background: $primary-dark; color: $white; text-align: center; }
  &__summary > p:first-child { width: 100%; color: $primary; font-size: 0.72rem; font-weight: 900; letter-spacing: 0.12em; }
  &__summary > del { width: 100%; color: rgba($white, 0.55); font-size: 1.4rem; font-weight: 800; }
  &__regular { width: 100%; color: rgba($white, 0.72); font-size: 0.82rem; }
  &__prices { display: flex; justify-content: center; align-items: center; width: 100%; gap: clamp(1rem, 4vw, 3rem); }
  &__prices > span { display: flex; flex-direction: column; align-items: center; width: 100%; max-width: 16rem; }
  &__recommended { padding: 0.75rem; border: 1px solid $primary; border-radius: 0.7rem; background: rgba($primary, 0.08); }
  &__prices small { width: 100%; color: rgba($white, 0.55); font-size: 0.62rem; }
  &__prices strong { width: 100%; color: $primary; font-size: clamp(2rem, 6vw, 3.5rem); }
  &__prices b { color: rgba($white, 0.45); font-size: 0.75rem; }
  &__saving { width: 100%; color: rgba($white, 0.72); font-size: 0.8rem; }
}

.vip-upgrade {
  display: flex;
  justify-content: center;
  align-items: stretch;
  width: 100%;
  overflow: hidden;
  border-radius: 1.3rem;
  background: $LPB-GREEN-D;
  color: $white;

  &__copy, &__offer { display: flex; flex: 1 1 0; flex-direction: column; align-items: center; width: 100%; gap: 1rem; padding: clamp(1.5rem, 5vw, 3rem); text-align: center; }
  &__copy { align-items: flex-start; text-align: left; }
  &__copy h2 { width: 100%; color: $white; }
  &__copy > p:not(.eyebrow) { width: 100%; color: rgba($white, 0.75); line-height: 1.65; }
  &__features { display: flex; align-items: stretch; flex-wrap: wrap; width: 100%; gap: 0.7rem; }
  &__features article { display: flex; flex: 1 1 14rem; align-items: flex-start; width: 100%; gap: 0.75rem; padding: 1rem; border: 1px solid rgba($white, 0.14); border-radius: 0.75rem; background: rgba($primary-dark, 0.12); }
  &__features article > span { display: flex; justify-content: center; align-items: center; width: 100%; max-width: 2rem; height: 2rem; flex-shrink: 0; border: 1px solid rgba($primary, 0.45); border-radius: 50%; color: $primary; font-size: 0.62rem; font-weight: 900; }
  &__features article > div { display: flex; flex-direction: column; width: 100%; gap: 0.3rem; }
  &__features strong { width: 100%; color: $white; font-size: 0.86rem; }
  &__features article p { width: 100%; color: rgba($white, 0.65); font-size: 0.75rem; line-height: 1.5; }
  &__offer { justify-content: center; background: $LPB-LIGHT; color: $primary-dark; }
  &__offer > span { width: 100%; color: $LPB-GREEN-D; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.1em; }
  &__offer > div { display: flex; justify-content: center; align-items: flex-end; width: 100%; }
  &__offer sup { align-self: flex-start; padding-top: 0.7rem; color: $LPB-GREEN-D; font-size: 1.4rem; font-weight: 900; }
  &__offer strong { font-size: clamp(4rem, 10vw, 6rem); line-height: 0.9; letter-spacing: -0.08em; }
  &__offer small { color: $text-secondary; }
  &__offer > p { width: 100%; color: $text-secondary; }
  &__offer a { display: flex; justify-content: center; align-items: center; width: 100%; max-width: 22rem; gap: 0.6rem; padding: 1rem; border-radius: 0.6rem; background: $primary-dark; color: $white; font-weight: 900; text-decoration: none; transition: background 0.25s ease, transform 0.25s ease; }
  &__offer a:hover { transform: translateY(-0.2rem); background: $LPB-GREEN-D; }
  &__offer > small { width: 100%; font-size: 0.65rem; }
}

@media (max-width: 760px) {
  .value-stack__prices, .vip-upgrade { flex-direction: column; }
  .value-stack__prices { gap: 0.5rem; }
}
</style>
