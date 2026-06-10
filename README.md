# Yibohuy ☀️ — Dự Báo Thời Tiết & Học Thời Tiết

> Website dự báo thời tiết vui nhộn, thân thiện với người dùng và tối ưu trải nghiệm trên mobile (PWA).

## Giới thiệu
**Yibohuy** là trang web hiển thị **thời tiết hiện tại**, **dự báo theo giờ (24h)** và **dự báo 5 ngày** dựa trên dữ liệu công khai.

Ngoài phần dự báo, trang còn có:
- **Học về thời tiết**: các thẻ kiến thức tương tác (nắng, mây, mưa, dông bão, tuyết, cầu vồng, gió, sương mù).
- **Vòng tuần hoàn nước**: mô tả trực quan theo các bước.
- **Quiz đoán thời tiết**: câu hỏi trắc nghiệm giúp người xem học nhanh và vui.

Tất cả nội dung hiển thị trực tiếp trong trình duyệt, không yêu cầu đăng nhập.

## Tính năng nổi bật
- 🌍 **Tìm kiếm theo tên thành phố** (geocoding) để lấy tọa độ.
- 📍 **Tự động hiển thị thời tiết** (mặc định tải cho Hà Nội khi mở trang).
- ⏱️ **Dự báo theo giờ** (cuộn ngang) cho khoảng 24 giờ kế tiếp.
- 📅 **Dự báo 5 ngày** với biểu tượng thời tiết và khoảng nhiệt độ.
- 🧭 **Chi tiết thời tiết**: độ ẩm, tốc độ/hướng gió, áp suất, UV, bình minh & hoàng hôn.
- 🎮 **Trò chơi học tập (Quiz)** tích hợp trong trang.
- 📱 **PWA**: hỗ trợ cài đặt (install), hoạt động tốt trên mobile.
- 📴 **Offline/Cache cho tài nguyên tĩnh** thông qua Service Worker.

## Công nghệ & nguồn dữ liệu
- Frontend: **HTML / CSS / JavaScript thuần**.
- PWA: **Service Worker** + **manifest**.
- Nguồn dữ liệu thời tiết:
  - **Open-Meteo Forecast API** (`api.open-meteo.com`)
  - **Open-Meteo Geocoding API** (`geocoding-api.open-meteo.com`)

> Lưu ý bảo mật: dự án được thiết kế để **không cần API key** cho Open-Meteo.

## Cài đặt / Chạy dự án
Dự án là trang web tĩnh, có thể chạy trực tiếp trong trình duyệt.

1. Mở thư mục `web/`.
2. Mở file `web/index.html` trên trình duyệt.

Gợi ý (khuyến nghị):
- Với một số tính năng PWA/Service Worker, hãy chạy bằng một local server (ví dụ VSCode Live Server) để đảm bảo hành vi đồng nhất.

## Cấu trúc thư mục
- `web/`
  - `index.html`: trang chính (các mục Trang Chủ / Học / Tìm Kiếm)
  - `script.js`: logic lấy dữ liệu thời tiết, render UI, quiz, điều hướng
  - `style.css`: giao diện và responsive
- `mobile/`
  - `manifest.json`: cấu hình PWA
  - `pwa.js`: xử lý nút cài app và thông báo toast
  - `sw.js`: Service Worker (cache tĩnh, xử lý offline)

## SEO & nội dung hướng tới tìm kiếm
- Có tiêu đề trang và mô tả mô tả dịch vụ (meta description) cho mục đích hiển thị trên công cụ tìm kiếm & mạng xã hội.
- Nội dung tập trung vào từ khóa chính:
  - **dự báo thời tiết**, **thời tiết theo giờ**, **thời tiết 5 ngày**, **học thời tiết**.
- Cấu trúc trang theo các phần rõ ràng (Hero, Weather, Forecast, Learn, Search).

## Bảo mật & quyền riêng tư
- Không lưu thông tin nhạy cảm của người dùng.
- Không thu thập dữ liệu cá nhân.
- Dữ liệu thời tiết được lấy từ API công khai.

## Hướng dẫn sử dụng
- Truy cập trang chính và xem thời tiết hiện tại + dự báo 5 ngày.
- Chọn mục **Tìm Kiếm** để nhập tên thành phố (hoặc bấm nhanh các chip thành phố).
- Xem thêm:
  - **Theo giờ**: kéo ngang phần giờ.
  - **Chi tiết**: xem thông tin độ ẩm, gió, UV, bình minh/hoàng hôn.
- Ở mục **Học**: bấm thẻ để mở kiến thức dạng modal.
- Ở phần **Quiz**: chọn đáp án và nhận giải thích.

## Lưu ý
- Thời tiết phụ thuộc dữ liệu trả về từ API.
- Khi mất kết nối mạng, trang sẽ hiển thị thông báo lỗi ở khu vực hiển thị thời tiết.

## Liên hệ
Nếu cần cải tiến nội dung SEO, cấu trúc heading, hoặc tối ưu thêm hiệu năng/metadata, có thể mở issue trong repository.

