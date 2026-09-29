"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";
import {
  clearAnalyticsEvents,
  getAnalyticsEvents,
  MAX_ANALYTICS_EVENTS,
  refreshAnalyticsEvents,
  subscribeToAnalytics,
  type AnalyticsEvent,
  type AnalyticsEventName,
} from "@/lib/analytics";

function sessionsFor(
  events: AnalyticsEvent[],
  name: AnalyticsEventName,
): Set<string> {
  return new Set(
    events
      .filter((event) => event.name === name)
      .map((event) => event.sessionId),
  );
}

function intersectCount(first: Set<string>, second: Set<string>): number {
  return [...first].filter((id) => second.has(id)).length;
}

function formatRate(numerator: number, denominator: number): string {
  return denominator ? `${Math.round((numerator / denominator) * 100)}%` : "—";
}

// A primitive snapshot stays referentially stable when the stored data is unchanged.
const readSnapshot = () => JSON.stringify(getAnalyticsEvents());
const serverSnapshot = () => null;

export default function AnalyticsDashboard() {
  const snapshot = useSyncExternalStore(
    subscribeToAnalytics,
    readSnapshot,
    serverSnapshot,
  );
  const events = useMemo<AnalyticsEvent[]>(
    () => (snapshot ? JSON.parse(snapshot) : []),
    [snapshot],
  );
  const ready = snapshot !== null;
  const [notice, setNotice] = useState("");

  const summary = useMemo(() => {
    const views = sessionsFor(events, "page_view");
    const artwork = sessionsFor(events, "click_artwork");
    const commission = sessionsFor(events, "click_commission");
    const starts = sessionsFor(events, "commission_form_start");
    const submitted = sessionsFor(events, "commission_form_submit");
    const count = (name: AnalyticsEventName) =>
      events.filter((event) => event.name === name).length;
    return {
      cards: [
        {
          label: "Phiên truy cập",
          value: views.size,
          detail: `${count("page_view")} lượt xem trang`,
        },
        {
          label: "Lượt xem tác phẩm",
          value: count("click_artwork"),
          detail: "Mở chi tiết tác phẩm",
        },
        {
          label: "Nhấp đặt tranh",
          value: count("click_commission"),
          detail: "Tất cả vị trí CTA",
        },
        {
          label: "Bắt đầu biểu mẫu",
          value: count("commission_form_start"),
          detail: "Biểu mẫu đặt tranh riêng",
        },
        {
          label: "Yêu cầu đã gửi",
          value: count("commission_form_submit"),
          detail: "Đặt tranh · dữ liệu thử nghiệm",
        },
        {
          label: "Nhấp liên hệ",
          value: count("click_contact"),
          detail: `${count("click_buy_artwork")} lượt quan tâm mua tranh`,
        },
      ],
      rates: [
        {
          label: "Artwork CTR",
          numerator: intersectCount(views, artwork),
          denominator: views.size,
          description: "Phiên xem chi tiết / phiên xem trang",
        },
        {
          label: "Commission CTA CTR",
          numerator: intersectCount(views, commission),
          denominator: views.size,
          description: "Phiên nhấp đặt tranh / phiên xem trang",
        },
        {
          label: "Form Start Rate",
          numerator: intersectCount(commission, starts),
          denominator: commission.size,
          description: "Phiên nhấp CTA và bắt đầu / phiên nhấp CTA",
        },
        {
          label: "Form Completion Rate",
          numerator: intersectCount(starts, submitted),
          denominator: starts.size,
          description: "Phiên bắt đầu và gửi / phiên bắt đầu",
        },
      ],
    };
  }, [events]);

  function clearEvents() {
    if (
      !window.confirm(
        "Xóa toàn bộ sự kiện thử nghiệm trên trình duyệt này? Thao tác này không xóa các yêu cầu đặt tranh đã lưu.",
      )
    )
      return;
    clearAnalyticsEvents();
    setNotice("Đã xóa các sự kiện thử nghiệm.");
  }

  function exportEvents() {
    const quote = (value: string | number | undefined) =>
      `"${String(value ?? "").replaceAll('"', '""')}"`;
    const rows = [
      ["timestamp", "event", "source", "artwork_id", "session_id"],
      ...events.map((event) => [
        event.timestamp,
        event.name,
        event.metadata.source,
        event.metadata.artworkId,
        event.sessionId,
      ]),
    ];
    const blob = new Blob(
      ["\uFEFF", rows.map((row) => row.map(quote).join(",")).join("\r\n")],
      { type: "text/csv;charset=utf-8;" },
    );
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `dart-events-${new Date().toISOString().slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
    setNotice("Đã xuất dữ liệu sự kiện CSV.");
  }

  return (
    <main className="analytics-shell">
      <div className="analytics-topline">
        <Link href="/" className="analytics-wordmark" aria-label="Trở về DART">
          DART<span>®</span>
        </Link>
        <span className="analytics-badge">DEVELOPMENT ONLY</span>
      </div>
      <header className="analytics-header">
        <p className="analytics-eyebrow">DART / CONVERSION LAB</p>
        <h1>Nhìn lại những kết nối.</h1>
        <p>
          Hiểu cách khách khám phá tác phẩm và bắt đầu một câu chuyện cùng DART.
        </p>
      </header>
      <div className="analytics-notice">
        Dữ liệu thử nghiệm chỉ nằm trong trình duyệt này, tối đa{" "}
        {MAX_ANALYTICS_EVENTS} sự kiện gần nhất. Đây không phải báo cáo toàn bộ
        khách truy cập. Trang này không khả dụng trong bản production.
      </div>
      <div className="analytics-toolbar">
        <p>
          {ready ? `${events.length} sự kiện đang lưu` : "Đang đọc dữ liệu…"}
        </p>
        <div className="analytics-actions">
          <button
            onClick={() => {
              refreshAnalyticsEvents();
              setNotice("Đã làm mới dữ liệu.");
            }}
          >
            Làm mới
          </button>
          <button onClick={exportEvents} disabled={!events.length}>
            Xuất CSV
          </button>
          <button
            className="analytics-clear"
            onClick={clearEvents}
            disabled={!events.length}
          >
            Xóa sự kiện
          </button>
        </div>
      </div>
      <p className="analytics-live" role="status" aria-live="polite">
        {notice}
      </p>
      <section className="analytics-cards" aria-label="Chỉ số tương tác">
        {summary.cards.map((card) => (
          <article className="analytics-card" key={card.label}>
            <h2>{card.label}</h2>
            <strong>{ready ? card.value.toLocaleString("vi-VN") : "—"}</strong>
            <p>{card.detail}</p>
          </article>
        ))}
      </section>
      <section
        className="analytics-funnel"
        aria-labelledby="analytics-funnel-title"
      >
        <div className="analytics-section-heading">
          <div>
            <p className="analytics-eyebrow">FROM CURIOSITY TO CONNECTION</p>
            <h2 id="analytics-funnel-title">Hiệu quả chuyển đổi</h2>
          </div>
          <p>
            Mỗi phiên được tính một lần ở mỗi bước. Tỷ lệ chỉ tính những phiên
            có cả hai sự kiện tương ứng trong dữ liệu đang lưu.
          </p>
        </div>
        <div className="analytics-rates">
          {summary.rates.map((rate) => (
            <article className="analytics-rate" key={rate.label}>
              <h3>{rate.label}</h3>
              <strong>{formatRate(rate.numerator, rate.denominator)}</strong>
              <div className="analytics-bar" aria-hidden="true">
                <span
                  style={{
                    width: `${rate.denominator ? (rate.numerator / rate.denominator) * 100 : 0}%`,
                  }}
                />
              </div>
              <p>{rate.description}</p>
              <small>
                {rate.numerator} / {rate.denominator} phiên
              </small>
            </article>
          ))}
        </div>
      </section>
      <section
        className="analytics-events"
        aria-labelledby="analytics-events-title"
      >
        <div className="analytics-section-heading">
          <h2 id="analytics-events-title">Những tương tác gần đây</h2>
          <p>50 sự kiện mới nhất · thời gian tại thiết bị của bạn</p>
        </div>
        {events.length ? (
          <div
            className="analytics-table-scroll"
            role="region"
            aria-label="Bảng sự kiện, có thể cuộn ngang"
            tabIndex={0}
          >
            <table>
              <thead>
                <tr>
                  <th scope="col">Thời gian</th>
                  <th scope="col">Sự kiện</th>
                  <th scope="col">Vị trí</th>
                  <th scope="col">Tác phẩm</th>
                  <th scope="col">Phiên</th>
                </tr>
              </thead>
              <tbody>
                {[...events]
                  .reverse()
                  .slice(0, 50)
                  .map((event) => (
                    <tr key={event.id}>
                      <td>
                        <time dateTime={event.timestamp}>
                          {new Date(event.timestamp).toLocaleString("vi-VN")}
                        </time>
                      </td>
                      <td>
                        <code>{event.name}</code>
                      </td>
                      <td>{event.metadata.source || "—"}</td>
                      <td>{event.metadata.artworkId || "—"}</td>
                      <td title={event.sessionId}>
                        <code>{event.sessionId.slice(0, 8)}</code>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="analytics-empty">
            <span aria-hidden="true">↗</span>
            <h3>Mọi câu chuyện đều có điểm bắt đầu.</h3>
            <p>
              Mở trang DART, khám phá một tác phẩm hoặc thử gửi yêu cầu đặt
              tranh. Tương tác sẽ xuất hiện tại đây.
            </p>
            <Link href="/">
              Khám phá DART <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>
      <footer className="analytics-footer">
        <Link href="/">← Trở lại phòng tranh</Link>
        <p>Không lưu thông tin cá nhân trong sự kiện phân tích.</p>
      </footer>
      <style jsx>{`
        .analytics-shell {
          min-height: 100vh;
          padding: 32px max(24px, calc((100vw - 1320px) / 2));
          color: #28251f;
          background: #f7f5ef;
          font-family: Arial, sans-serif;
        }
        .analytics-topline,
        .analytics-toolbar,
        .analytics-section-heading,
        .analytics-footer {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: center;
        }
        .analytics-topline {
          padding-bottom: 28px;
          border-bottom: 1px solid #dcd7ce;
        }
        .analytics-wordmark {
          color: #28251f;
          font:
            38px Georgia,
            serif;
          text-decoration: none;
          letter-spacing: -2px;
        }
        .analytics-wordmark span {
          vertical-align: top;
          font-size: 12px;
          letter-spacing: 0;
          margin-left: 4px;
        }
        .analytics-badge {
          border: 1px solid #c8b4b4;
          color: #702e39;
          padding: 9px 12px;
          font-size: 9px;
          letter-spacing: 1.7px;
        }
        .analytics-header {
          margin: 64px 0 32px;
        }
        .analytics-eyebrow {
          font-size: 10px;
          letter-spacing: 2px;
          color: #702e39;
          font-weight: 600;
          margin-bottom: 16px;
        }
        .analytics-header h1 {
          font:
            400 clamp(36px, 4vw, 60px) / 1.15 Georgia,
            serif;
          margin: 0 0 18px;
        }
        .analytics-header > p:last-child {
          color: #676056;
          font-size: 14px;
          line-height: 1.8;
          max-width: 650px;
        }
        .analytics-notice {
          background: #ece8df;
          border-left: 2px solid #702e39;
          padding: 17px 22px;
          line-height: 1.75;
          font-size: 12px;
          color: #625b51;
        }
        .analytics-toolbar {
          margin-top: 30px;
        }
        .analytics-toolbar > p {
          font-size: 12px;
          color: #676056;
        }
        .analytics-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }
        .analytics-actions button {
          padding: 12px 17px;
          font-size: 11px;
          border: 1px solid #cec8be;
          background: transparent;
          color: #28251f;
          cursor: pointer;
          transition: background 0.2s;
          min-height: 44px;
        }
        .analytics-actions button:hover:not(:disabled) {
          background: #e8e3d9;
        }
        .analytics-actions button.analytics-clear {
          color: #702e39;
        }
        .analytics-actions button:disabled {
          opacity: 0.4;
          cursor: default;
        }
        .analytics-actions button:focus-visible,
        .analytics-table-scroll:focus-visible {
          outline: 2px solid #702e39;
          outline-offset: 4px;
        }
        .analytics-live {
          font-size: 12px;
          color: #702e39;
          min-height: 18px;
          margin: 8px 0 18px;
        }
        .analytics-cards {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
        }
        .analytics-card {
          border: 1px solid #dcd7ce;
          padding: 26px;
        }
        .analytics-card h2 {
          font:
            400 12px/1.5 Arial,
            sans-serif;
          color: #676056;
          margin: 0 0 19px;
        }
        .analytics-card strong {
          font:
            400 48px/1 Georgia,
            serif;
        }
        .analytics-card p {
          font-size: 10px;
          color: #80776b;
          margin: 18px 0 0;
        }
        .analytics-funnel,
        .analytics-events {
          margin-top: 70px;
        }
        .analytics-section-heading {
          align-items: flex-end;
          margin-bottom: 25px;
        }
        .analytics-section-heading h2 {
          font:
            400 30px/1.2 Georgia,
            serif;
          margin: 0;
        }
        .analytics-section-heading > p {
          max-width: 370px;
          font-size: 11px;
          line-height: 1.7;
          color: #776e62;
          margin: 0;
        }
        .analytics-rates {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          border-top: 1px solid #dcd7ce;
          border-bottom: 1px solid #dcd7ce;
        }
        .analytics-rate {
          padding: 26px 22px;
          border-right: 1px solid #dcd7ce;
        }
        .analytics-rate:first-child {
          padding-left: 0;
        }
        .analytics-rate:last-child {
          padding-right: 0;
          border-right: 0;
        }
        .analytics-rate h3 {
          font:
            400 12px/1.5 Arial,
            sans-serif;
          margin: 0 0 22px;
        }
        .analytics-rate strong {
          font:
            400 38px/1 Georgia,
            serif;
          color: #702e39;
        }
        .analytics-bar {
          height: 3px;
          background: #e3ded4;
          margin: 23px 0 16px;
        }
        .analytics-bar span {
          display: block;
          height: 100%;
          background: #702e39;
        }
        .analytics-rate p {
          font-size: 10px;
          line-height: 1.7;
          color: #676056;
          min-height: 34px;
          margin: 0 0 10px;
        }
        .analytics-rate small {
          color: #80776b;
          font-size: 10px;
        }
        .analytics-table-scroll {
          max-width: 100%;
          overflow-x: auto;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          text-align: left;
          font-size: 11px;
        }
        th {
          background: #ece8df;
          color: #676056;
          font-weight: 400;
          padding: 15px;
        }
        td {
          padding: 16px 15px;
          border-bottom: 1px solid #e3ded4;
          white-space: nowrap;
        }
        td code {
          font-size: 10px;
        }
        .analytics-empty {
          border: 1px solid #dcd7ce;
          text-align: center;
          padding: 56px 24px;
        }
        .analytics-empty > span {
          color: #702e39;
          font:
            32px Georgia,
            serif;
        }
        .analytics-empty h3 {
          font:
            400 25px/1.4 Georgia,
            serif;
          margin: 17px 0 12px;
        }
        .analytics-empty p {
          max-width: 440px;
          margin: 0 auto 23px;
          color: #776e62;
          font-size: 12px;
          line-height: 1.8;
        }
        .analytics-empty a,
        .analytics-footer a {
          color: #702e39;
          font-size: 12px;
          text-decoration: underline;
          text-underline-offset: 5px;
        }
        .analytics-footer {
          margin: 50px 0 15px;
          font-size: 10px;
          color: #80776b;
        }
        @media (max-width: 800px) {
          .analytics-cards {
            grid-template-columns: repeat(2, 1fr);
          }
          .analytics-rates {
            grid-template-columns: repeat(2, 1fr);
          }
          .analytics-rate {
            padding: 24px !important;
          }
          .analytics-rate:nth-child(2) {
            border-right: 0;
          }
          .analytics-rate:nth-child(-n + 2) {
            border-bottom: 1px solid #dcd7ce;
          }
          .analytics-section-heading {
            flex-direction: column;
            align-items: flex-start;
            gap: 14px;
          }
          .analytics-section-heading > p {
            max-width: 100%;
          }
        }
        @media (max-width: 480px) {
          .analytics-shell {
            padding: 22px 20px;
          }
          .analytics-header {
            margin-top: 44px;
          }
          .analytics-toolbar {
            align-items: flex-start;
            flex-direction: column;
            gap: 12px;
          }
          .analytics-actions {
            width: 100%;
          }
          .analytics-actions button {
            flex: 1;
            padding: 10px 8px;
          }
          .analytics-cards {
            gap: 10px;
          }
          .analytics-card {
            padding: 18px 15px;
          }
          .analytics-card strong {
            font-size: 40px;
          }
          .analytics-card p {
            line-height: 1.7;
          }
          .analytics-rate {
            padding: 22px 15px !important;
          }
          .analytics-funnel,
          .analytics-events {
            margin-top: 45px;
          }
          .analytics-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }
        }
      `}</style>
    </main>
  );
}
