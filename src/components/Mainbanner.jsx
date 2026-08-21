import React, { useState } from 'react';

export default function MainBanner() {
    // Quản lý xem đang ở slide số mấy 
    const [index, setIndex] = useState(0);

    const banners = [
        "hinhanh/slide1.jpg",
        "hinhanh/slide2.jpg",
        "hinhanh/slide3.jpg",
        "hinhanh/slide4.jpg",
        "hinhanh/slide5.jpg",
        "hinhanh/slide6.jpg"
    ];

    const handlePrev = () => {
        setIndex(prev => (prev > 0 ? prev - 1 : banners.length - 1));
    };

    const handleNext = () => {
        setIndex(prev => (prev < banners.length - 1 ? prev + 1 : 0));
    };

    return (
        <div className="slide">
            <div className="screen">
                <div className="track" style={{ transform: `translateX(-${index * 100}%)` }}>
                    {banners.map((img, i) => (
                        <div className="box1" key={i}>
                            <img src={img} alt="" />
                        </div>
                    ))}
                </div>
            </div>

            <button className="btn-pre" onClick={handlePrev}>
                <i className="fa-solid fa-chevron-left"></i>
            </button>

            <button className="btn-next" onClick={handleNext}>
                <i className="fa-solid fa-chevron-right"></i>
            </button>
        </div>
    );
}