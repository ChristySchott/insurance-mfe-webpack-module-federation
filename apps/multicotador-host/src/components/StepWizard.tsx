import { Suspense, ReactNode } from 'react'
import { StepProgress } from './StepProgress'
import { Navigation } from './Navigation'
import { LoadingSpinner } from './LoadingSpinner'
import { Step1 } from './steps/Step1'
import { Step2 } from './steps/Step2'
import { Step3 } from './steps/Step3'
import { Step4 } from './steps/Step4'
import { ErrorBoundary } from './ErrorBoundary'
import { useCotacaoStore } from '@/hooks/useCotacaoStore'

const TOTAL_STEPS = 4

const renderStep = (currentStep: number) => {
  const contentBasedOnStep: Record<number, ReactNode> = {
    1: <Step1 />,
    2: <Step2 />,
    3: <Step3 />,
    4: <Step4 />,
  }

  return contentBasedOnStep[currentStep] || <Step1 />
}

export function StepWizard() {
  const { currentStep, setCurrentStep, cpf, productType, step2IsValid } =
    useCotacaoStore()

  const canGoNext = () => {
    const rulesToGoNextBasedOnStep: Record<number, boolean> = {
      1: cpf.length > 0 && productType !== null,
      2: step2IsValid,
      3: true,
      4: false,
    }

    return Boolean(rulesToGoNextBasedOnStep[currentStep])
  }

  const handleNext = () => {
    if (canGoNext() && currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="card">
        <StepProgress currentStep={currentStep} totalSteps={TOTAL_STEPS} />

        <Suspense fallback={<LoadingSpinner />}>
          <ErrorBoundary>{renderStep(currentStep)}</ErrorBoundary>
        </Suspense>

        {currentStep < TOTAL_STEPS && (
          <Navigation
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoNext={canGoNext()}
            isLastStep={currentStep === TOTAL_STEPS}
          />
        )}
      </div>
    </div>
  )
}
