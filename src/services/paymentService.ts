import APIBase from './httpBase'
import { getFrontendBaseUrl } from '@/config/environment'

interface ApiResponse<T> {
  data: T
  message: string
}

export type CheckoutPlan = 'monthly' | 'lifetime'
export type CheckoutExtra = 'crm' | 'telegram_vip'

export interface CheckoutSessionResponse {
  url: string
  sessionId: string
  clientTransactionId: string
}

export interface ConfirmPaymentResponse {
  status: 'pending' | 'approved' | 'failed' | 'canceled'
  isNewUser?: boolean
  plainPassword?: string
  email?: string
  stripePaymentStatus?: string
  amount?: number
  currency?: 'USD'
  plan?: CheckoutPlan | 'annual'
}

class PaymentService extends APIBase {
  async createCheckoutSession(payload: {
    email: string
    name: string
    lastName: string
    plan: CheckoutPlan
    extras: CheckoutExtra[]
  }) {
    return this.post<ApiResponse<CheckoutSessionResponse>>('stripe/funnel/create-session', {
      ...payload,
      origin: getFrontendBaseUrl(),
    })
  }

  async verifyPayment(sessionId: string) {
    return this.get<ApiResponse<ConfirmPaymentResponse>>(`stripe/verify/${encodeURIComponent(sessionId)}`)
  }

  async resendWelcomeEmail(sessionId: string) {
    return this.post<ApiResponse<{ resent: boolean; email: string }>>('stripe/resend-email', { sessionId })
  }
}

export const paymentService = new PaymentService()
