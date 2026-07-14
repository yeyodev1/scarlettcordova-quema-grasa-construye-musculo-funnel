import { computed, onMounted, onUnmounted, ref } from 'vue'
import { shouldResetOfferState } from '@/config/environment'

const EXPIRES_KEY = 'luisa_pita_bonus_extension_expires_at'
const USED_KEY = 'luisa_pita_bonus_extension_count'
const EXTENSION_DURATION = 5 * 60 * 1000
const MAX_OPPORTUNITIES = 3
let initialized = false

export function useBonusExtensions() {
  const remaining = ref(0)
  const used = ref(0)
  let intervalId: ReturnType<typeof window.setInterval> | undefined

  const update = () => {
    const expiresAt = Number(localStorage.getItem(EXPIRES_KEY))
    remaining.value = Number.isFinite(expiresAt) ? Math.max(0, expiresAt - Date.now()) : 0
  }

  const unlock = () => {
    if (remaining.value > 0 || used.value >= MAX_OPPORTUNITIES) return
    used.value += 1
    localStorage.setItem(USED_KEY, String(used.value))
    localStorage.setItem(EXPIRES_KEY, String(Date.now() + EXTENSION_DURATION))
    update()
  }

  onMounted(() => {
    if (!initialized && shouldResetOfferState()) {
      localStorage.removeItem(EXPIRES_KEY)
      localStorage.removeItem(USED_KEY)
    }
    initialized = true
    sessionStorage.removeItem('luisa_pita_bonus_extension_expires_at')
    sessionStorage.removeItem('luisa_pita_bonus_extension_used')
    used.value = Math.min(Math.max(Number(localStorage.getItem(USED_KEY)) || 0, 0), MAX_OPPORTUNITIES)
    update()
    intervalId = window.setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (intervalId !== undefined) window.clearInterval(intervalId)
  })

  return {
    remaining,
    used,
    active: computed(() => remaining.value > 0),
    opportunitiesLeft: computed(() => MAX_OPPORTUNITIES - used.value),
    unlock,
  }
}
