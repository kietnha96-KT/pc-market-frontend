import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCategoryStore } from '../store/useCategoryStore';

// Prop nhận vào từ component Homepage
export default function ProductSection({ parentSlug }) {
    const [products, setProducts] = useState([]);

    const categories = useCategoryStore(state => state.categories);
    const fetchCategories = useCategoryStore(state => state.fetchCategories);

    // Quản lý danh mục cha và danh mục con
    const [categoryInfo, setCategoryInfo] = useState(null);
    const [activeChildSlug, setActiveChildSlug] = useState('');

    // Quản lý trượt slide, bảng phụ detail mở 
    const [index, setIndex] = useState(0);
    const [hoveredId, setHoveredId] = useState(null); // Dùng để làm toán tử 3 ngôi, mở popup detail trong HTML
    const [hoverDirection, setHoverDirection] = useState('');

    // Đảm bảo danh mục đã được tải về Store
    useEffect(() => {
        fetchCategories();
    }, []);

    // Lấy thông tin danh mục cha và danh mục con
    useEffect(() => {
        if (!parentSlug) return;

        const matchedCategory = categories.find(cat => cat.slug === parentSlug);
        setCategoryInfo(matchedCategory);

        // Tự động set activeChildSlug là danh mục con đầu tiên nếu có, để luôn luôn render khi mở trang
        if (matchedCategory && matchedCategory.children && matchedCategory.children.length > 0) {
            setActiveChildSlug(matchedCategory.children[0].slug);
        } else if (matchedCategory) {
            // Nếu không có danh mục con, lấy luôn chính nó
            setActiveChildSlug(matchedCategory.slug);
        }
    }, [parentSlug, categories]);

    // Lấy lại dữ liệu, mỗi khi bấm chọn thay đổi danh mục con
    useEffect(() => {
        if (!activeChildSlug) return;

        fetch(`/api/v1/products?category=${activeChildSlug}`)
            .then(res => res.json())
            .then(response => {
                if (response && response.success && response.data) {
                    setProducts(response.data);
                } else {
                    setProducts([]);
                }
                setIndex(0); // Reset lại thanh trượt
            })
            .catch(err => console.log("Lỗi tải sản phẩm:", err));
    }, [activeChildSlug]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    const handlePrev = () => setIndex(prev => (prev > 0 ? prev - 1 : products.length - 1));
    const handleNext = () => setIndex(prev => (prev < products.length - 1 ? prev + 1 : 0));
    const handleMouseLeave = () => { setHoveredId(null); setHoverDirection(''); };
    const handleMouseEnter = (e, id) => {
        let box = e.currentTarget;
        let screen = box.closest(".product-screen");
        if (box && screen) {
            let boxPos = box.getBoundingClientRect();
            let screenPos = screen.getBoundingClientRect();
            if (boxPos.right + 450 > screenPos.right) setHoverDirection("open-left"); // Lấy 450 để mở trái phải
            else setHoverDirection("open-right");
        }
        setHoveredId(id);
    };

    return (
        <div className="product">
            <div className="product-top">
                <div className="product-topleft">
                    <div className="product-title">
                        <Link to={`/products?category=${categoryInfo?.slug || ''}`}>
                            <p>{categoryInfo?.name || 'Đang cập nhật'}</p>
                        </Link>
                    </div>
                    <ul className="product-list">
                        {/* Map danh mục con từ danh mục cha */}
                        {categoryInfo?.children?.map(child => (
                            <li
                                key={child.id}
                                onClick={() => setActiveChildSlug(child.slug)} // Set state danh mục con, để Effect chạy API render lại
                                style={{
                                    color: activeChildSlug === child.slug ? '#f00' : 'inherit',
                                    fontWeight: activeChildSlug === child.slug ? 'bold' : 'normal'
                                }}
                            >
                                {child.name.toUpperCase()}
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="product-topright">
                    <ul className="product-list">
                        <li><Link to={`/products?category=${categoryInfo?.slug || ''}`}>XEM TẤT CẢ</Link></li>
                    </ul>
                </div>
            </div>

            <div className="product-slide">
                <div className="product-screen">
                    {products.length === 0 ? (
                        <p>Chưa có sản phẩm nào trong mục này.</p>
                    ) : (
                        <div className="product-track"
                            style={{ transform: `translateX(-${index * 100 / 7}%)` }}>
                            {products.map(product => (
                                <div className={`product-box ${hoveredId === product.id ? hoverDirection : ''}`}
                                    key={product.id}
                                    onMouseEnter={(e) => handleMouseEnter(e, product.id)}
                                    onMouseLeave={handleMouseLeave}>
                                    <Link to={`/product/${product.slug || product.id}`}>
                                        {product.discountPercent > 0 && <div className="product-box-top">Giảm {product.discountPercent}%</div>}
                                        <div className="product-box-content">
                                            <img src={product.thumbnail || 'https://placehold.co/150x150?text=No+Image'} alt={product.name} />
                                            <p className="product-box-title">{product.name}</p>
                                        </div>
                                        <div className="product-box-bottom">
                                            <div className="product-price">{formatPrice(product.effectivePrice || product.basePrice)}</div>
                                            <i className="fa-solid fa-cart-shopping"></i>
                                        </div>
                                        <div className="product-box-detail">
                                            <h5>Tên SP: {product.name}</h5>
                                            <h5>Mô tả: {product.shortDesc || 'Đang cập nhật'}</h5>
                                            <h5>Tình trạng: {product.stockQty > 0 ? `Còn hàng (${product.stockQty})` : 'Hết hàng'}</h5>
                                            {product.basePrice !== product.effectivePrice && <h5>Giá gốc: <del>{formatPrice(product.basePrice)}</del></h5>}
                                            <h5>Giá bán: {formatPrice(product.effectivePrice)}</h5>
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {products.length > 0 && (
                    <>
                        <button className="btn-pre1" onClick={handlePrev}><i className="fa-solid fa-chevron-left"></i></button>
                        <button className="btn-next1" onClick={handleNext}><i className="fa-solid fa-chevron-right"></i></button>
                    </>
                )}
            </div>
        </div>
    );
}