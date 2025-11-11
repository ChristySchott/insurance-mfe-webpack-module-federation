import { useDispatch, useSelector } from 'react-redux'
import type { RootState, AppDispatch } from '../store/cotacaoStore'
import {
  setCurrentStep,
  setCpf,
  setProductType,
  setStep2Data,
  setStep2IsValid,
  reset,
} from '../store/cotacaoStore'
import type { CotacaoState } from '@/types/cotacao'

export const useAppDispatch = useDispatch.withTypes<AppDispatch>()
export const useAppSelector = useSelector.withTypes<RootState>()

export const useCotacaoStore = () => {
  const dispatch = useAppDispatch()
  const state = useAppSelector((state) => state.cotacao)

  return {
    ...state,

    setCurrentStep: (step: number) => dispatch(setCurrentStep(step)),
    setCpf: (cpf: string) => dispatch(setCpf(cpf)),
    setProductType: (type: string) => dispatch(setProductType(type)),
    setStep2Data: (data: Record<string, unknown>) =>
      dispatch(setStep2Data(data)),
    setStep2IsValid: (valid: boolean) => dispatch(setStep2IsValid(valid)),
    reset: (values?: Partial<CotacaoState>) => dispatch(reset(values)),
  }
}
