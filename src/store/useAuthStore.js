import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
    persist(
        (set) => ({
            token: null,
            user: null,

            login: (tokenData, userData) => set({
                token: tokenData,
                user: userData
            }),

            logout: () => set({ 
                token: null, 
                user: null 
            }),
        }),
        {
            name: 'token-auth-customer', // Lưu token vào LocalStorage
        }
    )
);  