import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper/modules';
import { useCartStore } from '../store/useCartStore';

import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

export default function ProductDetailPage() {
    // Lấy tham số từ URL (Khai báo là :id nhưng thực tế nó đang chứa slug theo BE)
    const { id: slug } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [thumbsSwiper, setThumbsSwiper] = useState(null);

    const addToCart = useCartStore((state) => state.addToCart);

    useEffect(() => {
        setLoading(true);
        fetch(`/api/v1/products/${slug}`)
            .then((res) => res.json())
            .then((response) => {
                if (response && response.success && response.data) {
                    setProduct(response.data);
                } else {
                    setProduct(null);
                }
                setLoading(false);
            })
            .catch((error) => {
                console.error("Lỗi khi tải chi tiết sản phẩm:", error);
                setLoading(false);
            });
    }, [slug]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    if (loading) {
        return (
            <div className="product-detail-loading">
                <h2>Đang tải thông tin sản phẩm...</h2>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="product-detail-error">
                <h2>Không tìm thấy sản phẩm này!</h2>
                <Link to="/">Quay lại trang chủ</Link>
            </div>
        );
    }

    // Xử lý hình ảnh: Nếu API không có mảng images, lấy thumbnail. Không có cả 2 thì lấy ảnh mặc định.
    const productImages = product.images && product.images.length > 0 
        ? product.images 
        : (product.thumbnail ? [product.thumbnail] : ['/no-image.jpg']);

    return (
        <main className="product-detail-wrapper">
            <div className="product-detail-content">

                {/* Slide Swiper */}
                <div className="detail-left-col">
                    <Swiper
                        spaceBetween={10}
                        navigation={true}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        modules={[FreeMode, Navigation, Thumbs]}
                        className="detail-main-slider"
                    >
                        {productImages.map((img, index) => (
                            <SwiperSlide key={index} className="detail-main-slide">
                                <img src={img} alt={`${product.name} - ${index}`} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {productImages.length > 1 && (
                        <Swiper
                            onSwiper={setThumbsSwiper}
                            spaceBetween={10}
                            slidesPerView={4}
                            freeMode={true}
                            watchSlidesProgress={true}
                            modules={[FreeMode, Navigation, Thumbs]}
                            className="detail-thumb-slider"
                        >
                            {productImages.map((img, index) => (
                                <SwiperSlide key={index} className="detail-thumb-slide">
                                    <img src={img} alt={`Thumbnail ${index}`} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    )}
                </div>

                <div className="detail-right-col">
                    <p className="detail-category-brand">
                        {product.category?.name || 'Chưa cập nhật'} 
                    </p>

                    <h1 className="detail-title">{product.name}</h1>

                    <div className="detail-price-box">
                        <span className="detail-price">{formatPrice(product.effectivePrice || product.basePrice)}</span>
                        
                        {/* Hiển thị giá gốc gạch ngang nếu có giảm giá */}
                        {product.basePrice !== product.effectivePrice && (
                            <span className="detail-original-price">
                                {formatPrice(product.basePrice)}
                            </span>
                        )}

                        {product.discountPercent > 0 && (
                            <span className="detail-discount-badge">
                                Giảm {product.discountPercent}%
                            </span>
                        )}
                    </div>

                    <p className="detail-description">{product.shortDesc || 'Đang cập nhật mô tả...'}</p>

                    <div className="detail-policies">
                        <p>🔹 <strong>Chính sách bảo hành:</strong> {product.warrantyMonths ? `${product.warrantyMonths} tháng` : 'Theo tiêu chuẩn nhà sản xuất'}</p>
                        <p>🔹 <strong>Tình trạng:</strong> {product.stockQty > 0 ? `Còn hàng (${product.stockQty} sản phẩm)` : 'Hết hàng'}</p>
                    </div>

                    <button
                        className="detail-add-btn"
                        disabled={product.stockQty <= 0}
                        style={{ 
                            opacity: product.stockQty <= 0 ? 0.6 : 1, 
                            cursor: product.stockQty <= 0 ? 'not-allowed' : 'pointer'
                        }}
                        onClick={() => {
                            addToCart(product);            
                        }}
                    >
                        {product.stockQty > 0 ? 'THÊM VÀO GIỎ HÀNG' : 'TẠM HẾT HÀNG'}
                    </button>
                </div>
            </div>
        </main>
    );
}