import { createSlice, configureStore, PayloadAction } from '@reduxjs/toolkit'
import type {
  CotacaoState,
  CotacaoActions,
  ProductDataUpdater,
} from '@/types/cotacao'

const initialState: CotacaoState = {
  currentStep: 1,
  cpf: '',
  productType: null,
  isCurrentStepValid: false,
  productData: {},
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
    setProductData: (state, action: PayloadAction<ProductDataUpdater>) => {
      const updater = action.payload
      state.productData =
        typeof updater === 'function' ? updater(state.productData) : updater
    },
    setIsCurrentStepValid: (state, action: PayloadAction<boolean>) => {
      state.isCurrentStepValid = action.payload
    },
    reset: (
      _state,
      action: PayloadAction<Partial<CotacaoState> | undefined>
    ) => {
      return { ...initialState, ...action.payload }
    },
  } satisfies Record<
    keyof CotacaoActions,
    (
      state: CotacaoState,
      action: PayloadAction<any> // eslint-disable-line
    ) => void | CotacaoState
  >,
})

export const {
  setCurrentStep,
  setCpf,
  setProductType,
  setProductData,
  setIsCurrentStepValid,
  reset,
} = cotacaoSlice.actions

export const store = configureStore({
  reducer: {
    cotacao: cotacaoSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['cotacao/setProductData'],
      },
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
