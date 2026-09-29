"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { trackEvent } from "@/lib/analytics";
import {
  BOOKING_CATEGORIES,
  BOOKING_SIZES,
  BOOKING_BUDGETS,
  MAX_REFERENCE_BYTES,
  REFERENCE_TYPES,
  minimumBookingDate,
  validateBooking,
} from "@/lib/booking";
import { STUDIO_EMAIL, STUDIO_ZALO } from "@/data/studio";

type FormStatus = "idle" | "saving" | "success" | "error";
type ArtworkSummary = { id: string; title: string; price: number };

function validateForm(form: HTMLFormElement) {
  const fields = form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
    "input, textarea",
  );
  for (const field of fields) {
    field.setCustomValidity("");
    if (field.required && !field.value.trim())
      field.setCustomValidity("Vui lòng điền thông tin này.");
    else if (
      field.name === "phone" &&
      !/^\+?\d{8,15}$/.test(field.value.replace(/[\s().-]/g, ""))
    )
      field.setCustomValidity(
        "Vui lòng nhập số điện thoại hợp lệ (8–15 chữ số).",
      );
    else if (field.name === "name" && field.value.trim().length < 2)
      field.setCustomValidity("Vui lòng nhập họ tên có ít nhất 2 ký tự.");
    else if (
      field.name === "idea" &&
      field.required &&
      field.value.trim().length < 10
    )
      field.setCustomValidity("Hãy mô tả ý tưởng bằng ít nhất 10 ký tự.");
  }
  const date = form.elements.namedItem("desiredDate") as HTMLInputElement;
  date.min = minimumBookingDate();
  return form.reportValidity();
}

function clearCustomError(event: FormEvent<HTMLFormElement>) {
  const target = event.target;
  if (
    target instanceof HTMLInputElement ||
    target instanceof HTMLTextAreaElement
  )
    target.setCustomValidity("");
}

function ContactFields({ prefix }: { prefix: string }) {
  return (
    <>
      <div className="field field-full">
        <label htmlFor={`${prefix}-name`}>
          Họ tên <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${prefix}-name`}
          name="name"
          autoComplete="name"
          placeholder="Tên của bạn"
          required
          minLength={2}
          maxLength={100}
        />
      </div>
      <div className="field">
        <label htmlFor={`${prefix}-phone`}>
          Số điện thoại <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${prefix}-phone`}
          name="phone"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="Số điện thoại liên hệ"
          required
          maxLength={24}
        />
      </div>
      <div className="field">
        <label htmlFor={`${prefix}-email`}>
          Email <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${prefix}-email`}
          name="email"
          type="email"
          autoComplete="email"
          placeholder="ban@email.com"
          required
          maxLength={200}
        />
      </div>
    </>
  );
}

function SizeAndDateFields({ prefix }: { prefix: string }) {
  return (
    <>
      <div className="field">
        <label htmlFor={`${prefix}-dimensions`}>
          Khổ tranh <span aria-hidden="true">*</span>
        </label>
        <select
          id={`${prefix}-dimensions`}
          name="dimensions"
          required
          defaultValue=""
        >
          <option value="" disabled>
            Chọn khổ tranh
          </option>
          {BOOKING_SIZES.map((size) => (
            <option key={size} value={size}>
              {size} — {size === "A4" ? "21 × 29,7 cm" : "29,7 × 42 cm"}
            </option>
          ))}
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${prefix}-date`}>
          Ngày mong muốn nhận tranh <span aria-hidden="true">*</span>
        </label>
        <input
          id={`${prefix}-date`}
          name="desiredDate"
          type="date"
          min={minimumBookingDate()}
          required
          aria-describedby={`${prefix}-date-note`}
        />
        <p className="form-note" id={`${prefix}-date-note`}>
          Cách hôm nay ít nhất 7 ngày. Studio sẽ xác nhận lịch sau khi tư vấn.
        </p>
      </div>
    </>
  );
}

function useBookingRequest() {
  const [status, setStatus] = useState<FormStatus>("idle");
  const [error, setError] = useState("");
  const [bookingId, setBookingId] = useState("");
  const sending = useRef(false);
  async function send(data: FormData) {
    if (sending.current) return false;
    setError("");
    try {
      validateBooking(data);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Vui lòng kiểm tra biểu mẫu.",
      );
      setStatus("error");
      return false;
    }
    sending.current = true;
    setStatus("saving");
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        body: data,
      });
      const result = await response.json();
      if (!response.ok || typeof result.id !== "string")
        throw new Error(
          result.error || "Chưa gửi được yêu cầu. Vui lòng thử lại.",
        );
      setBookingId(result.id);
      setStatus("success");
      return true;
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Mất kết nối. Vui lòng thử lại hoặc liên hệ Zalo.",
      );
      setStatus("error");
      return false;
    } finally {
      sending.current = false;
    }
  }
  return {
    status,
    error,
    bookingId,
    send,
    reset: () => {
      setStatus("idle");
      setError("");
    },
  };
}

function RequestError({ error }: { error: string }) {
  return error ? (
    <p className="form-error" role="alert">
      {error}{" "}
      <a href={STUDIO_ZALO} target="_blank" rel="noopener noreferrer">
        Trao đổi qua Zalo ↗
      </a>
    </p>
  ) : null;
}

function SubmissionSuccess({
  onReset,
  bookingId,
}: {
  onReset: () => void;
  bookingId: string;
}) {
  const successRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    successRef.current?.focus();
  }, []);
  return (
    <div className="form-success" role="status" tabIndex={-1} ref={successRef}>
      <span className="success-icon" aria-hidden="true">
        ✓
      </span>
      <p className="eyebrow">CẢM ƠN BẠN ĐÃ CHIA SẺ</p>
      <h3>Yêu cầu của bạn đã được gửi.</h3>
      <p>
        Nhân viên tư vấn DART sẽ liên hệ trực tiếp qua thông tin bạn cung cấp để
        hỗ trợ và xác nhận lịch nhận tranh.
      </p>
      <p className="form-note booking-id">
        Mã yêu cầu: {bookingId}. Đơn hàng và ngày nhận tranh sẽ được chốt sau
        khi tư vấn.
      </p>
      <button type="button" className="button button-primary" onClick={onReset}>
        Tạo yêu cầu khác <span aria-hidden="true">↗</span>
      </button>
    </div>
  );
}

export function CommissionForm({
  source = "commission_section",
}: {
  source?: string;
}) {
  const prefix = useId();
  const started = useRef(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const ideaInput = useRef<HTMLTextAreaElement>(null);
  const { status, error, bookingId, send, reset } = useBookingRequest();
  const [category, setCategory] = useState("");
  const customConcept = category === "Custom Concept";
  const [reference, setReference] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState("");
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );

  function trackStart() {
    if (!started.current) {
      started.current = true;
      trackEvent("commission_form_start", { source });
    }
  }
  function removeReference() {
    setReference(null);
    setPreview(null);
    setFileError("");
    if (fileInput.current) {
      fileInput.current.value = "";
      fileInput.current.setCustomValidity("");
    }
  }
  function selectReference(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    setFileError("");
    setReference(null);
    setPreview(null);
    if (!file) return;
    if (
      !REFERENCE_TYPES.includes(file.type) ||
      file.size > MAX_REFERENCE_BYTES ||
      file.size === 0
    ) {
      setFileError("Vui lòng chọn ảnh JPG, PNG hoặc WebP hợp lệ, tối đa 5 MB.");
      event.target.value = "";
      return;
    }
    setReference(file);
    setPreview(URL.createObjectURL(file));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "saving" || !validateForm(event.currentTarget) || fileError)
      return;
    trackStart();
    const data = new FormData(event.currentTarget);
    data.set("type", "commission");
    if (await send(data)) {
      trackEvent("commission_form_submit", { source });
      setReference(null);
      setPreview(null);
    }
  }
  if (status === "success")
    return (
      <SubmissionSuccess
        bookingId={bookingId}
        onReset={() => {
          reset();
          setCategory("");
          started.current = false;
        }}
      />
    );
  return (
    <form
      className="inquiry-form"
      onSubmit={submit}
      onChange={trackStart}
      onInput={clearCustomError}
      aria-busy={status === "saving"}
    >
      <p className="form-intro">
        Kể một chút về bức tranh bạn đang hình dung. Từ một kỷ niệm, một gam màu
        hay một góc nhà.
      </p>
      <p className="form-note">
        Yêu cầu được gửi đến {STUDIO_EMAIL}. Các mục có * là bắt buộc.
      </p>
      <fieldset disabled={status === "saving"} className="form-fields">
        <legend className="sr-only">Thông tin đặt tranh theo yêu cầu</legend>
        <div className="form-grid">
          <ContactFields prefix={prefix} />
          <div className="field">
            <label htmlFor={`${prefix}-category`}>
              Loại tranh <span aria-hidden="true">*</span>
            </label>
            <select
              id={`${prefix}-category`}
              name="category"
              value={category}
              required
              onChange={(event) => {
                setCategory(event.target.value);
                ideaInput.current?.setCustomValidity("");
                fileInput.current?.setCustomValidity("");
              }}
            >
              <option value="" disabled>
                Chọn loại tranh
              </option>
              {BOOKING_CATEGORIES.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor={`${prefix}-budget`}>
              Ngân sách <span aria-hidden="true">*</span>
            </label>
            <select
              id={`${prefix}-budget`}
              name="budget"
              defaultValue=""
              required
            >
              <option value="" disabled>
                Chọn khoảng ngân sách
              </option>
              {BOOKING_BUDGETS.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <SizeAndDateFields prefix={prefix} />
          <div className="field field-full">
            <label htmlFor={`${prefix}-idea`}>
              Mô tả ý tưởng{" "}
              {customConcept ? (
                <span aria-hidden="true">*</span>
              ) : (
                <span className="optional-label">(không bắt buộc)</span>
              )}
            </label>
            <textarea
              ref={ideaInput}
              id={`${prefix}-idea`}
              name="idea"
              rows={4}
              placeholder="Câu chuyện, phong cách, màu sắc hoặc không gian bạn muốn dành cho tác phẩm…"
              required={customConcept}
              minLength={customConcept ? 10 : undefined}
              maxLength={4000}
            />
          </div>
          <div className="field field-full upload-field">
            <label htmlFor={`${prefix}-reference`}>
              Ảnh tham khảo{" "}
              {customConcept ? (
                <span aria-hidden="true">*</span>
              ) : (
                <span className="optional-label">(không bắt buộc)</span>
              )}
            </label>
            <input
              ref={fileInput}
              id={`${prefix}-reference`}
              name="reference"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              required={customConcept}
              onChange={selectReference}
              aria-describedby={`${prefix}-file-note${fileError ? ` ${prefix}-file-error` : ""}`}
              aria-invalid={Boolean(fileError)}
            />
            <p className="form-note" id={`${prefix}-file-note`}>
              JPG, PNG hoặc WebP · tối đa 5 MB. Ảnh được đính kèm email gửi
              studio.
              {customConcept &&
                " Custom Concept cần cả mô tả ý tưởng và ảnh tham khảo."}
            </p>
            {fileError && (
              <p
                className="form-error"
                id={`${prefix}-file-error`}
                role="alert"
              >
                {fileError}{" "}
                <button
                  type="button"
                  className="text-button"
                  onClick={removeReference}
                >
                  {customConcept ? "Chọn lại ảnh" : "Bỏ qua ảnh"}
                </button>
              </p>
            )}
            {reference && preview && (
              <div className="reference-preview">
                {/* Browser-owned object URLs are temporary and do not use the Next image optimizer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={preview}
                  alt="Ảnh tham khảo bạn đã chọn"
                  width={104}
                  height={80}
                />
                <span>{reference.name}</span>
                <button
                  type="button"
                  className="text-button"
                  onClick={removeReference}
                >
                  Xóa ảnh
                </button>
              </div>
            )}
          </div>
        </div>
      </fieldset>
      <RequestError error={error} />
      <button
        type="submit"
        className="button button-primary"
        disabled={status === "saving"}
      >
        {status === "saving" ? "Đang gửi yêu cầu…" : "Đặt tranh — nhận tư vấn"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-note">
        Sau khi gửi yêu cầu, nhân viên tư vấn sẽ liên hệ hỗ trợ trực tiếp. Chưa
        cần thanh toán ở bước này.
      </p>
    </form>
  );
}

export function PurchaseForm({
  artwork,
  source = "artwork_detail",
}: {
  artwork: ArtworkSummary;
  source?: string;
}) {
  const prefix = useId();
  const started = useRef(false);
  const { status, error, bookingId, send, reset } = useBookingRequest();
  function trackStart() {
    if (!started.current) {
      started.current = true;
      trackEvent("purchase_form_start", { source, artworkId: artwork.id });
    }
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "saving" || !validateForm(event.currentTarget)) return;
    trackStart();
    const data = new FormData(event.currentTarget);
    data.set("type", "purchase");
    data.set("artworkId", artwork.id);
    if (await send(data))
      trackEvent("purchase_form_submit", { source, artworkId: artwork.id });
  }
  if (status === "success")
    return (
      <SubmissionSuccess
        bookingId={bookingId}
        onReset={() => {
          reset();
          started.current = false;
        }}
      />
    );
  return (
    <form
      className="inquiry-form"
      onSubmit={submit}
      onChange={trackStart}
      onInput={clearCustomError}
      aria-busy={status === "saving"}
    >
      <div className="purchase-summary">
        <span className="eyebrow">TÁC PHẨM BẠN QUAN TÂM</span>
        <h3>{artwork.title}</h3>
        <p>
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(artwork.price)}
        </p>
      </div>
      <p className="form-note">
        Yêu cầu được gửi đến {STUDIO_EMAIL}. Các mục có * là bắt buộc.
      </p>
      <fieldset disabled={status === "saving"} className="form-fields">
        <legend className="sr-only">Thông tin yêu cầu mua tác phẩm</legend>
        <div className="form-grid">
          <ContactFields prefix={prefix} />
          <SizeAndDateFields prefix={prefix} />
          <div className="field field-full">
            <label htmlFor={`${prefix}-message`}>
              Lời nhắn <span className="optional-label">(không bắt buộc)</span>
            </label>
            <textarea
              id={`${prefix}-message`}
              name="message"
              rows={4}
              maxLength={4000}
              placeholder="Bạn muốn tìm hiểu thêm về tác phẩm, khung tranh hay giao hàng?"
            />
          </div>
        </div>
      </fieldset>
      <RequestError error={error} />
      <button
        type="submit"
        className="button button-primary"
        disabled={status === "saving"}
      >
        {status === "saving" ? "Đang gửi yêu cầu…" : "Đặt tranh — nhận tư vấn"}
        <span aria-hidden="true">↗</span>
      </button>
      <p className="form-note">
        Nhân viên sẽ liên hệ để tư vấn, xác nhận khổ tranh có sẵn và lịch giao.
        Gửi yêu cầu chưa giữ chỗ tác phẩm hoặc phát sinh thanh toán.
      </p>
    </form>
  );
}
