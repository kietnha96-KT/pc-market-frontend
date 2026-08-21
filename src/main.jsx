import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

import './styles/Base.css';
import './styles/Fixed-button.css';
import './styles/Fixed-nav.css';
import './styles/Footer-info.css';
import './styles/Footer-logo.css';
import './styles/Footer-media.css';
import './styles/Footer-policy.css';
import './styles/Footer-showroom.css';
import './styles/Footer-social.css';
import './styles/Footer-support.css';
import './styles/Footer.css';
import './styles/Header-menu.css';
import './styles/Header.css';
import './styles/Mainpage-banner.css';
import './styles/Mainpage-info.css';
import './styles/Mainpage-product-slide.css';
import './styles/Mainpage-product.css';
import './styles/Mainpage-slide.css';
import './styles/Mainpage.css';
import './styles/Responsive.css';
import './styles/ProductDetailPage.css';
import './styles/CartPage.css';
import './styles/ProductsPage.css';
import './styles/CustomerOrdersPage.css';
import './styles/LoginPage.css';
import './styles/AdminLogin.css';
import './styles/RegisterPage.css';
import './styles/AdminLayout.css';
import './styles/AdminOrdersPage.css';
import './styles/AdminProductForm.css';
import './styles/AdminProducts.css';
import './styles/AdminCategories.css';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
