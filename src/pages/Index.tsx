import { useState } from "react";
import { BuilderFlow, Step } from "@/components/BuilderFlow";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, ExternalLink } from "lucide-react";

const steps: Step[] = [
  {
    id: "wheelbase",
    label: "Step 1 — Choose Wheelbase",
    type: "choice-grid",
    isOptional: false,
    products: [
      { id: "t818", label: "T818", url: "https://www.thrustmaster.com/en-us/products/t818/" },
      { id: "t300", label: "T300 Racing Servo Base", url: "https://www.thrustmaster.com/en-us/products/t300-racing-wheel-servo-base/" },
      { id: "tx",   label: "TX Racing Wheel Servo Base", url: "https://www.thrustmaster.com/en-us/products/tx-racing-wheel-servo-base/" },
      { id: "tsxw", label: "TS-XW Servo Base", url: "https://www.thrustmaster.com/en-us/products/ts-xw-servo-base/" },
      { id: "tspc", label: "TS-PC Racer", url: "https://www.thrustmaster.com/en-us/products/ts-pc-racer-servo-base/" },
      { id: "tgt2", label: "T-GT II", url: "https://www.thrustmaster.com/en-us/products/t-gt-ii-servo-base/" },
      { id: "t598", label: "T598 Servo Base", url: "https://www.thrustmaster.com/en-us/products/t598-servo-base/" },
      { id: "t500", label: "T500 RS", url: "https://www.thrustmaster.com/en-us/products/t500-rs/" }
    ]
  },
  {
    id: "wheel",
    label: "Step 2 — Choose Wheel Add-On",
    type: "choice-carousel",
    isOptional: false,
    products: [
      { id: "sf1000", label: "Ferrari SF1000", url: "https://www.thrustmaster.com/en-us/products/formula-wheel-add-on-ferrari-sf1000-edition/" },
      { id: "488gt3", label: "Ferrari 488 GT3", url: "https://www.thrustmaster.com/en-us/products/ferrari-488-gt3-wheel-add-on/" },
      { id: "488challenge", label: "Ferrari 488 Challenge", url: "https://www.thrustmaster.com/en-us/products/ferrari-488-challenge-wheel-add-on/" },
      { id: "f1", label: "Ferrari F1", url: "https://www.thrustmaster.com/en-us/products/ferrari-f1-wheel-add-on/" },
      { id: "open", label: "TM Open Wheel", url: "https://www.thrustmaster.com/en-us/products/tm-open-wheel-add-on/" },
      { id: "599xx", label: "599XX EVO 30 Alcantara", url: "https://www.thrustmaster.com/en-us/products/599xx-evo-30-wheel-add-on-alcantara/" },
      { id: "r383", label: "Rally Sparco R383 Mod", url: "https://www.thrustmaster.com/en-us/products/rally-wheel-add-on-sparco-r383-mod/" },
      { id: "p310", label: "Sparco P310 Mod", url: "https://www.thrustmaster.com/en-us/products/tm-competition-wheel-add-on-sparco-p310-mod/" },
      { id: "leather28gt", label: "TM Leather 28 GT", url: "https://www.thrustmaster.com/en-us/products/tm-leather-28-gt-wheel-add-on/" },
      { id: "gte458", label: "Ferrari GTE 28 cm", url: "https://support.thrustmaster.com/en/product/ferrarigtewheeladdonf458-en/" },
      { id: "250gto", label: "Ferrari 250 GTO", url: "https://www.thrustmaster.com/en-us/products/ferrari-250-gto-wheel-add-on/" },
      { id: "evo32r", label: "EVO Racing 32R Leather", url: "https://www.thrustmaster.com/en-us/products/evo-racing-32r-leather/" },
      { id: "hypercar", label: "HYPERCAR Wheel Add-On", url: "https://www.thrustmaster.com/en-us/products/hypercar-wheel-add-on/" }
    ]
  },
  {
    id: "pedals",
    label: "Optional — Pedals",
    type: "choice-grid",
    isOptional: true,
    products: [
      { id: "tlcm", label: "T-LCM Pedals", url: "https://www.thrustmaster.com/en-us/products/t-lcm-pedals/" },
      { id: "t3pm", label: "T3PM Pedal Set", url: "https://www.thrustmaster.com/en-us/products/t3pm/" },
      { id: "t3pa", label: "T3PA Add-On", url: "https://www.thrustmaster.com/en-us/products/t3pa-add-on/" },
      { id: "t3papro", label: "T3PA-PRO Add-On", url: "https://www.thrustmaster.com/en-us/products/t3pa-add-on/" }
    ]
  },
  {
    id: "shifter_handbrake",
    label: "Optional — Shifter / Handbrake",
    type: "choice-grid",
    isOptional: true,
    products: [
      { id: "th8a", label: "TH8A Shifter", url: "https://www.thrustmaster.com/en-us/products/th8a-shifter-add-on/" },
      { id: "th8s", label: "TH8S Shifter", url: "https://www.thrustmaster.com/en-us/products/th8s-shifter-add-on/" },
      { id: "tss", label: "TSS Handbrake Sparco Mod", url: "https://www.thrustmaster.com/en-us/products/tss-handbrake-sparco-mod/" },
      { id: "tssplus", label: "TSS Handbrake Sparco Mod+", url: "https://www.thrustmaster.com/en-us/products/tss-handbrake-sparco-mod-plus/" }
    ]
  },
  {
    id: "accessories",
    label: "Optional — Accessories",
    type: "multi-select",
    isOptional: true,
    products: [
      { id: "btled", label: "BT LED Display", url: "https://www.thrustmaster.com/en-us/products/bt-led-display/" },
      { id: "simhub", label: "TM Sim Hub", url: "https://www.thrustmaster.com/en-us/products/tm-sim-hub/" },
      { id: "chrono", label: "T-Chrono Paddles (SF1000)", url: "https://www.thrustmaster.com/en-us/products/t-chrono-paddles/" },
      { id: "db9adapter", label: "DB9 Pedals T.RJ12 Adapter", url: "https://www.thrustmaster.com/en-us/products/db9-pedals-t-rj12-adapter/" },
      { id: "qr", label: "Quick Release Adapter", url: "https://www.thrustmaster.com/en-us/products/quick-release-adapter/" },
      { id: "clamp", label: "TM Racing Clamp", url: "https://www.thrustmaster.com/en-us/products/tm-racing-clamp/" }
    ]
  }
];

const Index = () => {
  const [isComplete, setIsComplete] = useState(false);
  const [finalSelections, setFinalSelections] = useState<Record<string, string | string[]>>({});

  const handleComplete = (selections: Record<string, string | string[]>) => {
    setFinalSelections(selections);
    setIsComplete(true);
  };

  const handleReset = () => {
    setIsComplete(false);
    setFinalSelections({});
  };

  const getProductName = (stepId: string, productId: string) => {
    const step = steps.find(s => s.id === stepId);
    const product = step?.products.find(p => p.id === productId);
    return product?.label || productId;
  };

  const getProductUrl = (stepId: string, productId: string) => {
    const step = steps.find(s => s.id === stepId);
    const product = step?.products.find(p => p.id === productId);
    return product?.url;
  };

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-radial from-background-start to-background-end flex items-center justify-center p-4">
        <Card className="glass-panel max-w-2xl w-full p-8 glow-soft">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 mb-4 glow-pulse">
              <Check className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gradient">Build Complete!</h1>
            <p className="text-muted-foreground">Your custom Thrustmaster racing setup</p>
          </div>

          <div className="space-y-4 mb-8">
            {Object.entries(finalSelections).map(([stepId, selection]) => {
              const step = steps.find(s => s.id === stepId);
              if (!step || (Array.isArray(selection) && selection.length === 0)) return null;

              return (
                <div key={stepId} className="glass-panel p-4 border border-border-subtle">
                  <h3 className="font-semibold mb-2 text-sm uppercase tracking-wider text-muted-foreground">
                    {step.label}
                  </h3>
                  {Array.isArray(selection) ? (
                    <div className="space-y-1">
                      {selection.map(id => (
                        <div key={id} className="flex items-center justify-between">
                          <span className="text-foreground">{getProductName(stepId, id)}</span>
                          {getProductUrl(stepId, id) && (
                            <a
                              href={getProductUrl(stepId, id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:text-primary/80 transition-colors"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <span className="text-foreground">{getProductName(stepId, selection)}</span>
                      {getProductUrl(stepId, selection) && (
                        <a
                          href={getProductUrl(stepId, selection)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:text-primary/80 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Button onClick={handleReset} className="w-full glass-panel bg-primary hover:bg-primary/90 glow-soft">
            Build Another Setup
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-radial from-background-start to-background-end">
      <header className="text-center py-12 px-4">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gradient animate-fade-in">
          Thrustmaster Racing Simulator
        </h1>
        <p className="text-lg text-muted-foreground animate-fade-in animation-delay-200">
          Build Your Perfect Racing Setup
        </p>
      </header>

      <BuilderFlow steps={steps} onComplete={handleComplete} />
    </div>
  );
};

export default Index;
