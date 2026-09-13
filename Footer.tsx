import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-black/60 border-t border-white/10 pt-16 pb-8 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-1">
            <span className="font-pixel text-2xl tracking-wider text-white mb-4 block text-glow-blue">
              VINTASTIC
            </span>
            <p className="text-gray-400 text-sm mb-6 max-w-xs leading-relaxed">
              Original designs inspired by games, anime, movies and everything worth remembering.
            </p>
            <div className="flex space-x-4">
              <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center hover:bg-[var(--color-accent-blue)]/20 transition-colors cursor-pointer pixel-border-sm">
                <span className="font-pixel text-xs text-white">IG</span>
              </div>
              <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center hover:bg-[var(--color-accent-purple)]/20 transition-colors cursor-pointer pixel-border-sm">
                <span className="font-pixel text-xs text-white">X</span>
              </div>
              <div className="w-8 h-8 bg-white/5 rounded flex items-center justify-center hover:bg-[var(--color-accent-red)]/20 transition-colors cursor-pointer pixel-border-sm">
                <span className="font-pixel text-xs text-white">TT</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-pixel text-sm text-[var(--color-accent-yellow)] mb-4">SHOP</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">All Products</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">T-Shirts</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Hoodies & Sweats</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Accessories</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Collectibles</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-pixel text-sm text-[var(--color-accent-blue)] mb-4">SUPPORT</h3>
            <ul className="space-y-3">
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Shipping & Returns</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Size Guide</Link></li>
              <li><Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-pixel text-sm text-[var(--color-accent-purple)] mb-4">JOIN THE PARTY</h3>
            <p className="text-gray-400 text-sm mb-4">Subscribe to unlock exclusive drops and hidden items.</p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="YOUR EMAIL" 
                className="bg-black/50 border border-white/20 text-white px-4 py-2 w-full focus:outline-none focus:border-[var(--color-accent-purple)] font-body text-sm rounded-l"
              />
              <button className="bg-[var(--color-accent-purple)] text-white px-4 py-2 font-pixel text-xs hover:bg-[var(--color-accent-purple)]/80 transition-colors rounded-r pixel-border-sm">
                JOIN
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-xs font-pixel mb-4 md:mb-0">
            © {new Date().getFullYear()} VINTASTIC. ALL RIGHTS RESERVED.
          </p>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-500 hover:text-white text-xs font-pixel">PRIVACY</Link>
            <Link to="/" className="text-gray-500 hover:text-white text-xs font-pixel">TERMS</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
