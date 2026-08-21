import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCartStore } from '../store/useCartStore';
import { useAuthStore } from '../store/useAuthStore';
import { useCategoryStore } from '../store/useCategoryStore';
import MegaMenu from './MegaMenu';

// Dữ liệu cho Top Nav
const TOP_NAV_ITEMS = [
  {
    title: 'Hệ thống showroom',
    items: ['Showroom Thủ Đức', 'Showroom Quận 2', 'Bản đồ hệ thống', 'Lịch hoạt động'],
  },
  {
    title: 'Bán hàng trực tuyến',
    items: ['Mua hàng online', 'Hướng dẫn đặt hàng', 'Phương thức thanh toán', 'Giao hàng toàn quốc', 'Theo dõi đơn hàng', 'Khuyến mãi hôm nay'],
  },
  {
    title: 'Trang tin công nghệ',
    items: ['Bí quyết Build PC', 'Review sản phẩm', 'Góc Setup', 'Xu hướng công nghệ', 'Mẹo phần mềm', 'Tin tức khuyến mãi'],
  },
  {
    title: 'Tư vấn kỹ thuật',
    items: ['Tư vấn PC Gaming', 'Tư vấn Laptop', 'Tư vấn tản nhiệt', 'Nâng cấp máy', 'Liên hệ chuyên gia', 'Hỗ trợ khách hàng'],
  },
];

export default function Header() {

  // Quản lý danh mục cha cho ô search
    const categories = useCategoryStore(state => state.categories);
    const fetchCategories = useCategoryStore(state => state.fetchCategories);

  // Quản lý danh mục input khi chọn danh sách và phần input khi nhập vào ô search
  const [category, setCategory] = useState(''); // danh sách
  const [searchQuery, setSearchQuery] = useState(''); // input

  // Lấy thông tin từ store đăng nhập customer
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  // Sử dụng cart từ store
  const cart = useCartStore((state) => state.cart);
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  
  // Điều hướng trang
  const navigate = useNavigate();

  // Render danh sách danh mục
  useEffect(() => {
        fetchCategories();
    }, []);


  // Hàm để lắp danh mục input chọn từ từ danh sách và input nhập vào từ ô search, để tạo URL khớp với API
  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();

    if (category && category !== 'All') params.append('category', category);
    if (searchQuery.trim()) params.append('search', searchQuery.trim());

    navigate(`/products?${params.toString()}`);
  };

  const handleLogout = () => {
    logout();
    alert("👋 Bạn đã đăng xuất thành công!");
    navigate('/login');
  };

  return (
    <header>
      <div className="header-top">
        <div className="header-topcontainer">
          <ul className="header-nav1">
            {TOP_NAV_ITEMS.map((nav, index) => (
              <li className="menu-nav1" key={index}>
                {nav.title}
                <ul className="menu-doc-nav1">
                  {nav.items.map((item, subIndex) => (
                    <li key={subIndex}>{item}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>

          {/* Chuyển giao diện khi đăng nhập, đăng xuất */}
          <ul className="header-nav1">
            {token ? (
              <>
                <li>
                  <Link to="/orders">
                    <span style={{ cursor: 'default', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <i className="fa-solid fa-circle-user"></i>
                      {user?.name || user?.email || 'Tài khoản'}
                    </span>
                  </Link>
                </li>
                <li>
                  <button onClick={handleLogout}>
                    <i className="fa-solid fa-right-from-bracket"></i> Đăng xuất
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/register">Đăng ký</Link>
                </li>
                <li>
                  <Link to="/login">Đăng nhập</Link>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>

      <div className="header-bottom">
        <div className="header-bottomcontainer">
          <div className="header-nav2">
            <Link to="/" className="logo">
              PCM
            </Link>

            <form className="search" onSubmit={handleSearch}>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">Tất cả danh mục</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.slug}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm kiếm sản phẩm"
              />

              <button type="submit">
                <i className="fa-solid fa-magnifying-glass" style={{ color: 'white' }}></i>
              </button>
            </form>

            <div className="right-box">
              <div className="right-boxdetail">
                <i className="fa-solid fa-phone"></i>
                <div>
                  <div>Hotline</div>
                  <div>079.797.7979</div>
                </div>
              </div>

              <div className="right-boxdetail">
                <i className="fa-solid fa-display"></i>
                <div>
                  <div>Xây dựng cấu hình</div>
                </div>
              </div>

              <div className="right-boxdetail">
                <Link to="/cart" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ position: 'relative' }}>
                    <i className="fa-solid fa-cart-shopping"></i>
                    {cartCount > 0 && <span className="tick-cart">{cartCount}</span>}
                  </div>
                  <span>Giỏ hàng</span>
                </Link>
              </div>

             
            </div>
          </div>

          <div className="header-nav3">
            <ul className="menu" id="menu">
              <li>
                <Link to="/products" className="menu-link">
                  DANH MỤC SẢN PHẨM <i className="fa-solid fa-caret-down"></i>
                </Link>
                <div style={{ backgroundColor: 'rgb(97, 97, 226)', height: '5px' }}></div>
                <MegaMenu />
              </li>
            </ul>

            {categories.slice(0, 5).map((cat) => (
              <div className="box" key={cat.id}>
                <i className={`fa-solid fa-${cat.icon || 'laptop'}`}></i>
                <Link to={`/products?category=${cat.slug}`}>{cat.name}</Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}