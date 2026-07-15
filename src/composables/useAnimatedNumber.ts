import { onUnmounted, ref, watch } from 'vue'
import type { Ref } from 'vue'

export function useAnimatedNumber(source: Readonly<Ref<number>>) {
  const displayed = ref(source.value)
  let intervalId: ReturnType<typeof window.setInterval> | undefined

  watch(source, (next, _previous, onCleanup) => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      displayed.value = next
      return
    }
    if (intervalId !== undefined) window.clearInterval(intervalId)
    const direction = next > displayed.value ? 1 : -1
    const delay = Math.max(20, 500 / Math.abs(next - displayed.value))
    intervalId = window.setInterval(() => {
      displayed.value += direction
      if (displayed.value === next && intervalId !== undefined) window.clearInterval(intervalId)
    }, delay)
    onCleanup(() => intervalId !== undefined && window.clearInterval(intervalId))
  })

  onUnmounted(() => {
    if (intervalId !== undefined) window.clearInterval(intervalId)
  })

  return displayed
}
