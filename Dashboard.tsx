import { useStore } from '../../store/useStore';
import { DollarSign, Package, ShoppingCart, TrendingUp } from 'lucide-react';

export function Dashboard() {
  const { products, orders } = useStore();
  
  const totalRevenue = orders.filter(o => o.status !== 'CANCELLED').reduce((sum, order) => sum + order.total, 0);
  const activeProducts = products.length;
  const totalOrders = orders.length;
  const lowStock = products.filter(p => p.inventory < 10).length;

  const stats = [
    { name: 'TOTAL REVENUE', value: `$${totalRevenue.toFixed(2)}`, icon: <DollarSign className="text-[var(--color-accent-green)]" />, color: 'border-[var(--color-accent-green)]/30 bg-[var(--color-accent-green)]/5' },
    { name: 'ACTIVE PRODUCTS', value: activeProducts, icon: <Package className="text-[var(--color-accent-blue)]" />, color: 'border-[var(--color-accent-blue)]/30 bg-[var(--color-accent-blue)]/5' },
    { name: 'TOTAL ORDERS', value: totalOrders, icon: <ShoppingCart className="text-[var(--color-accent-purple)]" />, color: 'border-[var(--color-accent-purple)]/30 bg-[var(--color-accent-purple)]/5' },
    { name: 'LOW STOCK WARNING', value: lowStock, icon: <TrendingUp className="text-[var(--color-accent-red)]" />, color: 'border-[var(--color-accent-red)]/30 bg-[var(--color-accent-red)]/5' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-pixel text-white mb-8">SYSTEM STATUS</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className={`p-6 rounded-xl border ${stat.color} flex items-center justify-between`}>
            <div>
              <p className="text-gray-400 font-pixel text-[10px] mb-2">{stat.name}</p>
              <p className="text-2xl font-pixel text-white">{stat.value}</p>
            </div>
            <div className="p-3 bg-black/50 rounded-lg">
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#12141d] border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-pixel text-[var(--color-accent-blue)] mb-6">RECENT ORDERS</h2>
          {orders.length === 0 ? (
            <p className="text-gray-500 font-body text-sm">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map(order => (
                <div key={order.id} className="flex justify-between items-center p-4 border border-white/5 rounded-lg bg-black/20">
                  <div>
                    <p className="text-white font-pixel text-xs">{order.id}</p>
                    <p className="text-gray-400 font-body text-sm">{order.customerName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--color-accent-yellow)] font-pixel text-xs">${order.total.toFixed(2)}</p>
                    <span className={`text-[10px] font-pixel px-2 py-1 rounded mt-2 inline-block ${
                      order.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' : 
                      order.status === 'FULFILLED' ? 'bg-green-500/20 text-green-500' : 
                      'bg-red-500/20 text-red-500'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-[#12141d] border border-white/10 rounded-xl p-6">
          <h2 className="text-sm font-pixel text-[var(--color-accent-purple)] mb-6">INVENTORY ALERTS</h2>
          {products.filter(p => p.inventory < 10).length === 0 ? (
            <p className="text-gray-500 font-body text-sm">All items are well stocked.</p>
          ) : (
            <div className="space-y-4">
              {products.filter(p => p.inventory < 10).map(product => (
                <div key={product.id} className="flex items-center gap-4 p-4 border border-white/5 rounded-lg bg-black/20">
                  <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded object-cover border border-white/10" />
                  <div className="flex-1">
                    <p className="text-white font-pixel text-xs">{product.name}</p>
                    <p className="text-gray-400 font-body text-sm">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[var(--color-accent-red)] font-pixel text-sm">{product.inventory} LEFT</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
