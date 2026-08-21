import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';

export default function CustomerOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = useAuthStore((state) => state.token);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // Lấy dữ liệu order của tài khoản customer
    useEffect(() => {
        if (!token) {
            setLoading(false);
            return;
        }

        const fetchMyOrders = async (page = 1) => {
            try {
                setLoading(true);
                const response = await api.get('/orders', { params: { page, limit: 5 } });
                // Dùng ?. để bóc tách dữ liệu an toàn, tránh bị crash web nếu Backend trả về null/undefined
                const data = response.data?.data || [];
                const meta = response.data?.meta || {};

                setOrders(data); 

                if (meta.totalPages) setTotalPages(meta.totalPages); // Cập nhật tổng số trang từ BE
                if (meta.page) setCurrentPage(meta.page);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders(currentPage);
    }, [token, currentPage]);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    // Badge Trạng Thái Đơn Hàng
    const renderStatusBadge = (status) => {
        const statusConfig = {
            pending: { className: 'badge-pending', label: 'Chờ xử lý' },
            confirmed: { className: 'badge-confirmed', label: 'Đã xác nhận' },
            packing: { className: 'badge-packing', label: 'Đang đóng gói' },
            shipping: { className: 'badge-shipping', label: 'Đang giao' },
            completed: { className: 'badge-completed', label: 'Hoàn thành' },
            cancelled: { className: 'badge-cancelled', label: 'Đã hủy' },
        };

        const config = statusConfig[status?.toLowerCase()] || { className: 'badge-default', label: status };

        return (
            <span className={`badge ${config.className}`}>
                {config.label}
            </span>
        );
    };

    // Badge Trạng Thái Thanh Toán
    const renderPaymentStatusBadge = (paymentStatus) => {
        const paymentConfig = {
            unpaid: { className: 'badge-unpaid', label: 'Chưa thanh toán' },
            paid: { className: 'badge-paid', label: 'Đã thanh toán' },
            refunded: { className: 'badge-refunded', label: 'Đã hoàn tiền' },
        };

        const config = paymentConfig[paymentStatus?.toLowerCase()] || { className: 'badge-default', label: paymentStatus };

        return (
            <span className={`badge ${config.className}`}>
                {config.label}
            </span>
        );
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (!token) return <div className="orders-center-message">Vui lòng đăng nhập để xem đơn hàng.</div>;
    if (loading && orders.length === 0) return <div className="orders-center-message">Đang tải lịch sử mua hàng...</div>;

    return (
        <div className="orders-container">
            <h2>🛒 Lịch Sử Mua Hàng Của Tôi</h2>

            {orders.length === 0 ? (
                <p>Bạn chưa có đơn hàng nào.</p>
            ) : (
                <div className="orders-list">
                    {orders.map(order => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div>
                                    <strong>Mã đơn: {order.code}</strong>
                                    <span className="payment-method"> 
                                        {renderPaymentStatusBadge(order.paymentStatus)}
                                        ({order.paymentMethod?.toUpperCase()})
                                    </span>
                                </div>
    
                                <div className="badge-group">
                                    {renderStatusBadge(order.status)}
                                </div>
                            </div>

                            <ul className="order-items-list">
                                {order.items?.map((item, index) => (
                                    <li key={index} className="order-item">
                                        <strong>{item.quantity}x</strong> {item.productName}
                                    </li>
                                ))}
                            </ul>

                            <div className="order-total">
                                Tổng tiền: {formatPrice(order.totalAmount)}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PHÂN TRANG */}
            {totalPages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="pagination-btn"
                    >
                        Trước
                    </button>

                    {pageNumbers.map(number => (
                        <button
                            key={number}
                            onClick={() => setCurrentPage(number)}
                            className={`pagination-btn pagination-btn-number ${currentPage === number ? 'active' : ''}`}
                        >
                            {number}
                        </button>
                    ))}

                    <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="pagination-btn"
                    >
                        Sau
                    </button>
                </div>
            )}
        </div>
    );
}