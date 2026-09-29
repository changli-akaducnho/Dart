import { SHIPPING_NOTE } from "./studio";

export const categories = [
  { value: "all", label: "Tất cả" },
  { value: "Portrait", label: "Chân dung" },
  { value: "Character Illustration", label: "Character Illustration" },
  { value: "Landscape", label: "Phong cảnh" },
  { value: "Pet", label: "Thú cưng" },
  { value: "Custom Concept", label: "Custom Concept" },
];

export const faqs = [
  {
    question: "Tranh đặt theo yêu cầu mất bao lâu?",
    answer: "Thời gian thông thường là 7–10 ngày. Bạn nên đặt trước 1 tháng để chủ động lịch nhận; ngày mong muốn trên form phải cách hôm nay ít nhất 7 ngày. Đơn gấp 4–5 ngày phụ phí 15%, 72 giờ phụ phí 60% và cần liên hệ Zalo hoặc Facebook để studio xác nhận có thể nhận đơn.",
  },
  {
    question: "Tôi có thể yêu cầu chỉnh sửa không?",
    answer: "Hai lần chỉnh sửa nhỏ đầu tiên miễn phí; từ lần 3 cộng 50.000 ₫/lần. Chỉnh sửa lớn sau khi đã duyệt sketch có phụ phí 20–40%. Studio trao đổi và xác nhận phạm vi, chi phí trước khi thực hiện thay đổi.",
  },
  { question: "Phí vận chuyển được tính thế nào?", answer: SHIPPING_NOTE },
  {
    question: "Tôi có thể đặt tranh dựa trên ảnh cá nhân không?",
    answer: "Có. Bạn có thể gửi ảnh tham khảo rõ nét để DART trao đổi về bố cục và phong cách. Với Custom Concept, mô tả ý tưởng và ảnh tham khảo là bắt buộc; các loại tranh khác có thể bổ sung khi tư vấn.",
  },
  {
    question: "Giá tranh được tính như thế nào?",
    answer: "Bảng giá thể hiện giá theo chất liệu và khổ A5 hoặc A4. Chi tiết thêm, chỉnh sửa và yêu cầu gấp có phụ phí như niêm yết. Sản phẩm custom được tư vấn riêng. Studio xác nhận tổng chi phí và lịch nhận trước khi bắt đầu.",
  },
];

// Operational information supplied by the studio; no placeholder legal terms.
export const policies: Record<string, { title: string; paragraphs: string[] }> = {
  ordering: {
    title: "Hướng dẫn đặt hàng",
    paragraphs: [
      "Chọn tác phẩm có sẵn hoặc gửi yêu cầu đặt tranh riêng. Điền thông tin liên hệ, địa chỉ nhận, khổ A5 hoặc A4 và ngày mong muốn. Custom Concept cần mô tả ý tưởng và ảnh tham khảo; các thể loại khác không bắt buộc hai mục này.",
      "Nên đặt trước 1 tháng. Ngày nhận mong muốn trên form phải cách hôm nay ít nhất 7 ngày; nếu cần gấp, liên hệ Zalo hoặc Facebook để kiểm tra lịch và phụ phí.",
      "Sau khi gửi yêu cầu thành công, nhân viên tư vấn sẽ liên hệ để xác nhận tác phẩm, chi phí và lịch giao. Gửi form chưa phải xác nhận đơn hàng hay thanh toán.",
      "Thông tin liên hệ, địa chỉ, yêu cầu và ảnh tham khảo được gửi qua email đến dartspacestudio@gmail.com để tư vấn đơn hàng. Ảnh và địa chỉ nhận không được đăng công khai. Nếu muốn điều chỉnh hoặc xóa thông tin đã gửi, vui lòng liên hệ studio qua email hoặc Zalo.",
    ],
  },
  shipping: {
    title: "Vận chuyển",
    paragraphs: [
      SHIPPING_NOTE,
      "Vui lòng nhập đầy đủ số nhà, đường, phường/xã, khu vực/quận và tỉnh/thành phố cùng số điện thoại liên hệ. Studio sẽ xác nhận cách giao, chi phí và lịch nhận trong quá trình tư vấn.",
      "Nếu cần đổi địa chỉ hoặc có vấn đề khi nhận tranh, hãy liên hệ studio qua Zalo hoặc Facebook và cung cấp mã yêu cầu để được hỗ trợ.",
    ],
  },
};
