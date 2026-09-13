import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { PixelSkeletonCard } from '../components/PixelSkeleton';
import { Layers, Star } from 'lucide-react';

export function Collections() {
  const { collections, products } = useStore();
  const [activeCollection, setActiveCollection] = useState<string>(collections[0] || 'Summer Drop');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleCollectionChange = (colName: string) => {
    if (colName === activeCollection) return;
    setIsLoading(true);
    setActiveCollection(colName);
    setTimeout(() => setIsLoading(false), 300);
  };

  const filteredProducts = products.filter(p => p.collection === activeCollection);

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Layers className="w-5 h-5 text-[var(--color-accent-purple)]" />
          <span className="font-pixel text-xs text-[var(--color-accent-purple)] tracking-wider uppercase">BRAND ARCHIVE</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-pixel text-white mb-4">
          COLLECTIONS
        </h1>
        <p className="text-gray-400 font-body text-base max-w-2xl">
          Explore curated drops organized by series, gaming sagas, and vintage themes.
        </p>
      </div>

      {/* Collection Selector Tabs */}
      <div className="flex overflow-x-auto gap-3 pb-4 mb-8 custom-scrollbar">
        {collections.map((colName) => (
          <button
            key={colName}
            onClick={() => handleCollectionChange(colName)}
            className={`px-6 py-3 font-pixel text-xs whitespace-nowrap transition-all pixel-border-sm flex items-center gap-2 ${
              activeCollection === colName
                ? 'bg-[var(--color-accent-purple)] text-white shadow-[0_0_15px_rgba(176,38,255,0.4)]'
                : 'bg-black/60 text-gray-400 hover:text-white border border-white/10'
            }`}
          >
            <Star className="w-3.5 h-3.5" />
            {colName.toUpperCase()}
          </button>
        ))}
      </div>

      {/* Products in Active Collection or Loading Skeletons */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <PixelSkeletonCard />
          <PixelSkeletonCard />
          <PixelSkeletonCard />
          <PixelSkeletonCard />
        </div>
      ) : filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.slice(0, 4).map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
