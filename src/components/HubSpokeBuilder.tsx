import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Check, ChevronRight, ChevronLeft } from "lucide-react";
import { productData, getCompatibleProducts, StepId } from "../data/products";
import { useBuilderState, generateShareUrl } from "../hooks/useBuilderState";
import { resolveProductImage, getCachedImage } from "../services/imageService";
import { useToast } from "./ui/use-toast";

export default function HubSpokeBuilder() {
  const { state, setSelection, setActiveStep, reset } = useBuilderState();
  const { toast } = useToast();
  const [productImages, setProductImages] = useState<Record<string, string>>({});
  const [showSummary, setShowSummary] = useState(false);
  
  const activeStepConfig = productData[state.activeStep];
  const compatibleProducts = getCompatibleProducts(
    state.activeStep,
    state.selections.wheelbase
  );
  
  // Resolve images for all products
  useEffect(() => {
    Object.values(productData).forEach(step => {
      step.products.forEach(product => {
        const cached = getCachedImage(product.url);
        if (cached) {
          setProductImages(prev => ({ ...prev, [product.id]: cached }));
        } else {
          resolveProductImage(product.url, (imageUrl) => {
            if (imageUrl) {
              setProductImages(prev => ({ ...prev, [product.id]: imageUrl }));
            }
          });
        }
      });
    });
  }, []);
  
  const handleHubClick = () => {
    setActiveStep("wheelbase");
  };
  
  const handleSpokeClick = (stepId: StepId) => {
    if (stepId === "wheel" && !state.selections.wheelbase) {
      toast({
        title: "Wheelbase Required",
        description: "Please select a wheelbase first",
        variant: "destructive"
      });
      return;
    }
    setActiveStep(stepId);
  };
  
  const handleProductSelect = (productId: string) => {
    const step = activeStepConfig;
    
    if (step.multi) {
      const current = (state.selections[step.id] || []) as string[];
      const newSelection = current.includes(productId)
        ? current.filter(id => id !== productId)
        : [...current, productId];
      setSelection(step.id, newSelection.length ? newSelection : undefined);
    } else {
      setSelection(step.id, productId);
      
      // If selecting wheelbase, check wheel compatibility
      if (step.id === "wheelbase" && state.selections.wheel) {
        const compatibleWheels = getCompatibleProducts("wheel", productId);
        if (!compatibleWheels.find(w => w.id === state.selections.wheel)) {
          setSelection("wheel", undefined);
          toast({
            title: "Wheel Cleared",
            description: "Your previous wheel selection is not compatible with this wheelbase",
            variant: "destructive"
          });
        }
      }
      
      // Auto-advance for required steps
      if (step.required) {
        const nextStep = step.id === "wheelbase" ? "wheel" : null;
        if (nextStep) {
          setTimeout(() => setActiveStep(nextStep), 300);
        }
      }
    }
  };
  
  const canFinish = !!(state.selections.wheelbase && state.selections.wheel);
  
  const handleContinue = () => {
    if (state.activeStep === "wheelbase") {
      setActiveStep("wheel");
    } else if (state.activeStep === "wheel") {
      setActiveStep("pedals");
    } else if (state.activeStep === "pedals") {
      setActiveStep("shifter_handbrake");
    } else if (state.activeStep === "shifter_handbrake") {
      setActiveStep("accessories");
    } else {
      if (canFinish) setShowSummary(true);
    }
  };
  
  const handleBack = () => {
    const order: StepId[] = ["wheelbase", "wheel", "pedals", "shifter_handbrake", "accessories"];
    const currentIndex = order.indexOf(state.activeStep);
    if (currentIndex > 0) {
      setActiveStep(order[currentIndex - 1]);
    }
  };
  
  const handleCopyShareLink = () => {
    const url = generateShareUrl(state.selections);
    navigator.clipboard.writeText(url);
    toast({
      title: "Link Copied",
      description: "Share this link to restore your configuration"
    });
  };
  
  const spokes = [
    { id: "wheel" as StepId, angle: 0, label: "Wheel", required: true },
    { id: "pedals" as StepId, angle: 90, label: "Pedals", required: false },
    { id: "shifter_handbrake" as StepId, angle: 180, label: "Shifter/Handbrake", required: false },
    { id: "accessories" as StepId, angle: 270, label: "Accessories", required: false }
  ];
  
  if (showSummary) {
    const wheelbaseProduct = productData.wheelbase.products.find(p => p.id === state.selections.wheelbase);
    const wheelProduct = productData.wheel.products.find(p => p.id === state.selections.wheel);
    const pedalsProduct = productData.pedals.products.find(p => p.id === state.selections.pedals);
    const shifterProduct = productData.shifter_handbrake.products.find(p => p.id === state.selections.shifter_handbrake);
    const accessoriesProducts = state.selections.accessories?.map(id =>
      productData.accessories.products.find(p => p.id === id)
    ).filter(Boolean) || [];
    
    return (
      <div className="min-h-screen holo-bg p-8">
        <div className="max-w-4xl mx-auto glass-panel p-8 rounded-xl">
          <h1 className="text-3xl font-futuristic font-bold uppercase mb-8 text-primary">Build Summary</h1>
          
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-foreground">Wheelbase</h3>
                <span className="text-xs bg-accent text-background px-2 py-1 rounded">Required</span>
              </div>
              {wheelbaseProduct && (
                <div className="flex items-center gap-4">
                  {productImages[wheelbaseProduct.id] && (
                    <img src={productImages[wheelbaseProduct.id]} alt={wheelbaseProduct.name} className="w-20 h-20 object-contain rounded" />
                  )}
                  <p className="text-foreground">{wheelbaseProduct.name}</p>
                </div>
              )}
            </div>
            
            <div className="glass-panel p-6 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold text-foreground">Wheel</h3>
                <span className="text-xs bg-accent text-background px-2 py-1 rounded">Required</span>
              </div>
              {wheelProduct && (
                <div className="flex items-center gap-4">
                  {productImages[wheelProduct.id] && (
                    <img src={productImages[wheelProduct.id]} alt={wheelProduct.name} className="w-20 h-20 object-contain rounded" />
                  )}
                  <p className="text-foreground">{wheelProduct.name}</p>
                </div>
              )}
            </div>
            
            {pedalsProduct && (
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-2">Pedals</h3>
                <div className="flex items-center gap-4">
                  {productImages[pedalsProduct.id] && (
                    <img src={productImages[pedalsProduct.id]} alt={pedalsProduct.name} className="w-20 h-20 object-contain rounded" />
                  )}
                  <p className="text-foreground">{pedalsProduct.name}</p>
                </div>
              </div>
            )}
            
            {shifterProduct && (
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-2">Shifter/Handbrake</h3>
                <div className="flex items-center gap-4">
                  {productImages[shifterProduct.id] && (
                    <img src={productImages[shifterProduct.id]} alt={shifterProduct.name} className="w-20 h-20 object-contain rounded" />
                  )}
                  <p className="text-foreground">{shifterProduct.name}</p>
                </div>
              </div>
            )}
            
            {accessoriesProducts.length > 0 && (
              <div className="glass-panel p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-foreground mb-2">Accessories</h3>
                <div className="space-y-2">
                  {accessoriesProducts.map(product => product && (
                    <div key={product.id} className="flex items-center gap-4">
                      {productImages[product.id] && (
                        <img src={productImages[product.id]} alt={product.name} className="w-16 h-16 object-contain rounded" />
                      )}
                      <p className="text-foreground">{product.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="flex gap-4 mt-8">
            <button
              onClick={() => setShowSummary(false)}
              className="glass-panel px-6 py-3 rounded-lg hover:bg-primary/10 transition-colors"
            >
              Back to Builder
            </button>
            <button
              onClick={handleCopyShareLink}
              className="glass-panel px-6 py-3 rounded-lg bg-accent/20 hover:bg-accent/30 transition-colors"
            >
              Copy Share Link
            </button>
            <button
              onClick={() => { reset(); setShowSummary(false); }}
              className="glass-panel px-6 py-3 rounded-lg hover:bg-destructive/20 transition-colors"
            >
              Start Over
            </button>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen holo-bg p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-futuristic font-bold uppercase mb-2 text-center text-primary">
          Thrustmaster Builder
        </h1>
        <p className="text-center text-muted-foreground mb-12">
          Build your racing sim setup step by step
        </p>
        
        {/* Hub and Spokes Layout */}
        <div className="relative h-[600px] mb-12">
          {/* Center Hub - Wheelbase */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
          >
            <button
              onClick={handleHubClick}
              className={`relative w-48 h-48 rounded-full glass-panel glow-strong flex flex-col items-center justify-center cursor-pointer transition-all ${
                state.activeStep === "wheelbase" ? "ring-4 ring-accent" : ""
              }`}
            >
              <span className="text-xs uppercase tracking-wider text-primary mb-2">Wheelbase</span>
              <span className="text-sm font-semibold text-center px-4 text-foreground">
                {state.selections.wheelbase
                  ? productData.wheelbase.products.find(p => p.id === state.selections.wheelbase)?.name || "Selected"
                  : "Select Wheelbase"}
              </span>
              {state.selections.wheelbase && (
                <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                  <Check className="w-5 h-5 text-background" />
                </span>
              )}
            </button>
          </motion.div>
          
          {/* Outer Spokes */}
          {spokes.map((spoke, index) => {
            const radius = 250;
            const x = Math.sin((spoke.angle * Math.PI) / 180) * radius;
            const y = -Math.cos((spoke.angle * Math.PI) / 180) * radius;
            const isDisabled = spoke.id === "wheel" && !state.selections.wheelbase;
            const isActive = state.activeStep === spoke.id;
            const hasSelection = state.selections[spoke.id];
            
            return (
              <motion.div
                key={spoke.id}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 * (index + 1) }}
                className="absolute left-1/2 top-1/2 z-10"
                style={{
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`
                }}
              >
                {/* Connector line */}
                <svg
                  className="absolute top-1/2 left-1/2 pointer-events-none"
                  style={{
                    width: `${radius}px`,
                    height: `${radius}px`,
                    transform: `translate(-50%, -50%) rotate(${spoke.angle}deg)`,
                    transformOrigin: 'center'
                  }}
                >
                  <line
                    x1="50%"
                    y1="100%"
                    x2="50%"
                    y2="0%"
                    stroke={isActive ? "hsla(var(--accent), 1)" : "hsla(var(--connector-line), 0.4)"}
                    strokeWidth="2"
                    strokeDasharray="4 4"
                  />
                </svg>
                
                <button
                  onClick={() => handleSpokeClick(spoke.id)}
                  disabled={isDisabled}
                  className={`relative w-32 h-32 rounded-full glass-panel flex flex-col items-center justify-center cursor-pointer transition-all ${
                    isActive ? "ring-4 ring-accent glow-strong" : "hover:glow-soft"
                  } ${isDisabled ? "opacity-40 cursor-not-allowed" : ""}`}
                >
                  <span className="text-xs uppercase tracking-wider text-primary mb-1">{spoke.label}</span>
                  {spoke.required && (
                    <span className="text-[10px] text-accent">Required</span>
                  )}
                  {hasSelection && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                      <Check className="w-4 h-4 text-background" />
                    </span>
                  )}
                </button>
              </motion.div>
            );
          })}
        </div>
        
        {/* Selection Panel */}
        <div className="glass-panel p-8 rounded-xl mb-8">
          <h2 className="text-2xl font-futuristic font-semibold uppercase mb-6 text-primary">
            {activeStepConfig.label}
            {activeStepConfig.required && (
              <span className="ml-3 text-sm text-accent">Required</span>
            )}
          </h2>
          
          {compatibleProducts.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>No compatible products for your wheelbase.</p>
              <p className="text-sm mt-2">Change your wheelbase or skip this step.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <AnimatePresence mode="popLayout">
                {compatibleProducts.map((product, index) => {
                  const isSelected = activeStepConfig.multi
                    ? (state.selections[activeStepConfig.id] as string[] || []).includes(product.id)
                    : state.selections[activeStepConfig.id] === product.id;
                  
                  return (
                    <motion.button
                      key={product.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleProductSelect(product.id)}
                      className={`glass-panel p-6 rounded-xl text-left transition-all ${
                        isSelected ? "ring-2 ring-accent glow-soft bg-accent/10" : "hover:glow-soft hover:bg-primary/5"
                      }`}
                    >
                      <div className="aspect-square mb-4 rounded-lg bg-muted/20 flex items-center justify-center overflow-hidden">
                        {productImages[product.id] ? (
                          <img
                            src={productImages[product.id]}
                            alt={product.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="w-full h-full animate-pulse bg-gradient-to-br from-primary/5 to-accent/5" />
                        )}
                      </div>
                      
                      <h3 className="font-semibold mb-2 text-foreground">{product.name}</h3>
                      
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 text-sm text-accent hover:text-accent/80 transition-colors"
                      >
                        Official page
                        <ExternalLink className="w-3 h-3" />
                      </a>
                      
                      {isSelected && (
                        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-accent flex items-center justify-center">
                          <Check className="w-5 h-5 text-background" />
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
        
        {/* Footer Actions */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleBack}
            disabled={state.activeStep === "wheelbase"}
            className="glass-panel px-6 py-3 rounded-lg border border-primary/30 hover:border-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          
          <div className="flex gap-4">
            {!activeStepConfig.required && (
              <button
                onClick={handleContinue}
                className="glass-panel px-6 py-3 rounded-lg hover:bg-primary/10 transition-all"
              >
                Skip
              </button>
            )}
            
            <button
              onClick={handleContinue}
              disabled={activeStepConfig.required && !state.selections[activeStepConfig.id]}
              className="glass-panel px-6 py-3 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground glow-soft disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-2"
            >
              {state.activeStep === "accessories" ? (
                canFinish ? (
                  <>
                    <Check className="w-4 h-4" />
                    Finish
                  </>
                ) : (
                  "Select Required Steps"
                )
              ) : (
                <>
                  Continue
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
