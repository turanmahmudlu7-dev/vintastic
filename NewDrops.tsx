import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { Zap, Clock } from 'lucide-react';

export function NewDrops() {
  const { products } = useStore();
  const newProducts = products.filter(p => p.isNew);
  const displayProducts = newProducts.length > 0 ? newProducts : products.slice(0, 6);

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Banner */}
      <div className="bg-[#0b0c14] border border-[var(--color-accent-blue)]/40 p-8 mb-12 relative overflow-hidden pixel-border shadow-[0_0_30px_rgba(0,240,255,0.1)]">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-accent-blue)]/20 border border-[var(--color-accent-blue)] text-[var(--color-accent-blue)] font-pixel text-[10px] mb-4">
            <Zap className="w-3.5 h-3.5" /> RECENTLY RELEASED DROPS
          </div>
          <h1 className="text-4xl md:text-6xl font-pixel text-white mb-4">
            NEW DROPS
          </h1>
          <p className="text-gray-300 font-body text-base leading-relaxed mb-6">
            Fresh original streetwear releases straight from our pixel workshop. Limited quantities available for active collectors.
          </p>
          <div className="flex items-center gap-2 text-gray-400 font-pixel text-xs">
            <Clock className="w-4 h-4 text-[var(--color-accent-yellow)]" />
            <span>SEASON 01 DROPS AVAILABLE NOW</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
