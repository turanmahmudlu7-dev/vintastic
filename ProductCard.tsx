import React from 'react';
import { Link } from 'react-router-dom';
import { Product, useStore } from '../store/useStore';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'motion/react';
import { PixelImageWithSkeleton } from './PixelSkeleton';

interface ProductCardProps {
  product: Product;
  key?: string | number;
}

export function ProductCard({ product }: ProductCardProps) {
  const addToCart = useStore((state) => state.addToCart);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    if (product.inventory === 0) {
      alert("OUT OF STOCK");
      return;
    }
    const defaultSize = product.sizes.length > 0 ? product.sizes[0] : 'OS';
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      size: defaultSize,
      quantity: 1,
      image: product.images[0]
    });
    alert("Item added to inventory!");
  };

  return (
    <motion.div 
      whileHover={{ y: -5 }}
      className="group relative bg-[#12141d] rounded-xl border border-white/10 overflow-hidden hover:border-[var(--color-accent-blue)]/50 transition-all duration-300"
    >
      {/* Badges */}
      <div className="absolute top-3 left-3 z-20 flex flex-col gap-2 pointer-events-none">
        {product.isNew && (
          <span className="bg-[var(--color-accent-green)] text-black font-pixel text-[10px] px-2 py-1 rounded pixel-border-sm uppercase shadow-md">
            NEW DROP
          </span>
        )}
        {product.isLimited && (
          <span className="bg-[var(--color-accent-purple)] text-white font-pixel text-[10px] px-2 py-1 rounded pixel-border-sm uppercase text-glow-purple shadow-md">
            EPIC ITEM
          </span>
        )}
        {product.isBestSeller && (
          <span className="bg-[var(--color-accent-yellow)] text-black font-pixel text-[10px] px-2 py-1 rounded pixel-border-sm uppercase shadow-md">
            BEST SELLER
          </span>
        )}
      </div>

      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-black">
        <PixelImageWithSkeleton
          src={product.images[0] || 'https://via.placeholder.com/400'} 
          alt={product.name} 
          loadingText="LOADING GEAR..."
          className="w-full h-full object-cover group-hover:scale-105 transition-all duration-500"
        />
        
        {/* Game-inspired hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-20">
          <div className="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-[var(--color-accent-blue)] font-pixel text-xs mb-1">STATS:</p>
            <p className="text-gray-300 text-xs font-body mb-3">{product.materials}</p>
            <div className="flex items-center justify-between">
              <span className="text-white font-pixel text-[10px] px-3 py-1.5 border border-white/20 rounded hover:bg-white/10 transition-colors">
                VIEW ITEM
              </span>
              <button 
                onClick={handleQuickAdd}
                className="w-8 h-8 flex items-center justify-center bg-[var(--color-accent-blue)]/20 text-[var(--color-accent-blue)] rounded hover:bg-[var(--color-accent-blue)] hover:text-black transition-colors pixel-border-sm"
              >
                <ShoppingCart className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-5 relative">
        <div className="flex justify-between items-start mb-2">
          <Link to={`/product/${product.id}`}>
            <h3 className="text-white font-pixel text-sm hover:text-[var(--color-accent-blue)] transition-colors leading-relaxed">
              {product.name}
            </h3>
          </Link>
          <div className="text-right">
            <p className="text-[var(--color-accent-yellow)] font-pixel text-sm">₼{product.price.toFixed(2)}</p>
            {product.discount && (
              <p className="text-gray-500 text-xs line-through mt-1">₼{product.discount.toFixed(2)}</p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <span className="text-gray-500 text-[10px] font-pixel uppercase">SIZES:</span>
          <div className="flex gap-1">
            {product.sizes.slice(0, 3).map(size => (
              <span key={size} className="text-gray-400 text-xs font-body">{size}</span>
            ))}
            {product.sizes.length > 3 && (
              <span className="text-gray-500 text-xs font-body">+{product.sizes.length - 3}</span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
