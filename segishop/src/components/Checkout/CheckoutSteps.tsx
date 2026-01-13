'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface Step {
  id: number;
  name: string;
  icon: LucideIcon;
  description: string;
}

interface CheckoutStepsProps {
  steps: Step[];
  currentStep: number;
  completedSteps: number[];
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  steps,
  currentStep,
  completedSteps
}) => {
  const getStepStatus = (stepId: number) => {
    if (completedSteps.includes(stepId)) return 'completed';
    if (stepId === currentStep) return 'current';
    return 'upcoming';
  };

  const getStepClasses = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          container: 'text-orange-600',
          circle: 'bg-orange-600 text-white border-orange-600',
          line: 'bg-orange-600'
        };
      case 'current':
        return {
          container: 'text-orange-600',
          circle: 'bg-white text-orange-600 border-orange-600 ring-2 ring-orange-600',
          line: 'bg-gray-300'
        };
      default:
        return {
          container: 'text-gray-500',
          circle: 'bg-white text-gray-400 border-gray-300',
          line: 'bg-gray-300'
        };
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <nav aria-label="Progress">
        <ol className="flex items-center justify-between">
          {steps.map((step, stepIdx) => {
            const status = getStepStatus(step.id);
            const classes = getStepClasses(status);
            const Icon = step.icon;

            return (
              <li key={step.id} className="relative flex-1">
                {/* Step Content */}
                <div className="flex flex-col items-center">
                  {/* Step Circle */}
                  <div
                    className={`
                      relative flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-200
                      ${classes.circle}
                    `}
                  >
                    {status === 'completed' ? (
                      <svg
                        className="h-6 w-6"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <Icon className="h-6 w-6" />
                    )}
                  </div>

                  {/* Step Text */}
                  <div className={`mt-3 text-center ${classes.container}`}>
                    <div className="text-sm font-medium">{step.name}</div>
                    <div className="text-xs mt-1 hidden sm:block">{step.description}</div>
                  </div>
                </div>

                {/* Connecting Line */}
                {stepIdx < steps.length - 1 && (
                  <div
                    className={`
                      absolute top-6 left-1/2 w-full h-0.5 -translate-y-0.5 transition-all duration-200
                      ${classes.line}
                    `}
                    style={{ 
                      left: 'calc(50% + 24px)', 
                      width: 'calc(100% - 48px)' 
                    }}
                  />
                )}
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Mobile Step Indicator */}
      <div className="mt-6 sm:hidden">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            Step {currentStep} of {steps.length}
          </span>
          <span className="font-medium text-gray-900">
            {steps.find(step => step.id === currentStep)?.name}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-orange-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};
