import assert from "node:assert/strict";
import { after, mock, test } from "node:test";
import nodemailer, { type SendMailOptions } from "nodemailer";
import { bookingCategoryForArtwork, minimumBookingDate, PAYMENT_METHODS, validateBooking } from "../src/lib/booking";
import { bookingEmail, bookingConfirmationEmail } from "../src/lib/booking-email";
import { PURCHASE_DELIVERY_NOTE, STUDIO_EMAIL } from "../src/data/studio";
import { POST } from "../src/app/api/bookings/route";
import { POST as postReview } from "../src/app/api/reviews/route";

const previousPassword = process.env.GMAIL_APP_PASSWORD;
process.env.GMAIL_APP_PASSWORD = "test-only-not-a-real-password";
let mail: SendMailOptions | undefined;
let rejectMail = false;
let receiptFailure: "throw" | "reject" | undefined;
const sent: SendMailOptions[] = [];
let sequence = 0;
// Every send is intercepted. No Gmail login or external email is performed.
mock.method(
  nodemailer,
  "createTransport",
  () =>
    ({
      async sendMail(message: SendMailOptions) {
        sent.push(message);
        const isReceipt = typeof message.to === "object" && !Array.isArray(message.to);
        if (!isReceipt) mail = message;
        if (rejectMail) throw new Error("Simulated SMTP outage");
        if (isReceipt) {
          if (receiptFailure === "throw") throw new Error("Simulated customer mail failure");
          return { accepted: receiptFailure === "reject" ? [] : [(message.to as { address: string }).address], rejected: [] };
        }
        return { accepted: [STUDIO_EMAIL], rejected: [] };
      },
      close() {},
    }) as unknown as ReturnType<typeof nodemailer.createTransport>,
);
after(() => {
  mock.restoreAll();
  if (previousPassword === undefined) delete process.env.GMAIL_APP_PASSWORD;
  else process.env.GMAIL_APP_PASSWORD = previousPassword;
});

function form(overrides: Record<string, string | undefined> = {}) {
  const data = new FormData();
  for (const [key, value] of Object.entries({
    type: "commission",
    name: "Khách kiểm thử",
    phone: "0901234567",
    email: `booking-${++sequence}@example.test`,
    address: "123 Đường kiểm thử, Phường 1, Quận 10, TP.HCM",
    paymentMethod: "cod",
    category: "Chân dung",
    dimensions: "A4",
    budget: "Dưới 1 triệu",
    desiredDate: minimumBookingDate(),
    idea: "",
    ...overrides,
  }))
    if (value !== undefined) data.set(key, value);
  return data;
}
function reference() {
  const png = Buffer.from(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=",
    "base64",
  );
  return new File([png], "reference.png", { type: "image/png" });
}
function request(data: FormData) {
  return new Request("http://localhost:3000/api/bookings", {
    method: "POST",
    body: data,
    headers: { origin: "http://localhost:3000" },
  });
}

test("minimum date uses Vietnam's date and handles year/month boundaries", () => {
  assert.equal(
    minimumBookingDate(new Date("2026-09-28T16:59:59Z")),
    "2026-10-05",
  );
  assert.equal(
    minimumBookingDate(new Date("2026-09-28T17:00:00Z")),
    "2026-10-06",
  );
  assert.equal(
    minimumBookingDate(new Date("2026-12-28T03:00:00Z")),
    "2027-01-04",
  );
  assert.equal(
    minimumBookingDate(new Date("2028-02-23T03:00:00Z")),
    "2028-03-01",
  );
});
test("exactly seven days is accepted; six days and invalid dates are rejected", () => {
  const now = new Date("2026-09-29T03:00:00Z");
  assert.doesNotThrow(() =>
    validateBooking(form({ desiredDate: "2026-10-06" }), now),
  );
  for (const desiredDate of ["2026-10-05", "2027-02-30", "", "not-a-date"]) {
    assert.throws(() => validateBooking(form({ desiredDate }), now), /7 ngày/);
  }
});
test("only A5 and A4 are allowed", () => {
  for (const dimensions of ["A5", "A4"])
    assert.doesNotThrow(() => validateBooking(form({ dimensions })));
  for (const dimensions of ["A3", "A2", "60x80", ""])
    assert.throws(() => validateBooking(form({ dimensions })), /A5 hoặc A4/);
});
test("all ordinary categories allow missing reference and short or empty ideas", () => {
  for (const category of [
    "Chân dung",
    "Character Illustration",
    "Phong cảnh",
    "Thú cưng",
  ]) {
    assert.doesNotThrow(() => validateBooking(form({ category })));
    assert.doesNotThrow(() => validateBooking(form({ category, idea: "Đỏ" })));
  }
});
test("portfolio categories preselect valid booking values and both emails use Vietnamese labels and the confirmed-order timeline", () => {
  const categories = [
    ["Portrait", "Chân dung"],
    ["Character Illustration", "Minh họa nhân vật"],
    ["Landscape", "Phong cảnh"],
    ["Pet", "Thú cưng"],
    ["Custom Concept", "Ý tưởng riêng"],
  ] as const;
  for (const [artworkCategory, label] of categories) {
    const data = form({ category: bookingCategoryForArtwork(artworkCategory), idea: "Tham khảo phong cách: Diona" });
    if (artworkCategory === "Custom Concept") data.set("reference", reference());
    const booking = validateBooking(data);
    const studioMessage = bookingEmail(booking, "DART-STYLE", new Date());
    const customerMessage = bookingConfirmationEmail(booking, "DART-STYLE");
    for (const message of [studioMessage, customerMessage]) {
      assert.ok(message.text.includes(`Thể loại: ${label}`));
      assert.ok(message.text.includes("Tham khảo phong cách: Diona"));
      assert.match(message.text, /7–10 ngày sau khi xác nhận đơn/);
      assert.match(message.text, /2–4 tuần/);
      assert.match(message.text, /Ngày mong muốn nhận tranh \(cần xác nhận\)/);
      assert.doesNotMatch(message.text, /Character Illustration|Custom Concept|1 tháng/);
    }
  }
});
test("Custom Concept requires both an idea and a reference; switching back removes that requirement", () => {
  const data = form({ category: "Custom Concept" });
  assert.throws(() => validateBooking(data), /mô tả/);
  data.set("idea", "Một không gian cổ tích");
  assert.throws(() => validateBooking(data), /ảnh tham khảo/);
  data.set("reference", reference());
  assert.doesNotThrow(() => validateBooking(data));
  data.set("category", "Chân dung");
  data.set("idea", "");
  data.delete("reference");
  assert.doesNotThrow(() => validateBooking(data));
});
test("invalid contact details and oversized or unsupported references are rejected", () => {
  for (const overrides of [
    { phone: "abc" },
    { email: "no-address" },
    { name: "a" },
  ])
    assert.throws(() => validateBooking(form(overrides)));
  const data = form();
  data.set("reference", new File(["abc"], "note.txt", { type: "text/plain" }));
  assert.throws(() => validateBooking(data), /5 MB/);
  data.set(
    "reference",
    new File([new Uint8Array(5 * 1024 * 1024 + 1)], "big.png", {
      type: "image/png",
    }),
  );
  assert.throws(() => validateBooking(data), /5 MB/);
});
test("email template contains the structured booking and a fixed studio recipient", () => {
  const booking = validateBooking(
    form({ desiredDate: "2099-10-06", idea: "Tranh tông xanh" }),
  );
  const message = bookingEmail(
    booking,
    "DART-TEST",
    new Date("2026-09-29T03:00:00Z"),
  );
  assert.equal(message.to, STUDIO_EMAIL);
  assert.equal(message.replyTo.address, booking.email);
  for (const value of [
    "DART-TEST",
    booking.name,
    booking.phone,
    booking.email,
    booking.address,
    "Quận 10",
    "06/10/2099",
    "A4",
    "Tranh tông xanh",
  ])
    assert.ok(message.text.includes(value));
});
test("API sends a validated booking and actual image bytes using the studio recipient", async () => {
  const data = form({
    category: "Custom Concept",
    idea: "Một ý tưởng đủ chi tiết",
  });
  data.set("reference", reference());
  data.set("to", "not-the-studio@example.test");
  const response = await POST(request(data));
  assert.equal(response.status, 200);
  assert.match((await response.json()).id, /^DART-/);
  assert.equal(mail?.to, STUDIO_EMAIL);
  assert.equal(mail?.attachments?.length, 1);
  assert.ok(Buffer.isBuffer(mail?.attachments?.[0].content));
});

test("customer receipt has the same booking ID, details, studio reply-to and no final order promise", () => {
  for (const type of ["commission", "purchase"] as const) {
    const booking = validateBooking(form({ type, artworkId: "cc2", desiredDate: "2099-10-06" }));
    const receipt = bookingConfirmationEmail(booking, "DART-RECEIPT", { title: "Tranh thử", price: 49000 });
    assert.deepEqual(receipt.to, { name: booking.name, address: booking.email });
    assert.equal(receipt.replyTo.address, STUDIO_EMAIL);
    for (const value of ["DART-RECEIPT", booking.name, booking.address, "chưa xác nhận thanh toán", "Bạn không cần đặt lại"])
      assert.ok(receipt.text.includes(value));
    if (type === "purchase") assert.match(receipt.text, /49.000 VNĐ/);
    else {
      for (const value of [booking.category, "06/10/2099", "A4"])
        assert.ok(receipt.text.includes(value));
    }
  }
});

test("booking sends a separate customer receipt after the studio accepts, without reference attachments", async () => {
  const start = sent.length;
  const data = form();
  data.set("reference", reference());
  const response = await POST(request(data));
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.confirmationEmail, "accepted");
  const messages = sent.slice(start);
  assert.equal(messages.length, 2);
  assert.equal(messages[0].to, STUDIO_EMAIL);
  assert.deepEqual(messages[1].to, { name: data.get("name"), address: data.get("email") });
  assert.equal(messages[1].attachments, undefined);
  assert.equal(messages[1].cc, undefined);
  for (const message of messages) assert.ok(String(message.text).includes(result.id));
});

test("customer SMTP errors or rejected recipients preserve successful booking without retrying", async () => {
  for (const failure of ["throw", "reject"] as const) {
    const start = sent.length;
    receiptFailure = failure;
    try {
      const response = await POST(request(form()));
      assert.equal(response.status, 200);
      const result = await response.json();
      assert.match(result.id, /^DART-/);
      assert.equal(result.confirmationEmail, "unconfirmed");
      assert.equal(sent.length - start, 2);
    } finally { receiptFailure = undefined; }
  }
});
test("API uses catalog price and refuses delivered artworks", async () => {
  const valid = await POST(
    request(form({ type: "purchase", artworkId: "cc2", price: "1" })),
  );
  assert.equal(valid.status, 200);
  assert.ok(String(mail?.text).includes("49.000 VNĐ"));
  const unavailable = await POST(
    request(form({ type: "purchase", artworkId: "c4" })),
  );
  assert.equal(unavailable.status, 400);
});
test("loopback Host is accepted when Next normalizes its internal URL to localhost", async () => {
  const req = request(form());
  req.headers.set("host", "127.0.0.1:3000");
  req.headers.set("origin", "http://127.0.0.1:3000");
  assert.equal((await POST(req)).status, 200);
});
test("API rejects files masquerading as images before sending", async () => {
  const data = form();
  data.set(
    "reference",
    new File(["not an image"], "fake.png", { type: "image/png" }),
  );
  assert.equal((await POST(request(data))).status, 400);
});
test("API enforces validation even when client-side fields are bypassed", async () => {
  for (const overrides of [
    { dimensions: "A2" },
    { desiredDate: "2020-01-01" },
    { category: "Custom Concept" },
    { address: "" },
    { address: "   " },
    { address: "a".repeat(501) },
  ]) {
    assert.equal((await POST(request(form(overrides)))).status, 400);
  }
});

test("purchase inquiries also require the delivery address", async () => {
  const response = await POST(request(form({ type: "purchase", artworkId: "cc2", address: undefined })));
  assert.equal(response.status, 400);
  assert.match((await response.json()).error, /địa chỉ/);
});

test("removed artworks cannot be ordered through stale forms or direct API calls", async () => {
  const start = sent.length;
  for (const artworkId of ["cc1", "c2", "c7", "p5"])
    assert.equal((await POST(request(form({ type: "purchase", artworkId })))).status, 400);
  assert.equal(sent.length, start);
});

test("both booking types require a valid payment method and include it in both emails", async () => {
  for (const type of ["commission", "purchase"] as const) {
    for (const paymentMethod of [undefined, "", "cash", "paid"]) {
      const start = sent.length;
      const response = await POST(request(form({ type, artworkId: "cc2", paymentMethod })));
      assert.equal(response.status, 400);
      assert.equal(sent.length, start);
    }
    for (const paymentMethod of ["cod", "bank_transfer"] as const) {
      const start = sent.length;
      const response = await POST(request(form({ type, artworkId: "cc2", paymentMethod })));
      assert.equal(response.status, 200);
      assert.equal(sent.length - start, 2);
      for (const message of sent.slice(start))
        assert.ok(String(message.text).includes(`Phương thức thanh toán: ${PAYMENT_METHODS[paymentMethod]}`));
    }
  }
});

test("collection purchases need no size or date and both emails give the 3–5 day delivery notice", async () => {
  for (const fields of [
    { dimensions: undefined, desiredDate: undefined },
    { dimensions: "A2", desiredDate: "2020-01-01" },
  ]) {
    const data = form({ type: "purchase", artworkId: "cc2", ...fields });
    const booking = validateBooking(data);
    assert.equal(booking.dimensions, "");
    assert.equal(booking.desiredDate, "");
    const start = sent.length;
    const response = await POST(request(data));
    assert.equal(response.status, 200);
    assert.equal(sent.length - start, 2);
    for (const message of sent.slice(start)) {
      const text = String(message.text);
      assert.ok(text.includes(PURCHASE_DELIVERY_NOTE));
      assert.doesNotMatch(text, /Khổ tranh mong muốn|Ngày yêu cầu nhận hàng|Ngày mong muốn nhận tranh|1 tháng|7 ngày|2020-01-01/);
    }
  }
});

test("commissions still require both size and a date at least seven days away", async () => {
  for (const fields of [{ dimensions: undefined }, { desiredDate: undefined }, { desiredDate: "2020-01-01" }])
    assert.equal((await POST(request(form(fields)))).status, 400);
});

const reviewRequest = (overrides: Record<string, unknown> = {}) => new Request("http://localhost:3000/api/reviews", {
  method: "POST",
  headers: { "content-type": "application/json", origin: "http://localhost:3000" },
  body: JSON.stringify({ name: "Khách kiểm thử", email: `review-${++sequence}@example.test`, rating: 4, comment: "Tranh đẹp và trao đổi rõ ràng.", ...overrides }),
});

test("reviews are emailed privately to the studio and cannot change the recipient", async () => {
  const response = await postReview(reviewRequest({ to: "other@example.test" }));
  assert.equal(response.status, 200);
  assert.match((await response.json()).id, /^REVIEW-/);
  assert.equal(mail?.to, STUDIO_EMAIL);
  assert.match(String(mail?.text), /4\/5 sao/);
  assert.match(String(mail?.text), /Tranh đẹp và trao đổi rõ ràng/);
  assert.match(String(mail?.text), /Không tự động đăng công khai/);
});

test("reviews reject invalid fields, foreign origins and oversized request bodies", async () => {
  for (const data of [{ rating: 0 }, { rating: 6 }, { rating: 1.5 }, { rating: "5" }, { email: "bad" }, { name: "x" }, { comment: " " }, { comment: "x".repeat(2001) }])
    assert.equal((await postReview(reviewRequest(data))).status, 400);
  const foreign = reviewRequest();
  foreign.headers.set("origin", "https://other.example");
  assert.equal((await postReview(foreign)).status, 403);
  const wrongType = reviewRequest();
  wrongType.headers.set("content-type", "text/plain");
  assert.equal((await postReview(wrongType)).status, 415);
  assert.equal((await postReview(reviewRequest({ comment: "x".repeat(17000) }))).status, 413);
});

test("reviews report missing credentials and SMTP failures without false success", async () => {
  delete process.env.GMAIL_APP_PASSWORD;
  try { assert.equal((await postReview(reviewRequest())).status, 503); }
  finally { process.env.GMAIL_APP_PASSWORD = "test-only-not-a-real-password"; }
  rejectMail = true;
  try { assert.equal((await postReview(reviewRequest())).status, 502); }
  finally { rejectMail = false; }
});

test("repeat reviews from one email are throttled", async () => {
  const email = "repeated-review@example.test";
  for (let i = 0; i < 3; i++) assert.equal((await postReview(reviewRequest({ email }))).status, 200);
  assert.equal((await postReview(reviewRequest({ email }))).status, 429);
});
test("missing credentials never produce a false success", async () => {
  delete process.env.GMAIL_APP_PASSWORD;
  try {
    assert.equal((await POST(request(form()))).status, 503);
  } finally {
    process.env.GMAIL_APP_PASSWORD = "test-only-not-a-real-password";
  }
});
test("SMTP failure returns an error instead of a booking confirmation", async () => {
  const start = sent.length;
  rejectMail = true;
  try {
    assert.equal((await POST(request(form()))).status, 502);
    assert.equal(sent.length - start, 1, "must not send a customer receipt when studio delivery fails");
  } finally {
    rejectMail = false;
  }
});
test("cross-origin and excessive-size requests are rejected", async () => {
  const cross = request(form());
  cross.headers.set("origin", "https://other.example");
  assert.equal((await POST(cross)).status, 403);
  const oversized = request(form());
  oversized.headers.set("content-length", String(7 * 1024 * 1024));
  assert.equal((await POST(oversized)).status, 413);
});
test("repeat requests from the same email are throttled", async () => {
  const email = "repeated@example.test";
  for (let i = 0; i < 5; i++)
    assert.equal((await POST(request(form({ email })))).status, 200);
  assert.equal((await POST(request(form({ email })))).status, 429);
});
