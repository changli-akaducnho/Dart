export const categories = [
  { value: "all", label: "Tất cả" },
  { value: "Portrait", label: "Chân dung" },
  { value: "Character Illustration", label: "Character Illustration" },
  { value: "Landscape", label: "Phong cảnh" },
  { value: "Pet", label: "Thú cưng" },
  { value: "Custom Concept", label: "Custom Concept" },
];
export const testimonials = [
  {
    id: "demo-1",
    isPlaceholder: true,
    quote:
      "Một góc nhà quen thuộc bỗng có cảm xúc hơn. Màu sắc nhẹ nhàng, đúng với điều mình đã hình dung.",
    name: "Minh Anh",
    context: "Tranh cho không gian sống",
    initials: "MA",
  },
  {
    id: "demo-2",
    isPlaceholder: true,
    quote:
      "Mình thích cách được trao đổi về từng chi tiết nhỏ. Bức tranh có một câu chuyện mà chỉ gia đình mình hiểu.",
    name: "Hoàng Nam",
    context: "Tranh chân dung gia đình",
    initials: "HN",
  },
  {
    id: "demo-3",
    isPlaceholder: true,
    quote:
      "Một món quà rất riêng. Từ ý tưởng ban đầu đến màu sắc cuối cùng, mọi thứ đều được trao đổi rõ ràng.",
    name: "Thảo Vy",
    context: "Tranh đặt làm quà tặng",
    initials: "TV",
  },
];
export const faqs = [
  {
    question: "Tranh đặt theo yêu cầu mất bao lâu?",
    answer:
      "Bạn nên đặt tranh trước 1 tháng để tránh rủi ro về thời gian. Ngày mong muốn nhận tranh trên biểu mẫu phải cách hôm nay ít nhất 7 ngày; lịch thực tế sẽ được nhân viên tư vấn xác nhận. Nếu cần tranh sát ngày, vui lòng liên hệ trực tiếp qua Zalo hoặc page của studio.",
  },
  {
    question: "Tôi có thể yêu cầu chỉnh sửa không?",
    answer:
      "Bạn có thể trao đổi chỉnh sửa ở giai đoạn phác thảo. Số lần chỉnh sửa và phạm vi thay đổi sẽ được thống nhất trong báo giá trước khi thực hiện tác phẩm.",
  },
  {
    question: "DART có giao tranh toàn quốc không?",
    answer:
      "DART dự kiến hỗ trợ giao tranh toàn quốc. Cách đóng gói, đơn vị vận chuyển và chi phí sẽ được xác nhận riêng theo kích thước tranh và địa chỉ nhận.",
  },
  {
    question: "Tôi có thể đặt tranh dựa trên ảnh cá nhân không?",
    answer:
      "Có. Bạn có thể gửi ảnh tham khảo rõ nét của mình hoặc hình ảnh mà bạn có quyền sử dụng. DART sẽ trao đổi về bố cục và phong cách phù hợp trước khi lên phác thảo.",
  },
  {
    question: "Giá tranh được tính như thế nào?",
    answer:
      "Báo giá dựa trên kích thước, chất liệu, độ phức tạp và thời gian thực hiện. Khung tranh và phí vận chuyển, nếu có, được báo riêng. Giá được thống nhất trước khi bắt đầu.",
  },
];
export const policies: Record<string, { title: string; paragraphs: string[] }> =
  {
    ordering: {
      title: "Chính sách đặt hàng",
      paragraphs: [
        "Yêu cầu đặt tranh được gửi đến dartspacestudio@gmail.com. Chỉ khi website báo gửi thành công, yêu cầu mới được máy chủ email chấp nhận. Nếu gặp lỗi gửi, hãy liên hệ trực tiếp qua Zalo.",
        "Bạn nên đặt trước 1 tháng; ngày nhận mong muốn phải cách hôm nay ít nhất 7 ngày. Nếu cần gấp, hãy liên hệ Zalo hoặc page của studio để kiểm tra lịch.",
        "Sau khi nhận yêu cầu, nhân viên tư vấn sẽ liên hệ hỗ trợ và xác nhận tình trạng tác phẩm, khổ A3 hoặc A4, báo giá và lịch giao. Gửi biểu mẫu chưa phải xác nhận đơn hàng hay thanh toán.",
      ],
    },
    shipping: {
      title: "Vận chuyển",
      paragraphs: [
        "Thông tin dự kiến: tranh được đóng gói phù hợp với chất liệu và kích thước. Phí và thời gian vận chuyển sẽ được báo sau khi có địa chỉ nhận.",
        "Chính sách và đối tác vận chuyển chính thức sẽ được cập nhật trước khi mở bán.",
      ],
    },
    returns: {
      title: "Đổi trả",
      paragraphs: [
        "Chính sách đổi trả đang được hoàn thiện. Điều kiện áp dụng cho tranh có sẵn và tranh đặt riêng sẽ được thông báo trước khi khách hàng xác nhận mua.",
        "Website tiếp nhận yêu cầu tư vấn đặt tranh và chưa thu tiền trực tuyến.",
      ],
    },
    terms: {
      title: "Điều khoản & dữ liệu",
      paragraphs: [
        "Đây là website MVP để thử nghiệm trải nghiệm. Hình ảnh tác phẩm, giá và tình trạng do DART cung cấp. Giá của tác phẩm đã giao được giữ lại để tham khảo. Đánh giá khách hàng hiện là nội dung mẫu; hình ảnh studio được ghi chú khi dùng minh họa AI.",
        "Khi gửi biểu mẫu, thông tin liên hệ, yêu cầu đặt tranh và ảnh tham khảo (nếu có) được chuyển qua máy chủ website đến email dartspacestudio@gmail.com để studio tư vấn. Biểu mẫu không lưu yêu cầu mới trong localStorage. Ảnh chỉ được xử lý để gửi email, không được đăng công khai lên website.",
        "Sự kiện tương tác được ghi cục bộ, không chứa nội dung biểu mẫu. Bạn có thể xóa dữ liệu tương tác và dữ liệu thử nghiệm cũ trong cài đặt trình duyệt. Để yêu cầu xóa thông tin đã gửi đến studio qua email, vui lòng liên hệ dartspacestudio@gmail.com.",
      ],
    },
  };
