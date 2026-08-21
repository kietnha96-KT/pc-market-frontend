import { create } from 'zustand';
import api from '../services/api';

export const useCategoryStore = create((set, get) => ({
    categories: [],
    flatCategories: [], // Mảng phẳng xử lý sẵn isChild cho ProductsPage

    // 1. Hàm lấy danh mục Public (Dành cho Header, FixedNav, ProductsPage)
    fetchCategories: async () => {
        // Chặn gọi API nếu đã có dữ liệu (Chống Spam Request)
        if (get().categories.length > 0) return;

        try {
            const response = await api.get('/categories');
            const data = response.data?.data || [];
            
            // Format flatCategories giống logic cũ của ProductsPage
            let flat = [];
            data.forEach(parent => {
                flat.push({ ...parent, isChild: false });
                if (parent.children?.length > 0) {
                    parent.children.forEach(child => {
                        flat.push({ ...child, isChild: true });
                    });
                }
            });

            set({ categories: data, flatCategories: flat });
        } catch (error) {
            console.error("Lỗi tải danh mục chung:", error);
        }
    },

    // 2. Hàm lấy danh mục Private (Dành cho Admin - luôn gọi lại để cập nhật CRUD)
    fetchAdminCategories: async () => {
        try {
            const response = await api.get('/admin/categories');
            set({ categories: response.data?.data || [] });
        } catch (error) {
            console.error("Lỗi tải danh mục Admin:", error);
        }
    }
}));