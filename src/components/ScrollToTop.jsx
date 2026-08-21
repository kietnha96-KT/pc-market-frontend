import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function ScrollToTop() {
    const { pathname } = useLocation(); // Lắng nghe sự thay đổi của đường dẫn URL

    useEffect(() => {
        // Mỗi khi pathname đổi (chuyển trang), cuộn mượt lên tọa độ (0, 0)
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    }, [location.pathname, location.search]);

    return null; // Component này chỉ làm nhiệm vụ logic, không vẽ ra giao diện
}