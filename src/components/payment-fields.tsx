"use client";

import { useState } from "react";
import { PAYMENT_METHODS, type PaymentMethod } from "@/lib/booking";

export function PaymentFields({ prefix, showQr = false }: { prefix: string; showQr?: boolean }) {
  const [method, setMethod] = useState<PaymentMethod | "">("");
  return (
    <fieldset className="payment-fields field-full">
      <legend>Phương thức thanh toán <span aria-hidden="true">*</span></legend>
      <div className="payment-options">
        {Object.entries(PAYMENT_METHODS).map(([value, label]) => (
          <label className="payment-option" key={value}>
            <input
              type="radio"
              name="paymentMethod"
              value={value}
              required
              checked={method === value}
              onChange={() => setMethod(value as PaymentMethod)}
              aria-controls={value === "bank_transfer" && showQr ? `${prefix}-bank-qr` : undefined}
            />
            <span>{label}</span>
          </label>
        ))}
      </div>
      {method === "bank_transfer" && !showQr && (
        <p className="form-note">Studio sẽ tư vấn, xác nhận báo giá và hướng dẫn chuyển khoản cho tranh đặt theo yêu cầu.</p>
      )}
      {method === "bank_transfer" && showQr && (
        <div className="payment-qr" id={`${prefix}-bank-qr`}>
          <p><strong>Quét mã để chuyển khoản cho DART Studio</strong></p>
          {/* Keep the supplied payment QR unchanged, without image optimization. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/payments/dart-studio-qr.png" alt="Mã VietQR chuyển khoản của DART Studio" width={1206} height={1206} />
          <a href="/payments/dart-studio-qr.png" download="DART-Studio-QR.png">Tải mã QR về máy ↗</a>
          <p>Vui lòng chờ studio xác nhận số tiền trước khi chuyển khoản. Nội dung chuyển khoản: họ tên và số điện thoại đặt tranh.</p>
          <p>Studio sẽ kiểm tra và xác nhận thanh toán trực tiếp với bạn.</p>
        </div>
      )}
    </fieldset>
  );
}
