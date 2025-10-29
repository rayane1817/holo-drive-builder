import BuilderFlow, { Step } from "../components/BuilderFlow";

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
      { id: "tgt2", name: "T-GT II", url: "https://www.thrustmaster.com/en-us/products/t-gt-ii-servo-base/" }
    ]
  },
  {
    id: "wheel",
    label: "Step 2 — Choose Wheel Add-On",
    type: "choice-carousel", // forces carousel layout
    isOptional: false,
    compatibility: { "*": ["sf1000","open","599xx"] },
    products: [
      { id: "sf1000", name: "Ferrari SF1000", url: "https://www.thrustmaster.com/en-us/products/formula-wheel-add-on-ferrari-sf1000-edition/" },
      { id: "open",   name: "TM Open Wheel",  url: "https://www.thrustmaster.com/en-us/products/tm-open-wheel-add-on/" },
      { id: "599xx",  name: "599XX EVO 30",  url: "https://www.thrustmaster.com/en-us/products/599xx-evo-30-wheel-add-on-alcantara/" }
    ]
  },
  {
    id: "pedals",
    label: "Optional — Pedals",
    type: "choice-grid",
    isOptional: true,
    products: [
      { id: "tlcm", name: "T-LCM Pedals", url: "https://www.thrustmaster.com/en-us/products/t-lcm-pedals/" },
      { id: "t3pm", name: "T3PM",         url: "https://www.thrustmaster.com/en-us/products/t3pm/" }
    ]
  },
  {
    id: "shifter_handbrake",
    label: "Optional — Shifter / Handbrake",
    type: "choice-grid",
    isOptional: true,
    products: [
      { id: "th8a", name: "TH8A Shifter", url: "https://www.thrustmaster.com/en-us/products/th8a-shifter-add-on/" },
      { id: "tss",  name: "TSS Handbrake", url: "https://www.thrustmaster.com/en-us/products/tss-handbrake-sparco-mod/" }
    ]
  },
  {
    id: "accessories",
    label: "Optional — Accessories",
    type: "multi-select",
    isOptional: true,
    products: [
      { id: "btled", name: "BT LED Display", url: "https://www.thrustmaster.com/en-us/products/bt-led-display/" },
      { id: "simhub", name: "TM Sim Hub", url: "https://www.thrustmaster.com/en-us/products/tm-sim-hub/" }
    ]
  }
];

function Index() {
  return (
    <div className="min-h-screen bg-[#071A33] text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Racing Sim Set Builder</h1>
        <BuilderFlow steps={steps} onComplete={(sel) => console.log("done", sel)} />
      </div>
    </div>
  );
}

export default Index;
