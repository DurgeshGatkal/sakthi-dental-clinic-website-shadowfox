import request from "supertest";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

/* A mail failure must never fail the patient's submission (section 11). */
vi.mock("../src/services/mail.service.js", () => ({
  sendContactNotification: vi.fn().mockResolvedValue(false),
}));

const { createApp } = await import("../src/app.js");
const { default: ContactMessage } = await import("../src/models/ContactMessage.js");
const { resetDb, startDb, stopDb } = await import("./helpers/db.js");

const validEnquiry = {
  name: "Arun Kumar",
  email: "arun@example.com",
  phone: "9876543210",
  message: "Please call me back.",
};

let app;

beforeAll(async () => {
  process.env.NODE_ENV = "test";
  await startDb();
});

afterAll(async () => {
  await stopDb();
});

beforeEach(async () => {
  await resetDb();
  app = createApp();
});

describe("POST /api/v1/contact when email fails", () => {
  it("still returns 201 and keeps emailNotified false", async () => {
    const res = await request(app).post("/api/v1/contact").send(validEnquiry).expect(201);

    expect(res.body.success).toBe(true);

    const saved = await ContactMessage.findById(res.body.data.id).lean();
    expect(saved.emailNotified).toBe(false);
    expect(await ContactMessage.countDocuments()).toBe(1);
  });
});
