interface StepProgressProps {
  currentStep: number
  totalSteps: number
}

export function StepProgress({ currentStep, totalSteps }: StepProgressProps) {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1)

  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center flex-1">
            <div className="flex flex-col items-center relative flex-1">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                  transition-colors duration-200 z-10
                  ${
                    step < currentStep
                      ? 'bg-primary-600 text-white'
                      : step === currentStep
                        ? 'bg-primary-600 text-white ring-4 ring-primary-100'
                        : 'bg-gray-200 text-gray-500'
                  }
                `}
              >
                {step < currentStep ? (
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  step
                )}
              </div>

              <span
                className={`
                  text-xs mt-2 font-medium
                  ${step <= currentStep ? 'text-primary-600' : 'text-gray-500'}
                `}
              >
                Etapa {step}
              </span>
            </div>

            {index < steps.length - 1 && (
              <div
                className={`
                  h-1 flex-1 mx-2 rounded transition-colors duration-200
                  ${step < currentStep ? 'bg-primary-600' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
