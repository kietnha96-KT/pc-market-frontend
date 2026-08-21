import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAdminAuthStore = create(
    persist(
        (set) => ({
            token: null,
            refreshToken: null,
            user: null,

            login: (tokenData, userData, refreshTokenData) => set({
                token: tokenData,
                user: userData,
                refreshToken: refreshTokenData,
            }),

            logout: () => set({
                token: null,
                refreshToken: null,
                user: null,
            }),
        }),
        {
            name: 'token-auth-admin', // Lưu token vào LocalStorage
        }
    )
);