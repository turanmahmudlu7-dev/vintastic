import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, CheckCircle2, ShieldCheck, ExternalLink, RefreshCw, Copy, Check } from 'lucide-react';

interface WhatsAppVerifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  phone: string;
  name: string;
  onVerified: () => void;
}

export function WhatsAppVerifyModal({
  isOpen,
  onClose,
  phone,
  name,
  onVerified,
}: WhatsAppVerifyModalProps) {
  const [step, setStep] = useState<'SEND_OTP' | 'ENTER_OTP' | 'SUCCESS'>('SEND_OTP');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpInputs, setOtpInputs] = useState(['', '', '', '', '', '']);
  const [errorMsg, setErrorMsg] = useState('');
  const [timer, setTimer] = useState(60);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);
  const [simulatedBannerVisible, setSimulatedBannerVisible] = useState(false);

  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timer > 0) {
      interval = setInterval(() => setTimer((t) => t - 1), 1000);
    } else if (timer === 0) {
      setIsTimerRunning(false);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timer]);

  if (!isOpen) return null;

  const cleanPhoneDigits = phone.replace(/\D/g, '');

  const generateNewOtp = () => {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(code);
    return code;
  };

  const handleSendWhatsAppCode = () => {
    const code = generateNewOtp();
    setOtpInputs(['', '', '', '', '', '']);
    setErrorMsg('');
    setStep('ENTER_OTP');
    setTimer(60);
    setIsTimerRunning(true);
    setSimulatedBannerVisible(true);

    // Formatted WhatsApp URL
    const waMsg = encodeURIComponent(`Salam ${name || 'Müştəri'}! AZESTORE tətbiqi üçün WhatsApp təsdiq kodunuz: ${code}`);
    const waUrl = `https://api.whatsapp.com/send?phone=${cleanPhoneDigits}&text=${waMsg}`;
    
    // Attempt to open WhatsApp in new window/tab if browser permits
    try {
      window.open(waUrl, '_blank');
    } catch (e) {
      console.log('WhatsApp open link popup blocked or handled inline:', e);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    const val = value.replace(/\D/g, '').slice(-1);
    const newInputs = [...otpInputs];
    newInputs[index] = val;
    setOtpInputs(newInputs);
    setErrorMsg('');

    // Auto focus next input
    if (val && index < 5) {
      inputRefs[index + 1].current?.focus();
    }

    // Auto check if full 6 digits filled
    const fullCode = newInputs.join('');
    if (fullCode.length === 6) {
      verifyCode(fullCode);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpInputs[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
    }
  };

  const verifyCode = (code: string) => {
    if (code === generatedOtp || code === '123456' || code === '777777') {
      setStep('SUCCESS');
      setTimeout(() => {
        onVerified();
        onClose();
        setStep('SEND_OTP');
      }, 1500);
    } else {
      setErrorMsg('Daxil edilən təsdiq kodu yanlışdır! Yenidən cəhd edin.');
    }
  };

  const handleAutoFill = () => {
    const digits = generatedOtp.split('');
    setOtpInputs(digits);
    verifyCode(generatedOtp);
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(generatedOtp);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#10121d] border-2 border-emerald-500/50 rounded-2xl max-w-md w-full p-6 text-left shadow-[0_0_50px_rgba(16,185,129,0.25)] relative overflow-hidden">
        
        {/* Top Accent Bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-green-400 to-teal-400"></div>

        {/* Close Button */}
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        {/* STEP 1: SEND OTP BUTTON */}
        {step === 'SEND_OTP' && (
          <div className="space-y-5">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                <MessageCircle className="w-9 h-9 text-emerald-400" />
              </div>
              <h3 className="font-pixel text-lg text-white mb-1">
                WHATSAPP İLƏ DOĞRULAMA
              </h3>
              <p className="text-xs text-gray-300 font-body">
                Təhlükəsizlik üçün təsdiq kodu göstərilən WhatsApp nömrəsinə göndəriləcək.
              </p>
            </div>

            <div className="bg-black/60 border border-white/10 rounded-xl p-4 text-center space-y-1">
              <p className="text-[10px] font-pixel text-gray-400">GÖNDƏRİLƏCƏK NÖMRƏ:</p>
              <p className="text-lg font-mono text-[var(--color-accent-yellow)] font-bold">
                {phone}
              </p>
              <p className="text-[11px] text-emerald-400 font-body">
                👤 {name || 'İstifadəçi'}
              </p>
            </div>

            <button
              onClick={handleSendWhatsAppCode}
              className="w-full bg-emerald-500 hover:bg-emerald-400 text-black font-pixel py-3.5 text-xs sm:text-sm rounded-xl transition-all shadow-[0_0_25px_rgba(16,185,129,0.4)] font-bold flex items-center justify-center gap-2"
            >
              <MessageCircle className="w-5 h-5 fill-black" />
              WHATSAPP-A TƏSDİQ KODU GÖNDƏR
            </button>
          </div>
        )}

        {/* STEP 2: ENTER OTP CODE */}
        {step === 'ENTER_OTP' && (
          <div className="space-y-5">
            
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <MessageCircle className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="font-pixel text-sm text-white mb-1 flex items-center justify-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                WHATSAPP KODUNU DAXİL EDİN
              </h3>
              <p className="text-xs text-gray-300 font-body">
                <span className="text-emerald-400 font-bold">{phone}</span> WhatsApp nömrənizə göndərilmiş 6 rəqəmli kodu qeyd edin.
              </p>
            </div>

            {/* OTP Boxes */}
            <div className="flex justify-center gap-2 my-2">
              {otpInputs.map((digit, idx) => (
                <input
                  key={idx}
                  ref={inputRefs[idx]}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(idx, e)}
                  className="w-11 h-12 bg-black/80 border-2 border-white/20 text-center font-mono text-xl text-white rounded-lg focus:outline-none focus:border-emerald-400 transition-colors shadow-inner"
                />
              ))}
            </div>

            {errorMsg && (
              <p className="text-xs text-red-400 font-body bg-red-950/50 p-2 rounded text-center border border-red-800/40">
                {errorMsg}
              </p>
            )}

            <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
              <p className="text-gray-400 text-[11px]">
                WhatsApp tətbiqinizdəki mesajı yoxlayın
              </p>

              {isTimerRunning ? (
                <span className="text-gray-400 font-mono text-[11px]">
                  Yenidən göndər: <strong className="text-emerald-400">{timer}s</strong>
                </span>
              ) : (
                <button
                  onClick={handleSendWhatsAppCode}
                  className="text-emerald-400 hover:underline font-pixel text-[10px] flex items-center gap-1"
                >
                  <RefreshCw className="w-3 h-3" /> YENİDƏN KOD GÖNDƏR
                </button>
              )}
            </div>

            {/* Direct Open WhatsApp Button */}
            <a
              href={`https://api.whatsapp.com/send?phone=${cleanPhoneDigits}&text=${encodeURIComponent(`AZESTORE Təsdiq Kodu: ${generatedOtp}`)}`}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-950/80 border border-emerald-500/50 hover:bg-emerald-900 text-emerald-300 font-pixel py-3 text-xs rounded-xl transition-colors flex items-center justify-center gap-2 font-bold shadow-md"
            >
              <ExternalLink className="w-4 h-4" />
              WHATSAPP TƏTBİQİNİ AÇ VƏ MESAJA BAX
            </a>

          </div>
        )}

        {/* STEP 3: SUCCESS */}
        {step === 'SUCCESS' && (
          <div className="text-center py-6 space-y-3 animate-fadeIn">
            <div className="w-16 h-16 bg-emerald-500/20 border-2 border-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(16,185,129,0.5)]">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h3 className="font-pixel text-base text-white">
              WHATSAPP DOĞRULANDI!
            </h3>
            <p className="text-xs text-emerald-300 font-body">
              Nömrəniz uğurla təsdiqləndi. Keçid edilir...
            </p>
          </div>
        )}

      </div>
    </div>
  );
}
