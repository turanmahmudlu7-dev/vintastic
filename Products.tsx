import React, { useState } from 'react';
import { useStore, Product } from '../../store/useStore';
import { Plus, Edit2, Trash2, Search, X, Copy, Image as ImageIcon } from 'lucide-react';
import { MediaPicker } from '../../components/MediaPicker';

export function Products() {
  const { products, collections, addProduct, updateProduct, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const initialForm = {
    name: '',
    price: 0,
    category: 'T-Shirts',
    sizes: 'S, M, L, XL',
    images: '',
    description: '',
    materials: '',
    shippingInfo: 'Ships in 3-5 business days.',
    inventory: 0,
    isNew: false,
    isLimited: false,
    isBestSeller: false,
    collection: collections[0] || '',
  };

  const [formData, setFormData] = useState(initialForm);

  const handleOpenModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        price: product.price,
        category: product.category,
        sizes: product.sizes.join(', '),
        images: product.images.join('\n'),
        description: product.description,
        materials: product.materials,
        shippingInfo: product.shippingInfo,
        inventory: product.inventory,
        isNew: product.isNew,
        isLimited: product.isLimited,
        isBestSeller: product.isBestSeller,
        collection: product.collection || collections[0] || '',
      });
    } else {
      setEditingProduct(null);
      setFormData(initialForm);
    }
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productData = {
      name: formData.name,
      price: Number(formData.price),
      category: formData.category,
      sizes: formData.sizes.split(',').map(s => s.trim()).filter(Boolean),
      images: formData.images.split('\n').map(s => s.trim()).filter(Boolean),
      description: formData.description,
      materials: formData.materials,
      shippingInfo: formData.shippingInfo,
      inventory: Number(formData.inventory),
      isNew: formData.isNew,
      isLimited: formData.isLimited,
      isBestSeller: formData.isBestSeller,
      collection: formData.collection,
    };

    if (editingProduct) {
      updateProduct(editingProduct.id, productData);
    } else {
      addProduct(productData);
    }
    setIsModalOpen(false);
  };

  const handleDuplicate = (product: Product) => {
    const { id, createdAt, ...rest } = product;
    addProduct({ ...rest, name: `${rest.name} (Copy)` });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h1 className="text-2xl font-pixel text-white">INVENTORY MANAGEMENT</h1>
        
        <div className="flex gap-4 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="SEARCH ITEMS..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/50 border border-white/20 text-white pl-10 pr-4 py-2 font-pixel text-xs rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
            />
          </div>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-[var(--color-accent-blue)] text-black px-4 py-2 font-pixel text-xs hover:bg-white transition-colors pixel-border whitespace-nowrap flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> ADD ITEM
          </button>
        </div>
      </div>

      <div className="bg-[#12141d] border border-white/10 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/40 border-b border-white/10">
                <th className="p-4 font-pixel text-[10px] text-gray-400">ITEM</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400">PRICE</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400">CATEGORY</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400">STOCK</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400">STATUS</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map(product => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 flex items-center gap-4">
                    <img src={product.images[0]} alt="" className="w-10 h-10 rounded border border-white/10 object-cover bg-black" />
                    <span className="font-pixel text-xs text-white">{product.name}</span>
                  </td>
                  <td className="p-4 font-pixel text-xs text-[var(--color-accent-yellow)]">₼{product.price.toFixed(2)}</td>
                  <td className="p-4 font-body text-sm text-gray-300">{product.category}</td>
                  <td className="p-4">
                    <span className={`font-pixel text-xs ${product.inventory < 10 ? 'text-[var(--color-accent-red)]' : 'text-gray-300'}`}>
                      {product.inventory}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      {product.isNew && <span className="w-2 h-2 rounded-full bg-[var(--color-accent-green)]" title="New"></span>}
                      {product.isLimited && <span className="w-2 h-2 rounded-full bg-[var(--color-accent-purple)]" title="Limited"></span>}
                      {product.isBestSeller && <span className="w-2 h-2 rounded-full bg-[var(--color-accent-yellow)]" title="Best Seller"></span>}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => handleDuplicate(product)} className="text-gray-400 hover:text-[var(--color-accent-green)] transition-colors" title="Duplicate">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleOpenModal(product)} className="text-gray-400 hover:text-[var(--color-accent-blue)] transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteProduct(product.id)} className="text-gray-400 hover:text-[var(--color-accent-red)] transition-colors" title="Delete">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-pixel text-sm">NO ITEMS FOUND</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Editor Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#12141d] border border-white/20 rounded-xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="flex justify-between items-center p-6 border-b border-white/10">
              <h2 className="text-xl font-pixel text-white">{editingProduct ? 'EDIT ITEM' : 'ADD NEW ITEM'}</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="product-form" onSubmit={handleSubmit} className="space-y-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-pixel text-[10px] text-gray-400 mb-2">ITEM NAME</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-[10px] text-gray-400 mb-2">PRICE (₼)</label>
                    <input 
                      required
                      type="number" 
                      step="0.01"
                      min="0"
                      value={formData.price}
                      onChange={e => setFormData({...formData, price: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-pixel text-[10px] text-gray-400 mb-2">CATEGORY</label>
                    <select 
                      value={formData.category}
                      onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
                    >
                      <option value="T-Shirts">T-Shirts</option>
                      <option value="Hoodies">Hoodies</option>
                      <option value="Sweatshirts">Sweatshirts</option>
                      <option value="Accessories">Accessories</option>
                      <option value="Collectibles">Collectibles</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-pixel text-[10px] text-gray-400 mb-2">COLLECTION</label>
                    <select 
                      value={formData.collection}
                      onChange={e => setFormData({...formData, collection: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
                    >
                      <option value="">None</option>
                      {collections.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-pixel text-[10px] text-gray-400 mb-2">INVENTORY (STOCK)</label>
                    <input 
                      required
                      type="number" 
                      min="0"
                      value={formData.inventory}
                      onChange={e => setFormData({...formData, inventory: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-[10px] text-gray-400 mb-2">SIZES (COMMA SEPARATED)</label>
                    <input 
                      type="text" 
                      value={formData.sizes}
                      onChange={e => setFormData({...formData, sizes: e.target.value})}
                      placeholder="S, M, L, XL"
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block font-pixel text-[10px] text-gray-400">PRODUCT IMAGES</label>
                    <span className="text-gray-400 font-body text-xs">Select from folder or enter URLs</span>
                  </div>

                  <div className="space-y-3 bg-black/40 p-4 border border-white/10 rounded-xl">
                    <MediaPicker
                      buttonLabel="BROWSE & UPLOAD IMAGES FROM FOLDER"
                      multiple={true}
                      selectedUrls={formData.images.split('\n').map(s => s.trim()).filter(Boolean)}
                      onSelect={(urls) => {
                        const urlList = Array.isArray(urls) ? urls : [urls];
                        setFormData({ ...formData, images: urlList.join('\n') });
                      }}
                    />

                    <div>
                      <label className="block font-pixel text-[9px] text-gray-400 mb-1 mt-2">DIRECT IMAGE URLS (ONE PER LINE)</label>
                      <textarea 
                        required
                        rows={3}
                        value={formData.images}
                        onChange={e => setFormData({...formData, images: e.target.value})}
                        placeholder="https://..."
                        className="w-full bg-black/50 border border-white/20 text-white px-3 py-2 font-body text-xs rounded focus:outline-none focus:border-[var(--color-accent-blue)] resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-pixel text-[10px] text-gray-400 mb-2">LORE / DESCRIPTION</label>
                  <textarea 
                    rows={4}
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-pixel text-[10px] text-gray-400 mb-2">MATERIALS</label>
                    <input 
                      type="text" 
                      value={formData.materials}
                      onChange={e => setFormData({...formData, materials: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
                    />
                  </div>
                  <div>
                    <label className="block font-pixel text-[10px] text-gray-400 mb-2">SHIPPING INFO</label>
                    <input 
                      type="text" 
                      value={formData.shippingInfo}
                      onChange={e => setFormData({...formData, shippingInfo: e.target.value})}
                      className="w-full bg-black/50 border border-white/20 text-white px-4 py-2 font-body text-sm rounded focus:outline-none focus:border-[var(--color-accent-blue)]"
                    />
                  </div>
                </div>

                <div className="flex gap-6 border-t border-white/10 pt-6">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isNew} onChange={e => setFormData({...formData, isNew: e.target.checked})} className="rounded bg-black border-white/20 text-[var(--color-accent-blue)] focus:ring-[var(--color-accent-blue)]" />
                    <span className="font-pixel text-xs text-white">MARK AS NEW</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isLimited} onChange={e => setFormData({...formData, isLimited: e.target.checked})} className="rounded bg-black border-white/20 text-[var(--color-accent-purple)] focus:ring-[var(--color-accent-purple)]" />
                    <span className="font-pixel text-xs text-white">MARK AS LIMITED</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={formData.isBestSeller} onChange={e => setFormData({...formData, isBestSeller: e.target.checked})} className="rounded bg-black border-white/20 text-[var(--color-accent-yellow)] focus:ring-[var(--color-accent-yellow)]" />
                    <span className="font-pixel text-xs text-white">BEST SELLER</span>
                  </label>
                </div>

              </form>
            </div>
            
            <div className="p-6 border-t border-white/10 flex justify-end gap-4">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2 text-white font-pixel text-xs hover:bg-white/5 transition-colors rounded"
              >
                CANCEL
              </button>
              <button 
                type="submit"
                form="product-form"
                className="bg-[var(--color-accent-blue)] text-black px-8 py-2 font-pixel text-xs hover:bg-white transition-colors pixel-border"
              >
                {editingProduct ? 'SAVE CHANGES' : 'CREATE ITEM'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
