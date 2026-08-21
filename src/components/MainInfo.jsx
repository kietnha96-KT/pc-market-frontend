import React, { useState } from 'react';

export default function MainInfo() {

    return (
        <div className="mainpage-info">
            <div className="info-box">
                <i className="fa-solid fa-truck-fast"></i>
                <div className="info-right">
                    <h4>GIAO HÀNG TOÀN QUỐC</h4>
                    <div>Giao hàng trước, trả tiền sau COD</div>
                </div>
            </div>
            <div className="info-box">
                <i className="fa-solid fa-rotate-left"></i>
                <div className="info-right">
                    <h4>ĐỔI TRẢ DỄ DÀNG</h4>
                    <div>Đổi mới trong 30 ngày đầu</div>
                </div>
            </div>
            <div className="info-box">
                <i className="fa-solid fa-cart-shopping"></i>
                <div className="info-right">
                    <h4>THANH TOÁN TIỆN LỢI</h4>
                    <div>Hỗ trợ nhiều phương thức</div>
                </div>
            </div>
            <div className="info-box">
                <i className="fa-solid fa-headset"></i>
                <div className="info-right">
                    <h4>HỖ TRỢ NHIỆT TÌNH</h4>
                    <div>Tư vấn tổng đài 24/7</div>
                </div>
            </div>
        </div>
    );
}