const steps: Step[] = [
  {
    id: "wheelbase",
    label: "Step 1 — Choose Wheelbase",
    type: "choice-grid",
    isOptional: false,
    products: [
      { id: "t818", name: "T818", url: "https://www.thrustmaster.com/en-us/products/t818/" },
      { id: "t300", name: "T300 Racing Servo Base", url: "https://www.thrustmaster.com/en-us/products/t300-racing-wheel-servo-base/" },
      { id: "tx",   name: "TX Racing Wheel Servo Base", url: "https://www.thrustmaster.com/en-us/products/tx-racing-wheel-servo-base/" },
      { id: "tsxw", name: "TS-XW Servo Base", url: "https://www.thrustmaster.com/en-us/products/ts-xw-servo-base/" },
      { id: "tspc", name: "TS-PC Racer", url: "https://www.thrustmaster.com/en-us/products/ts-pc-racer-servo-base/" },
      { id: "tgt2", name: "T-GT II", url: "https://www.thrustmaster.com/en-us/products/t-gt-ii-servo-base/" },
      { id: "t598", name: "T598 Servo Base", url: "https://www.thrustmaster.com/en-us/products/t598-servo-base/" },
      { id: "t500", name: "T500 RS", url: "https://www.thrustmaster.com/en-us/products/t500-rs/" }
    ]
  },
  {
    id: "wheel",
    label: "Step 2 — Choose Wheel Add-On",
    type: "choice-carousel", // <- forces carousel
    isOptional: false,
    compatibility: { "*": ["sf1000","488gt3","488challenge","f1","open","599xx","r383","p310","leather28gt","gte458","250gto","evo32r","hypercar"] },
    products: [
      { id: "sf1000", name: "Ferrari SF1000", url: "https://www.thrustmaster.com/en-us/products/formula-wheel-add-on-ferrari-sf1000-edition/" },
      { id: "488gt3", name: "Ferrari 488 GT3", url: "https://www.thrustmaster.com/en-us/products/ferrari-488-gt3-wheel-add-on/" },
      { id: "488challenge", name: "Ferrari 488 Challenge", url: "https://www.thrustmaster.com/en-us/products/ferrari-488-challenge-wheel-add-on/" },
      { id: "f1", name: "Ferrari F1", url: "https://www.thrustmaster.com/en-us/products/ferrari-f1-wheel-add-on/" },
      { id: "open", name: "TM Open Wheel", url: "https://www.thrustmaster.com/en-us/products/tm-open-wheel-add-on/" },
      { id: "599xx", name: "599XX EVO 30 Alcantara", url: "https://www.thrustmaster.com/en-us/products/599xx-evo-30-wheel-add-on-alcantara/" },
      { id: "r383", name: "Rally Sparco R383 Mod", url: "https://www.thrustmaster.com/en-us/products/rally-wheel-add-on-sparco-r383-mod/" },
      { id: "p310", name: "Sparco P310 Mod", url: "https://www.thrustmaster.com/en-us/products/tm-competition-wheel-add-on-sparco-p310-mod/" },
      { id: "leather28gt", name: "TM Leather 28 GT", url: "https://www.thrustmaster.com/en-us/products/tm-leather-28-gt-wheel-add-on/" },
      { id: "gte458", name: "Ferrari GTE 28 cm", url: "https://support.thrustmaster.com/en/product/ferrarigtewheeladdonf458-en/" },
      { id: "250gto", name: "Ferrari 250 GTO", url: "https://www.thrustmaster.com/en-us/products/ferrari-250-gto-wheel-add-on/" },
      { id: "evo32r", name: "EVO Racing 32R Leather", url: "https://www.thrustmaster.com/en-us/products/evo-racing-32r-leather/" },
      { id: "hypercar", name: "HYPERCAR Wheel Add-On", url: "https://www.thrustmaster.com/en-us/products/hypercar-wheel-add-on/" }
    ]
  },
  {
    id: "pedals",
    label: "Optional — Pedals",
    type: "choice-grid",
    isOptional: true,
    products: [
      { id: "tlcm", name: "T-LCM Pedals", url: "https://www.thrustmaster.com/en-us/products/t-lcm-pedals/" },
      { id: "t3pm", name: "T3PM Pedal Set", url: "https://www.thrustmaster.com/en-us/products/t3pm/" },
      { id: "t3pa", name: "T3PA Add-On", url: "https://www.thrustmaster.com/en-us/products/t3pa-add-on/" },
      { id: "t3papro", name: "T3PA-PRO Add-On", url: "https://www.thrustmaster.com/en-us/products/t3pa-add-on/" }
    ]
  },
  {
    id: "shifter_handbrake",
    label: "Optional — Shifter / Handbrake",
    type: "choice-grid",
    isOptional: true,
    products: [
      { id: "th8a", name: "TH8A Shifter", url: "https://www.thrustmaster.com/en-us/products/th8a-shifter-add-on/" },
      { id: "th8s", name: "TH8S Shifter", url: "https://www.thrustmaster.com/en-us/products/th8s-shifter-add-on/" },
      { id: "tss", name: "TSS Handbrake Sparco Mod", url: "https://www.thrustmaster.com/en-us/products/tss-handbrake-sparco-mod/" },
      { id: "tssplus", name: "TSS Handbrake Sparco Mod+", url: "https://www.thrustmaster.com/en-us/products/tss-handbrake-sparco-mod-plus/" }
    ]
  },
  {
    id: "accessories",
    label: "Optional — Accessories",
    type: "multi-select",
    isOptional: true,
    products: [
      { id: "btled", name: "BT LED Display", url: "https://www.thrustmaster.com/en-us/products/bt-led-display/" },
      { id: "simhub", name: "TM Sim Hub", url: "https://www.thrustmaster.com/en-us/products/tm-sim-hub/" },
      { id: "chrono", name: "T-Chrono Paddles (SF1000)", url: "https://www.thrustmaster.com/en-us/products/t-chrono-paddles/" },
      { id: "db9adapter", name: "DB9 Pedals T.RJ12 Adapter", url: "https://www.thrustmaster.com/en-us/products/db9-pedals-t-rj12-adapter/" },
      { id: "qr", name: "Quick Release Adapter", url: "https://www.thrustmaster.com/en-us/products/quick-release-adapter/" },
      { id: "clamp", name: "TM Racing Clamp", url: "https://www.thrustmaster.com/en-us/products/tm-racing-clamp/" }
    ]
  }
];
