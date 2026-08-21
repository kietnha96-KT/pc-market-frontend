import React, { useState } from 'react';

export default function FixedButton() {

    const handleScrollTop = () => {
            window.scrollTo({
                top: 0,
                behavior: "smooth"
            });
    };

    return (
        <div className="fixed-button">
            <div><img src="hinhanh/facebook-svgrepo-com.svg" alt="" /></div>
            <div><img src="hinhanh/messenger.png" alt="" /></div>
            <div><img src="hinhanh/instagram-1-svgrepo-com.svg" alt="" /></div>
            <div><img src="hinhanh/youtube-svgrepo-com.svg" alt="" /></div>
            <div><img src="hinhanh/phone.png" alt="" /></div>
            <button className="scroll-top" onClick={handleScrollTop}>
                <i className="fa-solid fa-arrow-up"></i>
            </button>
        </div>
    );
}



















