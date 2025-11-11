declare module 'multicotadorHost/useCotacaoStore' {
  interface CotacaoState {
    currentStep: number
    isCurrentStepValid: boolean
    cpf: string
    productType: string | null
    productData: Record<string, unknown>
  }

  type ProductData = Record<string, unknown>

  export type ProductDataUpdater =
    | ProductData
    | ((prev: ProductData) => ProductData)

  interface CotacaoActions {
    setCurrentStep: (step: number) => void
    setCpf: (cpf: string) => void
    setProductType: (type: string) => void
    setProductData: (data: ProductDataUpdater) => void
    setIsCurrentStepValid: (valid: boolean) => void
    reset: (values?: Partial<CotacaoState>) => void
  }

  interface CotacaoStore extends CotacaoState, CotacaoActions {}

  export function useCotacaoStore(): CotacaoStore
}
