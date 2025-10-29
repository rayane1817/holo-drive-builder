import { useState } from "react";
import { motion } from "framer-motion";
import { BuilderFlow } from "@/components/BuilderFlow";
import { builderSteps } from "@/data/builderConfig";
import { Button } from "@/components/ui/button";
import { RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [configuration, setConfiguration] = useState<Record<string, string | string[]>>({});
  const { toast } = useToast();

  const handleComplete = (selections: Record<string, string | string[]>) => {
    setConfiguration(selections);
    setIsComplete(true);
    toast({
      title: "Build Complete!",
      description: "Your racing simulator configuration has been saved.",
    });
  };

  const handleReset = () => {
    setIsComplete(false);
    setConfiguration({});
  };

  return (
    <div className="min-h-screen holo-bg">
      {/* Header */}
      <header className="relative z-10 py-8 border-b border-border/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center space-y-2"
          >
            <h1 className="text-5xl md:text-6xl font-bold text-foreground tracking-tight uppercase font-futuristic">
              Racing Sim Builder
            </h1>
            <p className="text-accent text-sm uppercase tracking-[0.3em]">
              Thrustmaster Ecosystem Configurator
            </p>
          </motion.div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10">
        {!isComplete ? (
          <BuilderFlow steps={builderSteps} onComplete={handleComplete} />
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="container mx-auto px-4 py-12"
          >
            <div className="max-w-4xl mx-auto glass-panel rounded-3xl p-8 md:p-12">
              <div className="text-center space-y-6">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                  className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center glow-strong"
                >
                  <div className="text-4xl">🏁</div>
                </motion.div>

                <h2 className="text-4xl font-bold text-foreground uppercase font-futuristic">
                  Build Complete!
                </h2>

                <p className="text-muted-foreground">
                  Your custom Thrustmaster racing simulator configuration:
                </p>

                <div className="space-y-4 text-left">
                  {Object.entries(configuration).map(([stepId, selection]) => {
                    const step = builderSteps.find((s) => s.id === stepId);
                    if (!step || !selection) return null;

                    return (
                      <div
                        key={stepId}
                        className="glass-panel rounded-xl p-4 border border-primary/20"
                      >
                        <h3 className="text-sm uppercase tracking-wider text-muted-foreground mb-2">
                          {step.label}
                        </h3>
                        {Array.isArray(selection) ? (
                          <div className="space-y-1">
                            {selection.map((id) => {
                              const product = step.products.find((p) => p.id === id);
                              return (
                                <p key={id} className="text-foreground font-semibold">
                                  • {product?.label}
                                </p>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-foreground font-semibold">
                            {step.products.find((p) => p.id === selection)?.label}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                <Button
                  onClick={handleReset}
                  className="glass-panel bg-primary hover:bg-primary/90 text-primary-foreground glow-soft"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Start New Build
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-8 border-t border-border/30 mt-20">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            Unofficial configurator for Thrustmaster racing products
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
