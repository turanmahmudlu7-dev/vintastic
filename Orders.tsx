import { useStore, Order } from '../../store/useStore';
import { Search, Phone, MessageSquare, Eye, X, Package, Calendar, User, ShoppingBag, CheckCircle2, Mail, Send } from 'lucide-react';
import { useState } from 'react';
import { sendGmailEmail } from '../../lib/gmailService';
import { signInWithGoogleOAuth, getCachedAccessToken } from '../../lib/googleAuth';

export function Orders() {
  const { orders, updateOrder } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (o.customerPhone && o.customerPhone.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (o.customerEmail && o.customerEmail.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getCleanWhatsappNumber = (phoneStr: string) => {
    // Convert e.g. "+994 (50) 123-45-67" -> "994501234567"
    return phoneStr.replace(/\D/g, '');
  };

  const handleSendGmailReceipt = async (order: Order) => {
    const targetEmail = order.customerEmail || 'turanmahmudlu7@gmail.com';

    // Mandatory User Confirmation Dialog before mutating/sending data via Gmail API
    const confirmed = window.confirm(
      `Sifariş Qəbzi #${order.id} Gmail vasitəsilə ${targetEmail} ünvanına göndərilsin?`
    );
    if (!confirmed) return;

    setIsSendingEmail(true);
    try {
      let token = getCachedAccessToken();
      if (!token) {
        const authResult = await signInWithGoogleOAuth();
        token = authResult?.accessToken || null;
      }

      if (!token) {
        alert('Gmail autentifikasiyası alınmadı.');
        return;
      }

      const htmlBody = `
        <div style="font-family: Arial, sans-serif; background-color: #f4f4f5; padding: 20px; color: #18181b;">
          <div style="max-width: 600px; margin: 0 auto; background: #ffffff; padding: 24px; border-radius: 12px; border: 1px solid #e4e4e7;">
            <h2 style="color: #0284c7; margin-top: 0;">AZESTORE - SİFARİŞ QƏBZİ #${order.id}</h2>
            <p>Hörmətli <strong>${order.customerName}</strong>,</p>
            <p>Sizin AZESTORE mağazasından etdiyiniz sifariş uğurla qəbul olundu.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <thead>
                <tr style="background: #f4f4f5; text-align: left;">
                  <th style="padding: 8px; border-bottom: 1px solid #ddd;">Məhsul</th>
                  <th style="padding: 8px; border-bottom: 1px solid #ddd;">Ölçü</th>
                  <th style="padding: 8px; border-bottom: 1px solid #ddd;">Say</th>
                  <th style="padding: 8px; border-bottom: 1px solid #ddd;">Qiymət</th>
                </tr>
              </thead>
              <tbody>
                ${(order.items || []).map(item => `
                  <tr>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.name}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.size}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">${item.quantity}</td>
                    <td style="padding: 8px; border-bottom: 1px solid #eee;">₼${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <h3 style="text-align: right; color: #16a34a;">Ümumi Məbləğ: ₼${order.total.toFixed(2)}</h3>
            <p style="font-size: 12px; color: #71717a;">Bizimlə alış-veriş etdiyiniz üçün təşəkkür edirik!</p>
          </div>
        </div>
      `;

      const res = await sendGmailEmail({
        accessToken: token,
        to: targetEmail,
        subject: `AZESTORE Sifariş Qəbzi #${order.id}`,
        htmlBody
      });

      alert(`✅ Sifariş Qəbzi Gmail vasitəsilə ${targetEmail} ünvanına uğurla göndərildi! (Gmail Msg ID: ${res.id})`);
    } catch (err: any) {
      console.error('Gmail send error, falling back to mailto:', err);
      // Fallback: Open mailto client with prefilled receipt
      const subject = encodeURIComponent(`AZESTORE Sifariş Qəbzi #${order.id}`);
      const body = encodeURIComponent(
        `Hörmətli ${order.customerName},\n\nSizin AZESTORE mağazasından etdiyiniz sifariş uğurla qəbul olundu.\n\n` +
        `Sifariş Nömrəsi: #${order.id}\n` +
        `Ümumi Məbləğ: ₼${order.total.toFixed(2)}\n\n` +
        `Məhsullar:\n` +
        (order.items || []).map(i => `- ${i.name} (${i.size}) x${i.quantity} = ₼${(i.price * i.quantity).toFixed(2)}`).join('\n') +
        `\n\nBizimlə alış-veriş etdiyiniz üçün təşəkkür edirik!`
      );
      window.open(`mailto:${targetEmail}?subject=${subject}&body=${body}`, '_blank');
      alert(`ℹ️ Gmail API vasitəsilə göndərilə bilmədi (${err.message || err}). E-poçt proqramınız (mailto) açıldı.`);
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-pixel text-white flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-[var(--color-accent-blue)]" />
            SİFARİŞLƏRƏ NƏZARƏT (ORDERS)
          </h1>
          <p className="text-gray-400 font-body text-xs mt-1">
            Müştərilərin adları, Azərbaycan nömrələri və aldıqları məhsulların siyahısı
          </p>
        </div>
        
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Axtarış: Ad, Nömrə, İD..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/50 border border-white/20 text-white pl-10 pr-4 py-2 font-pixel text-xs rounded-lg focus:outline-none focus:border-[var(--color-accent-blue)]"
          />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-[#12141d] border border-white/10 rounded-xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/60 border-b border-white/10">
                <th className="p-4 font-pixel text-[10px] text-gray-400">SİFARİŞ KODU</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400">MÜŞTƏRİ & NÖMRƏ</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400">ALDIĞI MƏHSULLAR</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400">TARİX</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400">MƏBLƏĞ</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400">STATUS</th>
                <th className="p-4 font-pixel text-[10px] text-gray-400 text-right">ƏMƏLİYYAT</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map(order => {
                const totalItemsCount = (order.items || []).reduce((acc, item) => acc + item.quantity, 0);
                const waNumber = getCleanWhatsappNumber(order.customerPhone || '');

                return (
                  <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                    {/* Order ID */}
                    <td className="p-4 font-pixel text-xs text-[var(--color-accent-blue)] font-semibold">
                      {order.id}
                    </td>

                    {/* Customer Name & AZ Phone */}
                    <td className="p-4">
                      <p className="font-body text-sm text-white font-bold flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-gray-400" />
                        {order.customerName}
                      </p>
                      
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs text-[var(--color-accent-yellow)] font-semibold">
                          {order.customerPhone || 'Nömrə yoxdur'}
                        </span>

                        {order.customerPhone && (
                          <div className="flex items-center gap-1">
                            {/* WhatsApp link */}
                            <a
                              href={`https://wa.me/${waNumber}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 rounded bg-emerald-900/40 text-emerald-400 hover:bg-emerald-600 hover:text-white transition-colors"
                              title="WhatsApp ilə yaz"
                            >
                              <MessageSquare className="w-3 h-3" />
                            </a>

                            {/* Direct Call link */}
                            <a
                              href={`tel:+${waNumber}`}
                              className="p-1 rounded bg-blue-900/40 text-blue-400 hover:bg-blue-600 hover:text-white transition-colors"
                              title="Zəng et"
                            >
                              <Phone className="w-3 h-3" />
                            </a>

                            {order.isWpVerified !== false && (
                              <span className="bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[9px] font-pixel px-1.5 py-0.5 rounded flex items-center gap-1" title="WhatsApp Təsdiqlənmiş Nömrə">
                                💬 WP TƏSDİQLİ
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {order.customerEmail && (
                        <p className="font-body text-[11px] text-gray-500 mt-0.5">{order.customerEmail}</p>
                      )}
                    </td>

                    {/* Purchased Items Overview */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-2 overflow-hidden">
                          {(order.items || []).slice(0, 3).map((item, idx) => (
                            <img
                              key={idx}
                              src={item.image}
                              alt={item.name}
                              className="inline-block h-8 w-8 rounded-full ring-2 ring-black object-cover"
                            />
                          ))}
                        </div>
                        <span className="font-pixel text-[10px] text-gray-300">
                          {totalItemsCount} ədəd məhsul
                        </span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="p-4 font-body text-xs text-gray-400 whitespace-nowrap">
                      {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>

                    {/* Total Price */}
                    <td className="p-4 font-pixel text-xs text-[var(--color-accent-yellow)] font-bold">
                      ₼{order.total.toFixed(2)}
                    </td>

                    {/* Status Dropdown */}
                    <td className="p-4">
                      <select 
                        value={order.status}
                        onChange={(e) => updateOrder(order.id, e.target.value as Order['status'])}
                        className={`font-pixel text-[10px] px-2.5 py-1 rounded bg-black border font-semibold cursor-pointer ${
                          order.status === 'PENDING' ? 'border-yellow-500 text-yellow-400 shadow-[0_0_10px_rgba(234,179,8,0.2)]' : 
                          order.status === 'FULFILLED' ? 'border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]' : 
                          'border-red-500 text-red-400'
                        }`}
                      >
                        <option value="PENDING">PENDING (GÖZLƏNİR)</option>
                        <option value="FULFILLED">FULFILLED (ÇATDIRILDI)</option>
                        <option value="CANCELLED">CANCELLED (LƏĞV)</option>
                      </select>
                    </td>

                    {/* Action */}
                    <td className="p-4 text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-[var(--color-accent-blue)] hover:text-black font-pixel text-[10px] text-white rounded transition-all shadow-sm"
                      >
                        <Eye className="w-3.5 h-3.5" /> ƏTRAFLI
                      </button>
                    </td>
                  </tr>
                );
              })}

              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-12 text-center text-gray-500 font-pixel text-xs">
                    HEÇ BİR SİFARİŞ TAPILMADI
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAILS MODAL */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="bg-[#12141d] border border-white/20 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b border-white/10 bg-[#0a0b12]">
              <div className="flex items-center gap-3">
                <Package className="w-5 h-5 text-[var(--color-accent-blue)]" />
                <div>
                  <h3 className="font-pixel text-base text-white">
                    SİFARİŞ MƏLUMATLARI — <span className="text-[var(--color-accent-yellow)]">{selectedOrder.id}</span>
                  </h3>
                  <p className="text-gray-400 font-body text-xs">
                    Tarix: {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6">
              
              {/* Customer Contact Card */}
              <div className="bg-[#0b0c14] border border-white/10 p-4 rounded-xl space-y-3">
                <h4 className="font-pixel text-xs text-gray-400 border-b border-white/10 pb-2">
                  MÜŞTƏRİ MƏLUMATLARI
                </h4>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-body">
                  <div>
                    <span className="text-gray-500 block">Müştərinin Adı:</span>
                    <span className="text-white font-bold text-sm">{selectedOrder.customerName}</span>
                  </div>

                  <div>
                    <span className="text-gray-500 block">Azərbaycan Nömrəsi:</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[var(--color-accent-yellow)] font-mono font-bold text-sm">
                        {selectedOrder.customerPhone || 'Nömrə daxil edilməyib'}
                      </span>
                      {selectedOrder.customerPhone && (
                        <a
                          href={`https://wa.me/${getCleanWhatsappNumber(selectedOrder.customerPhone)}`}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2 py-0.5 bg-emerald-900/60 text-emerald-300 rounded font-pixel text-[10px] hover:bg-emerald-600 hover:text-white transition-colors"
                        >
                          WhatsApp
                        </a>
                      )}
                    </div>
                  </div>

                  {selectedOrder.customerEmail && (
                    <div>
                      <span className="text-gray-500 block">E-poç:</span>
                      <span className="text-gray-300">{selectedOrder.customerEmail}</span>
                    </div>
                  )}

                  <div>
                    <span className="text-gray-500 block">Sifariş Statusu:</span>
                    <span className={`font-pixel text-[10px] px-2 py-0.5 rounded inline-block mt-1 ${
                      selectedOrder.status === 'PENDING' ? 'bg-yellow-900/50 text-yellow-300 border border-yellow-500/30' :
                      selectedOrder.status === 'FULFILLED' ? 'bg-emerald-900/50 text-emerald-300 border border-emerald-500/30' :
                      'bg-red-900/50 text-red-300 border border-red-500/30'
                    }`}>
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* Items Purchased List */}
              <div className="space-y-3">
                <h4 className="font-pixel text-xs text-gray-400">
                  ALINMIŞ MƏHSULLAR ({(selectedOrder.items || []).length})
                </h4>

                <div className="space-y-3">
                  {(selectedOrder.items || []).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-[#0a0b12] p-3 rounded-xl border border-white/10">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg bg-black border border-white/10"
                      />
                      <div className="flex-1">
                        <h5 className="font-pixel text-xs text-white mb-1">{item.name}</h5>
                        <div className="flex gap-3 text-xs text-gray-400 font-body">
                          <span>Ölçü: <strong className="text-white">{item.size}</strong></span>
                          <span>Say: <strong className="text-[var(--color-accent-blue)]">{item.quantity} ədəd</strong></span>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-pixel text-xs text-[var(--color-accent-yellow)] block">
                          ₼{(item.price * item.quantity).toFixed(2)}
                        </span>
                        <span className="text-[10px] text-gray-500 font-mono">
                          (₼{item.price.toFixed(2)} / ədəd)
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-5 border-t border-white/10 bg-[#0a0b12] flex flex-wrap gap-3 justify-between items-center">
              <span className="font-pixel text-sm text-[var(--color-accent-yellow)]">
                ÜMUMİ MƏBLƏĞ: ₼{selectedOrder.total.toFixed(2)}
              </span>

              <div className="flex items-center gap-2">
                <button
                  disabled={isSendingEmail}
                  onClick={() => handleSendGmailReceipt(selectedOrder)}
                  className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 font-pixel text-xs rounded transition-colors flex items-center gap-2 shadow-md disabled:opacity-50"
                >
                  <Mail className="w-4 h-4" />
                  <span>{isSendingEmail ? 'GÖNDƏRİLİR...' : 'GMAL İLƏ QƏBZ QÖNDƏR'}</span>
                </button>

                <button
                  onClick={() => setSelectedOrder(null)}
                  className="bg-white/10 hover:bg-white text-white hover:text-black px-5 py-2 font-pixel text-xs rounded transition-colors"
                >
                  BAĞLA
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
