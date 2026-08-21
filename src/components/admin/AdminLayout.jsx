import React, { useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';

export default function AdminLayout() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = useAdminAuthStore((state) => state.token);
    const refreshToken = useAdminAuthStore((state) => state.refreshToken);
    const user = useAdminAuthStore((state) => state.user);
    const logout = useAdminAuthStore((state) => state.logout);

    useEffect(() => {
        // Không đăng nhập admin thì không đi đâu được
        if (!token) {
            navigate('/admin/login');
        }
    }, [token, navigate]);

    const handleLogout = async () => {
        if (window.confirm("Bạn có chắc chắn muốn đăng xuất không?")) {
            try {
                if (refreshToken) {
                    await api.post('/auth/logout', { refreshToken });
                }
            } catch (error) {
                console.error("Lỗi khi gọi API đăng xuất:", error);
            } finally {
                logout();
                navigate('/admin/login');
            }
        }
    };

    return (
        <div className="admin-layout-container">
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    ⚡ PC MARKET ADMIN
                </div>

                <div className="admin-profile-section">
                    <div className="admin-profile-info">
                        <div className="admin-avatar">
                            {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'A'}
                        </div>

                        <div className="admin-user-details">
                            <div className="admin-user-name">
                                {user?.fullName || 'Admin Account'}
                            </div>
                            <div className="admin-user-email">
                                {user?.email || 'admin@pcmarket.com'}
                            </div>
                        </div>
                    </div>

                    <button onClick={handleLogout} className="admin-logout-btn">
                        🚪 Đăng xuất
                    </button>
                </div>

                <nav className="admin-nav">
                    <ul className="admin-nav-list">
                        <hr className="admin-nav-divider" />

                        <li className="admin-nav-item">
                            <Link
                                to="/admin/orders"
                                className={`admin-nav-link ${location.pathname.includes('/admin/orders') ? 'active' : ''}`}
                            >
                                📦 Quản lý Đơn hàng
                            </Link>
                        </li>

                        <li className="admin-nav-item">
                            <Link
                                to="/admin/products"
                                className={`admin-nav-link ${location.pathname.includes('/admin/products') ? 'active' : ''}`}
                            >
                                📦 Quản lý Sản phẩm
                            </Link>
                        </li>

                        <li className="admin-nav-item">
                            <Link
                                to="/admin/categories"
                                className={`admin-nav-link ${location.pathname.includes('/admin/categories') ? 'active' : ''}`}
                            >
                                📦 Quản lý Danh mục
                            </Link>
                        </li>
                    </ul>
                </nav>
            </aside>

            <main className="admin-main-content">
                <header className="admin-header">
                    <div className="admin-header-title">
                        Trang quản trị hệ thống
                    </div>

                    <div className="admin-header-actions">
                        <Link to="/" className="admin-back-link">
                            🌐 Về trang khách
                        </Link>
                    </div>
                </header>

                <div className="admin-outlet-container">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}