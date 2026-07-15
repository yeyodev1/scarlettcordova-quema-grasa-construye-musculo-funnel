import { computed, onMounted, onUnmounted, ref } from 'vue'
import { shouldResetOfferState } from '@/config/environment'

const EXPIRES_KEY = 'luisa_pita_bonus_extension_expires_at'
const USED_KEY = 'luisa_pita_bonus_extension_count'
const FORFEITED_KEY = 'luisa_pita_bonus_forfeited'
const EXTENSION_DURATION = 5 * 60 * 1000
const MAX_OPPORTUNITIES = 3
let initialized = false

export function useBonusExtensions() {
  const remaining = ref(0)
  const used = ref(0)
  const forfeited = ref(false)
  let intervalId: ReturnType<typeof window.setInterval> | undefined

  const update = () => {
    const expiresAt = Number(localStorage.getItem(EXPIRES_KEY))
    remaining.value = Number.isFinite(expiresAt) ? Math.max(0, expiresAt - Date.now()) : 0
  }

  const unlock = () => {
    if (forfeited.value || remaining.value > 0 || used.value >= MAX_OPPORTUNITIES) return
    used.value += 1
    localStorage.setItem(USED_KEY, String(used.value))
    localStorage.setItem(EXPIRES_KEY, String(Date.now() + EXTENSION_DURATION))
    update()
  }

  const forfeit = () => {
    forfeited.value = true
    remaining.value = 0
    localStorage.setItem(FORFEITED_KEY, 'true')
    localStorage.removeItem(EXPIRES_KEY)
    localStorage.setItem('luisa_pita_offer_expires_at', '1')
  }

  const recover = () => {
    if (used.value >= MAX_OPPORTUNITIES) return
    forfeited.value = false
    localStorage.removeItem(FORFEITED_KEY)
    unlock()
  }

  onMounted(() => {
    if (!initialized && shouldResetOfferState()) {
      localStorage.removeItem(EXPIRES_KEY)
      localStorage.removeItem(USED_KEY)
      localStorage.removeItem(FORFEITED_KEY)
    }
    initialized = true
    sessionStorage.removeItem('luisa_pita_bonus_extension_expires_at')
    sessionStorage.removeItem('luisa_pita_bonus_extension_used')
    used.value = Math.min(Math.max(Number(localStorage.getItem(USED_KEY)) || 0, 0), MAX_OPPORTUNITIES)
    forfeited.value = localStorage.getItem(FORFEITED_KEY) === 'true'
    update()
    intervalId = window.setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (intervalId !== undefined) window.clearInterval(intervalId)
  })

  return {
    remaining,
    used,
    forfeited,
    active: computed(() => remaining.value > 0),
    opportunitiesLeft: computed(() => MAX_OPPORTUNITIES - used.value),
    unlock,
    forfeit,
    recover,
  }
}
