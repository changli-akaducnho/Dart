import { additionalPrices, commissionPrices, turnaroundPrices, canvasPrice } from "@/data/pricing";
import { SHIPPING_NOTE, STUDIO_PAGE, STUDIO_ZALO } from "@/data/studio";
import { Icon } from "./icons";
import styles from "./pricing-section.module.css";

const formatPrice = (value: number | null, from: boolean) =>
  value === null ? "Báo giá theo yêu cầu" : `${from ? "Từ " : ""}${value.toLocaleString("vi-VN")} ₫`;

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
            <caption>Giá vẽ trên giấy · chưa bao gồm khung</caption>
            <thead><tr><th scope="col">Loại tranh</th><th scope="col">A5 <small>14,8 × 21 cm</small></th><th scope="col">A4 <small>21 × 29,7 cm</small></th></tr></thead>
            <tbody>{commissionPrices.map((item) => (
              <tr key={item.name}>
                <th scope="row">{item.name}</th>
                <td><span className={item.a5 === null ? styles.quoteLabel : undefined}>{formatPrice(item.a5, "from" in item)}</span></td>
                <td><span className={item.a4 === null ? styles.quoteLabel : undefined}>{formatPrice(item.a4, "from" in item)}</span></td>
              </tr>
            ))}</tbody>
          </table>
          <div className={styles.canvasQuote}>
            <h3>Acrylic trên canvas</h3>
            <p><strong>{canvasPrice.dimensions}: {canvasPrice.amount.toLocaleString("vi-VN")} ₫.</strong> Giá chưa bao gồm khung.</p>
            <p>Kích thước khác: báo giá theo kích thước và yêu cầu. Studio xác nhận quy cách canvas cùng bạn trước khi bắt đầu.</p>
          </div>
          <p className="price-footnote">Bảng giá dành cho tranh đặt theo yêu cầu, chưa bao gồm khung. Các mục chưa có giá niêm yết được báo riêng; studio xác nhận chất liệu, kích thước và tổng chi phí trước khi bắt đầu.</p>
        </div>
        <aside className="pricing-aside">
          <p className="eyebrow">DÀNH RIÊNG CHO BẠN</p>
          <h3>Một ý tưởng,<br /><em>nhiều cách thể hiện.</em></h3>
          <p>DART nhận vẽ theo ý tưởng riêng trên sản phẩm. Gửi hình sản phẩm và ý tưởng để studio tư vấn chất liệu, cách thực hiện và báo giá.</p>
          <button className="button button-primary" onClick={onBook}>Đặt tranh theo yêu cầu <Icon name="arrow-up" size={17} /></button>
          <div className="shipping-callout"><Icon name="check" size={22} /><p>{SHIPPING_NOTE}</p></div>
        </aside>
      </div>
      <div className="pricing-details">
        <div className="turnaround-panel">
          <p className="eyebrow">THỜI GIAN THỰC HIỆN</p>
          <h3>Chậm một chút, chỉn chu hơn.</h3>
          <dl>{turnaroundPrices.map((item) => <div key={item.label}><dt>{item.label}</dt><dd>{item.fee}</dd></div>)}</dl>
          <p>Thời gian thực hiện tính từ khi xác nhận đơn. Nên đặt trước 2–4 tuần để chủ động lịch vẽ và vận chuyển. Ngày mong muốn nhận tranh trong form là đề xuất của bạn, chưa phải lịch giao được cam kết. Với đơn gấp 4–5 ngày hoặc 72 giờ, hãy <a href={STUDIO_ZALO} target="_blank" rel="noopener noreferrer">nhắn DART qua Zalo</a> hoặc <a href={STUDIO_PAGE} target="_blank" rel="noopener noreferrer">Facebook</a> để xác nhận lịch và phụ phí.</p>
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
