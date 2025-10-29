import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Product {
  id: string;
  label: string;
  url: string;
}

interface BuilderStepProps {
  title: string;
  subtitle?: string;
  products: Product[];
  selectedId?: string;
  onSelect: (productId: string) => void;
  isOptional?: boolean;
  layout?: "grid" | "carousel";
  className?: string;
}

export const BuilderStep = ({
  title,
  subtitle,
  products,
  selectedId,
  onSelect,
  isOptional = false,
  layout = "grid",
  className,
}: BuilderStepProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={cn("w-full", className)}
    >
      <div className="text-center mb-8">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 tracking-wide uppercase font-futuristic">
          {title}
        </h2>
        {subtitle && (
          <p className="text-muted-foreground text-sm uppercase tracking-widest">
            {subtitle}
          </p>
        )}
        {isOptional && (
          <span className="inline-block mt-2 px-4 py-1 rounded-full text-xs uppercase tracking-wider bg-muted text-muted-foreground">
            Optional
          </span>
        )}
      </div>

      <div
        className={cn(
          "gap-6",
          layout === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "flex flex-wrap justify-center"
        )}
      >
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05, y: -5 }}
            onClick={() => onSelect(product.id)}
            className={cn(
              "relative cursor-pointer rounded-2xl p-6 transition-all duration-300",
              "glass-panel",
              selectedId === product.id
                ? "ring-2 ring-primary glow-strong"
                : "hover:glow-soft"
            )}
          >
            <div className="flex flex-col items-center gap-4">
              <div
                className={cn(
                  "w-full aspect-square rounded-xl bg-muted/30 flex items-center justify-center",
                  "border border-border/50",
                  selectedId === product.id && "animate-glow-pulse"
                )}
              >
                <div className="text-4xl font-bold text-primary/30">
                  {product.label.substring(0, 2).toUpperCase()}
                </div>
              </div>

              <div className="text-center space-y-2 w-full">
                <h3 className="text-lg font-semibold text-foreground">
                  {product.label}
                </h3>
                
                <a
                  href={product.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-2 text-xs text-accent hover:text-accent/80 transition-colors"
                >
                  <span>Product Info</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {selectedId === product.id && (
              <motion.div
                layoutId="selected-indicator"
                className="absolute inset-0 rounded-2xl border-2 border-primary pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              />
            )}
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};
