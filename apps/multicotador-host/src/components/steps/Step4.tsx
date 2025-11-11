import { useCotacaoStore } from '@/hooks/useCotacaoStore'

export function Step4() {
  const { productType, productData, reset } = useCotacaoStore()

  const handleFinish = () => {
    alert('Cotação finalizada com sucesso!')
    reset()
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Resumo da cotação
        </h2>
        <p className="text-gray-600">Revise os detalhes da sua cotação</p>
      </div>

      <div className="space-y-6">
        <div className="card bg-primary-50 border-primary-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informação pessoal
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">CPF</p>
              <p className="font-medium text-gray-900">Teste</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Tipo do seguro</p>
              <p className="font-medium text-gray-900 capitalize">
                {productType === 'auto' ? 'Seguro Auto' : 'Seguro Residencial'}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Detalhes da cotação
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(productData).map(([key, value]) => (
              <div key={key}>
                <p className="text-sm text-gray-600 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </p>
                <p className="font-medium text-gray-900">{String(value)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-6">
        <button
          onClick={handleFinish}
          className="btn-primary px-12 py-3 text-lg"
        >
          Finalizar cotação
        </button>
      </div>
    </div>
  )
}
