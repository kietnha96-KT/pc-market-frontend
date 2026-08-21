import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function RegisterPage() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [showPassword, setShowPassword] = useState(false);
    
    const [formData, setFormData] = useState({
        fullName: '', 
        email: '',
        password: '',
        phone: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        try {
            setLoading(true);
            
            await api.post('/auth/register', formData);
            
            alert("🎉 Đăng ký thành công! Vui lòng đăng nhập.");
            navigate('/login'); 
            
        } catch (error) {
            console.error("Lỗi đăng ký:", error);
            const errorMsg = error.response?.data?.message || "Đăng ký thất bại, email hoặc số điện thoại có thể đã tồn tại!";
            alert(`Lỗi: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-container">
            <h2 className="register-title">Đăng Ký Tài Khoản</h2>
            
            <form onSubmit={handleRegister} className="register-form">
                <input 
                    type="text" 
                    name="fullName" 
                    placeholder="Họ và tên" 
                    required
                    value={formData.fullName} 
                    onChange={handleChange}
                    className="register-input"
                />
                
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    required
                    value={formData.email} 
                    onChange={handleChange}
                    className="register-input"
                />

                <input 
                    type="text" 
                    name="phone" 
                    placeholder="Số điện thoại" 
                    required
                    value={formData.phone} 
                    onChange={handleChange}
                    className="register-input"
                />
                
                <div className="register-password-wrapper">
                    <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        placeholder="Mật khẩu" 
                        required
                        value={formData.password} 
                        onChange={handleChange}
                        className="register-input"
                    />
                    <button 
                        type="button" 
                        className="register-password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? "Ẩn" : "Hiện"}
                    </button>
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    className="register-button"
                >
                    {loading ? "Đang xử lý..." : "Đăng Ký"}
                </button>
            </form>

            <div className="register-footer">
                Đã có tài khoản? <Link to="/login" className="register-link">Đăng nhập ngay</Link>
            </div>
        </div>
    );
}