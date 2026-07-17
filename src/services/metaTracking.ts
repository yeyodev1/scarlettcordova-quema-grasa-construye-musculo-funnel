type MetaEventName = 'PageView' | 'AddToCart' | 'Purchase'
type MetaPixel = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void
  queue: unknown[][]
  loaded: boolean
  version: string
  push: MetaPixel
}

declare global {
  interface Window {
    fbq?: MetaPixel
    _fbq?: MetaPixel
  }
}

const pixelId = import.meta.env.VITE_META_PIXEL_ID
let initialized = false

function initializePixel() {
  if (initialized || !pixelId) return
  initialized = true
  const fbq = ((...args: unknown[]) => fbq.callMethod ? fbq.callMethod(...args) : fbq.queue.push(args)) as MetaPixel
  fbq.queue = []
  fbq.loaded = true
  fbq.version = '2.0'
  fbq.push = fbq
  window.fbq = fbq
  window._fbq = fbq
  const script = document.createElement('script')
  script.async = true
  script.src = 'https://connect.facebook.net/en_US/fbevents.js'
  document.head.appendChild(script)
  fbq('init', pixelId)
}

function track(eventName: MetaEventName, data?: Record<string, unknown>, eventId?: string) {
  initializePixel()
  window.fbq?.('track', eventName, data || {}, eventId ? { eventID: eventId } : undefined)
}

export const trackMetaPageView = () => track('PageView')

export function trackMetaAddToCart() {
  track('AddToCart', {
    currency: 'USD',
    value: 33,
    content_ids: ['quema_grasa_construye_musculo'],
    content_type: 'product',
  })
}

export function trackMetaPurchase(clientTransactionId: string, value: number) {
  track('Purchase', {
    currency: 'USD',
    value,
    content_ids: ['quema_grasa_construye_musculo'],
    content_type: 'product',
  }, `purchase_${clientTransactionId}`)
}
