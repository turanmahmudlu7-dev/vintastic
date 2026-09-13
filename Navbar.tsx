import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Search, User, Menu, X, Trash2, Phone, CheckCircle2, ShieldCheck, LogOut, Shield, KeyRound, Package, UserCheck, MessageCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { WhatsAppVerifyModal } from './WhatsAppVerifyModal';
import { GoogleLoginModal } from './GoogleLoginModal';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);
  
  const { cart, removeFromCart, updateCartQuantity, placeOrder, currentUser, loginWithPhone, logout, orders } = useStore();
  const cartItemsCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  const [customerName, setCustomerName] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('50'); // 10, 50, 51, 55, 60, 70, 77, 99, 12, custom
  const [customPrefix, setCustomPrefix] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<{ id: string; name: string; phone: string } | null>(null);

  // Auth & Orders Modals State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMyOrdersOpen, setIsMyOrdersOpen] = useState(false);
  const [loginNameInput, setLoginNameInput] = useState('');
  const [loginPhonePrefix, setLoginPhonePrefix] = useState('50');
  const [loginPhoneNum, setLoginPhoneNum] = useState('');
  const [loginPinInput, setLoginPinInput] = useState('');
  const [authMsg, setAuthMsg] = useState('');

  // WhatsApp Verification State
  const [isWpModalOpen, setIsWpModalOpen] = useState(false);
  const [wpVerifyTargetPhone, setWpVerifyTargetPhone] = useState('');
  const [wpVerifyTargetName, setWpVerifyTargetName] = useState('');
  const [wpSourceAction, setWpSourceAction] = useState<'LOGIN' | 'CHECKOUT'>('LOGIN');

  const getEffectivePrefix = (pref: string, custPref: string) => {
    if (pref === 'custom') {
      return custPref.replace(/\D/g, '') || '50';
    }
    return pref;
  };

  const formatAzPhone = (digits: string) => {
    const pref = getEffectivePrefix(phonePrefix, customPrefix);
    const cleanDigits = digits.replace(/\D/g, '').slice(0, 7);
    return `+994 (${pref}) ${cleanDigits.slice(0, 3)}${cleanDigits.length > 3 ? '-' + cleanDigits.slice(3, 5) : ''}${cleanDigits.length > 5 ? '-' + cleanDigits.slice(5, 7) : ''}`;
  };

  const handleStartCheckout = () => {
    if (currentUser) {
      setCustomerName(currentUser.name);
      setPhoneNumber(currentUser.phone.replace(/\D/g, '').slice(-7));
    }
    setIsCheckingOut(true);
  };

  const handleTriggerWhatsAppLogin = () => {
    setAuthMsg('');
    const cleanDigits = loginPhoneNum.replace(/\D/g, '');
    if (cleanDigits.length !== 7) {
      setAuthMsg('Zəhmət olmasa 7 rəqəmli nömrəni tam daxil edin!');
      return;
    }

    const fullPhone = `+994 (${loginPhonePrefix}) ${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3, 5)}-${cleanDigits.slice(5, 7)}`;
    setWpVerifyTargetPhone(fullPhone);
    setWpVerifyTargetName(loginNameInput || 'İstifadəçi');
    setWpSourceAction('LOGIN');
    setIsWpModalOpen(true);
  };

  const handleTriggerWhatsAppCheckout = () => {
    setPhoneError('');
    const cleanDigits = phoneNumber.replace(/\D/g, '');
    const pref = getEffectivePrefix(phonePrefix, customPrefix);

    if (!customerName.trim()) {
      alert('Zəhmət olmasa Ad və Soyadınızı daxil edin');
      return;
    }

    if (cleanDigits.length !== 7) {
      setPhoneError('Zəhmət olmasa 7 rəqəmli nömrəni tam daxil edin! (Nümunə: 123 45 67)');
      return;
    }

    const fullPhone = `+994 (${pref}) ${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3, 5)}-${cleanDigits.slice(5, 7)}`;
    setWpVerifyTargetPhone(fullPhone);
    setWpVerifyTargetName(customerName.trim());
    setWpSourceAction('CHECKOUT');
    setIsWpModalOpen(true);
  };

  const handleWpVerifiedSuccess = () => {
    if (wpSourceAction === 'LOGIN') {
      const res = loginWithPhone(wpVerifyTargetName, wpVerifyTargetPhone, loginPinInput, true);
      setAuthMsg(res.message);
      setIsAuthModalOpen(false);
      setLoginPinInput('');
    } else if (wpSourceAction === 'CHECKOUT') {
      const fullPhone = wpVerifyTargetPhone;
      placeOrder(wpVerifyTargetName, fullPhone, customerEmail.trim(), true);
      const orderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      setOrderSuccess({ id: orderId, name: wpVerifyTargetName, phone: fullPhone });
      setIsCheckingOut(false);
      setIsCartOpen(false);
    }
  };

  const handleUserLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthMsg('');

    const cleanDigits = loginPhoneNum.replace(/\D/g, '');
    if (cleanDigits.length !== 7) {
      setAuthMsg('Zəhmət olmasa 7 rəqəmli nömrəni tam daxil edin!');
      return;
    }

    const fullPhone = `+994 (${loginPhonePrefix}) ${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3, 5)}-${cleanDigits.slice(5, 7)}`;
    const res = loginWithPhone(loginNameInput || 'İstifadəçi', fullPhone, loginPinInput, true);

    setAuthMsg(res.message);
    setTimeout(() => {
      setIsAuthModalOpen(false);
      setAuthMsg('');
      setLoginPinInput('');
    }, 1200);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError('');

    const cleanDigits = phoneNumber.replace(/\D/g, '');
    const pref = getEffectivePrefix(phonePrefix, customPrefix);

    if (!customerName.trim()) {
      alert('Zəhmət olmasa Ad və Soyadınızı daxil edin');
      return;
    }

    if (cleanDigits.length !== 7) {
      setPhoneError('Zəhmət olmasa 7 rəqəmli nömrəni tam daxil edin! (Nümunə: 123 45 67)');
      return;
    }

    const fullPhone = `+994 (${pref}) ${cleanDigits.slice(0, 3)}-${cleanDigits.slice(3, 5)}-${cleanDigits.slice(5, 7)}`;
    
    // Store order
    placeOrder(customerName.trim(), fullPhone, customerEmail.trim(), true);
    
    const orderId = `ORD-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    setOrderSuccess({ id: orderId, name: customerName.trim(), phone: fullPhone });
    
    setIsCheckingOut(false);
    setIsCartOpen(false);
    if (!currentUser) {
      setCustomerName('');
      setPhoneNumber('');
      setCustomPrefix('');
      setCustomerEmail('');
    }
  };

  // User's own placed orders
  const myUserOrders = currentUser
    ? orders.filter(o => o.customerPhone && o.customerPhone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, ''))
    : [];

  return (
    <>
      <nav className="sticky top-0 z-50 bg-[#07080c]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white hover:text-[var(--color-accent-blue)] transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>

            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 group">
                <div className="h-12 w-12 rounded-lg overflow-hidden border border-white/10 group-hover:border-[var(--color-accent-purple)]/80 transition-all duration-300 shadow-[0_0_15px_rgba(176,38,255,0.15)] flex items-center justify-center bg-[#07080c]">
                  <img 
                    src="https://i.ibb.co/XxjkSKgS/85f26acfa94ad4fb68231c3f049c30da-tplv-tiktokx-cropcenter-1080-1080.jpg" 
                    alt="Vintastic Logo" 
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                </div>
                <span className="font-pixel text-lg sm:text-xl text-white tracking-wider group-hover:text-[var(--color-accent-blue)] transition-colors drop-shadow">
                  VINTASTIC
                </span>
              </Link>
            </div>

            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <Link to="/shop" className="text-white hover:text-[var(--color-accent-yellow)] px-3 py-2 text-sm font-pixel transition-colors duration-200">SHOP</Link>
                <Link to="/new" className="text-white hover:text-[var(--color-accent-blue)] px-3 py-2 text-sm font-pixel transition-colors duration-200">NEW DROPS</Link>
                <Link to="/collections" className="text-white hover:text-[var(--color-accent-purple)] px-3 py-2 text-sm font-pixel transition-colors duration-200">COLLECTIONS</Link>
                <Link to="/about" className="text-white hover:text-[var(--color-accent-green)] px-3 py-2 text-sm font-pixel transition-colors duration-200">ABOUT</Link>
              </div>
            </div>

            <div className="flex items-center space-x-3 md:space-x-5">
              
              {/* User Account Button / Google Login Indicator */}
              <button
                onClick={() => {
                  if (currentUser) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsGoogleModalOpen(true);
                  }
                }}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border font-pixel text-xs transition-all ${
                  currentUser 
                    ? currentUser.isAdmin
                      ? 'bg-[var(--color-accent-purple)]/20 border-[var(--color-accent-purple)] text-[var(--color-accent-purple)] shadow-[0_0_10px_rgba(176,38,255,0.3)]'
                      : 'bg-emerald-950/40 border-emerald-500/50 text-emerald-400'
                    : 'bg-white/5 border-white/10 text-white hover:border-blue-400 hover:text-blue-300'
                }`}
              >
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {currentUser ? currentUser.name : 'GOOGLE İLƏ GİRİŞ'}
                </span>
              </button>

              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-white hover:text-[var(--color-accent-yellow)] transition-colors relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[var(--color-accent-red)] text-white text-[10px] font-pixel px-1.5 py-0.5 rounded-full pixel-border-sm">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {isOpen && (
          <div className="md:hidden bg-black/95 border-b border-white/10">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 flex flex-col">
              <Link to="/shop" onClick={() => setIsOpen(false)} className="text-white hover:text-[var(--color-accent-yellow)] block px-3 py-2 text-base font-pixel">SHOP</Link>
              <Link to="/new" onClick={() => setIsOpen(false)} className="text-white hover:text-[var(--color-accent-blue)] block px-3 py-2 text-base font-pixel">NEW DROPS</Link>
              <Link to="/collections" onClick={() => setIsOpen(false)} className="text-white hover:text-[var(--color-accent-purple)] block px-3 py-2 text-base font-pixel">COLLECTIONS</Link>
              <Link to="/about" onClick={() => setIsOpen(false)} className="text-white hover:text-[var(--color-accent-green)] block px-3 py-2 text-base font-pixel">ABOUT</Link>
              <button 
                onClick={() => {
                  setIsOpen(false);
                  if (currentUser) {
                    setIsAuthModalOpen(true);
                  } else {
                    setIsGoogleModalOpen(true);
                  }
                }}
                className="text-left text-[var(--color-accent-yellow)] block px-3 py-2 text-base font-pixel"
              >
                {currentUser ? `PROFİL (${currentUser.name})` : 'GOOGLE İLƏ GİRİŞ'}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Slide-over Cart */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[100] overflow-hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 max-w-md w-full flex">
            <div className="w-full h-full bg-[#12141d] border-l border-white/10 shadow-2xl flex flex-col scanlines">
              
              <div className="px-6 py-6 border-b border-white/10 flex items-center justify-between z-10 bg-black/50">
                <h2 className="text-xl font-pixel text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-[var(--color-accent-blue)]" /> 
                  INVENTORY
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-white">
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Cart Content */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-600 mb-4 stroke-1" />
                    <p className="text-gray-400 font-pixel text-sm">INVENTORY IS EMPTY</p>
                    <p className="text-gray-600 text-xs mt-1 font-body">Equip some gear from the shop to start!</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={`${item.productId}-${item.size}`} className="flex gap-4 p-3 bg-black/40 border border-white/10 rounded-lg">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded bg-black" />
                      <div className="flex-1">
                        <h4 className="text-white font-pixel text-xs">{item.name}</h4>
                        <p className="text-[var(--color-accent-blue)] font-pixel text-xs mt-1">
                          ₼{item.price.toFixed(2)} | SIZE: {item.size}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <button 
                            onClick={() => updateCartQuantity(item.productId, item.size, Math.max(1, item.quantity - 1))}
                            className="w-5 h-5 bg-white/10 text-white rounded flex items-center justify-center font-pixel text-xs hover:bg-white/20"
                          >
                            -
                          </button>
                          <span className="text-white font-pixel text-xs w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQuantity(item.productId, item.size, item.quantity + 1)}
                            className="w-5 h-5 bg-white/10 text-white rounded flex items-center justify-center font-pixel text-xs hover:bg-white/20"
                          >
                            +
                          </button>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => removeFromCart(item.productId, item.size)}
                        className="text-gray-500 hover:text-[var(--color-accent-red)] transition-colors self-start"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Checkout / Form area */}
              {cart.length > 0 && (
                <div className="p-6 border-t border-white/10 bg-black/60">
                  {!isCheckingOut ? (
                    <>
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-400 font-pixel text-xs">TOTAL CREDITS:</span>
                        <span className="text-[var(--color-accent-yellow)] font-pixel text-lg">₼{cartTotal.toFixed(2)}</span>
                      </div>
                      <button 
                        onClick={handleStartCheckout}
                        className="w-full bg-[var(--color-accent-blue)] text-black font-pixel py-4 text-sm hover:bg-white transition-colors pixel-border shadow-[0_0_15px_rgba(0,240,255,0.2)] font-bold"
                      >
                        PROCEED TO CHECKOUT
                      </button>
                    </>
                  ) : (
                    <form onSubmit={handleCheckout} className="space-y-4">
                      <div className="flex justify-between items-center mb-2 border-b border-white/10 pb-3">
                        <span className="text-white font-pixel text-xs text-[var(--color-accent-blue)] flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4" /> SİFARİŞİN RƏSMİLƏŞDİRİLMƏSİ
                        </span>
                        <button type="button" onClick={() => setIsCheckingOut(false)} className="text-gray-400 hover:text-white font-pixel text-[10px]">
                          LƏĞV ET
                        </button>
                      </div>
                      
                      {/* Customer Name */}
                      <div>
                        <label className="block font-pixel text-[10px] text-gray-400 mb-1">
                          AD VƏ SOYAD <span className="text-red-400">*</span>
                        </label>
                        <input 
                          required
                          type="text" 
                          placeholder="Əli Məmmədov" 
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="w-full bg-black/70 border border-white/20 text-white px-3.5 py-2.5 font-body text-sm rounded-lg focus:outline-none focus:border-[var(--color-accent-yellow)]"
                        />
                      </div>

                      {/* Azerbaijan Phone Number Input */}
                      <div>
                        <label className="block font-pixel text-[10px] text-gray-400 mb-1 flex items-center justify-between">
                          <span>AZƏRBAYCAN NÖMRƏSİ <span className="text-red-400">*</span></span>
                          <span className="text-[10px] text-[var(--color-accent-yellow)] font-mono">+994</span>
                        </label>
                        <div className="flex gap-2">
                          {/* Prefix Dropdown */}
                          <div className="relative">
                            <select
                              value={phonePrefix}
                              onChange={(e) => setPhonePrefix(e.target.value)}
                              className="bg-black/90 border border-white/20 text-[var(--color-accent-yellow)] font-pixel text-xs px-2.5 py-2.5 rounded-lg focus:outline-none focus:border-[var(--color-accent-yellow)] cursor-pointer"
                            >
                              <option value="10">010 (Azercell)</option>
                              <option value="50">050 (Azercell)</option>
                              <option value="51">051 (Azercell)</option>
                              <option value="55">055 (Bakcell)</option>
                              <option value="99">099 (Bakcell)</option>
                              <option value="70">070 (Nar)</option>
                              <option value="77">077 (Nar)</option>
                              <option value="60">060 (Naxtel)</option>
                              <option value="12">012 (Bakı Şəhər)</option>
                              <option value="custom">Digər / Xüsusi...</option>
                            </select>
                          </div>

                          {/* Custom Prefix Input if selected */}
                          {phonePrefix === 'custom' && (
                            <div className="w-20">
                              <input
                                required
                                type="text"
                                placeholder="0XX"
                                value={customPrefix}
                                onChange={(e) => setCustomPrefix(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                className="w-full bg-black/90 border border-[var(--color-accent-yellow)] text-[var(--color-accent-yellow)] px-2.5 py-2.5 font-mono text-xs rounded-lg text-center focus:outline-none"
                              />
                            </div>
                          )}

                          {/* 7 Digit Input */}
                          <div className="relative flex-1">
                            <input 
                              required
                              type="tel" 
                              placeholder="123 45 67" 
                              value={phoneNumber}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, '').slice(0, 7);
                                setPhoneNumber(val);
                                if (phoneError) setPhoneError('');
                              }}
                              className="w-full bg-black/70 border border-white/20 text-white px-3.5 py-2.5 font-mono text-sm rounded-lg focus:outline-none focus:border-[var(--color-accent-blue)] tracking-wider"
                            />
                            <Phone className="w-4 h-4 text-gray-500 absolute right-3 top-1/2 -translate-y-1/2" />
                          </div>
                        </div>

                        {/* Formatted Preview */}
                        <p className="text-[11px] text-gray-400 font-mono mt-1.5 flex items-center justify-between">
                          <span>Format:</span>
                          <span className="text-[var(--color-accent-blue)]">
                            {formatAzPhone(phoneNumber)}
                          </span>
                        </p>

                        {phoneError && (
                          <p className="text-[11px] text-red-400 font-body mt-1">{phoneError}</p>
                        )}
                      </div>

                      {/* Optional Email */}
                      <div>
                        <label className="block font-pixel text-[10px] text-gray-400 mb-1">
                          E-POÇ ÜNVANI <span className="text-gray-600">(İSTƏYƏ BAĞLI)</span>
                        </label>
                        <input 
                          type="email" 
                          placeholder="example@mail.com" 
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                          className="w-full bg-black/70 border border-white/20 text-white px-3.5 py-2.5 font-body text-sm rounded-lg focus:outline-none focus:border-[var(--color-accent-blue)]"
                        />
                      </div>

                      <div className="space-y-2 mt-4">
                        <button 
                          type="button"
                          onClick={handleTriggerWhatsAppCheckout}
                          className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-pixel py-3.5 text-xs sm:text-sm transition-all rounded-lg shadow-[0_0_20px_rgba(16,185,129,0.3)] font-bold tracking-wider flex items-center justify-center gap-2"
                        >
                          <MessageCircle className="w-4 h-4 fill-black" />
                          WHATSAPP KODU İLƏ SİFARİŞİ RƏSMİLƏŞDİR — ₼{cartTotal.toFixed(2)}
                        </button>

                        <button 
                          type="submit"
                          className="w-full bg-white/10 text-white font-pixel py-2.5 text-xs hover:bg-white/20 transition-all rounded-lg border border-white/20 font-semibold"
                        >
                          BİRBAŞA SİFARİŞİ TƏSDİQLƏ
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

            </div>
          </div>
        </div>
      )}

      {/* PHONE LOGIN & USER PROFILE MODAL */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#10121d] border-2 border-white/20 rounded-2xl max-w-md w-full p-6 text-left shadow-2xl relative overflow-hidden animate-fadeIn">
            
            <button 
              onClick={() => setIsAuthModalOpen(false)} 
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            {currentUser ? (
              /* LOGGED IN USER PROFILE VIEW */
              <div className="space-y-5">
                <div className="flex items-center gap-3 border-b border-white/10 pb-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                    currentUser.isAdmin ? 'bg-[var(--color-accent-purple)]/20 border-[var(--color-accent-purple)] text-[var(--color-accent-purple)]' : 'bg-emerald-950/50 border-emerald-500 text-emerald-400'
                  }`}>
                    {currentUser.isAdmin ? <Shield className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-pixel text-base text-white">{currentUser.name}</h3>
                    <p className="font-mono text-xs text-[var(--color-accent-yellow)]">{currentUser.phone}</p>
                    <span className={`text-[10px] font-pixel px-2 py-0.5 rounded inline-block mt-1 ${
                      currentUser.isAdmin ? 'bg-purple-900/60 text-purple-300 border border-purple-500/40' : 'bg-emerald-900/60 text-emerald-300 border border-emerald-500/40'
                    }`}>
                      {currentUser.isAdmin ? 'SİSTEM ADMİNİ' : 'ALICI HESABI'}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {/* View My Orders */}
                  <button
                    onClick={() => { setIsAuthModalOpen(false); setIsMyOrdersOpen(true); }}
                    className="w-full flex items-center justify-between p-3.5 bg-black/50 border border-white/10 rounded-xl hover:border-[var(--color-accent-blue)] transition-colors group"
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-5 h-5 text-[var(--color-accent-blue)]" />
                      <span className="font-pixel text-xs text-white">MƏNİM SİFARİŞLƏRİM</span>
                    </div>
                    <span className="font-mono text-xs text-[var(--color-accent-yellow)] bg-black px-2 py-1 rounded border border-white/10">
                      {myUserOrders.length} ədəd
                    </span>
                  </button>

                  {/* Admin Panel Link if Admin */}
                  {currentUser.isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setIsAuthModalOpen(false)}
                      className="w-full flex items-center justify-between p-3.5 bg-[var(--color-accent-purple)]/20 border border-[var(--color-accent-purple)]/50 rounded-xl hover:bg-[var(--color-accent-purple)]/30 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        <Shield className="w-5 h-5 text-[var(--color-accent-purple)]" />
                        <span className="font-pixel text-xs text-white">ADMİN PANELİNƏ KEÇİD</span>
                      </div>
                      <span className="font-pixel text-[10px] text-[var(--color-accent-purple)]">AÇ &rarr;</span>
                    </Link>
                  )}
                </div>

                <button
                  onClick={() => { logout(); setIsAuthModalOpen(false); }}
                  className="w-full flex items-center justify-center gap-2 bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-800/50 py-3 rounded-xl font-pixel text-xs transition-colors"
                >
                  <LogOut className="w-4 h-4" /> HESABDAN ÇIXIŞ ET
                </button>
              </div>
            ) : (
              /* GOOGLE LOGIN ONLY */
              <div className="space-y-5 text-center py-2">
                <div className="border-b border-white/10 pb-3">
                  <div className="w-12 h-12 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
                    <svg className="w-7 h-7" viewBox="0 0 24 24">
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
                  </div>
                  <h3 className="font-pixel text-base text-white">
                    GOOGLE İLƏ DAXİL OL
                  </h3>
                  <p className="text-xs text-gray-400 font-body mt-1">
                    Google hesabınızla təhlükəsiz və sürətli daxil olun.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => { setIsAuthModalOpen(false); setIsGoogleModalOpen(true); }}
                  className="w-full bg-white hover:bg-gray-100 text-gray-900 font-pixel py-3.5 text-xs rounded-xl transition-all shadow-xl font-bold tracking-wider flex items-center justify-center gap-2.5 border border-gray-300"
                >
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                  <span>RƏSMİ GOOGLE İLƏ DAXİL OL</span>
                </button>
              </div>
            )}

          </div>
        </div>
      )}

      {/* USER'S OWN ORDERS MODAL */}
      {isMyOrdersOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#12141d] border border-white/20 rounded-2xl max-w-xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            
            <div className="flex justify-between items-center p-5 border-b border-white/10 bg-[#0a0b12]">
              <div className="flex items-center gap-2.5">
                <Package className="w-5 h-5 text-[var(--color-accent-blue)]" />
                <h3 className="font-pixel text-sm text-white">MƏNİM SİFARİŞLƏRİM</h3>
              </div>
              <button onClick={() => setIsMyOrdersOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 flex-1">
              {myUserOrders.length === 0 ? (
                <div className="text-center py-12 text-gray-500 font-pixel text-xs">
                  SİZİN HƏLƏ HEC BİR SİFARİŞİNİZ YOXDUR
                </div>
              ) : (
                myUserOrders.map(order => (
                  <div key={order.id} className="bg-[#0b0c14] border border-white/10 rounded-xl p-4 space-y-3">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <div>
                        <span className="font-pixel text-xs text-[var(--color-accent-yellow)]">{order.id}</span>
                        <span className="text-[10px] text-gray-500 font-body ml-2">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span className={`font-pixel text-[10px] px-2 py-0.5 rounded ${
                        order.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30' :
                        order.status === 'FULFILLED' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30' :
                        'bg-red-900/50 text-red-300 border border-red-500/30'
                      }`}>
                        {order.status === 'PENDING' ? 'GÖZLƏNİLİR' : order.status === 'FULFILLED' ? 'ÇATDIRILDI' : 'LƏĞV OLUNDU'}
                      </span>
                    </div>

                    <div className="space-y-2">
                      {(order.items || []).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-3">
                          <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded bg-black" />
                          <div className="flex-1">
                            <p className="font-pixel text-[11px] text-white">{item.name}</p>
                            <p className="text-[10px] text-gray-400 font-body">Ölçü: {item.size} | Say: {item.quantity}</p>
                          </div>
                          <span className="font-pixel text-xs text-gray-300">₼{(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-white/10 text-right">
                      <span className="font-pixel text-xs text-[var(--color-accent-yellow)]">
                        Ümumi: ₼{order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 border-t border-white/10 bg-[#0a0b12] text-right">
              <button
                onClick={() => setIsMyOrdersOpen(false)}
                className="bg-white/10 hover:bg-white text-white hover:text-black px-5 py-2 font-pixel text-xs rounded transition-colors"
              >
                BAĞLA
              </button>
            </div>

          </div>
        </div>
      )}

      {/* SUCCESS CONFIRMATION MODAL */}
      {orderSuccess && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#10121d] border-2 border-[var(--color-accent-green)] rounded-2xl max-w-md w-full p-6 text-center shadow-[0_0_40px_rgba(0,255,102,0.3)] relative animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-[var(--color-accent-green)]" />
            </div>

            <h3 className="font-pixel text-lg text-white mb-2 tracking-wide">
              SİFARİŞİNİZ QƏBUL OLUNDU!
            </h3>
            
            <p className="text-gray-300 font-body text-sm mb-4 leading-relaxed">
              Təbrik edirik <span className="text-white font-bold">{orderSuccess.name}</span>! Sifarişiniz uğurla rəsmiləşdirildi və Admin panelə göndərildi.
            </p>

            <div className="bg-black/60 border border-white/10 p-3.5 rounded-xl space-y-2 mb-6 text-left font-mono text-xs">
              <div className="flex justify-between">
                <span className="text-gray-400">Sifariş Kodu:</span>
                <span className="text-[var(--color-accent-yellow)] font-bold">{orderSuccess.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Telefon Nömrəsi:</span>
                <span className="text-[var(--color-accent-blue)] font-bold">{orderSuccess.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-emerald-400 font-bold">GÖZLƏNİLİR (PENDING)</span>
              </div>
            </div>

            <button
              onClick={() => setOrderSuccess(null)}
              className="w-full bg-[var(--color-accent-green)] text-black font-pixel py-3 text-xs rounded-lg hover:bg-white transition-colors font-bold shadow-md"
            >
              TAMAM VƏ BAĞLA
            </button>
          </div>
        </div>
      )}

      {/* WHATSAPP VERIFY MODAL */}
      <WhatsAppVerifyModal
        isOpen={isWpModalOpen}
        onClose={() => setIsWpModalOpen(false)}
        phone={wpVerifyTargetPhone}
        name={wpVerifyTargetName}
        onVerified={handleWpVerifiedSuccess}
      />

      {/* GOOGLE LOGIN MODAL */}
      <GoogleLoginModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
      />
    </>
  );
}

