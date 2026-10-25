import { createServer } from "node:net";
import { afterEach, describe, expect, it, vi } from "vitest";

/*
 * Section 11 — the mailer itself. The route tests mock this module, so these
 * cases cover the part they skip: a real SMTP conversation against a local
 * stub, and the failure path the patient never sees.
 */

const stub = { server: null, port: 0, message: "" };

function startStub() {
  return new Promise((resolve) => {
    const server = createServer((socket) => {
      socket.setEncoding("utf8");
      let buffer = "";
      let inData = false;

      socket.write("220 stub ESMTP\r\n");

      socket.on("data", (chunk) => {
        buffer += chunk;

        for (;;) {
          if (inData) {
            const end = buffer.indexOf("\r\n.\r\n");
            if (end === -1) return;
            stub.message = buffer.slice(0, end);
            buffer = buffer.slice(end + 5);
            inData = false;
            socket.write("250 2.0.0 Ok: queued\r\n");
            continue;
          }

          const lineEnd = buffer.indexOf("\r\n");
          if (lineEnd === -1) return;
          const line = buffer.slice(0, lineEnd);
          buffer = buffer.slice(lineEnd + 2);

          const command = line.split(" ")[0].toUpperCase();
          if (command === "EHLO" || command === "HELO") {
            socket.write("250-stub\r\n250-AUTH PLAIN\r\n250 SIZE 10485760\r\n");
          } else if (command === "AUTH") {
            socket.write("235 2.7.0 Authentication successful\r\n");
          } else if (command === "MAIL" || command === "RCPT") {
            socket.write("250 2.1.0 Ok\r\n");
          } else if (command === "DATA") {
            inData = true;
            socket.write("354 End data with <CR><LF>.<CR><LF>\r\n");
          } else if (command === "QUIT") {
            socket.write("221 2.0.0 Bye\r\n");
            socket.end();
          } else {
            socket.write("250 2.0.0 Ok\r\n");
          }
        }
      });

      socket.on("error", () => {});
    });

    server.listen(0, "127.0.0.1", () => {
      stub.server = server;
      stub.port = server.address().port;
      resolve();
    });
  });
}

async function loadMailer({ port }) {
  process.env.MAIL_ENABLED = "true";
  process.env.SMTP_HOST = "127.0.0.1";
  process.env.SMTP_PORT = String(port);
  process.env.SMTP_USER = "clinic@example.com";
  process.env.SMTP_PASS = "test-password";
  process.env.MAIL_TO = "info@sakthidentalclinic.in";

  return import("../src/services/mail.service.js");
}

afterEach(async () => {
  if (stub.server) {
    await new Promise((resolve) => stub.server.close(resolve));
    stub.server = null;
  }
  stub.message = "";
});

describe("sendContactNotification", () => {
  it("delivers the enquiry to the clinic inbox", async () => {
    await startStub();
    const { sendContactNotification } = await loadMailer({ port: stub.port });

    const sent = await sendContactNotification({
      name: "Meera S.",
      email: "meera@example.com",
      phone: "9862890897",
      message: "I would like to book a cleaning for my daughter.",
    });

    expect(sent).toBe(true);
    const body = stub.message.replace(/\r\n/g, "\n");
    expect(body).toContain("To: info@sakthidentalclinic.in");
    expect(body).toContain("Reply-To: meera@example.com");
    expect(body).toContain("Subject: New website enquiry from Meera S.");
    expect(body).toContain("Phone: 9862890897");
    expect(body).toContain("Message:\nI would like to book a cleaning for my daughter.");
  });

  it("reports failure instead of throwing when SMTP refuses the connection", async () => {
    const { sendContactNotification } = await loadMailer({ port: 1 });

    await expect(
      sendContactNotification({
        name: "Meera S.",
        email: "meera@example.com",
        phone: "9862890897",
        message: "",
      }),
    ).resolves.toBe(false);
  });

  it("does nothing at all in the showcase build", async () => {
    vi.resetModules();
    process.env.MAIL_ENABLED = "false";

    const { sendContactNotification } = await import("../src/services/mail.service.js");
    const sent = await sendContactNotification({
      name: "Meera S.",
      email: "meera@example.com",
      phone: "9862890897",
      message: "",
    });

    expect(sent).toBe(false);
    expect(stub.message).toBe("");

    process.env.MAIL_ENABLED = "true";
    vi.resetModules();
  });
});
