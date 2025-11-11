import { Suspense, ReactNode } from 'react'
import { StepNavigation } from '@/components/steps/StepNavigation'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { StepProgress } from './StepProgress'
import { Step1 } from './Step1'
import { Step2 } from './Step2'
import { Step3 } from './Step3'
import { Step4 } from './Step4'
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

const canAdvanceToNextStep = (
  currentStep: number,
  isCurrentStepValid: boolean
) => {
  const rulesToGoNextBasedOnStep: Record<number, boolean> = {
    1: currentStep === 1 && isCurrentStepValid,
    2: currentStep === 2 && isCurrentStepValid,
    3: currentStep === 3 && isCurrentStepValid,
    4: false,
  }

  return Boolean(rulesToGoNextBasedOnStep[currentStep])
}

export function StepWizard() {
  const { currentStep, setCurrentStep, isCurrentStepValid } = useCotacaoStore()

  const canGoNext = canAdvanceToNextStep(currentStep, isCurrentStepValid)

  const handleNext = () => {
    setCurrentStep(currentStep + 1)
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
          <StepNavigation
            currentStep={currentStep}
            totalSteps={TOTAL_STEPS}
            onPrevious={handlePrevious}
            onNext={handleNext}
            canGoNext={canGoNext}
            isLastStep={currentStep === TOTAL_STEPS}
          />
        )}
      </div>
    </div>
  )
}
