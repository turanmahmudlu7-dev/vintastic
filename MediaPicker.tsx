import React, { useState, useRef } from 'react';
import { useStore, MediaItem } from '../store/useStore';
import { Upload, Image as ImageIcon, Trash2, Check, X, FolderOpen, Link as LinkIcon, Plus, Eye } from 'lucide-react';

interface MediaPickerProps {
  onSelect: (url: string | string[]) => void;
  multiple?: boolean;
  selectedUrls?: string[];
  buttonLabel?: string;
  className?: string;
}

export function MediaPicker({
  onSelect,
  multiple = false,
  selectedUrls = [],
  buttonLabel = 'SELECT / UPLOAD IMAGE FROM FOLDER',
  className = '',
}: MediaPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'upload' | 'library' | 'url'>('upload');
  const [urlInput, setUrlInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>(selectedUrls);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const { mediaLibrary, addMediaItem, deleteMediaItem } = useStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    (Array.from(files) as File[]).forEach((file: File) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          const dataUrl = event.target.result as string;
          const newItem = addMediaItem(file.name, dataUrl);
          if (multiple) {
            setSelectedItems((prev) => [...prev, newItem.url]);
          } else {
            setSelectedItems([newItem.url]);
          }
        }
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
    setActiveTab('library');
  };

  const handleSelectMedia = (url: string) => {
    if (multiple) {
      if (selectedItems.includes(url)) {
        setSelectedItems(selectedItems.filter((u) => u !== url));
      } else {
        setSelectedItems([...selectedItems, url]);
      }
    } else {
      setSelectedItems([url]);
    }
  };

  const handleAddUrl = () => {
    if (!urlInput.trim()) return;
    const url = urlInput.trim();
    const newItem = addMediaItem(`External Image (${new Date().toLocaleTimeString()})`, url);
    if (multiple) {
      setSelectedItems((prev) => [...prev, newItem.url]);
    } else {
      setSelectedItems([newItem.url]);
    }
    setUrlInput('');
    setActiveTab('library');
  };

  const handleConfirm = () => {
    if (multiple) {
      onSelect(selectedItems);
    } else {
      onSelect(selectedItems[0] || '');
    }
    setIsOpen(false);
  };

  const filteredLibrary = (mediaLibrary || []).filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={className}>
      {/* Trigger Button */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => {
            setSelectedItems(selectedUrls);
            setIsOpen(true);
          }}
          className="flex items-center gap-2 bg-[#12141d] hover:bg-white/10 text-[var(--color-accent-blue)] border border-[var(--color-accent-blue)]/50 px-4 py-2.5 font-pixel text-xs rounded transition-all shadow-[0_0_15px_rgba(0,240,255,0.15)] group"
        >
          <FolderOpen className="w-4 h-4 group-hover:scale-110 transition-transform" />
          <span>{buttonLabel}</span>
        </button>

        {/* Selected count badge */}
        {selectedUrls.length > 0 && (
          <span className="font-pixel text-xs text-gray-400 bg-black/40 px-3 py-1 rounded border border-white/10">
            {selectedUrls.length} {selectedUrls.length === 1 ? 'image selected' : 'images selected'}
          </span>
        )}
      </div>

      {/* Selected Thumbnails Bar */}
      {selectedUrls.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-3">
          {selectedUrls.map((url, idx) => (
            <div key={idx} className="relative group w-20 h-20 rounded border border-white/20 bg-black/60 overflow-hidden">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center gap-2 transition-opacity">
                <button
                  type="button"
                  onClick={() => setPreviewUrl(url)}
                  className="p-1 bg-black/80 rounded text-gray-300 hover:text-white"
                  title="Preview"
                >
                  <Eye className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const newUrls = selectedUrls.filter((_, i) => i !== idx);
                    onSelect(multiple ? newUrls : newUrls[0] || '');
                  }}
                  className="p-1 bg-red-900/80 rounded text-red-200 hover:text-white"
                  title="Remove"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Media Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#12141d] border border-white/20 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-white/10 bg-[#0b0c14]">
              <div className="flex items-center gap-3">
                <FolderOpen className="w-5 h-5 text-[var(--color-accent-blue)]" />
                <h2 className="text-lg font-pixel text-white">MEDIA & FOLDER GALLERY</h2>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-white/10 bg-[#08090f] px-5 pt-3 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 px-4 py-2.5 font-pixel text-xs rounded-t-lg transition-colors border-t border-x ${
                  activeTab === 'upload'
                    ? 'bg-[#12141d] text-[var(--color-accent-blue)] border-white/20 border-b-[#12141d]'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <Upload className="w-4 h-4" /> UPLOAD FROM FOLDER
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('library')}
                className={`flex items-center gap-2 px-4 py-2.5 font-pixel text-xs rounded-t-lg transition-colors border-t border-x ${
                  activeTab === 'library'
                    ? 'bg-[#12141d] text-[var(--color-accent-yellow)] border-white/20 border-b-[#12141d]'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <ImageIcon className="w-4 h-4" /> MEDIA LIBRARY ({(mediaLibrary || []).length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('url')}
                className={`flex items-center gap-2 px-4 py-2.5 font-pixel text-xs rounded-t-lg transition-colors border-t border-x ${
                  activeTab === 'url'
                    ? 'bg-[#12141d] text-[var(--color-accent-purple)] border-white/20 border-b-[#12141d]'
                    : 'text-gray-400 border-transparent hover:text-white'
                }`}
              >
                <LinkIcon className="w-4 h-4" /> PASTE IMAGE URL
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-[#12141d]">
              {/* TAB 1: UPLOAD FROM DEVICE / FOLDER */}
              {activeTab === 'upload' && (
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/20 hover:border-[var(--color-accent-blue)] rounded-xl bg-black/30 transition-colors cursor-pointer text-center group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple={multiple}
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <div className="p-4 rounded-full bg-[var(--color-accent-blue)]/10 text-[var(--color-accent-blue)] border border-[var(--color-accent-blue)]/30 group-hover:scale-110 transition-transform mb-4">
                    <Upload className="w-8 h-8" />
                  </div>
                  <h3 className="font-pixel text-sm text-white mb-2">
                    CLICK TO CHOOSE IMAGES FROM YOUR FOLDER
                  </h3>
                  <p className="text-gray-400 font-body text-xs max-w-sm mb-4">
                    Select PNG, JPG, WEBP, GIF or SVG files directly from your computer or mobile device.
                  </p>
                  <button
                    type="button"
                    className="bg-[var(--color-accent-blue)] text-black px-6 py-2.5 font-pixel text-xs hover:bg-white transition-colors rounded pixel-border shadow-lg"
                  >
                    BROWSE COMPUTER FOLDER
                  </button>
                </div>
              )}

              {/* TAB 2: MEDIA LIBRARY GALLERY */}
              {activeTab === 'library' && (
                <div className="space-y-4">
                  {/* Search input */}
                  <div className="flex justify-between items-center gap-4">
                    <input
                      type="text"
                      placeholder="Search saved media..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="bg-black/50 border border-white/20 text-white px-4 py-2 font-pixel text-xs rounded w-full max-w-xs focus:outline-none focus:border-[var(--color-accent-yellow)]"
                    />
                    <span className="font-pixel text-xs text-gray-400">
                      {selectedItems.length} selected
                    </span>
                  </div>

                  {/* Grid of media */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 max-h-[420px] overflow-y-auto p-1">
                    {filteredLibrary.map((item) => {
                      const isSelected = selectedItems.includes(item.url);
                      return (
                        <div
                          key={item.id}
                          onClick={() => handleSelectMedia(item.url)}
                          className={`relative group rounded-xl border overflow-hidden cursor-pointer transition-all aspect-square bg-black/60 ${
                            isSelected
                              ? 'border-[var(--color-accent-yellow)] ring-2 ring-[var(--color-accent-yellow)] scale-95 shadow-[0_0_20px_rgba(255,222,0,0.3)]'
                              : 'border-white/10 hover:border-white/40'
                          }`}
                        >
                          <img src={item.url} alt={item.name} className="w-full h-full object-cover" />

                          {/* Selection Checkmark Badge */}
                          {isSelected && (
                            <div className="absolute top-2 right-2 bg-[var(--color-accent-yellow)] text-black p-1 rounded-full shadow-md z-10">
                              <Check className="w-4 h-4 stroke-[3]" />
                            </div>
                          )}

                          {/* Hover Overlay with Delete & Info */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between">
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  deleteMediaItem(item.id);
                                  setSelectedItems(selectedItems.filter((u) => u !== item.url));
                                }}
                                className="p-1.5 bg-red-900/80 hover:bg-red-700 text-white rounded-md transition-colors"
                                title="Delete from media library"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <span className="font-pixel text-[10px] text-white truncate drop-shadow">
                              {item.name}
                            </span>
                          </div>
                        </div>
                      );
                    })}

                    {filteredLibrary.length === 0 && (
                      <div className="col-span-full text-center py-12 text-gray-500 font-pixel text-xs">
                        NO MEDIA FOUND. UPLOAD IMAGES FROM YOUR FOLDER FIRST.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: PASTE URL */}
              {activeTab === 'url' && (
                <div className="space-y-4 max-w-xl mx-auto py-6">
                  <label className="block font-pixel text-xs text-gray-300">
                    ENTER DIRECT IMAGE URL:
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1 bg-black/50 border border-white/20 text-white px-4 py-2.5 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-purple)]"
                    />
                    <button
                      type="button"
                      onClick={handleAddUrl}
                      className="bg-[var(--color-accent-purple)] text-white px-5 py-2.5 font-pixel text-xs rounded hover:bg-white hover:text-black transition-colors"
                    >
                      ADD IMAGE
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/10 bg-[#0b0c14] flex justify-between items-center">
              <span className="font-pixel text-xs text-gray-400">
                {multiple ? 'Select multiple images' : 'Select a single image'}
              </span>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-5 py-2 text-gray-300 font-pixel text-xs hover:text-white transition-colors"
                >
                  CANCEL
                </button>
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="bg-[var(--color-accent-blue)] text-black px-6 py-2 font-pixel text-xs hover:bg-white transition-colors rounded pixel-border shadow-md"
                >
                  APPLY SELECTION
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Full Size Preview Modal */}
      {previewUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md" onClick={() => setPreviewUrl(null)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <img src={previewUrl} alt="Preview" className="max-w-full max-h-[85vh] rounded-lg border border-white/20 shadow-2xl" />
            <button
              onClick={() => setPreviewUrl(null)}
              className="absolute -top-4 -right-4 bg-red-600 text-white p-2 rounded-full hover:bg-red-500 shadow-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
