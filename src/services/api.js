// src/utils/api.js
import axios from 'axios';
import { useAdminAuthStore } from '../store/useAdminAuthStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

const api = axios.create({
    // VITE_API_URL sẽ được lấy từ Vercel khi deploy. 
    // Khi chạy local sẽ mặc định dùng Proxy của Vite.
    baseURL: "/api/v1", 
    headers: {
        'Content-Type': 'application/json',
    }
});

// Điều hướng gắn token
api.interceptors.request.use(
    (config) => {
        const adminToken = useAdminAuthStore.getState().token;
        const customerToken = useAuthStore.getState().token;
        const cartSessionId = useCartStore.getState().cartSessionId;

        // Kiểm tra xem URL có đang ở trang admin hay không.
        const isAdminPage = window.location.pathname.startsWith('/admin');

        if (isAdminPage && adminToken) {
            // Nếu đang đứng ở giao diện Admin => gắn token admin
            config.headers.Authorization = `Bearer ${adminToken}`;
        } else {
            // Giao diện Customer
            if (customerToken) {
                // Đã đăng nhập thì gắn Token
                config.headers.Authorization = `Bearer ${customerToken}`;
            }
            if (cartSessionId) {
                // Chưa đăng nhập mà có Session giỏ hàng thì gắn Session
                config.headers['X-Cart-Session'] = cartSessionId;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

export default api;