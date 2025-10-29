import type { Product } from "./BuilderFlow";
type Props = {
  title: string;
  products: Product[];
  selectedId?: string;
  onSelect: (id: string) => void;
  layout?: "grid" | "carousel";
};
export default function BuilderStep({ title, products, selectedId, onSelect, layout = "grid" }: Props) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {layout === "carousel" ? (
        <div className="flex overflow-x-auto gap-4 pb-2">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`min-w-[220px] p-4 rounded-lg border ${
                selectedId === p.id ? "border-cyan-400 bg-white/10" : "border-white/20 hover:bg-white/5"
              }`}
            >
              <div className="font-medium">{p.name}</div>
              <a href={p.url} target="_blank" rel="noreferrer" className="text-sm text-cyan-300 underline">
                Official page
              </a>
            </button>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <button
              key={p.id}
              onClick={() => onSelect(p.id)}
              className={`p-4 rounded-lg border ${
                selectedId === p.id ? "border-cyan-400 bg-white/10" : "border-white/20 hover:bg-white/5"
              }`}
            >
              <div className="font-medium">{p.name}</div>
              <a href={p.url} target="_blank" rel="noreferrer" className="text-sm text-cyan-300 underline">
                Official page
              </a>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
