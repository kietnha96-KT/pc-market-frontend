import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../services/api';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';

export default function AdminProductForm() {
    const navigate = useNavigate();
    const { id } = useParams();

    // Biến lấy theo URL để kiểm tra xem đang ở chế độ edit, hay là add thêm mới vì form dùng chung
    const isEditMode = Boolean(id && id !== 'add'); 

    const token = useAdminAuthStore((state) => state.token);

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Quản lý trạng thái khi đang chạy lấy dữ liệu, post dữ liệu
    const [isFetchingData, setIsFetchingData] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isUploadingImages, setIsUploadingImages] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        sku: '',
        slug: '',
        categoryId: '',
        productType: 'component',
        shortDesc: '',
        description: '',
        basePrice: 0,
        salePrice: 0,
        warrantyMonths: 12,
        stockQty: 0,
        thumbnail: '',
        images: [],
        options: [],
        isActive: true,
        isFeatured: false,
    });

    // Lấy danh mục
    useEffect(() => {
        api.get('/categories')
            .then(res => {
                if (res.data && res.data.data) {
                    setCategories(res.data.data);
                }
            })
            .catch(err => console.error("Lỗi lấy danh mục", err));
    }, []);

    // Lấy dữ liệu lên form nếu là chế độ edit
    useEffect(() => {
        if (isEditMode) {
            setIsFetchingData(true);
            api.get(`/admin/products/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            })
                .then(res => {
                    const product = res.data.data || res.data;
                    setFormData({
                        name: product.name || '',
                        sku: product.sku || '',
                        slug: product.slug || '',
                        categoryId: product.category?.id || product.categoryId || '',
                        productType: product.productType || 'component',
                        shortDesc: product.shortDesc || '',
                        description: product.description || '',
                        basePrice: product.basePrice || 0,
                        salePrice: product.salePrice || 0,
                        warrantyMonths: product.warrantyMonths || 12,
                        stockQty: product.stockQty || 0,
                        thumbnail: product.thumbnail || '',
                        images: product.images || [],
                        options: product.options || [],
                        isActive: product.isActive ?? true,
                        isFeatured: product.isFeatured ?? false,
                    });
                })
                .catch(err => {
                    console.error("Lỗi lấy thông tin sản phẩm", err);
                    alert("Không tìm thấy sản phẩm hoặc lỗi mạng!");
                })
                .finally(() => setIsFetchingData(false));
        }
    }, [id, isEditMode, token]);

    const createSlug = (text) => {
        return text.toString().toLowerCase()
            .normalize('NFD').replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-');
    };

    // Hàm xử lý các ô dữ liệu nhập tự động lưu vào form, 
    // gồm: name của ô input, value là chữ vừa gõ, type là loại input, checked nếu là checkbox
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        let finalValue = value;

        // Xử lý ngoại lệ để lưu biến finalValue
        if (type === 'checkbox') finalValue = checked;
        if (type === 'number' || name === 'categoryId') {
            finalValue = value ? Number(value) : '';
        }

        setFormData(prev => {
            const newData = { ...prev, [name]: finalValue }; // Cập nhật đúng ô đang gõ tên là gì, thay đổi ô đó bằng finalValue
            if (name === 'name') {
                newData.slug = createSlug(value); // tạo slug trong BE
            }
            return newData;
        });
    };

    // Hàm tải ảnh lên, gắn file vào theo BE, BE tự trả link và gắn vào lại trên form
    const handleUploadThumbnail = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const uploadData = new FormData();
        uploadData.append('file', file);

        setIsUploading(true); // Kết nối với thuộc tính disable của các thẻ
        try {
            const res = await api.post('/admin/upload', uploadData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${token}`
                }
            });
            const imageUrl = res.data.data.url;
            setFormData(prev => ({ ...prev, thumbnail: imageUrl }));
        } catch (error) {
            console.error("Lỗi up ảnh:", error);
            alert("Up ảnh thất bại!");
        } finally {
            setIsUploading(false);
        }
    };

    // Hàm tải 1 lần nhiều hình, cho phép kéo thả ở bên ngoài
    const handleUploadMultipleImages = async (e) => {
        const files = Array.from(e.target.files);
        if (files.length === 0) return;

        setIsUploadingImages(true);
        const newUrls = [];

        try {
            for (const file of files) {
                const uploadData = new FormData();
                uploadData.append('file', file);
                const res = await api.post('/admin/upload', uploadData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Authorization': `Bearer ${token}`
                    }
                });
                const imageUrl = res.data.data.url;
                newUrls.push(imageUrl);
            }
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, ...newUrls]
            }));
        } catch (error) {
            console.error("Lỗi up mảng ảnh:", error);
            alert("Có lỗi xảy ra khi tải lên một số ảnh phụ!");
        } finally {
            setIsUploadingImages(false);
            e.target.value = null; // Để có thể upload nhiều tấm trùng nhau
        }
    };

    const handleRemoveImage = (indexToRemove) => {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, index) => index !== indexToRemove)
        }));
    };

    // Hàm gửi form lên BE
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.thumbnail) {
            alert("Vui lòng tải lên ảnh đại diện cho sản phẩm!");
            return;
        }

        setLoading(true);

        const base = Number(formData.basePrice) || 0;
        const sale = Number(formData.salePrice) || 0;
        const effective = sale > 0 ? sale : base;

        const submitData = {
            ...formData,
            basePrice: base,
            salePrice: sale > 0 ? sale : null,
            effectivePrice: effective
        };

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${token}` }
            };

            // Điều hướng 2 chế độ add thêm mới / edit sửa sản phẩm
            if (isEditMode) {
                await api.patch(`/admin/products/${id}`, submitData, config);
                alert("Cập nhật sản phẩm thành công!");
            } else {
                await api.post('/admin/products', submitData, config);
                alert("Thêm sản phẩm thành công!");
            }
            navigate('/admin/products');
        } catch (error) {
            console.error("Lỗi khi lưu:", error);
            alert("Có lỗi xảy ra: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    if (isFetchingData) {
        return <div className="loading-container">Đang tải dữ liệu sản phẩm...</div>;
    }

    return (
        <div className="admin-product-container">
            <div className="admin-product-header">
                <h2>{isEditMode ? 'CẬP NHẬT SẢN PHẨM' : 'THÊM MỚI SẢN PHẨM'}</h2>
                <button onClick={() => navigate('/admin/products')} className="btn-back">Quay lại</button>
            </div>

            <form onSubmit={handleSubmit} className="admin-product-form">
                <div className="form-row">
                    <div className="form-group">
                        <label>Tên sản phẩm *</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required className="form-control" />
                    </div>
                    <div className="form-group">
                        <label>Mã (SKU) *</label>
                        <input type="text" name="sku" value={formData.sku} onChange={handleChange} required className="form-control" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Danh mục *</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            required
                            className="form-control"
                        >
                            <option value="" disabled>-- Chọn danh mục --</option>
                            {categories.map(parent => {
                                if (parent.children && parent.children.length > 0) {
                                    return (
                                        <optgroup key={parent.id} label={parent.name}>
                                            {parent.children.map(child => (
                                                <option key={child.id} value={child.id}>
                                                    {child.name}
                                                </option>
                                            ))}
                                        </optgroup>
                                    );
                                }
                                return (
                                    <option key={parent.id} value={parent.id} className="opt-bold">
                                        {parent.name}
                                    </option>
                                );
                            })}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Số lượng tồn (Stock) *</label>
                        <input type="number" name="stockQty" value={formData.stockQty} onChange={handleChange} required className="form-control" />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Giá gốc *</label>
                        <input type="number" name="basePrice" value={formData.basePrice} onChange={handleChange} required className="form-control" />
                    </div>

                    <div className="form-group">
                        <label>Giá khuyến mãi</label>
                        <input type="number" name="salePrice" value={formData.salePrice} onChange={handleChange} className="form-control" placeholder="Để trống nếu không sale" />
                    </div>

                    <div className="form-group">
                        <label>Giá thực tế</label>
                        <input
                            type="number"
                            value={Number(formData.salePrice) > 0 ? formData.salePrice : formData.basePrice}
                            className="form-control readonly"
                            readOnly
                            disabled
                        />
                    </div>
                </div>

                {/* Up ảnh thumbnail */}
                <div className="upload-section">
                    <label className="upload-label">Ảnh đại diện (Thumbnail) *</label>
                    <div className="upload-row">
                        <div style={{ flex: 1 }}>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleUploadThumbnail}
                                disabled={isUploading}
                                className="upload-input"
                            />
                            {isUploading && <span className="uploading-text">Đang tải ảnh lên...</span>}
                        </div>
                        <div className="thumbnail-preview-box">
                            <input
                                type="text"
                                value={formData.thumbnail}
                                readOnly
                                placeholder="Link ảnh sẽ tự động hiện ở đây sau khi tải lên..."
                                className="thumbnail-url-input"
                            />
                            {formData.thumbnail && (
                                <img
                                    src={formData.thumbnail}
                                    alt="Preview"
                                    className="img-preview"
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* up nhiều ảnh */}
                <div className="upload-section">
                    <label className="upload-label">Ảnh phụ / Gallery (Chọn nhiều ảnh)</label>
                    <div className="gallery-upload-box">
                        <div>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleUploadMultipleImages}
                                disabled={isUploadingImages}
                            />
                            {isUploadingImages && <span className="uploading-text-inline">Đang tải lên các ảnh...</span>}
                        </div>

                        {formData.images.length > 0 && (
                            <div className="gallery-preview-container">
                                {formData.images.map((url, index) => (
                                    <div key={index} className="gallery-item">
                                        <img
                                            src={url}
                                            alt={`Phụ ${index + 1}`}
                                            className="gallery-img"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveImage(index)}
                                            className="btn-remove-img"
                                        >
                                            X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="form-group">
                    <label>Mô tả ngắn (Short Description)</label>
                    <textarea name="shortDesc" value={formData.shortDesc} onChange={handleChange} rows="3" className="form-control"></textarea>
                </div>

                <div className="checkbox-row">
                    <label className="checkbox-label">
                        <input type="checkbox" name="isActive" checked={formData.isActive} onChange={handleChange} />
                        Đang bán / Ngưng bán
                    </label>
                    <label className="checkbox-label">
                        <input type="checkbox" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} />
                        Dùng làm quảng cáo
                    </label>
                </div>

                <button type="submit" disabled={loading} className="btn-submit">
                    {loading ? 'ĐANG LƯU...' : (isEditMode ? 'CẬP NHẬT SẢN PHẨM' : 'TẠO SẢN PHẨM')}
                </button>
            </form>
        </div>
    );
}