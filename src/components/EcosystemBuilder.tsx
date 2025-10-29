import { useEffect } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { steps } from "@/data/products";
import { useBuilderState } from "@/hooks/useBuilderState";
import { useProductImages } from "@/services/imageService";
import { toast } from "sonner";

const SPOKE_POSITIONS = [
  { x: "50%", y: "15%" },  // 12 o'clock - Wheel
  { x: "85%", y: "50%" },  // 3 o'clock - Pedals
  { x: "50%", y: "85%" },  // 6 o'clock - Shifter/Handbrake
  { x: "15%", y: "50%" },  // 9 o'clock - Accessories
];

export default function EcosystemBuilder() {
  const { state, setSelection, setActiveStep, reset } = useBuilderState();
  const allProducts = steps.flatMap(s => s.products);
  const images = useProductImages(allProducts);
  
  const currentStepIndex = steps.findIndex(s => s.id === state.activeStep);

  useEffect(() => {
    if (state.selections.wheelbase && state.selections.wheel) {
      if (!isWheelCompatible(state.selections.wheel, state.selections.wheelbase)) {
        setSelection("wheel", undefined);
        toast.error("Selected wheel is not compatible with this wheelbase");
      }
    }
  }, [state.selections.wheelbase]);

  const isWheelCompatible = (wheelId: string, wheelbaseId: string) => {
    const wheelStep = steps.find(s => s.id === "wheel");
    if (!wheelStep?.compatibility?.[wheelbaseId]) return true;
    return wheelStep.compatibility[wheelbaseId].includes(wheelId);
  };

  const getFilteredProducts = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return [];
    if (stepId === "wheel" && state.selections.wheelbase && step.compatibility) {
      const compatible = step.compatibility[state.selections.wheelbase] || [];
      return step.products.filter(p => compatible.includes(p.id));
    }
    return step.products;
  };

  const canContinue = () => {
    const step = steps[currentStepIndex];
    if (!step) return false;
    if (step.required) {
      const selection = state.selections[step.id];
      return selection !== undefined && (Array.isArray(selection) ? selection.length > 0 : selection !== "");
    }
    return true;
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setActiveStep(steps[index].id);
    }
  };

  const activeStepConfig = steps.find(s => s.id === state.activeStep);
  const displayProducts = getFilteredProducts(state.activeStep);
  const centerProduct = state.activeStep === "wheelbase" 
    ? null 
    : steps.find(s => s.id === "wheelbase")?.products.find(p => p.id === state.selections.wheelbase);

  if (!activeStepConfig) return null;

  const isWheelbaseStep = state.activeStep === "wheelbase";

  return (
    <div className="relative w-full min-h-screen holo-bg overflow-hidden">
      {/* Header */}
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-xl md:text-2xl font-futuristic font-semibold uppercase tracking-wider text-cyan-200">
          {activeStepConfig.required ? "Required: " : "Optional: "}
          {activeStepConfig.id === "wheelbase" ? "Choose Your Wheelbase" : 
           activeStepConfig.id === "wheel" ? "Choose Your Wheel" :
           activeStepConfig.id === "pedals" ? "Choose Pedals" :
           activeStepConfig.id === "shifter_handbrake" ? "Choose Shifter/Handbrake" :
           "Choose Accessories"}
        </h2>
        {centerProduct && (
          <div className="mt-2 glass-panel inline-block px-6 py-3 rounded-xl">
            <span className="text-2xl md:text-3xl font-futuristic font-bold uppercase tracking-wide text-cyan-300">
              {centerProduct.name}
            </span>
          </div>
        )}
      </div>

      {/* Ecosystem Container */}
      <div className="relative w-full h-[800px] flex items-center justify-center">
        {/* Center Hub */}
        {centerProduct && !isWheelbaseStep && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-2xl animate-glow-pulse" style={{ width: "200px", height: "200px", left: "-25px", top: "-25px" }} />
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative w-[150px] h-[150px] rounded-full glass-panel glow-strong flex items-center justify-center"
              >
                {images[centerProduct.id] ? (
                  <img src={images[centerProduct.id]} alt={centerProduct.name} className="w-24 h-24 object-contain opacity-80 brightness-110" />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-cyan-400/20 animate-pulse" />
                )}
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Product nodes */}
        {displayProducts.map((product, index) => {
          const stepSelections = state.selections[state.activeStep];
          const isSelected = Array.isArray(stepSelections) 
            ? stepSelections.includes(product.id)
            : stepSelections === product.id;
          const delay = 0.3 + index * 0.1;
          const position = isWheelbaseStep 
            ? { x: `${30 + (index % 3) * 20}%`, y: `${30 + Math.floor(index / 3) * 25}%` }
            : SPOKE_POSITIONS[index % SPOKE_POSITIONS.length];

          return (
            <div key={product.id}>
              {/* Connector line */}
              {!isWheelbaseStep && centerProduct && (
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.6 }}
                  transition={{ duration: 0.8, delay }}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                >
                  <motion.line
                    x1="50%"
                    y1="50%"
                    x2={position.x}
                    y2={position.y}
                    stroke="#7FD8FF"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    opacity={0.6}
                    animate={{
                      strokeDashoffset: isSelected ? [0, -8] : 0,
                      opacity: isSelected ? 0.9 : 0.6,
                    }}
                    transition={{
                      strokeDashoffset: { duration: 1, repeat: Infinity, ease: "linear" },
                    }}
                  />
                  <motion.circle
                    cx="50%"
                    cy="50%"
                    r="6"
                    fill="#7FD8FF"
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.svg>
              )}

              {/* Product node */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay }}
                className="absolute"
                style={{ left: position.x, top: position.y, transform: "translate(-50%, -50%)", zIndex: 10 }}
              >
                <div className="relative">
                  {/* Glowing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-cyan-400/10 blur-xl"
                    style={{ width: "160px", height: "160px", left: "-30px", top: "-30px" }}
                    animate={{
                      boxShadow: isSelected
                        ? ["0 0 20px rgba(127,216,255,0.4)", "0 0 40px rgba(127,216,255,0.8)", "0 0 20px rgba(127,216,255,0.4)"]
                        : "0 0 15px rgba(30,144,255,0.3)",
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Product card */}
                  <motion.div
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (activeStepConfig.multi) {
                        const current = (state.selections[state.activeStep] || []) as string[];
                        const newSel = current.includes(product.id)
                          ? current.filter(id => id !== product.id)
                          : [...current, product.id];
                        setSelection(state.activeStep, newSel);
                      } else {
                        setSelection(state.activeStep, product.id);
                      }
                    }}
                    className={`
                      relative w-[100px] h-[100px] rounded-full glass-panel cursor-pointer
                      flex items-center justify-center transition-all duration-300 overflow-hidden
                      ${isSelected ? "ring-2 ring-cyan-300 glow-strong" : "hover:glow-soft"}
                    `}
                  >
                    {images[product.id] ? (
                      <img src={images[product.id]} alt={product.name} className="w-20 h-20 object-contain opacity-80 brightness-110" />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-cyan-400/20 animate-pulse" />
                    )}
                  </motion.div>

                  {/* Product label */}
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-40 text-center">
                    <p className="text-sm font-futuristic font-semibold text-cyan-200 mb-1">
                      {product.name}
                    </p>
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200 transition-colors"
                    >
                      <span>Info</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId={`selected-${product.id}`}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-cyan-300 flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <span className="text-black text-xs font-bold">✓</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Navigation buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 right-8 flex gap-4"
      >
        <button
          onClick={reset}
          className="glass-panel px-6 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30 text-cyan-200 font-futuristic font-semibold uppercase tracking-wider transition-all"
        >
          Reset
        </button>
        {currentStepIndex > 0 && (
          <button
            onClick={() => goToStep(currentStepIndex - 1)}
            className="glass-panel px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-cyan-200 font-futuristic font-semibold uppercase tracking-wider transition-all"
          >
            Back
          </button>
        )}
        <button
          disabled={!canContinue()}
          onClick={() => {
            if (currentStepIndex < steps.length - 1) {
              goToStep(currentStepIndex + 1);
            } else {
              toast.success("Build complete!");
            }
          }}
          className="glass-panel px-8 py-4 rounded-xl bg-cyan-400/20 hover:bg-cyan-400/30 text-cyan-100 font-futuristic font-semibold uppercase tracking-wider transition-all glow-soft hover:glow-strong disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {currentStepIndex < steps.length - 1 
            ? (activeStepConfig.required ? "Continue" : "Skip") 
            : "Finish"}
        </button>
      </motion.div>
    </div>
  );
}
