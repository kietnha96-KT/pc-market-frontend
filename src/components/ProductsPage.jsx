import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useCategoryStore } from '../store/useCategoryStore';

export default function ProductsPage() {
    // Quản lý URL Params
    const [searchParams, setSearchParams] = useSearchParams();

    // Lấy các tham số từ URL xuống
    const selectedCategory = searchParams.get('category') || 'All';
    const currentPage = parseInt(searchParams.get('page')) || 1;
    const searchQuery = searchParams.get('search') || '';
    const sortBy = searchParams.get('sort') || '';
    const inStock = searchParams.get('inStock') || '';
    const featured = searchParams.get('featured') || '';
    const maxPriceUrl = searchParams.get('maxPrice') || '';

    const categories = useCategoryStore(state => state.flatCategories);
    const fetchCategories = useCategoryStore(state => state.fetchCategories);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Quản lý input nhập giá tối đa (để không gọi API liên tục khi đang gõ)
    const [tempMaxPrice, setTempMaxPrice] = useState(maxPriceUrl);

    // Quản lý phân trang từ BE
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 12;

    const addToCart = useCartStore(state => state.addToCart);

    // Lấy danh mục
    useEffect(() => {
        fetchCategories();
    }, []);

    // Lấy dữ liệu sản phẩm mỗi khi Params thay đổi
    useEffect(() => {
        setLoading(true);

        const params = new URLSearchParams();
        params.append('page', currentPage);
        params.append('limit', LIMIT);

        if (searchQuery) params.append('q', searchQuery);
        if (selectedCategory !== 'All') params.append('category', selectedCategory);
        if (sortBy) params.append('sort', sortBy);
        if (inStock) params.append('inStock', inStock);
        if (featured) params.append('featured', featured);
        if (maxPriceUrl) params.append('maxPrice', maxPriceUrl);

        fetch(`/api/v1/products?${params.toString()}`)
            .then(res => res.json())
            .then(response => {
                setProducts(response.data || []);
                if (response.meta) {
                    setTotalProducts(response.meta.total || 0);
                    setTotalPages(response.meta.totalPages || 1);
                } else {
                    setTotalProducts(0);
                    setTotalPages(1);
                }
                setLoading(false);
            })
            .catch(error => {
                console.error("Lỗi tải dữ liệu sản phẩm:", error);
                setLoading(false);
            });
    }, [selectedCategory, currentPage, searchQuery, sortBy, inStock, featured, maxPriceUrl]);

    // Tạo mảng phân trang
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    // Cập nhật tham số URL và reset về trang 1
    const updateSearchParams = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        newParams.set('page', 1);
        if (value) {
            newParams.set(key, value);
        } else {
            newParams.delete(key);
        }
        setSearchParams(newParams);
    };

    // Hàm xử lý lọc danh mục
    const handleCategoryClick = (categorySlug) => {
        updateSearchParams('category', categorySlug === 'All' ? null : categorySlug);
    };

    // Hàm xử lý áp dụng mức giá
    const handleApplyPrice = () => {
        updateSearchParams('maxPrice', tempMaxPrice);
    };

    // Hàm xử lý chuyển trang
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            const newParams = new URLSearchParams(searchParams);
            newParams.set('page', newPage);
            setSearchParams(newParams);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };


    const handleAddToCart = async (e, product) => {
        e.preventDefault();
        await addToCart(product);
        alert(`🎉 Đã thêm ${product.name} vào giỏ hàng!`);
    };

    return (
        <div className="products-page-wrapper">
            {/* Cột Trái - Bộ Lọc */}
            <aside className="sidebar-filter">
                {/* Lọc Danh mục */}
                <div className="filter-block">
                    <h3 className="filter-title">DANH MỤC SẢN PHẨM</h3>
                    <ul className="category-list">
                        <li
                            className={`category-item cat-parent ${selectedCategory === 'All' ? 'active' : ''}`}
                            onClick={() => handleCategoryClick('All')}
                        >
                            Tất cả sản phẩm
                        </li>

                        {categories.map((cat) => (
                            <li
                                key={cat.id}
                                className={`category-item ${cat.isChild ? 'cat-child' : 'cat-parent'} ${selectedCategory === cat.slug ? 'active' : ''}`}
                                onClick={() => handleCategoryClick(cat.slug)}
                            >
                                {cat.isChild ? `- ${cat.name}` : cat.name.toUpperCase()}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Lọc Nâng Cao (Checkbox & Price) */}
                <div className="filter-block">
                    <h3 className="filter-title">LỌC NÂNG CAO</h3>

                    <div className="filter-item-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={inStock === 'true'}
                                onChange={(e) => updateSearchParams('inStock', e.target.checked ? 'true' : '')}
                            />
                            <span> Chỉ hiển thị hàng còn kho</span>
                        </label>
                    </div>

                    <div className="filter-item-checkbox">
                        <label>
                            <input
                                type="checkbox"
                                checked={featured === 'true'}
                                onChange={(e) => updateSearchParams('featured', e.target.checked ? 'true' : '')}
                            />
                            <span> Sản phẩm nổi bật</span>
                        </label>
                    </div>

                    <div className="filter-item-price">
                        <label>Mức giá tối đa (VNĐ):</label>
                        <div className="price-input-group">
                            <input
                                type="number"
                                placeholder="VD: 5000000"
                                className="price-input"
                                value={tempMaxPrice}
                                onChange={(e) => setTempMaxPrice(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handleApplyPrice()}
                            />
                            <button className="price-apply-btn" onClick={handleApplyPrice}>Lọc</button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Cột Phải - Hiển thị sản phẩm */}
            <main className="products-content">
                <div className="products-header">
                    <div className="header-left">
                        <h2>{selectedCategory === 'All' ? 'TẤT CẢ SẢN PHẨM' : categories.find(c => c.slug === selectedCategory)?.name?.toUpperCase() || 'SẢN PHẨM'}</h2>
                        <span className="product-count">Tìm thấy <strong>{totalProducts}</strong> sản phẩm</span>
                    </div>

                    {/* Thanh Sắp xếp */}
                    <div className="header-right sort-container">
                        <span>Sắp xếp theo: </span>
                        <select
                            className="sort-select"
                            value={sortBy}
                            onChange={(e) => updateSearchParams('sort', e.target.value)}
                        >
                            <option value="">-- Mặc định --</option>
                            <option value="newest">Mới nhất</option>
                            <option value="oldest">Cũ nhất</option>
                            <option value="price_asc">Giá tăng dần</option>
                            <option value="price_desc">Giá giảm dần</option>
                            <option value="best_selling">Bán chạy nhất</option>
                            <option value="rating">Đánh giá cao</option>
                            <option value="name_asc">Tên A-Z</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <h3 className="loading-text">Đang tải dữ liệu...</h3>
                ) : (
                    <>
                        <div className="products-grid">
                            {products.length === 0 ? (
                                <p className="no-products-msg">Không tìm thấy sản phẩm nào phù hợp với bộ lọc.</p>
                            ) : (
                                products.map(product => {
                                    const price = product.effectivePrice || product.basePrice || 0;
                                    return (
                                        <div key={product.id} className="product-card">
                                            <Link to={`/product/${product.slug || product.id}`}>
                                                <img src={product.thumbnail || '/no-image.jpg'} alt={product.name} className="product-img" />
                                                <h3 className="product-title">{product.name}</h3>
                                            </Link>
                                            <div className="product-price">{formatPrice(price)}</div>
                                            <button
                                                className="add-cart-btn"
                                                disabled={product.stockQty <= 0}
                                                onClick={(e) => handleAddToCart(e, product)}
                                            >
                                                <i className="fa-solid fa-cart-plus"></i> {product.stockQty > 0 ? 'THÊM VÀO GIỎ' : 'HẾT HÀNG'}
                                            </button>
                                        </div>
                                    )
                                })
                            )}
                        </div>

                        {/* Thanh phân trang */}
                        {totalPages > 1 && (
                            <div className="pagination-wrapper">
                                <button
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                    className="pagination-btn"
                                >
                                    Trước
                                </button>

                                {pageNumbers.map(newPage => (
                                    <button
                                        key={newPage}
                                        onClick={() => handlePageChange(newPage)}
                                        className={`pagination-btn num-btn ${currentPage === newPage ? 'active' : ''}`}
                                    >
                                        {newPage}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                    className="pagination-btn"
                                >
                                    Sau
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
        </div>
    );
}