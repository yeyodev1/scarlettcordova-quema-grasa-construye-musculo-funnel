const TESTING_FRONTEND_HOST = 'testing-storybrand-frontend.bakano.ec'

export type AppEnvironment = 'local' | 'testing' | 'production'

export function getAppEnvironment(hostname = window.location.hostname): AppEnvironment {
  if (hostname === 'localhost' || hostname === '127.0.0.1') return 'local'
  if (hostname === TESTING_FRONTEND_HOST) return 'testing'
  return 'production'
}

export function getFrontendBaseUrl(): string {
  const environment = getAppEnvironment()
  if (environment === 'local') return 'http://localhost:5173'
  if (environment === 'testing') return 'https://testing-storybrand-frontend.bakano.ec'
  return 'https://vital360.luisapitabejarano.com'
}

export function getPaymentResponseUrl(): string {
  return `${getFrontendBaseUrl()}/pay-response`
}

export function getApiBaseUrl(): string {
  const explicitUrl = import.meta.env.VITE_API_BASE_URL?.trim()
  if (explicitUrl) return explicitUrl

  const environment = getAppEnvironment()
  if (environment === 'local') return 'http://localhost:8101'
  if (environment === 'testing') return 'https://testing-storybrand-backapp.bakano.ec'
  return 'https://luisa-pita-bejarano-backapp.vercel.app'
}
