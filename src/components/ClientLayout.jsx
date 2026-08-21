import React , { useEffect }from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import FixedNav from './FixedNav';
import Footer from './Footer';
import FixedButton from './FixedButton';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';

export default function ClientLayout() {

    const fetchCartFromBE = useCartStore((state) => state.fetchCartFromBE);
    const token = useAuthStore((state) => state.token);

    // Mỗi lần vào web gọi giỏ hàng mới
    useEffect(() => {
        fetchCartFromBE();
    }, [token]);

    return (
        <div className="client-wrapper">
            <Header />
            <FixedNav />
            
            {/* Thẻ Outlet là nơi React Router tự động nhét nội dung của HomePage, CartPage... vào */}
            <main>
                <Outlet /> 
            </main>

            <Footer />
            <FixedButton />
        </div>
    );
}