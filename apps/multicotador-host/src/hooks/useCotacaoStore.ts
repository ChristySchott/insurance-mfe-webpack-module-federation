import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '@/store/cotacaoStore'
import {
  setCurrentStep,
  setCpf,
  setProductType,
  setProductData,
  setIsCurrentStepValid,
  reset,
} from '@/store/cotacaoStore'
import type { CotacaoStore, ProductDataUpdater } from '@/types/cotacao'

const useAppDispatch = useDispatch.withTypes<AppDispatch>()
const useAppSelector = useSelector.withTypes<RootState>()

export const useCotacaoStore = (): CotacaoStore => {
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state.cotacao)

  return {
    ...state,
    setCurrentStep: (step: number) => dispatch(setCurrentStep(step)),
    setCpf: (cpf: string) => dispatch(setCpf(cpf)),
    setProductType: (type: string) => dispatch(setProductType(type)),
    setProductData: (data: ProductDataUpdater) =>
      dispatch(setProductData(data)),
    setIsCurrentStepValid: (valid: boolean) =>
      dispatch(setIsCurrentStepValid(valid)),
    reset: (values) => dispatch(reset(values)),
  }
}
