import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, BookOpen } from 'lucide-react';

// Bộ dữ liệu tri thức hướng dẫn sử dụng DRX Store toàn tập
const DRX_KNOWLEDGE = {
  pos: `Để BÁN HÀNG và THANH TOÁN (POS):
1. Nhấp vào mục "POS" trên thanh menu bên trái.
2. Chọn các linh kiện cần bán bằng cách nhấn vào chúng ở danh sách sản phẩm.
3. Ở cột Giỏ hàng bên phải, điều chỉnh số lượng hoặc click dấu X để xóa bớt.
4. Chọn Khách hàng (bằng cách tìm kiếm mã khách hàng hoặc tên khách hàng).
5. Nhấp nút "THANH TOÁN" màu xanh dương bên dưới.
6. Màn hình sẽ hiện hộp thoại hỏi "Bạn có muốn in hóa đơn không?". Chọn "Có" để in mẫu hóa đơn nhiệt 80mm có thương hiệu DRX STORE, thông tin đơn và danh sách linh kiện.`,

  product: `Để QUẢN LÝ HÀNG HÓA & THÊM SẢN PHẨM:
1. Truy cập mục "Hàng hóa" ở danh sách menu.
2. Bấm nút "THÊM LINH KIỆN MỚI" ở góc phải.
3. Điền các thông tin bắt buộc: Tên sản phẩm, Hãng, Danh mục, Giá bán, Giá vốn và Số lượng tồn kho ban đầu.
4. Nhấn "Lưu" để hoàn tất. Hệ thống sẽ tự động tạo mã SKU ngẫu nhiên nếu bạn để trống.`,

  stock: `Để NHẬP HÀNG & CẬP NHẬT TỒN KHO:
1. Truy cập mục "Hàng hóa" trên Sidebar.
2. Tìm kiếm sản phẩm cần nhập thêm hàng, nhấp vào biểu tượng Bút chì (Sửa).
3. Tại ô "Tồn kho", cộng thêm số lượng hàng mới nhập vào số lượng đang có (Hoặc ghi đè số lượng tồn kho mới thực tế).
4. Bạn có thể cập nhật lại "Giá vốn" hoặc "Giá bán" nếu đợt nhập hàng này có sự thay đổi về giá.
5. Bấm "Lưu thay đổi" và xác nhận popup thông báo thành công để cập nhật lên hệ thống.`,

  imei: `Để QUẢN LÝ SỐ IMEI / SERIAL NUMBER:
1. Trong giao diện "Hàng hóa", nhấp vào biểu tượng Bút chì (Sửa) của sản phẩm tương ứng.
2. Ở phần thông tin chi tiết, nhấp vào nút "Nhập IMEI" ở ô IMEI.
3. Nhập danh sách số Serial/IMEI tương ứng với từng linh kiện có trong kho.
4. Bấm "Lưu" để lưu trữ an toàn. Mỗi số IMEI sẽ giúp bạn quản lý chính xác khi bán hàng và bảo hành.`,

  order: `Để QUẢN LÝ HÓA ĐƠN & HỦY ĐƠN HOÀN KHO:
1. Truy cập mục "Hóa đơn" trên Sidebar.
2. Hệ thống hiển thị danh sách tất cả các hóa đơn đã xuất bán kèm Ngày tạo, Mã khách hàng, Tổng tiền và Chiết khấu.
3. Nhấp vào một dòng hóa đơn bất kỳ để xem danh sách chi tiết các linh kiện đã bán của đơn đó.
4. Để HỦY ĐƠN HÀNG: Click vào biểu tượng Thùng rác (Xóa) của hóa đơn đó. Hệ thống sẽ tự động hoàn trả số lượng linh kiện trong đơn đó về kho hàng (tăng lại tồn kho).`,

  customer: `Để QUẢN LÝ KHÁCH HÀNG & CÔNG NỢ:
1. Chọn mục "Khách hàng" trên menu bên trái.
2. Tại đây có thể quản lý danh sách khách hàng gồm: Mã khách hàng (VD: DRX-KH2629), Tên, SĐT, Doanh số tích lũy và số dư nợ hiện tại.
3. Khi tạo đơn hàng tại POS, chọn đúng khách hàng để hệ thống tự động cộng dồn doanh số và tính toán công nợ cho khách hàng đó.`,

  analytics: `Để XEM BÁO CÁO DOANH THU & BIỂU ĐỒ PHÂN TÍCH:
1. Nhấp vào mục "Tổng quan" trên menu bên trái: Xem tổng doanh thu bán hàng, lợi nhuận gộp, số đơn hàng đã bán, số lượng linh kiện đã xuất và biểu đồ doanh thu chạy theo ngày.
2. Nhấp vào mục "Báo cáo": Xem phân tích sâu hơn bằng biểu đồ, thống kê danh sách sản phẩm bán chạy nhất (Top-selling) và tỷ lệ đóng góp của từng danh mục sản phẩm (CPU, CARD, RAM...).`,

  accounts: `Để QUẢN LÝ NHÂN VIÊN & PHÂN QUYỀN (Dành cho Admin):
1. Truy cập mục "Tài khoản" trên Sidebar.
2. Thêm nhân viên mới: Bấm "Thêm tài khoản mới", điền Tên, Email, Mật khẩu và phân loại Phòng ban (Admin / Bán hàng).
3. Đổi trạng thái: Click vào ô trạng thái "Hoạt động" để Khóa hoặc Kích hoạt tài khoản nhân viên.
4. Phân quyền chi tiết: Click vào biểu tượng Bút chì ở dòng nhân viên, tích chọn các quyền cụ thể như "Xem tồn kho", "Thêm sản phẩm", "Hủy đơn", "Xem doanh thu" rồi bấm "Lưu".`,

  password: `Để ĐỔI MẬT KHẨU tài khoản:
1. Nhấn vào Avatar của bạn ở góc trên cùng bên phải màn hình.
2. Chọn "Đổi mật khẩu".
3. Nhập mật khẩu mới vào ô trống rồi nhấn nút "Lưu". Mật khẩu của bạn sẽ được mã hóa an toàn và cập nhật ngay lập tức.`,

  security: `Về BẢO MẬT HỆ THỐNG:
1. Mật khẩu nhân viên: Được mã hóa SHA-256 một chiều ngay tại trình duyệt trước khi gửi lên database (Supabase).
2. Session Storage: Mọi thông tin đăng nhập lưu trên trình duyệt đều được mã hóa Base64 và tự động xóa mật khẩu thô để tránh bị xem trộm qua F12 Console.
3. Mã nguồn Frontend: Đã được tắt Sourcemaps và nén/obfuscate tối đa để khi hacker mở F12 Sources sẽ chỉ thấy các dòng code đã bị xáo trộn, không thể đọc hiểu cấu trúc hệ thống.`
};

export const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'Xin chào! Tôi là Trợ lý ảo DRX Store. Bạn cần tôi hướng dẫn sử dụng tác vụ nào trên hệ thống hôm nay?' }
  ]);
  const [input, setInput] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (textToSend) => {
    const text = textToSend || input;
    if (!text.trim()) return;

    // Gửi tin nhắn của User
    setMessages(prev => [...prev, { sender: 'user', text }]);
    if (!textToSend) setInput('');

    // Phản hồi tự động của Bot
    setTimeout(() => {
      let reply = 'Xin lỗi, tôi chưa hiểu rõ câu hỏi của bạn. Hãy nhấn vào các gợi ý nhanh bên dưới hoặc hỏi về các chủ đề: "pos", "nhập hàng", "thêm sản phẩm", "hóa đơn", "khách hàng", "báo cáo", "phân quyền", "bảo mật".';
      const cleanText = text.toLowerCase();

      if (cleanText.includes('pos') || cleanText.includes('thanh toan') || cleanText.includes('ban hang') || cleanText.includes('in hoa don') || cleanText.includes('bill') || cleanText.includes('check out')) {
        reply = DRX_KNOWLEDGE.pos;
      } else if (cleanText.includes('thêm sản phẩm') || cleanText.includes('thêm linh kiện') || cleanText.includes('tạo sản phẩm') || cleanText.includes('them san pham')) {
        reply = DRX_KNOWLEDGE.product;
      } else if (cleanText.includes('nhập hàng') || cleanText.includes('sửa kho') || cleanText.includes('tồn kho') || cleanText.includes('kho') || cleanText.includes('nhap hang') || cleanText.includes('ton kho') || cleanText.includes('sửa sản phẩm')) {
        reply = DRX_KNOWLEDGE.stock;
      } else if (cleanText.includes('imei') || cleanText.includes('serial') || cleanText.includes('sê-ri') || cleanText.includes('seri')) {
        reply = DRX_KNOWLEDGE.imei;
      } else if (cleanText.includes('hóa đơn') || cleanText.includes('đơn hàng') || cleanText.includes('hủy đơn') || cleanText.includes('xóa hóa đơn') || cleanText.includes('hoàn kho') || cleanText.includes('hoa don') || cleanText.includes('orders')) {
        reply = DRX_KNOWLEDGE.order;
      } else if (cleanText.includes('khách hàng') || cleanText.includes('công nợ') || cleanText.includes('nợ') || cleanText.includes('khach hang') || cleanText.includes('customer')) {
        reply = DRX_KNOWLEDGE.customer;
      } else if (cleanText.includes('báo cáo') || cleanText.includes('doanh thu') || cleanText.includes('biểu đồ') || cleanText.includes('doanh số') || cleanText.includes('phân tích') || cleanText.includes('analytics')) {
        reply = DRX_KNOWLEDGE.analytics;
      } else if (cleanText.includes('nhân viên') || cleanText.includes('tài khoản') || cleanText.includes('phân quyền') || cleanText.includes('quyền') || cleanText.includes('staff') || cleanText.includes('user') || cleanText.includes('account')) {
        reply = DRX_KNOWLEDGE.accounts;
      } else if (cleanText.includes('mật khẩu') || cleanText.includes('đổi mật khẩu') || cleanText.includes('pass') || cleanText.includes('password')) {
        reply = DRX_KNOWLEDGE.password;
      } else if (cleanText.includes('bảo mật') || cleanText.includes('mã hóa') || cleanText.includes('f12') || cleanText.includes('devtools') || cleanText.includes('hack') || cleanText.includes('an toan')) {
        reply = DRX_KNOWLEDGE.security;
      }

      setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
    }, 500);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Nút bong bóng chat */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center justify-center w-14 h-14 rounded-full bg-[#0052ff] hover:bg-[#0042d1] text-white shadow-lg hover:shadow-xl active:scale-95 transition-all animate-bounce"
        >
          <MessageSquare className="w-6 h-6" />
        </button>
      )}

      {/* Cửa sổ Trợ lý ảo */}
      {isOpen && (
        <div className="w-80 sm:w-[400px] h-[520px] bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
          
          {/* Header */}
          <div className="p-4 bg-[#0052ff] text-white flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider">Trợ Lý DRX Store</h4>
                <p className="text-[10px] text-blue-200 font-semibold">Hướng dẫn sử dụng hệ thống</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 p-1.5 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Dòng tin nhắn */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[11px] leading-relaxed whitespace-pre-line font-medium shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-[#0052ff] text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Gợi ý nhanh */}
          <div className="p-2 bg-slate-100 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-700 flex gap-1.5 overflow-x-auto whitespace-nowrap scrollbar-none">
            <button onClick={() => handleSend('Hướng dẫn POS')} className="px-2.5 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 hover:text-[#0052ff] transition-all">Bán hàng POS</button>
            <button onClick={() => handleSend('Cách nhập hàng')} className="px-2.5 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 hover:text-[#0052ff] transition-all">Nhập hàng & Kho</button>
            <button onClick={() => handleSend('Cách thêm sản phẩm')} className="px-2.5 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 hover:text-[#0052ff] transition-all">Thêm sản phẩm</button>
            <button onClick={() => handleSend('Quản lý hóa đơn')} className="px-2.5 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 hover:text-[#0052ff] transition-all">Quản lý Hóa đơn</button>
            <button onClick={() => handleSend('Nhân viên và quyền')} className="px-2.5 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 hover:text-[#0052ff] transition-all">Nhân viên & Quyền</button>
            <button onClick={() => handleSend('Đổi mật khẩu')} className="px-2.5 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 hover:text-[#0052ff] transition-all">Đổi mật khẩu</button>
            <button onClick={() => handleSend('Bảo mật hệ thống')} className="px-2.5 py-1 bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-bold border border-slate-200 dark:border-slate-600 hover:text-[#0052ff] transition-all">Bảo mật F12</button>
          </div>

          {/* Khung nhập tin nhắn */}
          <div className="p-3 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex gap-2">
            <input
              type="text"
              placeholder="Nhập câu hỏi của bạn..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-900/50 text-xs font-semibold text-slate-800 dark:text-white rounded-xl border border-slate-200 dark:border-slate-700 focus:outline-none focus:border-[#0052ff]"
            />
            <button onClick={() => handleSend()} className="p-2 bg-[#0052ff] hover:bg-[#0042d1] text-white rounded-xl active:scale-95 transition-all">
              <Send className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
};
