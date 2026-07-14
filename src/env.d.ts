/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_VIP_UPGRADE_PRICE?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface PayPhonePaymentConfig {
  token: string
  clientTransactionId: string
  amount: number
  amountWithoutTax: number
  currency: 'USD'
  storeId: string
  reference: string
  optionalParameter?: string
  responseUrl: string
  lang: 'es'
  defaultMethod: 'card'
  timeZone: number
}

interface Window {
  PPaymentButtonBox?: new (config: PayPhonePaymentConfig) => {
    render: (containerId: string) => void
  }
}
