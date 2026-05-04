import { useState } from 'react';

export const useStepNavigation = (totalSteps = 11) => {
  const [step, setStep] = useState(0);

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const goToStep = (stepNumber) => {
    if (stepNumber >= 0 && stepNumber <= totalSteps) {
      setStep(stepNumber);
    }
  };

  const resetSteps = () => {
    setStep(0);
  };

  const isFirstStep = step === 0;
  const isLastStep = step === totalSteps;
  const progress = (step / totalSteps) * 100;

  return {
    step,
    setStep,
    nextStep,
    prevStep,
    goToStep,
    resetSteps,
    isFirstStep,
    isLastStep,
    progress,
    totalSteps
  };
};