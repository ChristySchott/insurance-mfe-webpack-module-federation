interface NavigationProps {
  currentStep: number
  totalSteps: number
  onPrevious: () => void
  onNext: () => void
  canGoNext: boolean
  isLastStep: boolean
}

export function StepNavigation({
  currentStep,
  totalSteps,
  onPrevious,
  onNext,
  canGoNext,
  isLastStep,
}: NavigationProps) {
  const showPrevious = currentStep > 1

  return (
    <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200">
      <div>
        {showPrevious && (
          <button onClick={onPrevious} className="btn-secondary">
            Anterior
          </button>
        )}
      </div>

      <div className="text-sm text-gray-600">
        Etapa {currentStep} de {totalSteps}
      </div>

      <button onClick={onNext} disabled={!canGoNext} className="btn-primary">
        {isLastStep ? 'Finalizar' : 'Próximo'}
      </button>
    </div>
  )
}
