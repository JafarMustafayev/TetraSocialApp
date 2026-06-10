import React from 'react';

const RegisterStepIndicator = ({ currentStep, totalSteps = 5 }) => {
    return (
        <div className="mb-6 flex flex-col items-center">
            <span className="text-[13px] font-bold text-gray-500 uppercase tracking-wider mb-3">
                Step {currentStep} of {totalSteps}
            </span>
            <div className="flex gap-1.5 w-full max-w-[200px]">
                {[...Array(totalSteps)].map((_, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;
                    
                    return (
                        <div 
                            key={stepNumber}
                            className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                                isActive ? 'bg-main' : 
                                isCompleted ? 'bg-main/50' : 'bg-gray-100 dark:bg-gray-800'
                            }`}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default RegisterStepIndicator;
