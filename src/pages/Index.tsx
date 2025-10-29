import BuilderFlow, { Step } from "../components/BuilderFlow";

const steps: Step[] = [
  {
    id: "wheelbase",
    label: "Step 1 — Choose Wheelbase",
    type: "choice-grid",
    products: [
      { id: "t818", label: "T818", url: "https://www.thrustmaster.com/en-us/products/t818/" },
      { id: "t300", label: "T300", url: "https://www.thrustmaster.com/en-us/products/t300-racing-wheel-servo-base/" }
    ]
  },
  {
    id: "wheel",
    label: "Step 2 — Choose Wheel",
    type: "choice-carousel",
    products: [
      { id: "sf1000", label: "SF1000", url: "https://www.thrustmaster.com/en-us/products/formula-wheel-add-on-ferrari-sf1000-edition/" },
      { id: "open", label: "TM Open Wheel", url: "https://www.thrustmaster.com/en-us/products/tm-open-wheel-add-on/" }
    ]
  }
];

export default function Index() {
  return (
    <div className="min-h-screen p-6">
      <BuilderFlow steps={steps} onComplete={(s) => console.log("DONE", s)} />
    </div>
  );
}

