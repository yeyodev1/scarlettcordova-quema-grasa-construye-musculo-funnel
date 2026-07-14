<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'

const profiles = [
  { name: 'Valentina R.', city: 'Guayaquil' },
  { name: 'Camila M.', city: 'Samborondón' },
  { name: 'Sofía A.', city: 'Buenos Aires' },
  { name: 'Renata C.', city: 'Ciudad de México' },
  { name: 'Daniela P.', city: 'Quito' },
  { name: 'María José L.', city: 'Cuenca' },
  { name: 'Antonella G.', city: 'Guayaquil' },
  { name: 'Isabella V.', city: 'Samborondón' },
  { name: 'Carolina S.', city: 'Buenos Aires' },
  { name: 'Fernanda T.', city: 'Ciudad de México' },
  { name: 'Alejandra N.', city: 'Manta' },
  { name: 'Juliana B.', city: 'Medellín' },
  { name: 'Gabriela F.', city: 'Guayaquil' },
  { name: 'Paula D.', city: 'Samborondón' },
  { name: 'Martina E.', city: 'Buenos Aires' },
  { name: 'Regina H.', city: 'Ciudad de México' },
  { name: 'Natalia O.', city: 'Quito' },
  { name: 'Victoria J.', city: 'Cuenca' },
  { name: 'Luciana K.', city: 'Guayaquil' },
  { name: 'Emilia W.', city: 'Samborondón' },
  { name: 'Andrea Q.', city: 'Buenos Aires' },
  { name: 'Mariana I.', city: 'Ciudad de México' },
  { name: 'Catalina Z.', city: 'Bogotá' },
  { name: 'Elena U.', city: 'Lima' },
] as const

const currentIndex = ref(0)
const currentProfile = computed(() => profiles[currentIndex.value] ?? profiles[0])
let intervalId: ReturnType<typeof window.setInterval> | undefined
let order: number[] = []
let previousOrder = ''
let position = 0

const createOrder = () => {
  let nextOrder: number[]
  do {
    nextOrder = profiles.map((_, index) => index)
    for (let index = nextOrder.length - 1; index > 0; index -= 1) {
      const randomIndex = Math.floor(Math.random() * (index + 1))
      const currentValue = nextOrder[index]!
      nextOrder[index] = nextOrder[randomIndex]!
      nextOrder[randomIndex] = currentValue
    }
  } while (nextOrder.join(',') === previousOrder)

  if (nextOrder[0] === currentIndex.value) {
    const firstValue = nextOrder[0]!
    nextOrder[0] = nextOrder[1]!
    nextOrder[1] = firstValue
  }
  previousOrder = nextOrder.join(',')
  order = nextOrder
  position = 0
}

const showNextProfile = () => {
  if (position >= order.length) createOrder()
  currentIndex.value = order[position] ?? 0
  position += 1
}

onMounted(() => {
  createOrder()
  showNextProfile()
  intervalId = window.setInterval(() => {
    showNextProfile()
  }, 7000)
})

onUnmounted(() => {
  if (intervalId !== undefined) window.clearInterval(intervalId)
})
</script>

<template>
  <aside class="program-activity" aria-live="polite">
    <div class="program-activity__avatar">{{ currentProfile.name.charAt(0) }}</div>
    <div class="program-activity__copy">
      <small><span class="program-activity__pulse"></span> COMUNIDAD VITAL 360</small>
      <Transition name="activity" mode="out-in">
        <div :key="currentIndex" class="program-activity__profile">
          <strong>{{ currentProfile.name }}</strong>
          <span>{{ currentProfile.city }}</span>
        </div>
      </Transition>
    </div>
  </aside>
</template>

<style lang="scss" scoped>
.program-activity {
  position: fixed;
  bottom: 5.8rem;
  left: 1rem;
  z-index: 18;
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 28rem;
  gap: 1rem;
  padding: 1.15rem 1.25rem;
  border: 2px solid rgba($primary, 0.75);
  border-radius: 1rem;
  background: $primary-dark;
  color: $white;
  box-shadow: 0 18px 50px rgba($primary-dark, 0.4);
  backdrop-filter: blur(10px);
}

.program-activity__avatar {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-width: 3.75rem;
  height: 3.75rem;
  flex-shrink: 0;
  border-radius: 50%;
  background: $primary;
  color: $primary-dark;
  font-size: 1.55rem;
  font-weight: 900;
}

.program-activity__copy {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
  gap: 0.4rem;
  text-align: left;
}

.program-activity__copy > small { display: flex; align-items: center; width: 100%; gap: 0.4rem; color: $primary; font-size: 0.7rem; font-weight: 900; letter-spacing: 0.11em; }
.program-activity__pulse { display: flex; width: 100%; max-width: 0.45rem; height: 0.45rem; border-radius: 50%; background: $primary; box-shadow: 0 0 0 0 rgba($primary, 0.65); animation: pulse 2s infinite; }
.program-activity__profile { display: flex; align-items: baseline; width: 100%; gap: 0.65rem; }
.program-activity__profile strong { color: $white; font-size: 1.15rem; line-height: 1.2; }
.program-activity__profile span { color: rgba($white, 0.82); font-size: 0.88rem; font-weight: 600; }
.activity-enter-active, .activity-leave-active { transition: opacity 0.3s ease, transform 0.3s ease; }
.activity-enter-from { opacity: 0; transform: translateY(0.35rem); }
.activity-leave-to { opacity: 0; transform: translateY(-0.35rem); }

@keyframes pulse {
  70% { box-shadow: 0 0 0 0.55rem rgba($primary, 0); }
  100% { box-shadow: 0 0 0 0 rgba($primary, 0); }
}

@media (max-width: 600px) {
  .program-activity { bottom: 5.2rem; left: 0.5rem; max-width: calc(100% - 1rem); padding: 1rem; }
  .program-activity__avatar { max-width: 3.25rem; height: 3.25rem; }
  .program-activity__profile { flex-direction: column; gap: 0.1rem; }
}
</style>
