import React, { createContext, useState, useEffect } from 'react';

export const AppContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isSupabase = API_BASE.includes('supabase.co');

const getHeaders = () => {
  const headers = { 'Content-Type': 'application/json' };
  if (isSupabase) {
    headers['apikey'] = SUPABASE_KEY;
    headers['Authorization'] = `Bearer ${SUPABASE_KEY}`;
  }
  return headers;
};

const API_USERS = `${API_BASE}/users`;

const sha256 = async (message) => {
  if (!message) return '';
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

export const secureStorage = {
  setItem: (key, value) => {
    try {
      const encodedKey = btoa(key);
      const stringVal = typeof value === 'string' ? value : JSON.stringify(value);
      const encodedVal = btoa(unescape(encodeURIComponent(stringVal)));
      sessionStorage.setItem(encodedKey, encodedVal);
    } catch (e) {
      console.error('Error saving to storage:', e);
    }
  },
  getItem: (key) => {
    try {
      const encodedKey = btoa(key);
      const encodedVal = sessionStorage.getItem(encodedKey);
      if (!encodedVal) return null;
      const decoded = decodeURIComponent(escape(atob(encodedVal)));
      try {
        return JSON.parse(decoded);
      } catch (e) {
        return decoded;
      }
    } catch (e) {
      return null;
    }
  },
  removeItem: (key) => {
    try {
      const encodedKey = btoa(key);
      sessionStorage.removeItem(encodedKey);
    } catch (e) {}
  }
};
const API_CUSTOMERS = `${API_BASE}/customers`;
const API_ORDERS = `${API_BASE}/orders`;
const API_PRODUCTS = `${API_BASE}/products`;

export const AppProvider = ({ children }) => {
  const [users, setUsers] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [activeUser, setActiveUser] = useState(null);
  const [isAuthReady, setIsAuthReady] = useState(false);

  // Global Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('drx_dark_mode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('drx_dark_mode', isDarkMode);
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const apiGet = async (url) => {
    const response = await fetch(url, { headers: getHeaders() });
    if (!response.ok) throw new Error('Lỗi tải dữ liệu');
    return response.json();
  };

  const apiPost = async (url, data) => {
    const response = await fetch(url, {
      method: 'POST',
      headers: { ...getHeaders(), ...(isSupabase ? { 'Prefer': 'return=representation' } : {}) },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Lỗi tạo mới');
    const resData = await response.json();
    return isSupabase ? resData[0] : resData;
  };

  const apiPut = async (url, id, data) => {
    const fetchUrl = isSupabase ? `${url}?id=eq.${id}` : `${url}/${id}`;
    const payload = { ...data };
    if (isSupabase) {
      delete payload.id;
    }
    const response = await fetch(fetchUrl, {
      method: isSupabase ? 'PATCH' : 'PUT',
      headers: { ...getHeaders(), ...(isSupabase ? { 'Prefer': 'return=representation' } : {}) },
      body: JSON.stringify(payload)
    });
    if (!response.ok) throw new Error('Lỗi cập nhật');
    const resData = await response.json();
    const result = isSupabase ? resData[0] : resData;
    if (isSupabase && result && !result.id) {
      result.id = id;
    }
    return result;
  };

  const apiDelete = async (url, id) => {
    const fetchUrl = isSupabase ? `${url}?id=eq.${id}` : `${url}/${id}`;
    const response = await fetch(fetchUrl, {
      method: 'DELETE',
      headers: getHeaders()
    });
    if (!response.ok) throw new Error('Lỗi xóa');
  };

  // Fetch dữ liệu từ API Backend
  const fetchAllData = async () => {
    try {
      const [freshUsers, freshCustomers, freshOrders, freshProducts] = await Promise.all([
        apiGet(API_USERS),
        apiGet(API_CUSTOMERS),
        apiGet(API_ORDERS),
        apiGet(API_PRODUCTS)
      ]);

      setUsers(freshUsers);
      setCustomers(freshCustomers);
      setOrders(freshOrders);
      setProducts(freshProducts);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu từ Server:', error);
    }

    // Vẫn dùng secureStorage để giữ phiên Đăng nhập tạm thời khi tắt trình duyệt
    const storedActiveUser = secureStorage.getItem('drx_active_user');
    if (storedActiveUser) {
      setActiveUser(storedActiveUser);
    } else {
      setActiveUser(null);
    }
    setIsAuthReady(true);
  };

  // Nạp dữ liệu một lần khi App chạy
  useEffect(() => {
    fetchAllData();
  }, []);

  const login = async (email, password) => {
    try {
      const cleanEmail = email.replace(/\s+/g, '').toLowerCase();
      const freshUsers = await apiGet(API_USERS);
      const foundUser = freshUsers.find(u => u.email.replace(/\s+/g, '').toLowerCase() === cleanEmail);
      
      if (!foundUser) return { success: false, message: 'Email đăng nhập không tồn tại.' };
      
      const hashedEntered = await sha256(password);
      const isHashedInDb = foundUser.password && foundUser.password.length === 64 && /^[0-9a-f]+$/.test(foundUser.password);
      
      let isMatch = false;
      if (isHashedInDb) {
        isMatch = foundUser.password === hashedEntered;
      } else {
        isMatch = foundUser.password === password;
        if (isMatch) {
          // Upgrade password to hash in DB progressively
          try {
            await apiPut(API_USERS, foundUser.id, { ...foundUser, password: hashedEntered });
            foundUser.password = hashedEntered; // Update local reference
          } catch (e) {
            console.error('Không nâng cấp mật khẩu tự động được:', e);
          }
        }
      }
      
      if (!isMatch) return { success: false, message: 'Mật khẩu không chính xác.' };
      if (!foundUser.isActive) return { success: false, message: 'Tài khoản này đã bị khóa. Vui lòng liên hệ Admin tối cao.' };
      
      const userToStore = { ...foundUser };
      delete userToStore.password;

      secureStorage.setItem('admin_token', 'DRX_TOKEN_MOCK_123456');
      secureStorage.setItem('drx_active_user', userToStore);
      setActiveUser(foundUser);
      
      return { success: true };
    } catch (error) {
      console.error('Lỗi kết nối Server:', error);
      return { success: false, message: 'Lỗi kết nối máy chủ API. Vui lòng kiểm tra lại mạng.' };
    }
  };

  const logout = () => {
    secureStorage.removeItem('admin_token');
    secureStorage.removeItem('drx_active_user');
    setActiveUser(null);
  };

  const addUser = async (newUser) => {
    try {
      const payload = { ...newUser };
      if (payload.password) {
        payload.password = await sha256(payload.password);
      }
      if (isSupabase) {
        delete payload.id;
      }
      const created = await apiPost(API_USERS, payload);
      setUsers(prev => [...prev, created]);
    } catch (error) { console.error('Lỗi tạo user:', error); }
  };

  const updateUser = async (updatedUser) => {
    try {
      const payload = { ...updatedUser };
      if (payload.password) {
        const isAlreadyHashed = payload.password.length === 64 && /^[0-9a-f]+$/.test(payload.password);
        if (!isAlreadyHashed) {
          payload.password = await sha256(payload.password);
        }
      }
      const updated = await apiPut(API_USERS, payload.id, payload);
      setUsers(prev => prev.map(u => (String(u.id) === String(updated.id) ? updated : u)));
      if (activeUser && String(activeUser.id) === String(updated.id)) {
        setActiveUser(updated);
        const userToStore = { ...updated };
        delete userToStore.password;
        secureStorage.setItem('drx_active_user', userToStore);
      }
    } catch (error) { console.error('Lỗi cập nhật user:', error); }
  };

  const deleteUser = async (id) => {
    try {
      await apiDelete(API_USERS, id);
      setUsers(prev => prev.filter(u => String(u.id) !== String(id)));
      if (activeUser && String(activeUser.id) === String(id)) logout();
    } catch (error) { console.error('Lỗi xóa user:', error); }
  };

  // --- CUSTOMERS API ---
  const addCustomer = async (newItem) => {
    try {
      const created = await apiPost(API_CUSTOMERS, newItem);
      setCustomers(prev => [...prev, created]);
    } catch (e) { console.error(e); }
  };
  const updateCustomer = async (updatedItem) => {
    try {
      const updated = await apiPut(API_CUSTOMERS, updatedItem.id, updatedItem);
      setCustomers(prev => prev.map(item => String(item.id) === String(updated.id) ? updated : item));
    } catch (e) { console.error(e); }
  };
  const deleteCustomer = async (id) => {
    try {
      await apiDelete(API_CUSTOMERS, id);
      setCustomers(prev => prev.filter(item => String(item.id) !== String(id)));
    } catch (e) { console.error(e); }
  };

  // --- ORDERS API ---
  const addOrder = async (newItem) => {
    try {
      const created = await apiPost(API_ORDERS, newItem);
      setOrders(prev => [created, ...prev]);
    } catch (e) { console.error(e); }
  };
  const deleteOrder = async (id) => {
    try {
      await apiDelete(API_ORDERS, id);
      setOrders(prev => prev.filter(item => String(item.id) !== String(id)));
    } catch (e) { console.error(e); }
  };

  // --- PRODUCTS API ---
  const addProduct = async (newItem) => {
    try {
      const created = await apiPost(API_PRODUCTS, newItem);
      setProducts(prev => [created, ...prev]);
    } catch (e) { console.error(e); }
  };
  const updateProduct = async (updatedItem) => {
    try {
      const updated = await apiPut(API_PRODUCTS, updatedItem.id, updatedItem);
      setProducts(prev => prev.map(item => String(item.id) === String(updated.id) ? updated : item));
    } catch (e) { console.error(e); }
  };
  const deleteProduct = async (id) => {
    try {
      await apiDelete(API_PRODUCTS, id);
      setProducts(prev => prev.filter(item => String(item.id) !== String(id)));
    } catch (e) { console.error(e); }
  };

  return (
    <AppContext.Provider value={{ 
      users, activeUser, isAuthReady, fetchUsers: fetchAllData, 
      login, logout, addUser, updateUser, deleteUser,
      customers, addCustomer, updateCustomer, deleteCustomer,
      orders, addOrder, deleteOrder,
      products, setProducts, addProduct, updateProduct, deleteProduct,
      isDarkMode, setIsDarkMode
    }}>
      {children}
    </AppContext.Provider>
  );
};
