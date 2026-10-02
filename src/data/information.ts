import { PURCHASE_DELIVERY_NOTE, SHIPPING_NOTE, STUDIO_EMAIL } from "./studio";

export const informationPages = {
  terms: {
    title: "Thanh toán & xác nhận đơn",
    description: "Thông tin thanh toán đã được DART xác nhận và những nội dung cần thống nhất khi đặt tranh.",
    sections: [
      { title: "Xác nhận trước khi thanh toán", paragraphs: ["Gửi biểu mẫu là gửi yêu cầu tư vấn. Studio trao đổi với bạn về tác phẩm, quy cách, giá, khung, phí vận chuyển và lịch giao trước khi xác nhận đơn.", "Giá niêm yết chưa bao gồm khung. Phương thức COD hoặc chuyển khoản trên form là lựa chọn của bạn; website không tự kiểm tra giao dịch ngân hàng hay xác nhận đã thanh toán."] },
      { title: "Khoản cọc", paragraphs: ["Mức cọc studio cung cấp là 50.000đ. Trước khi chuyển tiền, vui lòng xác nhận trực tiếp với DART khoản cọc áp dụng cho đơn của bạn và thời điểm thanh toán phần còn lại.", "Mã QR trên website chỉ dành cho tranh có sẵn. Với tranh đặt vẽ, studio sẽ hướng dẫn thanh toán sau khi tư vấn."] },
      { title: "Hủy đơn & hoàn tiền", paragraphs: ["DART hỗ trợ hủy đơn và hoàn tiền khi đơn vị vận chuyển làm hỏng tranh. Liên hệ studio kèm mã yêu cầu và ảnh tình trạng tranh, bao bì để được hỗ trợ.", "Nếu bạn muốn hủy vì thay đổi ý định, hãy trao đổi với studio về tình trạng thực hiện và việc xử lý khoản đã thanh toán trước khi quyết định. Chính sách hoàn tiền do hỏng vận chuyển không mặc định áp dụng cho trường hợp đổi ý."] },
      { title: "Nội dung đặt vẽ và hình ảnh", paragraphs: ["Hãy cung cấp hình ảnh mà bạn có quyền sử dụng cho yêu cầu đặt vẽ. Với nhân vật hoặc hình ảnh của bên khác, studio cần trao đổi phạm vi sử dụng; việc một tác phẩm xuất hiện trong portfolio không đồng nghĩa với việc cấp quyền thương mại đối với nhân vật đó.", "Ảnh tham khảo và phản hồi được gửi riêng tới studio. DART cần sự đồng ý riêng của khách trước khi công khai ảnh hoặc sử dụng thành phẩm của khách để giới thiệu."] },
    ],
  },
  "order-guide": {
    title: "Hướng dẫn đặt hàng",
    description: "Cách chọn tranh có sẵn và đặt một tác phẩm theo yêu cầu tại DART Studio.",
    sections: [
      { title: "Mua tranh có sẵn", paragraphs: ["Chọn tác phẩm trong khu vực Có sẵn, điền thông tin liên hệ, địa chỉ nhận hàng và chọn COD hoặc chuyển khoản. Bạn không cần chọn lại kích thước hoặc ngày nhận.", PURCHASE_DELIVERY_NOTE, "Mã QR chuyển khoản chỉ hiển thị khi mua tranh có sẵn. Vui lòng chờ studio xác nhận tổng số tiền trước khi chuyển khoản; chọn phương thức không đồng nghĩa với đã thanh toán."] },
      { title: "Đặt tranh theo yêu cầu", paragraphs: ["Chọn thể loại, khổ A5 hoặc A4, ngân sách và ngày mong muốn nhận tranh. Với Ý tưởng riêng, hãy thêm mô tả và ảnh tham khảo. Các thể loại khác có thể bổ sung ảnh sau khi tư vấn.", "Thời gian thực hiện thông thường là 7–10 ngày sau khi xác nhận đơn. Nên đặt trước 2–4 tuần để chủ động lịch vẽ và vận chuyển. Ngày mong muốn trong form cách hôm nay ít nhất 7 ngày và cần được studio xác nhận.", "Nếu cần gấp, liên hệ trực tiếp qua Zalo hoặc Facebook để kiểm tra lịch. Đơn 4–5 ngày có phụ phí 15%, đơn 72 giờ có phụ phí 60% theo bảng giá."] },
      { title: "Sau khi gửi yêu cầu", paragraphs: ["Studio nhận thông tin qua email và gửi email xác nhận yêu cầu tới địa chỉ bạn cung cấp. Hãy lưu mã yêu cầu để trao đổi hoặc điều chỉnh thông tin. Nếu email xác nhận chưa đến, kiểm tra Thư rác trước khi liên hệ studio; bạn không cần đặt lại.", "Nhân viên sẽ tư vấn và xác nhận nội dung, tổng chi phí, phương thức thanh toán và lịch giao. Email tiếp nhận chưa phải xác nhận thanh toán hoặc giữ chỗ tác phẩm."] },
      { title: "Giá và khung tranh", paragraphs: ["Giá niêm yết chưa bao gồm khung. Hãy trao đổi với studio về khung, kính và quy cách hoàn thiện nếu bạn có nhu cầu; chi phí được xác nhận trước khi đặt.", "Ảnh tác phẩm đã thực hiện dùng để tham khảo phong cách. Giá đặt một tác phẩm mới được tính theo bảng giá hiện tại và mức độ chi tiết của yêu cầu."] },
    ],
  },
  shipping: {
    title: "Vận chuyển & hỗ trợ khi nhận tranh",
    description: "Thời gian giao tranh, phí vận chuyển và cách liên hệ khi tranh bị hỏng trong quá trình vận chuyển.",
    sections: [
      { title: "Thời gian và phí giao", paragraphs: [SHIPPING_NOTE, `Với tranh có sẵn: ${PURCHASE_DELIVERY_NOTE}`, "Với tranh đặt theo yêu cầu, lịch nhận được studio xác nhận trong quá trình tư vấn, dựa trên thời gian vẽ và vận chuyển. Vui lòng cung cấp địa chỉ đầy đủ và số điện thoại liên hệ."] },
      { title: "Khung và quy cách giao", paragraphs: ["Giá tranh chưa bao gồm khung. Studio trao đổi riêng với bạn về khung, quy cách đóng gói và cách giao trước khi gửi. Không mặc định ảnh minh họa có khung là giá đã bao gồm khung."] },
      { title: "Tranh hỏng do vận chuyển", paragraphs: ["DART hỗ trợ hủy đơn và hoàn tiền khi đơn vị vận chuyển làm hỏng tranh.", "Hãy liên hệ studio kèm mã yêu cầu, hình ảnh tình trạng tranh và bao bì để được hỗ trợ kiểm tra và xử lý. Studio sẽ trao đổi trực tiếp về việc nhận lại tranh và hoàn tiền cho trường hợp của bạn."] },
      { title: "Đổi thông tin nhận hàng", paragraphs: ["Nếu cần sửa địa chỉ hoặc số điện thoại, liên hệ studio sớm và cung cấp mã yêu cầu. Studio sẽ kiểm tra tình trạng gửi hàng để hỗ trợ."] },
    ],
  },
  privacy: {
    title: "Chính sách bảo mật",
    description: "Thông tin DART thu nhận từ biểu mẫu và cách studio sử dụng thông tin để tư vấn, thực hiện đơn hàng.",
    sections: [
      { title: "Thông tin bạn gửi", paragraphs: ["Biểu mẫu đặt tranh thu nhận họ tên, số điện thoại, email, địa chỉ giao hàng, lựa chọn thanh toán và nội dung đặt tranh. Với tranh đặt riêng, bạn có thể gửi mô tả và ảnh tham khảo. Biểu mẫu phản hồi thu nhận tên, email, số sao và nhận xét."] },
      { title: "Mục đích sử dụng", paragraphs: ["Đội ngũ DART dùng thông tin để trao đổi ý tưởng, báo giá, xác nhận và hỗ trợ đơn hàng, giao tranh, gửi email xác nhận và tiếp nhận phản hồi. Thông tin giao hàng cần thiết được sử dụng để bố trí vận chuyển.", "Ảnh tham khảo chỉ được sử dụng để thực hiện yêu cầu của khách và không được công khai nếu chưa có sự đồng ý. Việc gửi ảnh, đặt tranh hoặc gửi đánh giá không đồng nghĩa với đồng ý đăng lên website hay Facebook; studio cần xin phép riêng nếu muốn sử dụng để giới thiệu tác phẩm."] },
      { title: "Email và lưu trữ", paragraphs: [`Nội dung đặt tranh và ảnh tham khảo được chuyển tới ${STUDIO_EMAIL} qua Gmail. Khách nhận email xác nhận riêng; ảnh tham khảo chỉ đính kèm email của studio. Đánh giá được gửi riêng tới studio và không tự động công khai.`, "Website không lưu nội dung biểu mẫu vào bộ nhớ trình duyệt hoặc một cơ sở dữ liệu đơn hàng. Email và tệp đính kèm nằm trong hộp thư studio phục vụ trao đổi; việc đóng trình duyệt không xóa các email đã gửi. Dịch vụ lưu trữ website và gửi thư tham gia xử lý yêu cầu khi bạn sử dụng form."] },
      { title: "Dữ liệu trên trình duyệt", paragraphs: ["Website ghi một số tương tác như mở tác phẩm hoặc bấm đặt tranh vào bộ nhớ trình duyệt để xem luồng sử dụng. Các sự kiện này không chứa tên, email, số điện thoại, địa chỉ, lời nhắn hay ảnh của bạn. Bạn có thể xóa dữ liệu này bằng chức năng xóa dữ liệu trang web trong trình duyệt.", "Liên kết Zalo, Facebook và ứng dụng ngân hàng mở dịch vụ bên ngoài; dữ liệu bạn cung cấp ở đó được xử lý theo chính sách của dịch vụ tương ứng."] },
      { title: "Liên hệ về dữ liệu", paragraphs: [`Bạn có thể yêu cầu xem lại, sửa hoặc xóa thông tin đã gửi bằng cách liên hệ ${STUDIO_EMAIL} hoặc Zalo của studio, kèm mã yêu cầu nếu có. DART sẽ trao đổi để xác định thông tin và phạm vi yêu cầu trước khi xử lý.`] },
    ],
  },
} as const;
