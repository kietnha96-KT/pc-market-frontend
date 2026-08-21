import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useCategoryStore } from '../store/useCategoryStore';
import MegaMenu from './MegaMenu';

export default function FixedNav() {

    const [searchQuery, setSearchQuery] = useState('');
    const [category, setCategory] = useState(''); 
    const [isVisible, setIsVisible] = useState(false);
    const categories = useCategoryStore(state => state.categories);
    const fetchCategories = useCategoryStore(state => state.fetchCategories);

    const navigate = useNavigate();

    const cart = useCartStore((state) => state.cart);
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

    // Scroll để bật tắt Fixed Nav
    useEffect(() => {
        const handleScroll = () => {
            const header = document.querySelector('header');
            if (header) {
                const headerPos = header.offsetHeight;
                if (window.scrollY > headerPos) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    // Gọi API lấy menu thả xuống cho ô Search
    useEffect(() => {
        fetchCategories();
    }, []);
    
    // Xử lý Search
    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        
        if (category && category !== 'All') params.append('category', category);
        if (searchQuery.trim()) params.append('search', searchQuery.trim());

        navigate(`/products?${params.toString()}`);
    };

    return (
        <div className={`fixed-nav ${isVisible ? 'show' : ''}`}>
            <ul className="menu" id="menu">
                <li>
                    <Link to="/products" className="menu-link">
                        DANH MỤC SẢN PHẨM <i className="fa-solid fa-caret-down"></i>
                    </Link>
                    <MegaMenu />
                </li>
            </ul>

            <form className="search" onSubmit={handleSearch}>
                <select
                    value={category} 
                    onChange={(e) => setCategory(e.target.value)}
                >
                    <option value="All">Tất cả danh mục</option>
                    
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.slug}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Tìm kiếm sản phẩm"
                />

                <button type="submit">
                    <i className="fa-solid fa-magnifying-glass" style={{ color: 'white' }}></i>
                </button>
            </form>

            <div className="right-box">
                <div className="right-boxdetail">
                    <i className="fa-solid fa-phone"></i>
                    <div>
                        <div>Hotline</div>
                        <div>079.797.7979</div>
                    </div>
                </div>
                
                <div className="right-boxdetail">
                    <i className="fa-solid fa-display"></i>
                    <div>
                        <div>Xây dựng cấu hình</div>
                    </div>
                </div>
                
                <div className="right-boxdetail">
                    <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ position: 'relative' }}>
                            <i className="fa-solid fa-cart-shopping"></i>
                            {cartCount > 0 && (
                                <span className='tick-cart'>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                        <span>Giỏ hàng</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}