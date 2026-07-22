import APIBase from './httpBase'
import { getFrontendBaseUrl } from '@/config/environment'

interface ApiResponse<T> {
  data: T
  message: string
}

export type CheckoutExtra = 'recipe_book'

export interface PaymentBoxConfig {
  token: string
  storeId: string
  amount: number
  amountWithoutTax: number
  currency: 'USD'
  clientTransactionId: string
  reference: string
  product: 'quema_grasa_construye_musculo'
  extras: CheckoutExtra[]
}

export interface ConfirmEbookPaymentResponse {
  status: 'pending' | 'approved' | 'failed' | 'canceled'
  product: 'quema_grasa_construye_musculo'
  productName: 'Quema Grasa, Construye Músculo'
  extras: CheckoutExtra[]
  amount: number
  amountCents: number
  currency: 'USD'
  clientTransactionId: string
  transactionId?: number
  email: string
  emailSent: boolean
  returnUrl?: string
  credentials?: {
    email: string
    password: string
  }
}

interface ResendCredentialsResponse {
  email: string
  password: string
}

class PaymentService extends APIBase {
  async prepareEbookPayment(payload: {
    email: string
    name: string
    lastName: string
    extras: CheckoutExtra[]
  }) {
    return this.post<ApiResponse<PaymentBoxConfig>>('payments/ebook/prepare-box', {
      ...payload,
      origin: getFrontendBaseUrl(),
    })
  }

  async confirmEbookPayment(id: string, clientTransactionId: string) {
    return this.post<ApiResponse<ConfirmEbookPaymentResponse>>('payments/ebook/confirm', {
      id,
      clientTransactionId,
    })
  }

  async resendCredentials(clientTransactionId: string, newEmail?: string) {
    return this.post<ApiResponse<ResendCredentialsResponse>>('payments/ebook/resend-credentials', {
      clientTransactionId,
      ...(newEmail ? { newEmail } : {}),
    })
  }
}

export const paymentService = new PaymentService()
