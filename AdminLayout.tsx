import { Outlet, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Image as ImageIcon, LogOut, Shield, Lock, Phone, KeyRound, UserCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import React, { useState } from 'react';
import { GoogleLoginModal } from '../../components/GoogleLoginModal';

export function AdminLayout() {
  const location = useLocation();
  const { currentUser, loginWithPhone, logout, adminPin } = useStore();

  const [adminName, setAdminName] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('50');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [pinInput, setPinInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const navItems = [
    { name: 'DASHBOARD', path: '/admin', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'PRODUCTS', path: '/admin/products', icon: <Package className="w-5 h-5" /> },
    { name: 'ORDERS', path: '/admin/orders', icon: <ShoppingCart className="w-5 h-5" /> },
    { name: 'CONTENT', path: '/admin/content', icon: <ImageIcon className="w-5 h-5" /> },
  ];

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanDigits = phoneNumber.replace(/\D/g, '');
    const fullPhone = `+994 (${phonePrefix}) ${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3, 5)}-${cleanDigits.slice(5, 7)}`;

    const res = loginWithPhone(adminName || 'Admin', fullPhone, pinInput);

    if (!res.isAdmin) {
      setErrorMsg('Təhlükəsizlik xətası: Bu nömrə və ya PİN kod Admin yetkisinə sahib deyil!');
    }
  };

  // If user is not logged in as Admin, show restricted Admin Login Screen
  if (!currentUser || !currentUser.isAdmin) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[#090a10]">
        <div className="bg-[#12141d] border-2 border-[var(--color-accent-purple)]/50 rounded-2xl max-w-md w-full p-8 shadow-[0_0_50px_rgba(176,38,255,0.2)] relative overflow-hidden">
          {/* Neon Header glow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[var(--color-accent-purple)] via-[var(--color-accent-blue)] to-[var(--color-accent-green)]"></div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[var(--color-accent-purple)]/20 border border-[var(--color-accent-purple)] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-inner">
              <Lock className="w-8 h-8 text-[var(--color-accent-purple)]" />
            </div>
            <h2 className="text-xl font-pixel text-white tracking-wider mb-1">
              ADMİN PANELDƏN GİRİŞ
            </h2>
            <p className="text-xs font-body text-gray-400">
              Admin panelinə giriş Google hesabı vasitəsilə həyata keçirilir.
            </p>
          </div>

          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setIsGoogleModalOpen(true)}
              className="w-full bg-white hover:bg-gray-100 text-gray-900 font-pixel py-4 px-4 rounded-xl transition-all shadow-xl font-bold text-xs flex items-center justify-center gap-3 border border-gray-300 cursor-pointer"
            >
              <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>GOOGLE HESABI İLƏ DAXİL OL</span>
            </button>
          </div>

          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <p className="text-[11px] text-gray-500 font-body">
              🔒 Təhlükəsizlik üçün giriş rəsmi Google OAuth2 vasitəsilə qorunur.
            </p>
          </div>
        </div>

        <GoogleLoginModal
          isOpen={isGoogleModalOpen}
          onClose={() => setIsGoogleModalOpen(false)}
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[85vh] bg-[#090a10] border-t border-white/10">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-[#12141d] border-r border-white/10 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6 text-[var(--color-accent-purple)]" />
            <div>
              <h2 className="text-white font-pixel text-xs">ADMIN SYSTEM</h2>
              <p className="text-[10px] text-[var(--color-accent-green)] font-mono flex items-center gap-1 mt-0.5">
                <UserCheck className="w-3 h-3" /> {currentUser.name}
              </p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || (item.path !== '/admin' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-pixel text-xs transition-colors ${
                  isActive 
                    ? 'bg-[var(--color-accent-purple)]/20 text-[var(--color-accent-purple)] border border-[var(--color-accent-purple)]/50' 
                    : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button 
            onClick={logout} 
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-pixel text-xs text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            ÇIXIŞ ET (LOGOUT)
          </button>

          <Link to="/" className="flex items-center gap-3 px-4 py-2 rounded-lg font-pixel text-[10px] text-gray-500 hover:text-white transition-colors">
            MAĞAZAYA QAYIT
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto bg-[#090a10] p-6 lg:p-10">
        <Outlet />
      </div>
    </div>
  );
}

