import React from 'react';

const ProgressBar = ({ steps, currentStep }) => {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const isActive = stepNumber === currentStep;
                    const isCompleted = stepNumber < currentStep;

                    return (
                        <React.Fragment key={step.id}>
                            <div className="flex items-center">
                                <div
                                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                    ${isCompleted
                                            ? 'bg-green-600 text-white'
                                            : isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-300 text-gray-600'
                                        }`}
                                >
                                    {isCompleted ? '✓' : stepNumber}
                                </div>
                                <span className={`ml-2 text-sm font-medium
                  ${isActive ? 'text-blue-600' : isCompleted ? 'text-green-600' : 'text-gray-500'}
                `}>
                                    {step.title}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`flex-1 h-px mx-4
                  ${stepNumber < currentStep ? 'bg-green-600' : 'bg-gray-300'}
                `} />
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};

export default ProgressBar;
