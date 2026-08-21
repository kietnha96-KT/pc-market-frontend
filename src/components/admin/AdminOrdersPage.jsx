import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const token = useAdminAuthStore((state) => state.token);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // lấy danh sách đơn hàng
    const fetchOrders = async (page = 1) => {
        try {
            setLoading(true);
            const response = await api.get('/orders', {
                params: { page: page, limit: 5 }
            });
            
            const data = response.data?.data || [];
            const meta = response.data?.meta || {};

            setOrders(data);
            
            if (meta.totalPages) setTotalPages(meta.totalPages);
            if (meta.page) setCurrentPage(meta.page);

        } catch (error) {
            console.error("Lỗi lấy danh sách đơn hàng:", error);
            alert("Không thể tải danh sách đơn hàng! Hãy chắc chắn bạn đang dùng Token của Admin.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchOrders(currentPage);
        }
    }, [token, currentPage]);

    // Hàm cập nhật trạng thái thanh toán
    const handleUpdateOrder = async (orderCode, currentOrder, newValues) => {
        try {
            const payload = {
                status: currentOrder.status,
                paymentStatus: currentOrder.paymentStatus,
                transferRef: currentOrder.transferRef || "",
                cancelReason: currentOrder.cancelReason || "",
                note: currentOrder.note || "",
                ...newValues
            };

            await api.patch(`/orders/${orderCode}`, payload);
            
            alert("Cập nhật thành công!");
            fetchOrders(currentPage); 
        } catch (error) {
            console.error("Lỗi cập nhật:", error);
            const errorMsg = error.response?.data?.message || "Cập nhật thất bại!";
            alert(`Lỗi: ${errorMsg}`);
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price || 0);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN'); 
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
            <span className={`status-badge ${config.className}`}>
                {config.label}
            </span>
        );
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    if (loading && orders.length === 0) return <div className="admin-loading-msg">Đang tải danh sách đơn hàng...</div>;

    return (
        <div className="admin-orders-container">
            <div className="admin-orders-header">
                <h2 className="admin-orders-title">📦 Quản Lý Đơn Hàng (Admin)</h2>
                <button onClick={() => fetchOrders(currentPage)} className="admin-btn-reload">
                    🔄 Tải lại dữ liệu
                </button>
            </div>

            {orders.length === 0 ? (
                <p className="admin-empty-msg">Chưa có đơn hàng nào trong hệ thống.</p>
            ) : (
                <div className="admin-table-wrapper">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Mã Đơn / Ngày Đặt</th>
                                <th>Khách Hàng</th>
                                <th style={{ width: '25%' }}>Sản Phẩm</th>
                                <th>Tổng Tiền</th>
                                <th>Thanh Toán</th>
                                <th>Trạng Thái</th>
                                <th>Thao Tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id}>
                                    <td>
                                        <div className="order-code">{order.code}</div>
                                        <div className="order-date">
                                            {formatDate(order.placedAt)}
                                        </div>
                                    </td>

                                    <td>
                                        <div className="customer-name">{order.receiverName}</div>
                                        <div className="customer-phone">📞 {order.receiverPhone}</div>
                                        <div className="customer-address">
                                            📍 {order.addressLine}, {order.ward}, {order.district}, {order.province}
                                        </div>
                                    </td>

                                    <td>
                                        <ul className="product-list1">
                                            {order.items.map((item, index) => (
                                                <li key={index} className="product-item">
                                                    - <strong>{item.quantity}x</strong> {item.productName}
                                                </li>
                                            ))}
                                        </ul>
                                        {order.note && (
                                            <div className="order-note">
                                                📝 Ghi chú: {order.note}
                                            </div>
                                        )}
                                    </td>

                                    <td className="order-total">
                                        {formatPrice(order.totalAmount)}
                                    </td>

                                    <td>
                                        <div className="payment-method-text">
                                            {order.paymentMethod}
                                        </div>
                                        <select
                                            value={order.paymentStatus}
                                            onChange={(e) => handleUpdateOrder(order.code, order, { paymentStatus: e.target.value })}
                                            className="admin-select admin-select-sm"
                                            disabled={loading}
                                        >
                                            <option value="unpaid">Chưa thanh toán</option>
                                            <option value="paid">Đã thanh toán</option>
                                            <option value="refunded">Đã hoàn tiền</option>
                                        </select>
                                    </td>

                                    <td>
                                        {renderStatusBadge(order.status)}
                                    </td>

                                    <td>
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleUpdateOrder(order.code, order, { status: e.target.value })}
                                            className="admin-select"
                                            disabled={loading}
                                        >
                                            <option value="pending">Chờ xử lý</option>
                                            <option value="confirmed">Đã xác nhận</option>
                                            <option value="packing">Đang đóng gói</option>
                                            <option value="shipping">Đang giao</option>
                                            <option value="completed">Hoàn thành</option>
                                            <option value="cancelled">Hủy đơn</option>
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    
                    {totalPages > 1 && (
                        <div className="pagination-wrapper">
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
                                    className={`pagination-btn ${currentPage === number ? 'active' : ''}`}
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
            )}
        </div>
    );
}