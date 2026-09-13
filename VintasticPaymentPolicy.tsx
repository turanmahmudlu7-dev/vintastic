import React from 'react';

const newBannerImg = "/src/assets/images/vintastic_clean_about_scroll_1789265896045.jpg";

export function VintasticPaymentPolicy() {
  return (
    <div className="w-full mb-16">
      {/* Direct Seamless Image Illustration Banner */}
      <div className="vintastic-container overflow-hidden rounded-2xl border border-[var(--color-accent-yellow)]/30 bg-[#0b0c14] p-2 sm:p-4 shadow-[0_0_35px_rgba(255,222,0,0.12)]">
        <img
          src={newBannerImg}
          alt="Vintastic Ödəniş Qaydaları və Bəh Siyasəti"
          className="w-full h-auto block object-contain rounded-xl"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "https://i.ibb.co/rfLwkJ8z/3bb1e258-1282-47ad-a734-6aff250d1db4.jpg";
          }}
        />
      </div>
    </div>
  );
}


