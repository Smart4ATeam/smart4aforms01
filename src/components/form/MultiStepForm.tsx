import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import GlassButton from './GlassButton';
import { ChevronLeft, ChevronRight, Send } from 'lucide-react';

interface Step {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface MultiStepFormProps {
  steps: Step[];
  onSubmit: () => void;
  isSubmitting?: boolean;
  className?: string;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({
  steps,
  onSubmit,
  isSubmitting = false,
  className,
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  const goToNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={cn('space-y-8', className)}>
      {/* Progress indicator - Pills style */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isCompleted = index < currentStep;
          
          return (
            <React.Fragment key={step.id}>
              <div
                className={cn(
                  'step-pill',
                  isActive && 'step-pill-active',
                  isCompleted && 'step-pill-completed',
                  !isActive && !isCompleted && 'step-pill-inactive'
                )}
              >
                <span className="step-pill-number">{index + 1}</span>
                <span className="step-pill-title">{step.title}</span>
              </div>
              {index < steps.length - 1 && (
                <div 
                  className={cn(
                    'w-6 h-[2px] rounded-full transition-colors duration-300',
                    index < currentStep ? 'bg-[hsl(270_50%_45%)]' : 'bg-border'
                  )}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Step content */}
      <div className="animate-fade-in" key={currentStep}>
        {steps[currentStep].content}
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between gap-4">
        <GlassButton
          type="button"
          variant="outline"
          onClick={goToPrevious}
          disabled={currentStep === 0}
          className={cn(currentStep === 0 && 'invisible')}
        >
          <ChevronLeft className="w-4 h-4" />
          上一步
        </GlassButton>

        {isLastStep ? (
          <GlassButton
            type="submit"
            variant="gradient"
            onClick={onSubmit}
            loading={isSubmitting}
          >
            <Send className="w-4 h-4" />
            提交表單
          </GlassButton>
        ) : (
          <GlassButton type="button" variant="gradient" onClick={goToNext}>
            下一步
            <ChevronRight className="w-4 h-4" />
          </GlassButton>
        )}
      </div>
    </div>
  );
};

export default MultiStepForm;
