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
      { id: "tx",   name: "TX Racing Wheel Servo Base", url: "https://www.thrustmaster.com/en-us/products/tx-racing-wheel-servo-base/" }
    ]
  },
  {
    id: "wheel",
    label: "Step 2 — Choose Wheel Add-On",
    type: "choice-carousel",
    isOptional: false,
    products: [
      { id: "sf1000", name: "Ferrari SF1000", url: "https://www.thrustmaster.com/en-us/products/formula-wheel-add-on-ferrari-sf1000-edition/" },
      { id: "open",   name: "TM Open Wheel",  url: "https://www.thrustmaster.com/en-us/products/tm-open-wheel-add-on/" }
    ]
  }
];

function Index() {
  return (
    <div className="min-h-screen bg-[#071A33] text-white p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Racing Sim Set Builder</h1>
        <BuilderFlow steps={steps} onComplete={(sel) => console.log("Build complete", sel)} />
      </div>
    </div>
  );
}

export default Index;
