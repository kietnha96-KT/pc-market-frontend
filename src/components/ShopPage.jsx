// src/pages/ShopPage.jsx
import React from 'react';


export default function ShopPage() {
  return (
    <div className="mainpage-container" style={{ padding: '20px' }}>
        <h2>Tất cả sản phẩm</h2>
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
            {productsData.map((product) => (
                <div key={product.id} style={{ border: '1px solid #ccc', padding: '15px', width: '200px' }}>
                    <img src={product.image} alt={product.name} style={{ width: '100%' }} />
                    <h3>{product.name}</h3>
                    <p style={{ color: 'red', fontWeight: 'bold' }}>{product.price.toLocaleString()} VNĐ</p>
                    <button>Xem chi tiết</button>
                </div>
            ))}
        </div>
    </div>
  );
}