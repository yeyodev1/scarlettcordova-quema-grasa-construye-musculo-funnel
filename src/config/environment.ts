const TESTING_FRONTEND_HOST = 'testing-storybrand-frontend.bakano.ec'

export type AppEnvironment = 'local' | 'testing' | 'production'

export function getAppEnvironment(hostname = window.location.hostname): AppEnvironment {
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'local'
  if (hostname === TESTING_FRONTEND_HOST) return 'testing'
  return 'production'
}

export function getFrontendBaseUrl(): string {
  return window.location.origin
}

export function getPaymentResponseUrl(): string {
  return `${getFrontendBaseUrl()}/pay-response`
}

export function getApiBaseUrl(): string {
  const environment = getAppEnvironment()
  if (environment === 'local') return 'http://localhost:8101'
  if (environment === 'testing') return 'https://testing-storybrand-backapp.bakano.ec'
  return import.meta.env.VITE_API_BASE_URL?.trim() || window.location.origin
}
