import React, { useState, useEffect, useMemo } from 'react';
import api from '../../services/api';
import { useAdminAuthStore } from '../../store/useAdminAuthStore';
import { useCategoryStore } from '../../store/useCategoryStore';

export default function AdminCategories() {
    const { token } = useAdminAuthStore();

    const categories = useCategoryStore(state => state.categories);
    const fetchAdminCategories = useCategoryStore(state => state.fetchAdminCategories);

    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sử dụng state này để quản lý thêm mới/ sửa danh mục, không nhảy link mới
    const [editingId, setEditingId] = useState(null);

    const initialFormState = {
        name: '',
        slug: '',
        parentId: '',
        type: 'category',
        buildSlotCode: '',
        imageUrl: '',
        icon: '',
        sortOrder: 0,
        isActive: true,
        seoTitle: '',
        seoDescription: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    const generateSlug = (text) => {
        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[đĐ]/g, "d")
            .replace(/([^0-9a-z-\s])/g, '')
            .replace(/(\s+)/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const fetchCategories = async () => {
        setIsLoading(true);
        await fetchAdminCategories();
        setIsLoading(false);
    };

    useEffect(() => {
        if (token) fetchCategories();
    }, [token]);


    // Hàm xử lý các ô dữ liệu nhập tự động lưu vào form, 
    // gồm: name của ô input, value là chữ vừa gõ, type là loại input, checked nếu là checkbox
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const val = type === 'checkbox' ? checked : value;

        setFormData(prev => {
            const updated = { ...prev, [name]: val };
            if (name === 'name') {
                updated.slug = generateSlug(value);
            }
            return updated;
        });
    };

    // Hàm chỉnh sửa khi click sửa danh mục
    const handleEdit = (category) => {
        setEditingId(category.id);
        setFormData({
            name: category.name || '',
            slug: category.slug || '',
            parentId: category.parentId || '', 
            type: category.type || 'category',
            buildSlotCode: category.buildSlotCode || '',
            imageUrl: category.imageUrl || '',
            icon: category.icon || '',
            sortOrder: category.sortOrder || 0,
            isActive: category.isActive !== undefined ? category.isActive : true,
            seoTitle: category.seoTitle || '',
            seoDescription: category.seoDescription || ''
        });
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setFormData(initialFormState);
    };

    // Hàm gửi form lên BE
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name.trim()) {
            alert("Vui lòng nhập tên danh mục!");
            return;
        }

        setIsSubmitting(true);

        const payload = {
            ...formData,
            parentId: formData.parentId ? Number(formData.parentId) : null,
        };

        // Điều hướng 2 chế độ add thêm mới / edit sửa danh mục
        if (editingId) {
            api.patch(`/admin/categories/${editingId}`, payload)
                .then(() => {
                    alert("Cập nhật danh mục thành công!");
                    handleCancelEdit();
                    fetchCategories();
                })
                .catch(err => {
                    console.error("Lỗi cập nhật danh mục:", err);
                    alert("Cập nhật thất bại, vui lòng thử lại!");
                })
                .finally(() => setIsSubmitting(false));
        } else {
            api.post('/admin/categories', payload)
                .then(() => {
                    alert("Thêm danh mục thành công!");
                    setFormData(initialFormState);
                    fetchCategories();
                })
                .catch(err => {
                    console.error("Lỗi thêm danh mục:", err);
                    alert("Thêm danh mục thất bại, vui lòng thử lại!");
                })
                .finally(() => setIsSubmitting(false));
        }
    };

    const handleDelete = (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xóa danh mục này không?")) {
            api.delete(`/admin/categories/${id}`)
                .then(() => {
                    alert("Xóa danh mục thành công!");
                    if (editingId === id) handleCancelEdit();
                    fetchCategories();
                })
                .catch(err => {
                    console.error("Lỗi xóa danh mục:", err);
                    alert("Không thể xóa danh mục này!");
                });
        }
    };

    // Lấy danh mục cha để render
    const parentCategories = categories.filter(c => !c.parentId);

    // Hàm sắp lấy dữ liệu, xếp lại các danh mục cha con theo thứ tự trong BE (mặc định sortOder = 0) để render
    const orderedCategories = useMemo(() => {
        // Lấy danh mục cha
        const parents = categories
            .filter(c => !c.parentId)
            .sort((a, b) => a.sortOrder - b.sortOrder);

        const result = [];

        parents.forEach(parent => {
            // Lưu danh mục cha, đánh level 0
            result.push({ ...parent, level: 0 });
            // Lấy danh mục con
            const children = categories
                .filter(c => c.parentId === parent.id)
                .sort((a, b) => a.sortOrder - b.sortOrder)
                .map(child => ({ ...child, level: 1 }));
            result.push(...children); // Lưu danh mục con, đánh level 1
        });
        return result;
    }, [categories]);

    return (
        <div className="admin-categories-container">
            {/* === CỘT TRÁI: FORM === */}
            <div className="admin-panel">
                <h3 className={`panel-title ${editingId ? 'editing' : ''}`}>
                    {editingId ? 'Cập Nhật Danh Mục' : '+ Thêm Danh Mục Mới'}
                </h3>

                <form onSubmit={handleSubmit} className="category-form">
                    <div className="form-group">
                        <label>Tên danh mục (*)</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="VD: CPU - Bộ vi xử lý"
                            required
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <label>Slug (URL)</label>
                        <input
                            type="text"
                            name="slug"
                            value={formData.slug}
                            onChange={handleChange}
                            placeholder="cpu-bo-vi-xu-ly"
                            className="form-input slug"
                        />
                    </div>

                    <div className="form-group">
                        <label>Danh mục cha</label>
                        <select
                            name="parentId"
                            value={formData.parentId}
                            onChange={handleChange}
                            className="form-input"
                        >
                            <option value="">-- Là Danh mục gốc (Gốc) --</option>
                            {parentCategories.map(parent => (
                                parent.id !== editingId && (
                                    <option key={parent.id} value={parent.id}>{parent.name}</option>
                                )
                            ))}
                        </select>
                    </div>

                    <div className="form-checkbox-group">
                        <input
                            type="checkbox"
                            id="isActive"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                        />
                        <label htmlFor="isActive" className="form-checkbox-label">
                            Kích hoạt danh mục
                        </label>
                    </div>

                    <div className="form-actions">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className={`btn-submit ${editingId ? 'edit' : 'add'}`}
                        >
                            {isSubmitting ? 'Đang lưu...' : (editingId ? 'Cập Nhật' : 'Thêm Danh Mục')}
                        </button>

                        {editingId && (
                            <button
                                type="button"
                                onClick={handleCancelEdit}
                                className="btn-cancel"
                            >
                                Hủy
                            </button>
                        )}
                    </div>
                </form>
            </div>

            {/* === CỘT PHẢI: BẢNG === */}
            <div className="admin-panel">
                <h3 className="panel-title">Danh sách Danh mục hiện có</h3>

                {isLoading ? (
                    <div className="loading-state">Đang tải danh mục...</div>
                ) : (
                    <table className="categories-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên danh mục</th>
                                <th>Trạng thái</th>
                                <th>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderedCategories.map(cat => (
                                <tr 
                                    key={cat.id} 
                                    className={editingId === cat.id ? 'editing-row' : ''}
                                >
                                    <td>{cat.id}</td>
                                    <td className={`category-name ${cat.level === 0 ? 'parent' : ''}`}>
                                        {cat.level > 0 && <span className="tree-line">└──</span>}
                                        {cat.name}
                                    </td>
                                    <td>
                                        <span className={`badge-status ${cat.isActive ? 'active' : 'inactive'}`}>
                                            {cat.isActive ? 'Hoạt động' : 'Ngưng'}
                                        </span>
                                    </td>
                                    <td>
                                        <div className="action-buttons">
                                            <button
                                                onClick={() => handleEdit(cat)}
                                                className="btn-edit-sm"
                                            >
                                                Sửa
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cat.id)}
                                                className="btn-delete-sm"
                                            >
                                                Xóa
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}