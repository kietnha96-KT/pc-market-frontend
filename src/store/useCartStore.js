import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../services/api';

export const useCartStore = create(
    persist(
        (set, get) => ({
            cart: [],
            cartSessionId: null, // Lưu mã mã cart khách vãng lai

            // Hàm lưu lại Session ID từ BE trả về qua header
            saveSessionId: (response) => {
                const sessionId = response.headers['x-cart-session'];
                if (sessionId && !get().cartSessionId) {
                    set({ cartSessionId: sessionId });
                }
            },

            // Lấy dữ liệu giỏ hàng từ BE
            fetchCartFromBE: async () => {
                try {
                    const response = await api.get('/cart');
                    // Khi user thoát, cart trong sessionID đã đc tích hợp qua cart chính thức, nên BE trả về dữ liệu rỗng, nên giỏ hàng lúc đó reset
                    const cartData =  response.data?.data?.items || []; 
                    set({ cart: cartData });
                    get().saveSessionId(response);
                } catch (error) {
                    console.error("Lỗi tải giỏ hàng:", error);
                }
            },

            //------ Hàm thêm sản phẩm
            addToCart: async (product) => {
                const state = get(); // Thao tác trên dữ liệu tạm
                const previousCart = state.cart; // Backup
                   
                // Cart trong store cập nhật trước, để render lên giỏ hàng cho nhanh
                // Kiểm tra sản phẩm trong giỏ
                const existingItem = state.cart.find(item => {
                    const targetId = item.productId || (item.product && item.product.id) || item.id;
                    return targetId === product.id;
                });

                if (existingItem) {
                    // Nếu đã có trong giỏ -> Tăng số lượng trên UI
                    set({
                        cart: state.cart.map(item => {
                            const targetId = item.productId || (item.product && item.product.id) || item.id;
                            return targetId === product.id ? { ...item, quantity: item.quantity + 1 } : item;
                        })
                    });
                } else {
                    // Nếu chưa có -> Ép thêm 1 object tạm vào
                    set({ 
                        cart: [...state.cart, { productId: product.id, quantity: 1, product: product }] 
                    });
                }

                // Sau đó mới gọi API cập nhật vào giỏ hàng thật trong BE
                try {
                    const response = await api.post('/cart/items', {
                        productId: product.id,
                        quantity: 1,
                        mode: "add"
                    });
                    get().saveSessionId(response);

                } catch (error) {
                    console.error("Lỗi thêm vào giỏ:", error);
                    set({ cart: previousCart }); // Rollback nếu mạng rớt
                    alert("Có lỗi xảy ra, vui lòng thử lại!");
                }
            },

            // -------- Hàm tăng số lượng 
            increaseQuantity: async (productId) => {
                const state = get();
                const previousCart = state.cart; 

                // Cart cập nhật trước
                set({
                    cart: state.cart.map(item => {
                        const targetId = item.productId || (item.product && item.product.id) || item.id;
                        return targetId === productId ? { ...item, quantity: item.quantity + 1 } : item;
                    })
                });

                //  Sau đó mới gọi API cập nhật vào giỏ hàng thật trong BE
                try {
                    await api.post('/cart/items', {
                        productId: productId,
                        quantity: 1,
                        mode: "add"
                    });
                    
                } catch (error) {
                    console.error("Lỗi tăng số lượng:", error);
                    set({ cart: previousCart }); // Nếu API rớt mạng, lùi lại số lượng cũ
                    const backendMessage = error.response?.data?.message || "Sản phẩm đã đạt giới hạn tồn kho!";
                    alert(backendMessage);
                }
            },

            //------------ Hàm giảm số lượng
            decreaseQuantity: async (productId) => {
                const state = get();
                const previousCart = state.cart; 

                // Tìm món đồ để kiểm tra trừ số lượng
                const itemToUpdate = state.cart.find(i => {
                    const targetId = i.productId || (i.product && i.product.id) || i.id;
                    return targetId === productId;
                });

                if (!itemToUpdate) return;
                const newQty = itemToUpdate.quantity - 1;

                if (newQty <= 0) {
                    await state.removeFromCart(productId);
                    return;
                }

                //  Cart cập nhật trước
                set({
                    cart: state.cart.map(item => {
                        const targetId = item.productId || (item.product && item.product.id) || item.id;
                        return targetId === productId ? { ...item, quantity: newQty } : item;
                    })
                });

                //  Sau đó mới gọi API cập nhật vào giỏ hàng thật trong BE
                try {
                    await api.post('/cart/items', {
                        productId: productId,
                        quantity: newQty,
                        mode: "set" 
                    });
                } catch (error) {
                    console.error("Lỗi giảm số lượng:", error);
                    set({ cart: previousCart });
                }
            },

            // ------------ Hàm xóa, giảm 1 sản phẩm
            removeFromCart: async (productId) => {
                const state = get();
                const previousCart = state.cart;

                // Cart cập nhật trước
                set({
                    cart: state.cart.filter(item => {
                        const targetId = item.productId || (item.product && item.product.id) || item.id;
                        return targetId !== productId;
                    })
                });

                // Sau đó mới gọi API cập nhật vào giỏ hàng thật trong BE
                try {
                    await api.post('/cart/items', {
                        productId: productId,
                        quantity: 0,
                        mode: "set"
                    });
                } catch (error) {
                    console.error("Lỗi xóa sản phẩm:", error);
                    set({ cart: previousCart });
                }
            },

            // ------------- Hàm xóa toàn bộ giỏ hàng
            clearCart: async () => {
                try {
                    await api.delete('/cart');
                    set({ cart: [], cartSessionId: null }); 
                } catch (error) {
                    console.error("Lỗi xóa toàn bộ giỏ hàng:", error);
                }
            },
        }),
        {
            name: 'shopping-cart-storage', 
            // Lưu cartSessionId vào LocalStorage
            partialize: (state) => ({ cartSessionId: state.cartSessionId }),
        }
    )
);