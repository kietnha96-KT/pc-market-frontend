import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import api from '../services/api';

export default function CartPage() {
    // Lấy cart từ store
    const cart = useCartStore((state) => state.cart);
    const removeFromCart = useCartStore((state) => state.removeFromCart);
    const increaseQuantity = useCartStore((state) => state.increaseQuantity);
    const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
    const clearCart = useCartStore((state) => state.clearCart);

    const token = useAuthStore((state) => state.token);

    const navigate = useNavigate();

    // State cho Form điền thông tin
    const [isSubmitting, setIsSubmitting] = useState(false); // Kiểm soát spam
    const [formData, setFormData] = useState({
        receiverName: '',
        receiverPhone: '',
        receiverEmail: '',
        province: '',
        district: '',
        ward: '',
        addressLine: '',
        note: '',
    });

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price || 0);
    };

    const cartTotalPrice = cart.reduce((total, item) => {
        const productInfo = item.product || item; 
        const itemPrice = productInfo.effectivePrice || productInfo.basePrice || 0;
        return total + (itemPrice * item.quantity);
    }, 0);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Hàm xử lý đặt hàng
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        // Kiểm tra đăng nhập
        if (!token) {
            alert("Bạn cần đăng nhập để tiến hành đặt hàng!");
            navigate('/login');
            return;
        }

        setIsSubmitting(true);

        try {
            
            // Lưu vào order trong BE
            const orderPayload = {
                receiverName: formData.receiverName,
                receiverPhone: formData.receiverPhone?.replace(/\s+/g, '') || "0123456789",
                receiverEmail: formData.receiverEmail?.trim() || "customer@example.com",
                province: formData.province,
                district: formData.district,
                ward: formData.ward,
                addressLine: formData.addressLine,
                note: formData.note?.trim() || "Không có ghi chú",
                paymentMethod: "cod",
                couponCode: ""
            };

            await api.post('/orders', orderPayload);

            alert("🎉 Đặt hàng thành công! Đơn hàng của bạn sẽ được thanh toán (COD) khi nhận hàng.");
            await clearCart();
            navigate('/');

        } catch (error) {
            console.error("Lỗi khi đặt hàng:", error);
            console.log("Chi tiết lỗi từ BE:", error.response?.data);
            alert("Có lỗi xảy ra khi tạo đơn hàng. Vui lòng kiểm tra lại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    // Nếu giỏ hàng trống
    if (cart.length === 0) {
        return (
            <div className="cart-empty-page">
                <div className="cart-empty">
                    <h2>Giỏ hàng của bạn đang trống!</h2>
                    <p>Hãy tìm thêm những sản phẩm tuyệt vời nhé.</p>
                    <Link to="/" className="cart-empty-btn">
                        QUAY LẠI MUA SẮM
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <main className="cart-page-wrapper">

            {/* Cột trái danh sách sản phẩm */}
            <div className="cart-products-column">
                <h1 className="cart-title">Giỏ hàng của bạn</h1>

                <div className="cart-list">
                    {cart.map((item) => {
                        // Json BE trả về data sản phẩm, nằm trong product
                        const productInfo = item.product || item;
                        const itemPrice = productInfo.effectivePrice || productInfo.basePrice || 0;
                        
                        const targetId = item.productId || productInfo.id;

                        return (
                            <div key={item.id || targetId} className="cart-item">
                                <div className="cart-item-info">
                                    <Link to={`/product/${productInfo.slug || productInfo.id}`} className="cart-item-link">
                                        <img src={productInfo.thumbnail || '/no-image.jpg'} alt={productInfo.name} className="cart-item-img"/>
                                        <div>
                                            <h3 className="cart-item-name">{productInfo.name}</h3>
                                            <p className="cart-item-sku">{productInfo.sku ? `SKU: ${productInfo.sku}` : 'Chưa cập nhật'}</p>
                                        </div>
                                    </Link>
                                </div>

                                <div className="cart-item-price-qty">
                                    <p className="cart-item-total-price">{formatPrice(itemPrice * item.quantity)}</p>
                                    <div className="cart-qty-controls">
                                        <button onClick={() => decreaseQuantity(targetId)} className="cart-qty-btn">-</button>
                                        <span>{item.quantity}</span>
                                        <button onClick={() => increaseQuantity(targetId)} className="cart-qty-btn">+</button>
                                    </div>
                                </div>

                                <div className="cart-item-total">
                                    <button onClick={() => removeFromCart(targetId)} title="Xóa sản phẩm này" className="cart-remove-btn">
                                        <i className="fa-solid fa-trash"></i> Xóa
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* CỘT PHẢI: FORM THANH TOÁN */}
            <div className="cart-checkout-panel">
                <h2 className="checkout-title">
                    Thông tin giao hàng
                </h2>

                <form
                    onSubmit={handlePlaceOrder}
                    className="checkout-form"
                >
                    <input
                        type="text"
                        name="receiverName"
                        placeholder="Họ và tên người nhận (*)"
                        required
                        onChange={handleChange}
                        className="checkout-input"
                    />

                    <input
                        type="tel"
                        name="receiverPhone"
                        placeholder="Số điện thoại (*)"
                        required
                        onChange={handleChange}
                        className="checkout-input"
                    />

                    <input
                        type="email"
                        name="receiverEmail"
                        placeholder="Email (nếu có)"
                        onChange={handleChange}
                        className="checkout-input"
                    />

                    <div className="address-row">
                        <input
                            type="text"
                            name="province"
                            placeholder="Tỉnh / Thành phố (*)"
                            required
                            onChange={handleChange}
                            className="checkout-input address-input"
                        />

                        <input
                            type="text"
                            name="district"
                            placeholder="Quận / Huyện (*)"
                            required
                            onChange={handleChange}
                            className="checkout-input address-input"
                        />
                    </div>

                    <input
                        type="text"
                        name="ward"
                        placeholder="Phường / Xã (*)"
                        required
                        onChange={handleChange}
                        className="checkout-input"
                    />

                    <input
                        type="text"
                        name="addressLine"
                        placeholder="Số nhà, tên đường (*)"
                        required
                        onChange={handleChange}
                        className="checkout-input"
                    />

                    <textarea
                        name="note"
                        placeholder="Ghi chú đơn hàng..."
                        onChange={handleChange}
                        className="checkout-textarea"
                    />

                    <div className="payment-info">
                        <strong>Thanh toán:</strong> Thu tiền mặt khi giao hàng (COD)
                    </div>

                    <div className="checkout-divider"></div>

                    <div className="checkout-total">
                        <span>Tổng thanh toán:</span>
                        <span className="checkout-total-price">
                            {formatPrice(cartTotalPrice)}
                        </span>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`checkout-submit-btn ${isSubmitting ? 'is-submitting' : ''}`}
                    >
                        {isSubmitting ? 'ĐANG XỬ LÝ...' : 'XÁC NHẬN ĐẶT HÀNG'}
                    </button>
                </form>
            </div>

        </main>
    );
}