export interface Coverage {
  name: string
  value: number
}

export interface CotacaoState {
  currentStep: number
  cpf: string
  productType: string | null
  step2Data: Record<string, unknown>
  step2IsValid: boolean
  step3IsValid: boolean
}

export interface CotacaoActions {
  setCurrentStep: (step: number) => void
  setCpf: (cpf: string) => void
  setProductType: (type: string) => void
  setStep2Data: (data: Record<string, unknown>) => void
  setStep2IsValid: (valid: boolean) => void
  reset: (values?: Partial<CotacaoState>) => void
}

export interface CotacaoStore extends CotacaoState, CotacaoActions {}
