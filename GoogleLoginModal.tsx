import React, { useState } from 'react';
import { X, CheckCircle2, AlertCircle } from 'lucide-react';
import { useStore } from '../store/useStore';
import { signInWithGoogleOAuth } from '../lib/googleAuth';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function GoogleLoginModal({ isOpen, onClose, onSuccess }: GoogleLoginModalProps) {
  const { loginWithGoogle } = useStore();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleRealGoogleOAuth = async () => {
    setIsLoading(true);
    setErrorMsg('');
    try {
      const res = await signInWithGoogleOAuth();
      if (res && res.user) {
        loginWithGoogle({
          name: res.user.displayName || 'Google İstifadəçi',
          email: res.user.email || 'user@gmail.com',
          avatar: res.user.photoURL || undefined
        });
        setIsSuccess(true);
        setTimeout(() => {
          setIsSuccess(false);
          if (onSuccess) onSuccess();
          onClose();
        }, 1200);
      }
    } catch (err: any) {
      console.warn('Google OAuth error:', err);
      setErrorMsg(
        err.message || 'Google hesabı ilə giriş zamanı xəta baş verdi. Zəhmət olmasa yenidən cəhd edin.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12141d] border-2 border-blue-500/50 rounded-2xl max-w-md w-full p-6 text-left shadow-[0_0_50px_rgba(59,130,246,0.3)] relative overflow-hidden">
        
        {/* Top Google Colors Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 flex">
          <div className="flex-1 bg-[#4285F4]"></div>
          <div className="flex-1 bg-[#EA4335]"></div>
          <div className="flex-1 bg-[#FBBC05]"></div>
          <div className="flex-1 bg-[#34A853]"></div>
        </div>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {!isSuccess ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="text-center pt-2">
              <div className="w-16 h-16 bg-white/10 border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-md">
                <svg className="w-9 h-9" viewBox="0 0 24 24">
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

              <h3 className="font-pixel text-lg text-white mb-1">
                GOOGLE İLƏ DAXİL OL
              </h3>
              <p className="text-xs text-gray-300 font-body">
                Rəsmi Google hesabınızla tək tıkla saniyələr ərzində daxil olun.
              </p>
            </div>

            {/* Real Google OAuth Button */}
            <div className="space-y-3">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleRealGoogleOAuth}
                className="w-full bg-white hover:bg-gray-100 text-gray-900 font-pixel py-4 px-4 rounded-xl transition-all shadow-xl font-bold text-xs flex items-center justify-center gap-3 border border-gray-300 disabled:opacity-50 cursor-pointer"
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
                <span>{isLoading ? 'GOOGLE PƏNCƏRƏSİ AÇILIR...' : 'RƏSMİ GOOGLE İLƏ DAXİL OL'}</span>
              </button>

              {errorMsg && (
                <div className="bg-red-950/60 border border-red-500/40 p-3 rounded-xl text-xs text-red-300 flex items-center gap-2 font-body">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-400" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            <div className="text-center pt-2 border-t border-white/10">
              <p className="text-[10px] text-gray-500 font-body">
                🔒 Google tərəfindən qorunan rəsmi OAuth2 autentifikasiyası.
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 space-y-3 animate-fadeIn">
            <div className="w-16 h-16 bg-blue-500/20 border-2 border-blue-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(59,130,246,0.5)]">
              <CheckCircle2 className="w-10 h-10 text-blue-400" />
            </div>
            <h3 className="font-pixel text-base text-white">
              GOOGLE HESABI İLƏ DAXİL OLUNDU!
            </h3>
            <p className="text-xs text-blue-300 font-body">
              Xoş gəldiniz! Səhifə yenilənir...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}

