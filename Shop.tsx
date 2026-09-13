import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { PixelSkeletonCard } from '../components/PixelSkeleton';
import { Search, Filter, Sparkles, Loader2 } from 'lucide-react';

export function Shop() {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high'>('featured');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'ALL GEAR' },
    { id: 't-shirts', label: 'T-SHIRTS' },
    { id: 'hoodies', label: 'HOODIES' },
    { id: 'sweatshirts', label: 'SWEATSHIRTS' },
    { id: 'accessories', label: 'ACCESSORIES' },
    { id: 'collectibles', label: 'COLLECTIBLES' },
  ];

  const handleCategoryChange = (catId: string) => {
    if (catId === selectedCategory) return;
    setIsLoading(true);
    setSelectedCategory(catId);
    setTimeout(() => setIsLoading(false), 300);
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = selectedCategory === 'all' || product.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    return 0;
  });

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="border-b border-white/10 pb-8 mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-[var(--color-accent-blue)]" />
          <span className="font-pixel text-xs text-[var(--color-accent-blue)] tracking-wider uppercase">INVENTORY / STORE</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-pixel text-white mb-4">
          SHOP THE INVENTORY
        </h1>
        <p className="text-gray-400 font-body text-base max-w-2xl">
          Browse original graphic-designed streetwear, accessories, and collectible apparel.
        </p>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 bg-black/60 p-4 border border-white/10 pixel-border-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search items..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-black/80 border border-white/20 pl-10 pr-4 py-2 text-white font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 w-full md:w-auto justify-start md:justify-center">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-3 py-1.5 font-pixel text-[10px] transition-all pixel-border-sm ${
                selectedCategory === cat.id 
                  ? 'bg-[var(--color-accent-purple)] text-white' 
                  : 'bg-black/50 text-gray-400 hover:text-white border border-white/10'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-black/80 border border-white/20 text-white font-pixel text-[10px] py-2 px-3 focus:outline-none focus:border-[var(--color-accent-blue)]"
          >
            <option value="featured">SORT: FEATURED</option>
            <option value="price-low">PRICE: LOW TO HIGH</option>
            <option value="price-high">PRICE: HIGH TO LOW</option>
          </select>
        </div>
      </div>

      {/* Grid or Skeleton */}
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
        <div className="text-center py-20 bg-black/40 border border-white/10 p-8 pixel-border">
          <p className="font-pixel text-lg text-white mb-2">NO ITEMS FOUND</p>
          <p className="text-gray-500 font-body text-sm">Try clearing your search query or selecting another category.</p>
        </div>
      )}
    </div>
  );
}
