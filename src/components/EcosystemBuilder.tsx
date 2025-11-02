import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { steps } from "@/data/products";
import type { Product } from "@/data/products";
import { useBuilderState, generateShareUrl } from "@/hooks/useBuilderState";
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
  const [currentPage, setCurrentPage] = useState(0);
  
  const currentStepIndex = steps.findIndex(s => s.id === state.activeStep);

  useEffect(() => {
    if (state.selections.wheelbase && state.selections.wheel) {
      const wheelIds = Array.isArray(state.selections.wheel) ? state.selections.wheel : [state.selections.wheel];
      const incompatibleWheels = wheelIds.filter(wheelId => !isWheelCompatible(wheelId, state.selections.wheelbase));
      
      if (incompatibleWheels.length > 0) {
        const remaining = wheelIds.filter(wheelId => !incompatibleWheels.includes(wheelId));
        setSelection("wheel", remaining.length > 0 ? remaining : undefined);
        toast.error("Some selected wheels are not compatible with this wheelbase");
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
  const allDisplayProducts = getFilteredProducts(state.activeStep);
  
  // Split products into pages of max 7 items
  const MAX_PRODUCTS_PER_PAGE = 7;
  const productPages: Product[][] = [];
  for (let i = 0; i < allDisplayProducts.length; i += MAX_PRODUCTS_PER_PAGE) {
    productPages.push(allDisplayProducts.slice(i, i + MAX_PRODUCTS_PER_PAGE));
  }
  
  const displayProducts = productPages[currentPage] || [];
  const totalPages = productPages.length;
  
  const centerProduct = hasWheelbaseSelection
    ? steps.find(s => s.id === "wheelbase")?.products.find(p => p.id === state.selections.wheelbase)
    : null;
  
  // Reset page when step changes
  useEffect(() => {
    setCurrentPage(0);
  }, [state.activeStep]);

  if (!activeStepConfig) return null;

  const isWheelbaseStep = state.activeStep === "wheelbase";
  const showCenterHub = hasWheelbaseSelection && !isWheelbaseStep;

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
        {totalPages > 1 && (
          <div className="mt-2 flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all backdrop-blur-sm border border-white/30"
            >
              ← Prev
            </button>
            <span className="text-sm text-white/80">
              Page {currentPage + 1} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all backdrop-blur-sm border border-white/30"
            >
              Next →
            </button>
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
              <motion.div
                className="relative w-[150px] h-[150px] rounded-full bg-white/10 backdrop-blur-md border-4 border-white/50 flex items-center justify-center"
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
          const angle = index * angleStep - Math.PI / 2 - 0.1; // Start from top, offset left for centering
          
          // Optimized radius for better spacing and visibility
          const radiusPercent = window.innerWidth >= 768 ? 24 : 28; // Smaller on desktop, more centered on mobile
          
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
              {/* Product node */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay }}
                className="absolute"
                style={{ left: position.x, top: position.y, transform: "translate(-50%, -50%)", zIndex: 10 }}
              >
                <div className="relative">
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
                        ? "border-white" 
                        : "border-white/40 hover:border-white/60"}
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
                      <span>${product.price}</span>
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
              {currentStepIndex < steps.length - 1 ? "Skip" : "Finish"}
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
                {currentStepIndex < steps.length - 1 ? "Continue" : "Finish"}
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
            className="px-4 md:px-8 py-2 md:py-4 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold uppercase tracking-wider transition-all backdrop-blur-sm border border-white/40 disabled:opacity-40 disabled:cursor-not-allowed text-sm md:text-base"
          >
            {currentStepIndex < steps.length - 1 
              ? (hasCurrentSelection() ? "Continue" : "Select")
              : "Finish"}
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
                <>
                  {Array.isArray(state.selections.wheel) ? (
                    state.selections.wheel.map(wheelId => {
                      const product = steps[1].products.find(p => p.id === wheelId);
                      return product ? (
                        <BuildItem 
                          key={wheelId}
                          label="Wheel" 
                          product={product}
                          image={images[wheelId]}
                        />
                      ) : null;
                    })
                  ) : (
                    <BuildItem 
                      label="Wheel" 
                      product={steps[1].products.find(p => p.id === state.selections.wheel)} 
                      image={state.selections.wheel ? images[state.selections.wheel] : undefined}
                    />
                  )}
                </>
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
                  <>
                    {Array.isArray(state.selections.shifter_handbrake) ? (
                      state.selections.shifter_handbrake.map(shId => {
                        const product = steps[3].products.find(p => p.id === shId);
                        return product ? (
                          <BuildItem 
                            key={shId}
                            label="Shifter/Handbrake" 
                            product={product}
                            image={images[shId]}
                          />
                        ) : null;
                      })
                    ) : (
                      <BuildItem 
                        label="Shifter/Handbrake" 
                        product={steps[3].products.find(p => p.id === state.selections.shifter_handbrake)} 
                        image={state.selections.shifter_handbrake ? images[state.selections.shifter_handbrake] : undefined}
                      />
                    )}
                  </>
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
            
            {/* Price Summary */}
            <div className="mb-6 p-4 bg-white/10 rounded-xl border border-white/20">
              <h3 className="text-xl font-bold text-white mb-2">Total Price</h3>
              <p className="text-3xl font-bold text-white">${calculateTotalPrice(state.selections)}</p>
            </div>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
              <button
                onClick={() => {
                  const buildList = generateBuildList(state.selections);
                  navigator.clipboard.writeText(buildList);
                  toast.success("Build list copied to clipboard!");
                }}
                className="flex-1 px-4 md:px-6 py-3 bg-blue-500/30 hover:bg-blue-500/40 rounded-xl text-white font-semibold transition-all uppercase tracking-wider"
              >
                Copy Build List
              </button>
              
              <button
                onClick={() => {
                  const shareUrl = generateShareUrl(state.selections);
                  navigator.clipboard.writeText(shareUrl);
                  toast.success("Share link copied to clipboard!");
                }}
                className="flex-1 px-4 md:px-6 py-3 bg-cyan-500/30 hover:bg-cyan-500/40 rounded-xl text-white font-semibold transition-all uppercase tracking-wider"
              >
                Share Build
              </button>
              
              <button
                onClick={() => setShowSummary(false)}
                className="px-4 md:px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-white font-semibold transition-all uppercase tracking-wider"
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
      <div className="flex items-center gap-3">
        <p className="text-white font-semibold">${product.price}</p>
        <a 
          href={product.url} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-blue-400 hover:text-blue-300"
        >
          <ExternalLink className="w-5 h-5" />
        </a>
      </div>
    </div>
  );
};

// Helper function to calculate total price
const calculateTotalPrice = (selections: Record<string, string | string[] | undefined>): number => {
  let total = 0;
  
  if (selections.wheelbase) {
    const product = steps[0].products.find(p => p.id === selections.wheelbase);
    if (product) total += product.price;
  }
  
  if (selections.wheel) {
    if (Array.isArray(selections.wheel)) {
      selections.wheel.forEach(wheelId => {
        const product = steps[1].products.find(p => p.id === wheelId);
        if (product) total += product.price;
      });
    } else {
      const product = steps[1].products.find(p => p.id === selections.wheel);
      if (product) total += product.price;
    }
  }
  
  if (selections.pedals) {
    const product = steps[2].products.find(p => p.id === selections.pedals);
    if (product) total += product.price;
  }
  
  if (selections.shifter_handbrake) {
    if (Array.isArray(selections.shifter_handbrake)) {
      selections.shifter_handbrake.forEach(shId => {
        const product = steps[3].products.find(p => p.id === shId);
        if (product) total += product.price;
      });
    } else {
      const product = steps[3].products.find(p => p.id === selections.shifter_handbrake);
      if (product) total += product.price;
    }
  }
  
  if (selections.accessories && Array.isArray(selections.accessories)) {
    selections.accessories.forEach(accId => {
      const product = steps[4].products.find(p => p.id === accId);
      if (product) total += product.price;
    });
  }
  
  return total;
};

// Helper function to generate formatted build list
const generateBuildList = (selections: Record<string, string | string[] | undefined>): string => {
  let list = "🏁 My Thrustmaster Build:\n\n";
  let totalPrice = 0;
  
  if (selections.wheelbase) {
    const product = steps[0].products.find(p => p.id === selections.wheelbase);
    if (product) {
      list += `Wheelbase: ${product.name} - $${product.price}\n${product.url}\n\n`;
      totalPrice += product.price;
    }
  }
  
  if (selections.wheel) {
    if (Array.isArray(selections.wheel)) {
      selections.wheel.forEach(wheelId => {
        const product = steps[1].products.find(p => p.id === wheelId);
        if (product) {
          list += `Wheel: ${product.name} - $${product.price}\n${product.url}\n\n`;
          totalPrice += product.price;
        }
      });
    } else {
      const product = steps[1].products.find(p => p.id === selections.wheel);
      if (product) {
        list += `Wheel: ${product.name} - $${product.price}\n${product.url}\n\n`;
        totalPrice += product.price;
      }
    }
  }
  
  if (selections.pedals) {
    const product = steps[2].products.find(p => p.id === selections.pedals);
    if (product) {
      list += `Pedals: ${product.name} - $${product.price}\n${product.url}\n\n`;
      totalPrice += product.price;
    }
  }
  
  if (selections.shifter_handbrake) {
    if (Array.isArray(selections.shifter_handbrake)) {
      selections.shifter_handbrake.forEach(shId => {
        const product = steps[3].products.find(p => p.id === shId);
        if (product) {
          list += `Shifter/Handbrake: ${product.name} - $${product.price}\n${product.url}\n\n`;
          totalPrice += product.price;
        }
      });
    } else {
      const product = steps[3].products.find(p => p.id === selections.shifter_handbrake);
      if (product) {
        list += `Shifter/Handbrake: ${product.name} - $${product.price}\n${product.url}\n\n`;
        totalPrice += product.price;
      }
    }
  }
  
  if (selections.accessories && Array.isArray(selections.accessories) && selections.accessories.length) {
    list += "Accessories:\n";
    selections.accessories.forEach(accId => {
      const product = steps[4].products.find(p => p.id === accId);
      if (product) {
        list += `- ${product.name} - $${product.price}\n  ${product.url}\n`;
        totalPrice += product.price;
      }
    });
    list += "\n";
  }
  
  list += `💰 Total Price: $${totalPrice}`;
  
  return list;
};
