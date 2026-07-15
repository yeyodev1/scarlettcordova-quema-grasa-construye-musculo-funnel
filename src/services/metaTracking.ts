import APIBase from './httpBase'

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

class MetaTrackingApi extends APIBase {
  async track(eventName: 'PageView' | 'AddToCart', eventId: string, customData?: Record<string, unknown>) {
    return this.post('meta/events', {
      eventName,
      eventId,
      sourceUrl: window.location.href,
      fbp: readCookie('_fbp'),
      fbc: readCookie('_fbc'),
      customData,
    })
  }
}

const metaTrackingApi = new MetaTrackingApi()

function readCookie(name: string) {
  const prefix = `${name}=`
  return document.cookie.split(';').map((part) => part.trim()).find((part) => part.startsWith(prefix))?.slice(prefix.length)
}

function createEventId(eventName: MetaEventName) {
  return `${eventName.toLowerCase()}_${crypto.randomUUID()}`
}

function initializePixel() {
  if (initialized || !pixelId) return
  initialized = true

  const fbq = ((...args: unknown[]) => {
    if (fbq.callMethod) fbq.callMethod(...args)
    else fbq.queue.push(args)
  }) as MetaPixel
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

function trackBrowserEvent(eventName: MetaEventName, eventId: string, customData?: Record<string, unknown>) {
  initializePixel()
  window.fbq?.('track', eventName, customData || {}, { eventID: eventId })
}

function trackWithConversionsApi(eventName: 'PageView' | 'AddToCart', customData?: Record<string, unknown>) {
  const eventId = createEventId(eventName)
  trackBrowserEvent(eventName, eventId, customData)
  void metaTrackingApi.track(eventName, eventId, customData).catch(() => undefined)
}

export function trackMetaPageView() {
  trackWithConversionsApi('PageView')
}

export function trackMetaAddToCart(plan: 'monthly' | 'lifetime', value: number) {
  trackWithConversionsApi('AddToCart', {
    currency: 'USD',
    value,
    content_ids: [plan],
    content_type: 'product',
  })
}

export function trackMetaPurchase(sessionId: string, value: number, plan?: string) {
  trackBrowserEvent('Purchase', `purchase_${sessionId}`, {
    currency: 'USD',
    value,
    content_ids: plan ? [plan] : undefined,
    content_type: 'product',
  })
}
