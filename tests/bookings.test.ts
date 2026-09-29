import assert from "node:assert/strict";
import { after, mock, test } from "node:test";
import nodemailer, { type SendMailOptions } from "nodemailer";
import { minimumBookingDate, validateBooking } from "../src/lib/booking";
import { bookingEmail } from "../src/lib/booking-email";
import { STUDIO_EMAIL } from "../src/data/studio";
import { POST } from "../src/app/api/bookings/route";

const previousPassword = process.env.GMAIL_APP_PASSWORD;
process.env.GMAIL_APP_PASSWORD = "test-only-not-a-real-password";
let mail: SendMailOptions | undefined;
let rejectMail = false;
let sequence = 0;
// Every send is intercepted. No Gmail login or external email is performed.
mock.method(
  nodemailer,
  "createTransport",
  () =>
    ({
      async sendMail(message: SendMailOptions) {
        mail = message;
        if (rejectMail) throw new Error("Simulated SMTP outage");
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
test("only A3 and A4 are allowed", () => {
  for (const dimensions of ["A3", "A4"])
    assert.doesNotThrow(() => validateBooking(form({ dimensions })));
  for (const dimensions of ["A2", "60x80", ""])
    assert.throws(() => validateBooking(form({ dimensions })), /A3 hoặc A4/);
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
test("API uses catalog price and refuses delivered artworks", async () => {
  const valid = await POST(
    request(form({ type: "purchase", artworkId: "cc1", price: "1" })),
  );
  assert.equal(valid.status, 200);
  assert.ok(String(mail?.text).includes("79.000 VNĐ"));
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
  ]) {
    assert.equal((await POST(request(form(overrides)))).status, 400);
  }
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
  rejectMail = true;
  try {
    assert.equal((await POST(request(form()))).status, 502);
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
