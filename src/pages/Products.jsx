import React, { useState, useContext } from 'react';
import { Plus, Edit2, Trash2, Search, Filter, Layers, Eye, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../contexts/AppContext';

const sampleProducts = [
  {
    sku: 'INTEL-I9-14900K',
    name: 'CPU Intel Core i9-14900K (Up to 6.0GHz, 24 Nhân 32 Luồng, 36MB Cache)',
    brand: 'Intel',
    category: 'CPU',
    price: 15490000,
    costPrice: 14500000,
    stock: 10,
    description: 'Bộ vi xử lý Intel Core thế hệ thứ 14 đỉnh cao cho gaming và đồ họa chuyên nghiệp.',
    specs: '24 Cores / 32 Threads | 3.2GHz to 6.0GHz | LGA1700'
  },
  {
    sku: 'AMD-RYZEN-7800X3D',
    name: 'CPU AMD Ryzen 7 7800X3D (4.2GHz~5.0GHz, 8 Nhân 16 Luồng, 96MB L3 Cache)',
    brand: 'AMD',
    category: 'CPU',
    price: 10990000,
    costPrice: 9900000,
    stock: 8,
    description: 'CPU chơi game tốt nhất thế giới hiện nay với công nghệ 3D V-Cache độc quyền.',
    specs: '8 Cores / 16 Threads | 4.2GHz to 5.0GHz | AM5'
  },
  {
    sku: 'ASUS-ROG-RTX4090',
    name: 'Card màn hình ASUS ROG Strix GeForce RTX 4090 OC Edition 24GB GDDR6X',
    brand: 'ASUS',
    category: 'CARD',
    price: 64990000,
    costPrice: 59000000,
    stock: 3,
    description: 'Vua của card màn hình với hiệu năng cực đỉnh, tản nhiệt ROG Strix hầm hố mát mẻ.',
    specs: '24GB GDDR6X | 384-bit | OC Edition'
  },
  {
    sku: 'MSI-RTX4070TI-SUPER',
    name: 'Card màn hình MSI GeForce RTX 4070 Ti SUPER 16G GAMING X SLIM',
    brand: 'MSI',
    category: 'CARD',
    price: 25490000,
    costPrice: 23500000,
    stock: 6,
    description: 'Hiệu năng đồ họa mạnh mẽ thế hệ Ada Lovelace, thiết kế mỏng nhẹ sang trọng.',
    specs: '16GB GDDR6X | 256-bit | Gaming X Slim'
  },
  {
    sku: 'ASUS-ROG-Z790-HERO',
    name: 'Mainboard ASUS ROG MAXIMUS Z790 HERO DDR5',
    brand: 'ASUS',
    category: 'MAIN',
    price: 17490000,
    costPrice: 15900000,
    stock: 5,
    description: 'Bo mạch chủ cao cấp cho Intel Core Gen 14, hỗ trợ DDR5, PCIe 5.0 và cấp nguồn mạnh mẽ.',
    specs: 'LGA1700 | Intel Z790 | DDR5 | ATX'
  },
  {
    sku: 'MSI-MAG-B650-MORTAR',
    name: 'Mainboard MSI MAG B650M MORTAR WIFI DDR5',
    brand: 'MSI',
    category: 'MAIN',
    price: 5490000,
    costPrice: 4800000,
    stock: 12,
    description: 'Lựa chọn quốc dân cho AMD Ryzen 7000 Series, thiết kế cứng cáp có tản nhiệt VRM dày.',
    specs: 'AM5 | AMD B650 | DDR5 | m-ATX'
  },
  {
    sku: 'CORSAIR-DOMINATOR-32G',
    name: 'RAM Corsair Dominator Titanium RGB 32GB (2x16GB) DDR5 6000MHz',
    brand: 'Corsair',
    category: 'RAM',
    price: 4990000,
    costPrice: 4200000,
    stock: 15,
    description: 'Dòng RAM DDR5 cao cấp nhất của Corsair với thiết kế module Titanium thời thượng và LED RGB độc quyền.',
    specs: '32GB (2x16GB) | DDR5 | 6000MHz | CL30'
  },
  {
    sku: 'GSKILL-TRIDENT-Z5-32G',
    name: 'RAM G.Skill Trident Z5 RGB 32GB (2x16GB) DDR5 5600MHz',
    brand: 'G.Skill',
    category: 'RAM',
    price: 3290000,
    costPrice: 2800000,
    stock: 20,
    description: 'Thiết kế cánh buồm huyền thoại, LED RGB rực rỡ, độ ổn định tuyệt vời cho cả Intel và AMD.',
    specs: '32GB (2x16GB) | DDR5 | 5600MHz | CL36'
  },
  {
    sku: 'SAMSUNG-990PRO-2TB',
    name: 'Ổ cứng SSD Samsung 990 PRO 2TB M.2 NVMe PCIe Gen4 x4',
    brand: 'Samsung',
    category: 'SSD',
    price: 5290000,
    costPrice: 4600000,
    stock: 25,
    description: 'SSD Gen 4 nhanh nhất thế giới của Samsung với tốc độ đọc ghi lên tới 7450/6900 MB/s.',
    specs: '2TB | M.2 NVMe | PCIe Gen4 x4 | Đọc ghi 7450/6900 MB/s'
  },
  {
    sku: 'KINGSTON-NV2-1TB',
    name: 'Ổ cứng SSD Kingston NV2 1TB M.2 PCIe NVMe Gen4 x4',
    brand: 'Kingston',
    category: 'SSD',
    price: 1690000,
    costPrice: 1400000,
    stock: 40,
    description: 'SSD Gen 4 quốc dân giá rẻ, dung lượng cao 1TB, tốc độ ổn định cho mọi cấu hình văn phòng và gaming.',
    specs: '1TB | M.2 NVMe | PCIe Gen4 x4 | Đọc ghi 3500/2100 MB/s'
  },
  {
    sku: 'CORSAIR-RM1000E',
    name: 'Nguồn máy tính Corsair RM1000e 1000W - 80 Plus Gold - Full Modular',
    brand: 'Corsair',
    category: 'PSU',
    price: 4390000,
    costPrice: 3800000,
    stock: 10,
    description: 'Nguồn công suất thực chuẩn ATX 3.0 & PCIe 5.0 chuyên cho card màn hình khủng RTX 4090/4080.',
    specs: '1000W | 80 Plus Gold | Full Modular | ATX 3.0'
  },
  {
    sku: 'MSI-MAG-A750GL',
    name: 'Nguồn máy tính MSI MAG A750GL 750W - 80 Plus Gold - Full Modular',
    brand: 'MSI',
    category: 'PSU',
    price: 2690000,
    costPrice: 2200000,
    stock: 18,
    description: 'Nguồn máy tính 750W Full Modular chuẩn ATX 3.0 hiệu suất cao, hoạt động êm ái bền bỉ.',
    specs: '750W | 80 Plus Gold | Full Modular | ATX 3.0'
  },
  {
    sku: 'LIANLI-GALAHAD-II-360',
    name: 'Tản nhiệt nước AIO Lian Li Galahad II Trinity SL-INF 360 ARGB',
    brand: 'Lian Li',
    category: 'COOLER',
    price: 5390000,
    costPrice: 4800000,
    stock: 7,
    description: 'Tản nhiệt nước AIO cao cấp với fan vô cực SL-Infinity siêu đẹp, hiệu năng giải nhiệt cực khủng.',
    specs: '360mm Rad | 3x SL-INF 120 Fan | ARGB | Pump Gen 8'
  },
  {
    sku: 'THERMALRIGHT-PA120-SE',
    name: 'Tản nhiệt khí CPU Thermalright Peerless Assassin 120 SE ARGB',
    brand: 'Thermalright',
    category: 'COOLER',
    price: 950000,
    costPrice: 750000,
    stock: 30,
    description: 'Vua tản nhiệt khí phân khúc tầm trung với 2 tháp, 6 ống đồng tản nhiệt cực mát.',
    specs: 'Dual Tower | 6 Heatpipes | 2x TL-C12C-S Fan | 120mm'
  },
  {
    sku: 'LIANLI-O11D-EVO',
    name: 'Vỏ máy tính Lian Li O11 Dynamic EVO RGB - Black',
    brand: 'Lian Li',
    category: 'CASE',
    price: 4790000,
    costPrice: 4100000,
    stock: 6,
    description: 'Vỏ case bể cá huyền thoại nay có thêm dải LED RGB viền kép sang xịn mịn, hỗ trợ xoay ngược case.',
    specs: 'Mid Tower | Bể cá kính cường lực | Hỗ trợ E-ATX | Muted Black'
  },
  {
    sku: 'NZXT-H9-FLOW',
    name: 'Vỏ máy tính NZXT H9 Flow Matte Black',
    brand: 'NZXT',
    category: 'CASE',
    price: 4390000,
    costPrice: 3800000,
    stock: 8,
    description: 'Dòng case Dual-Chamber thoáng khí cực đỉnh của NZXT, mặt kính bao trọn show linh kiện bên trong.',
    specs: 'Mid Tower | Dual Chamber | Kính cường lực | Muted Black'
  },
  {
    sku: 'ASUS-ROG-AZOTH',
    name: 'Bàn phím cơ Asus ROG Azoth Wireless Custom Gaming Keyboard',
    brand: 'ASUS',
    category: 'KEYBOARD',
    price: 6190000,
    costPrice: 5500000,
    stock: 5,
    description: 'Bàn phím custom 75% không dây cao cấp tích hợp màn hình OLED đa chức năng, lót tiêu âm gasket mount.',
    specs: 'Layout 75% | ROG NX Red Sw | OLED Screen | Gasket Mount'
  },
  {
    sku: 'RAZER-VIPER-V3-PRO',
    name: 'Chuột Gaming không dây Razer Viper V3 Pro - Black',
    brand: 'Razer',
    category: 'MOUSE',
    price: 4390000,
    costPrice: 3800000,
    stock: 12,
    description: 'Chuột gaming không dây siêu nhẹ 54g trang bị cảm biến Focus Pro 35K Gen 2, dongle 8000Hz đi kèm.',
    specs: '54g siêu nhẹ | Focus Pro 35K Gen2 | 8000Hz Wireless'
  },
  {
    sku: 'MSI-MAG-271QPX',
    name: 'Màn hình máy tính MSI MAG 271QPX QD-OLED 27" 2K 360Hz 0.03ms',
    brand: 'MSI',
    category: 'MONITOR',
    price: 21990000,
    costPrice: 19500000,
    stock: 4,
    description: 'Màn hình gaming QD-OLED thế hệ mới siêu nét, tần số quét 360Hz đỉnh cao chuyên game eSports.',
    specs: '27 inch | QD-OLED | 2K (2560x1440) | 360Hz | 0.03ms'
  },
  {
    sku: 'ASUS-ROG-PG27AQDM',
    name: 'Màn hình máy tính ASUS ROG Swift OLED PG27AQDM 27" 2K 240Hz 0.03ms',
    brand: 'ASUS',
    category: 'MONITOR',
    price: 24990000,
    costPrice: 22000000,
    stock: 5,
    description: 'Màn hình gaming OLED đỉnh cao của ASUS ROG với hệ thống tản nhiệt tối tân hạn chế burn-in.',
    specs: '27 inch | WOLED | 2K (2560x1440) | 240Hz | 0.03ms'
  }
];

const Products = () => {
  const navigate = useNavigate();
  const [expandedRow, setExpandedRow] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Tất cả');
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteConfirmName, setDeleteConfirmName] = useState('');
  const [alertModal, setAlertModal] = useState({ isOpen: false, type: '', message: '' });
  
  const { products, deleteProduct, addProduct } = useContext(AppContext);
  const [isSeeding, setIsSeeding] = useState(false);

  const handleSeedSamples = async () => {
    if (window.confirm("Bạn có muốn tạo tự động 20 linh kiện gaming mẫu vào hệ thống không?")) {
      setIsSeeding(true);
      try {
        const existingSkus = new Set(products.map(p => p.sku));
        let count = 0;
        for (const item of sampleProducts) {
          if (!existingSkus.has(item.sku)) {
            const payload = {
              id: (Date.now() + count).toString(), // Tạo ID độc nhất ở Client như AddProduct.jsx
              name: item.name,
              sku: item.sku,
              brand: item.brand,
              category: item.category,
              price: item.price,
              costPrice: item.costPrice,
              stock: item.stock,
              description: item.description,
              specs: item.specs,
              status: 'active',
              reserved: 0,
              createdAt: new Date().toLocaleDateString('vi-VN') + ' ' + new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
              imei: [],
              image: null
            };
            await addProduct(payload);
            count++;
          }
        }
        setAlertModal({ 
          isOpen: true, 
          type: 'success', 
          message: count > 0 ? `Đã thêm thành công ${count} sản phẩm mẫu mới!` : 'Tất cả sản phẩm mẫu đã có sẵn trong danh sách!' 
        });
      } catch (err) {
        console.error(err);
        setAlertModal({ isOpen: true, type: 'error', message: `Lỗi khi tạo sản phẩm mẫu: ${err.message}` });
      } finally {
        setIsSeeding(false);
      }
    }
  };

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
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSeedSamples}
            disabled={isSeeding}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-md shadow-emerald-600/10 border border-transparent active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="w-4 h-4" />
            {isSeeding ? 'ĐANG TẠO...' : 'TẠO 20 SẢN PHẨM MẪU'}
          </button>
          <button 
            onClick={() => navigate('/products/add')}
            className="flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg bg-[#0052ff] hover:bg-[#0042d1] text-white shadow-md shadow-[#0052ff]/10 border border-transparent active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            THÊM LINH KIỆN MỚI
          </button>
        </div>
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
