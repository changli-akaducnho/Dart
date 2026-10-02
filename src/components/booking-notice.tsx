import { PURCHASE_DELIVERY_NOTE, SHIPPING_NOTE, STUDIO_PAGE, STUDIO_ZALO } from "@/data/studio";
import { COMMISSION_TIMELINE_NOTE, COMMISSION_PLANNING_NOTE } from "@/lib/booking";

export function BookingNotice({ purchase = false }: { purchase?: boolean }) {
  return (
    <details className="booking-notice" open>
      <summary>Lưu ý khi đặt tranh</summary>
      <ul>
        <li>{SHIPPING_NOTE}</li>
        {purchase ? <li><strong>{PURCHASE_DELIVERY_NOTE}</strong></li> : <>
          <li>{COMMISSION_TIMELINE_NOTE} {COMMISSION_PLANNING_NOTE}</li>
          <li>Ngày mong muốn nhận tranh phải cách hôm nay ít nhất 7 ngày và cần studio xác nhận sau khi tư vấn.</li>
        </>}
        <li>
          Nếu cần tranh sát ngày, vui lòng liên hệ trực tiếp qua{" "}
          <a href={STUDIO_ZALO} target="_blank" rel="noopener noreferrer">
            Zalo
          </a>
          {STUDIO_PAGE ? (
            <>
              {" "}
              hoặc{" "}
              <a href={STUDIO_PAGE} target="_blank" rel="noopener noreferrer">
                page của studio
              </a>
            </>
          ) : (
            " hoặc page của studio"
          )}{" "}
          để kiểm tra lịch.
        </li>
        <li>
          Sau khi gửi yêu cầu đặt hàng,{" "}
          <strong>nhân viên tư vấn sẽ liên hệ hỗ trợ trực tiếp</strong>
          {purchase ? "." : " và xác nhận lịch nhận tranh."}
        </li>
      </ul>
    </details>
  );
}
