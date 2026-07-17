/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL?: string
  readonly VITE_META_PIXEL_ID?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

interface Window {
  PPaymentButtonBox?: new (config: Record<string, unknown>) => {
    render: (target: string) => void
    destroy?: () => void
  }
}
