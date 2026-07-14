import { computed, onMounted, onUnmounted, ref } from 'vue'
import { shouldResetOfferState } from '@/config/environment'

const STORAGE_KEY = 'luisa_pita_annual_offer_expires_at'
const OFFER_DURATION = 2 * 60 * 60 * 1000
let initialized = false

export function useAnnualOfferCountdown() {
  const remaining = ref(0)
  let intervalId: ReturnType<typeof window.setInterval> | undefined

  const update = () => {
    const expiresAt = Number(localStorage.getItem(STORAGE_KEY))
    remaining.value = Number.isFinite(expiresAt) ? Math.max(0, expiresAt - Date.now()) : 0
  }

  onMounted(() => {
    let expiresAt = Number(localStorage.getItem(STORAGE_KEY))
    if (!initialized && shouldResetOfferState()) {
      expiresAt = Date.now() + OFFER_DURATION
      localStorage.setItem(STORAGE_KEY, String(expiresAt))
    } else if (!Number.isFinite(expiresAt) || expiresAt <= 0) {
      expiresAt = Date.now() + OFFER_DURATION
      localStorage.setItem(STORAGE_KEY, String(expiresAt))
    }
    initialized = true
    update()
    intervalId = window.setInterval(update, 1000)
  })

  onUnmounted(() => {
    if (intervalId !== undefined) window.clearInterval(intervalId)
  })

  const format = (value: number) => String(value).padStart(2, '0')
  const hours = computed(() => format(Math.floor(remaining.value / 3600000)))
  const minutes = computed(() => format(Math.floor((remaining.value % 3600000) / 60000)))
  const seconds = computed(() => format(Math.floor((remaining.value % 60000) / 1000)))

  return {
    hours,
    minutes,
    seconds,
    isActive: computed(() => remaining.value > 0),
  }
}
