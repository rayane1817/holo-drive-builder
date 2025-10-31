import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { steps } from "@/data/products";
import type { Product } from "@/data/products";
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
  const [showSummary, setShowSummary] = useState(false);
  
  const currentStepIndex = steps.findIndex(s => s.id === state.activeStep);

  useEffect(() => {
    if (state.selections.wheelbase && state.selections.wheel) {
      if (!isWheelCompatible(state.selections.wheel, state.selections.wheelbase)) {
        setSelection("wheel", undefined);
        toast.error("Selected wheel is not compatible with this wheelbase");
      }
    }
  }, [state.selections.wheelbase]);

  const hasWheelbaseSelection = !!state.selections.wheelbase;

  const isWheelCompatible = (wheelId: string, wheelbaseId: string) => {
    const wheelStep = steps.find(s => s.id === "wheel");
    if (!wheelStep?.compatibility?.[wheelbaseId]) return true;
    return wheelStep.compatibility[wheelbaseId].includes(wheelId);
  };

  const getFilteredProducts = (stepId: string) => {
    const step = steps.find(s => s.id === stepId);
    if (!step) return [];
    
    if (stepId === "wheel" && state.selections.wheelbase && step.compatibility) {
      const compatibleIds = step.compatibility[state.selections.wheelbase];
      
      if (compatibleIds) {
        return step.products.filter(p => compatibleIds.includes(p.id));
      } else if (step.compatibility["*"]) {
        return step.products.filter(p => step.compatibility!["*"].includes(p.id));
      }
      return step.products;
    }
    
    return step.products;
  };

  const hasCurrentSelection = () => {
    const step = steps[currentStepIndex];
    if (!step) return false;
    const selection = state.selections[step.id];
    return selection !== undefined && (Array.isArray(selection) ? selection.length > 0 : selection !== "");
  };

  const canContinue = () => {
    const step = steps[currentStepIndex];
    if (!step) return false;
    // For required steps, must have selection
    if (step.required) {
      return hasCurrentSelection();
    }
    // Optional steps can always continue
    return true;
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < steps.length) {
      setActiveStep(steps[index].id);
    }
  };

  const activeStepConfig = steps.find(s => s.id === state.activeStep);
  const displayProducts = getFilteredProducts(state.activeStep);
  const centerProduct = hasWheelbaseSelection
    ? steps.find(s => s.id === "wheelbase")?.products.find(p => p.id === state.selections.wheelbase)
    : null;

  if (!activeStepConfig) return null;

  const isWheelbaseStep = state.activeStep === "wheelbase";
  const showCenterHub = hasWheelbaseSelection && !isWheelbaseStep;
  const showConnectorLines = hasWheelbaseSelection && !isWheelbaseStep;

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Header */}
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-xl md:text-2xl font-semibold uppercase tracking-wider text-white">
          {activeStepConfig.required ? "Required: " : "Optional: "}
          {activeStepConfig.id === "wheelbase" ? "Choose Your Wheelbase" : 
           activeStepConfig.id === "wheel" ? "Choose Your Wheel" :
           activeStepConfig.id === "pedals" ? "Choose Pedals" :
           activeStepConfig.id === "shifter_handbrake" ? "Choose Shifter/Handbrake" :
           "Choose Accessories"}
        </h2>
        {centerProduct && (
          <div className="mt-2 bg-white/5 backdrop-blur-sm inline-block px-6 py-3 rounded-xl border border-white/20">
            <span className="text-2xl md:text-3xl font-bold uppercase tracking-wide text-white">
              {centerProduct.name}
            </span>
          </div>
        )}
      </div>

      {/* Ecosystem Container */}
      <div className="relative w-full h-[800px] sm:h-[900px] md:h-[1000px] flex items-center justify-center py-16 md:py-24 px-4">
        {/* Center Hub - only show after wheelbase is selected */}
        {showCenterHub && centerProduct && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="absolute z-20"
            style={{ left: "50%", top: "50%", transform: "translate(-50%, -50%)" }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-white/20 blur-3xl" style={{ width: "240px", height: "240px", left: "-45px", top: "-45px" }} />
              <motion.div
                className="relative w-[150px] h-[150px] rounded-full bg-white/10 backdrop-blur-md border-4 border-white/50 shadow-[0_0_40px_rgba(255,255,255,0.4)] flex items-center justify-center"
              >
                {images[centerProduct.id] ? (
                  <img src={images[centerProduct.id]} alt={centerProduct.name} className="w-28 h-28 object-contain" />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/20 animate-pulse" />
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
          
          // Calculate radial position with responsive radius
          const totalProducts = displayProducts.length;
          const angleStep = (2 * Math.PI) / totalProducts;
          const angle = index * angleStep - Math.PI / 2; // Start from top
          
          // Optimized radius for better spacing and visibility
          const radiusPercent = 32; // Percentage - balanced for all screen sizes
          
          // Calculate node position
          const nodeX = 50 + radiusPercent * Math.cos(angle);
          const nodeY = 50 + radiusPercent * Math.sin(angle);
          
          // Calculate edge connection points for lines
          // Hub radius: ~10% of container, Node radius: ~6% of container
          const hubRadius = 10;
          const nodeRadius = 6;
          const hubEdgeX = 50 + hubRadius * Math.cos(angle);
          const hubEdgeY = 50 + hubRadius * Math.sin(angle);
          const nodeEdgeX = nodeX - nodeRadius * Math.cos(angle);
          const nodeEdgeY = nodeY - nodeRadius * Math.sin(angle);
          
          const position = { x: `${nodeX}%`, y: `${nodeY}%` };

          return (
            <div key={product.id}>
              {/* Connector line - only show after wheelbase selection */}
              {showConnectorLines && (
                <motion.svg
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.5 }}
                  transition={{ duration: 0.8, delay }}
                  className="absolute top-0 left-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 5 }}
                >
                  <motion.line
                    x1={`${hubEdgeX}%`}
                    y1={`${hubEdgeY}%`}
                    x2={`${nodeEdgeX}%`}
                    y2={`${nodeEdgeY}%`}
                    stroke="rgba(255, 255, 255, 0.6)"
                    strokeWidth="2"
                    animate={{
                      opacity: isSelected ? 0.8 : 0.4,
                      strokeWidth: isSelected ? 3 : 2,
                    }}
                    transition={{ duration: 0.3 }}
                    initial={{ opacity: 0 }}
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
                    className="absolute inset-0 rounded-full"
                    style={{ width: "200px", height: "200px", left: "-40px", top: "-40px" }}
                    animate={{
                      boxShadow: isSelected
                        ? ["0 0 30px rgba(255,255,255,0.4)", "0 0 50px rgba(255,255,255,0.7)", "0 0 30px rgba(255,255,255,0.4)"]
                        : "0 0 20px rgba(255,255,255,0.2)",
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
                    animate={{
                      scale: isSelected ? 1.05 : 1,
                    }}
                    transition={{ duration: 0.3 }}
                    className={`
                      relative w-[100px] h-[100px] md:w-[120px] md:h-[120px] rounded-full cursor-pointer
                      flex items-center justify-center transition-all duration-300 overflow-hidden
                      bg-white/10 backdrop-blur-md border-2
                      ${isSelected 
                        ? "border-white shadow-[0_0_30px_rgba(147,51,234,0.5)]" 
                        : "border-white/40 hover:border-white/60 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]"}
                    `}
                  >
                    {images[product.id] ? (
                      <img src={images[product.id]} alt={product.name} className="w-20 h-20 md:w-24 md:h-24 object-contain" />
                    ) : (
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/20 animate-pulse" />
                    )}
                  </motion.div>

                  {/* Product label */}
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-48 text-center">
                    <p className="text-sm font-semibold text-white mb-1">
                      {product.name}
                    </p>
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
                    >
                      <span>Info</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId={`selected-${product.id}`}
                      className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-white flex items-center justify-center shadow-lg"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <span className="text-blue-900 text-sm font-bold">✓</span>
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
        className="absolute bottom-4 md:bottom-8 right-4 md:right-8 flex flex-wrap gap-2 md:gap-4 justify-end"
      >
        <button
          onClick={reset}
          className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-red-500/30 hover:bg-red-500/40 text-white font-semibold uppercase tracking-wider transition-all backdrop-blur-sm border border-red-500/50 text-sm md:text-base"
        >
          Reset
        </button>
        {currentStepIndex > 0 && (
          <button
            onClick={() => goToStep(currentStepIndex - 1)}
            className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold uppercase tracking-wider transition-all backdrop-blur-sm border border-white/30 text-sm md:text-base"
          >
            Back
          </button>
        )}
        
        {/* For optional steps: show both Skip and Continue */}
        {!activeStepConfig.required && (
          <>
            <button
              onClick={() => {
                setSelection(state.activeStep, undefined);
                if (currentStepIndex < steps.length - 1) {
                  goToStep(currentStepIndex + 1);
                } else {
                  setShowSummary(true);
                }
              }}
              className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-yellow-500/20 hover:bg-yellow-500/30 text-white font-semibold uppercase tracking-wider transition-all backdrop-blur-sm border border-yellow-500/40 text-sm md:text-base"
            >
              Skip This
            </button>
            
            {hasCurrentSelection() && (
              <button
                onClick={() => {
                  if (currentStepIndex < steps.length - 1) {
                    goToStep(currentStepIndex + 1);
                  } else {
                    setShowSummary(true);
                  }
                }}
                className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-green-500/20 hover:bg-green-500/30 text-white font-semibold uppercase tracking-wider transition-all backdrop-blur-sm border border-green-500/40 text-sm md:text-base"
              >
                Keep & Continue
              </button>
            )}
          </>
        )}
        
        {/* For required steps: only Continue */}
        {activeStepConfig.required && (
          <button
            disabled={!canContinue()}
            onClick={() => {
              if (currentStepIndex < steps.length - 1) {
                goToStep(currentStepIndex + 1);
              } else {
                setShowSummary(true);
              }
            }}
            className="px-4 md:px-8 py-2 md:py-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold uppercase tracking-wider transition-all backdrop-blur-sm border border-white/40 shadow-[0_0_20px_rgba(255,255,255,0.3)] disabled:opacity-40 disabled:cursor-not-allowed disabled:shadow-none text-sm md:text-base"
          >
            {currentStepIndex < steps.length - 1 
              ? (hasCurrentSelection() ? "Continue" : "Select to Continue")
              : "Finish & Review"}
          </button>
        )}
      </motion.div>

      {/* Summary Modal */}
      {showSummary && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowSummary(false)}
        >
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white/10 backdrop-blur-md border border-white/30 rounded-2xl p-6 md:p-8 max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Your Build Summary</h2>
            
            {/* Required selections */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-white/80 mb-3">Required Components</h3>
              {state.selections.wheelbase && (
                <BuildItem 
                  label="Wheelbase" 
                  product={steps[0].products.find(p => p.id === state.selections.wheelbase)} 
                  image={state.selections.wheelbase ? images[state.selections.wheelbase] : undefined}
                />
              )}
              {state.selections.wheel && (
                <BuildItem 
                  label="Wheel" 
                  product={steps[1].products.find(p => p.id === state.selections.wheel)} 
                  image={state.selections.wheel ? images[state.selections.wheel] : undefined}
                />
              )}
            </div>
            
            {/* Optional selections */}
            {(state.selections.pedals || state.selections.shifter_handbrake || (state.selections.accessories && state.selections.accessories.length > 0)) && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-white/80 mb-3">Optional Components</h3>
                {state.selections.pedals && (
                  <BuildItem 
                    label="Pedals" 
                    product={steps[2].products.find(p => p.id === state.selections.pedals)} 
                    image={state.selections.pedals ? images[state.selections.pedals] : undefined}
                  />
                )}
                {state.selections.shifter_handbrake && (
                  <BuildItem 
                    label="Shifter/Handbrake" 
                    product={steps[3].products.find(p => p.id === state.selections.shifter_handbrake)} 
                    image={state.selections.shifter_handbrake ? images[state.selections.shifter_handbrake] : undefined}
                  />
                )}
                {state.selections.accessories && Array.isArray(state.selections.accessories) && state.selections.accessories.length > 0 && (
                  <>
                    {state.selections.accessories.map(accId => {
                      const product = steps[4].products.find(p => p.id === accId);
                      return product ? (
                        <BuildItem 
                          key={accId}
                          label="Accessory" 
                          product={product}
                          image={images[accId]}
                        />
                      ) : null;
                    })}
                  </>
                )}
              </div>
            )}
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                onClick={() => {
                  const buildList = generateBuildList(state.selections);
                  navigator.clipboard.writeText(buildList);
                  toast.success("Build list copied to clipboard!");
                }}
                className="flex-1 px-4 md:px-6 py-3 bg-blue-500/30 hover:bg-blue-500/40 rounded-xl text-white font-semibold transition-all"
              >
                Copy Build List
              </button>
              
              <button
                onClick={() => setShowSummary(false)}
                className="px-4 md:px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all"
              >
                Close
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// Helper component for build items in summary
const BuildItem = ({ label, product, image }: { label: string, product?: Product, image?: string }) => {
  if (!product) return null;
  return (
    <div className="flex items-center gap-3 mb-3 p-3 bg-white/5 rounded-lg">
      {image && (
        <img src={image} alt={product.name} className="w-12 h-12 object-contain" />
      )}
      <div className="flex-1">
        <p className="text-white font-medium">{product.name}</p>
        <p className="text-white/60 text-sm">{label}</p>
      </div>
      <a 
        href={product.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-400 hover:text-blue-300"
      >
        <ExternalLink className="w-5 h-5" />
      </a>
    </div>
  );
};

// Helper function to generate formatted build list
const generateBuildList = (selections: Record<string, string | string[] | undefined>): string => {
  let list = "🏁 My Thrustmaster Build:\n\n";
  
  if (selections.wheelbase) {
    const product = steps[0].products.find(p => p.id === selections.wheelbase);
    if (product) list += `Wheelbase: ${product.name}\n${product.url}\n\n`;
  }
  
  if (selections.wheel) {
    const product = steps[1].products.find(p => p.id === selections.wheel);
    if (product) list += `Wheel: ${product.name}\n${product.url}\n\n`;
  }
  
  if (selections.pedals) {
    const product = steps[2].products.find(p => p.id === selections.pedals);
    if (product) list += `Pedals: ${product.name}\n${product.url}\n\n`;
  }
  
  if (selections.shifter_handbrake) {
    const product = steps[3].products.find(p => p.id === selections.shifter_handbrake);
    if (product) list += `Shifter/Handbrake: ${product.name}\n${product.url}\n\n`;
  }
  
  if (selections.accessories && Array.isArray(selections.accessories) && selections.accessories.length) {
    list += "Accessories:\n";
    selections.accessories.forEach(accId => {
      const product = steps[4].products.find(p => p.id === accId);
      if (product) list += `- ${product.name}\n  ${product.url}\n`;
    });
  }
  
  return list;
};
