import EcosystemBuilder from "../components/EcosystemBuilder";

const centerProduct = {
  id: "t300",
  name: "T300 Racing Wheel Servo Base",
  url: "https://www.thrustmaster.com/en-us/products/t300-racing-wheel-servo-base/",
  position: { x: 0, y: 0 },
  category: "wheelbase"
};

const ecosystemProducts = [
  // Top
  { id: "t3pa-pro", name: "T3PA-PRO 3 Pedals Add-On", url: "https://www.thrustmaster.com/en-us/products/t3pa-add-on/", position: { x: "50%", y: "15%" }, category: "pedals" },
  
  // Top Left
  { id: "f1-wheel", name: "Ferrari F1 Wheel Add-On", url: "https://www.thrustmaster.com/en-us/products/ferrari-f1-wheel-add-on/", position: { x: "20%", y: "25%" }, category: "wheel" },
  
  // Top Right
  { id: "458-challenge", name: "Ferrari 458 Challenge Wheel Add-On", url: "https://www.thrustmaster.com/en-us/products/ferrari-488-challenge-wheel-add-on/", position: { x: "80%", y: "25%" }, category: "wheel" },
  
  // Left
  { id: "t3pa", name: "T3PA 3 Pedals Add-On", url: "https://www.thrustmaster.com/en-us/products/t3pa-add-on/", position: { x: "15%", y: "50%" }, category: "pedals" },
  
  // Right
  { id: "th8a", name: "TH8A Add-On Shifter", url: "https://www.thrustmaster.com/en-us/products/th8a-shifter-add-on/", position: { x: "85%", y: "50%" }, category: "shifter" },
  
  // Bottom Left
  { id: "leather-28gt", name: "TM Leather 28 GT Wheel Add-On", url: "https://www.thrustmaster.com/en-us/products/tm-leather-28-gt-wheel-add-on/", position: { x: "25%", y: "75%" }, category: "wheel" },
  
  // Bottom Right
  { id: "599xx", name: "599XX Evo 30 Wheel Add-On Alcantara®Edition", url: "https://www.thrustmaster.com/en-us/products/599xx-evo-30-wheel-add-on-alcantara/", position: { x: "75%", y: "75%" }, category: "wheel" },
];

function Index() {
  return (
    <EcosystemBuilder
      centerProduct={centerProduct}
      products={ecosystemProducts}
      onComplete={(selections) => {
        console.log("Build complete:", selections);
        alert(`Build complete! Selected ${selections.length} accessories.`);
      }}
    />
  );
}

export default Index;
