export type Product = {
  id: string;
  name: string;
  url: string;
  image?: string;
  price: number;
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
      { id: "t818", name: "T818", url: "https://www.thrustmaster.com/en-us/products/t818/", price: 799 },
      { id: "t598", name: "T598", url: "https://www.thrustmaster.com/en-us/products/t598/", price: 599 },
      { id: "t300", name: "T300", url: "https://www.thrustmaster.com/en-us/products/t300-racing-wheel-servo-base/", price: 399 },
      { id: "tx", name: "TX", url: "https://www.thrustmaster.com/en-us/products/tx-racing-wheel-servo-base/", price: 399 },
      { id: "ts-xw", name: "TS-XW", url: "https://www.thrustmaster.com/en-us/products/ts-xw-racer-sparco-p310-competition-mod/", price: 599 },
      { id: "ts-pc", name: "TS-PC", url: "https://www.thrustmaster.com/en-us/products/ts-pc-racer/", price: 499 },
      { id: "t-gt-ii", name: "T-GT II", url: "https://www.thrustmaster.com/en-us/products/t-gt-ii/", price: 699 }
    ]
  },
  wheel: {
    id: "wheel",
    label: "Wheel Add-On",
    required: true,
    multi: true,
    position: { angle: 0 },
    products: [
      { id: "sf1000", name: "Ferrari SF1000", url: "https://www.thrustmaster.com/en-us/products/formula-wheel-add-on-ferrari-sf1000-edition/", price: 399 },
      { id: "488-gt3", name: "Ferrari 488 GT3", url: "https://www.thrustmaster.com/en-us/products/488-gt3-wheel-add-on/", price: 199 },
      { id: "open-wheel", name: "TM Open Wheel", url: "https://www.thrustmaster.com/en-us/products/tm-open-wheel-add-on/", price: 199 },
      { id: "599xx", name: "599XX EVO 30 Alcantara", url: "https://www.thrustmaster.com/en-us/products/599xx-evo-30-wheel-add-on-alcantara/", price: 199 },
      { id: "hypercar", name: "HYPERCAR WHEEL", url: "https://www.thrustmaster.com/en-us/products/hypercar-wheel-add-on/", price: 249 },
      { id: "leather-28", name: "TM Leather 28 GT", url: "https://www.thrustmaster.com/en-us/products/tm-leather-28-gt-wheel-add-on/", price: 149 },
      { id: "sparco-r383", name: "Sparco R383 Mod", url: "https://www.thrustmaster.com/en-us/products/sparco-r383-mod/", price: 199 }
    ],
    compatibility: {
      "t818": ["sf1000", "488-gt3", "open-wheel", "599xx", "hypercar", "leather-28", "sparco-r383"],
      "t598": ["sf1000", "488-gt3", "open-wheel", "599xx", "hypercar", "leather-28", "sparco-r383"],
      "t300": ["sf1000", "488-gt3", "open-wheel", "599xx", "hypercar", "leather-28", "sparco-r383"],
      "tx": ["sf1000", "488-gt3", "open-wheel", "599xx", "hypercar", "leather-28", "sparco-r383"],
      "ts-xw": ["sf1000", "488-gt3", "open-wheel", "599xx", "hypercar", "leather-28", "sparco-r383"],
      "ts-pc": ["sf1000", "488-gt3", "open-wheel", "599xx", "hypercar", "leather-28", "sparco-r383"],
      "t-gt-ii": ["sf1000", "488-gt3", "open-wheel", "599xx", "hypercar", "leather-28", "sparco-r383"],
      "*": ["sf1000", "488-gt3", "open-wheel", "599xx", "hypercar", "leather-28", "sparco-r383"]
    }
  },
  pedals: {
    id: "pedals",
    label: "Pedals",
    required: false,
    position: { angle: 90 },
    products: [
      { id: "t-lcm", name: "T-LCM", url: "https://www.thrustmaster.com/en-us/products/t-lcm-pedals/", price: 299 },
      { id: "t3pa", name: "T3PA", url: "https://www.thrustmaster.com/en-us/products/t3pa-add-on/", price: 149 },
      { id: "t3pa-pro", name: "T3PA-PRO", url: "https://www.thrustmaster.com/en-us/products/t3pa-pro-add-on/", price: 199 },
      { id: "t3pm", name: "T3PM", url: "https://www.thrustmaster.com/en-us/products/t3pm/", price: 399 }
    ]
  },
  shifter_handbrake: {
    id: "shifter_handbrake",
    label: "Shifter / Handbrake",
    required: false,
    multi: true,
    position: { angle: 180 },
    products: [
      { id: "th8a", name: "TH8A", url: "https://www.thrustmaster.com/en-us/products/th8a-shifter-add-on/", price: 199 },
      { id: "th8s", name: "TH8S", url: "https://www.thrustmaster.com/en-us/products/th8s-shifter-add-on/", price: 159 },
      { id: "tss", name: "TSS Handbrake Sparco", url: "https://www.thrustmaster.com/en-us/products/tss-handbrake-sparco-mod/", price: 149 }
    ]
  },
  accessories: {
    id: "accessories",
    label: "Accessories",
    required: false,
    multi: true,
    position: { angle: 270 },
    products: [
      { id: "bt-led", name: "BT LED Display", url: "https://www.thrustmaster.com/en-us/products/bt-led-display/", price: 119 },
      { id: "quick-release", name: "Quick Release", url: "https://www.thrustmaster.com/en-us/products/thrustmaster-quick-release-adapter/", price: 59 }
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
