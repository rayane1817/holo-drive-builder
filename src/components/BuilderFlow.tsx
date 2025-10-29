import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BuilderStep, Product } from "./BuilderStep";
import { Button } from "./ui/button";
import { ChevronRight, ChevronLeft, Check } from "lucide-react";

export interface Step {
  id: string;
  label: string;
  subtitle?: string;
  type: "choice-grid" | "choice-carousel" | "multi-select";
  products: Product[];
  isOptional?: boolean;
}

interface BuilderFlowProps {
  steps: Step[];
  onComplete: (selections: Record<string, string | string[]>) => void;
}

const BuilderFlow = ({ steps, onComplete }: BuilderFlowProps) => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selections, setSelections] = useState<Record<string, string | string[]>>({});

  const currentStep = steps[currentStepIndex];
  const isLastStep = currentStepIndex === steps.length - 1;
  const canProceed =
    currentStep.isOptional ||
    (currentStep.type === "multi-select"
      ? true
      : selections[currentStep.id] !== undefined);

  const handleSelect = (productId: string) => {
    if (currentStep.type === "multi-select") {
      const current = (selections[currentStep.id] || []) as string[];
      const newSelection = current.includes(productId)
        ? current.filter((id) => id !== productId)
        : [...current, productId];
      setSelections({ ...selections, [currentStep.id]: newSelection });
    } else {
      setSelections({ ...selections, [currentStep.id]: productId });
    }
  };

  const handleNext = () => {
    if (isLastStep) {
      onComplete(selections);
    } else {
      setCurrentStepIndex(currentStepIndex + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex(currentStepIndex - 1);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-12">
      {/* Progress indicator */}
      <div className="mb-12">
        <div className="flex items-center justify-center gap-2 mb-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                initial={false}
                animate={{
                  scale: index === currentStepIndex ? 1.2 : 1,
                  opacity: index <= currentStepIndex ? 1 : 0.4,
                }}
                className={`
                  w-3 h-3 rounded-full transition-all duration-300
                  ${
                    index === currentStepIndex
                      ? "bg-primary glow-soft"
                      : index < currentStepIndex
                      ? "bg-accent"
                      : "bg-muted"
                  }
                `}
              />
              {index < steps.length - 1 && (
                <div
                  className={`
                    w-8 md:w-16 h-0.5 mx-1 transition-all duration-300
                    ${
                      index < currentStepIndex
                        ? "bg-accent"
                        : "bg-muted"
                    }
                  `}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground uppercase tracking-wider">
          Step {currentStepIndex + 1} of {steps.length}
        </p>
      </div>

      {/* Step content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <BuilderStep
            title={currentStep.label}
            subtitle={currentStep.subtitle}
            products={currentStep.products}
            selectedId={
              currentStep.type === "multi-select"
                ? undefined
                : (selections[currentStep.id] as string)
            }
            onSelect={handleSelect}
            isOptional={currentStep.isOptional}
            layout={currentStep.type === "choice-carousel" ? "carousel" : "grid"}
          />
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex justify-center gap-4 mt-12">
        {currentStepIndex > 0 && (
          <Button
            onClick={handleBack}
            variant="outline"
            className="glass-panel border-primary/30 hover:border-primary"
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        )}

        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="glass-panel bg-primary hover:bg-primary/90 text-primary-foreground glow-soft"
        >
          {isLastStep ? (
            <>
              <Check className="w-4 h-4 mr-2" />
              Complete Build
            </>
          ) : (
            <>
              {currentStep.isOptional ? "Skip" : "Continue"}
              <ChevronRight className="w-4 h-4 ml-2" />
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default BuilderFlow;
