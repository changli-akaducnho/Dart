import { additionalPrices, commissionPrices, turnaroundPrices } from "@/data/pricing";
import { SHIPPING_NOTE, STUDIO_PAGE, STUDIO_ZALO } from "@/data/studio";
import { Icon } from "./icons";

const formatPrice = (value: number | null, from: boolean) =>
  value === null ? "Liên hệ" : `${from ? "Từ " : ""}${value.toLocaleString("vi-VN")} ₫`;

export function PricingSection({ onBook }: { onBook: () => void }) {
  return (
    <section className="section page-width pricing-section" id="pricing" aria-labelledby="pricing-title">
      <div className="section-heading">
        <div>
          <p className="eyebrow">A LITTLE CLARITY, BEFORE WE CREATE</p>
          <h2 id="pricing-title">Bảng giá đặt tranh<span className="serif-dot">.</span></h2>
        </div>
        <p>Chọn một chất liệu.<br />Bắt đầu câu chuyện của bạn.</p>
      </div>
      <div className="pricing-layout">
        <div className="price-table-wrap">
          <table className="price-table">
            <caption>Giá vẽ theo chất liệu & khổ giấy</caption>
            <thead><tr><th scope="col">Loại tranh</th><th scope="col">A5 <small>14,8 × 21 cm</small></th><th scope="col">A4 <small>21 × 29,7 cm</small></th></tr></thead>
            <tbody>{commissionPrices.map((item) => (
              <tr key={item.name}><th scope="row">{item.name}</th><td>{formatPrice(item.a5, "from" in item)}</td><td>{formatPrice(item.a4, "from" in item)}</td></tr>
            ))}</tbody>
          </table>
          <p className="price-footnote">Các mục chưa có giá niêm yết được báo riêng sau khi trao đổi. Giá tranh đã giao trong bộ sưu tập là giá của tác phẩm trước đó.</p>
        </div>
        <aside className="pricing-aside">
          <p className="eyebrow">DÀNH RIÊNG CHO BẠN</p>
          <h3>Một ý tưởng,<br /><em>nhiều cách thể hiện.</em></h3>
          <p>DART nhận thiết kế riêng trên bề mặt sản phẩm bạn muốn custom. Gửi hình sản phẩm và ý tưởng để studio tư vấn chất liệu, cách thực hiện và báo giá.</p>
          <button className="button button-primary" onClick={onBook}>Đặt tranh riêng <Icon name="arrow-up" size={17} /></button>
          <div className="shipping-callout"><Icon name="check" size={22} /><p>{SHIPPING_NOTE}</p></div>
        </aside>
      </div>
      <div className="pricing-details">
        <div className="turnaround-panel">
          <p className="eyebrow">THỜI GIAN THỰC HIỆN</p>
          <h3>Chậm một chút, chỉn chu hơn.</h3>
          <dl>{turnaroundPrices.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.fee}</dd></div>)}</dl>
          <p>Nên đặt trước 1 tháng để chủ động lịch nhận. Form nhận ngày mong muốn từ 7 ngày trở lên. Đơn gấp 4–5 ngày hoặc 72 giờ cần <a href={STUDIO_ZALO} target="_blank" rel="noopener noreferrer">liên hệ Zalo</a> hoặc <a href={STUDIO_PAGE} target="_blank" rel="noopener noreferrer">Facebook</a> để studio xác nhận lịch và phụ phí trước khi nhận đơn.</p>
        </div>
        <details className="extras-panel" open>
          <summary>Chi tiết thêm & chỉnh sửa <Icon name="plus" size={18} /></summary>
          <dl>{additionalPrices.map(([label, fee]) => <div key={label}><dt>{label}</dt><dd>{fee}</dd></div>)}</dl>
          <p>Studio xác nhận tổng chi phí, phạm vi chỉnh sửa và tiến độ cùng bạn trước khi bắt đầu.</p>
        </details>
      </div>
    </section>
  );
}
