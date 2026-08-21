import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';


export default function AdminLogin() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const navigate = useNavigate();
    const login = useAdminAuthStore((state) => state.login);

    // Hàm xử lý khi gõ input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrorMsg('');
    };

    // Hàm đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault(); 
        setIsLoading(true);
        setErrorMsg('');

        try {
            const response = await api.post('/auth/login', {
                email: formData.email, 
                password: formData.password
            });

            const token = response.data?.data?.accessToken;
            const refreshToken = response.data?.data?.refreshToken;
            const user = response.data?.data?.user;

            if (token) {
                login(token, user, refreshToken);
                alert("🎉 Đăng nhập thành công!");
                navigate('/admin/orders');
            } else {
                setErrorMsg('Đăng nhập thành công nhưng không tìm thấy Token!');
            }
        } catch (error) {
            console.error("Lỗi đăng nhập:", error);
            const message = error.response?.data?.message || "Sai email hoặc mật khẩu. Vui lòng thử lại!";
            setErrorMsg(message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="admin-login-container">
            <div className="admin-login-box">
                <h2 className="admin-login-title">ĐĂNG NHẬP ADMIN</h2>
                
                {errorMsg && (
                    <div className="admin-login-error">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="admin-login-form">
                    <div>
                        <label className="admin-form-label">Tài khoản (Email):</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="admin-form-input"
                            placeholder="admin@example.com"
                        />
                    </div>
                    
                    <div className="admin-password-wrapper">
                        <label className="admin-form-label">Mật khẩu:</label>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="admin-form-input"
                            placeholder="Nhập mật khẩu..."
                        />
                        <button 
                            type="button" 
                            onClick={() => setShowPassword(!showPassword)}
                            className="admin-password-toggle"
                        >
                            {showPassword ? 'Ẩn' : 'Hiện'}
                        </button>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="admin-submit-btn"
                    >
                        {isLoading ? 'Đang xử lý...' : 'Đăng nhập'}
                    </button>
                </form>
            </div>
        </div>
    );
}