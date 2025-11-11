import { UseFormRegisterReturn } from 'react-hook-form'
import { useRemoteProducts } from '@/hooks/useRemoteProducts'
import { ProductOption } from './ProductOption'
import { LoadingSpinner } from '@/components/LoadingSpinner'

interface ProductTypeSelectorProps {
  selectedProductType: string | null
  register: UseFormRegisterReturn
  error?: string
}

export function ProductTypeSelector({
  selectedProductType,
  register,
  error,
}: ProductTypeSelectorProps) {
  const { products, loading, error: productsError } = useRemoteProducts()

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner
          message="Carregando produtos disponíveis..."
          size="sm"
        />
      </div>
    )
  }

  if (productsError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-sm text-red-700">
          Erro ao carregar produtos disponíveis. Por favor, recarregue a página.
        </p>
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <p className="text-sm text-yellow-700">
          Nenhum produto disponível no momento.
        </p>
      </div>
    )
  }

  return (
    <div>
      <label className="label">Tipo do seguro</label>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((product) => (
          <ProductOption
            key={product.id}
            product={product}
            isSelected={selectedProductType === product.id}
            register={register}
          />
        ))}
      </div>

      {error && <p className="error-message mt-2">{error}</p>}
    </div>
  )
}
