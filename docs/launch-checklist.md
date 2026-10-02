# DART — phần đã làm và phần cần studio xác nhận

Ngày cập nhật: 02/10/2026.

## Đã có trong mã nguồn

- Tách Có sẵn / Portfolio, bỏ giá cũ và giỏ hàng giả; CTA đặt tương tự điền sẵn tác phẩm tham khảo.
- 23 trang tác phẩm có URL, mô tả, chất liệu, trạng thái, ảnh, chia sẻ qua URL và thông tin giao hàng. Không tự điền kích thước/năm hoàn thành chưa được cung cấp.
- Điều hướng tiếng Việt, giá canvas rõ chất liệu, thông báo giá chưa gồm khung.
- Các trang hướng dẫn đặt hàng, vận chuyển, bảo mật, thanh toán và phản hồi khách hàng.
- Carousel có vuốt ngang trên điện thoại, phím mũi tên và dừng tự động khi hover/focus. Zalo nằm trên thanh đầu trang ở điện thoại để không che nội dung và nút gửi; desktop vẫn có nút góc phải.
- Sitemap, robots, canonical, OG theo tác phẩm; schema Organization/Breadcrumb và Product cho tranh có sẵn.

## Thông tin cần bổ sung

- Cọc 50.000đ áp dụng cho tranh đặt vẽ hay cả tranh có sẵn; khi nào trả phần còn lại; xử lý cọc khi khách đổi ý, trước và sau phác thảo. Chưa tự cam kết hoàn/giữ cọc cho những trường hợp này.
- Kích thước vật lý và năm hoàn thành từng tranh; nếu cần nêu độc bản/1-of-1 thì studio xác nhận phạm vi đó.
- Ảnh thật về đội ngũ, quá trình vẽ và đóng gói. Hiện chỉ dùng ảnh tranh thật đã có; không giả ảnh hậu trường hoặc tiểu sử.
- Nếu muốn đăng đánh giá lên trang chủ: cung cấp ít nhất 3 đánh giá thật và sự đồng ý công khai của khách. Form phản hồi hiện gửi riêng tới studio.

## Đưa lên website

1. Kiểm tra thay đổi, commit và push GitHub. Cloudflare cần build bằng `npm run build:cloudflare` rồi deploy bằng `npx opennextjs-cloudflare deploy`.
2. Giữ `GMAIL_USER` và `GMAIL_APP_PASSWORD` đúng trong runtime secrets. Sau deploy, tự gửi một đơn được đánh dấu kiểm thử và xác nhận email ở cả studio lẫn khách; kiểm thử tự động dùng mail giả và không chứng minh thư thật đã vào inbox.
3. Mở trang tác phẩm, `/sitemap.xml`, `/robots.txt` và các trang thông tin trên URL public; kiểm tra ảnh chia sẻ, QR và hai lựa chọn thanh toán. Chọn chuyển khoản không phải bằng chứng đã thanh toán.

## Tên miền và Google

Studio chưa có tên miền riêng. Sau khi studio chọn/mua tên miền, gắn vào Worker và đặt `NEXT_PUBLIC_SITE_URL` thành URL HTTPS đó trong cấu hình build, rồi build/deploy lại. Email theo tên miền cần studio chọn nhà cung cấp và cấu hình riêng; chưa thay Gmail đang nhận đơn.

- Hướng dẫn chính thức: [Cloudflare Custom Domains](https://developers.cloudflare.com/workers/configuration/routing/custom-domains/).
- Xác minh quyền sở hữu website trong Google Search Console; gửi URL `/sitemap.xml`, kiểm tra trang chủ và trang tác phẩm bằng URL Inspection. Đưa sitemap lên không bảo đảm Google lập chỉ mục ngay: [Google Search Central](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).

Không có phép đo Lighthouse/Core Web Vitals production trong lần sửa này; không gán điểm hiệu năng hoặc đánh giá thương mại giả định cho website.
