import { useParams, Link } from 'react-router-dom';
import { useStore, OrderItem } from '../store/useStore';
import { useState, useEffect } from 'react';
import { ChevronRight, Shield, ShieldAlert, Sparkles, Box, Gamepad2, Loader2 } from 'lucide-react';
import { motion } from 'motion/react';
import { PixelImageWithSkeleton, PixelSkeletonCard } from '../components/PixelSkeleton';

export function Product() {
  const { id } = useParams<{ id: string }>();
  const products = useStore(state => state.products);
  const addToCart = useStore(state => state.addToCart);
  
  const product = products.find(p => p.id === id);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <h2 className="text-3xl font-pixel text-white mb-4">ITEM NOT FOUND</h2>
        <Link to="/" className="text-[var(--color-accent-blue)] font-pixel border-b border-[var(--color-accent-blue)] pb-1 hover:text-white transition-colors">RETURN TO BASE</Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes.length > 0) {
      alert("Please select a size to equip.");
      return;
    }
    
    const cartItem: Omit<OrderItem, 'cartId'> = {
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize || 'OS',
      quantity,
      image: product.images[0]
    };
    
    addToCart(cartItem);
    alert("Item added to inventory!");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      
      {/* Breadcrumb / Location */}
      <div className="flex items-center gap-2 text-xs font-pixel text-gray-500 mb-8">
        <Link to="/" className="hover:text-white transition-colors">WORLD MAP</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to={`/category/${product.category.toLowerCase()}`} className="hover:text-white transition-colors">{product.category.toUpperCase()}</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[var(--color-accent-blue)]">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Item Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-black border-2 border-white/10 rounded-xl overflow-hidden relative group p-2">
            {/* Holographic scanning effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[var(--color-accent-blue)]/5 to-transparent h-[200%] -translate-y-full group-hover:animate-[scan_2s_ease-in-out_infinite] opacity-0 group-hover:opacity-100 pointer-events-none z-10"></div>
            
            {product.isLimited && (
              <div className="absolute top-6 left-6 z-20">
                <span className="bg-[var(--color-accent-purple)] text-white font-pixel text-xs px-3 py-1.5 rounded pixel-border-sm flex items-center gap-2 shadow-[0_0_10px_rgba(176,38,255,0.5)]">
                  <Sparkles className="w-3 h-3" /> EPIC RARITY
                </span>
              </div>
            )}
            <PixelImageWithSkeleton 
              src={product.images[activeImage] || 'https://via.placeholder.com/600'} 
              alt={product.name}
              loadingText="RENDERING TEXTURE..."
              className="w-full h-full object-cover rounded-lg"
              containerClassName="rounded-lg"
            />
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-4">
              {product.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActiveImage(idx)}
                  className={`aspect-square rounded-lg border-2 overflow-hidden ${activeImage === idx ? 'border-[var(--color-accent-blue)] ring-2 ring-[var(--color-accent-blue)]/40' : 'border-white/10 opacity-60 hover:opacity-100'} transition-all`}
                >
                  <PixelImageWithSkeleton
                    src={img}
                    alt=""
                    loadingText="..."
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Stats & Actions */}
        <div className="flex flex-col">
          
          <div className="bg-[#12141d] border border-white/10 rounded-xl p-6 mb-8 relative">
            <div className="absolute -top-3 -right-3 bg-black border border-white/20 p-2 rounded pixel-border-sm rotate-12">
              <Gamepad2 className="w-5 h-5 text-[var(--color-accent-yellow)]" />
            </div>
            
            <h1 className="text-3xl md:text-4xl font-pixel text-white mb-2 leading-tight">
              {product.name}
            </h1>
            
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-white/10">
              <span className="text-2xl font-pixel text-[var(--color-accent-yellow)]">
                ₼{product.price.toFixed(2)}
              </span>
              {product.discount && (
                <span className="text-gray-500 line-through font-pixel text-sm">
                  ₼{product.discount.toFixed(2)}
                </span>
              )}
            </div>

            <div className="space-y-6">
              {product.sizes.length > 0 && (
                <div>
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-gray-400 font-pixel text-xs">SELECT SIZE:</span>
                    <button className="text-[var(--color-accent-blue)] font-body text-xs hover:underline">SIZE GUIDE</button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`w-12 h-12 flex items-center justify-center rounded font-body text-sm border-2 transition-all ${
                          selectedSize === size 
                            ? 'border-[var(--color-accent-blue)] bg-[var(--color-accent-blue)]/10 text-white' 
                            : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <span className="text-gray-400 font-pixel text-xs mb-3 block">QUANTITY:</span>
                <div className="flex items-center gap-4">
                  <div className="flex items-center border-2 border-white/10 rounded">
                    <button 
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="px-4 py-2 text-white hover:bg-white/5 transition-colors font-pixel"
                    >-</button>
                    <span className="px-4 py-2 text-white font-body min-w-[3rem] text-center">{quantity}</span>
                    <button 
                      onClick={() => setQuantity(quantity + 1)}
                      className="px-4 py-2 text-white hover:bg-white/5 transition-colors font-pixel"
                    >+</button>
                  </div>
                  <p className="text-gray-500 text-xs font-body">
                    {product.inventory > 0 ? `${product.inventory} in stock` : 'Out of stock'}
                  </p>
                </div>
              </div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.inventory === 0}
              className="w-full mt-8 bg-[var(--color-accent-blue)] text-black font-pixel py-4 text-sm hover:bg-white transition-colors pixel-border shadow-[0_0_15px_rgba(0,240,255,0.2)] disabled:bg-gray-600 disabled:text-gray-400 disabled:shadow-none disabled:cursor-not-allowed"
            >
              {product.inventory === 0 ? 'OUT OF STOCK' : 'ADD TO INVENTORY'}
            </button>
          </div>

          {/* Item Lore & Details */}
          <div className="space-y-4">
            <div className="bg-[#12141d] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Box className="w-4 h-4 text-[var(--color-accent-purple)]" />
                <h3 className="text-white font-pixel text-sm">ITEM LORE</h3>
              </div>
              <p className="text-gray-400 font-body text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="bg-[#12141d] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <Shield className="w-4 h-4 text-[var(--color-accent-green)]" />
                <h3 className="text-white font-pixel text-sm">MATERIALS & CARE</h3>
              </div>
              <p className="text-gray-400 font-body text-sm leading-relaxed">
                {product.materials}
              </p>
            </div>

            <div className="bg-[#12141d] border border-white/10 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldAlert className="w-4 h-4 text-[var(--color-accent-red)]" />
                <h3 className="text-white font-pixel text-sm">SHIPPING LOGISTICS</h3>
              </div>
              <p className="text-gray-400 font-body text-sm leading-relaxed">
                {product.shippingInfo}
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
