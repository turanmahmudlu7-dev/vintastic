import { Gamepad2, Shield, Heart, Terminal, FileText, PackageCheck, RotateCcw, Lock } from 'lucide-react';
import { useStore } from '../store/useStore';
import { VintasticPaymentPolicy } from '../components/VintasticPaymentPolicy';

export function About() {
  const { content } = useStore();

  const policies = [
    {
      icon: PackageCheck,
      title: 'SHIPPING & DISPATCH',
      color: 'text-[var(--color-accent-blue)]',
      borderColor: 'border-[var(--color-accent-blue)]/30',
      description: 'Orders are processed within 24-48 hours. Standard global shipping takes 3 to 7 business days with end-to-end tracking provided via email.',
    },
    {
      icon: RotateCcw,
      title: 'RETURNS & EXCHANGES',
      color: 'text-[var(--color-accent-yellow)]',
      borderColor: 'border-[var(--color-accent-yellow)]/30',
      description: 'We offer a 14-day hassle-free return and size exchange policy for unworn items in original packaging with intact tags.',
    },
    {
      icon: Shield,
      title: 'PRINT CARE & QUALITY',
      color: 'text-[var(--color-accent-purple)]',
      borderColor: 'border-[var(--color-accent-purple)]/30',
      description: 'To maximize print longevity, wash garment inside-out in cold water. Tumble dry on low heat or hang dry naturally.',
    },
    {
      icon: Lock,
      title: 'PRIVACY & DATA SAFETY',
      color: 'text-[var(--color-accent-green)]',
      borderColor: 'border-[var(--color-accent-green)]/30',
      description: 'Your payment and personal details are strictly encrypted. We respect your digital privacy and never share user data.',
    },
  ];

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
      {/* Hero */}
      <div className="text-center py-10 border-b border-white/10 mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[var(--color-accent-purple)]/20 border border-[var(--color-accent-purple)] text-[var(--color-accent-purple)] font-pixel text-xs mb-6">
          <Gamepad2 className="w-4 h-4" /> ABOUT THE BRAND
        </div>
        <h1 className="text-4xl md:text-6xl font-pixel text-white mb-6">
          THE VINTASTIC STORY
        </h1>
        <p className="text-gray-300 font-body text-lg max-w-2xl mx-auto leading-relaxed">
          {content.aboutText}
        </p>
      </div>

      {/* Vintastic Payment & Deposit Policy */}
      <VintasticPaymentPolicy />

      {/* Feature pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="bg-[#0b0c12] border border-white/10 p-6 pixel-border">
          <Terminal className="w-8 h-8 text-[var(--color-accent-blue)] mb-4" />
          <h3 className="font-pixel text-sm text-white mb-2">ORIGINAL PIXEL DESIGNS</h3>
          <p className="text-gray-400 font-body text-sm leading-relaxed">
            Every shirt, hoodie, and accessory features unique artwork crafted with retro gaming and anime nostalgia.
          </p>
        </div>

        <div className="bg-[#0b0c12] border border-white/10 p-6 pixel-border">
          <Shield className="w-8 h-8 text-[var(--color-accent-purple)] mb-4" />
          <h3 className="font-pixel text-sm text-white mb-2">PREMIUM QUALITY GEAR</h3>
          <p className="text-gray-400 font-body text-sm leading-relaxed">
            Heavyweight cotton, durable stitching, and vivid long-lasting prints engineered to survive every quest.
          </p>
        </div>

        <div className="bg-[#0b0c12] border border-white/10 p-6 pixel-border">
          <Heart className="w-8 h-8 text-[var(--color-accent-red)] mb-4" />
          <h3 className="font-pixel text-sm text-white mb-2">FOR PLAYERS & DREAMERS</h3>
          <p className="text-gray-400 font-body text-sm leading-relaxed">
            Made for those who grew up on title screens, late-night gaming sessions, and timeless anime sagas.
          </p>
        </div>
      </div>

      {/* Policy & Information Section */}
      <div className="border-t border-white/10 pt-12">
        <div className="flex items-center gap-3 mb-8">
          <FileText className="w-6 h-6 text-[var(--color-accent-blue)]" />
          <div>
            <span className="font-pixel text-[10px] text-[var(--color-accent-blue)] tracking-wider uppercase block">
              STORE INFORMATION & GUIDELINES
            </span>
            <h2 className="text-2xl md:text-3xl font-pixel text-white">
              OUR STORE POLICY
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {policies.map((pol, idx) => {
            const Icon = pol.icon;
            return (
              <div 
                key={idx} 
                className={`bg-[#0b0c14] border ${pol.borderColor} p-6 pixel-border relative overflow-hidden group hover:border-white/40 transition-colors`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-5 h-5 ${pol.color}`} />
                  <h3 className="font-pixel text-xs text-white tracking-wider">{pol.title}</h3>
                </div>
                <p className="text-gray-400 font-body text-sm leading-relaxed">
                  {pol.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

