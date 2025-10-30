export type Product = {
  id: string;
  name: string;
  url: string;
  image?: string;
};

export type StepId = "wheelbase" | "wheel" | "pedals" | "shifter_handbrake" | "accessories";

export type StepConfig = {
  id: StepId;
  label: string;
  required: boolean;
  multi?: boolean;
  compatibility?: Record<string, string[]>;
  products: Product[];
  position: { angle: number }; // degrees, 0 = top
};

export const productData: Record<StepId, StepConfig> = {
  wheelbase: {
    id: "wheelbase",
    label: "Wheelbase",
    required: true,
    position: { angle: 0 },
    products: [
      { id: "t818", name: "T818", url: "https://www.thrustmaster.com/en-us/products/t818/" },
      { id: "t598", name: "T598", url: "https://www.thrustmaster.com/en-us/products/t598/" },
      { id: "t300", name: "T300 Racing Servo Base", url: "https://www.thrustmaster.com/en-us/products/t300-racing-wheel-servo-base/" },
      { id: "tx", name: "TX Racing Wheel Servo Base", url: "https://www.thrustmaster.com/en-us/products/tx-racing-wheel-servo-base/" },
      { id: "ts-xw", name: "TS-XW Racer", url: "https://www.thrustmaster.com/en-us/products/ts-xw-racer-sparco-p310-competition-mod/" },
      { id: "ts-pc", name: "TS-PC Racer", url: "https://www.thrustmaster.com/en-us/products/ts-pc-racer/" },
      { id: "t-gt-ii", name: "T-GT II", url: "https://www.thrustmaster.com/en-us/products/t-gt-ii/" }
    ]
  },
  wheel: {
    id: "wheel",
    label: "Wheel Add-On",
    required: true,
    position: { angle: 0 },
    products: [
      { id: "sf1000", name: "Ferrari SF1000 Edition", url: "https://www.thrustmaster.com/en-us/products/formula-wheel-add-on-ferrari-sf1000-edition/" },
      { id: "488-gt3", name: "Ferrari 488 GT3 Edition", url: "https://www.thrustmaster.com/en-us/products/488-gt3-wheel-add-on/" },
      { id: "open-wheel", name: "TM Open Wheel Add-On", url: "https://www.thrustmaster.com/en-us/products/tm-open-wheel-add-on/" },
      { id: "599xx", name: "599XX EVO 30 Alcantara Edition", url: "https://www.thrustmaster.com/en-us/products/599xx-evo-30-wheel-add-on-alcantara/" }
    ],
    compatibility: {
      "t818": ["sf1000", "488-gt3", "open-wheel", "599xx"],
      "t598": ["sf1000", "488-gt3", "open-wheel", "599xx"],
      "t300": ["sf1000", "488-gt3", "open-wheel", "599xx"],
      "tx": ["sf1000", "488-gt3", "open-wheel", "599xx"],
      "ts-xw": ["sf1000", "488-gt3", "open-wheel", "599xx"],
      "ts-pc": ["sf1000", "488-gt3", "open-wheel", "599xx"],
      "t-gt-ii": ["sf1000", "488-gt3", "open-wheel", "599xx"],
      "*": ["sf1000", "488-gt3", "open-wheel", "599xx"]
    }
  },
  pedals: {
    id: "pedals",
    label: "Pedals",
    required: false,
    position: { angle: 90 },
    products: [
      { id: "t-lcm", name: "T-LCM Pedals", url: "https://www.thrustmaster.com/en-us/products/t-lcm-pedals/" },
      { id: "t3pa-pro", name: "T3PA-PRO Add-On", url: "https://www.thrustmaster.com/en-us/products/t3pa-add-on/" }
    ]
  },
  shifter_handbrake: {
    id: "shifter_handbrake",
    label: "Shifter / Handbrake",
    required: false,
    position: { angle: 180 },
    products: [
      { id: "th8a", name: "TH8A Shifter", url: "https://www.thrustmaster.com/en-us/products/th8a-shifter-add-on/" },
      { id: "tss", name: "TSS Handbrake Sparco Mod+", url: "https://www.thrustmaster.com/en-us/products/tss-handbrake-sparco-mod/" }
    ]
  },
  accessories: {
    id: "accessories",
    label: "Accessories",
    required: false,
    multi: true,
    position: { angle: 270 },
    products: [
      { id: "bt-led", name: "BT LED Display", url: "https://www.thrustmaster.com/en-us/products/bt-led-display/" },
      { id: "quick-release", name: "Quick Release Adapter", url: "https://www.thrustmaster.com/en-us/products/thrustmaster-quick-release-adapter/" }
    ]
  }
};

export const steps: StepConfig[] = [
  productData.wheelbase,
  productData.wheel,
  productData.pedals,
  productData.shifter_handbrake,
  productData.accessories
];

export const getCompatibleProducts = (
  stepId: StepId,
  wheelbaseId?: string
): Product[] => {
  const step = productData[stepId];
  if (!step.compatibility || !wheelbaseId) {
    return step.products;
  }
  
  const compatibleIds = step.compatibility[wheelbaseId] || step.compatibility["*"] || [];
  return step.products.filter(p => compatibleIds.includes(p.id));
};
