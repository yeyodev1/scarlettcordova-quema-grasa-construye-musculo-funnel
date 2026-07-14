import APIBase from './httpBase'
import { getFrontendBaseUrl } from '@/config/environment'

interface ApiResponse<T> {
  data: T
  message: string
}

export interface PaymentBoxConfig {
  token: string
  storeId: string
  amount: number
  amountWithoutTax: number
  currency: 'USD'
  clientTransactionId: string
  reference: string
  responseUrl: string
}

export interface ConfirmPaymentResponse {
  status: 'approved' | 'canceled' | 'failed'
  transactionId?: number
  data?: {
    amount?: number
    message?: string | null
    messageCode?: number
    transactionStatus?: string
  }
  isNewUser?: boolean
  plainPassword?: string
  emailSent?: boolean
  email?: string
}

class PaymentService extends APIBase {
  async prepareBox(payload: {
    email: string
    name: string
    lastName: string
    plan: 'annual' | 'monthly'
    amount: number
    extras: string[]
  }) {
    return this.post<ApiResponse<PaymentBoxConfig>>('payments/prepare-box', {
      ...payload,
      origin: getFrontendBaseUrl(),
    })
  }

  async confirmPayment(id: string, clientTransactionId: string) {
    return this.get<ApiResponse<ConfirmPaymentResponse>>('payments/confirm', undefined, {
      params: { id, clientTransactionId },
    })
  }

  async resendWelcome(clientTransactionId: string) {
    return this.post<ApiResponse<{ email: string }>>('payments/resend-welcome-public', {
      clientTransactionId,
    })
  }
}

export const paymentService = new PaymentService()
