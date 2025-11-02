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
      { id: "sf1000", name: "Ferrari SF1000", url: "https://www.thrustmaster.com/en-us/products/formula-wheel-add-on-ferrari-sf1000-edition/", price: 399, image: "https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=400" },
      { id: "488-gt3", name: "Ferrari 488 GT3", url: "https://www.thrustmaster.com/en-us/products/ferrari-488-gt3-wheel-add-on/", price: 199, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
      { id: "f1-wheel", name: "Ferrari F1 Wheel", url: "https://www.thrustmaster.com/en-us/products/ferrari-f1-wheel-add-on/", price: 179, image: "https://images.unsplash.com/photo-1612810806563-4cb8265db55f?w=400" },
      { id: "open-wheel", name: "TM Open Wheel", url: "https://www.thrustmaster.com/en-us/products/tm-open-wheel-add-on/", price: 199, image: "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=400" },
      { id: "599xx", name: "599XX EVO 30 Alcantara", url: "https://www.thrustmaster.com/en-us/products/599xx-evo-30-wheel-add-on-alcantara/", price: 199, image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400" },
      { id: "sparco-r383", name: "Rally Wheel Sparco R383", url: "https://www.thrustmaster.com/en-us/products/rally-wheel-add-on-sparco-r383-mod/", price: 199, image: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=400" },
      { id: "sparco-p310", name: "Rally Wheel Sparco P310", url: "https://www.thrustmaster.com/en-us/products/rally-wheel-add-on-sparco-p310-mod/", price: 199, image: "https://images.unsplash.com/photo-1600705722908-bab1e61c0b4d?w=400" },
      { id: "leather-28", name: "TM Leather 28 GT", url: "https://www.thrustmaster.com/en-us/products/tm-leather-28-gt-wheel-add-on/", price: 149, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400" },
      { id: "gte-wheel", name: "Ferrari GTE Wheel (28cm)", url: "https://www.thrustmaster.com/en-us/products/ferrari-gte-wheel-add-on/", price: 169, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
      { id: "250-gto", name: "Ferrari 250 GTO", url: "https://www.thrustmaster.com/en-us/products/ferrari-250-gto-wheel-add-on/", price: 149, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400" },
      { id: "evo-32r", name: "EVO Racing 32R Leather", url: "https://www.thrustmaster.com/en-us/products/evo-racing-32r-leather/", price: 249, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=400" },
      { id: "hypercar", name: "HYPERCAR WHEEL", url: "https://www.thrustmaster.com/en-us/products/hypercar-wheel-add-on/", price: 249, image: "https://images.unsplash.com/photo-1610147323479-a7fb11ffd5dd?w=400" }
    ],
    compatibility: {
      "t818": ["sf1000", "488-gt3", "f1-wheel", "open-wheel", "599xx", "sparco-r383", "sparco-p310", "leather-28", "gte-wheel", "250-gto", "evo-32r", "hypercar"],
      "t598": ["sf1000", "488-gt3", "f1-wheel", "open-wheel", "599xx", "sparco-r383", "sparco-p310", "leather-28", "gte-wheel", "250-gto", "evo-32r", "hypercar"],
      "t300": ["sf1000", "488-gt3", "f1-wheel", "open-wheel", "599xx", "sparco-r383", "sparco-p310", "leather-28", "gte-wheel", "250-gto", "evo-32r", "hypercar"],
      "tx": ["sf1000", "488-gt3", "f1-wheel", "open-wheel", "599xx", "sparco-r383", "sparco-p310", "leather-28", "gte-wheel", "250-gto", "evo-32r", "hypercar"],
      "ts-xw": ["sf1000", "488-gt3", "f1-wheel", "open-wheel", "599xx", "sparco-r383", "sparco-p310", "leather-28", "gte-wheel", "250-gto", "evo-32r", "hypercar"],
      "ts-pc": ["sf1000", "488-gt3", "f1-wheel", "open-wheel", "599xx", "sparco-r383", "sparco-p310", "leather-28", "gte-wheel", "250-gto", "evo-32r", "hypercar"],
      "t-gt-ii": ["sf1000", "488-gt3", "f1-wheel", "open-wheel", "599xx", "sparco-r383", "sparco-p310", "leather-28", "gte-wheel", "250-gto", "evo-32r", "hypercar"],
      "*": ["sf1000", "488-gt3", "f1-wheel", "open-wheel", "599xx", "sparco-r383", "sparco-p310", "leather-28", "gte-wheel", "250-gto", "evo-32r", "hypercar"]
    }
  },
  pedals: {
    id: "pedals",
    label: "Pedals",
    required: false,
    position: { angle: 90 },
    products: [
      { id: "t-lcm", name: "T-LCM", url: "https://www.thrustmaster.com/en-us/products/t-lcm-pedals/", price: 299 },
      { id: "t3pm", name: "T3PM", url: "https://www.thrustmaster.com/en-us/products/t3pm/", price: 399 },
      { id: "raceline-iii", name: "Raceline Pedals III", url: "https://www.thrustmaster.com/en-us/products/raceline-pedals-iii/", price: 349 },
      { id: "t3pa", name: "T3PA", url: "https://www.thrustmaster.com/en-us/products/t3pa-add-on/", price: 149 },
      { id: "t3pa-pro", name: "T3PA-PRO", url: "https://www.thrustmaster.com/en-us/products/t3pa-add-on/", price: 199 }
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
      { id: "bt-led", name: "BT LED Display", url: "https://www.thrustmaster.com/en-us/products/bt-led-display/", price: 119, image: "https://images.unsplash.com/photo-1530893609608-32a9af3aa95c?w=400" },
      { id: "sim-hub", name: "TM Sim Hub", url: "https://www.thrustmaster.com/en-us/products/tm-sim-hub/", price: 99, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400" },
      { id: "chrono-paddles", name: "T-Chrono Paddles", url: "https://www.thrustmaster.com/en-us/products/t-chrono-paddles/", price: 79, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400" },
      { id: "th8-knob", name: "TH8 Sequential Knob", url: "https://www.thrustmaster.com/en-us/products/th8-sequential-knob/", price: 39, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400" },
      { id: "quick-release", name: "Quick Release Adapter", url: "https://www.thrustmaster.com/en-us/products/quick-release-adapter/", price: 59, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400" },
      { id: "cockpit-mount", name: "Cockpit Mounting Kit", url: "https://www.thrustmaster.com/en-us/products/cockpit-mounting-kit/", price: 49, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400" },
      { id: "desk-mount", name: "Desk Mounting Kit", url: "https://www.thrustmaster.com/en-us/products/desk-mounting-kit/", price: 39, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400" },
      { id: "racing-clamp", name: "TM Racing Clamp", url: "https://www.thrustmaster.com/en-us/products/tm-racing-clamp/", price: 29, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400" },
      { id: "pedals-stand", name: "T-Pedals Stand", url: "https://www.thrustmaster.com/en-us/products/t-pedals-stand/", price: 89, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400" },
      { id: "lcm-grip", name: "T-LCM Rubber Grip", url: "https://www.thrustmaster.com/en-us/products/t-lcm-rubber-grip/", price: 19, image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400" }
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
