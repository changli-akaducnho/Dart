import assert from "node:assert/strict";
import { EventEmitter } from "node:events";
import { test } from "node:test";
import tls, { type TLSSocket } from "node:tls";
import { getGmailSocket, mailFailure } from "../src/lib/studio-mail";

class FakeSocket extends EventEmitter {
  destroyed = false;
  destroy() { this.destroyed = true; this.emit("close"); }
}

test("Gmail socket uses hostname/SNI and verified TLS, handing off only after secureConnect", (t) => {
  const socket = new FakeSocket();
  const connect = t.mock.method(tls, "connect", () => socket as unknown as TLSSocket);
  const callback = t.mock.fn();
  getGmailSocket({}, callback);
  assert.equal(callback.mock.callCount(), 0);
  assert.deepEqual(connect.mock.calls[0].arguments[0], {
    host: "smtp.gmail.com", port: 465, servername: "smtp.gmail.com", rejectUnauthorized: true,
  });
  socket.emit("secureConnect");
  assert.equal(callback.mock.callCount(), 1);
  assert.equal(callback.mock.calls[0].arguments[0], null);
  assert.equal(callback.mock.calls[0].arguments[1].connection, socket);
  assert.equal(callback.mock.calls[0].arguments[1].secured, true);
  socket.emit("error", new Error("late teardown"));
  socket.emit("close");
  assert.equal(callback.mock.callCount(), 1);
});

test("failed or closed TLS sockets fail once and do not proceed to SMTP authentication", (t) => {
  const socket = new FakeSocket();
  t.mock.method(tls, "connect", () => socket as unknown as TLSSocket);
  const callback = t.mock.fn();
  getGmailSocket({}, callback);
  socket.emit("error", Object.assign(new Error("connection failed"), { code: "ESOCKET" }));
  socket.emit("secureConnect");
  assert.equal(socket.destroyed, true);
  assert.equal(callback.mock.callCount(), 1);
  assert.equal(callback.mock.calls[0].arguments[0].code, "ESOCKET");
});

test("TLS connection timeout closes the socket and rejects once", (t) => {
  t.mock.timers.enable({ apis: ["setTimeout"] });
  const socket = new FakeSocket();
  t.mock.method(tls, "connect", () => socket as unknown as TLSSocket);
  const callback = t.mock.fn();
  getGmailSocket({}, callback);
  t.mock.timers.tick(10000);
  assert.equal(socket.destroyed, true);
  assert.equal(callback.mock.callCount(), 1);
  assert.equal(callback.mock.calls[0].arguments[0].code, "ETIMEDOUT");
});

test("mail diagnostics distinguish authentication and connection errors without exposing SMTP data", (t) => {
  const log = t.mock.method(console, "error", () => {});
  const error = { code: "EAUTH", responseCode: 535, command: "AUTH PLAIN", message: "private-password customer@example.test", response: "private SMTP response" };
  const result = mailFailure(error, "booking", "DART-test");
  assert.equal(result.code, "MAIL_AUTH_FAILED");
  assert.match(result.error, /MAIL_AUTH_FAILED/);
  assert.equal(result.requestId, "DART-test");
  const logged = JSON.stringify(log.mock.calls[0].arguments);
  assert.ok(!logged.includes("private"));
  assert.ok(!logged.includes("customer@example.test"));
  assert.equal(mailFailure({ code: "ESOCKET", command: "CONN" }, "review", "REVIEW-test").code, "MAIL_CONNECTION_FAILED");
  mailFailure({ code: "secret-value", command: "MAIL FROM customer@example.test", responseCode: "private" }, "review", "REVIEW-test");
  assert.ok(!JSON.stringify(log.mock.calls[2].arguments).includes("secret-value"));
  assert.ok(!JSON.stringify(log.mock.calls[2].arguments).includes("customer@example.test"));
});
