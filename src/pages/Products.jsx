import React, { useState, useContext } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Layers, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

const Products = () => {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: '', message: '' });
  
  const { products, deleteProduct } = useContext(AppContext);

  // Lấy danh mục động từ danh sách sản phẩm thực tế
  const categoriesList = ['Tất cả', ...new Set(products.map(p => p.category).filter(Boolean))];

  // Lọc sản phẩm theo tìm kiếm và danh mục
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
      
    if (selectedCategory === 'Tất cả') return matchesSearch;
    return matchesSearch && p.category === selectedCategory;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US').format(price) + ' ₫';
  };

  const handleDelete = (product) => {
    setDeleteConfirmId(product.id);
    setDeleteConfirmName(product.name);
  };

  const executeDeleteProduct = () => {
    if (deleteConfirmId) {
      deleteProduct(deleteConfirmId);
      setDeleteConfirmId(null);
      setDeleteConfirmName('');
      setAlertModal({ isOpen: true, type: 'success', message: 'Xóa sản phẩm thành công!' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Buttons & Title */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white uppercase tracking-tight">Danh sách sản phẩm</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">Danh sách sản phẩm của DRX Store</p>
        </div>
        <button 
          onClick={() => navigate('/products/add')}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg bg-[#0052ff] hover:bg-[#0042d1] text-white shadow-md shadow-[#0052ff]/10 border border-transparent active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4" />
          THÊM LINH KIỆN MỚI
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between transition-colors">
        {/* Search */}
        <div className="relative w-full md:w-80 group">
          <span className="absolute inset-y-0 left-3 flex items-center text-slate-400 group-focus-within:text-[#0052ff] dark:group-focus-within:text-[#6699ff] transition-colors">
            <Search className="w-4.5 h-4.5" />
          </span>
          <input
            type="text"
            placeholder="Tìm theo tên, SKU hoặc hãng..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold text-slate-800 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 rounded-lg border border-slate-200 dark:border-slate-700 focus:bg-white dark:focus:bg-slate-800 focus:border-[#0052ff] dark:focus:border-[#6699ff] focus:outline-none transition-all"
          />
        </div>

        {/* Filter Badges */}
        <div className="flex items-center gap-3 w-full md:w-auto overflow-x-auto">
          <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-700 hover:bg-[#0052ff]/5 border border-slate-200 dark:border-slate-600 hover:border-[#0052ff]/20 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300 hover:text-[#0052ff] dark:hover:text-[#6699ff] transition-all">
            <Filter className="w-3.5 h-3.5" />
            <span>Bộ lọc thông số</span>
          </button>
          <div className="flex items-center gap-1.5 border-l border-slate-200 dark:border-slate-700 pl-3 transition-colors">
            {categoriesList.map((cat, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-bold border transition-all ${
                  cat === selectedCategory 
                    ? 'bg-[#E6F0FF] dark:bg-[#0052ff]/20 border-[#0052ff]/25 dark:border-[#0052ff]/30 text-[#0052ff] dark:text-[#6699ff]' 
                    : 'bg-transparent border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-700 transition-colors">
                <th className="p-4 font-bold uppercase tracking-wider">Mã hàng</th>
                <th className="p-4 font-bold uppercase tracking-wider">Hình ảnh & Tên</th>
                <th className="p-4 font-bold uppercase tracking-wider">Giá bán</th>
                <th className="p-4 font-bold uppercase tracking-wider">Giá vốn</th>
                <th className="p-4 font-bold uppercase tracking-wider text-center">Tồn kho</th>
                <th className="p-4 font-bold uppercase tracking-wider text-center">Khách đặt</th>
                <th className="p-4 font-bold uppercase tracking-wider">Thời gian tạo</th>
                <th className="p-4 font-bold uppercase tracking-wider text-center">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50 transition-colors">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="8" className="p-8 text-center text-slate-500 dark:text-slate-400 font-semibold">Không tìm thấy hàng hóa phù hợp.</td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <React.Fragment key={p.id}>
                  <tr 
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors group cursor-pointer"
                    onClick={() => setExpandedRow(expandedRow === p.id ? null : p.id)}
                  >
                    <td className="p-4 font-mono font-bold text-slate-500 dark:text-slate-400">{p.sku}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center p-1 overflow-hidden shrink-0 transition-colors">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover rounded" />
                          ) : (
                            <Layers className="w-5 h-5 text-slate-400 dark:text-slate-500" />
                          )}
                        </div>
                        <div className="space-y-0.5">
                          <span className="font-bold text-slate-800 dark:text-slate-200 block text-xs group-hover:text-[#0052ff] dark:group-hover:text-[#6699ff] transition-colors line-clamp-2">{p.name}</span>
                          <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">{p.brand} - {p.category}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 font-bold text-slate-800 dark:text-slate-200 whitespace-nowrap">{formatPrice(p.price)}</td>
                    <td className="p-4 font-semibold text-slate-500 dark:text-slate-400 whitespace-nowrap">{formatPrice(p.costPrice)}</td>
                    
                    <td className="p-4 text-center">
                      <div className="space-y-1">
                        {p.stock <= 5 ? (
                          <span className="text-rose-600 dark:text-rose-400 font-bold block">{p.stock}</span>
                        ) : (
                          <span className="text-slate-600 dark:text-slate-300 font-bold block">{p.stock}</span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      {p.reserved > 0 ? (
                        <span className="text-orange-500 dark:text-orange-400 font-bold bg-orange-50 dark:bg-orange-900/30 px-2 py-0.5 rounded">{p.reserved}</span>
                      ) : (
                        <span className="text-slate-400 dark:text-slate-500 font-medium">0</span>
                      )}
                    </td>
                    
                    <td className="p-4">
                      <span className="text-slate-500 dark:text-slate-400 font-medium">{p.createdAt}</span>
                    </td>

                    <td className="p-4" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); navigate(`/products/edit/${p.id}`); }}
                          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-[#E6F0FF] dark:hover:bg-[#0052ff]/20 text-slate-400 dark:text-slate-400 hover:text-[#0052ff] dark:hover:text-[#6699ff] border border-slate-200 dark:border-slate-600 hover:border-[#0052ff]/20 dark:hover:border-[#0052ff]/30 transition-all" 
                          title="Sửa hàng hóa"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(p); }}
                          className="p-2 rounded-lg bg-slate-50 dark:bg-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/30 text-slate-400 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 border border-slate-200 dark:border-slate-600 hover:border-rose-200 dark:hover:border-rose-800 transition-all" title="Xóa hàng hóa">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Description Row */}
                  {expandedRow === p.id && (
                    <tr className="bg-[#f8fafc] dark:bg-slate-800/50 transition-colors">
                      <td colSpan="8" className="px-4 py-3 border-b border-slate-200 dark:border-slate-700/50">
                        <div className="flex items-start gap-3 text-[13px]">
                          <span className="font-bold text-slate-700 dark:text-slate-300 min-w-max uppercase tracking-wider text-[11px] bg-slate-200/50 dark:bg-slate-700 px-2 py-1 rounded transition-colors">Mô tả chi tiết:</span>
                          <span className="text-slate-600 dark:text-slate-400 leading-relaxed italic">{p.description || 'Chưa có mô tả cho sản phẩm này.'}</span>
                        </div>
                      </td>
                    </tr>
                  )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL (WITHOUT DARK BLUR BACKDROP) */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-transparent" onClick={() => setDeleteConfirmId(null)} />
          <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden border border-slate-200 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 dark:bg-rose-900/40 text-rose-500 dark:text-rose-400 rounded-full flex items-center justify-center mx-auto mb-2">
                <Trash2 className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-800 dark:text-white">Xóa sản phẩm này?</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                Bạn có chắc chắn muốn xóa sản phẩm <span className="font-bold text-slate-700 dark:text-slate-300">{deleteConfirmName}</span> không? Hành động này không thể hoàn tác.
              </p>
            </div>
            <div className="p-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-700 flex gap-3 transition-colors">
              <button 
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 px-4 py-2.5 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-sm font-bold rounded-xl border border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors"
              >
                Hủy bỏ
              </button>
              <button 
                onClick={executeDeleteProduct}
                className="flex-1 px-4 py-2.5 bg-rose-500 hover:bg-rose-600 text-white text-sm font-bold rounded-xl shadow-md shadow-rose-500/20 transition-colors"
              >
                Xóa ngay
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALERT MODAL */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-transparent" onClick={() => setAlertModal({ isOpen: false, type: '', message: '' })} />
          <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] dark:shadow-black/50 border border-slate-200 dark:border-slate-700 w-full max-w-xs overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 space-y-4">
              <div className="flex flex-col items-center justify-center text-center space-y-3">
                {alertModal.type === 'success' ? (
                  <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center text-rose-600 dark:text-rose-400">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </div>
                )}
                <h3 className="font-bold text-slate-800 dark:text-white text-lg">
                  {alertModal.type === 'success' ? 'Thành công!' : 'Lỗi'}
                </h3>
                <p className="text-[13px] font-medium text-slate-500 dark:text-slate-400">
                  {alertModal.message}
                </p>
              </div>
              <button 
                onClick={() => setAlertModal({ isOpen: false, type: '', message: '' })}
                className="w-full px-4 py-2 bg-[#0052FF] text-white text-[13px] font-bold rounded-lg hover:bg-[#0042d1] transition-colors shadow-md shadow-[#0052FF]/20"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Products;
