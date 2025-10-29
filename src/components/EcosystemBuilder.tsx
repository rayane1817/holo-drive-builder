import { useState } from "react";
import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";

interface Product {
  id: string;
  name: string;
  url: string;
  position: { x: string | number; y: string | number };
  category: string;
}

interface EcosystemBuilderProps {
  centerProduct: Product;
  products: Product[];
  onComplete: (selections: string[]) => void;
}

export default function EcosystemBuilder({ centerProduct, products, onComplete }: EcosystemBuilderProps) {
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

  const toggleProduct = (productId: string) => {
    setSelectedProducts(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="relative w-full min-h-screen holo-bg overflow-hidden">
      {/* Header */}
      <div className="absolute top-8 left-8 z-10">
        <h2 className="text-xl md:text-2xl font-futuristic font-semibold uppercase tracking-wider text-foreground">
          Accessories compatible with the
        </h2>
        <div className="mt-2 glass-panel inline-block px-6 py-3 rounded-xl">
          <span className="text-2xl md:text-3xl font-futuristic font-bold uppercase tracking-wide text-primary">
            {centerProduct.name}
          </span>
        </div>
      </div>

      {/* Ecosystem Container */}
      <div className="relative w-full h-[800px] flex items-center justify-center">
        {/* Center Hub */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="absolute"
          style={{
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <div className="relative">
            {/* Glowing ring */}
            <div className="absolute inset-0 rounded-full bg-primary/20 blur-2xl animate-glow-pulse" style={{ width: "200px", height: "200px", left: "-25px", top: "-25px" }} />
            
            {/* Product node */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative w-[150px] h-[150px] rounded-full glass-panel glow-strong flex items-center justify-center cursor-pointer"
            >
              <div className="text-center">
                <div className="text-5xl font-bold text-primary/40 mb-2">
                  {centerProduct.name.substring(0, 4)}
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Connector lines and product nodes */}
        {products.map((product, index) => {
          const isSelected = selectedProducts.includes(product.id);
          const delay = 0.3 + index * 0.1;

          return (
            <div key={product.id}>
              {/* Connector line */}
              <motion.svg
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 0.8, delay }}
                className="absolute top-0 left-0 w-full h-full pointer-events-none"
                style={{ zIndex: 1 }}
              >
                <motion.line
                  x1="50%"
                  y1="50%"
                  x2={product.position.x}
                  y2={product.position.y}
                  stroke="hsla(var(--connector-line), 0.8)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                  animate={{
                    strokeDashoffset: isSelected ? [0, -8] : 0,
                    stroke: isSelected ? "hsla(var(--accent), 1)" : "hsla(var(--connector-line), 0.6)",
                  }}
                  transition={{
                    strokeDashoffset: {
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    },
                  }}
                />
                
                {/* Node connector dot */}
                <motion.circle
                  cx="50%"
                  cy="50%"
                  r="6"
                  fill="hsla(var(--accent), 0.8)"
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.svg>

              {/* Product node */}
              <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay }}
                className="absolute"
                style={{
                  left: product.position.x,
                  top: product.position.y,
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              >
                <div className="relative">
                  {/* Glowing ring */}
                  <motion.div
                    className="absolute inset-0 rounded-full bg-primary/10 blur-xl"
                    style={{ width: "140px", height: "140px", left: "-20px", top: "-20px" }}
                    animate={{
                      boxShadow: isSelected
                        ? [
                            "0 0 20px hsla(var(--accent), 0.4)",
                            "0 0 40px hsla(var(--accent), 0.8)",
                            "0 0 20px hsla(var(--accent), 0.4)",
                          ]
                        : "0 0 15px hsla(var(--primary), 0.3)",
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />

                  {/* Product card */}
                  <motion.div
                    whileHover={{ scale: 1.08, y: -5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleProduct(product.id)}
                    className={`
                      relative w-[100px] h-[100px] rounded-full glass-panel cursor-pointer
                      flex items-center justify-center transition-all duration-300
                      ${isSelected ? "ring-2 ring-accent glow-strong" : "hover:glow-soft"}
                    `}
                  >
                    <div className="text-3xl font-bold text-primary/30">
                      {product.name.substring(0, 3).toUpperCase()}
                    </div>
                  </motion.div>

                  {/* Product label */}
                  <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-40 text-center">
                    <p className="text-sm font-futuristic font-semibold text-foreground mb-1">
                      {product.name}
                    </p>
                    <a
                      href={product.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="inline-flex items-center gap-1 text-xs text-accent hover:text-accent/80 transition-colors"
                    >
                      <span>Info</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Selection indicator */}
                  {isSelected && (
                    <motion.div
                      layoutId={`selected-${product.id}`}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      <span className="text-background text-xs font-bold">✓</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            </div>
          );
        })}
      </div>

      {/* Complete button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 right-8"
      >
        <button
          onClick={() => onComplete(selectedProducts)}
          className="glass-panel px-8 py-4 rounded-xl bg-primary/20 hover:bg-primary/30 text-foreground font-futuristic font-semibold uppercase tracking-wider transition-all glow-soft hover:glow-strong"
        >
          Complete Build ({selectedProducts.length} selected)
        </button>
      </motion.div>
    </div>
  );
}
