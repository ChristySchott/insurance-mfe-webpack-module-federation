import { useCotacaoStore } from '@/hooks/useCotacaoStore'
import { useRemoteProducts } from '@/hooks/useRemoteProducts'
import { RemoteComponent } from '@/components/RemoteComponent'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'

const Header = () => (
  <div className="mb-8">
    <h2 className="text-2xl font-bold text-gray-900 mb-2">Detalhes</h2>
    <p className="text-gray-600">
      Preencha a informação necessária para a sua cotação
    </p>
  </div>
)

export function Step3() {
  const { productType } = useCotacaoStore()
  const {
    getProduct,
    loading: productsLoading,
    error: productsError,
  } = useRemoteProducts()

  const productConfig = getProduct(productType!)

  if (productsLoading) {
    return (
      <div>
        <Header />
        <div className="flex items-center justify-center py-12">
          <LoadingSpinner message="Carregando produtos disponíveis..." />
        </div>
      </div>
    )
  }

  if (productsError) {
    return (
      <div>
        <Header />
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Erro ao carregar produtos
          </h3>
          <p className="text-red-700 mb-4">{productsError.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Recarregar página
          </button>
        </div>
      </div>
    )
  }

  if (!productConfig) {
    return (
      <div>
        <Header />
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-orange-900 mb-2">
            Produto não disponível
          </h3>
          <p className="text-orange-700">
            O produto <strong>"{productType}"</strong> não está disponível no
            momento. Por favor, selecione outro produto ou entre em contato com
            o suporte.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <Header />

      <ErrorBoundary>
        <RemoteComponent
          url={productConfig.url}
          scope={productConfig.scope}
          module="./Step3"
        />
      </ErrorBoundary>
    </div>
  )
}
