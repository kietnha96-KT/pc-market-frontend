import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';

export default function AdminProducts() {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // State quản lý phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const token = useAdminAuthStore((state) => state.token);

    // Hàm lấy danh sách sản phẩm
    const fetchProducts = () => {
        setIsLoading(true);
        api.get(`/admin/products?page=${currentPage}&limit=12`)
            .then(response => {
                setProducts(response.data?.data || []);
                if (response.data?.meta?.totalPages) {
                    setTotalPages(response.data.meta.totalPages);
                }
            })
            .catch(error => {
                console.error("Lỗi khi tải sản phẩm:", error);
            })
            .finally(() => {
                setIsLoading(false);
            });
    };

    useEffect(() => {
        if (token) fetchProducts();
    }, [currentPage, token]);

    // Hàm xóa sản phẩm
    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa sản phẩm này không?")) {
            api.delete(`/admin/products/${id}`)
                .then(() => {
                    alert("Xóa thành công!");
                    fetchProducts();
                })
                .catch(error => console.error("Lỗi xóa sản phẩm:", error));
        }
    };

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <div className="admin-products-container">

            {/* Thanh tiêu đề & Nút Thêm */}
            <div className="admin-products-header">
                <h2>Danh sách sản phẩm</h2>
                <Link to="/admin/products/add">
                    <button className="btn-add-product">
                        + Thêm Sản Phẩm Mới
                    </button>
                </Link>
            </div>

            {/* Bảng dữ liệu */}
            {isLoading ? (
                <div className="loading-state">Đang tải dữ liệu...</div>
            ) : (
                <>
                    <table className="products-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên sản phẩm</th>
                                <th>Giá bán</th>
                                <th>Tồn kho</th>
                                <th>Trạng thái</th>
                                <th>Quảng cáo</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map(item => (
                                <tr key={item.id}>
                                    <td>{item.id}</td>
                                    <td className="product-name">{item.name}</td>
                                    <td className="product-price">
                                        {item.effectivePrice?.toLocaleString('vi-VN')} ₫
                                    </td>
                                    <td>{item.stockQty}</td>

                                    <td>
                                        <button className={`badge-status ${item.isActive ? 'active' : 'inactive'}`}>
                                            {item.isActive ? 'Đang bán' : 'Ngưng bán'}
                                        </button>
                                    </td>

                                    <td>
                                        <button className={`badge-status badge-featured ${item.isFeatured ? 'active' : 'inactive'}`}>
                                            {item.isFeatured ? 'Hoạt động' : 'Không'}
                                        </button>
                                    </td>

                                    <td>
                                        <div className="action-buttons">
                                            <Link to={`/admin/products/edit/${item.id}`}>
                                                <button className="btn-edit">Sửa</button>
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(item.id)}
                                                className="btn-delete"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Thanh chuyển trang */}
                    {totalPages > 1 && (
                        <div className="pagination-container">
                            <button
                                onClick={() => setCurrentPage(prev => prev - 1)}
                                disabled={currentPage === 1}
                                className="btn-pagination"
                            >
                                Trước
                            </button>

                            {pageNumbers.map(number => (
                                <button
                                    key={number}
                                    onClick={() => setCurrentPage(number)}
                                    className={`btn-page-number ${currentPage === number ? 'active' : ''}`}
                                >
                                    {number}
                                </button>
                            ))}

                            <button
                                onClick={() => setCurrentPage(prev => prev + 1)}
                                disabled={currentPage === totalPages}
                                className="btn-pagination"
                            >
                                Sau
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}