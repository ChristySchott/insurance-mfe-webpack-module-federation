import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'

export interface CotacaoState {
  currentStep: number
  cpf: string
  productType: string | null
  step2Data: Record<string, unknown>
  step2IsValid: boolean
  step3IsValid: boolean
}

const initialState: CotacaoState = {
  currentStep: 1,
  cpf: '',
  productType: null,
  step2Data: {},
  step2IsValid: false,
  step3IsValid: false,
}

const cotacaoSlice = createSlice({
  name: 'cotacao',
  initialState,
  reducers: {
    setCurrentStep: (state, action: PayloadAction<number>) => {
      state.currentStep = action.payload
    },
    setCpf: (state, action: PayloadAction<string>) => {
      state.cpf = action.payload
    },
    setProductType: (state, action: PayloadAction<string>) => {
      state.productType = action.payload
    },
    setStep2Data: (state, action: PayloadAction<Record<string, unknown>>) => {
      state.step2Data = action.payload
    },
    setStep2IsValid: (state, action: PayloadAction<boolean>) => {
      state.step2IsValid = action.payload
    },
    reset: (
      _state,
      action: PayloadAction<Partial<CotacaoState> | undefined>
    ) => {
      return { ...initialState, ...action.payload }
    },
  },
})

export const {
  setCurrentStep,
  setCpf,
  setProductType,
  setStep2Data,
  setStep2IsValid,
  reset,
} = cotacaoSlice.actions

export const store = configureStore({
  reducer: {
    cotacao: cotacaoSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['cotacao/setStep2Data'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
