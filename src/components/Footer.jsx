import React, { useState, useEffect } from 'react';

// Tạo một component con ngay trong cùng file (bên ngoài hàm Footer)
function SupportItem({ title, children }) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className={`box-wrap ${isOpen ? 'opendetail' : ''}`} onClick={() => setIsOpen(!isOpen)}>
            <div className="box-support">
                <div>{title}</div>
                <i className={`fa-solid ${isOpen ? 'fa-minus' : 'fa-plus'}`}></i>
            </div>
            <div className="box-support-detail">
                {children}
            </div>
        </div>
    );
}

export default function Footer() {

    return (
        <footer>
            <div className="footer-container">
                <div className="footer-logo">
                    <i className="fa-solid fa-medal"></i>
                    <div>Trải nghiệm mua sắm <span>PC Market</span></div>
                    <div>Cam Kết 100% <span>Hài Lòng</span></div>
                </div>
                <div className="footer-support">
                    <SupportItem title="01. Cam kết sản phẩm chính hãng 100%">
                        <div>PCM cam kết tất cả các sản phẩm mỹ phẩm, chăm sóc cá nhân và đồ gia
                            dụng tại cửa hàng đều là hàng chính hãng, có nguồn gốc xuất xứ rõ ràng và được kiểm tra lượng kỹ lưỡng trước khi đến tay khách hàng.</div>
                        <div>Khách hàng hoàn toàn có thể yên tâm về độ an toàn, chất lượng cũng như hiệu quả sử dụng
                            của sản phẩm trong quá trình trải nghiệm.</div>
                    </SupportItem>

                    <SupportItem title="02. Giao hàng nhanh toàn quốc">
                        <div>PCM hợp tác cùng các đơn vị vận chuyển uy tín nhằm mang đến trải
                            nghiệm mua sắm nhanh chóng và thuận tiện nhất cho khách hàng trên toàn quốc.
                        </div>
                        <div>Hỗ trợ giao hàng nhanh trong ngày tại một số khu vực nội thành.
                            Đóng gói cẩn thận đối với các sản phẩm mỹ phẩm, nước hoa và đồ gia dụng dễ vỡ nhằm đảm
                            bảo sản phẩm luôn nguyên vẹn khi đến tay khách hàng.</div>
                    </SupportItem>

                    <SupportItem title="03. Đổi trả dễ dàng trong vòng 15 ngày">
                        <div>PCM hỗ trợ khách hàng đổi trả sản phẩm trong vòng 15 ngày đối với các trường hợp lỗi từ
                            nhà sản xuất hoặc sản phẩm không đúng với đơn đặt hàng.</div>
                        <div>Đội ngũ chăm sóc khách hàng luôn sẵn sàng hỗ trợ nhanh chóng để đảm bảo quyền lợi và
                            trải nghiệm mua sắm tốt nhất cho khách hàng.</div>
                    </SupportItem>

                    <SupportItem title="04. Tư vấn sản phẩm phù hợp theo nhu cầu">
                        <div>PCM hiểu rằng mỗi khách hàng sẽ có nhu cầu chăm sóc cá nhân và sử
                            dụng sản phẩm khác nhau.
                        </div>
                        <div>Vì vậy đội ngũ tư vấn của PCM luôn sẵn sàng hỗ trợ lựa chọn:</div>
                        <div>Mỹ phẩm phù hợp với từng loại da.</div>
                        <div>Nước hoa theo phong cách cá nhân.</div>
                        <div>Đồ gia dụng tiện ích phù hợp với không gian sống và nhu cầu sử dụng hằng ngày.</div>
                    </SupportItem>

                    <SupportItem title="05. Ưu đãi thành viên và chăm sóc khách hàng lâu dài">
                        <div>PCM luôn mong muốn đồng hành cùng khách hàng trong suốt quá trình
                            mua sắm và sử dụng sản phẩm.</div>
                        <div>Khách hàng thân thiết sẽ nhận được nhiều ưu đãi hấp dẫn như:</div>
                        <div>Tích điểm đổi quà và nhận mã giảm giá định kỳ.</div>
                        <div>Ưu tiên nhận thông tin khuyến mãi sớm nhất.</div>
                        <div>Hỗ trợ chăm sóc và giải đáp thắc mắc trong suốt quá trình sử dụng sản phẩm.</div>
                    </SupportItem>

                </div>
                <div className="footer-social">
                    <div className="footer-social-top">
                        <div className="top-social-left">
                            <div className="top-social-title">
                                <h1>Tin tức và Kết nối</h1>
                                <div>Cập nhật thông tin làm đẹp từ PC market</div>
                            </div>
                        </div>
                        <div className="top-social-right">
                            <span>XEM TẤT CẢ</span>
                            <i className="fa-solid fa-plus"></i>
                        </div>
                    </div>
                    <div className="footer-social-main">
                        <div className="main-social-left">
                            <div className="social-news">
                                <div className="img-box"><img src="hinhanh/new1.jpg" alt="" /></div>
                                <div className="main-social-title">
                                    <div className="title-logo">
                                        <div>01.08</div>
                                        <div>2025</div>
                                    </div>
                                    <p>Yêu cầu cấu hình PC của Battlefield 6 chính thức được công bố</p>
                                </div>
                            </div>
                        </div>

                        <div className="main-social-right">
                            <div className="social-right-box">
                                <div className="social-news">
                                    <div className="img-box"><img src="hinhanh/new4.jpg" alt="" /></div>
                                    <div className="main-social-title">
                                        <div className="title-logo">
                                            <div>01.08</div>
                                            <div>2025</div>
                                        </div>
                                        <p>Top cấu hình PC chơi Assasin's Creed </p>
                                    </div>
                                </div>
                                <div className="social-news">
                                    <div className="img-box"><img src="hinhanh/new3.jpg" alt="" /></div>
                                    <div className="main-social-title">
                                        <div className="title-logo">
                                            <div>01.08</div>
                                            <div>2025</div>
                                        </div>
                                        <p>Lựa chọn cấu hình PC chơi Black Myth: Wukong</p>
                                    </div>
                                </div>
                            </div>
                            <div className="social-right-box">
                                <div className="social-news">
                                    <div className="img-box"><img src="hinhanh/new2.jpg" alt="" /></div>
                                    <div className="main-social-title">
                                        <div className="title-logo">
                                            <div>01.08</div>
                                            <div>2025</div>
                                        </div>
                                        <p>Top 5 cấu hình máy tính chơi game Valorant siêu mượt 2026</p>
                                    </div>
                                </div>
                                <div className="social-news">
                                    <div className="img-box"><img src="hinhanh/new5.jpg" alt="" /></div>
                                    <div className="main-social-title">
                                        <div className="title-logo">
                                            <div>01.08</div>
                                            <div>2025</div>
                                        </div>
                                        <p>Yêu cầu cấu hình của Clair Obscur</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="footer-showroom">
                    <div className="showroom-top">
                        HỆ THỐNG SHOWROOM CỦA PC MARKET
                    </div>
                    <div className="showroom-main">
                        <div className="showroom">
                            <div className="showroom-title">
                                <span>1</span>
                                <div>SHOWROOM - THỦ ĐỨC - HỒ CHÍ MINH</div>
                            </div>
                            <div className="showroom-detail">
                                <div className="showroom-box">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <div>Địa chỉ: 70-79 Nguyễn Văn Ngân, Thủ Đức, Hồ Chí Minh</div>
                                </div>
                                <div className="showroom-box">
                                    <i className="fa-solid fa-map"></i>
                                    <a href="https://maps.app.goo.gl/SQbgJbHbkHmxZPkS9" target="_blank" rel="noreferrer">Xem bản đồ đường
                                        đi</a>
                                </div>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1164.973577603464!2d106.75940251823205!3d10.85040708743119!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317527a297127c5f%3A0xfe2159e80361a4e6!2zNzAgxJAuIFbDtSBWxINuIE5nw6JuLCBUaOG7pyDEkOG7qWMsIEjhu5MgQ2jDrSBNaW5oIDcxMzU2LCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1779091021469!5m2!1svi!2s"
                                    width="40%" height="100" style={{ border: 0 }} allowFullScreen loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"></iframe>
                                <div className="showroom-box">
                                    <i className="fa-solid fa-phone"></i>
                                    <div>Liên hệ 24/7 Tel: 079.797.7979</div>
                                </div>

                                <div className="showroom-box">
                                    <i className="fa-solid fa-clock"></i>
                                    <div>Thời gian mở cửa: Từ 9h00-20h00 hàng ngày</div>
                                </div>

                                <div className="showroom-box">
                                    <i className="fa-solid fa-clock"></i>
                                    <div>Sau 20h00 : Quý khách vui lòng liên hệ Hotline để được hỗ trợ nhanh nhất</div>
                                </div>
                            </div>
                        </div>
                        <div className="showroom">
                            <div className="showroom-title">
                                <span>2</span>
                                <div>SHOWROOM - QUẬN 2 - HỒ CHÍ MINH</div>
                            </div>
                            <div className="showroom-detail">
                                <div className="showroom-box">
                                    <i className="fa-solid fa-location-dot"></i>
                                    <div>Địa chỉ: 70-79 Trần Não, Quận 2, Hồ Chí Minh</div>
                                </div>
                                <div className="showroom-box">
                                    <i className="fa-solid fa-map"></i>
                                    <a href="https://maps.app.goo.gl/vLPnLuWXAetvr8mM8" target="_blank" rel="noreferrer">Xem bản đồ đường
                                        đi</a>
                                </div>
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.323905315212!2d106.72721287586883!3d10.786485259006406!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x317525fde40375d9%3A0x901bbcd4b95c96a2!2zNzAgVHLhuqduIE7Do28sIEtodSBwaOG7kSAzLCBBbiBLaMOhbmgsIEjhu5MgQ2jDrSBNaW5oLCBWaeG7h3QgTmFt!5e0!3m2!1svi!2s!4v1779091065716!5m2!1svi!2s"
                                    width="40%" height="100" style={{ border: 0 }} allowFullScreen loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"></iframe>
                                <div className="showroom-box">
                                    <i className="fa-solid fa-phone"></i>
                                    <div>Liên hệ 24/7 Tel: 079.797.7979</div>
                                </div>

                                <div className="showroom-box">
                                    <i className="fa-solid fa-clock"></i>
                                    <div>Thời gian mở cửa: Từ 9h00-20h00 hàng ngày</div>
                                </div>

                                <div className="showroom-box">
                                    <i className="fa-solid fa-clock"></i>
                                    <div>Sau 20h00 : Quý khách vui lòng liên hệ Hotline để được hỗ trợ nhanh nhất</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="footer-policy">
                    <div className="policy-box">
                        <span className="policy-title">
                            GIỚI THIỆU PC MARKET
                        </span>
                        <div>Giới thiệu về công ty</div>
                        <div>Thông tin liên hệ</div>
                        <div>Tin tức</div>
                    </div>
                    <div className="policy-box">
                        <span className="policy-title">
                            HỖ TRỢ KHÁCH HÀNG
                        </span>
                        <div>Hướng dẫn mua hàng trực tuyến</div>
                        <div>Hướng dẫn thanh toán</div>
                        <div>Góp ý, Khiếu nại</div>
                    </div>
                    <div className="policy-box">
                        <span className="policy-title">
                            CHÍNH SÁCH CHUNG
                        </span>
                        <div>Chính sách vận chuyển</div>
                        <div>Chính sách thanh toán</div>
                        <div>Chính sách bảo hành</div>
                        <div>Chính sách đổi trả</div>
                        <div>Bảo mật thông tin khách hàng</div>
                    </div>
                    <div className="policy-box">
                        <img src="hinhanh/bocongthuong.png" alt="" />
                    </div>
                </div>

                <div className="footer-media">
                    <div className="media-left">
                        <div><img src="hinhanh/facebook-svgrepo-com.svg" alt="" /></div>
                        <div><img src="hinhanh/instagram-1-svgrepo-com.svg" alt="" /></div>
                        <div><img src="hinhanh/youtube-svgrepo-com.svg" alt="" /></div>
                    </div>
                    <div className="media-right">
                        <div><img src="hinhanh/Zalopay_idRtpNYmzE_1.svg" alt="" /></div>
                        <div><img src="hinhanh/Logo.png" alt="" /></div>
                        <div><img src="hinhanh/VNPAY_id-sVSMjm2_1.svg" alt="" /></div>
                        <div><img src="hinhanh/Visa_Inc-_idDUM8TcN7_0.svg" alt="" /></div>
                    </div>
                </div>

                <div className="footer-info">
                    <div className="info-top">
                        <div>CÔNG TY TNHH ĐẦU TƯ VÀ THƯƠNG MẠI PCM</div>
                        <div>Giấy phép ĐKKD số 07979797979 do Sở Kế hoạch và Đầu tư thành phố Hồ Chí Minh cấp lần đầu
                            ngày:
                            07/09/2079</div>
                        <div>Trụ sở: Số 70-79 Trần Não, Quận 2, Thành phố Hồ Chí Minh, Việt Nam</div>
                        <div>Email: phamxuanthien@gmail.com</div>
                        <div>Tel: 0979 797 979</div>
                    </div>
                    <div>Copyright ©2021 PC Market - Pharmacity | Cosmetics</div>
                </div>
            </div>
        </footer>
    );
}