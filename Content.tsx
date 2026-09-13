import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { Save } from 'lucide-react';
import { MediaPicker } from '../../components/MediaPicker';

export function Content() {
  const { content, updateContent } = useStore();
  const [formData, setFormData] = useState(content);
  const [isSaved, setIsSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateContent(formData);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-pixel text-white">CONTENT MANAGEMENT</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-[#12141d] border border-white/10 rounded-xl p-8 space-y-6">
          <h2 className="text-lg font-pixel text-[var(--color-accent-blue)] mb-4">HOMEPAGE HERO</h2>
          
          <div>
            <label className="block font-pixel text-[10px] text-gray-400 mb-2">HERO HEADLINE</label>
            <input 
              type="text" 
              value={formData.heroTitle}
              onChange={e => setFormData({...formData, heroTitle: e.target.value})}
              className="w-full bg-black/50 border border-white/20 text-white px-4 py-3 font-pixel text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
            />
          </div>
          
          <div>
            <label className="block font-pixel text-[10px] text-gray-400 mb-2">HERO SUBTITLE / SUPPORTING TEXT</label>
            <textarea 
              rows={2}
              value={formData.heroSubtitle}
              onChange={e => setFormData({...formData, heroSubtitle: e.target.value})}
              className="w-full bg-black/50 border border-white/20 text-white px-4 py-3 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)] resize-none"
            />
          </div>

          <div>
            <label className="block font-pixel text-[10px] text-gray-400 mb-2">HERO BACKGROUND IMAGE</label>
            <div className="space-y-4 bg-black/40 p-4 border border-white/10 rounded-xl">
              <MediaPicker
                buttonLabel="SELECT / UPLOAD HERO IMAGE FROM FOLDER"
                multiple={false}
                selectedUrls={formData.heroImage ? [formData.heroImage] : []}
                onSelect={(url) => {
                  const urlStr = Array.isArray(url) ? url[0] || '' : url;
                  setFormData({ ...formData, heroImage: urlStr });
                }}
              />
              <div>
                <label className="block font-pixel text-[9px] text-gray-400 mb-1">DIRECT URL</label>
                <input 
                  type="text" 
                  value={formData.heroImage}
                  onChange={e => setFormData({...formData, heroImage: e.target.value})}
                  className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 font-body text-xs rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
                />
              </div>
            </div>
            {formData.heroImage && (
              <div className="mt-4 aspect-video w-full max-w-sm rounded overflow-hidden border border-white/10 opacity-75 shadow-lg">
                <img src={formData.heroImage} alt="Hero Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>
        </div>

        <div className="bg-[#12141d] border border-white/10 rounded-xl p-8 space-y-6">
          <h2 className="text-lg font-pixel text-[var(--color-accent-purple)] mb-4">BRAND LORE SECTION</h2>
          
          <div>
            <label className="block font-pixel text-[10px] text-gray-400 mb-2">ABOUT US / WORLD EXPLANATION</label>
            <textarea 
              rows={5}
              value={formData.aboutText}
              onChange={e => setFormData({...formData, aboutText: e.target.value})}
              className="w-full bg-black/50 border border-white/20 text-white px-4 py-3 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)] resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit"
            className="bg-[var(--color-accent-blue)] text-black px-8 py-4 font-pixel text-sm hover:bg-white transition-colors pixel-border flex items-center gap-2 shadow-[0_0_15px_rgba(0,240,255,0.2)]"
          >
            {isSaved ? 'SAVED!' : <><Save className="w-4 h-4" /> SAVE CHANGES</>}
          </button>
        </div>
      </form>
    </div>
  );
}
