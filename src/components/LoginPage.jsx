import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore'; 

export default function LoginPage() {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    
    const [showPassword, setShowPassword] = useState(false); 

    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    // Hàm xử lý khi gõ input
    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setErrorMsg('');
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMsg('');

        try {
            const response = await api.post('/auth/login', {
                email: formData.email,
                password: formData.password
            });

            const token = response.data?.data?.accessToken || response.data?.accessToken || response.data?.token;
            const user = response.data?.data?.user || response.data?.user || { email: formData.email };

            if (token) {
                // Lưu token vào auth store
                login(token, user); 

                alert("🎉 Đăng nhập thành công!");
                navigate('/');
            } else {
                setErrorMsg("Không tìm thấy Token trong phản hồi từ Server.");
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
        <div className="login-container">
            <div className="login-box">
                <div className="login-header">
                    <h2 className="login-title">Đăng Nhập</h2>
                    <p className="login-subtitle">Chào mừng bạn quay lại với PCMarket</p>
                </div>

                {errorMsg && (
                    <div className="login-error">
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} className="login-form">
                    <div className="login-form-group">
                        <label>Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="user@example.com"
                            required
                            className="login-input"
                        />
                    </div>

                    <div className="login-form-group">
                        <label>Mật khẩu</label>
                        <div className="password-input-wrapper">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Nhập mật khẩu..."
                                required
                                className="login-input"
                            />
                            <button 
                                type="button" 
                                className="password-toggle-btn"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Ẩn" : "Hiện"}
                            </button>
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={isLoading}
                        className="login-button"
                    >
                        {isLoading ? 'Đang xử lý...' : 'ĐĂNG NHẬP'}
                    </button>
                </form>

                <div className="login-footer">
                    Chưa có tài khoản? <Link to="/register" className="login-link">Đăng ký ngay</Link>
                </div>
            </div>
        </div>
    );
}