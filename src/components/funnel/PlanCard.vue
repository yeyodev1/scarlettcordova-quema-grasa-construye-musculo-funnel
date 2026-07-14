<script setup lang="ts">
defineProps<{
  name: string
  price: number
  suffix: string
  description: string
  features: readonly string[]
  featured?: boolean
  badgeText?: string
  buttonText: string
}>()

const emit = defineEmits<{
  select: []
}>()
</script>

<template>
  <article class="plan" :class="{ 'plan--featured': featured }">
    <span v-if="featured" class="plan__badge">{{ badgeText || 'RECOMENDADO' }}</span>
    <p class="plan__name">{{ name }}</p>
    <div class="plan__price"><sup>$</sup><strong>{{ price }}</strong><span>{{ suffix }}</span></div>
    <p class="plan__description">{{ description }}</p>
    <div class="plan__features">
      <p v-for="feature in features" :key="feature"><span>✓</span>{{ feature }}</p>
    </div>
    <button type="button" class="plan__button" @click="emit('select')">{{ buttonText }} <span>→</span></button>
    <small>Revisa las condiciones del pago antes de confirmar.</small>
  </article>
</template>

<style lang="scss" scoped>
.plan {
  position: relative;
  display: flex;
  flex: 1 1 20rem;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 1.2rem;
  padding: clamp(1.6rem, 4vw, 2.5rem);
  border: 1px solid rgba($primary-dark, 0.1);
  border-radius: 1.3rem;
  background: $white;
  text-align: center;
  box-shadow: 0 18px 45px rgba($primary-dark, 0.07);
  transition: transform 0.3s ease, border-color 0.3s ease;
  &:hover { transform: translateY(-0.4rem); border-color: $primary; }
  &--featured { border: 0.18rem solid $primary; background: $primary-dark; color: $white; box-shadow: 0 24px 70px rgba($primary-dark, 0.24); }
  &__badge { width: 100%; padding: 0.55rem; border-radius: 0.45rem; background: $primary; color: $primary-dark; font-size: 0.68rem; font-weight: 900; letter-spacing: 0.08em; text-align: center; }
  &__name { width: 100%; color: $primary-dark; font-size: 1rem; font-weight: 900; letter-spacing: 0.08em; text-transform: uppercase; }
  &__price { display: flex; justify-content: center; align-items: flex-end; width: 100%; color: $primary-dark; }
  &__price sup { align-self: flex-start; padding-top: 0.7rem; color: $primary; font-size: 1.4rem; font-weight: 900; }
  &__price strong { font-size: clamp(3.7rem, 8vw, 5.4rem); line-height: 0.9; letter-spacing: -0.07em; }
  &__price span { padding: 0 0 0.4rem 0.5rem; color: $text-secondary; font-size: 0.8rem; }
  &__description { width: 100%; min-height: 3rem; color: $text-secondary; line-height: 1.55; }
  &__features { display: flex; flex-direction: column; width: 100%; gap: 0.75rem; padding: 1.2rem 0; border-top: 1px solid rgba($primary-dark, 0.09); }
  &__features p { display: flex; justify-content: center; width: 100%; gap: 0.6rem; color: $primary-dark; line-height: 1.45; text-align: left; }
  &__features span { color: $primary; font-weight: 900; }
  &__button { display: flex; justify-content: center; align-items: center; width: 100%; gap: 0.6rem; padding: 1rem; border: 0; border-radius: 0.6rem; background: $primary-dark; color: $white; font-weight: 900; cursor: pointer; transition: background 0.25s ease, transform 0.25s ease; }
  &__button:hover { transform: translateY(-0.15rem); background: $LPB-GREEN-D; }
  &--featured &__button { background: $primary; color: $primary-dark; }
  &--featured &__name, &--featured &__price, &--featured &__features p { color: $white; }
  &--featured &__description, &--featured small, &--featured &__price span { color: rgba($white, 0.68); }
  &--featured &__features { border-top-color: rgba($white, 0.12); }
  small { width: 100%; color: $text-secondary; font-size: 0.66rem; text-align: center; }
}
</style>
