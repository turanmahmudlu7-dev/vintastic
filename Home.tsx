import { Link } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ProductCard } from '../components/ProductCard';
import { motion } from 'motion/react';
import { Star, Zap } from 'lucide-react';

export function Home() {
  const { products, content } = useStore();
  const newDrops = products.filter(p => p.isNew).slice(0, 4);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 4);

  return (
    <div className="w-full">
      {/* Hero Section - Scaled slimly to match exact photo aspect ratio */}
      <section className="relative w-full overflow-hidden border-b border-white/10 flex items-center bg-[#07080c] min-h-[380px] md:min-h-[480px] lg:min-h-[540px] py-10 md:py-14">
        {/* Background Image Container */}
        <div className="absolute inset-0 z-0 bg-[#07080c] flex items-center justify-center">
          <img 
            src="https://i.ibb.co/VY3LtXfZ/2a2a87d5-2195-4a0b-8d98-e2ec224df66e.jpg" 
            alt="Hero Background" 
            className="w-full h-full object-cover filter contrast-125 opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-primary-base)] via-[var(--color-primary-base)]/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-primary-base)]/70 via-transparent to-transparent"></div>
          
          {/* Animated Particles/Stars */}
          <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white rounded-full animate-pulse opacity-50"></div>
          <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-[var(--color-accent-blue)] rounded-full animate-ping opacity-20"></div>
          <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-[var(--color-accent-purple)] rounded-full animate-pulse opacity-40"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-black/80 border border-white/20 rounded-none mb-4 backdrop-blur-md pixel-border-sm">
              <span className="text-gray-300 text-[9px] font-pixel tracking-wider uppercase">ORIGINAL DESIGNS / GAMES / ANIME / MOVIES / MORE</span>
            </div>
            
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-pixel text-white mb-4 leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.9)] tracking-wide">
              WEAR THE<br/>ADVENTURE.
            </h1>
            
            <p className="text-xs sm:text-sm text-gray-200 mb-6 font-body max-w-lg leading-relaxed drop-shadow-md bg-black/60 p-3 rounded border border-white/10 backdrop-blur-md">
              {content.heroSubtitle}
            </p>
            
            <div className="flex flex-wrap gap-3 items-center">
              <Link 
                to="/shop" 
                className="bg-[var(--color-accent-purple)]/90 backdrop-blur-sm text-white px-6 py-2.5 font-pixel text-xs hover:bg-[var(--color-accent-purple)] transition-colors pixel-border shadow-[0_0_15px_rgba(176,38,255,0.6)] flex items-center gap-2 border border-[var(--color-accent-blue)]"
              >
                EXPLORE COLLECTION <span className="text-[var(--color-accent-blue)] text-sm">→</span>
              </Link>
              <Link 
                to="/new" 
                className="bg-black/70 backdrop-blur-sm text-[var(--color-accent-blue)] px-6 py-2.5 font-pixel text-xs border border-[var(--color-accent-blue)] hover:bg-[var(--color-accent-blue)]/20 transition-colors pixel-border shadow-[0_0_10px_rgba(0,240,255,0.2)]"
              >
                NEW DROPS
              </Link>
            </div>
            
            <div className="mt-6 flex items-center gap-3">
              <div className="w-32 h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="w-1/3 h-full bg-[var(--color-accent-purple)]"></div>
              </div>
              <span className="font-pixel text-[9px] text-gray-400 uppercase">SCROLL ↓</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Categories / Menu Options */}
      <section className="py-12 bg-[var(--color-primary-base)] border-b border-white/5 relative z-20 -mt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-3 h-3 bg-[var(--color-accent-purple)] rounded-sm animate-pulse"></div>
            <h2 className="text-xl font-pixel text-white tracking-widest">SHOP BY CATEGORY</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'T-Shirts', icon: '👕', color: 'blue' },
              { name: 'Hoodies', icon: '🧥', color: 'purple' },
              { name: 'Sweatshirts', icon: '🧶', color: 'red' },
              { name: 'Accessories', icon: '🧢', color: 'yellow' },
              { name: 'Collectibles', icon: '⭐', color: 'green' },
              { name: 'Other', icon: '❓', color: 'gray' },
            ].map((cat, i) => (
              <Link key={i} to={`/category/${cat.name.toLowerCase()}`}>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-black border border-gray-800 rounded-none p-4 flex items-center justify-between group hover:border-[var(--color-accent-blue)] transition-colors pixel-border-sm"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl filter drop-shadow-md">{cat.icon}</span>
                    <span className="font-pixel text-[10px] text-white tracking-wider group-hover:text-[var(--color-accent-blue)] transition-colors">{cat.name.toUpperCase()}</span>
                  </div>
                  <span className="text-gray-600 font-pixel text-xs group-hover:text-[var(--color-accent-blue)] transition-colors">→</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Drops */}
      <section className="py-20 bg-[var(--color-primary-base)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Star className="w-5 h-5 text-[var(--color-accent-yellow)]" fill="currentColor" />
              <h2 className="text-2xl font-pixel text-white tracking-widest">FEATURED DROPS</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-white font-pixel text-[10px] transition-colors">
              VIEW ALL <span className="text-lg text-[var(--color-accent-blue)]">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newDrops.length > 0 ? newDrops.map(product => (
              <ProductCard key={product.id} product={product} />
            )) : products.slice(0, 4).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Quest / Promotional Section */}
      <section className="py-12 bg-black relative border-y border-[var(--color-accent-purple)]/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#090a10] border border-[var(--color-accent-purple)]/50 p-2 relative overflow-hidden flex flex-col md:flex-row items-center gap-6 pixel-border">
            
            <div className="w-full md:w-2/3 h-64 md:h-80 relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#090a10] z-10 hidden md:block"></div>
              <img 
                src="https://i.ibb.co/SwzQVtVx/5a471cd0-5902-4366-a097-a0e6d850dc9f.jpg" 
                alt="Quest Drop - Pirate Ship" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
            
            <div className="w-full md:w-1/3 p-6 md:p-8 flex flex-col justify-center relative z-20">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-[var(--color-accent-yellow)] font-pixel text-xs">QUEST #01</span>
              </div>
              <h2 className="text-3xl font-pixel text-white mb-4 leading-tight">
                THE NEW DROP
              </h2>
              <p className="text-gray-400 font-body text-sm mb-8 leading-relaxed">
                A new collection has arrived. Are you ready for the next chapter?
              </p>
              
              <Link to="/quest" className="bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)] border border-[var(--color-accent-purple)] px-6 py-3 font-pixel text-xs hover:bg-[var(--color-accent-purple)] hover:text-white transition-colors pixel-border w-max">
                EXPLORE NOW →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="py-20 bg-[var(--color-primary-base)] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-12 border-b border-white/10 pb-4">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 text-[var(--color-accent-red)]" fill="currentColor" />
              <h2 className="text-2xl font-pixel text-white tracking-widest">BEST SELLERS</h2>
            </div>
            <Link to="/shop" className="hidden md:flex items-center gap-2 text-gray-500 hover:text-white font-pixel text-[10px] transition-colors">
              VIEW ALL <span className="text-lg text-[var(--color-accent-blue)]">→</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 lg:grid-cols-5 gap-4">
            {bestSellers.length > 0 ? bestSellers.map(product => (
              <ProductCard key={product.id} product={product} />
            )) : products.slice(0, 5).map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
