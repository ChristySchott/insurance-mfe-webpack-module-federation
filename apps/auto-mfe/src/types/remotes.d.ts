declare module 'multicotadorHost/useCotacaoStore' {
  export interface CotacaoStore {
    currentStep: number
    setCurrentStep: (step: number) => void
    cpf: string
    productType: string | null
    setCpf: (cpf: string) => void
    setProductType: (type: string) => void
    step2Data: Record<string, unknown>
    step2IsValid: boolean
    setStep2Data: (data: Record<string, unknown>) => void
    setStep2IsValid: (valid: boolean) => void
    offers: unknown[]
    step3IsValid: boolean
    reset: () => void
  }

  export function useCotacaoStore(): CotacaoStore
}
