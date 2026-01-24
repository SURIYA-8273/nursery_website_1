import { Check } from 'lucide-react';

interface CheckoutStepsProps {
    currentStep?: 'cart' | 'details' | 'payment';
}

export const CheckoutSteps = ({ currentStep = 'cart' }: CheckoutStepsProps) => {
    const steps = [
        { id: 'cart', label: 'Shopping Cart', number: 1 },
        { id: 'details', label: 'Order Details', number: 2 },
        { id: 'payment', label: 'Payment', number: 3 },
    ];

    const getCurrentStepIndex = () => {
        switch (currentStep) {
            case 'cart': return 0;
            case 'details': return 1;
            case 'payment': return 2;
            default: return 0;
        }
    };

    const currentIndex = getCurrentStepIndex();

    return (
        <div className="w-full max-w-3xl mx-auto mb-8 md:mb-12">
            <div className="relative flex justify-between items-center">
                {/* Progress Track Background */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-secondary/10 -translate-y-1/2 rounded-full" />

                {/* Active Progress Track */}
                <div
                    className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${(currentIndex / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, index) => {
                    const isCompleted = index < currentIndex;
                    const isCurrent = index === currentIndex;

                    return (
                        <div key={step.id} className="relative z-10 flex flex-col items-center gap-2">
                            <div
                                className={`
                                    w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300
                                    ${isCompleted || isCurrent
                                        ? 'bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110'
                                        : 'bg-white border-secondary/20 text-text-muted'
                                    }
                                `}
                            >
                                {isCompleted ? (
                                    <Check size={16} strokeWidth={3} />
                                ) : (
                                    <span className={`font-bold text-sm md:text-base ${isCurrent ? 'text-white' : 'text-text-secondary'}`}>
                                        {step.number}
                                    </span>
                                )}
                            </div>
                            <span
                                className={`
                                    text-[10px] md:text-sm font-bold whitespace-nowrap transition-colors duration-300
                                    ${isCurrent ? 'text-primary' : 'text-text-secondary'}
                                `}
                            >
                                {step.label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
