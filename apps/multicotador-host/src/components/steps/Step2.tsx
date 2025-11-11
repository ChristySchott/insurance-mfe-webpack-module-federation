import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useCotacaoStore } from '@/hooks/useCotacaoStore'
import { useRemoteProducts } from '@/hooks/useRemoteProducts'
import { RemoteComponent } from '@/components/RemoteComponent'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const commonFieldsSchema = z.object({
  email: z
    .string()
    .min(1, 'Email é obrigatório')
    .email('Email com formato inválido'),
  age: z
    .string()
    .min(1, 'Idade é obrigatória')
    .refine((val) => !isNaN(Number(val)), 'Idade deve ser um número')
    .refine(
      (val) => Number(val) >= 18 && Number(val) <= 120,
      'Idade deve estar entre 18 e 120 anos'
    ),
})

type CommonFieldsData = z.infer<typeof commonFieldsSchema>

export function Step2() {
  const { productType } = useCotacaoStore()
  const {
    getProduct,
    loading: productsLoading,
    error: productsError,
  } = useRemoteProducts()

  const {
    register,
    formState: { errors },
  } = useForm<CommonFieldsData>({
    resolver: zodResolver(commonFieldsSchema),
    defaultValues: {
      email: '',
      age: '',
    },
  })

  const productConfig = getProduct(productType!)

  const renderProductSpecificSection = () => {
    if (productsLoading) {
      return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <LoadingSpinner message="Carregando produtos disponíveis..." />
        </div>
      )
    }

    if (productsError) {
      return (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-red-900 mb-2">
            Erro ao carregar produtos
          </h4>
          <p className="text-red-700 text-sm mb-3">{productsError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-3 py-1.5 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Recarregar
          </button>
        </div>
      )
    }

    if (!productConfig) {
      return (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h4 className="text-md font-semibold text-orange-900 mb-2">
            Produto não disponível
          </h4>
          <p className="text-orange-700 text-sm">
            O produto <strong>"{productType}"</strong> não está disponível. Por
            favor, selecione outro produto.
          </p>
        </div>
      )
    }

    return (
      <ErrorBoundary>
        <RemoteComponent
          url={productConfig.url}
          scope={productConfig.scope}
          module="./Step2"
        />
      </ErrorBoundary>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Detalhes</h2>
        <p className="text-gray-600">
          Preencha a informação necessária para a sua cotação
        </p>
      </div>

      <div className="space-y-8">
        <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informações do Segurado
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="label">
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="seu@email.com"
                className={`input-field ${errors.email ? 'input-error' : ''}`}
                {...register('email')}
              />
              {errors.email && (
                <p className="error-message">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="age" className="label">
                Idade
              </label>
              <input
                id="age"
                type="text"
                placeholder="25"
                maxLength={3}
                className={`input-field ${errors.age ? 'input-error' : ''}`}
                {...register('age', {
                  onChange: (e) => {
                    e.target.value = e.target.value.replace(/\D/g, '')
                  },
                })}
              />
              {errors.age && (
                <p className="error-message">{errors.age.message}</p>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informações específicas do seguro
          </h3>

          {renderProductSpecificSection()}
        </div>
      </div>
    </div>
  )
}
